# orders-remote

The Orders micro-frontend — a standalone repository, independently built and
deployed, and composed into a separate host application at runtime via
[Module Federation](https://module-federation.io/). This repo has no
knowledge of, or dependency on, the host that eventually renders it.

This is one half of a two-repo demo architecture. The other half —
`platform-monorepo` — contains the host application (`shell`) plus two
statically-bundled widgets (`inventory`, `analytics`) that live in the same
build as the host. Orders is the one genuine micro-frontend in the system;
everything else is deliberately *not* federated, on the reasoning that
module federation earns its complexity only when a piece of UI needs to be
owned, built, and deployed by a separate team on a separate schedule.

## Why this is a separate repo

Splitting this out isn't just an architecture exercise — it's what forces
the interesting engineering decisions:

- **Shared UI has to be published, not just imported.** `@platform/shared-ui`
  (design tokens, theme system) lives in the other repo. Since there's no
  shared workspace linking the two, this repo consumes it as a real,
  versioned npm dependency — the same way it would in a real multi-team org.
- **Theme has to cross the boundary as data, not context.** React Context
  only works within one continuous render tree sharing one React instance.
  Since this app is loaded into a host it doesn't control, `OrdersDashboard`
  receives `theme` as an explicit prop instead — see `app/README.md` for the
  full reasoning.
- **Version alignment is a real, ongoing concern**, not a one-time setup
  step — the `shared: { react: { singleton: true } }` config in
  `app/vite.config.ts` exists specifically because two independently
  deployed apps could otherwise load two different React instances.

## Structure

| Workspace | What it is |
|---|---|
| [`server/`](./server) | Mock Express API for order data |
| [`app/`](./app) | The actual micro-frontend — React UI, exposed via Module Federation |

## Tech stack

- **Yarn 4 (Berry)** workspaces, `nodeLinker: node-modules`
- **React 19** + **TypeScript** (aliased to a TS6-compatible package for
  `ts-jest`/`typescript-eslint` — TypeScript 7's native compiler doesn't
  expose the API those tools need; see `app/README.md` for details)
- **Vite** + `@module-federation/vite`
- **Tailwind CSS v4**, token-based theming
- **Jest** + **React Testing Library**
- **Express** (mock API)

## Getting started

```bash
corepack enable
yarn install
```

Run both workspaces in separate terminals:

```bash
yarn workspace @orders/server dev    # http://localhost:4002
yarn workspace @orders/app dev       # http://localhost:5174
```

The `dev` command above runs the standalone dev harness (`app/src/App.tsx`)
— useful for working on `OrdersDashboard` in isolation. To test the *actual*
federation artifact this repo produces:

```bash
yarn workspace @orders/app build
yarn workspace @orders/app preview
curl http://localhost:5174/remoteEntry.js   # should return real JS, not a 404
```

## CI

Four independent jobs — Lint, Typecheck, Test, Build — run in parallel on
every push and pull request. See `.github/workflows/ci.yml`.

## Deployment

- **`app/`** → Vercel (Root Directory: `app`; Vercel auto-detects the Yarn
  workspace root for installs)
- **`server/`** → Render (Root Directory left blank — Render restricts file
  access to only the configured root directory, which would break workspace
  resolution; scoping is done via `yarn workspace @orders/server <script>`
  in the build/start commands instead, with `corepack enable &&` prefixed,
  since Render's build image doesn't have Corepack's Yarn Berry shim active
  by default)
