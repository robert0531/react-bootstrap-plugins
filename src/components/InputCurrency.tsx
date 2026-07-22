import * as React from 'react'
import { cn } from '../lib/cn.js'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface InputCurrencyProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type'> {
  /**
   * Numeric value to display. Accepts `number` or `string` (the component
   * coerces to `Number` internally). Pass `undefined` / `null` / `''` for
   * an empty field.
   */
  value?: number | string | null
  /**
   * Called with a synthetic input change event. `e.target.value` is
   * replaced by the parsed numeric value — a `number` when the input
   * holds a valid figure, or `''` when the field is cleared.
   * `e.target.name` is preserved so the parent can identify the field.
   */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  /** ISO 4217 currency code (default `'UGX'`) */
  currency?: string
  /** BCP 47 locale tag for formatting (default `'en-UG'`) */
  locale?: string
  /**
   * Number of decimal places.
   * UGX = 0, USD = 2, JPY = 0, etc. (default `0`)
   */
  decimals?: number
  /**
   * When `true`, formatting omits the currency symbol and outputs a plain
   * locale-formatted number (e.g. `'150,000'` instead of `'UGX 150,000'`).
   * Useful for non-monetary numeric inputs that still benefit from
   * thousand-separator formatting.
   */
  plain?: boolean
}

/* ------------------------------------------------------------------ */
/*  InputCurrency                                                      */
/* ------------------------------------------------------------------ */

/**
 * Controlled currency input for financial forms.
 *
 * **Data contract**: numbers in, numbers out. The component manages a
 * locale-formatted display internally — the consumer never sees commas
 * or currency symbols in its state.
 *
 * **Editing UX**: while the field is focused, the raw number is shown so
 * the user can type without commas / symbols fighting their keystrokes.
 * On blur (or when the external `value` prop changes from above), the
 * display snaps back to the locale-formatted string.
 *
 * @example
 * // UGX — zero decimal places, symbol shown
 * <InputCurrency
 *   value={150000}
 *   name="fee"
 *   onChange={(e) => setFee(e.target.value)}
 * />
 *
 * @example
 * // USD with cents
 * <InputCurrency
 *   value={99.99}
 *   currency="USD"
 *   locale="en-US"
 *   decimals={2}
 *   name="price"
 *   onChange={(e) => setPrice(e.target.value)}
 * />
 *
 * @example
 * // Plain locale number — no currency symbol
 * <InputCurrency
 *   value={50000}
 *   plain
 *   name="count"
 *   onChange={(e) => setCount(e.target.value)}
 * />
 */
const InputCurrency = React.forwardRef<HTMLInputElement, InputCurrencyProps>(
  (
    {
      value,
      onChange,
      className,
      name,
      id,
      disabled = false,
      readOnly = false,
      placeholder,
      currency = 'UGX',
      locale = 'en-UG',
      decimals = 0,
      plain = false,
      onBlur,
      onFocus,
      ...rest
    },
    ref,
  ) => {
    /* ---- helpers -------------------------------------------------------- */

    /**
     * Number → locale-formatted display string.
     * Returns `''` for null / undefined / NaN so the input shows the placeholder.
     */
    const formatDisplay = React.useCallback(
      (val: number | string | null | undefined): string => {
        if (val === null || val === undefined || val === '') return ''
        const num = Number(val)
        if (Number.isNaN(num)) return ''

        const fractionDigits: Intl.NumberFormatOptions =
          decimals > 0
            ? { minimumFractionDigits: decimals, maximumFractionDigits: decimals }
            : { minimumFractionDigits: 0, maximumFractionDigits: 0 }

        return plain
          ? num.toLocaleString(locale, fractionDigits)
          : num.toLocaleString(locale, { style: 'currency', currency, ...fractionDigits })
      },
      [currency, locale, decimals, plain],
    )

    /**
     * Raw input string → numeric value (`number | ''`).
     * Strips formatting characters, handles edge cases like lone `"."` or `"-"`.
     */
    const parseNumeric = React.useCallback(
      (raw: string): number | '' => {
        if (!raw) return ''
        // Remove everything except digits, decimal point, and leading minus
        const cleaned = raw.replace(/[^0-9.\-]/g, '')
        // Guard against "-" alone
        if (cleaned === '-' || cleaned === '') return ''
        // Guard against lone "."
        if (cleaned === '.') return ''
        const num = Number(cleaned)
        if (Number.isNaN(num)) return ''
        return decimals === 0 ? Math.round(num) : num
      },
      [decimals],
    )

    /* ---- derived state -------------------------------------------------- */

    const [focused, setFocused] = React.useState(false)

    // The string shown inside the `<input>`. While the user is editing we show
    // the raw number so commas / symbols don't fight their keystrokes. When
    // they leave the field (or the external value changes from above) we
    // reformat.
    const [inner, setInner] = React.useState<string>(() => formatDisplay(value))

    // Keep the display in sync when the parent pushes a new value while the
    // field is NOT focused (e.g. after a successful API call that resets the
    // form, or switching between records).
    const prevValueRef = React.useRef(value)
    React.useEffect(() => {
      if (!focused && value !== prevValueRef.current) {
        setInner(formatDisplay(value))
      }
      prevValueRef.current = value
    }, [value, focused, formatDisplay])

    /* ---- event handlers ------------------------------------------------- */

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value
      setInner(raw) // let the user see what they're typing

      const numeric = parseNumeric(raw);
      (e.target as unknown as { value: string | number }).value = numeric
      onChange?.(e)
    }

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(true)
      // Switch display to raw number so the user can edit without friction
      if (value !== null && value !== undefined && value !== '') {
        setInner(String(value))
      }
      onFocus?.(e)
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(false)
      // Re-format before the user sees the field again
      const numeric = parseNumeric(e.target.value)
      setInner(formatDisplay(numeric))
      onBlur?.(e)
    }

    /* ---- render --------------------------------------------------------- */

    return (
      <input
        ref={ref}
        type="text"
        id={id ?? name}
        name={name}
        value={inner}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={disabled}
        readOnly={readOnly}
        placeholder={placeholder}
        inputMode="decimal"
        autoComplete="off"
        className={cn('form-control', className)}
        {...rest}
      />
    )
  },
)

InputCurrency.displayName = 'InputCurrency'

export { InputCurrency }
export default InputCurrency
