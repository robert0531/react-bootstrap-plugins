import * as React from 'react'

/**
 * A simple Bootstrap-styled form label with an optional required indicator.
 *
 * @param {string}  [className]      - Additional CSS classes
 * @param {string}  [hf='default']   - htmlFor attribute (associates label with input ID)
 * @param {boolean} [required=true]  - Whether to show the required asterisk
 * @param {string}  [label='Title']  - Label text content
 */
const Label = React.forwardRef(({ className, hf = 'default', required = true, label = 'Title' }, ref) => {
  return (
    <label htmlFor={hf} className={className} ref={ref}>
      {label}{required ? <b className="text-danger">*</b> : ''}
    </label>
  )
})

Label.displayName = 'Label'

export { Label }
