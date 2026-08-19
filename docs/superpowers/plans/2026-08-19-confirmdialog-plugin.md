# ConfirmDialog Plugin Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a premium zero-dependency `ConfirmDialog` component to react-bootstrap-plugins and migrate the portal's local ConfirmDialog in CBCAlevelReviewResults.jsx to it.

**Architecture:** Bootstrap 5 modal markup rendered via `createPortal` to `document.body` — backdrop div + `.modal > .modal-dialog.modal-dialog-centered.modal-sm > .modal-content`. No react-bootstrap, no animation, fully controlled via `show`. "Refined Minimal" premium styling appended to `src/css/plugins.css`. Async `onConfirm` drives a pending spinner state.

**Tech Stack:** TypeScript + React 18 (forwardRef, hooks), Bootstrap 5 CSS (classes + CSS variables), tsup build, pnpm.

**Testing note (documented deviation, spec-approved):** the package has no test runner (`"test": "echo 'Tests passed'"`). Verification = `pnpm run build` (tsup + dts + CSS) after each task, plus a live smoke checklist in the portal at the end. No vitest is added.

**Spec:** `docs/superpowers/specs/2026-08-19-confirmdialog-plugin-design.md`

---

### Task 1: ConfirmDialog component

**Files:**
- Create: `/media/robert/Development/Allios Apps/allios-global/react-bootstrap-plugins/src/components/ConfirmDialog.tsx`

- [ ] **Step 1: Write the component**

```tsx
import * as React from 'react'
import { createPortal } from 'react-dom'
import { cn } from '../lib/cn.js'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type ConfirmDialogVariant = 'primary' | 'danger' | 'success' | 'warning' | 'info'

export interface ConfirmDialogProps {
  /** Visibility — fully controlled by the caller */
  show: boolean
  /** Dialog title */
  title: React.ReactNode
  /** Body message (string or JSX) */
  message: React.ReactNode
  /**
   * Fired when the confirm button is clicked. May return a promise —
   * the dialog shows a pending spinner until it resolves.
   * On rejection the dialog stays open and the error propagates;
   * callers handle their own error display inside `onConfirm`.
   */
  onConfirm: () => void | Promise<void>
  /** Fired on the Cancel button or the Escape key */
  onCancel: () => void
  /** Confirm button label */
  label?: React.ReactNode
  /** Bootstrap color variant for the confirm button, header dot, and message rule */
  variant?: ConfirmDialogVariant
  /** Extra CSS classes on the dialog element */
  className?: string
}

/* ------------------------------------------------------------------ */
/*  ConfirmDialog                                                      */
/* ------------------------------------------------------------------ */

/**
 * Zero-dependency Bootstrap 5 confirmation dialog.
 *
 * Renders standard `.modal` markup portaled to `document.body` with its own
 * backdrop — no react-bootstrap required. Backdrop clicks do nothing;
 * Escape fires `onCancel`; focus is trapped inside the dialog and lands on
 * the confirm button on open. Body scroll is locked while shown.
 *
 * **Important:** the accompanying CSS **must** be imported for the premium
 * styling (backdrop, radius, header dot, message rule):
 * ```js
 * import 'react-bootstrap-plugins/css/plugins.css'
 * ```
 */
const ConfirmDialog = React.forwardRef<HTMLDivElement, ConfirmDialogProps>(({
  show = false,
  title,
  message,
  onConfirm,
  onCancel,
  label = 'Confirm',
  variant = 'primary',
  className,
}, ref) => {
  const [isPending, setIsPending] = React.useState(false)
  const titleId = React.useId()
  const messageId = React.useId()
  const dialogRef = React.useRef<HTMLDivElement>(null)
  const confirmRef = React.useRef<HTMLButtonElement>(null)

  /* Focus the primary action when the dialog opens */
  React.useEffect(() => {
    if (show) confirmRef.current?.focus()
  }, [show])

  /* Body scroll lock while shown (compensate scrollbar disappearance) */
  React.useEffect(() => {
    if (!show) return
    const { body } = document
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    const prevOverflow = body.style.overflow
    const prevPaddingRight = body.style.paddingRight
    body.style.overflow = 'hidden'
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`
    return () => {
      body.style.overflow = prevOverflow
      body.style.paddingRight = prevPaddingRight
    }
  }, [show])

  /* Escape closes (unless a confirm is pending) */
  React.useEffect(() => {
    if (!show) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isPending) onCancel()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [show, isPending, onCancel])

  /* Tab / Shift+Tab cycle within the dialog */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Tab') return
    const root = dialogRef.current
    if (!root) return
    const focusables = Array.from(
      root.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
    ).filter((el) => !el.hasAttribute('disabled'))
    if (!focusables.length) return
    const first = focusables[0]
    const last = focusables[focusables.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  const handleConfirmClick = async () => {
    if (isPending) return
    setIsPending(true)
    try {
      await onConfirm()
    } finally {
      setIsPending(false)
    }
  }

  if (!show || typeof document === 'undefined') return null

  return createPortal(
    <>
      <div className="confirmdialog-backdrop" aria-hidden="true" />
      <div
        ref={ref}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={messageId}
        className={cn('modal confirmdialog d-block', className)}
        onKeyDown={handleKeyDown}
      >
        <div ref={dialogRef} className="modal-dialog modal-dialog-centered modal-sm">
          <div className="modal-content">
            <div className="confirmdialog-header">
              <span className={cn('confirmdialog-dot', `bg-${variant}`)} aria-hidden="true" />
              <h5 className="modal-title" id={titleId}>{title}</h5>
            </div>
            <div
              id={messageId}
              className={cn('confirmdialog-body border-start border-3', `border-${variant}`)}
            >
              {message}
            </div>
            <div className="confirmdialog-footer">
              <button type="button" className="btn btn-light" onClick={onCancel} disabled={isPending}>
                Cancel
              </button>
              <button
                ref={confirmRef}
                type="button"
                className={cn('btn', `btn-${variant}`, 'fw-semibold')}
                onClick={handleConfirmClick}
                disabled={isPending}
              >
                {isPending && <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />}
                {label}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body
  )
})

