# @orders/app

The actual Orders micro-frontend. A React + TypeScript + Vite app that
exposes one component — `OrdersDashboard` — via Module Federation, for a
separate host application to load at runtime.

## The three decisions that make this a genuine micro-frontend

**1. `OrdersDashboard` is a default export, not named.**

```tsx
// src/OrdersDashboard.tsx
export default function OrdersDashboard({ theme }: OrdersDashboardProps) { ... }
```

This isn't a style preference — it's required by how `@module-federation/vite`
hosts consume a remote. The documented pattern is a plain
`lazy(() => import("orders/OrdersDashboard"))`, with no manual unwrapping.
That only resolves correctly against a `default` export; a named export
required extra `.then()` wrapping on the host side that, in practice, didn't
reliably interoperate with the federation runtime's returned module shape.

**2. Theme arrives as an explicit prop, never global state.**

```tsx
export type Theme = "light" | "dark";
type OrdersDashboardProps = { theme: Theme };
```

The host's `packages/shared-ui` uses a React Context (`ThemeProvider`/
`useTheme`) for its *own* in-repo widgets — safe there because those widgets
share one continuous render tree and one React instance with the host.
Orders can't assume that. It receives `theme` as data and applies it to its
own wrapper (`data-theme={theme}`), scoped to its own subtree, rather than
mutating anything global it doesn't own.

**3. `shared: { react: { singleton: true } }` in `vite.config.ts`.**

Without this, the host and this remote could each load their own copy of
React — and two React instances trying to manage overlapping component
trees fails in confusing, hooks-related ways at runtime, not at build time.

## Module Federation config

```ts
federation({
  name: "orders",
  filename: "remoteEntry.js",
  exposes: { "./OrdersDashboard": "./src/OrdersDashboard.tsx" },
  shared: {
    react: { singleton: true },
    "react-dom": { singleton: true },
  },
})
```

## Environment variables

| Variable | Used by | Purpose |
|---|---|---|
| `VITE_ORDERS_API_URL` | `src/api/orders.ts`, at runtime, in the browser | Base URL of the orders API |

See `.env.example`.

## Why `typecheck` and `test` use different `tsconfig`s

`src/api/orders.ts` reads `import.meta.env.VITE_ORDERS_API_URL` — valid
syntax only under an ESM module target. `ts-jest`'s test transform needs
`module: "CommonJS"` to actually run under Jest. Reusing one config for
both would make one of the two fail, so:

- `tsconfig.jest.json` — CommonJS, used only by `ts-jest`'s transform
- `tsconfig.typecheck.json` — extends the app's real (ESM) config, used
  only for a standalone `tsc --noEmit` pass that also covers test files
  and `jest.setup.ts` (which `tsconfig.app.json` deliberately excludes,
  since `tsc -b`'s real build has no business type-checking test files)

## Scripts

| Script | What it does |
|---|---|
| `yarn dev` | Vite dev server, standalone harness at `App.tsx` |
| `yarn build` | `tsc -b && vite build` — also what produces the real `remoteEntry.js` |
| `yarn preview` | Serves the built output statically — the correct way to verify federation actually works, since a dev server doesn't produce the same packaged artifact |
| `yarn lint` | ESLint, flat config |
| `yarn typecheck` | Full project type-check, including test files |
| `yarn test` | Jest + React Testing Library |

## Testing notes

`OrdersDashboard.test.tsx` covers all four states of its `LoadState`
discriminated union: loading, success, empty, and error-with-retry. The
retry flow specifically tests that clicking Retry re-fetches without a full
remount — a `reloadKey` state bump, batched with the loading-state reset in
the *same* event handler (not inside the effect itself, which would trigger
an avoidable extra render — see `react-hooks/set-state-in-effect`).
