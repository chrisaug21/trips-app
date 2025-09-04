

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

### 5\. Tech stack

* **Hosting:** Netlify (Next.js runtime \+ environment variables \+ functions)

* **Frontend:** Next.js (App Router), TypeScript, Tailwind (admin only; public pages can keep your current aesthetic)

* **UI components:** shadcn/ui (for fast, clean admin forms)

* **Database:** Supabase (Postgres \+ Auth \+ Storage)

* **Auth:** Supabase Auth (email magic link or password) with admin role

* **Server:** Next.js Route Handlers / Server Actions on Netlify Functions

* **Validation:** Zod (input \+ API \+ AI output validation)

* **Maps:** Leaflet \+ OpenStreetMap tiles (no token needed)

* **AI provider:** **OpenAI (default)** using structured outputs (JSON Schema). Anthropic is optional later.

### 6\. High‑level architecture

* **Public**: / (trip cards), /trips/\[slug\] (trip), /trips/\[slug\]/day/\[n\] (optional deep link)

* **Admin**: /admin (login), /admin/trips (list), /admin/trips/new (wizard), /admin/trips/\[id\] (edit)

* **API**: /api/trips, /api/trips/\[id\], /api/trips/\[id\]/generate, /api/trips/\[id\]/publish

* **Data flow**: Admin brief → AI draft JSON → validate → save as **draft** → preview → edits → publish (status flip \+ snapshot) → **ISR revalidate** affected routes.

### 7\. Data model (Supabase / Postgres)

Use a single schema (public). Types shown suggestively; exact SQL comes later.

**trips** \- id (uuid, pk) \- slug (text, unique) \- title (text) \- summary (text) \- status (enum: ‘draft’ | ‘published’ | ‘archived’) \- start\_date (date, nullable) \- end\_date (date, nullable) \- season (text, e.g., “late April”) \- duration\_days (int) \- hero\_image\_url (text, nullable) \- created\_at (timestamptz, default now) \- updated\_at (timestamptz)

**geo\_units** *(dynamic geography catalog)* \- id (uuid, pk) \- type (enum: ‘country’ | ‘region’ | ‘city’) \- name (text) \- code (text, nullable) — ISO 3166-1 alpha-2 for countries; custom for others \- parent\_id (uuid, fk → geo\_units.id, nullable) — e.g., region→country, city→region/country \- alt\_names (jsonb, nullable)

**trip\_geos** *(which geographies the trip involves)* \- trip\_id (uuid, fk → trips.id) \- geo\_id (uuid, fk → geo\_units.id) \- PK: (trip\_id, geo\_id)

**trip\_interests** \- trip\_id (uuid, fk) \- interest (text) \- PK: (trip\_id, interest)

**days** \- id (uuid, pk) \- trip\_id (uuid, fk) \- day\_index (int) — 1..N \- date\_hint (text) — e.g., “Thursday”, or actual date if known \- city (text) \- theme (text) \- accommodation (jsonb, nullable) — { name, address, phone, check\_in, check\_out, notes }

**day\_blocks** *(core itinerary items by part of day)* \- id (uuid, pk) \- day\_id (uuid, fk) \- part (enum: ‘morning’ | ‘afternoon’ | ‘evening’ | ‘alternate’) \- name (text) \- why (text) \- lat (float8, nullable) \- lng (float8, nullable) \- link (text, nullable) \- notes (text, nullable)

**trip\_sections** *(trip-level extra sections; dynamic by geography/language)* \- id (uuid, pk) \- trip\_id (uuid, fk) \- section\_type (enum: ‘culture’ | ‘language’ | ‘inspiration’ | ‘personal\_notes’ | ‘to\_do’ | ‘packing’ | ‘daily\_goals’ | ‘custom’) \- title (text) \- body\_md (text) \- sort\_order (int) \- applies\_to\_geo\_ids (uuid\[\] nullable) — targets specific geo\_units (e.g., both NL \+ BE) \- language\_code (text, nullable) — e.g., ‘nl’, ‘fr’ \- source (enum: ‘manual’ | ‘ai’ | ‘curated’) \- curated\_block\_id (uuid, nullable)

**day\_sections** *(day-level extra sections)* \- id (uuid, pk) \- day\_id (uuid, fk) \- section\_type (enum: ‘history’ | ‘travel\_details’ | ‘stroll’ | ‘notes’ | ‘custom’) \- title (text) \- body\_md (text) \- sort\_order (int)

**trip\_versions** (publish snapshots for rollback/audit) \- id (uuid, pk) \- trip\_id (uuid, fk) \- created\_at (timestamptz, default now) \- model (text) \- prompt\_version (text) \- snapshot\_json (jsonb)

### 8\. Interest taxonomy (preset \+ custom)

* Preset list used by UI for quick selection (e.g., food, wine, coffee, bakeries, museums, architecture, design, live music, hikes, markets, beaches, scenic drives, street art, bookstores, cycling, etc.)

* Custom interests allowed; stored in trip\_interests as free text.

