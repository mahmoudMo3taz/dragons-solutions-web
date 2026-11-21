# Dragons Solutions website

Next.js 15 + TypeScript + Tailwind CSS 4 + Prisma. English and Arabic (right-to-left), four
switchable designs, a 3D dragon mascot, and an inquiry form that saves to your own database.
The design and content come from the Lovable prototype, rebuilt here with no Lovable code,
hosting or services.

## Run it on Windows

1. Install **Node.js 20 or 22 LTS** from https://nodejs.org.
2. Open PowerShell in this folder:
   ```powershell
   cd F:\DragonsSolutions\dragons-solutions-web
   copy .env.example .env
   npm install
   npm run db:push
   npm run dev
   ```
3. Open http://localhost:3000 (English) or http://localhost:3000/ar (Arabic).

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server with live reload |
| `npm run build` then `npm start` | Production build and server |
| `npm run db:studio` | Browse the database and every inquiry |
| `npm run export:models` | Re-export the dragon as .glb files |

## The four designs

Use the **Design** button in the header (palette icon). The choice is saved in a cookie.

| Theme | Look | Dragon |
| --- | --- | --- |
| Night (default) | Navy, electric blue, dragon red, silver wordmark | Blue |
| Daylight | Bright white, red actions, blue accents | Red |
| Ember | Warm black, fire orange and gold, sharp corners | Gold |
| Jade | Cream, emerald header, amber accents, round buttons | Green |

Each theme is one block of variables in `src/app/globals.css` (`[data-theme="..."]`): colours,
fonts, corner radius, header and hero colours, card shadows and the illustration colours.
Change the default in `src/lib/themes.ts`.

## Photos

The Lovable prototype's photos were stored on Lovable's servers, so they are not included.
Until you add photos, every service shows an illustration that matches the active design,
and the home hero shows the dragon. Drop files here and they appear automatically, no code
changes:

```
public/images/hero.jpg                      home and services page background
public/images/about.jpg                     about page background
public/images/inquiries.jpg                 inquiries page background
public/images/services/<slug>.jpg           one per service, for example:
  software-applications.jpg  web-development.jpg  financial-systems.jpg  crm.jpg
  erp.jpg  stock-application.jpg  factory-automation.jpg  managed-it-services.jpg
```

## Dragon mascot

```tsx
import { Dragon } from "@/components/dragon/Dragon";
<Dragon mode="walk" />                 // colour follows the active design
<Dragon color="purple" mode="fire" />  // or pick one: blue, red, green, gold, purple
```

Modes: `idle`, `walk`, `fire`, `fly`. On the site he sits in the home hero (click him to
breathe fire), walks along the footer, breathes fire while an inquiry sends, and waits on the
thank-you message. Preview everything at http://localhost:3000/dragon. `.glb` model files for
each colour are in `public/models/`.

## Structure

```
src/
├─ app/
│  ├─ layout.tsx              Header, footer, fonts, language and theme on <html>
│  ├─ page.tsx                Home
│  ├─ about/  services/  services/[slug]/  inquiries/  dragon/
│  ├─ api/inquiries/          Saves inquiries to the database
│  ├─ api/health/             Uptime check
│  └─ globals.css             Tailwind setup and the four themes
├─ components/                Header, footer, hero, cards, form, theme switcher, illustrations
│  └─ dragon/                 3D dragon engine and React components
├─ content/dictionary.ts      All interface text, English and Arabic
├─ content/services.ts        The eight services, English and Arabic
├─ lib/                       Language, themes, database, validation, notifications
└─ middleware.ts              Sends /ar/... to the same pages in Arabic
```

## Database

Development uses SQLite (`prisma/dev.db`), no setup needed. For production change `provider`
in `prisma/schema.prisma` to `postgresql`, `mysql` or `sqlserver`, set `DATABASE_URL` in
`.env`, and run `npm run db:push`.

## Next steps

- Email or Teams alert per inquiry: `src/lib/notify.ts`
- Staff login and an admin page for inquiries
- Deploy to Azure App Service, Vercel, or your own server behind IIS or Nginx
