import * as React from 'react'
import { createPortal } from 'react-dom'
import { cn } from '../lib/cn.js'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type ConfirmDialogVariant = 'primary' | 'danger' | 'success' | 'warning' | 'info'

export interface ConfirmDialogProps {
  /** Visibility — fully controlled by the caller */
  show: boolean
  /** Dialog title */
  title: React.ReactNode
  /** Body message (string or JSX) */
  message: React.ReactNode
  /**
   * Fired when the confirm button is clicked. May return a promise —
   * the dialog shows a pending spinner until it resolves.
   * On rejection the dialog stays open and the error propagates;
   * callers handle their own error display inside `onConfirm`.
   */
  onConfirm: () => void | Promise<void>
  /** Fired on the Cancel button or the Escape key */
  onCancel: () => void
  /** Confirm button label */
  label?: React.ReactNode
  /** Bootstrap color variant for the confirm button, header dot, and message rule */
  variant?: ConfirmDialogVariant
  /** Extra CSS classes on the dialog element */
  className?: string
}

/* ------------------------------------------------------------------ */
/*  ConfirmDialog                                                      */
/* ------------------------------------------------------------------ */

/**
 * Zero-dependency Bootstrap 5 confirmation dialog.
 *
 * Renders standard `.modal` markup portaled to `document.body` with its own
 * backdrop — no react-bootstrap required. Backdrop clicks do nothing;
 * Escape fires `onCancel`; focus is trapped inside the dialog and lands on
 * the confirm button on open. Body scroll is locked while shown.
 *
 * **Important:** the accompanying CSS **must** be imported for the premium
 * styling (backdrop, radius, header dot, message rule):
 * ```js
 * import 'react-bootstrap-plugins/css/plugins.css'
 * ```
 */
const ConfirmDialog = React.forwardRef<HTMLDivElement, ConfirmDialogProps>(({
  show = false,
  title,
  message,
  onConfirm,
  onCancel,
  label = 'Confirm',
  variant = 'primary',
  className,
}, ref) => {
  const [isPending, setIsPending] = React.useState(false)
  const titleId = React.useId()
  const messageId = React.useId()
  const dialogRef = React.useRef<HTMLDivElement>(null)
  const confirmRef = React.useRef<HTMLButtonElement>(null)

  /* Focus the primary action when the dialog opens */
  React.useEffect(() => {
    if (show) confirmRef.current?.focus()
  }, [show])

  /* Body scroll lock while shown (compensate scrollbar disappearance) */
  React.useEffect(() => {
    if (!show) return
    const { body } = document
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    const prevOverflow = body.style.overflow
    const prevPaddingRight = body.style.paddingRight
    body.style.overflow = 'hidden'
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`
    return () => {
      body.style.overflow = prevOverflow
      body.style.paddingRight = prevPaddingRight
    }
  }, [show])

  /* Escape closes (unless a confirm is pending) */
  React.useEffect(() => {
    if (!show) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isPending) onCancel()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [show, isPending, onCancel])

  /* Tab / Shift+Tab cycle within the dialog */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Tab') return
    const root = dialogRef.current
    if (!root) return
    const focusables = Array.from(
      root.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
    ).filter((el) => !el.hasAttribute('disabled'))
    if (!focusables.length) return
    const first = focusables[0]
    const last = focusables[focusables.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  const handleConfirmClick = async () => {
    if (isPending) return
    setIsPending(true)
    try {
      await onConfirm()
    } finally {
      setIsPending(false)
    }
  }

  if (!show || typeof document === 'undefined') return null

  return createPortal(
    <>
      <div className="confirmdialog-backdrop" aria-hidden="true" />
      <div
        ref={ref}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={messageId}
        className={cn('modal confirmdialog d-block', className)}
        onKeyDown={handleKeyDown}
      >
        <div ref={dialogRef} className="modal-dialog modal-dialog-centered modal-sm">
          <div className="modal-content">
            <div className="confirmdialog-header">
              <span className={cn('confirmdialog-dot', `bg-${variant}`)} aria-hidden="true" />
              <h5 className="modal-title" id={titleId}>{title}</h5>
            </div>
            <div
              id={messageId}
              className={cn('confirmdialog-body border-start border-3', `border-${variant}`)}
            >
              {message}
            </div>
            <div className="confirmdialog-footer">
              <button type="button" className="btn btn-light" onClick={onCancel} disabled={isPending}>
                Cancel
              </button>
              <button
                ref={confirmRef}
                type="button"
                className={cn('btn', `btn-${variant}`, 'fw-semibold')}
                onClick={handleConfirmClick}
                disabled={isPending}
              >
                {isPending && <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />}
                {label}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body
  )
})

ConfirmDialog.displayName = 'ConfirmDialog'

export { ConfirmDialog }
export default ConfirmDialog
