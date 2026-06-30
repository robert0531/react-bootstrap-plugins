# react-bootstrap-plugins

> Production-grade Bootstrap 5 UI components for React 18+. Zero runtime dependencies. Tree-shakeable.

[![license](https://img.shields.io/npm/l/react-bootstrap-plugins)](./LICENSE)

---

## Components

| Component | Guide | Description |
|---|---|---|
| **DatePicker** | [DATEPICKER.md](./docs/DATEPICKER.md) | Date, time, and datetime picker with popover calendar |
| **SearchSelect** | [SEARCHSELECT.md](./docs/SEARCHSELECT.md) | Filterable, searchable select dropdown |
| **Label** | [LABEL.md](./docs/LABEL.md) | Bootstrap-styled form label with required indicator |
| **TableLoading** | [TABLELOADING.md](./docs/TABLELOADING.md) | Bootstrap 5 placeholder loading skeleton for table `<tbody>` |

Each component guide includes full prop tables, usage examples, import patterns, and dark mode behavior.

---

## Features

- 🎯 **Zero runtime dependencies** — only React and React DOM as peer dependencies
- 🌳 **Tree-shakeable** — import only what you need; unused components are stripped at build time
- 🎨 **Bootstrap 5 native** — uses CSS custom properties (`--bs-*`), respects dark mode via `[data-bs-theme="dark"]`
- 📦 **ESM + CJS dual format** — works with any bundler (Vite, webpack, Turbopack, Rollup)
- 🔒 **TypeScript ready** — full `.d.ts` declarations included
- ♿ **Accessible** — ARIA attributes, keyboard navigation, screen-reader friendly
- 📱 **Responsive** — mobile-optimized layouts for all components

---

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

### CSS Imports

DatePicker requires a small CSS file for its popover calendar layout. Import it **once** in your app (e.g., in your root component or entry point):

```js
// Recommended — uses the package exports map (works with Vite, webpack 5+, Turbopack, Rollup)
import 'react-bootstrap-plugins/css/datepicker.css'
```

This resolves to `dist/css/datepicker.css` via the package's `exports` map. No additional configuration is needed for modern bundlers.

#### Troubleshooting CSS import issues

If your bundler reports **"Cannot find module"** or fails to resolve the CSS import:

- **Ensure you're on the latest version** — prior versions may have had a packaging issue with nested CSS directories.

  ```bash
  pnpm update react-bootstrap-plugins
  ```

- **For older webpack (v4)** — you may need to use the full path if your version doesn't support the `exports` field.

  ```js
  import 'react-bootstrap-plugins/dist/css/datepicker.css'
  ```

- **For Next.js** — add the package to `transpilePackages` in `next.config.mjs` if not already present.

  ```js
  transpilePackages: ['react-bootstrap-plugins']
  ```

- **For TypeScript** — if you get a type error on the CSS import, add a declaration file (most projects already have this for CSS modules).

  ```ts
  // src/types/css.d.ts
  declare module '*.css' { const content: string; export default content }
  ```

---

## Import Patterns

All patterns are tree-shakeable. Your bundler will only include the code you actually import.

```js
// Single component — smallest bundle (default import)
import DatePicker from 'react-bootstrap-plugins/DatePicker'
import SearchSelect from 'react-bootstrap-plugins/SearchSelect'
import Label from 'react-bootstrap-plugins/Label'
import TableLoading from 'react-bootstrap-plugins/TableLoading'

// Single component — named import
import { DatePicker } from 'react-bootstrap-plugins/DatePicker'
import { SearchSelect } from 'react-bootstrap-plugins/SearchSelect'
import { Label } from 'react-bootstrap-plugins/Label'
import { TableLoading } from 'react-bootstrap-plugins/TableLoading'

// Multiple named — barrel, tree-shaken
import { DatePicker, SearchSelect, Label, TableLoading } from 'react-bootstrap-plugins'

// CSS (required for DatePicker)
import 'react-bootstrap-plugins/css/datepicker.css'
```

Every component supports **both** default and named imports — use whichever fits your codebase conventions.

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
| `TableLoading` | ~0.2 KB |
| All four (barrel) | ~6.7 KB |

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
│   ├── TableLoading.jsx  Table placeholder skeleton
│   └── *.d.ts            TypeScript declarations
└── css/
    └── datepicker.css
```

---

## License

MIT © [Tumwesigye Robert](https://allios.app)

---

## Related

- [Bootstrap 5](https://getbootstrap.com/) — CSS framework this package integrates with
- [React](https://react.dev/) — UI library
- [AlliOs](https://allios.app) — Multi-tenant SaaS ecosystem this package originated from
