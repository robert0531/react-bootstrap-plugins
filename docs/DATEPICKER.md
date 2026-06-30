# DatePicker

> A fully-featured date, time, and datetime picker with Bootstrap 5 styling. Popover is rendered via React Portal — no z-index stacking issues with modals or sidebars.

---

## Import

```js
// Default import (recommended for single-component tree-shaking)
import DatePicker from 'react-bootstrap-plugins/DatePicker'

// Named import from individual entry point
import { DatePicker } from 'react-bootstrap-plugins/DatePicker'

// Barrel import
import { DatePicker } from 'react-bootstrap-plugins'

// Required CSS (import once, anywhere in your app)
import 'react-bootstrap-plugins/css/datepicker.css'
```

---

## Basic Usage

```jsx
import { useState } from 'react'
import { DatePicker } from 'react-bootstrap-plugins'
import 'react-bootstrap-plugins/css/datepicker.css'

function MyForm() {
  const [date, setDate] = useState(null)

  return (
    <DatePicker
      value={date}
      onChange={(e) => setDate(e.target.value)}
      placeholderText="Pick a date"
    />
  )
}
```

---

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `mode` | `'date'` \| `'time'` \| `'datetime'` | `'date'` | Picker mode |
| `value` | `Date` \| `string` \| `null` | — | Currently selected value |
| `selected` | `Date` \| `null` | — | Alias for `value` |
| `onChange` | `(e) => void` | — | Synthetic event; `e.target.value` is formatted string, `e.target.name` is the input name |
| `dateFormat` | `string` | — | Custom format. Tokens: `yyyy`, `MM`, `dd`, `hh`, `mm`, `aa` |
| `placeholderText` | `string` | Auto | Placeholder when empty |
| `size` | `'sm'` \| `'lg'` | — | Bootstrap input size variant |
| `isClearable` | `boolean` | `false` | Show clear button |
| `disabled` | `boolean` | `false` | Disable the input |
| `minDate` | `Date` | — | Earliest selectable date |
| `maxDate` | `Date` | — | Latest selectable date |
| `timeIntervals` | `number` | `5` | Minute step in time picker |
| `timezone` | `string` | `'Kampala'` | Timezone label |
| `className` | `string` | — | Additional CSS classes on the input |
| `id` | `string` | — | Input element ID |
| `name` | `string` | — | Input name attribute — surfaces as `e.target.name` in `onChange` |

---

## Examples

### Date mode (default)

```jsx
<DatePicker
  name="dob"
  value={birthDate}
  onChange={(e) => setBirthDate(e.target.value)}
  maxDate={new Date()}
  isClearable
/>
// e.target.value → "2026-06-29"
// e.target.name  → "dob"
```

### Time mode

```jsx
<DatePicker
  mode="time"
  value={startTime}
  onChange={(e) => setStartTime(e.target.value)}
  timeIntervals={15}
/>
// e.target.value → "02:30 PM"
```

### Datetime mode

```jsx
<DatePicker
  mode="datetime"
  value={appointmentDateTime}
  onChange={(e) => setAppointmentDateTime(e.target.value)}
  dateFormat="dd/MM/yyyy hh:mm aa"
/>
// e.target.value → "29/06/2026 02:30 PM"
```

### With Bootstrap form layout

```jsx
<div className="mb-3">
  <label htmlFor="eventDate" className="form-label">Event Date</label>
  <DatePicker
    id="eventDate"
    name="eventDate"
    value={eventDate}
    onChange={(e) => setEventDate(e.target.value)}
    minDate={new Date()}
    className="form-control-lg"
  />
</div>
```

---

## CSS Import

DatePicker requires a small CSS file for its popover calendar layout. Import it **once** in your app:

```js
// Recommended — uses the package exports map
import 'react-bootstrap-plugins/css/datepicker.css'
```

For troubleshooting CSS import issues, see the [main README](./README.md#css-imports).

---

## Dark Mode

The DatePicker respects Bootstrap 5's dark mode. Set `data-bs-theme="dark"` on any parent element and the popover calendar adapts automatically.

---

## Bundle Size

~5.5 KB (min+gzip, including CSS).

---

## See Also

- [SearchSelect](./SEARCHSELECT.md) — Filterable, searchable select dropdown
- [Label](./LABEL.md) — Bootstrap-styled form label with required indicator
- [Main README](./README.md) — Package overview, installation, and general info
