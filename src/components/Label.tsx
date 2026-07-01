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

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, hf = 'default', required = true, label = 'Title' }, ref) => {
    return (
      <label htmlFor={hf} className={className} ref={ref}>
        {label}{required ? <b className="text-danger">*</b> : ''}
      </label>
    )
  }
)

Label.displayName = 'Label'

export { Label }
export default Label
