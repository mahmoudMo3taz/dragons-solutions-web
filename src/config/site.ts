// Company-wide settings. Translated text lives in src/content/dictionary.ts.
export const site = {
  name: "Dragons Solutions",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  // TODO: replace with your real contact details
  email: "hello@dragonssolutions.com",
  phone: "+971 50 000 0000",
  whatsapp: "971500000000", // digits only, used for wa.me links
} as const;

export const navItems = [
  { path: "/services", key: "services" },
  { path: "/about", key: "about" },
  { path: "/inquiries", key: "inquiries" },
] as const;
