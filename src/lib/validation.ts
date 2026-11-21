import { z } from "zod";
import { serviceSlugs } from "@/content/services";

// Checked on the server for every inquiry (src/app/api/inquiries/route.ts).
export const inquirySchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  company: z.string().trim().max(150).optional().or(z.literal("")),
  service: z.enum(["", "other", ...serviceSlugs] as [string, ...string[]]).optional(),
  message: z.string().trim().min(1).max(2000),
  // Optional extras, kept so older forms still validate
  budget: z.string().max(60).optional().or(z.literal("")),
  timeline: z.string().max(60).optional().or(z.literal("")),
  // Honeypot: real people leave this empty
  website: z.string().max(0).optional().or(z.literal("")),
  source: z.string().max(200).optional(),
});

export type InquiryInput = z.infer<typeof inquirySchema>;
