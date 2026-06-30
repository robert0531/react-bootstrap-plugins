# Label

> A simple Bootstrap-styled form label with a required field indicator.

---

## Import

```js
// Default import (recommended for single-component tree-shaking)
import Label from 'react-bootstrap-plugins/Label'

// Named import from individual entry point
import { Label } from 'react-bootstrap-plugins/Label'

// Barrel import
import { Label } from 'react-bootstrap-plugins'
```

---

## Basic Usage

```jsx
import { Label } from 'react-bootstrap-plugins'

<Label hf="studentName" label="Student Name" />
// Renders: <label for="studentName">Student Name <b class="text-danger">*</b></label>
```

---

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `hf` | `string` | `'default'` | `htmlFor` attribute — matches input `id` |
| `label` | `string` | `'Title'` | Label text |
| `required` | `boolean` | `true` | Show red asterisk |
| `className` | `string` | — | Additional CSS classes |

---

## Examples

### With required indicator

```jsx
<Label hf="email" label="Email Address" required />
```

### Optional field (no asterisk)

```jsx
<Label hf="middleName" label="Middle Name" required={false} />
```

### With Bootstrap grid

```jsx
<div className="mb-3 row">
  <div className="col-sm-3">
    <Label hf="phone" label="Phone Number" className="col-form-label" />
  </div>
  <div className="col-sm-9">
    <input id="phone" type="tel" className="form-control" />
  </div>
</div>
```

---

## Dark Mode

The Label respects Bootstrap 5's dark mode. Set `data-bs-theme="dark"` on any parent element.

---

## Bundle Size

~0.3 KB (min+gzip).

---

## See Also

- [DatePicker](./DATEPICKER.md) — Date, time, and datetime picker
- [SearchSelect](./SEARCHSELECT.md) — Filterable, searchable select dropdown
- [Main README](../README.md) — Package overview, installation, and general info
