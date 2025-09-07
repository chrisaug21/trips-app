# Architecture Decisions — Trip Planner

## 1) High-level approach
- **Framework**: Next.js (App Router) on Netlify’s Next runtime
- **Language**: TypeScript end-to-end
- **Database & Auth**: Supabase (Postgres + Auth + Storage)
- **AI**: OpenAI (default) with Structured Outputs (JSON Schema)
- **Validation**: Zod at all boundaries (forms, API, AI output)
- **Maps**: Leaflet + OpenStreetMap tiles
- **Rendering**: Static/ISR for public pages; server actions/route handlers for admin + AI
- **Hostings**: Netlify
- **Domains**: Namecheap (trips-app.chrisaug.com)

## 2) Public UI — decision
**Adopt Tailwind CSS + DaisyUI for the public site immediately.**  
- **Why**: Prebuilt, accessible, responsive components (navbar, tabs, cards, dropdowns) that look great out-of-the-box and are easy to assemble with AI assistance.  
- **How**:
  - Use Tailwind with default preflight (no legacy CSS to protect).
  - Install **DaisyUI** and start from a light theme customized to our palette and fonts (Nunito for headings, Lato for body).
  - Favor DaisyUI primitives (e.g., `navbar`, `menu`, `tabs`, `card`, `dropdown`, `breadcrumbs`) to reduce custom CSS.
- **Alternatives considered**:
  - *Legacy CSS + pixel parity* — rejected for complexity and slower iteration for a non-coder. 
  - *Pico.css* — simpler defaults but fewer rich components (menus/tabs), less control.
  - *Chakra/MUI/NextUI* — powerful but heavier mental model; DaisyUI strikes a better effort/benefit balance here.
- **Risks & mitigations**:
  - **Risk**: Over-customizing DaisyUI leads to inconsistency.  
    **Mitigation**: Keep a single `theme` in `tailwind.config` and centralize tokens.
  - **Risk**: Future visual overhaul.  
    **Mitigation**: DaisyUI theming lets us iterate without rewriting components.

## 3) Admin UI — decision
- **Tailwind + shadcn/ui** for form-heavy admin screens (tabs, dialogs, toasts, forms).
- Keep admin routes visually distinct but consistent in spacing/typography with the public theme.

## 4) Routing & structure
- **Public**:  
  - `/` — Homepage (cards grouped by Upcoming / Current / Past)  
  - `/trips/[slug]` — Trip page (hero, summary, map, day cards, alternates)
- **Admin**:  
  - `/admin` — Login + dashboard  
  - `/admin/trips` — List  
  - `/admin/trips/new` — Wizard  
  - `/admin/trips/[id]` — Edit (Overview, Geographies, Days, Sections, Versions)
- **API**:  
  - `/api/trips` (CRUD)  
  - `/api/trips/[id]/generate` (AI generate)  
  - `/api/trips/[id]/publish` (publish + ISR revalidate)

## 5) Data model & publishing
- Tables: `trips`, `trip_geos`, `trip_interests`, `days`, `day_blocks`, `trip_sections`, `day_sections`, `trip_versions` (snapshots on publish).
- **RLS**: public read on published; writes admin-only.
- **Publish**: flip `status=published`, write snapshot into `trip_versions`, revalidate homepage + trip page only (ISR).

## 6) AI generation
- OpenAI with **Structured Outputs** (JSON Schema) to force valid JSON.
- Validate with Zod; single “repair” attempt on failure; log token counts server-side.

## 7) Non-goals (MVP)
- No SEO/marketing features, multi-user admin, advanced filters/search, comments/likes.

## 8) Observability & safety
- Minimal server-side logs (token counts, sizes, first 500 chars of AI response), feature-flagged.
- No secrets in client; use Netlify env vars.

## 9) Theming & tokens (public)
- Define DaisyUI theme tokens: `primary`, `secondary`, `accent`, `base-100`, `neutral`, `info`, `success`, `warning`, `error`.
- Fonts: **Nunito** (headings) and **Lato** (body).
- Keep spacing/typography scale consistent across public + admin where practical.

## 10) Versions
- Next.js: 15.x (App Router), React 19.x
- Tailwind CSS: v4
- Public UI: DaisyUI
- Admin UI: Tailwind + shadcn/ui
- Supabase (Postgres + Auth + Storage)
- Zod — planned (schema validation everywhere; to be added as a dependency)
- Maps: Leaflet + OpenStreetMap
- AI: OpenAI with Structured Outputs (JSON Schema)

## 11) Project structure
- Canonical app directory: `nextjs-app/`
- Note: there is a legacy `src/` at the repo root; do not ship from root. All new work targets `nextjs-app/`. (TODO: archive or remove legacy root `src/` when convenient.)

## 12) Auth & access control
- Auth: Supabase Auth via SSR helpers and middleware.
- Admin access: restrict `/admin/*` to Chris’s account only. (TODO: enforce explicit email allowlist in server-side checks.)
- RLS: published content is publicly readable; all writes require admin.
- Middleware: runs on Node runtime (not Edge) and syncs Supabase cookies; broad matcher excludes static assets and auth callback.

## 13) Build & deploy
- Host: Netlify with the official Next.js runtime plugin.
- Rendering: Public pages use SSG/ISR; admin uses route handlers/server actions.
- Publish action: set `status=published`, write snapshot to `trip_versions` (include model + prompt_version), then revalidate only `/` and `/trips/[slug]`.
- Env vars: stored in Netlify; no secrets in client bundles.

## 14) Observability, rate limiting, safety
- Server logs: minimal; record token counts and first 500 chars of AI response. (Feature-flagged.)
- Rate limiting: apply to admin-only AI generation endpoints. (TODO: document exact limits once implemented.)

## 15) Developer experience (temporary flags)
- Lint: `eslint.ignoreDuringBuilds = true` (TEMP)
- TypeScript: `typescript.ignoreBuildErrors = true` (TEMP)
- Action: remove these once the codebase compiles cleanly.

## 16) Styling notes
- Tailwind v4 is the baseline. DaisyUI adoption is a decision but not yet implemented.
- Admin components: shadcn/ui with shared spacing/typography where practical.
- Fonts: Nunito (headings), Lato (body) via link in root layout.
- Theming: keep tokens centralized; avoid per-component hardcoded colors. (TODO: add DaisyUI theme config after install.)