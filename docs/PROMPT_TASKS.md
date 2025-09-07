## Cursor Prompt Pack (step-by-step tasks)

---

### Task 0 — Project scaffold (Next.js on Netlify) - COMPLETE
**Prompt:**  
“Create a Next.js (App Router, TypeScript) project configured for Netlify’s Next runtime. Add Tailwind CSS and **DaisyUI** for the public UI, and add **shadcn/ui** for the admin. Set up base routes: `/` (placeholder), `/trips/[slug]` (placeholder), `/admin` (placeholder). Add a README with local + Netlify deploy steps. Do not include any API keys.”

**Done when:** Local dev runs; deploy to Netlify succeeds; routes render.

---

### Task 1 — Supabase setup & types - COMPLETE
**Prompt:**  
“Add Supabase client libs and create `lib/supabase.ts` with a server client + client anon client. Define `.env.example` placeholders for `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and server-only service key. Add `sql/schema.sql` to create `trips`, `trip_interests`, `days`, `day_blocks`, `trip_versions`, plus enums/indexes. Provide SQL + a short RLS plan (public read for published; writes admin-only). Do not execute; output file + migration steps.”

**Done when:** Schema and RLS plan exist; env vars documented; types generated if using codegen.

---

### Task 2 — Auth (admin-only) - COMPLETE
**Prompt:**   -
“Implement Supabase Auth (email magic link or password). Protect `/admin/*` via a server layout session check. Add login + logout. Only my email (from env) is admin; redirect others away.”

**Done when:** Only my email can access `/admin`.

---

### Task 2.5: Deploy to Netlify

Setup Netlify and Namecheap (CNAME) and deploy code to the web such that the app can be accessed via the internet at trips-app.chrisaug.com

**Done when:** We achieved a successful build and deploy to web and can verify login works on prod


### Task 3 — Admin list & create wizard (no AI yet)
**Prompt:**  
“Build `/admin/trips` listing trips (status chips, actions Edit/Publish-if-draft). Implement `/admin/trips/new` multi-step form: basics (title optional), geographies (countries/regions/cities), dates/season, duration, interests (preset multi-select + custom chip add), constraints (free-form). On save, insert draft + route to `/admin/trips/[id]`.”

**Done when:** I can create a blank draft with brief fields stored.

---

### Task 4 — AI generation endpoint
**Goal:** Turn a brief into a validated itinerary saved as a draft.

**What to build**  
- Route handler or server action: **POST** `/api/trips/[id]/generate`  
- Netlify env: `AI_PROVIDER=openai`, `AI_MODEL=gpt-4o-mini`, `AI_PROMPT_VERSION=1`, `OPENAI_API_KEY`  
- Zod schemas: `TripAIResponse`, `Poi`, `Day` (match data model)  
- Self-heal loop: on JSON parse/validation failure, send one repair prompt with Zod error summary  
- (Optional) Enrichment: add lat/lng + link server-side; skip gracefully on failure

**Request composition**  
- System prompt sets tone (realistic timing, geographic clustering), **JSON-only**  
- User prompt contains the brief (geos, dates/season, duration, interests, constraints)  
- **Structured Outputs**: `response_format: { type: "json_schema", json_schema: <Trip schema>, strict: true }`

**Token caps**  
- Full trip: `max_output_tokens = min(12000, 900 + 800 * duration_days)`  
- Per-day regenerate: `max_output_tokens = 1500`

**Success:** Valid itinerary JSON → upsert trips/days/day_blocks/… in a transaction → Draft viewable in Admin/Preview.  
**Failure:** Friendly error; suggestions to reduce scope; log token counts + first 500 chars server-side.

---

### Task 5 — Admin draft editor
**Prompt:**  
“On `/admin/trips/[id]`, render tabs: **Overview** (title, summary), **Geographies** (select/remove countries/regions/cities), **Days** (expandable day cards with morning/afternoon/evening/alternates; **Accommodation** panel), **Sections** (trip-level: culture, language, inspiration, personal notes, to-do, packing, daily goals), **Versions** (publish snapshots). Inline edits with server actions (optimistic UI). Add ‘Regenerate day’ (only rewrites that day). Use shadcn/ui components.”

**Done when:** I can edit any field, manage geographies, and regenerate a single day.

---

### Task 6 — Preview mode
**Prompt:**  
“Implement Next.js preview mode for a given trip. From `/admin/trips/[id]`, add ‘Preview as visitor’ to set preview cookies and navigate to `/trips/[slug]` rendering the **draft** even if not published. Add a clear ‘Exit preview’.”

**Done when:** I can see the draft in public layout without publishing.

---

### Task 7 — Publish & snapshots (ISR)
**Prompt:**  
“Add a **Publish** action: set `status=published`, write a snapshot to `trip_versions` (include `model` + `prompt_version`), and call ISR revalidation for **only** the changed routes: `/` and `/trips/[slug]`. Use Netlify’s Next runtime revalidate. Show a success toast when revalidation completes.”

**Done when:** Publishing updates the live site within seconds.

---

### Task 8 — Public pages (Tailwind + DaisyUI)
**Prompt:**  
“Build the public **homepage** `/` using DaisyUI cards grouped by **Upcoming / Current / Past** (based on dates). Build `/trips/[slug]` with a DaisyUI **navbar**, hero, summary, **Leaflet map** (pins for blocks with coords), **tabs** (Morning/Afternoon/Evening + Alternates), and a **prev/next** bar. Use our DaisyUI theme; avoid custom CSS unless necessary.”

**Done when:** The pages are responsive at 390px/768px/desktop and feel cohesive with the theme.

---

### Task 9 — Optional POI enrichment
**Prompt:**  
“Extend generation to enrich POIs with lat/lng and official link server-side (e.g., OpenTripMap). Add retry and fallback; store coords when available.”

**Done when:** Many POIs show on the map without manual coordinate entry.

---

### Task 10 — Error handling & polish
**Prompt:**  
“Add toasts and inline errors for admin actions. Add loading states. Log AI request/response sizes. Add an ‘AI provenance’ panel (model & prompt_version). Add a `trip_versions` modal to view/restore snapshots into a draft copy.”

**Done when:** The admin feels trustworthy and explains errors clearly.
