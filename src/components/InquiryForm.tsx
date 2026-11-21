"use client";

import { useState, type FormEvent } from "react";
import type { Dictionary } from "@/content/dictionary";
import { Dragon } from "./dragon/Dragon";

type Option = { slug: string; title: string };

const field =
  "w-full rounded-md border border-input bg-card px-4 py-3 text-sm text-card-foreground outline-none transition-shadow placeholder:text-muted-foreground focus:ring-2 focus:ring-ring";

export function InquiryForm({ services, defaultService, t }: { services: Option[]; defaultService?: string; t: Dictionary }) {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;

    // Quick checks in the browser; the server validates again
    if (!fd.name?.trim()) return setError(t.errName);
    if (!/^\S+@\S+\.\S+$/.test(fd.email ?? "")) return setError(t.errEmail);
    if (!fd.message?.trim()) return setError(t.errMsg);

    setError(null);
    setSending(true);
    // Keep the fire-breathing loader up for at least a moment so it never just flickers
    const minWait = new Promise((r) => setTimeout(r, 1400));
    try {
      const req = fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...fd, source: window.location.pathname + window.location.search }),
      });
      const [res] = await Promise.all([req, minWait]);
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.ok) {
        setSent(true);
      } else {
        setError(res.status === 429 ? t.errRate : t.errToast);
      }
    } catch {
      setError(t.errNetwork);
    }
    setSending(false);
  }

  if (sent) {
    return (
      <div className="flex flex-col items-start gap-2 rounded-lg border-s-4 border-dragon bg-card p-10 text-card-foreground sm:flex-row sm:items-center sm:gap-6">
        <div className="h-36 w-44 shrink-0">
          <Dragon mode="idle" />
        </div>
        <div>
          <h3 className="text-2xl">{t.thanks}</h3>
          <p className="mt-2 text-muted-foreground">{t.thanksSub}</p>
          <button onClick={() => setSent(false)} className="mt-6 font-semibold text-primary">
            {t.another}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="relative grid gap-4 rounded-lg bg-card p-8 shadow-hover sm:grid-cols-2">
      {sending && (
        <div role="status" className="absolute inset-0 z-10 grid place-content-center justify-items-center rounded-lg bg-card/95">
          <div className="h-56 w-[22rem] max-w-[85vw]">
            <Dragon mode="fire" />
          </div>
          <p className="text-sm text-muted-foreground">{t.sendingNote}</p>
        </div>
      )}
      {error && (
        <p role="alert" className="rounded-md border border-dragon/40 bg-dragon/10 px-4 py-3 text-sm text-dragon sm:col-span-2">
          {error}
        </p>
      )}
      <input name="name" placeholder={t.fName} aria-label={t.fName} className={field} maxLength={100} required autoComplete="name" />
      <input name="email" type="email" placeholder={t.fEmail} aria-label={t.fEmail} className={field} maxLength={255} required autoComplete="email" dir="ltr" style={{ textAlign: "start" }} />
      <input name="phone" type="tel" placeholder={t.fPhone} aria-label={t.fPhone} className={field} maxLength={40} autoComplete="tel" />
      <input name="company" placeholder={t.fCompany} aria-label={t.fCompany} className={field} maxLength={150} autoComplete="organization" />
      <select name="service" defaultValue={defaultService ?? ""} aria-label={t.fService} className={`${field} sm:col-span-2`}>
        <option value="">{t.fService}</option>
        {services.map((s) => (
          <option key={s.slug} value={s.slug}>{s.title}</option>
        ))}
      </select>
      <textarea name="message" placeholder={t.fMessage} aria-label={t.fMessage} rows={6} className={`${field} sm:col-span-2`} maxLength={2000} required />
      {/* Honeypot: hidden from people, bots fill it in */}
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden className="absolute h-px w-px overflow-hidden opacity-0 [clip-path:inset(50%)]" />
      <button
        disabled={sending}
        className="rounded-btn bg-dragon px-6 py-3 font-semibold text-dragon-foreground transition-opacity hover:opacity-90 disabled:opacity-60 sm:col-span-2"
      >
        {sending ? t.sending : t.sendInquiry}
      </button>
    </form>
  );
}
