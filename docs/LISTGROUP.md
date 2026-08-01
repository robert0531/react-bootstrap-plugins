# ListGroup

> Bootstrap 5 list-group with active-state highlighting, icons, badges, descriptions, and keyboard accessibility. Zero dependencies.

---

## Import

```js
// Default import (recommended for single-component tree-shaking)
import ListGroup from 'react-bootstrap-plugins/ListGroup'

// Named import from individual entry point
import { ListGroup } from 'react-bootstrap-plugins/ListGroup'

// Barrel import
import { ListGroup } from 'react-bootstrap-plugins'
```

No additional CSS import is required — ListGroup uses only Bootstrap 5 utility classes.

---

## Basic Usage

```jsx
import { useState } from 'react'
import { ListGroup } from 'react-bootstrap-plugins'

function FinanceMenu() {
  const [selected, setSelected] = useState('fees')

  const items = [
    { key: 'fees', label: 'Fee Structure', icon: 'fas fa-coins', desc: 'Define fee types and amounts' },
    { key: 'invoices', label: 'Invoices', icon: 'fas fa-file-invoice', desc: 'Generate and manage invoices' },
    { key: 'ledger', label: 'Student Ledger', icon: 'fas fa-book', desc: 'View student account statements' },
  ]

  return (
    <ListGroup
      items={items}
      active={selected}
      onClick={(item) => setSelected(item.key)}
    />
  )
}
```

---

## Color Variants

Pass a Bootstrap color variant to control the active-state accent color:

```jsx
<ListGroup items={items} active={selected} variant="success" onClick={handleSelect} />
<ListGroup items={items} active={selected} variant="danger" onClick={handleSelect} />
<ListGroup items={items} active={selected} variant="info" onClick={handleSelect} />
```

The variant controls the active item's background tint, icon/text color, and badge color. Inactive item icons use `primary` at reduced opacity. Defaults to `"primary"`.

---

## Flush Style

Pass `flush` to remove outer borders and rounded corners — useful inside cards or panels:

```jsx
<ListGroup items={items} active={selected} flush onClick={handleSelect} />
```

---

## Badges

The `badge` field accepts a string, number, or ReactNode. Strings/numbers are rendered in a small colored circle matching the active variant:

```jsx
const items = [
  { key: 'invoices', label: 'Invoices', badge: 3 },
  { key: 'alerts', label: 'Alerts', badge: '!' },
  { key: 'messages', label: 'Messages', badge: <CustomBadge /> },
]
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
{ key: 'fees', label: 'Fees', icon: <Coins size={16} /> }
```

> **Note:** The plugin renders string icons as-is — include the full icon prefix yourself: `icon: 'fas fa-coins'`.

---

## Disabled Items

Set `disabled: true` on an item to gray it out and prevent click:

```jsx
const items = [
  { key: 'fees', label: 'Fee Structure' },
  { key: 'reports', label: 'Reports', disabled: true },
]
```

---

## Icon Size

Control the icon container size via `iconSize` (in pixels, default 30):

```jsx
<ListGroup items={items} iconSize={40} />
```

---

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `ListGroupItem[]` | required | Items to render |
| `active` | `string \| number` | — | Key of the currently active item |
| `variant` | `string` | `"primary"` | Bootstrap color variant for active state, icons, and badges |
| `onClick` | `(item) => void` | — | Fired when an item is clicked (not fired for disabled items) |
| `flush` | `boolean` | `false` | Remove outer borders and rounded corners |
| `iconSize` | `number` | `30` | Icon container width/height in px |
| `showTooltip` | `boolean` | `true` | Show item `desc` as a native tooltip via the `title` attribute |
| `className` | `string` | — | Extra CSS classes on the outer wrapper |

A `ref` is forwarded to the outer `<div className="list-group">`.

### `ListGroupItem` shape

| Field | Type | Description |
|-------|------|-------------|
| `key` | `string \| number` | Unique identifier — compared against `active` |
| `label` | `ReactNode` | Item label text |
| `icon` | `string \| ReactNode` | Optional leading icon (see [Icons](#icons)) |
| `desc` | `string` | Subtitle/description text below the label row |
| `badge` | `string \| number \| ReactNode` | Badge on the right side |
| `disabled` | `boolean` | Gray out the item and prevent click |

---

## Dark Mode

ListGroup uses Bootstrap's native `list-group` styling, which adapts automatically to `[data-bs-theme="dark"]`. No additional CSS is required.

---

## Bundle Size

~0.6 KB (min+gzip). No additional CSS import required.

---

## See Also

- [NavPills](./NAVPILLS.md) — Horizontal nav-pills tab strip with icons and badges
- [DatePicker](./DATEPICKER.md) — Date, time, and datetime picker
- [SearchSelect](./SEARCHSELECT.md) — Filterable, searchable select dropdown
- [Label](./LABEL.md) — Bootstrap-styled form label with required indicator
- [Main README](../README.md) — Package overview, installation, and general info
