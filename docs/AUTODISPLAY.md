# AutoDisplay

> A lightweight visibility toggle component that conditionally renders content using CSS `display` instead of unmounting from the DOM.

---

## Import

```js
// Default import (recommended for single-component tree-shaking)
import AutoDisplay from 'react-bootstrap-plugins/AutoDisplay'

// Named import from individual entry point
import { AutoDisplay } from 'react-bootstrap-plugins/AutoDisplay'

// Barrel import
import { AutoDisplay } from 'react-bootstrap-plugins'
```

---

## Basic Usage

```jsx
import { AutoDisplay } from 'react-bootstrap-plugins'

<AutoDisplay visible={showContent}>
  <p>This content is toggled via CSS display.</p>
</AutoDisplay>
```

---

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `visible` | `boolean` | `false` | When `true`, sets `display: block`; when `false`, sets `display: none` |
| `className` | `string` | — | Additional CSS classes |
| `style` | `React.CSSProperties` | — | Inline styles (merged with the display rule) |
| `children` | `React.ReactNode` | — | Content to show/hide |

---

## Examples

### Toggle content visibility

```jsx
const [open, setOpen] = useState(false)

<button onClick={() => setOpen(!open)}>Toggle</button>
<AutoDisplay visible={open}>
  <div className="card card-body mt-2">
    This content stays in the DOM but is hidden via CSS.
  </div>
</AutoDisplay>
```

### With custom inline styles

```jsx
<AutoDisplay visible style={{ padding: '1rem', border: '1px solid #ddd' }}>
  <p>Styled container that toggles on/off.</p>
</AutoDisplay>
```

### Preserving form state across toggles

Unlike conditional rendering (`{open && <Form />}`), AutoDisplay keeps children mounted so form inputs, scroll positions, and component state are preserved:

```jsx
<AutoDisplay visible={activeTab === 'details'}>
  <input type="text" className="form-control" defaultValue="Preserved value" />
</AutoDisplay>
```

---

## When to Use

Use **AutoDisplay** when you need to hide content without losing DOM state:

- **Multi-step forms** — preserve filled-in values when switching steps
- **Tab panels** — keep scroll position and input state across tabs
- **Animations** — pair with CSS transitions for fade/slide effects
- **Performance** — avoid re-mounting expensive subtrees

For simple conditional rendering where state preservation doesn't matter, plain `{condition && <Content />}` is fine.

---

## Dark Mode

AutoDisplay is a wrapper `<div>` with no built-in styling — it inherits dark mode from any parent with `data-bs-theme="dark"`.

---

## Bundle Size

~0.2 KB (min+gzip).

---

## See Also

- [NavPills](./NAVPILLS.md) — Tab navigation with optional pill styling
- [TableLoading](./TABLELOADING.md) — Skeleton loading placeholders
- [Main README](../README.md) — Package overview, installation, and general info
