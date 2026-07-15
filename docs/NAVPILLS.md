# NavPills

> Horizontal Bootstrap 5 `nav-pills` tab strip with optional icons, dismissible pills, and "New" badges. Scrolls horizontally on overflow. Zero dependencies.

---

## Import

```js
// Default import (recommended for single-component tree-shaking)
import NavPills from 'react-bootstrap-plugins/NavPills'

// Named import from individual entry point
import { NavPills } from 'react-bootstrap-plugins/NavPills'

// Barrel import
import { NavPills } from 'react-bootstrap-plugins'
```

The badge styling requires the package CSS — import it **once** in your app:

```js
import 'react-bootstrap-plugins/css/plugins.css'
```

---

## Basic Usage

```jsx
import { useState } from 'react'
import { NavPills } from 'react-bootstrap-plugins'

function StudentTabs() {
  const [tab, setTab] = useState('list')

  const pills = [
    { key: 'list', label: 'Students' },
    { key: 'admission', label: 'Admission' },
    { key: 'attendance', label: 'Attendance', new: true },
  ]

  return (
    <NavPills
      pills={pills}
      active={tab}
      onClick={(pill) => setTab(pill.key)}
    />
  )
}
```

---

## Contained Bar

Pass `contain` to wrap the pills in a full-width light bar with a centered Bootstrap `.container` — useful directly under a page header:

```jsx
<NavPills
  contain
  pills={pills}
  active={tab}
  onClick={(pill) => setTab(pill.key)}
/>
```

---

## Dismissible Pills

Mark a pill with `clear: true` to render a dismiss badge (×). Clicking it fires the `clear` callback — the pill click itself is not triggered:

```jsx
<NavPills
  pills={[
    { key: 'all', label: 'All' },
    { key: 'filtered', label: 'Term 2 Results', clear: true },
  ]}
  active={tab}
  onClick={(pill) => setTab(pill.key)}
  clear={(pill) => removeFilter(pill.key)}
/>
```

---

## Icons

The `icon` field accepts either a **full icon class string** (any icon font) or a **ReactNode**:

```jsx
// Icon font (Font Awesome, Bootstrap Icons, …) — pass the complete class
{ key: 'fees', label: 'Fees', icon: 'fas fa-coins' }
{ key: 'fees', label: 'Fees', icon: 'bi bi-cash-stack' }

// Component icon (Lucide, custom SVG, …)
import { Coins } from 'lucide-react'
{ key: 'fees', label: 'Fees', icon: <Coins size={14} /> }
```

> **Migration note:** the original in-app component prefixed string icons with `fas ` automatically (`icon: 'fa-coins'`). The plugin renders the string as-is, so include the prefix yourself: `icon: 'fas fa-coins'`.

---

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `pills` | `NavPill[]` | — | Pills to render (see shape below) |
| `active` | `string` \| `number` | — | Key of the currently active pill |
| `onClick` | `(pill) => void` | — | Fired when a pill is clicked |
| `clear` | `(pill) => void` | — | Fired when a pill's dismiss badge is clicked |
| `contain` | `boolean` | `false` | Wrap in a full-width light bar with a centered `.container` |
| `className` | `string` | — | Extra classes (on the wrapper when `contain`, else on the `nav`) |

A `ref` is forwarded to the underlying `<nav>` element.

### `NavPill` shape

| Field | Type | Description |
|---|---|---|
| `key` | `string` \| `number` | Unique identifier — compared against `active` |
| `label` | `ReactNode` | Pill label |
| `lbl` | `ReactNode` | Legacy alias for `label` (wins when both are set) |
| `icon` | `string` \| `ReactNode` | Optional leading icon (see [Icons](#icons)) |
| `clear` | `boolean` | Show the dismiss badge |
| `new` | `boolean` | Show the "New" badge |

---

## Dark Mode

Pills use Bootstrap's native `nav-pills` styling, which adapts automatically. The contained bar's `bg-light` background and the soft badge colors are remapped for `[data-bs-theme="dark"]` in the package CSS.

---

## Bundle Size

~0.5 KB (min+gzip), plus shared CSS.

---

## See Also

- [DatePicker](./DATEPICKER.md) — Date, time, and datetime picker
- [SearchSelect](./SEARCHSELECT.md) — Filterable, searchable select dropdown
- [Label](./LABEL.md) — Bootstrap-styled form label with required indicator
- [TableLoading](./TABLELOADING.md) — Placeholder loading skeleton for tables
- [AutoTextarea](./AUTOTEXTAREA.md) — Auto-resizing textarea
- [Main README](../README.md) — Package overview, installation, and general info
