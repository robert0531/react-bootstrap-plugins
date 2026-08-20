# ConfirmDialog

Zero-dependency Bootstrap 5 confirmation dialog with async loading state. Premium "Refined Minimal" styling — soft radius, variant-colored header dot, variant rule on the message.

## Import

```js
import { ConfirmDialog } from 'react-bootstrap-plugins/ConfirmDialog'
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
