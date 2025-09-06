# About Chris (for engineers / AI assistants)

## Who I am
- Product Director (non-technical) who builds real apps using AI coding tools.  
- I value **clarity, simplicity, and speed** — I learn by shipping.  
- I don’t know how to code traditionally, but I use AI to “vibe code” (build apps without deep technical knowledge).  
- I understand product strategy, UX, and workflows. I need engineering details translated into plain English.  

## Project Goals
- I have a hard-coded static trip site today at https://trips.chrisaug.com. I want to build a v2 of that site (at trips-app.chrisaug.com) that is a real, working app that helps me plan and refine AI-generated itineraries that I can then share publicly for me and others to view before, during and after trips.
- Keep public pages visually identical to my current trips site.  
- Use Netlify, Next.js (App Router), Supabase, and OpenAI (gpt-4o-mini).  
- Break work into small, sequential tasks with clear checklists.

## Collaboration Preferences
- After each task, provide a 30-second “did it work?” checklist.  
- Recommend defaults if there are multiple options.  
- Keep explanations non-technical.  
- I prefer to work in the Cursor UI for most things rather than the terminal (unless it's for very very simple things like starting a dev server from terminal).

## Guardrails
- Don’t expose secrets to the client.  
- Don’t change public site styling (relative to my original trips site) without explicit approval.  
- Use Zod + Structured Outputs for AI. Fail safely with helpful errors.  

## Nice-to-haves (future)
- POI enrichment, alternate “rain plans,” PDF exports, budget/time roll-ups.