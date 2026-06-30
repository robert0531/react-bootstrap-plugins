import * as React from 'react'

export interface SearchSelectProps<T = any> {
  /** Additional CSS classes on the wrapper */
  className?: string
  /** Selectable options — primitives (string/number/boolean) or objects */
  options?: T[] | Array<string | number | boolean>
  /** Key for display text when options are objects (default 'label') */
  labelKey?: string
  /** Key for the value when options are objects (default 'value') */
  valueKey?: string
  /** Placeholder text (default 'Select...') */
  placeholder?: string
  /** Currently selected value */
  value?: any
  /** Called with synthetic event; e.target.value is the selected value, e.target.name is the input name */
  onChange?: (e: { target: { value: any; name: string } }) => void
  /** Input element ID */
  id?: string
  /** Input name attribute — surfaces as e.target.name in onChange */
  name?: string
  /** Disable the input */
  disabled?: boolean
}

declare const SearchSelect: React.ForwardRefExoticComponent<
  SearchSelectProps & React.RefAttributes<HTMLDivElement>
>

export default SearchSelect
export { SearchSelect }
