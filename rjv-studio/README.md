# RJV Studio — Full-Stack Booking PWA

**Cloudflare Pages + Supabase + Next.js 14**

A full-stack PWA for RJV Media Lab with two distinct experiences:
- **Customer Portal** — Service browsing, real-time booking, session history
- **Admin Dashboard** — Booking management, service editor, customer directory

---

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 14 (App Router) | Edge-compatible, Cloudflare Pages native |
| Backend | Supabase | Postgres + Realtime + Auth + Row Level Security |
| Auth | Supabase Auth | Built-in RBAC, JWT, email confirmation |
| Animations | Framer Motion | Layout animations between views |
| Styling | Tailwind CSS | Utility-first, dark mode |
| Hosting | Cloudflare Pages | Global edge, free tier |

---

## Setup (15 minutes)

### 1. Supabase Project

1. Go to [supabase.com](https://supabase.com) → New Project
2. Copy your **Project URL** and **Anon Key** from Settings → API
3. Go to SQL Editor → paste the contents of `supabase/migrations/001_initial_schema.sql` → Run

### 2. Make yourself an admin

After running the migration and creating your first account, run this in Supabase SQL Editor:

```sql
UPDATE public.profiles SET role = 'admin' WHERE email = 'your@email.com';
```

### 3. Local development

```bash
cp .env.example .env.local
# Fill in your Supabase URL and anon key

npm install
npm run dev
```

### 4. Deploy to Cloudflare Pages

```bash
# Install Wrangler
npm install -g wrangler

# Build
npm run build

# Deploy
npx wrangler pages deploy .next/standalone
```

**Or connect via GitHub:**
1. Push this repo to GitHub
2. Cloudflare Pages → New Project → Connect to Git
3. Build command: `npm run build`
4. Build output: `.next`
5. Add environment variables in Cloudflare Pages dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## Project Structure

```
rjv-studio/
├── app/
│   ├── page.tsx              # Landing page
│   ├── auth/login/page.tsx   # Auth (login + signup)
│   ├── booking/
│   │   ├── page.tsx          # 3-step booking flow
│   │   └── profile/page.tsx  # Customer dashboard
│   └── admin/
│       ├── page.tsx          # Admin overview (bento stats)
│       ├── bookings/         # Full booking CRUD table
│       ├── services/         # Service editor modal
│       └── customers/        # Customer directory
├── lib/
│   ├── supabase.ts           # Client + server Supabase instances
│   └── types.ts              # TypeScript types
├── styles/globals.css         # Design system, utilities
├── public/
│   ├── sw.js                 # Service worker (offline + push)
│   ├── manifest.json         # PWA manifest
│   ├── _headers              # Cloudflare cache headers
│   └── _redirects            # SPA routing
└── supabase/
    └── migrations/001_*.sql  # Full DB schema + seed data
```

---

## Services Pre-Loaded

| Service | Price |
|---|---|
| Recording – Hourly (Sound Fader Inc.) | $65/hr |
| Recording – 4hr Block | $250 |
| Recording – 8hr Block | $480 |
| Recording – 12hr Block | $690 |
| Mixing & Mastering | $250 flat |
| Custom Music Production | $500+ flat |
| Podcast Suite – Podio A | $65/hr |
| Podcast Suite – Podio B | $65/hr |
| Marketing Strategy Session | $150/hr |
| Brand Identity Package | $800 flat |

---

## RBAC (Role-Based Access Control)

Supabase Row Level Security policies enforce:

- **Customers** can only see/edit their own bookings
- **Admins** have full access to all tables
- **Public** can view active services (for booking flow)
- Double-booking is prevented at the database level with a `EXCLUDE` constraint

---

## PWA Features

- ✅ Installable on iOS and Android
- ✅ Offline support for booking flow pages
- ✅ Service worker with stale-while-revalidate caching
- ✅ Push notification infrastructure (requires VAPID keys)
- ✅ App shortcuts (Book a Session)
- ✅ Status bar styling for iOS standalone mode

---

## Adding Email Notifications

Connect Supabase Edge Functions + Resend:

1. Get API key at [resend.com](https://resend.com)
2. Set `RESEND_API_KEY` in Supabase Edge Function secrets
3. Create a Supabase DB webhook on `bookings` INSERT → trigger Edge Function
4. Edge Function sends confirmation to customer + admin

---

## Contact

RJV Media Lab · 244 Goodwin Crest Drive, Homewood AL  
tmalive@rjvmedialab.com · @MorningAuxLive
