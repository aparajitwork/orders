# @orders/server

A small Express + TypeScript API standing in for a real orders backend
during frontend development. Exists purely to give `app/`'s
`OrdersDashboard` something real to fetch from, with realistic latency and
failure modes to develop against.

## Endpoints

| Method | Path | Notes |
|---|---|---|
| GET | `/health` | Basic liveness check |
| GET | `/api/orders` | Optional `status` query param: `pending`, `processing`, `shipped`, `delivered`, `cancelled` |
| GET | `/api/orders/:id` | 404 with `{ "error": "Order not found" }` if the id doesn't exist |

Every endpoint has a randomized 200–700ms delay (`src/utils/delay.ts`),
deliberately — an instant mock response never exercises a loading skeleton,
and this project's frontend work depended on genuinely seeing those states.

## Structure

```
src/
  index.ts          # Express app setup, CORS, route mounting
  routes/
    orders.ts        # GET /, GET /:id — filtering and 404 handling
  data/
    orders.ts         # In-memory mock dataset
  utils/
    delay.ts           # randomDelay() helper
```

## Scripts

| Script | What it does |
|---|---|
| `yarn dev` | Runs the server with `tsx watch`, auto-restarting on changes |
| `yarn build` | Compiles to `dist/` via `tsc` |
| `yarn start` | Runs the compiled output (`node dist/index.js`) — used in production |
| `yarn lint` | ESLint, flat config, Node-flavored (no React rules) |
| `yarn typecheck` | `tsc --noEmit`, full type-check with no emit |

**No test suite yet** — this was built before `apps/mock-api` in the other
repo, which does have full `supertest` coverage for its equivalent routes.
Worth treating as a known gap rather than an oversight: if this project
continued, backporting that same testing approach here would be the
obvious next step.

## Configuration

Runs on port `4002` by default; override with the `PORT` environment
variable (Render, and most PaaS providers, set this automatically).
