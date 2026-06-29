# react-bootstrap-plugins

> Production-grade Bootstrap 5 UI components for React 18+. Zero runtime dependencies. Tree-shakeable.

[![license](https://img.shields.io/npm/l/react-bootstrap-plugins)](./LICENSE)

---

## Features

- 🎯 **Zero runtime dependencies** — only React and React DOM as peer dependencies
- 🌳 **Tree-shakeable** — import only what you need; unused components are stripped at build time
- 🎨 **Bootstrap 5 native** — uses CSS custom properties (`--bs-*`), respects dark mode via `[data-bs-theme="dark"]`
- 📦 **ESM + CJS dual format** — works with any bundler (Vite, webpack, Turbopack, Rollup)
- 🔒 **TypeScript ready** — full `.d.ts` declarations included
- ♿ **Accessible** — ARIA attributes, keyboard navigation, screen-reader friendly
- 📱 **Responsive** — mobile-optimized layouts for all components

## Installation

```bash
npm install react-bootstrap-plugins
# or
pnpm add react-bootstrap-plugins
# or
yarn add react-bootstrap-plugins
```

### Peer Dependencies

Make sure you have React 18+ and Bootstrap 5 CSS loaded:

```bash
npm install react react-dom bootstrap
```

```js
// In your app entry point
import 'bootstrap/dist/css/bootstrap.min.css'
```

---

## Components

### DatePicker

A fully-featured date, time, and datetime picker with Bootstrap styling. Popover is rendered via React Portal — no z-index stacking issues with modals or sidebars.

#### Import

```js
// Tree-shakeable single import (recommended)
import { DatePicker } from 'react-bootstrap-plugins/DatePicker'

// Or barrel import
import { DatePicker } from 'react-bootstrap-plugins'

// Required CSS (import once, anywhere in your app)
import 'react-bootstrap-plugins/css/datepicker.css'
```

#### Basic Usage

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

#### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `mode` | `'date'` \| `'time'` \| `'datetime'` | `'date'` | Picker mode |
| `value` | `Date` \| `string` \| `null` | — | Currently selected value |
| `selected` | `Date` \| `null` | — | Alias for `value` |
| `onChange` | `(e) => void` | — | Synthetic event; `e.target.value` is formatted string |
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
| `name` | `string` | — | Input name attribute |

#### Examples

**Date mode (default):**
```jsx
<DatePicker
  name="dob"
  value={birthDate}
  onChange={(e) => setBirthDate(e.target.value)}
  maxDate={new Date()}
  isClearable
/>
// e.target.value → "2026-06-29"
```

**Time mode:**
```jsx
<DatePicker
  mode="time"
  value={startTime}
  onChange={(e) => setStartTime(e.target.value)}
  timeIntervals={15}
/>
// e.target.value → "02:30 PM"
```

**Datetime mode:**
```jsx
<DatePicker
  mode="datetime"
  value={appointmentDateTime}
  onChange={(e) => setAppointmentDateTime(e.target.value)}
  dateFormat="dd/MM/yyyy hh:mm aa"
/>
// e.target.value → "29/06/2026 02:30 PM"
```

**With Bootstrap form layout:**
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

### SearchSelect

A filterable, searchable select dropdown. Supports both primitive arrays and object arrays with configurable label/value keys.

#### Import

```js
import SearchSelect from 'react-bootstrap-plugins/SearchSelect'
// or
import { SearchSelect } from 'react-bootstrap-plugins'
```

#### Basic Usage

**Primitive array (strings/numbers):**
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
      onChange={(val) => setFruit(val)}
    />
  )
}
```

**Object array with label/value mapping:**
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
      onChange={(id) => setUserId(id)}
    />
  )
}
```

#### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `options` | `Array<string\|number\|boolean\|object>` | `[]` | Selectable options |
| `labelKey` | `string` | `'label'` | Key for display text (object options only) |
| `valueKey` | `string` | `'value'` | Key for the value (object options only) |
| `placeholder` | `string` | `'Select...'` | Placeholder text |
| `value` | `any` | `null` | Currently selected value |
| `onChange` | `(value: any) => void` | — | Called with selected value |
| `id` | `string` | `'filterable-select'` | Input element ID |
| `disabled` | `boolean` | `false` | Disable the input |
| `className` | `string` | — | Additional CSS classes on wrapper |

