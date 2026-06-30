# SearchSelect

> A filterable, searchable select dropdown styled with Bootstrap 5. Supports both primitive arrays and object arrays with configurable label/value keys.

---

## Import

```js
// Default import (recommended for single-component tree-shaking)
import SearchSelect from 'react-bootstrap-plugins/SearchSelect'

// Named import from individual entry point
import { SearchSelect } from 'react-bootstrap-plugins/SearchSelect'

// Barrel import
import { SearchSelect } from 'react-bootstrap-plugins'
```

---

## Basic Usage

### Primitive array (strings/numbers)

```jsx
import { useState } from 'react'
import { SearchSelect } from 'react-bootstrap-plugins'

function FruitPicker() {
  const [fruit, setFruit] = useState('')

  return (
    <SearchSelect
      options={['Apple', 'Banana', 'Orange', 'Mango', 'Pineapple']}
      placeholder="Choose a fruit..."
      value={fruit}
      onChange={(e) => setFruit(e.target.value)}
    />
  )
}
```

### Object array with label/value mapping

```jsx
function UserPicker() {
  const [userId, setUserId] = useState(null)

  const users = [
    { id: 101, fullName: 'Alice Johnson', email: 'alice@example.com' },
    { id: 102, fullName: 'Bob Smith', email: 'bob@example.com' },
    { id: 103, fullName: 'Charlie Brown', email: 'charlie@example.com' },
  ]

  return (
    <SearchSelect
      options={users}
      labelKey="fullName"
      valueKey="id"
      placeholder="Select a user..."
      value={userId}
      onChange={(e) => setUserId(e.target.value)}
    />
  )
}
```

---

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `options` | `Array<string\|number\|boolean\|object>` | `[]` | Selectable options |
| `labelKey` | `string` | `'label'` | Key for display text (object options only) |
| `valueKey` | `string` | `'value'` | Key for the value (object options only) |
| `placeholder` | `string` | `'Select...'` | Placeholder text |
| `value` | `any` | `null` | Currently selected value |
| `onChange` | `(e: { target: { value, name } }) => void` | — | Synthetic event; `e.target.value` is the selected value, `e.target.name` is the input name |
| `id` | `string` | `'filterable-select'` | Input element ID |
| `name` | `string` | — | Input name attribute — surfaces as `e.target.name` in `onChange` |
| `disabled` | `boolean` | `false` | Disable the input |
| `className` | `string` | — | Additional CSS classes on wrapper |

---

## Inside Bootstrap Input Groups

```jsx
<div className="input-group mb-3">
  <span className="input-group-text">Subject</span>
  <SearchSelect
    name="subjectId"
    options={subjects}
    labelKey="name"
    valueKey="id"
    placeholder="Search subject..."
    value={subjectId}
    onChange={(e) => setSubjectId(e.target.value)}
  />
</div>
```

---

## Dark Mode

The SearchSelect respects Bootstrap 5's dark mode. Set `data-bs-theme="dark"` on any parent element.

---

## Bundle Size

~1.2 KB (min+gzip).

---

## See Also

- [DatePicker](./DATEPICKER.md) — Date, time, and datetime picker
- [Label](./LABEL.md) — Bootstrap-styled form label with required indicator
- [Main README](../README.md) — Package overview, installation, and general info
