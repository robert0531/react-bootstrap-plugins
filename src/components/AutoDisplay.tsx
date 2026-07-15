import * as React from 'react'

export interface AutoDisplayProps {
  /** Whether the content is visible (default false) */
  visible?: boolean
  /** Additional CSS classes */
  className?: string
  /** Inline styles to merge */
  style?: React.CSSProperties
  /** Content to show/hide */
  children?: React.ReactNode
}

const AutoDisplay = React.forwardRef<HTMLDivElement, AutoDisplayProps>(
  ({ visible = false, className, children, style, ...rest }, ref) => (
    <div
      ref={ref}
      className={className}
      style={{ ...style, display: visible ? 'block' : 'none' }}
      {...rest}
    >
      {children}
    </div>
  )
)

AutoDisplay.displayName = 'AutoDisplay'

export { AutoDisplay }
export default AutoDisplay
