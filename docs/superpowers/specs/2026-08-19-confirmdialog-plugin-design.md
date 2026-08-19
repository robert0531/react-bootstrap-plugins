# ConfirmDialog Plugin — Design Spec

> **Date:** 2026-08-19 | **Status:** Approved | **Package:** react-bootstrap-plugins

## Overview

Add a `ConfirmDialog` component to `react-bootstrap-plugins` — a zero-dependency Bootstrap 5 confirmation modal with async loading state. Derived from the local `ConfirmDialog` used in `CBCAlevelReviewResults.jsx` of the SwiftPlus portal, restyled to a "Refined Minimal" premium direction (soft radius, thin border, variant-colored dot + left rule on the message).

**Decisions made during brainstorming:**

- Style direction: **B — Refined Minimal** (user-selected over Ledger Register and Dispatch Notice mockups).
- Rendering approach: **Bootstrap 5 modal markup via `createPortal`** — no react-bootstrap, no native `<dialog>`, preserving the package's zero-runtime-dependency contract.
- Features beyond the `nextPlugins.md` spec: **async loading state only**. Escape-close and static backdrop are baseline accessibility, not premium extras.
- **No animation** — dialog mounts/unmounts instantly with `show` (user decision).
- Scope: build the plugin **and** migrate the portal usage in `CBCAlevelReviewResults.jsx`.

## API Design

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `show` | `boolean` | required | Visibility — fully controlled by the caller |
| `title` | `ReactNode` | required | Dialog title |
| `message` | `ReactNode` | required | Body message (string or JSX) |
| `onConfirm` | `() => void \| Promise<void>` | required | Fired on confirm; may return a promise to drive the loading state |
| `onCancel` | `() => void` | required | Fired on Cancel button or Escape key |
| `label` | `ReactNode` | `"Confirm"` | Confirm button label |
| `variant` | `"primary" \| "danger" \| "success" \| "warning" \| "info"` | `"primary"` | Bootstrap color variant for the confirm button, dot, and message rule |
| `className` | `string` | — | Extra CSS classes on the dialog |

### Async contract

- On confirm click: set pending, `await onConfirm()`, reset pending (try/finally — no catch).
- Pending state: `spinner-border spinner-border-sm` inside the confirm button, both buttons disabled, Escape ignored.
- On rejection: pending resets, dialog stays open, error propagates to the caller (callers handle their own error toasts inside `onConfirm`).

### Controlled pattern

The plugin never closes itself. Callers close by setting `show={false}` — matches the existing usage where `handleDelete` clears `deleteConfirm` after the API call succeeds.

## DOM Structure

```html
<div class="confirmdialog-backdrop"></div>                <!-- portaled to document.body -->
<div class="modal confirmdialog d-block" role="dialog" aria-modal="true"
     aria-labelledby="cd-title" aria-describedby="cd-message" tabindex="-1">
  <div class="modal-dialog modal-dialog-centered modal-sm">
    <div class="modal-content">
      <div class="confirmdialog-header">
        <span class="confirmdialog-dot bg-{variant}" aria-hidden="true"></span>
        <h5 class="modal-title" id="cd-title">{title}</h5>
      </div>
      <div class="confirmdialog-body" id="cd-message">{message}</div>
      <div class="confirmdialog-footer">
        <button type="button" class="btn btn-light"      onClick={onCancel}>Cancel</button>
        <button type="button" class="btn btn-{variant}"  onClick={handleConfirm}>
          {pending && <span class="spinner-border spinner-border-sm me-2" />}
          {label}
        </button>
      </div>
    </div>
  </div>
</div>
```

Rendered via `createPortal(…, document.body)`. When `show` is `false`, nothing is rendered. No close ✕ button (confirm dialogs are resolved through the two actions). Unique ids via `React.useId()` to avoid collisions between multiple mounted dialogs.

## Behavior

- **Backdrop click does nothing** — preserves the portal's current `backdrop="static"` behavior for destructive confirms.
- **Escape** fires `onCancel`, except while pending.
- **Focus management**:
  - On open: focus the confirm button (the primary action).
  - Trap: Tab / Shift+Tab cycle within the dialog (header, body, footer buttons) via a keydown handler on the dialog root.
