# In A Hot Box

Ordering site for Wafa's small-batch home kitchen in Bengaluru. Customers browse dishes, build a cart, and send a pre-filled WhatsApp order directly to the kitchen.

**Live on:** Vercel  
**Built by:** [Theramify](https://theramify.in)

## Stack

- Vite 6 + React 19
- TanStack Router (file-based, SPA)
- Tailwind CSS v4
- shadcn/ui (Radix primitives)
- Sonner (toasts)

## Local development

Requires Node.js ≥ 18 and either `npm`, `pnpm`, or `bun`.

```sh
git clone <repo-url>
cd in-a-hot-box-main
npm install      # or bun install / pnpm install
npm run dev
```

App runs at `http://localhost:5173`.

## Build & deploy

```sh
npm run build    # outputs to dist/
```

Vercel auto-detects Vite. No extra configuration needed beyond the `vercel.json` already in the repo (rewrites all paths to `index.html` for SPA routing).

## Project structure

```
src/
  routes/
    __root.tsx      — root layout, error/404 boundaries
    index.tsx       — the entire storefront (menu, cart, checkout drawer)
  lib/
    menu.ts         — dish data, cart types, WhatsApp message builder
    utils.ts        — cn() helper
  components/ui/    — shadcn/ui primitives
  styles.css        — Tailwind v4 config + design tokens
  main.tsx          — app entry
  router.tsx        — TanStack Router instance
```

## Customising

- **Menu items / prices:** edit `src/lib/menu.ts`.
- **WhatsApp number:** change `PHONE` in `src/lib/menu.ts`.
- **Colours:** CSS variables in the `:root` block of `src/styles.css`.
