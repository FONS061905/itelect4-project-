Frontend scaffolding

This repository contains TypeScript server code and a set of React component files under `src/components` plus `src/App.tsx` as a UI scaffold.

To run the frontend locally you can create a small Vite React app and copy these files into `src/` of that project, or integrate into your existing React setup.

Quick setup (recommended):

1. Create a Vite React project alongside this repo (or inside it):

```bash
npx create-vite@latest frontend -- --template react-ts
cd frontend
npm install
```

2. Copy the `src/components` folder and `src/App.tsx` from this repo into the new `frontend/src` folder.

3. Update `frontend/package.json` proxy or run the backend on port 3000 and set `VITE_API_URL` accordingly. Or use a simple proxy in `vite.config.ts`.

4. Start backend from the root:

```bash
npm run start
```

5. Start frontend:

```bash
cd frontend
npm run dev
```

This UI includes:
- `StatusBadge` — colored badge for item lifecycle states.
- `Usercard` — compact user display.
- `ComplaintCard` — list card for items (title/location/summary).
- `App.tsx` — list/detail layout, SSE counts stream, claim flow, and simple generative suggestion call.
