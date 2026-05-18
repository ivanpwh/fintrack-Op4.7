# FinTrack Platform — Web + Backend

Full-stack pencatatan keuangan: Next.js (App Router) frontend dengan Prisma + SQLite backend via Route Handlers. Implements the FinTrack PRD (transactions, accounts, AI parsing, subscription tier, settings) with a single demo user (no auth).

## Stack
- **Frontend:** Next.js 14, Tailwind CSS (shadcn-style emerald palette), Zustand (UI/session state), TanStack Query (server cache), Recharts, lucide-react.
- **Backend:** Next.js Route Handlers, Prisma 5, SQLite (swap `provider` to `postgresql` for production).
- **AI parsing:** server-side regex parser (`POST /api/ai/parse`) — drop-in replacement for OpenRouter / LiteLLM later.

## API
| Method | Path | Description |
|---|---|---|
| GET | `/api/me` | Demo user identity + tier (`free`/`premium`). |
| PATCH | `/api/me` | Update tier or telegramId. |
| GET | `/api/accounts` | List accounts for demo user. |
| POST | `/api/accounts` | Create account. Free tier capped at 1 INVESTMENT. |
| GET | `/api/transactions` | List transactions, newest first. |
| POST | `/api/transactions` | Create transaction (balances updated atomically). |
| DELETE | `/api/transactions/:id` | Delete transaction (balances reverted). |
| POST | `/api/ai/parse` | `{ text }` → `{ parsed, model, latencyMs }`. |

## Dev setup
```bash
npm install              # installs deps; also runs prisma generate
npm run db:setup         # prisma db push + seed (demo user + 3 accounts + 8 txs)
npm run dev              # http://localhost:3000
```

The seed creates:
- `demo@fintrack.app` (free tier)
- Accounts: BCA, Cash, Reksadana
- 8 sample transactions across the last 20 days

## Replacing SQLite with Postgres
1. Set `DATABASE_URL` to your Postgres URL.
2. Change `provider = "sqlite"` to `"postgresql"` in `prisma/schema.prisma`.
3. `npx prisma migrate dev`.

## No-auth notes
There is intentionally no authentication. All routes resolve the same demo user via `getOrCreateDemoUser()` in `src/lib/db.ts`. The Zustand store still gates `/app/*` behind a "signed in" flag — clicking *Sign in with Google* simply calls `/api/me` and stores the returned profile so the UI feels real. Drop in NextAuth / Passport Google strategy later by replacing that helper.
