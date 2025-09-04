# Trip Planner MVP Notes Doc

ChatGPT created 3 documents to help me build this app:

1. [Detailed requirements, tech stack, and implementation plan (reference doc for Cursor)](https://docs.google.com/document/d/1g2XVd3z4r9lEi1H-FWvX6nvE9fJBGIygXf2T3G543oQ/edit?tab=t.0)   
2. [A step‑by‑step Cursor Prompt Pack to build the app](https://docs.google.com/document/d/1YJPpEwfl_Usk_sUUTDFeug7g-ydv5QCTQjl77l-ab6M/edit?tab=t.0)  
3. [Cursor Rules & Guardrails 4\) Tips, tricks, and sanity savers](https://docs.google.com/document/d/10wsVO-btwiyaLFMj4OfEyp7qXprPXCFyHhAxg1Fvd10/edit?tab=t.0)

We chose [Path 1 from this conversation](https://chatgpt.com/share/68b7c4dd-8164-8003-a500-3b20c70f9386), which is **Next.js \+ Supabase on Netlify with ISR**. Public reading is fast and static; admin has a real review/edit flow; publish revalidates changed pages.

---

## Tips, Tricks, and Sanity Savers

* **Work in slices.** One prompt/task at a time. Don’t let Cursor “do everything.”

* **Use placeholders.** If maps or AI fail, render a friendly placeholder instead of blocking the flow.

* **Model cost control.** Generate the whole trip once; iterate per‑day for changes. Cache the brief; store drafts.

* **Preview mode is your friend.** It lets you see the draft as a visitor without risking your live site.

* **Snapshots \= confidence.** Each publish writes a full JSON snapshot. You can restore from it into a new draft if you ever need to roll back.

* **Keep secrets secret.** Netlify env vars only; never in client code. Use server actions for anything that touches keys.

* **Use Supabase UI early.** You can inspect tables and rows live to debug without touching SQL.

* **Glossary (plain English):**

  * **ISR**: Pages are pre‑rendered and cached; when something changes, you tell the site to refresh just those pages.

  * **Server action**: A function that runs only on the server in response to a form/button, safe for secrets.

  * **Route handler**: An API endpoint in Next.js.

  * **RLS**: Row Level Security—database rules that keep non‑admins from editing data.

  * **Zod**: A library that checks data shapes so bad AI output doesn’t break your app.

---

## Practical Questions

### 1\) New project or build inside your existing repo?

**Recommendation: make a new repo \+ new Netlify site for the Next.js app**, then swap the domain when you’re happy.

Why this is best for you:

* **Zero risk to your current live site.** You can iterate freely.

* **Cleaner history & structure.** Your static site and your “real app” won’t be intermingled.

* **Easy cutover.** Point `trips.chrisaug.com` at the new Netlify site when done; keep the old site archived.

Practical cutover plan:

1. Create new repo: `trips-app-next`.

2. Deploy to Netlify → temporary URL (e.g., `trips-next.netlify.app`) or a staging subdomain (e.g., `staging-trips.chrisaug.com`).

3. Build everything there. When satisfied:

   * Move custom domain `trips.chrisaug.com` from old site to the new site in Netlify’s domain settings.

   * Keep the old site available on its `*.netlify.app` URL for reference/backup.

(If you really want one repo: use a monorepo with two base directories and two Netlify sites. But for your sanity, new repo is simpler.)

---

### 2\) Keeping your exact look/feel while going dynamic

Totally doable. The trick is **scoping**: keep your public trip pages visually identical, and let Tailwind/shadcn live only in the admin.

Concrete strategy:

* **Copy your existing CSS \+ assets** into the new app and load them as a **global stylesheet** for public pages.

* **Do NOT change the public markup pattern** unless necessary. Port your current HTML structure into React components with the same class names.

* **Scope Tailwind to admin only:**

  1. In `tailwind.config.js`, set `content` to only scan `app/(admin)/**` (or `src/app/admin/**`).

  2. Disable Tailwind’s base reset on the public side: `corePlugins: { preflight: false }`, or wrap Tailwind styles under an admin layout container.

* **Split the app by “route groups”:**

  1. `app/(public)/trips/[slug]/page.tsx` → imports your legacy CSS; no shadcn here.

  2. `app/(admin)/...` → Tailwind \+ shadcn/ui for forms, toasts, tabs, etc.

* **Avoid global resets** (like CSS normalize) that would alter your current look.

* **CSS Modules for new components** (public) so selectors don’t leak.

* **Pixel-parity checklist** (quick ritual):

  1. Screenshot current static pages (home \+ one trip).

  2. Rebuild those pages in Next and overlay screenshots (browser dev tools / design mode).

  3. Fix spacing/typography until it matches.

* **Keep “public UI” library-free.** Use your CSS and tiny utilities only. All the fancy UI library stuff goes in admin.

If you later decide the UX should evolve, do that **after** you’ve achieved pixel parity—now you’ll be iterating from a stable baseline.

### 3\) Where to put the requirements for Cursor \+ an “About Me” persona

See detailed response in [this convo.](https://chatgpt.com/share/68b7c4dd-8164-8003-a500-3b20c70f9386) [About me persona doc is here](https://docs.google.com/document/d/1yhKN6cuRg0mVyvJIZ9CqXM2juie-itcYp1MH5LGtoJ0/edit?tab=t.0).

### Where to start? 

Start with **Task 0** from the Prompt Pack. When Task 0–3 are done, you’ll already have a functioning admin that saves drafts. Then wire up AI in Task 4 and you’re off to the races.

---

## Appendix — AI Prompt Templates (ready to adapt)

Use **OpenAI** by default. Store model and prompt\_version in trip\_versions during publish.

### OpenAI (JSON-structured output)

**System** \- You are generating realistic, walkable travel itineraries for a single traveler or couple across any mix of countries/regions/cities. \- Output **JSON only** that matches the provided schema. No markdown, no commentary. \- Cluster POIs geographically; keep daily walking/transit reasonable; pick places that clearly exist on maps.

**User** (example skeleton) \- Brief: \- Destinations/Geographies: NL (Netherlands), BE (Belgium); Cities: Amsterdam, Ghent, Bruges, Brussels \- Duration: 11 days; Time of year: late April \- Interests (preset): canals, art, cycling, architecture, chocolate \- Custom interests: street photography \- Constraints: light seafood only; no long hikes; day-trip friendly; train-first, car-last \- Produce JSON matching the schema below.

**Schema excerpt to include in prompt**

{  
  "title": "string",  
  "summary": "string",  
  "duration\_days": 11,  
  "trip\_geos": \[ { "type": "country", "code": "NL", "name": "Netherlands" }, { "type": "country", "code": "BE", "name": "Belgium" } \],  
  "interests": \["string"\],  
  "days": \[  
    {  
      "index": 1,  
      "date\_hint": "string",  
      "city": "string",  
      "theme": "string",  
      "morning": \[Poi\],  
      "afternoon": \[Poi\],  
      "evening": \[Poi\],  
      "alternates": \[Poi\],  
      "day\_sections": \[Section\]  
    }  
  \],  
  "sections": \[Section\]  
}

Poi \= { "name": "string", "why": "string", "lat": number?, "lng": number?, "link": "string?", "notes": "string?" }  
Section \= { "section\_type": "culture"|"language"|"inspiration"|"personal\_notes"|"to\_do"|"packing"|"daily\_goals"|"history"|"travel\_details"|"stroll"|"notes"|"custom", "title": "string", "body\_md": "string", "applies\_to\_geos": \[{ "type": "country"|"region"|"city", "code": "string?", "name": "string?" }\], "language\_code": "string?" }

**Repair prompt (if Zod fails)** \- “Your previous JSON failed validation with these errors: . Respond with corrected **JSON only**, same schema. Do not change the trip length unless required.”

## Appendix — OpenAI API Setup (Netlify \+ Supabase)

**Goal:** Get an OpenAI key working for your server-side generation.

1) **Create/Open your OpenAI account** at platform.openai.com and ensure you have billing enabled.

2) **Create a Project** (lets you scope keys/limits). Name it trips-chrisaug.

3) **Create an API key** for that Project and copy it once.

4) **Set usage limits** on the Project if desired (daily/monthly caps). Recommended: **$10/month** budget, alert at **$7**.

