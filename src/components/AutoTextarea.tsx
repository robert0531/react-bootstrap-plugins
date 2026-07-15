import * as React from 'react'
import { cn } from '../lib/cn.js'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface AutoTextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'rows'> {
  /** Minimum number of visible rows (default 2) */
  minRows?: number
  /** Maximum number of rows before scrolling (default 8) */
  maxRows?: number
  /**
   * Hard cap on height in pixels. When provided it overrides the
   * `maxRows`-derived limit — the textarea grows up to `maxHeight`
   * and becomes scrollable beyond it.
   */
  maxHeight?: number
}

/* ------------------------------------------------------------------ */
/*  AutoTextarea                                                       */
/* ------------------------------------------------------------------ */

/**
 * Bootstrap-styled textarea that automatically adjusts its height to fit
 * its content. Zero dependencies.
 *
 * Grows as the user types, up to `maxRows` (or `maxHeight` in px when
 * provided), then shows a scrollbar. Shrinks back down when content is
 * removed.
 *
 * @example
 * <AutoTextarea value={text} onChange={e => setText(e.target.value)} minRows={2} maxRows={8} />
 * <AutoTextarea value={text} onChange={e => setText(e.target.value)} maxHeight={240} />
 */
const AutoTextarea = React.forwardRef<HTMLTextAreaElement, AutoTextareaProps>(({
  className,
  value,
  onChange,
  minRows = 2,
  maxRows = 8,
  maxHeight,
  style,
  ...props
}, ref) => {
  const innerRef = React.useRef<HTMLTextAreaElement>(null)

  const adjustHeight = React.useCallback(() => {
    const el = innerRef.current
    if (!el) return

    // Reset height to auto so scrollHeight reflects actual content size
    el.style.height = 'auto'

    const computed = getComputedStyle(el)
    const lineHeight = parseFloat(computed.lineHeight) || 20
    const paddingTop = parseFloat(computed.paddingTop) || 0
    const paddingBottom = parseFloat(computed.paddingBottom) || 0
    const borderTop = parseFloat(computed.borderTopWidth) || 0
    const borderBottom = parseFloat(computed.borderBottomWidth) || 0

    const verticalPadding = paddingTop + paddingBottom + borderTop + borderBottom
    const minH = lineHeight * minRows + verticalPadding
    /* Explicit pixel cap wins over the row-based limit */
    const maxH = maxHeight ?? lineHeight * maxRows + verticalPadding

    const newHeight = Math.min(Math.max(el.scrollHeight, minH), maxH)
    el.style.height = `${newHeight}px`
    el.style.overflowY = el.scrollHeight > maxH + 1 ? 'auto' : 'hidden'
  }, [minRows, maxRows, maxHeight])

  // Adjust on every value change
  React.useEffect(() => {
    adjustHeight()
  }, [value, adjustHeight])

  // Adjust on window resize (wrapping changes with width)
  React.useEffect(() => {
    const handleResize = () => adjustHeight()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [adjustHeight])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(e)
    /* Keep uncontrolled usage working — value effect won't fire without a prop change */
    adjustHeight()
  }

  /* ---- merged ref ---- */
  const mergeRef = React.useCallback((node: HTMLTextAreaElement | null) => {
    innerRef.current = node
    if (typeof ref === 'function') ref(node)
    else if (ref) ref.current = node
  }, [ref])

  return (
    <textarea
      ref={mergeRef}
      value={value}
      onChange={handleChange}
      className={cn('form-control', className)}
      rows={minRows}
      style={{ resize: 'none', overflow: 'hidden', ...style }}
      {...props}
    />
  )
})

AutoTextarea.displayName = 'AutoTextarea'

export { AutoTextarea }
export default AutoTextarea
