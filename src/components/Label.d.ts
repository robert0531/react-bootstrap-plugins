import * as React from 'react'

export interface LabelProps {
  /** Additional CSS classes */
  className?: string
  /** htmlFor attribute — associates label with input ID (default 'default') */
  hf?: string
  /** Whether to show the required asterisk (default true) */
  required?: boolean
  /** Label text content (default 'Title') */
  label?: string
}

export const Label: React.ForwardRefExoticComponent<
  LabelProps & React.RefAttributes<HTMLLabelElement>
>