ConfirmDialog.displayName = 'ConfirmDialog'

export { ConfirmDialog }
export default ConfirmDialog
```

- [ ] **Step 2: Verify types compile**

Run: `cd "/media/robert/Development/Allios Apps/allios-global/react-bootstrap-plugins" && pnpm run build:types`
Expected: exit 0, `DTS Build success`

- [ ] **Step 3: Commit**

```bash
git add src/components/ConfirmDialog.tsx
git commit -m "feat: add ConfirmDialog component"
```

---

### Task 2: ConfirmDialog styles

**Files:**
- Modify: `/media/robert/Development/Allios Apps/allios-global/react-bootstrap-plugins/src/css/plugins.css` (append at end of file)

- [ ] **Step 1: Append the ConfirmDialog CSS section**

Append exactly this to the end of `src/css/plugins.css`:

```css
/* ==========================================================================
   ConfirmDialog — "Refined Minimal" premium confirmation dialog
   Bootstrap 5 modal markup portaled to document.body. Theme-aware via
   --bs-* variables (dark mode works automatically).
   ========================================================================== */

.confirmdialog-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1050;
  background: rgba(0, 0, 0, 0.5);
}

.confirmdialog .modal-content {
  border: 1px solid var(--bs-border-color, #dee2e6);
  border-radius: 12px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.confirmdialog-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 18px 12px;
}

.confirmdialog-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.confirmdialog-header .modal-title {
  font-weight: 600;
}

.confirmdialog-body {
  padding: 4px 18px 16px 34px;
  color: var(--bs-secondary-color, #6c757d);
  font-size: 0.875rem;
  line-height: 1.55;
}

.confirmdialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 12px 18px 16px;
}
```

- [ ] **Step 2: Verify CSS builds**

Run: `cd "/media/robert/Development/Allios Apps/allios-global/react-bootstrap-plugins" && pnpm run build`
Expected: exit 0, output includes `✓ plugins.css (minified)` and `CSS built successfully.`

- [ ] **Step 3: Commit**

```bash
git add src/css/plugins.css
git commit -m "style: add ConfirmDialog premium styles"
```

---

### Task 3: Package wiring

**Files:**
- Modify: `/media/robert/Development/Allios Apps/allios-global/react-bootstrap-plugins/tsup.config.ts`
- Modify: `/media/robert/Development/Allios Apps/allios-global/react-bootstrap-plugins/package.json`
- Modify: `/media/robert/Development/Allios Apps/allios-global/react-bootstrap-plugins/src/index.ts`

- [ ] **Step 1: Add tsup entry**

In `tsup.config.ts`, add one line to the `entry` object after the `FormRow` line:

```ts
    ConfirmDialog: 'src/components/ConfirmDialog.tsx',
```

- [ ] **Step 2: Add exports map entry**

In `package.json`, after the `"./FormRow"` block (it ends with `},`), add:

```json
    "./ConfirmDialog": {
      "import": {
        "types": "./dist/ConfirmDialog.d.ts",
        "default": "./dist/ConfirmDialog.js"
      },
      "require": {
        "types": "./dist/ConfirmDialog.d.ts",
        "default": "./dist/ConfirmDialog.cjs"
      }
    },
