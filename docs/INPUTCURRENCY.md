# InputCurrency

> Bootstrap 5 controlled currency input for financial forms. Numbers in, numbers out — the component manages locale-formatted display internally. Zero dependencies.

---

## Import

```js
// Default import (recommended for single-component tree-shaking)
import InputCurrency from 'react-bootstrap-plugins/InputCurrency'

// Named import from individual entry point
import { InputCurrency } from 'react-bootstrap-plugins/InputCurrency'

// Barrel import
import { InputCurrency } from 'react-bootstrap-plugins'
```

---

## Basic Usage

```jsx
import { useState } from 'react'
import { InputCurrency } from 'react-bootstrap-plugins'

function FeeForm() {
  const [fee, setFee] = useState(150000)

  return (
    <InputCurrency
      name="fee"
      value={fee}
      onChange={(e) => setFee(e.target.value)}
      placeholder="Enter fee amount"
    />
  )
}
```

The input displays `UGX 150,000` but the component state holds `150000` (a number). While focused, the raw number `150000` is shown for frictionless editing. On blur, it snaps back to `UGX 150,000`.

---

## Data Contract

| Direction | Type | Example |
|---|---|---|
| `value` prop (in) | `number` | `150000` |
| `onChange` → `e.target.value` (out) | `number \| ''` | `150000` or `''` (when cleared) |
| Display (internal) | `string` | `"UGX 150,000"` |

The parent component never sees commas or currency symbols — it works entirely with numbers.

---

## Editing UX

- **Focused**: raw number shown (`150000`) — no commas or symbols fighting keystrokes
- **Blurred**: locale-formatted currency (`UGX 150,000`) — clean, readable display
- **External value change**: if the parent pushes a new `value` while the field is not focused, the display updates immediately (e.g. after a successful API call that resets the form)

---

## Currency & Locale

```jsx
// UGX — zero decimal places (default)
<InputCurrency value={50000} name="tuition" onChange={handleChange} />

// USD with cents
<InputCurrency
  value={99.99}
  currency="USD"
  locale="en-US"
  decimals={2}
  name="price"
  onChange={handleChange}
/>

// Kenyan Shillings
<InputCurrency
  value={25000}
  currency="KES"
  locale="en-KE"
  decimals={0}
  name="fee"
  onChange={handleChange}
/>
```

---

## Plain Number Mode

When `plain` is `true`, formatting omits the currency symbol and outputs a plain locale-formatted number. Useful for non-monetary numeric inputs that still benefit from thousand-separator formatting:

```jsx
<InputCurrency
  value={50000}
  plain
  name="studentCount"
  onChange={(e) => setCount(e.target.value)}
  placeholder="Number of students"
/>
```

Displays `150,000` instead of `UGX 150,000`.

---

## Props

Accepts all standard `<input>` props (except `value`, `onChange`, and `type`, which are managed internally), plus:

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `number \| string \| null` | — | Numeric value to display. Pass `undefined`/`null`/`''` for an empty field |
| `onChange` | `(e: ChangeEvent) => void` | — | Called with a synthetic event where `e.target.value` is the parsed `number` (or `''` when cleared). `e.target.name` is preserved |
| `currency` | `string` | `'UGX'` | ISO 4217 currency code |
| `locale` | `string` | `'en-UG'` | BCP 47 locale tag for formatting |
| `decimals` | `number` | `0` | Number of decimal places. UGX/JYP = 0, USD/EUR = 2, etc. |
| `plain` | `boolean` | `false` | When `true`, omits the currency symbol and outputs a plain locale-formatted number |
| `name` | `string` | — | Input name attribute. Accessible in `onChange` via `e.target.name` |
| `id` | `string` | — | Input id attribute. Falls back to `name` if omitted |
| `className` | `string` | — | Additional classes merged with `form-control` |
| `placeholder` | `string` | — | Placeholder text shown when the field is empty |
| `disabled` | `boolean` | `false` | Disables the input |
| `readOnly` | `boolean` | `false` | Makes the input read-only |
| `autoComplete` | `string` | `'off'` | Defaults to `'off'` for financial inputs |

A `ref` is forwarded to the underlying `<input>` element.

---

## Edge Cases Handled

| Input | Display | Value |
|---|---|---|
| Empty / cleared | Placeholder shown | `''` |
| `null` / `undefined` | Empty field | `''` |
| `"150000"` (string) | Formatted currency | `150000` (number) |
| `"-"` alone | Raw `-` shown while typing | `''` (not emitted) |
| `"."` alone | Raw `.` shown while typing | `''` (not emitted) |
| `"abc123"` | `123` while focused → formatted on blur | `123` |
| Letters only | Empty → formatted to `''` | `''` |
| Negative numbers | `-50000` → `UGX -50,000` | `-50000` |

---

## Accessibility

- `inputMode="decimal"` — brings up the numeric keypad on mobile
- `type="text"` — avoids browser number-input quirks (spinners, locale-specific formatting)
- `autoComplete="off"` — prevents unwanted autofill on financial fields
- `id` falls back to `name` when omitted — always ensure a label association
- Ref forwarding for programmatic focus management
- All standard ARIA attributes spread through via `...rest`

---

## Dark Mode

Uses Bootstrap's `form-control` class, which adapts automatically. Set `data-bs-theme="dark"` on any parent element.

---

## Bundle Size

~0.6 KB (min+gzip).

---

## See Also

- [AutoTextarea](./AUTOTEXTAREA.md) — Auto-resizing textarea
- [SearchSelect](./SEARCHSELECT.md) — Filterable, searchable select dropdown
- [Label](./LABEL.md) — Bootstrap-styled form label with required indicator
- [Main README](../README.md) — Package overview, installation, and general info
