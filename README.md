# FoodFusion (React version)

Your original FoodFusion site, rebuilt with **React + Vite**. Same look, same features
(login, menu, cart, orders, live tracking, admin, price comparison, FusionBot).

```
npm install      # once: downloads React, Vite, Supabase
npm run dev      # development server at http://localhost:5173 (auto-reloads when you save)
npm run build    # makes the production site in /dist
npm run preview  # try the production build locally
```

`original-vanilla/` is your old HTML/JS version, kept so you can compare. Read **CHANGES.md** first.

## Deploy
- **GitHub Pages:** push to GitHub (branch `main`), then Settings -> Pages -> Source = "GitHub Actions". The included workflow does the rest.
- **Vercel / Netlify:** "Import project" from your GitHub repo. Build command `npm run build`, output folder `dist`.

## Supabase
Copy `.env.example` to `.env` to use your own project. The key is a *publishable* key (safe in a browser),
but only if **Row Level Security is enabled** on your tables, so check that in the Supabase dashboard.
