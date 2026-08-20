import * as React from 'react'
import { cn } from '../lib/cn.js'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface ListGroupItem {
  /** Unique item identifier — compared against `active` */
  key: string | number
  /** Item label text */
  label?: React.ReactNode
  /**
   * Optional leading icon. A string is rendered as `<i className={icon} />`
   * (pass the full icon class, e.g. `"fas fa-user"` or `"bi bi-person"`);
   * a ReactNode (e.g. a Lucide element) is rendered as-is.
   */
  icon?: string | React.ReactNode
  /** Subtitle/description text below the label row */
  desc?: string
  /** Badge content on the right side — string/number get styled, ReactNode rendered as-is */
  badge?: string | number | React.ReactNode
  /** Gray out the item and prevent click */
  disabled?: boolean
}

export interface ListGroupProps {
  /** Items to render */
  items: ListGroupItem[]
  /** Key of the currently active item */
  active?: string | number
  /** Bootstrap color variant for active state highlighting (default: "primary") */
  variant?: string
  /** Fired when an item is clicked (not fired for disabled items) */
  onClick?: (item: ListGroupItem) => void
  /** Remove outer borders and rounded corners (Bootstrap `list-group-flush`) */
  flush?: boolean
  /** Icon container width/height in pixels (default: 30) */
  iconSize?: number
  /** Show the item `desc` as a native tooltip via the `title` attribute (default: true) */
  showTooltip?: boolean
  /** Additional CSS classes on the outer wrapper */
  className?: string
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const renderIcon = (icon: ListGroupItem['icon'], variant: string, isActive: boolean): React.ReactNode => {
  if (!icon) return null
  const textClass = isActive ? `text-${variant}` : 'text-primary'
  if (typeof icon === 'string') return <i className={cn(icon, textClass)} />
  return <span className={cn('d-inline-flex align-middle', textClass)}>{icon}</span>
}

const renderBadge = (badge: ListGroupItem['badge'], variant: string, isActive: boolean): React.ReactNode => {
  if (badge === undefined || badge === null) return null
  const v = isActive ? variant : 'primary'
  if (typeof badge === 'string' || typeof badge === 'number') {
    return (
      <span
        style={{ width: 20, height: 20 }}
        className={`bg-opacity-25 bg-${v} d-flex justify-content-center align-items-center fw-bolder rounded text-${v}`}
      >
        {badge}
      </span>
    )
  }
  return <>{badge}</>
}

/* ------------------------------------------------------------------ */
/*  ListGroup                                                          */
/* ------------------------------------------------------------------ */

/**
 * Bootstrap 5 list-group with active-state highlighting, icons, badges,
 * and descriptions.
 *
 * ```jsx
 * import ListGroup from 'react-bootstrap-plugins/ListGroup'
 *
 * const items = [
 *   { key: 'fees', label: 'Fee Structure', icon: 'fas fa-coins', desc: 'Define fee types' },
 *   { key: 'invoices', label: 'Invoices', icon: 'fas fa-file-invoice', badge: 3 },
 * ]
 *
 * <ListGroup items={items} active={selected} variant="success" onClick={handleSelect} />
 * ```
 */
const ListGroup = React.forwardRef<HTMLDivElement, ListGroupProps>(({
  items = [],
  active,
  variant = 'primary',
  onClick,
  flush = false,
  iconSize = 30,
  showTooltip = true,
  className,
}, ref) => {
  return (
    <div ref={ref} className={cn('list-group', flush && 'list-group-flush', className)}>
      {items.map((item) => {
        const isActive = item.key === active
        const isDisabled = item.disabled

        return (
          <button
            key={item.key}
            type="button"
            title={showTooltip ? item.desc : undefined}
            className={cn(
              'list-group-item list-group-item-action border-0 px-3 py-2',
              isActive && 'active shadow-sm',
              isDisabled && 'disabled'
            )}
            disabled={isDisabled}
            onClick={(event) => {
              event.stopPropagation()
              if (!isDisabled) onClick?.(item)
            }}
            aria-current={isActive ? 'true' : undefined}
          >
            <div className="d-flex justify-content-between align-items-center">
              <p className="d-flex align-items-center mb-0 gap-2">
                {item.icon && (
                  <span
                    style={{ width: iconSize, height: iconSize }}
                    className={cn(
                      'rounded d-flex align-items-center justify-content-center',
                      isActive ? `bg-${variant} bg-opacity-25` : 'bg-primary bg-opacity-10'
                    )}
                  >
                    {renderIcon(item.icon, variant, isActive)}
                  </span>
                )}
                <span className={cn('fw-medium', isActive && `text-${variant}`)}>
                  {item.label}
                </span>
              </p>
              {renderBadge(item.badge, variant, isActive)}
            </div>
            {item.desc && (
              <p style={{ fontSize: 10 }} className="text-muted my-0 text-truncate">
                {item.desc}
              </p>
            )}
          </button>
        )
      })}
    </div>
  )
})

ListGroup.displayName = 'ListGroup'

export { ListGroup }