```

- [ ] **Step 3: Bump version**

In `package.json`, change `"version": "2.6.0"` to `"version": "2.7.0"`.

- [ ] **Step 4: Add keywords**

In `package.json`, in the `keywords` array, add before `"ui-components"`:

```json
    "confirm-dialog",
    "confirmation",
    "modal",
```

- [ ] **Step 5: Barrel export**

In `src/index.ts`, after the `FormRow` export lines, add:

```ts
export { ConfirmDialog } from './components/ConfirmDialog.js'
```

and after the `FormRowProps` type export line:

```ts
export type { ConfirmDialogProps, ConfirmDialogVariant } from './components/ConfirmDialog.js'
```

- [ ] **Step 6: Verify full build and dist output**

Run: `cd "/media/robert/Development/Allios Apps/allios-global/react-bootstrap-plugins" && pnpm run build && ls dist/ConfirmDialog.*`
Expected: exit 0, and output lists exactly `ConfirmDialog.cjs`, `ConfirmDialog.d.cts`, `ConfirmDialog.d.mts`, `ConfirmDialog.d.ts`, `ConfirmDialog.js`

- [ ] **Step 7: Commit**

```bash
git add tsup.config.ts package.json src/index.ts
git commit -m "feat: wire ConfirmDialog into build, exports, and barrel"
```

---

### Task 4: Documentation

**Files:**
- Create: `/media/robert/Development/Allios Apps/allios-global/react-bootstrap-plugins/docs/CONFIRMDIALOG.md`
- Modify: `/media/robert/Development/Allios Apps/allios-global/react-bootstrap-plugins/README.md`

- [ ] **Step 1: Write the component guide**

Create `docs/CONFIRMDIALOG.md`:

```markdown
# ConfirmDialog

Zero-dependency Bootstrap 5 confirmation dialog with async loading state. Premium "Refined Minimal" styling — soft radius, variant-colored header dot, variant rule on the message.

## Import

```js
import ConfirmDialog from 'react-bootstrap-plugins/ConfirmDialog'
// or
import { ConfirmDialog } from 'react-bootstrap-plugins'
// Required CSS
import 'react-bootstrap-plugins/css/plugins.css'
```

Requires Bootstrap 5 CSS loaded in your app.

## Usage

```jsx
const [deleteTarget, setDeleteTarget] = useState(null)

<ConfirmDialog
  show={!!deleteTarget}
  title="Delete Report Card"
  message="Are you sure you want to delete this report card? This action cannot be undone."
  label="Confirm Delete"
  variant="danger"
  onConfirm={async () => {
    await deleteReportCard(deleteTarget.id)   // spinner shows until this settles
    setDeleteTarget(null)                      // caller controls closing
  }}
  onCancel={() => setDeleteTarget(null)}
/>
```

The dialog is fully controlled: it never closes itself. Close by setting `show={false}`.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `show` | `boolean` | required | Visibility — controlled by the caller |
| `title` | `ReactNode` | required | Dialog title |
| `message` | `ReactNode` | required | Body message (string or JSX) |
| `onConfirm` | `() => void \| Promise<void>` | required | Fired on confirm. A returned promise drives the pending spinner; on rejection the dialog stays open and the error propagates — handle error display (toasts) inside `onConfirm` |
| `onCancel` | `() => void` | required | Fired on the Cancel button or Escape key |
| `label` | `ReactNode` | `"Confirm"` | Confirm button label |
| `variant` | `"primary" \| "danger" \| "success" \| "warning" \| "info"` | `"primary"` | Color variant for the confirm button, header dot, and message rule |
| `className` | `string` | — | Extra classes on the dialog element |

## Behavior

- **Backdrop click does nothing** — safe for destructive confirms.
- **Escape** fires `onCancel` (ignored while a confirm is pending).
- **Async loading**: while `onConfirm`'s promise is unresolved, the confirm button shows a `spinner-border spinner-border-sm` and both buttons are disabled.
- **Accessibility**: `role="dialog"` + `aria-modal`, labelled by the title and described by the message; Tab / Shift+Tab cycle within the dialog; focus lands on the confirm button on open; body scroll is locked while shown.

## Dark Mode

