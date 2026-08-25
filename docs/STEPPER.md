# Stepper

Zero-dependency Bootstrap 5 step indicator with a built-in wizard footer (Prev / Next / Action buttons). Controlled component — you own the current step, per-step validation, and every callback. Pure Bootstrap utility classes: no plugin CSS required.

## Import

```js
import { Stepper } from 'react-bootstrap-plugins/Stepper'
// or
import { Stepper } from 'react-bootstrap-plugins'
```

Requires Bootstrap 5 CSS and Font Awesome icons (`fas fa-*`) loaded in your app.

## Usage

```jsx
const [step, setStep] = useState(1)

<Stepper
  steps={[
    { key: 1, label: 'Guide' },
    { key: 2, label: 'Accounts', disabled: validateStep2 },   // validated externally
    { key: 3, label: 'Details' },
  ]}
  active={step}
  onPrev={() => setStep((s) => s - 1)}
  onNext={() => setStep((s) => s + 1)}
  onAction={submitTransfer}
  actionLabel="Transfer Funds"
  actionDisabled={validateStep3 || loading}
>
  {step === 1 && <StepOneContent />}
  {step === 2 && <StepTwoContent />}
  {step === 3 && <StepThreeContent />}
</Stepper>
```

The component renders the indicator strip, your `children` (step content), then the footer — designed to sit inside a Bootstrap `.card`.

**Icon mode** — circles show each step's icon instead of a number:

```jsx
<Stepper
  type="icon"
  steps={[
    { key: 'info', label: 'Info', icon: 'fas fa-info' },
    { key: 'accounts', label: 'Accounts', icon: 'fas fa-university' },
  ]}
  active="info"
/>
```

**Pure indicator** — omit all button handlers and the footer disappears:

```jsx
<Stepper steps={steps} active={current} />
```

**Clickable history** — pass `onStepClick` to let users jump back to completed steps:

```jsx
<Stepper
  steps={steps}
  active={current}
  onStepClick={(_, index) => setCurrent(steps[index].key)}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `steps` | `StepperStep[]` | required | Steps to render |
| `active` | `string \| number` | first step's key | Key of the current step |
| `type` | `"number" \| "icon"` | `"number"` | Circle content; completed circles always show a check |
| `className` | `string` | — | Extra classes on the indicator wrapper |
| `footerClassName` | `string` | — | Extra classes on the footer wrapper |
| `style` / `footerStyle` | `CSSProperties` | — | Inline styles |
| `onPrev` | `() => void` | — | Prev button click |
| `onNext` | `() => void` | — | Next button click |
| `onAction` | `() => void` | — | Action button click (shown on the last step in place of Next) |
| `onStepClick` | `(step, index) => void` | — | Makes completed, non-disabled circles clickable |
| `prevLabel` | `ReactNode` | `"Back"` | Prev button label |
| `nextLabel` | `ReactNode` | `"Next"` | Next button label |
| `actionLabel` | `ReactNode` | `"Submit"` | Action button label |
| `actionIcon` | `string \| ReactNode` | paper-plane icon | Leading icon; string = `<i className>` |
| `actionDisabled` | `boolean` | `false` | Disable the Action button (e.g. while submitting) |
| `nextDisabled` | `boolean` | `false` | Force-disable Next (also auto-disabled when the next step has `disabled: true`) |
| `hidePrevOnFirst` | `boolean` | `true` | Hide Prev on the first step; footer right-aligns when hidden |
| `children` | `ReactNode` | — | Step content rendered between indicator and footer |

### `StepperStep`

| Prop | Type | Description |
|------|------|-------------|
| `key` | `string \| number` | Unique identifier, compared against `active` |
| `label` | `ReactNode` | Text next to the circle (hidden on extra-small screens) |
| `icon` | `string \| ReactNode` | Circle content in `"icon"` mode |
| `disabled` | `boolean` | Disabled steps render dimmed, are never clickable, and block Next |

## Behavior

- **Completed circles** show a check icon; active circle is `bg-primary`; pending circles are light with a border.
- **Connector lines** between circles turn primary once the left step is completed.
- **Footer layout:** Prev hidden on the first step (footer right-aligns). Next hidden on the last step, replaced by the Action button when `onAction` is passed.
- **Accessibility:** native buttons, `aria-current="step"` on the active circle, `aria-disabled` on disabled steps, `aria-label` on clickable circles, icon-only elements hidden from screen readers.

## Dark Mode

All colors use Bootstrap CSS variables — adapts automatically via `[data-bs-theme="dark"]`.
