import * as React from 'react'

export interface DatePickerProps {
  /** Picker mode (default 'date') */
  mode?: 'date' | 'time' | 'datetime'
  /** Currently selected Date (alias for `value`) */
  selected?: Date | null
  /** Currently selected Date */
  value?: Date | string | number | null
  /**
   * Synthetic event handler — `e.target.value` is a pre-formatted string:
   * - date → `"YYYY-MM-DD"`
   * - time → `"hh:mm AA"`
   * - datetime → `"YYYY-MM-DD hh:mm AA"`
   */
  onChange?: (e: { target: { value: string | null; name: string; type: string } }) => void
  /** Display format — tokens: yyyy, MM, dd, hh, mm, aa */
  dateFormat?: string
  /** Placeholder text when empty */
  placeholderText?: string
  /** Bootstrap size variant */
  size?: 'sm' | 'lg'
  /** Show a clear button on the input */
  isClearable?: boolean
  /** Disable the input */
  disabled?: boolean
  /** Earliest selectable date */
  minDate?: Date
  /** Latest selectable date */
  maxDate?: Date
  /** Minute step in the time list (default 5) */
  timeIntervals?: number
  /** Timezone identifier for display (default 'Kampala') */
  timezone?: string
  /** Additional CSS classes on the input */
  className?: string
  /** Input element ID */
  id?: string
  /** Input name attribute */
  name?: string
}

export const DatePicker: React.ForwardRefExoticComponent<
  DatePickerProps & React.RefAttributes<HTMLInputElement>
>
