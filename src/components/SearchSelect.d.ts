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
  /** Called with the selected value when user picks */
  onChange?: (value: any) => void
  /** Input element ID */
  id?: string
  /** Disable the input */
  disabled?: boolean
}

declare const SearchSelect: React.ForwardRefExoticComponent<
  SearchSelectProps & React.RefAttributes<HTMLDivElement>
>

export default SearchSelect
