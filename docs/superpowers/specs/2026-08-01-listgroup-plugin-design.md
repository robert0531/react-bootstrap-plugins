# ListGroup Plugin — Design Spec

> **Date:** 2026-08-01 | **Status:** Approved | **Package:** react-bootstrap-plugins

## Overview

Add a `ListGroup` component to `react-bootstrap-plugins` — a Bootstrap 5 list-group with active-state highlighting, icons, badges, descriptions, and keyboard accessibility. Ported from the existing in-app component with a cleaned-up API.

## API Design

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `ListGroupItem[]` | required | Items to render |
| `active` | `string \| number` | — | Key of the active item |
| `variant` | `string` | `"primary"` | Bootstrap color variant for active state, icons, badges |
| `onClick` | `(item: ListGroupItem) => void` | — | Fired when an item is clicked |
| `flush` | `boolean` | `false` | Remove outer borders and rounded corners (Bootstrap `list-group-flush`) |
| `iconSize` | `number` | `30` | Icon container width/height in px |
| `showTooltip` | `boolean` | `true` | Show item `desc` as a `title` attribute tooltip on hover |
| `className` | `string` | — | Extra CSS classes on the outer wrapper |

Forwarded `ref` lands on the outer `<div className="list-group">`.

### ListGroupItem

| Field | Type | Description |
|-------|------|-------------|
| `key` | `string \| number` | Unique identifier — compared against `active` |
| `label` | `ReactNode` | Item label text |
| `icon` | `string \| ReactNode` | Leading icon. String → `<i className={icon}>`, ReactNode → rendered as-is |
| `desc` | `string` | Subtitle below the label row |
| `badge` | `string \| number \| ReactNode` | Badge on the right side |
| `disabled` | `boolean` | Gray out item, prevent click |

## DOM Structure

```html
<div class="list-group [list-group-flush] [className]">
  <button class="list-group-item list-group-item-action border-0 px-3 py-2
                 [active shadow-sm] [disabled]" aria-current="[true]">
    <div class="d-flex justify-content-between align-items-center">
      <p class="d-flex align-items-center mb-0 gap-2">
        <span class="rounded d-flex align-items-center justify-content-center
                     [bg-{variant} bg-opacity-25 / bg-primary bg-opacity-10]">
          <i class="[icon] [text-{variant} / text-primary]" />
        </span>
        <span class="fw-medium [text-{variant}]">{label}</span>
      </p>
      <span class="bg-opacity-25 bg-{variant} ... rounded">{badge}</span>
    </div>
    <p class="text-muted my-0 text-truncate" style="font-size:10px">{desc}</p>
  </button>
</div>
```

Active items get `{variant}`-tinted backgrounds and text. Inactive items use `primary`-tinted icon backgrounds at reduced opacity.

## Files

| Action | File | Purpose |
|--------|------|---------|
| **Create** | `src/components/ListGroup.tsx` | Component + types + exports |
| **Modify** | `src/index.ts` | Barrel export + type export |
| **Modify** | `tsup.config.ts` | Add `ListGroup` entry point |
| **Modify** | `package.json` | Add `./ListGroup` export map + keywords |
| **Create** | `docs/LISTGROUP.md` | Component documentation |
| **Modify** | `README.md` | Add to component table, imports, bundle size, structure |

## Migration from In-App Component

The existing `src/components/ui/ListGroup.jsx` in the app:

```jsx
// OLD
<ListGroup active={{ listClass: 'success', list: 'fees' }} lists={items} onClick={fn} size={30} pop={true} />

// NEW
<ListGroup active="fees" variant="success" items={items} onClick={fn} iconSize={30} showTooltip={true} />
```

The in-app file will be updated to re-export from the plugin after publishing.

## TypeScript Types

```ts
export interface ListGroupItem {
  key: string | number
  label?: React.ReactNode
  icon?: string | React.ReactNode
  desc?: string
  badge?: string | number | React.ReactNode
  disabled?: boolean
}

export interface ListGroupProps {
  items: ListGroupItem[]
  active?: string | number
  variant?: string
  onClick?: (item: ListGroupItem) => void
  flush?: boolean
  iconSize?: number
  showTooltip?: boolean
  className?: string
}
```

## Edge Cases

- Empty `items` array → renders empty `<div className="list-group">`
- `active` doesn't match any item → no item highlighted
- `icon` as ReactNode → rendered as-is in a `<span className="me-2 d-inline-flex align-middle">` (matching NavPills pattern)
- `badge` as ReactNode → rendered as-is
- `badge` as string/number → wrapped in styled `<span>`
- `showTooltip={false}` → no `title` attribute on button
- Click on disabled item → `onClick` not called, event stopped