### 9\. AI integration plan

**Goal:** Generate a realistic, walkable, interest‑aligned itinerary as **structured JSON**, dynamic to any countries/regions/cities.

**Strategy** \- Server action /api/trips/\[id\]/generate: 1\) Read brief \+ selected geographies (trip\_geos) and deduced languages\_expected. 2\) Call OpenAI with **Structured Outputs (JSON Schema)** for the itinerary. 3\) (Optional) Enrich POIs (lat/lng \+ official links) server‑side. 4\) Validate with Zod; attempt one self‑heal on failure. 5\) Upsert trips/days/day\_blocks/trip\_interests and create trip\_sections/day\_sections as provided.

**JSON shape requested from AI (conceptual)**

{  
  title: string,  
  summary: string,  
  duration\_days: number,  
  trip\_geos: \[ { type: 'country'|'region'|'city', name: string, code?: string } \],  
  interests: string\[\],  
  days: \[  
    {  
      index: number,  
      date\_hint?: string,  
      city: string,  
      theme: string,  
      morning: \[Poi\],  
      afternoon: \[Poi\],  
      evening: \[Poi\],  
      alternates?: \[Poi\],  
      day\_sections?: \[Section\]  
    }  
  \],  
  sections?: \[Section\] // trip-level sections like culture/language/inspiration  
}

Poi \= { name: string, why: string, lat?: number, lng?: number, link?: string, notes?: string }  
Section \= {  
  section\_type: 'culture'|'language'|'inspiration'|'personal\_notes'|'to\_do'|'packing'|'daily\_goals'|'history'|'travel\_details'|'stroll'|'notes'|'custom',  
  title: string,  
  body\_md: string,  
  applies\_to\_geos?: \[ { type: 'country'|'region'|'city', code?: string, name?: string } \],  
  language\_code?: string  
}

**Prompt principles** \- Output JSON only; adhere to schema (Structured Outputs with strict: true). \- If multiple countries/languages, include **one section per unique country/language** as needed. \- Use **ISO alpha‑2** codes for countries (e.g., NL, BE) when available; names for others. \- Avoid exact prices/hours; travel details may include steps and durations. \- Prefer fewer, higher‑quality POIs (3–5 per part) clustered geographically.

### 10\. Auth & security

* Supabase Auth for login; only allow your user to access /admin/\* routes.

* RLS: reads are public for published trips; writes require admin.

* Secrets (AI keys, service role key) live in Netlify env vars; never in the browser.

* Rate‑limit admin‑only generation endpoints.

### 11\. Publish model (ISR on Netlify)

* Admin presses **Publish** → set status='published', write trip\_versions snapshot.

* Call **revalidation** for:

  * /trips/\[slug\]

  * / (homepage cards)

* Pages are static and refresh in seconds.

### 12\. Public UX (MVP)

* **Homepage**: trip cards grouped by status; order by start date (upcoming first, then past).

* **Trip page**: hero, summary, map (pins for each day block with coords), day cards (Morning/Afternoon/Evening), Alternates accordion.

### 13\. Admin UX (MVP)

* **Login** → **Trips list** (status chips, create button)

* **New Trip wizard**: basics (title optional), **Geographies** (select countries/regions/cities → creates trip\_geos), dates or season, duration, interests (preset \+ custom), constraints

* **Generate** → Draft detail with tabs:

  * **Overview** (title, summary)

  * **Geographies** (list \+ add/remove; affects sections targeting)

  * **Days** (expandable per day with morning/afternoon/evening/alternates; **Accommodation** panel)

  * **Sections** (trip‑level: culture, language, inspiration, personal notes, to‑do, packing, daily goals; pick **applies\_to\_geos** and/or **language\_code**; toggle **AI‑seed / curated / manual**)

  * **Versions** (view publish snapshots)

* Actions: **Regenerate day**, **Preview as visitor**, **Publish** (snapshot \+ revalidate)

### 14\. Implementation phases

**Phase 0 — Project setup** \- Next.js app on Netlify, Supabase project, Tailwind \+ shadcn/ui, Zod, Leaflet.

**Phase 1 — Data layer & admin skeleton** \- Create tables \+ RLS; connect Supabase; implement auth; build admin list \+ create wizard (no AI yet).

**Phase 2 — AI generation** \- Implement /api/trips/\[id\]/generate server action; validate data; upsert into DB. \- Draft preview and inline edits.

**Phase 3 — Publish & public pages** \- Trip page \+ homepage; ISR revalidation on publish; maps.

**Phase 4 — Polish** \- Per‑day regenerate; basic error toasts; loading states; simple analytics (page views).

### 15\. Acceptance criteria (MVP)

* I can log in, create a trip, generate an AI draft, edit details, preview, publish, and see it on the homepage.

* Re‑publishing updates the public trip within seconds (ISR works).

* All secrets are server‑side; no 4xx CORS leaks.

* If AI returns invalid JSON, the system repairs or shows a helpful error.

* I can roll back by copying from a trip\_versions snapshot.