#### Inside Bootstrap Input Groups

```jsx
<div className="input-group mb-3">
  <span className="input-group-text">Subject</span>
  <SearchSelect
    options={subjects}
    labelKey="name"
    valueKey="id"
    placeholder="Search subject..."
    value={subjectId}
    onChange={setSubjectId}
  />
</div>
```

---

### Label

A simple form label with a Bootstrap-styled required field indicator.

#### Import

```js
import { Label } from 'react-bootstrap-plugins/Label'
// or
import { Label } from 'react-bootstrap-plugins'
```

#### Basic Usage

```jsx
import { Label } from 'react-bootstrap-plugins'

<Label hf="studentName" label="Student Name" />
// Renders: <label for="studentName">Student Name <b class="text-danger">*</b></label>
```

#### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `hf` | `string` | `'default'` | `htmlFor` attribute — matches input `id` |
| `label` | `string` | `'Title'` | Label text |
| `required` | `boolean` | `true` | Show red asterisk |
| `className` | `string` | — | Additional CSS classes |

#### Examples

**With required indicator:**
```jsx
<Label hf="email" label="Email Address" required />
```

**Optional field (no asterisk):**
```jsx
<Label hf="middleName" label="Middle Name" required={false} />
```

**With Bootstrap grid:**
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

## Import Patterns

All patterns are tree-shakeable. Your bundler will only include the code you actually import.

```js
// Single component — smallest bundle
import { DatePicker } from 'react-bootstrap-plugins/DatePicker'

// Multiple named — tree-shaken
import { DatePicker, Label } from 'react-bootstrap-plugins'

// All components
import { DatePicker, SearchSelect, Label } from 'react-bootstrap-plugins'

// CSS (required for DatePicker)
import 'react-bootstrap-plugins/css/datepicker.css'
```

---

## Dark Mode

All components respect Bootstrap 5's dark mode. Set `data-bs-theme="dark"` on any parent element:

```html
<html data-bs-theme="dark">
  <!-- DatePicker popover, dropdown, and all styling adapt automatically -->
</html>
```

Or toggle dynamically:

```jsx
function App() {
  const [theme, setTheme] = useState('light')

  return (
    <div data-bs-theme={theme}>
      <DatePicker value={date} onChange={handleDate} />
    </div>
  )
}
```

---

## Bundle Size

| Import | Approx. Size (min+gzip) |
|---|---|
| `DatePicker` (with CSS) | ~5.5 KB |
| `SearchSelect` | ~1.2 KB |
| `Label` | ~0.3 KB |
| All three (barrel) | ~6.5 KB |

Measured with ESM, tree-shaken, minified, gzipped. Your actual size depends on your bundler configuration.

---

## Browser Support

- Chrome 90+
- Firefox 90+
- Safari 15+
- Edge 90+

Requires `ResizeObserver` (all modern browsers), CSS Grid, and CSS Custom Properties.

---

## Security

- All user content rendered as React text nodes — no raw HTML injection surfaces
- No dynamic code evaluation or runtime code generation
- DatePicker input is `readOnly` — displayed value is always the formatted date, never raw user input
- Synthetic events use safe, explicit value construction
- Popover content is isolated from the input DOM tree via React Portal

Report security issues to: security@allios.app

---

## Development

```bash
# Clone and install
git clone https://github.com/allios/react-bootstrap-plugins.git
cd react-bootstrap-plugins
pnpm install

# Build
pnpm run build

# Watch mode (rebuild on changes)
pnpm run dev
```

### Project Structure

```
src/
├── index.js              Barrel export
├── lib/cn.js             Internal classname utility
├── components/
│   ├── DatePicker.jsx    Date/time/datetime picker
│   ├── SearchSelect.jsx  Searchable select dropdown
│   ├── Label.jsx         Form label
│   └── *.d.ts            TypeScript declarations
└── css/
    └── datepicker-bootstrap.css
```

---

## License

MIT © [Tumwesigye Robert](https://allios.app)

---

## Related

- [Bootstrap 5](https://getbootstrap.com/) — CSS framework this package integrates with
- [React](https://react.dev/) — UI library
- [AlliOs](https://allios.app) — Multi-tenant SaaS ecosystem this package originated from