5) **Add the key to Netlify** → Site settings → Environment variables:

   * OPENAI\_API\_KEY=sk-...

   * AI\_PROVIDER=openai

   * AI\_MODEL=gpt-4o-mini

   * AI\_PROMPT\_VERSION=1

6) **Redeploy** so server functions see the new env vars.

7) **Smoke test**: add a temporary admin button that calls /api/trips/\[id\]/generate with a tiny, 2-day brief and checks that a draft is created.

8) **Cost-control tips**:

   * Generate the full trip once; iterate per-day when tweaking.

   * Keep POIs to 3–5 per part.

   * Log token counts (server-side) for awareness.

## Appendix — Public UI Style Guide (derived from legacy site)

This section codifies the current look of the public site so the Next.js app can match it pixel-for-pixel. Do **not** change these without approval.

### Colors (tokens)

***:root*** {  
  \--primary: \#0077CC;     */\* headings, links, key elements \*/*  
  \--secondary: \#8DA2C0;   */\* secondary accents \*/*  
  \--accent: \#F2C94C;      */\* highlights, CTA, next buttons \*/*  
  \--text: \#333333;        */\* main body text \*/*  
  \--text-muted: \#666666;  */\* secondary text \*/*  
  \--light-bg: \#f8f9fa;    */\* content backgrounds \*/*  
  \--white: \#ffffff;       */\* cards, text on dark \*/*  
}