- **Scroll lock**: set `document.body.style.overflow = "hidden"` while open; restore previous value on close; compensate `padding-right` when the scrollbar disappears.
- **Cleanup**: all listeners and body styles restored in the unmount cleanup.

## Styling (plugins.css)

Appended to `src/css/plugins.css` under a `/* ConfirmDialog */` section, prefixed `.confirmdialog-*`, all colors via Bootstrap 5 CSS variables (theme-aware — dark mode works for free):

| Element | Treatment |
|---|---|
| Backdrop | Fixed, full-viewport, `background: rgba(0, 0, 0, 0.5)` (as CSS var default), `z-index: 1050` (below Bootstrap modal z-index 1055) |
| `.modal-content` | `border-radius: 12px`, `1px solid var(--bs-border-color)`, soft shadow `0 12px 40px rgba(0,0,0,.15)` |
| Header | Padding `16px 18px 12px`, no bottom border; inline 8px round dot using Bootstrap `bg-{variant}` class; semibold title |
| Body | Message in `var(--bs-secondary-color)`-ish muted text, `3px solid` left rule in the variant color, `padding: 4px 18px 16px 34px` (indented past the rule) |
| Footer | Padding `12px 18px 16px`, no top border, `justify-content: flex-end`, gap `8px` |
| Buttons | Native Bootstrap classes: `btn btn-light` (Cancel), `btn btn-{variant}` (Confirm, `fw-semibold`) |

Consumers must import `react-bootstrap-plugins/css/plugins.css` (same rule as DatePicker/SearchSelect) and have Bootstrap 5 CSS loaded.

## Package Wiring

| File | Change |
|---|---|
| `src/components/ConfirmDialog.tsx` | New component — arrow function + `forwardRef`, named + default export, `displayName` |
| `src/css/plugins.css` | Append `.confirmdialog-*` styles |
| `tsup.config.ts` | Add entry `ConfirmDialog: 'src/components/ConfirmDialog.tsx'` |
| `package.json` | Add `./ConfirmDialog` export map entry (import/require + types); keywords `confirm-dialog`, `confirmation`, `modal`; bump version `2.6.0 → 2.7.0` |
| `src/index.ts` | Barrel export |
| `docs/CONFIRMDIALOG.md` | Component doc — API table, usage, CSS import note |
| `README.md` | Add to component list |

Follow the package conventions: relative imports only (no `@/`), internal `cn()` from `../lib/cn.js`, no new dependencies.

## Portal Migration (allios-swiftplus-dashboard)

1. `src/views/academics/CBCAlevelReviewResults.jsx`:
   - Delete the local `ConfirmDialog` component (lines 150–166).
   - Import `ConfirmDialog` from `react-bootstrap-plugins/ConfirmDialog`.
   - At the call site: rename `confirmLabel` → `label`; `show`, `title`, `message`, `variant="danger"`, `onConfirm`, `onCancel` unchanged.
2. Confirm `react-bootstrap-plugins/css/plugins.css` is imported in the portal (check `src/index.css` / layout); add if missing.
3. Bump the portal's installed package to `2.7.0` (`pnpm add react-bootstrap-plugins@latest`).

## Verification

- `pnpm run build` in `react-bootstrap-plugins` must pass (tsup bundles ESM+CJS, generates `.d.ts`/`.d.mts`/`.d.cts`, CSS copied by `scripts/build-css.mjs`).
- `pnpm publish --dry-run` shows the new entry files.
- Live smoke check in the portal (user runs the app): open the delete dialog on the CBC A-Level results page — confirm loading spinner on async delete, Escape cancel, backdrop click does nothing, Tab cycles within the dialog, dark mode renders correctly.
- No unit-test framework exists in the package (`"test": "echo 'Tests passed'"`) — verified by build + smoke check instead of the testing pyramid. **Documented deviation.**

## Out of Scope

- Sizes beyond `modal-sm` (spec doesn't mention them; current usage is `size="sm"`).
- A close ✕ button, header icons beyond the variant dot, footer customization slots.
- Migration of any other local confirm modals in the portal (future follow-up).
