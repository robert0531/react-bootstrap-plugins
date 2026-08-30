import * as React from 'react'
import { cn } from '../lib/cn.js'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface StepperStep {
  /** Unique step identifier — compared against `active` */
  key: string | number
  /** Label text shown next to the circle (hidden on extra-small screens) */
  label?: React.ReactNode
  /**
   * Circle content when `type="icon"`. A string is rendered as
   * `<i className={icon} />` (pass the full icon class, e.g. `"fas fa-user"`);
   * a ReactNode (e.g. a Lucide element) is rendered as-is.
   */
  icon?: string | React.ReactNode
  /**
   * Disable this step — set externally (e.g. form validation).
   * Disabled steps render dimmed, are never clickable, and block the
   * Next button when they are the following step.
   */
  disabled?: boolean
}

export interface StepperProps {
  /** Steps to render */
  steps: StepperStep[]
  /** Key of the current step — defaults to the first step's key */
  active?: string | number
  /**
   * Circle content type:
   * - `"number"` — positional number (1, 2, 3…)
   * - `"icon"` — each step's `icon` (falls back to the number when absent)
   * Completed circles always show a check icon in both modes.
   */
  type?: 'number' | 'icon'
  /** Extra classes on the indicator wrapper */
  className?: string
  /** Extra classes on the footer wrapper */
  footerClassName?: string
  /** Fired when the Prev button is clicked */
  onPrev?: () => void
  /** Fired when the Next button is clicked */
  onNext?: () => void
  /**
   * Fired when the Action button (last step) is clicked.
   * Passing this renders the Action button in place of Next on the last step.
   */
  onAction?: () => void
  /**
   * Fired when a completed step circle is clicked. Passing this makes
   * completed, non-disabled steps clickable; without it circles are
   * purely visual.
   */
  onStepClick?: (step: StepperStep, index: number) => void
  /** Prev button label */
  prevLabel?: React.ReactNode
  /** Next button label */
  nextLabel?: React.ReactNode
  /** Action button label (required when `onAction` is provided) */
  actionLabel?: React.ReactNode
  /** Leading icon for the Action button */
  actionIcon?: string | React.ReactNode
  /** Disable the Action button — e.g. while submitting or when validation fails */
  actionDisabled?: boolean
  /**
   * Force-disable the Next button. Also disabled automatically when the
   * following step has `disabled: true`.
   */
  nextDisabled?: boolean
  /** Hide the Prev button on the first step */
  hidePrevOnFirst?: boolean
  /** Step content rendered between the indicator and the footer */
  children?: React.ReactNode
  /** Inline styles on the indicator wrapper */
  style?: React.CSSProperties
  /** Inline styles on the footer wrapper */
  footerStyle?: React.CSSProperties
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const renderCheck = () => <i className="fas fa-check" aria-hidden="true" />

const renderCircleContent = (
  step: StepperStep,
  index: number,
  isCompleted: boolean,
  type: NonNullable<StepperProps['type']>
): React.ReactNode => {
  if (isCompleted) return renderCheck()
  if (type === 'icon' && step.icon) {
    return typeof step.icon === 'string'
      ? <i className={step.icon} />
      : <span className="d-inline-flex align-items-center">{step.icon}</span>
  }
  return index + 1
}

/* ------------------------------------------------------------------ */
/*  Stepper                                                            */
/* ------------------------------------------------------------------ */

/**
 * Horizontal Bootstrap 5 step indicator with built-in wizard footer
 * (Prev / Next / Action buttons). Controlled component — the caller owns
 * the current step key, per-step validation (`step.disabled`), and all
 * button callbacks.
 *
 * The rendered structure mirrors a card wizard: indicator strip
 * (`card-body`) → `children` step content → footer (`card-footer`).
 * When no button handlers are passed, the footer is omitted and the
 * component acts as a pure indicator.
 *
 * No custom CSS required — Bootstrap 5 utility classes only. Icons use
 * Font Awesome classes (`fas fa-*`), which the host app must load.
 */
const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(({
  steps = [],
  active,
  type = 'number',
  className,
  footerClassName,
  onPrev,
  onNext,
  onAction,
  onStepClick,
  prevLabel = 'Back',
  nextLabel = 'Next',
  actionLabel = 'Submit',
  actionIcon,
  actionDisabled = false,
  nextDisabled = false,
  hidePrevOnFirst = true,
  children,
  style,
  footerStyle
}, ref) => {
  if (steps.length === 0) return null

  const activeIndex = steps.findIndex((s) => s.key === active)
  const currentIndex = activeIndex === -1 ? 0 : activeIndex
  const isFirst = currentIndex === 0
  const isLast = currentIndex === steps.length - 1

  const renderActionIcon = (): React.ReactNode => {
    if (actionIcon) {
      return typeof actionIcon === 'string'
        ? <i className={cn(actionIcon, 'me-1')} aria-hidden="true" />
        : actionIcon
    }
    return <i className="fas fa-paper-plane me-1" aria-hidden="true" />
  }

  const hasFooter = Boolean(onPrev || onNext || onAction)
  const showPrev = Boolean(onPrev) && !(hidePrevOnFirst && isFirst)
  const showAction = Boolean(onAction) && isLast
  const showNext = Boolean(onNext) && !isLast
  const nextStep = isLast ? undefined : steps[currentIndex + 1]
  const isNextDisabled = nextDisabled || Boolean(nextStep?.disabled)

  const circles = steps.map((step, index) => {
    const isCompleted = index < currentIndex
    const isActive = index === currentIndex
    const isDisabled = Boolean(step.disabled)
    const isClickable = Boolean(onStepClick) && isCompleted && !isDisabled

    const circleClasses = cn(
      'rounded-circle d-flex align-items-center justify-content-center fw-semibold',
      {
        'border-0': isClickable,
        'bg-primary text-white': (isCompleted || isActive) && !isDisabled,
        'bg-light border text-secondary': !isCompleted && !isActive && !isDisabled,
        'bg-light border text-muted opacity-50': isDisabled
      }
    )
    const circleStyle: React.CSSProperties = { width: 32, height: 32, fontSize: '0.85rem' }
    const circleContent = renderCircleContent(step, index, isCompleted && !isDisabled, type)

    const circle = isClickable ? (
      <button
        type="button"
        className={circleClasses}
        style={circleStyle}
        aria-label={`Go to step ${index + 1}${step.label ? `: ${step.label}` : ''}`}
        onClick={() => onStepClick?.(step, index)}
      >
        {circleContent}
      </button>
    ) : (
      <div
        className={circleClasses}
        style={circleStyle}
        aria-current={isActive ? 'step' : undefined}
        aria-disabled={isDisabled || undefined}
      >
        {circleContent}
      </div>
    )

    const label = step.label ? (
      <small className={cn(
        'd-none d-sm-inline',
        isDisabled
          ? 'text-muted opacity-50'
          : isCompleted || isActive
            ? 'text-primary fw-semibold'
            : 'text-secondary'
      )}>
        {step.label}
      </small>
    ) : null

    const connector = index < steps.length - 1 ? (
      <div
        className={cn('border-top border-2', isCompleted ? 'border-primary' : 'border-light')}
        style={{ width: 24 }}
        aria-hidden="true"
      />
    ) : null

    return (
      <div key={String(step.key)} className="d-flex align-items-center gap-2">
        {circle}
        {label}
        {connector}
      </div>
    )
  })

  return (
    <>
      <div ref={ref} className={cn('rounded-0 border-bottom py-4 bg-light', className)} style={style}>
        <div className="d-flex justify-content-center align-items-center gap-2">
          {circles}
        </div>
      </div>

      {children}

      {hasFooter && (
        <div
          className={cn(
            'card-footer bg-body-tertiary border-top d-flex p-2',
            showPrev ? 'justify-content-between' : 'justify-content-end',
            footerClassName
          )}
          style={footerStyle}
        >
          {showPrev && (
            <button type="button" className="btn btn-outline-secondary" onClick={onPrev}>
              <i className="fas fa-arrow-left me-1" aria-hidden="true" />
              {prevLabel}
            </button>
          )}

          {showNext && (
            <button type="button" className="btn btn-primary" disabled={isNextDisabled} onClick={onNext}>
              {nextLabel}
              <i className="fas fa-arrow-right ms-1" aria-hidden="true" />
            </button>
          )}

          {showAction && (
            <button type="button" className="btn btn-primary" disabled={actionDisabled} onClick={onAction}>
              {renderActionIcon()}
              {actionLabel}
            </button>
          )}
        </div>
      )}
    </>
  )
})

Stepper.displayName = 'Stepper'

export { Stepper }