All colors use Bootstrap CSS variables — the dialog adapts automatically via `[data-bs-theme="dark"]`.
```

- [ ] **Step 2: Add README table row**

In `README.md`, add after the `**FormRow**` row in the Components table:

```markdown
| **ConfirmDialog** | [CONFIRMDIALOG.md](./docs/CONFIRMDIALOG.md) | Bootstrap 5 confirmation dialog with async loading state |
```

- [ ] **Step 3: Commit**

```bash
git add docs/CONFIRMDIALOG.md README.md
git commit -m "docs: add ConfirmDialog guide and README entry"
```

---

### Task 5: Publish to npm (user action)

- [ ] **Step 1: Dry run**

Run: `cd "/media/robert/Development/Allios Apps/allios-global/react-bootstrap-plugins" && pnpm publish --dry-run`
Expected: package contents include `dist/ConfirmDialog.*`, `dist/css/plugins.css`, `dist/index.*`

- [ ] **Step 2: Publish**

Run: `pnpm publish --no-git-checks`
Expected: publishes `react-bootstrap-plugins@2.7.0` to npm

---

### Task 6: Portal migration (allios-swiftplus-dashboard)

**Files:**
- Modify: `/media/robert/Development/Allios Apps/allios-global/allios-swiftplus-dashboard/src/views/academics/CBCAlevelReviewResults.jsx`

- [ ] **Step 1: Remove the local ConfirmDialog component**

Locate by content (currently lines 150–166, but the file has uncommitted edits so line numbers may have shifted): delete the entire local component starting at `const ConfirmDialog = ({ show, title, message, onConfirm, onCancel, confirmLabel = 'Confirm', variant = 'primary' }) => {` through the component's closing `}` (the one after its `<Modal>...</Modal>` return, before the next top-level declaration). Do not remove anything else.

- [ ] **Step 2: Add plugin imports**

In the import block, after the existing `import AutoDisplay from 'react-bootstrap-plugins/AutoDisplay'` line, add:

```jsx
import ConfirmDialog from 'react-bootstrap-plugins/ConfirmDialog'
import 'react-bootstrap-plugins/css/plugins.css'
```

- [ ] **Step 3: Update the call site (around line 3664)**

Change the prop name `confirmLabel` to `label`:

```jsx
      <ConfirmDialog
        show={!!deleteConfirm}
        title="Delete Report Card"
        message="Are you sure you want to delete this report card? This action cannot be undone."
        label="Confirm Delete"
        variant="danger"
        onConfirm={() => handleDelete(deleteConfirm)}
        onCancel={() => setDeleteConfirm(null)}
      />
```

Everything else stays — `handleDelete` is async, so the pending spinner will show while the delete API call runs.

- [ ] **Step 4: Verify no leftover references**

Run: `grep -n "confirmLabel" "/media/robert/Development/Allios Apps/allios-global/allios-swiftplus-dashboard/src/views/academics/CBCAlevelReviewResults.jsx"`
Expected: no output

- [ ] **Step 5: Commit**

```bash
git add src/views/academics/CBCAlevelReviewResults.jsx
git commit -m "refactor: use react-bootstrap-plugins ConfirmDialog for report card deletion"
```

---

### Task 7: Portal verification (user action)

- [ ] **Step 1: Bump the installed package**

Run: `cd "/media/robert/Development/Allios Apps/allios-global/allios-swiftplus-dashboard" && pnpm update react-bootstrap-plugins && grep '"react-bootstrap-plugins"' package.json`
Expected: package.json shows `^2.7.0`

- [ ] **Step 2: Smoke check in the running app**

Start the dev server (`pnpm dev` — the user runs this) and on the CBC A-Level results page open the Delete Report Card confirm dialog:

1. Dialog appears instantly (no animation), centered, ~300px wide, 12px radius, thin border, soft shadow.
2. Header shows a small red dot + "Delete Report Card" (semibold); body message has a 3px red left rule, muted text; footer has `Cancel` (btn-light) + `Confirm Delete` (btn-danger).
3. Click Confirm Delete → button shows a spinner and both buttons disable while the API call runs; dialog closes on success; success toast appears.
4. Press Escape → dialog closes (onCancel fires), no deletion.
5. Click the dimmed backdrop → nothing happens.
6. Tab / Shift+Tab cycle stays within the dialog.
7. Toggle dark mode → dialog adapts (dot, rule, and buttons use theme colors).
8. The page behind the dialog does not scroll.

- [ ] **Step 3: Done**

After the smoke check passes, the feature is complete. Tag the plugin repo: `git tag v2.7.0 && git push origin v2.7.0`.
