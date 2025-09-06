# Architecture Decisions — Trip Planner

## 1) High-level approach
- **Framework**: Next.js (App Router) on Netlify’s Next runtime
- **Language**: TypeScript end-to-end
- **Database & Auth**: Supabase (Postgres + Auth + Storage)
- **AI**: OpenAI (default) with Structured Outputs (JSON Schema)
- **Validation**: Zod at all boundaries (forms, API, AI output)
- **Maps**: Leaflet + OpenStreetMap tiles
- **Rendering**: Static/ISR for public pages; server actions/route handlers for admin + AI

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

