# AutoTextarea

> Bootstrap 5 textarea that automatically grows and shrinks to fit its content. Grows up to `maxRows` (or a pixel `maxHeight` cap), then becomes scrollable. Zero dependencies.

---

## Import

```js
// Default import (recommended for single-component tree-shaking)
import AutoTextarea from 'react-bootstrap-plugins/AutoTextarea'

// Named import from individual entry point
import { AutoTextarea } from 'react-bootstrap-plugins/AutoTextarea'

// Barrel import
import { AutoTextarea } from 'react-bootstrap-plugins'
```

---

## Basic Usage

```jsx
import { useState } from 'react'
import { AutoTextarea } from 'react-bootstrap-plugins'

function CommentForm() {
  const [comment, setComment] = useState('')

  return (
    <AutoTextarea
      name="comment"
      value={comment}
      onChange={e => setComment(e.target.value)}
      placeholder="Write a comment…"
      minRows={2}
      maxRows={8}
    />
  )
}
```

The textarea starts at `minRows` tall, grows line-by-line as the user types, and shows a scrollbar once content exceeds `maxRows`. It shrinks back down when content is removed.

---

## Capping Height in Pixels

When you need a hard pixel limit instead of a row count (e.g. fitting a fixed panel), pass `maxHeight`. It overrides the `maxRows`-derived limit — the textarea grows up to `maxHeight` pixels and becomes scrollable beyond it:

```jsx
<AutoTextarea
  value={notes}
  onChange={e => setNotes(e.target.value)}
  maxHeight={240}   // grow to 240px, then scroll
/>
```

---

## Props

Accepts all standard `<textarea>` props (except `rows`, which is managed internally), plus:

| Prop | Type | Default | Description |
|---|---|---|---|
| `minRows` | `number` | `2` | Minimum number of visible rows |
| `maxRows` | `number` | `8` | Maximum number of rows before scrolling |
| `maxHeight` | `number` | — | Hard cap on height in **pixels**. Overrides `maxRows` when provided; content beyond it scrolls |
| `value` | `string` | — | Controlled value |
| `onChange` | `function` | — | Change handler (`e.target.value`) |
| `className` | `string` | — | Additional classes merged with `form-control` |
| `style` | `object` | — | Inline styles merged onto the textarea |

A `ref` is forwarded to the underlying `<textarea>` element.

---

## Behavior Notes

- Height recalculates on every value change, on user input (works uncontrolled too), and on window resize (line wrapping changes with width).
- `resize` is disabled — the component owns its height. Override via `style={{ resize: 'vertical' }}` if you must.
- Row limits are computed from the element's real `line-height`, padding, and border, so they stay correct across font sizes and Bootstrap size utilities.

---

## Dark Mode

Uses Bootstrap's `form-control` class, which adapts automatically. Set `data-bs-theme="dark"` on any parent element.

---

## Bundle Size

~0.4 KB (min+gzip).

---

## See Also

- [DatePicker](./DATEPICKER.md) — Date, time, and datetime picker
- [SearchSelect](./SEARCHSELECT.md) — Filterable, searchable select dropdown
- [Label](./LABEL.md) — Bootstrap-styled form label with required indicator
- [TableLoading](./TABLELOADING.md) — Placeholder loading skeleton for tables
- [Main README](../README.md) — Package overview, installation, and general info
