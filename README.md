# My School App Uganda

A full-stack PWA that lets parents search and compare government and private
schools across every region and district of Uganda — fees, contacts, and
details in one place — so they're not limited to only the schools they
already know about.

---

## Tech stack
 
- **Framework:** Next.js 16 (App Router, TypeScript)
- **Database:** MongoDB Atlas + Mongoose
- **Auth:** NextAuth (Auth.js v5), credentials (email + password) provider
- **Styling:** Tailwind CSS v4
- **Validation:** Zod
- **Deployment:** Vercel (live)
- **PWA:** Web manifest + service worker (offline caching still basic —
  see roadmap)
---
 
## Getting started (local development)
 
### 1. Install dependencies
```bash
npm install
```
 
### 2. Set up environment variables
```bash
cp .env.local.example .env.local
```
Then fill in `.env.local`:
 
| Variable | Where to get it |
|---|---|
| `MONGODB_URI` | MongoDB Atlas → Connect → Drivers. If you hit a DNS `querySrv` error, see [Troubleshooting](#troubleshooting). |
| `AUTH_SECRET` | Run `npx auth secret` and paste the output |
| `NEXTAUTH_URL` | `http://localhost:3000` for local dev |
| `RESEND_API_KEY` | Free at resend.com — only needed once the inquiry-form step lands |
 
**Atlas Network Access:** make sure your current IP is allowed under
Network Access in the Atlas dashboard (or use "Allow Access from Anywhere"
during development). A VPN being on has repeatedly caused connection
failures during this project — turn it off if you get a sudden connection
error that worked a minute ago.
 
### 3. Seed the database (one-time)
```bash
npx tsx scripts/seedDistricts.ts
npx tsx scripts/seedSchools.ts
```
 
### 4. Run the dev server
```bash
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000).
 
### 5. (Optional) Create an admin account
There's no public admin signup. To get one:
1. Sign up normally on the site (any role — parent is cleanest, see note
   in `docs/FEATURES.md`)
2. Run:
```bash
npx tsx scripts/makeAdmin.ts your-email@example.com
```
 
---
 
## User roles
 
| Role | How they get it | What they can do |
|---|---|---|
| **Parent** | Optional signup — browsing/search never requires an account | Search/filter/browse schools, view details, save favorites |
| **School Rep** | Signs up, chooses "I represent a school" | Registers **one** school, edits it, sees approval status |
| **Admin** | Promoted via `scripts/makeAdmin.ts` (no public signup) | Approves/rejects school submissions |
 
**Full feature-by-feature breakdown with test steps:** see
[`docs/FEATURES.md`](docs/FEATURES.md). Client-facing walkthrough:
[`docs/TESTING_GUIDE.md`](docs/TESTING_GUIDE.md).
 
---
 
## Project structure
 
```
app/
├── page.tsx                     Landing page
├── layout.tsx                   Root layout (fonts, PWA metadata, providers)
├── SiteHeader.tsx                Nav — session-aware, role-aware links
├── Providers.tsx                 NextAuth SessionProvider wrapper
├── ServiceWorkerRegister.tsx     Registers SW in production only
├── SignOutButton.tsx
│
├── schools/
│   ├── page.tsx                  Search/filter/browse
│   ├── SchoolFilters.tsx
│   ├── SchoolResults.tsx
│   └── [slug]/
│       ├── page.tsx              School detail page
│       └── FavoriteButton.tsx    Save/unsave toggle
│
├── favorites/
│   ├── page.tsx                  Guarded: any signed-in user
│   └── FavoritesList.tsx
│
├── register-school/
│   ├── page.tsx                  Guarded: school_rep only
│   └── RegisterSchoolForm.tsx    Create/edit form + status view
│
├── admin/
│   ├── page.tsx                  Guarded: admin only
│   └── AdminDashboard.tsx        Approve/reject submissions
│
├── login/page.tsx
├── signup/page.tsx
│
└── api/
    ├── auth/[...nextauth]/route.ts
    ├── auth/signup/route.ts
    ├── districts/route.ts        List districts, optional ?region= filter
    ├── schools/route.ts          Public search (approved only)
    ├── schools/[slug]/route.ts   Public detail (approved only)
    ├── schools/mine/route.ts     School rep's own school (GET/POST/PATCH)
    ├── favorites/route.ts        Current user's saved schools (GET)
    ├── favorites/[schoolId]/route.ts  Add/remove a favorite (POST/DELETE)
    └── admin/schools/
        ├── route.ts               List all, filterable by status
        └── [id]/route.ts          Approve/reject a submission
 
lib/
├── db.ts                         Mongoose connection (cached)
├── auth.ts                       NextAuth config
└── authHelpers.ts                requireRole() / requireAuth() page guards
 
models/
├── School.ts
├── User.ts
├── District.ts
└── Inquiry.ts                    (schema exists, UI not built yet)
 
data/
└── regionsAndDistricts.ts        Uganda's 4 regions + seed district list
 
scripts/
├── seedDistricts.ts
├── seedSchools.ts                12 sample schools across all regions
└── makeAdmin.ts                  Promote a user to admin
 
docs/
├── TESTING_GUIDE.md              Client-facing walkthrough for testing
└── FEATURES.md                   Full feature list by role + test steps
```
 
---
 
## Design notes
 
The visual language leans on a Ugandan school exercise-book motif: kraft
paper background, chalkboard green + margin red + ledger blue accents, a
slab serif for headings, system fonts for body text (keeps data usage low
on mobile), and a rotated ink-stamp "Verified listing" badge on approved
school profiles. Fee tables render in a monospace "ledger" style.
 
Color/font tokens live in `app/globals.css` under `@theme inline`.
 
---
 
## Progress / Roadmap
 
- [x] **Step 1** — Data models (School, User, District, Inquiry)
- [x] **Step 2** — Public search/filter + school detail page (seed data)
- [x] **Step 3** — Authentication (school rep / parent signup, login, roles)
- [x] **Step 4** — School self-registration + admin approval dashboard
- [x] **Step 5** — Parent optional accounts + favorites
- [ ] **Step 6** — Inquiry form + email notifications to schools
- [ ] **Step 7** — Full PWA offline caching (currently just installable —
      no real offline data yet)
- [ ] **Step 8** — Polish + production deploy hardening
---
 
## Troubleshooting
 
**`querySrv ENOTFOUND` / `ETIMEOUT` when seeding:** DNS can't resolve the
`mongodb+srv://` SRV record. Try `nslookup -type=SRV
_mongodb._tcp.<your-cluster>.mongodb.net`. If that fails, either fix your
DNS (try `8.8.8.8`) or switch `MONGODB_URI` to the non-SRV connection
string from Atlas (Connect → Drivers → look for the standard/legacy
format listing each shard host explicitly).
 
**`MongooseServerSelectionError` / "could not connect to any servers":**
almost always an Atlas Network Access (IP allowlist) issue, or a VPN
routing you through a blocked IP. Check Network Access in Atlas first,
then turn off any VPN. This has come up more than once during this
project — VPN is the first thing to check.
 
**`Please define the MONGODB_URI environment variable` when running a
script with `tsx`:** `tsx` doesn't auto-load `.env.local` the way Next.js
does. The scripts in `scripts/` already handle this via `dotenv`, but if
you add a new script, copy the same pattern (`import { config } from
"dotenv"; config({ path: ".env.local" });` at the very top, before other
imports).
 
**Repeated `GET /` requests spamming the terminal in dev:** a leftover
service worker from earlier testing conflicting with Turbopack's dev
server. `ServiceWorkerRegister.tsx` only registers the SW in production
builds — if you still see this, open DevTools → Application → Service
Workers and unregister any listed workers, then hard refresh.
 
**"You cannot use different slug names for the same dynamic path":** two
dynamic route folders (e.g. `[id]` and `[slug]`) ended up as siblings
under the same path. Check `app/api/schools/` — admin routes belong under
`app/api/admin/schools/`, not mixed in with the public `schools` routes.
 
**`UnknownAction: Cannot parse action at /api/auth/signup`:** the
NextAuth catch-all route is intercepting a request meant for your own
signup route. Means `app/api/auth/signup/route.ts` is missing, empty, or
misplaced — it must sit as a sibling to `app/api/auth/[...nextauth]/`.
 
**"is not a module" TypeScript build error on a page file:** the file is
empty or has incomplete content — usually from a partial copy/paste.
Re-paste the full file content.
 
**Logout redirects to `localhost:3000` on the deployed site:**
`NEXTAUTH_URL` in Vercel's environment variables is still set to the
local dev URL. Update it to the real deployed URL in Vercel → Settings →
Environment Variables, then redeploy (env var changes need a fresh
deployment to take effect).
 
**Accidentally committed a credentials file:** rotate the exposed
credentials immediately (e.g. reset the Atlas database user's password)
rather than relying on removing the file from git — deleting it from the
latest commit doesn't remove it from git history.
 
---
 
## Deployment (Vercel)
 
1. Push to GitHub, import the repo in Vercel
2. Add env vars in Vercel project settings: `MONGODB_URI`, `AUTH_SECRET`,
   `NEXTAUTH_URL` (your real Vercel URL, not localhost), `RESEND_API_KEY`
3. In Atlas Network Access, allow `0.0.0.0/0` — Vercel's serverless
   functions don't have a fixed IP, so per-IP allowlisting won't work
4. If your production DB is a separate database from local dev, run the
   seed scripts once against it (temporarily point local `.env.local` at
   the production `MONGODB_URI` to do this)
5. Create an admin account on the deployed site the same way as local dev
   (sign up, then `makeAdmin.ts` — again pointed at the production URI)
**Force-pushing:** prefer `git push origin main --force-with-lease` over
plain `--force` — it refuses to push if the remote has changes you don't
have locally, protecting against accidentally overwriting work.
