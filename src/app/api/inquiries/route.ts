import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { inquirySchema } from "@/lib/validation";
import { notifyNewInquiry } from "@/lib/notify";

export const dynamic = "force-dynamic";

// Simple in-memory rate limit: 5 inquiries per IP per 10 minutes.
// Replace with Redis or your gateway's limiter when you run more than one server.
const hits = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_HITS = 5;

function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_HITS;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (limited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please try again in a few minutes." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  const parsed = inquirySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Please check the form", fields: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const data = parsed.data;
  // Honeypot filled in: pretend success, store nothing
  if (data.website) return NextResponse.json({ ok: true, id: "ignored" });

  try {
    const inquiry = await prisma.inquiry.create({
      data: {
        name: data.name,
        company: data.company || null,
        email: data.email,
        phone: data.phone || null,
        service: data.service || "general",
        budget: data.budget || null,
        timeline: data.timeline || null,
        message: data.message,
        source: data.source ?? null,
        ip,
        userAgent: req.headers.get("user-agent")?.slice(0, 300) ?? null,
      },
      select: { id: true },
    });
    await notifyNewInquiry(inquiry.id, data);
    return NextResponse.json({ ok: true, id: inquiry.id }, { status: 201 });
  } catch (err) {
    console.error("[inquiry] save failed", err);
    return NextResponse.json(
      { ok: false, error: "We could not save your inquiry. Please email us directly." },
      { status: 500 },
    );
  }
}
