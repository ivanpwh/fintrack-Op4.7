# FinTrack Platform — Web Frontend

Next.js (App Router) frontend implementing the FinTrack PRD: pencatatan keuangan lintas perangkat dengan Google SSO, Telegram binding, AI parsing, subscription tiering, dan dashboard analitik.

## Stack
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS (dark mode via `class`)
- Zustand (persisted client store, ready to swap with React Query + REST backend)
- Recharts for dashboard charts
- lucide-react icons

## Pages
- `/` — Landing
- `/login` — Google SSO (simulated)
- `/maintenance` — System status / maintenance lock
- `/app` — Dashboard analytics (cashflow, category pie, balance KPIs)
- `/app/transactions` — Riwayat + filter
- `/app/transactions/new` — Form manual + Smart Input (regex parser, AI fallback ready)
- `/app/accounts` — CRUD akun (CASH/BANK/INVESTMENT/ASSET) + free-tier limit
- `/app/pricing` — Free vs Premium matrix
- `/app/settings` — Dark mode, locale (ID/EN/JA), Telegram binding code, Developer Mode (custom endpoint + API key, latency test), maintenance toggle

## Dev
```bash
npm install
npm run dev
```
Open http://localhost:3000.

State is persisted to `localStorage` under `fintrack-store`. Wire the action creators in `src/lib/store.ts` to the NestJS backend when ready.
