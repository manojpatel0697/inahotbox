# In A Hot Box

Vite + React + TanStack Router SPA deployed on Vercel.

## Stack
- **Framework:** Vite 6, React 19
- **Routing:** TanStack Router (file-based, SPA)
- **Styling:** Tailwind CSS v4
- **UI:** shadcn/ui (Radix primitives)
- **Testing:** Vitest + Testing Library

## Project conventions
- Routes live in `src/routes/`. The router plugin auto-generates `src/routeTree.gen.ts` — do not edit it by hand.
- Custom colours (`ink`, `cream`, `terracotta`, `coriander`, etc.) are defined in `src/styles.css` as CSS variables.
- Menu data and WhatsApp message builder are in `src/lib/menu.ts`.

## Deployment
Hosted on Vercel as a static SPA. `vercel.json` rewrites all routes to `index.html`.
Build command: `npm run build` (outputs to `dist/`).
