## Cursor Prompt Pack (step‑by‑step tasks)

Copy/paste these into Cursor as you work. One task at a time.

### Task 0 — Project scaffold (Next.js on Netlify)

**Prompt:** “Create a Next.js (App Router, TypeScript) project configured for Netlify deployment with the Netlify Next.js runtime. Add Tailwind and shadcn/ui for admin UI only. Set up base routes: / (placeholder), /trips/\[slug\] (placeholder), /admin (placeholder). Add a README.md with commands to run locally and to deploy to Netlify. Do not include any API keys.

**Done when:** Local dev runs; deploy to Netlify succeeds; routes render.

### Task 1 — Supabase setup & types

**Prompt:** “Add Supabase client libraries and create a lib/supabase.ts that exposes a server client and a client‑side anon client. Define .env placeholders for SUPABASE\_URL, SUPABASE\_ANON\_KEY, and server‑only service key. Add a sql/schema.sql that creates tables: trips, trip\_interests, days, day\_blocks, trip\_versions (per the data model), including basic indexes and enums. Provide SQL and a short RLS plan (reads public for published trips; writes admin‑only). Do not execute SQL; just output the file and migration instructions.”

**Done when:** Schema and RLS plan exist; env vars documented; types generated if using Supabase codegen.

### Task 2 — Auth (admin‑only)

**Prompt:** “Implement Supabase Auth with an email magic link (or password). Protect /admin/\* with a server layout that checks session server‑side. Add a simple login page and logout button. For MVP, allow only my email as admin (read from env) and redirect non‑admins away.”

**Done when:** Only your email can access /admin routes.

### Task 3 — Admin list & create wizard (no AI yet)

**Prompt:** “Build /admin/trips listing trips with status chips and actions (Edit, Publish if draft). Implement /admin/trips/new with a multi‑step form: basics (title optional), locations (countries, cities), dates or season, duration, interests (preset multi‑select \+ custom chip add), constraints (free‑form). On save, create a draft trip (DB insert) and route to /admin/trips/\[id\].”

**Done when:** I can create a blank draft with the brief fields stored.

### Task 4 — AI generation endpoint (expanded)

**Goal:** Turn a brief into a validated itinerary saved as a draft.

**What to build** \- Route handler or server action: POST /api/trips/\[id\]/generate \- Environment vars (Netlify): \- AI\_PROVIDER=openai (default) \- AI\_MODEL=gpt-4o-mini \- AI\_PROMPT\_VERSION=1 \- OPENAI\_API\_KEY=\<set in Netlify\> \- Zod schemas: TripAIResponse, Poi, Day exactly matching the data model (no code here—Cursor will create them) \- Self-heal loop: if JSON parse/validation fails, send a single repair prompt including the Zod error summary \- (Optional) Enrichment: for POIs missing coords, call OpenTripMap server-side to add lat/lng and link; skip gracefully on failure

**Request composition** \- **System prompt**: sets tone (practical, realistic timing, cluster stops geographically), instruct **JSON-only** output \- **User prompt**: includes the admin brief {locations, dates/season, duration, interests (preset \+ custom), constraints} \- **Structured Outputs**: use the OpenAI Responses API with response\_format: { type: 'json\_schema', json\_schema: \<Trip schema\>, strict: true } so the model must return valid JSON.

**Token & cost caps (pass to the request)** \- Set max\_output\_tokens to prevent runaway generations: \- **Full-trip generate:** max\_output\_tokens \= min(12000, 900 \+ 800 \* duration\_days) \- **Per-day regenerate:** max\_output\_tokens \= 1500 \- If the response is marked incomplete due to the cap, retry with fewer POIs per part (3 instead of 5\) or regenerate day-by-day.

**Success criteria** \- Returns a full itinerary JSON matching schema \- Upserts into trips, days, day\_blocks, trip\_interests in a DB transaction \- Draft is viewable in Admin and Preview mode

**Failure handling** \- If invalid JSON after repair: return a friendly error with suggestions (try fewer days, remove custom constraints, or regenerate per-day) \- Log token counts and first 500 chars of the response (server-side only)

### Task 5 — Admin draft editor

**Prompt:** “On /admin/trips/\[id\], render tabs: Overview (title, summary), **Geographies** (select/remove countries/regions/cities), Days (expandable per day with morning/afternoon/evening/alternates and an **Accommodation** panel), and **Sections** (trip‑level sections: culture, language, inspiration, personal notes, to‑do, packing, daily goals). Allow inline edits with server actions (optimistic UI). Add a ‘Regenerate day’ button that only rewrites that day.”

**Done when:** I can edit any field, manage geographies, and regenerate a single day.

### Task 5.1 — Geography & Sections data layer

**Prompt:** “Add tables geo\_units, trip\_geos, trip\_sections, and day\_sections per the data model. Create minimal admin CRUD for them under the trip. For trip\_sections, support optional applies\_to\_geo\_ids (multi-select from the trip’s geos) and optional language\_code.”

**Done when:** I can attach sections to a trip and target them to specific countries/regions/cities and/or languages.

### Task 5.2 — Pixel parity for public pages

**Prompt:** “Recreate two public pages in Next.js using my existing CSS and class names: (1) Trip overview page like /belgium-netherlands/index.html (route overview, day grid, inspiration, language, culture, personal notes), and (2) Day page like /belgium-netherlands/day2.html (history, travel details, accommodation, dinner options, evening stroll, prev/next day). Ensure **pixel‑parity** with the legacy site and no Tailwind in public routes. Add a ‘Style Lock’ comment in the public layout reminding not to change classes.”

**Done when:** The two pages visually match within a few pixels and render from DB content.

### Task 6 — Preview mode

**Prompt:** “Implement Next.js preview mode for a given trip. From /admin/trips/\[id\], add a ‘Preview as visitor’ button that sets preview cookies and navigates to /trips/\[slug\] rendering the draft state even if not published. Add a clear ‘Exit preview’ action.”

**Done when:** I can see the draft trip in public layout without publishing.

### Task 7 — Publish & snapshots (ISR)

**Prompt:** “Add a ‘Publish’ action: set status to published, write a snapshot to trip\_versions (including model \+ prompt\_version), and call ISR revalidation for the changed routes: the homepage / and the trip page /trips/\[slug\]. Use Netlify’s Next runtime revalidate method. Show a success toast when revalidation completes.”

**Done when:** Publishing updates the live site within seconds.

### Task 8 — Public pages

**Prompt:** “Build the public homepage / that lists **published** trips as cards grouped by status (Upcoming, Current, Past) based on start/end dates. Build /trips/\[slug\] with hero, summary, map (Leaflet with pins for any block with coords), and day cards (Morning/Afternoon/Evening, Alternates accordion). Keep the visual style close to my current site.”

**Done when:** Trips look like your current guides but are DB‑backed.

### Task 9 — Optional POI enrichment

**Prompt:** “Extend the generate flow to enrich POIs with lat/lng and link using OpenTripMap (or Google Places if configured). Add retry and fallback (no crash if missing). Store coords when available.”

**Done when:** Many POIs show on the map without manual coordinate entry.

### Task 10 — Error handling & polish

**Prompt:** “Add toasts and inline errors for all admin actions. Add loading states. Log AI request/response sizes. Add a small ‘AI provenance’ panel showing model & prompt\_version used. Add a trip\_versions modal to view/restore snapshots into a draft copy.”

**Done when:** The admin feels trustworthy and explains itself when things go wrong.