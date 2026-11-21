import type { Locale } from "@/lib/i18n";

// All service content, English and Arabic. Add a service by adding an entry:
// it gets a card on the home and services pages, its own page at /services/<slug>
// (and /ar/services/<slug>), and an option in the inquiry form.
//
// Photos: drop a file at public/images/services/<slug>.jpg and it replaces the
// illustration automatically. Without a photo the themed illustration is shown.

export type ServiceIcon = "managed" | "apps" | "web" | "finance" | "crm" | "erp" | "stock" | "factory";

type ServiceText = { title: string; short: string; intro: string; features: string[] };

type ServiceEntry = ServiceText & { slug: string; icon: ServiceIcon; ar: ServiceText };

export type Service = ServiceText & { slug: string; icon: ServiceIcon };

const entries: ServiceEntry[] = [
  {
    slug: "software-applications", icon: "apps", title: "Software Applications",
    short: "Android, iOS and Windows apps built for automation.",
    intro: "We design and build native and cross-platform applications for Android, iOS and Windows that automate repetitive work and connect your teams.",
    features: ["Android and iOS mobile apps", "Windows desktop applications", "Workflow and task automation", "Integration with your existing systems"],
    ar: { title: "تطبيقات البرامج", short: "تطبيقات أندرويد و iOS وويندوز معمولة للأتمتة.", intro: "بنصمم ونبني تطبيقات لأندرويد و iOS وويندوز بتخلّص الشغل المتكرر وتربط فرقك ببعض.", features: ["تطبيقات موبايل أندرويد و iOS", "برامج ويندوز للكمبيوتر", "أتمتة الشغل والمهام", "ربط مع أنظمتك الحالية"] },
  },
  {
    slug: "web-development", icon: "web", title: "Web Development",
    short: "Design, build and host fast, modern websites.",
    intro: "From design to launch, we build websites and web platforms, hosted in the cloud or on your own servers.",
    features: ["UI and UX design", "Custom website and web app development", "Cloud hosting", "Self-hosted deployment"],
    ar: { title: "تطوير المواقع", short: "نصمم ونبني ونستضيف مواقع سريعة وحديثة.", intro: "من التصميم لحد الإطلاق، بنعمل مواقع ومنصات ويب، على الكلاود أو على سيرفراتك.", features: ["تصميم الواجهات وتجربة المستخدم", "برمجة مواقع وتطبيقات ويب", "استضافة على الكلاود", "تشغيل على سيرفراتك الخاصة"] },
  },
  {
    slug: "financial-systems", icon: "finance", title: "Financial Systems",
    short: "Accounting, invoicing and reporting you can trust.",
    intro: "Accurate, secure financial systems that give you real-time visibility of your money.",
    features: ["Accounting and ledgers", "Invoicing and payments", "Financial dashboards", "Audit-ready reports"],
    ar: { title: "الأنظمة المالية", short: "حسابات وفواتير وتقارير تقدر تعتمد عليها.", intro: "أنظمة مالية دقيقة وآمنة تخليك شايف فلوسك لحظة بلحظة.", features: ["الحسابات والدفاتر", "الفواتير والمدفوعات", "لوحات متابعة مالية", "تقارير جاهزة للمراجعة"] },
  },
  {
    slug: "crm", icon: "crm", title: "CRM",
    short: "Manage customers, leads and sales in one place.",
    intro: "A CRM shaped around how your team sells and supports customers.",
    features: ["Lead and pipeline tracking", "Customer history", "Sales reports", "Email and follow-up automation"],
    ar: { title: "نظام إدارة العملاء CRM", short: "إدارة العملاء والفرص والمبيعات في مكان واحد.", intro: "نظام CRM متفصّل على طريقة فريقك في البيع وخدمة العملاء.", features: ["متابعة العملاء المحتملين والصفقات", "تاريخ كل عميل", "تقارير المبيعات", "أتمتة الإيميلات والمتابعة"] },
  },
  {
    slug: "erp", icon: "erp", title: "ERP",
    short: "Connect every department in one system.",
    intro: "Enterprise resource planning that ties together finance, HR, purchasing, sales and operations.",
    features: ["Finance, HR and purchasing modules", "Unified company data", "Role-based access", "Custom modules for your business"],
    ar: { title: "نظام تخطيط الموارد ERP", short: "كل أقسام شركتك في نظام واحد.", intro: "نظام ERP بيربط الحسابات والموارد البشرية والمشتريات والمبيعات والتشغيل.", features: ["موديولات حسابات وموارد بشرية ومشتريات", "بيانات الشركة كلها في مكان واحد", "صلاحيات حسب الدور", "موديولات مخصوصة لشغلك"] },
  },
  {
    slug: "stock-application", icon: "stock", title: "Stock Application",
    short: "Real-time inventory and warehouse control.",
    intro: "Know exactly what you have, where it is, and when to reorder.",
    features: ["Real-time stock levels", "Barcode scanning", "Multi-warehouse support", "Low-stock alerts"],
    ar: { title: "نظام المخازن", short: "متابعة المخزون والمخازن لحظة بلحظة.", intro: "اعرف عندك إيه بالظبط، فين، وإمتى تطلب تاني.", features: ["مستوى المخزون لحظيًا", "قراءة الباركود", "أكتر من مخزن", "تنبيه لما الكمية تقل"] },
  },
  {
    slug: "factory-automation", icon: "factory", title: "Factory Automation",
    short: "Smarter production lines and machine monitoring.",
    intro: "We connect machines, sensors and people to make production faster, safer and measurable.",
    features: ["Production line monitoring", "Machine data collection", "Quality control tracking", "Maintenance scheduling"],
    ar: { title: "أتمتة المصانع", short: "خطوط إنتاج أذكى ومتابعة للماكينات.", intro: "بنربط الماكينات والحساسات والناس عشان الإنتاج يبقى أسرع وأأمن ويتقاس.", features: ["متابعة خطوط الإنتاج", "تجميع بيانات الماكينات", "متابعة الجودة", "جدولة الصيانة"] },
  },
  {
    slug: "managed-it-services", icon: "managed", title: "Managed IT Services",
    short: "We run and protect your IT so you can focus on business.",
    intro: "Proactive monitoring, support and security for your servers, network and devices.",
    features: ["24/7 monitoring", "Helpdesk support", "Backup and disaster recovery", "Network and cyber security"],
    ar: { title: "خدمات IT المُدارة", short: "إحنا نشغّل ونحمي الـ IT بتاعك وإنت ركّز في شغلك.", intro: "متابعة ودعم وحماية لسيرفراتك وشبكتك وأجهزتك قبل ما المشكلة تحصل.", features: ["متابعة 24/7", "دعم فني (هيلب ديسك)", "باك أب واسترجاع عند الكوارث", "حماية الشبكة والأمن السيبراني"] },
  },
];

export const serviceSlugs = entries.map((s) => s.slug);

export function getServices(locale: Locale): Service[] {
  return entries.map(({ ar, ...en }) => (locale === "ar" ? { ...en, ...ar } : en));
}

export function getService(slug: string, locale: Locale): Service | undefined {
  return getServices(locale).find((s) => s.slug === slug);
}
