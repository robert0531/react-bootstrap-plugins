# FormRow

> A Bootstrap-styled form row wrapper — label, control, helper text, and required indicator in one block.

---

## Import

```js
// Default import (recommended for single-component tree-shaking)
import FormRow from 'react-bootstrap-plugins/FormRow'

// Named import from individual entry point
import { FormRow } from 'react-bootstrap-plugins/FormRow'

// Barrel import
import { FormRow } from 'react-bootstrap-plugins'
```

---

## Basic Usage

```jsx
import { FormRow } from 'react-bootstrap-plugins'

<FormRow label="Student Name" required hint="Full name as it appears on the birth certificate">
  <input type="text" className="form-control" />
</FormRow>
```

Renders:

```html
<div>
  <label class="form-label small fw-medium">Student Name <b class="text-danger ms-1">*</b></label>
  <input type="text" class="form-control" />
  <div class="form-text">Full name as it appears on the birth certificate</div>
</div>
```

---

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | — | Label text rendered above the field |
| `hint` | `string` | — | Helper text rendered below the field (`form-text`) |
| `required` | `boolean` | `false` | Show red asterisk after the label |
| `className` | `string` | — | Additional CSS classes on the wrapper `<div>` |
| `children` | `ReactNode` | — | Form control(s) rendered inside the row |

`FormRow` also forwards its `ref` to the wrapper `<div>`.

---

## Examples

### Required field with hint

```jsx
<FormRow label="Email Address" required hint="We'll never share your email">
  <input type="email" className="form-control" placeholder="you@school.ac.ug" />
</FormRow>
```

### Optional field (no asterisk)

```jsx
<FormRow label="Middle Name">
  <input type="text" className="form-control" />
</FormRow>
```

### With a Select control

```jsx
<FormRow label="Class" required>
  <select className="form-select">
    <option value="">Choose a class…</option>
    <option value="s1">Senior One</option>
    <option value="s2">Senior Two</option>
  </select>
</FormRow>
```

### With extra wrapper classes

```jsx
<FormRow label="Phone" className="col-md-6 mb-3">
  <input type="tel" className="form-control" />
</FormRow>
```

---

## Dark Mode

The FormRow respects Bootstrap 5's dark mode. Set `data-bs-theme="dark"` on any parent element.

---

## Bundle Size

~0.3 KB (min+gzip).

---

## See Also

- [Label](./LABEL.md) — Standalone form label with required indicator
- [InputCurrency](./INPUTCURRENCY.md) — Controlled currency input
- [Main README](../README.md) — Package overview, installation, and general info
