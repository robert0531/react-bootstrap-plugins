# react-bootstrap-plugins — Agent Guide

> **Package:** `react-bootstrap-plugins` | **Type:** ESM-first, tree-shakeable | **Build:** tsup + tsc
> **Peer deps:** react >=18, react-dom >=18 | **Styling:** Bootstrap 5 CSS variables (no JS dependency on Bootstrap)

---

## Architecture

```
react-bootstrap-plugins/
├── src/
│   ├── index.js                   # Barrel export — all components
│   ├── lib/
│   │   └── cn.js                  # Internal classname utility (no external deps)
│   ├── components/
│   │   ├── DatePicker.jsx         # Date/time/datetime picker — portaled popover
│   │   ├── DatePicker.d.ts        # TypeScript declarations
│   │   ├── SearchSelect.jsx       # Filterable searchable select dropdown
│   │   ├── SearchSelect.d.ts
│   │   ├── Label.jsx              # Form label with required indicator
│   │   └── Label.d.ts
│   └── css/
│       └── datepicker.css   # Required CSS for DatePicker
├── dist/                          # Build output (gitignored, shipped to npm)
├── tsup.config.ts                 # Build configuration
├── tsconfig.json                  # TypeScript config (DTS generation only)
├── package.json
├── README.md
└── CLAUDE.md
```

## Build System

### tsup (JS bundling)
- **Entries:** `index`, `DatePicker`, `SearchSelect`, `Label` — each component is a separate entry for tree-shaking
- **Formats:** ESM (`.js`) + CJS (`.cjs`)
- **External:** `react`, `react-dom`, `react/jsx-runtime` — never bundled
- **Splitting:** Enabled — shared `cn` utility is extracted to a shared chunk
- **Sourcemaps:** Enabled

### tsc (type declarations)
- Generates `.d.ts`, `.d.mts`, `.d.cts` via `tsconfig.json` with `allowJs: true`
- Root dir: `src/`, output: `dist/`

## Export Map Strategy

The `package.json` exports map provides three levels of access:

| Import Path | What You Get |
|---|---|
| `react-bootstrap-plugins` | Barrel — all three components |
| `react-bootstrap-plugins/DatePicker` | DatePicker only (tree-shaken) |
| `react-bootstrap-plugins/SearchSelect` | SearchSelect only |
| `react-bootstrap-plugins/Label` | Label only |
| `react-bootstrap-plugins/css/datepicker.css` | DatePicker CSS |

Each subpath export has `import` (ESM) and `require` (CJS) conditions, plus `types` for TypeScript.

## Key Conventions

### Code Style
- **Arrow functions only** — `const Component = () => {}`. Never `function Component() {}`.
- **Named exports** for multi-export components (`DatePicker`, `Label`).
- **Default export** for `SearchSelect` (kept for backward compat; re-exported as named via barrel).
- **kebab-case** file names, **PascalCase** components.
- **`.jsx` extension** for all files containing JSX.

### CSS Imports
The DatePicker CSS **must** be imported separately by consumers:
```js
import 'react-bootstrap-plugins/css/datepicker.css'
```
This is intentional — it gives consumers control over CSS loading order and allows CSS bundler optimizations.

### No `@/` Path Aliases
All internal imports use relative paths — never path aliases. The package must work without any bundler configuration on the consumer side.

### cn() Utility
The internal `cn()` utility handles:
- String arguments (joined with space)
- Conditional falsy filtering
- Nested arrays (flattened)
- Object syntax: `cn('base', { active: isActive })`

This replaces the `clsx` + `tailwind-merge` pattern used in the main app — the package has no Tailwind dependency.

### Peer Dependencies
- `react` >=18.0.0 — uses `React.forwardRef`, `React.useMemo`, hooks
- `react-dom` >=18.0.0 — uses `createPortal` (DatePicker)
- Bootstrap 5 CSS variables — required at runtime for styling (not a JS dependency)

## Adding a New Component

1. Create `src/components/NewComponent.jsx` with the component
2. Create `src/components/NewComponent.d.ts` with TypeScript declarations
3. Add entry to `tsup.config.ts`:
   ```ts
   entry: {
     // ...existing
     NewComponent: 'src/components/NewComponent.jsx',
   }
   ```
4. Add to `package.json` exports map:
   ```json
   "./NewComponent": {
     "import": { "types": "./dist/NewComponent.d.mts", "default": "./dist/NewComponent.js" },
     "require": { "types": "./dist/NewComponent.d.cts", "default": "./dist/NewComponent.cjs" }
   }
   ```
5. Add to barrel export in `src/index.js`
6. Document in README.md

## Publishing Checklist

1. `pnpm install` — ensure clean install
2. `pnpm run build` — verify build succeeds
3. Check `dist/` output:
   - `.js` and `.cjs` files for each entry
   - `.d.ts`, `.d.mts`, `.d.cts` for each entry
   - `css/datepicker.css` exists
   - Shared chunks for `cn` utility
4. `pnpm publish --dry-run` — verify package contents
5. `pnpm publish` — publish to npm

## Common Pitfalls

| # | Pitfall | Fix |
|---|---|---|
| 1 | Adding a dependency not in `external` | `react`, `react-dom`, and `react/jsx-runtime` must stay in tsup `external` |
| 2 | Using `@/` path aliases | Always use relative imports (`../lib/cn.js`) |
| 3 | Forgetting CSS import | DatePicker renders without CSS — users must `import 'react-bootstrap-plugins/css/datepicker.css'` |
| 4 | Missing export map entry | Each new component needs `package.json` exports updated |
| 5 | Forgetting `sideEffects` update | CSS files must be listed in `sideEffects` for tree-shaking to work |
| 6 | Using `export default` for new components | Prefer named exports; re-export in barrel with `{ default as X }` if needed |
