import * as React from 'react'

export interface FormRowProps {
  /** Label text rendered above the field */
  label?: string
  /** Helper text rendered below the field */
  hint?: string
  /** Whether to show the required asterisk (default false) */
  required?: boolean
  /** Additional CSS classes on the wrapper */
  className?: string
  /** Form control(s) rendered inside the row */
  children?: React.ReactNode
}

const FormRow = React.forwardRef<HTMLDivElement, FormRowProps>(
  ({ label, children, hint, required = false, className }, ref) => {
    return (
      <div className={className} ref={ref}>
        <label className="form-label small fw-medium">
          {label} {required && <b className="text-danger ms-1">*</b>}
        </label>
        {children}
        {hint && <div className="form-text text-muted">{hint}</div>}
      </div>
    )
  }
)

FormRow.displayName = 'FormRow'

export { FormRow }