### Typography

* **Headings font:** Nunito (weights 300, 400, 600, 700\)

* **Body font:** Lato (weights 300, 400, 700\)

* Load via Google Fonts (same families/weights as legacy site).

**Scale (desktop baseline):**

h1 { **font-size**: 2.5rem; */\* Page Title \*/* }  
h2 { **font-size**: 2rem;   */\* Section Title \*/* }  
h3 { **font-size**: 1.3rem; */\* Content Heading \*/* }  
h4 { **font-size**: 1.2rem; */\* Subsection \*/* }  
p, li { **font-size**: 1rem; }

* Paragraphs use Lato; headings use Nunito. Strong/emphasis follow legacy colors; links use \--primary and hover to secondary.

### Layout & Responsiveness

* Mobile-first with a main breakpoint at **768px**.

* Containers use percentage widths with sensible max-width; content remains readable on small screens.

* On mobile: header collapses, trip-day nav becomes a grid, nav buttons stack full-width.

### Navigation

**Primary site header** \- Render the site title and main nav links. In the legacy site the header is injected via JS; in Next.js, mirror the same markup/classes in a shared public layout component.

**Trip-specific navigation** \- Appears below the header on trip pages; lists **Trip Home** \+ **Day 1..N**. \- Sticky on scroll; highlight the active day with .active. \- On mobile, transforms to a grid of buttons; “Trip Home” text may shorten to **“Trip.”**

**Lower (prev/next) navigation** \- Always include both buttons. \- **Previous** button uses **primary** blue; **Next** button uses **accent** yellow. \- Labels must be exactly: Previous: Day X and Next: Day X (or Trip Home at the ends).

### Content Components (class semantics)

Use the same classes in public routes; no Tailwind utilities here.

* **Cultural Box** — general info/cultural context; **yellow left border** with light background.

  * Class: .culture-box (keep legacy naming if present).

* **Travel Detail** — logistics/schedules; **blue left border** with light background.

  * Class: .travel-detail.

* **Location Highlight** — highlight locations/routes/attractions; **light yellow background** \+ yellow left border.

  * Class: .location-highlight.

* **Options Box** — alternatives/evening options/secondary info; **light blue background** \+ blue left border.

  * Class: .options-box.

**Nesting rule (contrast required):** \- When nesting a historical/cultural context inside another component, use a **contrasting background** (e.g., travel-detail box with white background → nest a yellow location-highlight inside). Never use the same background as the parent.

### Option Tabs (for multi-option days)

Classes and behavior mirror the legacy implementation.

.option-tabs { **display**:flex; **margin-bottom**:1rem; **border-bottom**:2px solid var(\--light-bg); }  
.option-tab { **padding**:0.75rem 1.5rem; **background**:var(\--light-bg); **font-weight**:600; **cursor**:pointer; **transition**:all .3s; **border-radius**:6px 6px 0 0; **margin-right**:.5rem; }  
.option-tab***:hover*** { **background**:var(\--secondary); **color**:var(\--white); }  
.option-tab.active { **background**:var(\--primary); **color**:var(\--white); }  
.option-content { **display**:none; **width**:100%; **max-width**:100%; }  
.option-content.active { **display**:block; }

Interactive behavior: click to toggle .active on the tab and corresponding .option-content.

### Content Grid

* A responsive grid that arranges content items side-by-side when space allows (min width \~300px), stacking on mobile.

* Use the same class naming and visual spacing as the legacy site; avoid arbitrary changes.

### Day Pages — Structured Sections

* **History** and **Travel Details** use the component styles above and appear in the order defined by the legacy pages.

* **Accommodation** is a distinct panel with name, address, phone, check-in/out.

* **Dinner options** and **Evening stroll** follow with appropriate components.

* Provide **Prev/Next** buttons at the bottom of every day page.

### Do‑Not‑Change Rules (public routes)

* Do **not** introduce Tailwind or shadcn/ui.

* Do **not** rename or repurpose existing classes/selectors.

* Do **not** add global resets (Tailwind preflight must be disabled for public routes).

* Aim for **pixel parity** with the legacy site; any visual change requires explicit approval.

### Implementation Notes (Next.js)

* Public routes live under a route group like app/(public)/... and import the legacy global CSS.

* Admin routes live under app/(admin)/... and may use Tailwind/shadcn.

* Keep a comment banner in the public layout: // STYLE LOCK: Do not change class names or global styles without approval.

## Addendum — Mobile Responsiveness & Public Frontend

### Mobile Responsiveness (requirements summary)

* Entire app is **mobile‑first**. Validate at 390px, 430px, 768px, and desktop.

* Breakpoints: **480px**, **768px**, **1024px**.

* Public: preserve pixel parity on mobile & desktop; tap targets ≥ 44px; grids collapse under 768px; images/maps fluid width (maps \~300px mobile / \~480px desktop).

* Trip nav: wraps or horizontal scroll on small screens; remains sticky; active state visible.

* Admin: no horizontal scrolling; labels above inputs; clear error states.

### Public Frontend Choice (clarity)

* Public routes use **Next.js** (App Router) with your **legacy CSS** and minimal vanilla JS for interactions (e.g., tabs). **No Tailwind/shadcn** on public routes. Admin uses Tailwind/shadcn.

### Cursor Rules — add/confirm

**Add** .cursor/rules/responsive.mdc:

\---  
description: Mobile responsiveness requirements across the app  
alwaysApply: true  
\---  
\- The app is mobile‑first. Breakpoints: 480px, 768px, 1024px.  
\- Public routes must preserve legacy look on mobile & desktop with pixel parity.  
\- Admin routes must be fully usable on small screens; no horizontal scrolling. Labels above fields; buttons ≥ 44px height.  
\- Use \`clamp()\` for heading sizes where appropriate to maintain proportions.

**Update** .cursor/rules/ui-public.mdc to include:

\- \*\*Responsiveness\*\*: Maintain mobile‑first behavior.  
  \- Trip nav must wrap or horizontally scroll on small screens; tap targets ≥ 44px.  
  \- Grids collapse to single column under 768px.  
  \- Images/maps are fluid width; maps \~300px (mobile) / 480px (desktop) height.  
\- \*\*Style guardrails\*\*: Do not modify \`app/(public)/styles/public.css\` tokens or class names without updating \`docs/STYLE\_GUIDE\_PUBLIC\_UI.md\` and getting approval.

### Prompt Pack — new/updated tasks

**New:** Task 2.1 — **Mobile baseline** \> “Implement global breakpoints (480/768/1024), add clamp() sizes for H1/H2/H3 per the style guide, ensure .trip-nav wraps/scrolls on small screens with 44px tap targets, and set fluid image/map behavior. Provide a quick checklist to verify on widths 390/430/768/desktop.”

**New:** Task 2.2 — **Wire public.css \+ Tailwind guard** \> “Create app/(public)/styles/public.css with the provided stub and import it in app/(public)/layout.tsx. Add the Google Fonts link for Nunito/Lato in the public layout \<head\>. In tailwind.config.js, set corePlugins: { preflight: false } to avoid resets affecting public routes. Confirm that admin styling still looks correct under shadcn without preflight; if not, add a minimal admin‑only reset imported in app/(admin)/layout.tsx.”

**Replace:** Task 5.2 — **Pixel parity for public pages (desktop & mobile)** \> “Recreate two public pages in Next.js using my existing CSS and class names: (1) Trip overview /belgium-netherlands/index.html, (2) Day page /belgium-netherlands/day2.html. Achieve pixel‑parity on desktop **and** mobile (\<= 390px). No Tailwind in public routes. Trip nav wraps or horizontally scrolls; grids collapse under 768px; tap targets ≥ 44px. Add a ‘Style Lock’ comment in the public layout.”

## Appendix — public.css stub & wiring

Drop this file at app/(public)/styles/public.css and import it from the (public) layout. These selectors mirror your legacy look and are safe to extend. Do **not** rename selectors without approval.

*/\* \===========================*  
   *Trip Planner Public Styles*  
   *STYLE LOCK: Do not change selectors without approval.*  
   *This file supplements the legacy CSS; it does not reset it.*  
   *\=========================== \*/*

*/\* Tokens (match legacy values) \*/*  
***:root*** {  
  \--primary: \#0077CC;  
  \--secondary: \#8DA2C0;  
  \--accent: \#F2C94C;  
  \--text: \#333333;  
  \--text-muted: \#666666;  
  \--light-bg: \#F8F9FA;  
  \--white: \#FFFFFF;

  \--max-width: 980px;  
  \--gutter: 16px;

  \--radius-sm: 6px;  
  \--radius-md: 10px;  
  \--shadow-sm: 0 1px 2px rgba(0,0,0,.06);  
  \--shadow-md: 0 2px 8px rgba(0,0,0,.08);  
}

*/\* Typography helpers (keep your existing font links) \*/*  
.page-title { **font-family**: "Nunito", system-ui, sans-serif; **font-weight**: 700; **color**: var(\--primary); }  
.section-title { **font-family**: "Nunito", system-ui, sans-serif; **font-weight**: 600; **color**: var(\--text); }  
.content-text { **font-family**: "Lato", system-ui, sans-serif; **color**: var(\--text); }

*/\* Layout \*/*  
.container {  
  **max-width**: var(\--max-width);  
  **margin-inline**: auto;  
  **padding-inline**: var(\--gutter);  
}

*/\* Trip nav (tabs across top of trip pages) \*/*  
.trip-nav {  
  **position**: sticky; **top**: 0; **z-index**: 10;  
  **background**: var(\--white);  
  **border-bottom**: 2px solid var(\--light-bg);  
}  
.trip-nav-list {  
  **display**: flex; **flex-wrap**: wrap; **gap**: 6px;  
  **padding**: 10px var(\--gutter);  
}  
.trip-nav a {  
  **display**: inline-block;  
  **padding**: 12px 14px; */\* \>=44px high on small screens \*/*  
  **font-weight**: 600;  
  **border-radius**: var(\--radius-sm);  
  **background**: var(\--light-bg);  
  **color**: var(\--text);  
  **text-decoration**: none;  
  **transition**: background .25s, color .25s;  
}  
.trip-nav a***:hover*** { **background**: var(\--secondary); **color**: var(\--white); }  
.trip-nav a.active { **background**: var(\--primary); **color**: var(\--white); }

*/\* Prev/Next buttons at bottom of day pages \*/*  
.prev-next {  
  **display**: flex; **justify-content**: space-between; **align-items**: center;  
  **margin-top**: 24px; **padding**: 16px 0;  
  **border-top**: 1px solid var(\--light-bg);  
}  
.prev-next .btn-prev, .prev-next .btn-next {  
  **display**: inline-block; **padding**: 12px 16px; **border-radius**: var(\--radius-sm);  
  **font-weight**: 700; **text-decoration**: none;  
  **box-shadow**: var(\--shadow-sm);  
}  
.prev-next .btn-prev { **background**: var(\--primary); **color**: var(\--white); }  
.prev-next .btn-next { **background**: var(\--accent); **color**: \#111; }

*/\* Content boxes (match legacy look) \*/*  
.culture-box,  
.travel-detail,  
.location-highlight,  
.options-box {  
  **padding**: 14px 16px;  
  **margin**: 14px 0;  
  **border-radius**: var(\--radius-md);  
  **box-shadow**: var(\--shadow-sm);  
  **background**: var(\--white);  
  **border-left**: 6px solid transparent;  
}

*/\* Specific variants \*/*  
.culture-box { **background**: \#FFF9E6; **border-left-color**: var(\--accent); }  
.travel-detail { **background**: \#F0F6FF; **border-left-color**: var(\--primary); }  
.location-highlight { **background**: \#FFF8CC; **border-left-color**: var(\--accent); }  
.options-box { **background**: \#EAF2FF; **border-left-color**: var(\--secondary); }

*/\* Nested contrast: never same bg inside parent box \*/*  
.culture-box .travel-detail,  
.travel-detail .culture-box,  
.options-box .location-highlight { **background**: var(\--white); }

*/\* Option tabs (for multi-option days) \*/*  
.option-tabs { **display**: flex; **gap**: 8px; **margin-bottom**: 12px; **border-bottom**: 2px solid var(\--light-bg); }  
.option-tab {  
  **padding**: 10px 14px; **font-weight**: 600; **cursor**: pointer;  
  **background**: var(\--light-bg); **border-radius**: var(\--radius-sm) var(\--radius-sm) 0 0;  
  **transition**: background .25s, color .25s;  
}  
.option-tab***:hover*** { **background**: var(\--secondary); **color**: var(\--white); }  
.option-tab.active { **background**: var(\--primary); **color**: var(\--white); }  
.option-content { **display**: none; }  
.option-content.active { **display**: block; }

*/\* Content grid \*/*  
.content-grid {  
  **display**: grid;  
  **grid-template-columns**: repeat(auto-fill, minmax(300px,1fr));  
  **gap**: 16px;  
}

*/\* Images and maps \*/*  
.figure { **margin**: 12px 0; }  
.figure img, .leaflet-container { **border-radius**: var(\--radius-md); **box-shadow**: var(\--shadow-sm); }

*/\* Mobile tweaks \*/*  
**@media** (**max-width**: 768px) {  
  .trip-nav-list { **gap**: 4px; }  
  .trip-nav a { **padding**: 10px 12px; }  
}

**Wiring instructions** 1\) Create the file at app/(public)/styles/public.css with the contents above. 2\) In app/(public)/layout.tsx, import it: import './styles/public.css'. 3\) Add the Google Fonts \<link\> for **Nunito** and **Lato** in the \<head\> of (public) layout. 4\) In tailwind.config.js, set corePlugins: { preflight: false } to prevent resets from affecting public pages. If admin needs a reset, import a minimal reset only in app/(admin)/layout.tsx. 5\) Confirm on **390/430/768/desktop** widths that tap targets are ≥ 44px and the nav wraps/scrolls.

## Artifact 4 — Tips, Tricks, and Sanity Savers

* **Work in slices.** One prompt/task at a time. Don’t let Cursor “do everything.”

* **Use placeholders.** If maps or AI fail, render a friendly placeholder instead of blocking the flow.

* **Model cost control.** Generate the whole trip once; iterate per‑day for changes. Cache the brief; store drafts.

* **Preview mode is your friend.** It lets you see the draft as a visitor without risking your live site.

* **Snapshots \= confidence.** Each publish writes a full JSON snapshot. You can restore from it into a new draft if you ever need to roll back.

* **Keep secrets secret.** Netlify env vars only; never in client code. Use server actions for anything that touches keys.

* **Use Supabase UI early.** You can inspect tables and rows live to debug without touching SQL.

* **Glossary (plain English):**

  * **ISR**: Pages are pre‑rendered and cached; when something changes, you tell the site to refresh just those pages.

  * **Server action**: A function that runs only on the server in response to a form/button, safe for secrets.

  * **Route handler**: An API endpoint in Next.js.

  * **RLS**: Row Level Security—database rules that keep non‑admins from editing data.

  * **Zod**: A library that checks data shapes so bad AI output doesn’t break your app.

---

### What’s next?

Start with **Task 0** from the Prompt Pack. When Task 0–3 are done, you’ll already have a functioning admin that saves drafts. Then wire up AI in Task 4 and you’re off to the races.

### Additional notes

* 