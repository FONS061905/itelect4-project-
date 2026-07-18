Lost & Found Tracker Frontend

This repository contains a working Lost & Found tracker app with a TypeScript Express backend and a Vite React frontend.

The app includes:
- `src/models.ts` — shared TypeScript models for users, items, claims, and status enums.
- `src/server.ts` — backend API with in-memory stores, claim workflows, SSE counts, and a suggestion endpoint.
- `frontend/src/App.tsx` — React UI with list/detail layout, live counts via EventSource, and claim interactions.
- `frontend/src/components` — reusable UI components for item cards, user cards, and status badges.

How to run this app:

1. Start the backend from the repo root:

```bash
npm run start:backend
```

2. Start the frontend from the `frontend` folder:

```bash
cd frontend
npm install
npm run dev
```

3. Open the frontend in your browser at:

```bash
http://localhost:5174/
```

4. The backend API is available at:

```bash
http://localhost:3000/
```

If the frontend still needs to connect to the backend, make sure the backend runs on port `3000` and that `frontend/vite.config.ts` proxies `/api` to `http://localhost:3000`.

What this app demonstrates:
- A list/detail interface for lost and found items
- User roles with `student`, `security`, and `admin`
- Item and claim status enums for lifecycle states
- Live count updates using server-sent events
- Generic TypeScript types, utility type aliases, and strict mode support
- A simple generative description suggestion endpoint
