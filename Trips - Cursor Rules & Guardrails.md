## Cursor Project Rules (MDC format) \+ Optional AGENTS.md

These replace the previous “Cursor Rules & Guardrails” section to follow Cursor’s Project Rules format. Put each block in a separate file under **.cursor/rules/**. For a simpler alternative, use a single **AGENTS.md** at the repo root (contents provided below).

### A) Project Rules files (preferred)

**1\) .cursor/rules/architecture.mdc**

\---  
description: Architecture & framework decisions for Trip Planner MVP (Netlify \+ Next.js \+ Supabase)  
alwaysApply: true  
\---  
\- Use Next.js App Router deployed on Netlify’s Next runtime.  
\- Database is Supabase (Postgres \+ Auth \+ Storage). Do not introduce other DBs without approval.  
\- TypeScript everywhere. Keep server code in route handlers/server actions.  
\- Validation with Zod at all boundaries (forms, API, AI output).  
\- Leaflet \+ OSM for maps. Do not add heavy mapping libs.  
\- Keep dependencies light. Ask before adding large libs.

**2\) .cursor/rules/security.mdc**

\---  
description: Security, secrets, and data-access rules for Trip Planner MVP  
alwaysApply: true  
\---  
\- Never expose Supabase service keys or AI keys in client code. Keys live in environment variables and are used server-side only.  
\- All writes (CRUD, AI generation, publish) must run in server actions or route handlers.  
\- Protect \`/admin/\*\*\` with Supabase Auth and allow-list my admin email from env.  
\- Apply RLS: public can read only \`published\` trips; writes require admin.  
\- Log minimal diagnostics server-side behind an env flag.

**3\) .cursor/rules/ai-generation.mdc**

\---  
description: AI generation and validation rules (OpenAI default)  
alwaysApply: true  
\---  
\- Default provider: \*\*OpenAI\*\*; model: \*\*gpt-4o-mini\*\* (configure via env).  
\- The \`/api/trips/\[id\]/generate\` action must:  
  1\) Build prompts from the brief and interest taxonomy  
  2\) Request \*\*structured JSON only\*\* using OpenAI Structured Outputs: \`response\_format: { type: "json\_schema", json\_schema: \<Trip schema\>, strict: true }\`  
  3\) Validate with Zod; if invalid, attempt one self-heal with a repair prompt  
  4\) Upsert trips/days/day\_blocks and trip\_interests in a transaction  
\- Support per-day regeneration with the same schema.  
\- Do not fetch external POI APIs on the client. If enrichment is enabled, call them server-side with caching.

**4\) .cursor/rules/publishing.mdc**

\---  
description: Publishing, snapshots, and ISR behavior  
alwaysApply: true  
\---  
\- Publishing flips \`status\` to \`published\`, writes a full JSON snapshot to \`trip\_versions\`, then revalidates affected routes only (homepage and the specific trip page).  
\- Use Next.js ISR revalidation on Netlify; do not trigger full site rebuilds.  
\- Provide a visible success/failure toast in admin.

\---  
description: Publishing, snapshots, and ISR behavior  
alwaysApply: true  
\---  
\- Publishing flips \`status\` to \`published\`, writes a full JSON snapshot to \`trip\_versions\`, then revalidates affected routes only (homepage and the specific trip page).  
\- Use Next.js ISR revalidation on Netlify; do not trigger full site rebuilds.  
\- Provide a visible success/failure toast in admin.

**5\) .cursor/rules/ui-admin.mdc**

\---  
description: Admin UI standards (applies to admin screens)  
globs:  
  \- app/(admin)/\*\*  
alwaysApply: false  
\---  
\- Use shadcn/ui and Tailwind. Keep forms accessible and mobile-friendly.  
\- Provide clear loading states and error toasts. Avoid infinite spinners.  
\- Group editing by tabs: Overview, Geographies, Days, Sections, Versions. Include a ‘Regenerate Day’ action and Publish with revalidation.

**6\) .cursor/rules/ui-public.mdc**

\---  
description: Preserve existing visual design for public trip pages  
globs:  
  \- app/(public)/\*\*  
alwaysApply: true  
\---  
\- Do not introduce Tailwind or shadcn/ui into public routes.  
\- Use the existing global CSS and class names from the legacy site; aim for pixel parity.  
\- Do not rename classes or change typography/spacing/color tokens without explicit approval.  
\- Avoid global resets or overrides (e.g., Tailwind preflight) that affect public pages.  
\- CSS Modules are allowed for new isolated pieces, but must not alter global look.

### B) Optional single-file alternative — AGENTS.md

\# Trip Planner MVP — Project Instructions (AGENTS.md)

\#\# Architecture  
\- Next.js App Router on Netlify’s Next runtime. Supabase for DB/Auth/Storage. TypeScript everywhere.

\#\# Security  
\- Secrets never in client. All writes are server-side. Admin routes require Supabase Auth and my email allow-list.

\#\# AI Generation  
\- \*\*Default provider: OpenAI\*\* (\`gpt-4o-mini\`). \`/api/trips/\[id\]/generate\` must return \*\*structured JSON only\*\* and be Zod-validated with a one-time self-heal. Use Structured Outputs (***\`response\_format: { type: "json\_schema" }\`***).

\#\# Publishing  
\- On publish: write snapshot → revalidate only homepage and trip page (ISR). No full rebuilds.

\#\# Admin UI  
\- shadcn/ui \+ Tailwind, clear toasts, tabs (Overview, Days, Versions), and per-day regenerate.