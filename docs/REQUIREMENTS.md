

## Requirements, Tech Stack, and Implementation Plan

### 1\. Product vision

A personal trip‑planning and trip‑guide site where **Chris (admin)** can generate, review, edit, and publish AI‑assisted guides. **Visitors** browse past, current, and upcoming trips.

### 2\. Roles

* **Admin (Chris):** Create trip briefs, generate AI drafts, edit, preview, publish, and update trips.

* **Visitor (anyone):** Browse trips; open trip pages and day pages.

### 3\. What we’ll ship in MVP

* **Admin dashboard** with login.

* **Create Trip** wizard: locations, dates/season, duration, interests (preset \+ custom), constraints (pace, budget, dietary, mobility).

* **AI integration:** An integration with an AI such as ChatGPT or Claude’s API to research, suggest and generate content for trips

* **AI Generated Content Display**: structured JSON itinerary (overview \+ day plans), optional POI enrichment (coordinates/links), validation.

* **Draft preview** \+ inline edits (trip summary, day blocks, alternates).

* **Publish** workflow: snapshot versioning \+ revalidate updated pages.

* **Public site**: homepage with trip cards (Upcoming / Current / Past), trip page with map \+ day‑by‑day view, and navigation

### 4\. Non‑goals for MVP

* Search, advanced filters, multi‑user admin, SEO/marketing, comments, likes, or sharing controls.


### 5\. Public UX (MVP)

* **Homepage**: trip cards grouped by status; order by start date (upcoming first, then past).

* **Trip page**: hero, summary, map (pins for each day block with coords), day cards (Morning/Afternoon/Evening), Alternates accordion.

### 6\. Admin UX (MVP)

* **Login** → **Trips list** (status chips, create button)

* **New Trip wizard**: basics (title optional), **Geographies** (select countries/regions/cities → creates trip\_geos), dates or season, duration, interests (preset \+ custom), constraints

* **Generate** → Draft detail with tabs:

  * **Overview** (title, summary)

  * **Geographies** (list \+ add/remove; affects sections targeting)

  * **Days** (expandable per day with morning/afternoon/evening/alternates; **Accommodation** panel)

  * **Sections** (trip‑level: culture, language, inspiration, personal notes, to‑do, packing, daily goals; pick **applies\_to\_geos** and/or **language\_code**; toggle **AI‑seed / curated / manual**)

  * **Versions** (view publish snapshots)

* Actions: **Regenerate day**, **Preview as visitor**, **Publish** (snapshot \+ revalidate)

### 7\. Implementation phases

**Phase 0 — Project setup** \- Next.js app on Netlify, Supabase project, Tailwind \+ shadcn/ui, Zod, Leaflet.

**Phase 1 — Data layer & admin skeleton** \- Create tables \+ RLS; connect Supabase; implement auth; build admin list \+ create wizard (no AI yet).

**Phase 2 — AI generation** \- Implement /api/trips/\[id\]/generate server action; validate data; upsert into DB. \- Draft preview and inline edits.

**Phase 3 — Publish & public pages** \- Trip page \+ homepage; ISR revalidation on publish; maps.

**Phase 4 — Polish** \- Per‑day regenerate; basic error toasts; loading states; simple analytics (page views).

### 8\. Acceptance criteria (MVP)

* I can log in, create a trip, generate an AI draft, edit details, preview, publish, and see it on the homepage.

* Re‑publishing updates the public trip within seconds (ISR works).

* All secrets are server‑side; no 4xx CORS leaks.

* If AI returns invalid JSON, the system repairs or shows a helpful error.

# Requirements, Tech Stack, and Implementation Plan

## 1. Product vision
A personal trip-planning and trip-guide site where **Chris (admin)** can generate, review, edit, and publish AI-assisted guides. **Visitors** browse past, current, and upcoming trips. 

## 2. Roles
- **Admin (Chris)**: Create trip briefs; generate AI drafts; edit; preview; publish; update trips.
- **Visitor**: Browse trips; open trip pages and day pages. 

## 3. MVP scope (what we’ll ship)
- **Admin dashboard** with login
- **Create Trip** wizard: geographies, dates/season, duration, interests (preset + custom), constraints
- **AI integration**: Structured itinerary JSON (overview + days), optional POI enrichment, validation
- **Draft preview** + inline edits (trip summary, day blocks, alternates)
- **Publish** workflow: snapshot versioning + ISR revalidate updated pages
- **Public site**: homepage with trip cards (Upcoming / Current / Past), trip page with map + day-by-day view + navigation 

## 4. Non-goals (MVP)
- Search, advanced filters, multi-user admin, SEO/marketing, comments/likes/shares. 

## 5. Public UX (MVP) — Tailwind + DaisyUI
- **Homepage**: DaisyUI cards grouped by status; order by start date (Upcoming, Current, Past).
- **Trip page**: hero, summary, **Leaflet map** (pins for blocks with coords), **DaisyUI tabs** for Morning/Afternoon/Evening + **Alternates** accordion; clear **prev/next** navigation.
- **Accessibility & responsiveness**: works at 390px/768px/desktop; tap targets ≥44px; WCAG AA contrast.
- **Theming**: DaisyUI theme with our palette; Nunito (headings) + Lato (body). (Replaces the previous “pixel parity with legacy CSS” requirement.) 

## 6. Admin UX (MVP)
- **Login → Trips list** (status chips, create)
- **New Trip wizard** (basics, geographies, dates/season, duration, interests, constraints)
- **Draft detail tabs**: Overview, Geographies, Days (with Accommodation), Sections, Versions
- Actions: **Regenerate day**, **Preview as visitor**, **Publish** (snapshot + revalidate) 

## 7. Implementation phases
- **Phase 0 — Project setup**: Next.js on Netlify, Supabase project, Tailwind + DaisyUI (public), Tailwind + shadcn/ui (admin), Zod, Leaflet.
- **Phase 1 — Data layer & admin skeleton**: Tables + RLS; connect Supabase; auth; admin list + create wizard (no AI yet).
- **Phase 2 — AI generation**: `/api/trips/[id]/generate` server action; validate data; upsert; draft preview & edits.
- **Phase 3 — Publish & public pages**: Trip page + homepage; **ISR** revalidation on publish; maps.
- **Phase 4 — Polish**: Per-day regenerate; error toasts; loading states; basic analytics. 

## 8. Tech stack
- **Hosting**: Netlify (Next.js runtime + env vars + functions)
- **Frontend**: Next.js (App Router), **Tailwind + DaisyUI (public)**, **Tailwind + shadcn/ui (admin)**
- **Database**: Supabase (Postgres + Auth + Storage)
- **Server**: Next.js Route Handlers / Server Actions
- **Validation**: Zod
- **Maps**: Leaflet + OpenStreetMap
- **AI provider**: OpenAI (default) using Structured Outputs (JSON Schema) 

## 9. Data model (Supabase / Postgres) — summary
Core tables: `trips`, `trip_geos`, `trip_interests`, `days`, `day_blocks`, `trip_sections`, `day_sections`, `trip_versions` (publish snapshots). (Same as earlier.) 

## 10. Acceptance criteria (MVP)
- I can log in, create a trip, generate an AI draft, edit, preview, publish, and see it on the homepage.
- Re-publish updates the public trip within seconds (ISR works).
- All secrets are server-side; no 4xx CORS leaks.
- If AI returns invalid JSON, the system repairs or shows a helpful error.
- I can roll back via `trip_versions` snapshot. 
