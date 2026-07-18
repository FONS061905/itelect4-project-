# Lost & Found Tracker

A web-based lost and found tracker built with a TypeScript Express backend and a Vite React frontend. The app stores items, claims, and user roles in memory for demo and semester project purposes.

## Blueprints Defined (`types/index.ts`)
- **Core Entities**: `User`, `Item`, `Claim`
- **Generic Interface**: `ApiResponse<T>` (flexible response wrapper used across backend and frontend data models)
- **Utility Mapped Types**: `UserUpdate` (`Partial<User>`), `UserPreview` (`Pick<User, "id" | "name" | "role">`), `PublicUser` (`Omit<User, "email" | "isActive">`), `RoleCount` (`Record<"student" | "admin" | "security", number>`)
- **Enums**: `ItemStatus`, `ClaimStatus` in `src/models.ts`

## Installation & Execution Setup

1. Install root dependencies:

```bash
npm install
```

2. Install frontend dependencies:

```bash
cd frontend
npm install
```

3. Start the backend from the repo root:

```bash
npm run start:backend
```

4. Start the frontend in a separate terminal:

```bash
cd frontend
npm run dev
```

5. Open the frontend at:

```bash
http://localhost:5174/
```

The backend API runs on:

```bash
http://localhost:3000/
```

## Project Structure

- `src/server.ts` — Express backend, in-memory stores, SSE live counts, claim verification, and suggestion helper endpoint
- `src/models.ts` — shared application models and enums
- `types/index.ts` — TypeScript generics, utility types, and type aliases demonstrated for the app
- `frontend/src/App.tsx` — React UI with list/detail views, live count stream, and claim workflows
- `frontend/src/vite-env.d.ts` / `frontend/src/global.d.ts` — type declarations for Vite and CSS modules

## Key Features

- Item reporting and claim workflow
- Admin verification and item return transitions
- Server-sent events for live item and claim counts
- Generic TypeScript interfaces and utility type usage
- Strongly typed model definitions with strict mode support
- A simple generative description helper endpoint for item suggestions

## Available Scripts

- `npm run start` — runs `src/index.ts` via `ts-node`
- `npm run start:backend` — starts the backend server
- `npm run start:frontend` — starts the frontend dev server from the `frontend` folder

## Notes

- Ensure the backend is running on port `3000` for the frontend to connect correctly.
- The current implementation uses in-memory storage; data resets on restart.
