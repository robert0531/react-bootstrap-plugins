import * as React from 'react'
import { cn } from '../lib/cn.js'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface NavPill {
  /** Unique pill identifier — compared against `active` */
  key: string | number
  /** Pill label text */
  label?: React.ReactNode
  /** Legacy alias for `label` (takes precedence when both are set) */
  lbl?: React.ReactNode
  /**
   * Optional leading icon. A string is rendered as `<i className={icon} />`
   * (pass the full icon class, e.g. `"fas fa-user"` or `"bi bi-person"`);
   * a ReactNode (e.g. a Lucide element) is rendered as-is.
   */
  icon?: string | React.ReactNode
  /** Show a dismiss badge on this pill — clicking it fires `onClear` */
  clear?: boolean
  /** Show a "New" badge on this pill */
  new?: boolean
}

export interface NavPillsProps {
  /** Pills to render */
  pills: NavPill[]
  /** Key of the currently active pill */
  active?: string | number
  /** Fired when a pill is clicked */
  onClick?: (pill: NavPill) => void
  /** Fired when a pill's dismiss badge is clicked (requires `pill.clear`) */
  clear?: (pill: NavPill) => void
  /** Wrap the pills in a full-width light bar with a centered `.container` */
  contain?: boolean
  /** Additional CSS classes (on the wrapper when `contain`, else on the nav) */
  className?: string
}

/* ------------------------------------------------------------------ */
/*  NavPills                                                           */
/* ------------------------------------------------------------------ */

const renderIcon = (icon: NavPill['icon']): React.ReactNode => {
  if (!icon) return null
  if (typeof icon === 'string') return <i className={cn(icon, 'me-2')} />
  return <span className="me-2 d-inline-flex align-middle">{icon}</span>
}

/**
 * Horizontal Bootstrap nav-pills tab strip with optional icons,
 * dismissible pills, and "New" badges. Scrolls horizontally on overflow.
 *
 * **Important:** The accompanying CSS **must** be imported for the badges to
 * render correctly:
 * ```js
 * import 'react-bootstrap-plugins/css/plugins.css'
 * ```
 */
const NavPills = React.forwardRef<HTMLElement, NavPillsProps>(({
  contain = false,
  active,
  pills,
  clear,
  onClick,
  className,
}, ref) => {
  const items = (pills ?? []).map((r) => (
    <button
      key={String(r.key)}
      type="button"
      className={cn('nav-link text-center align-middle', r.key === active && 'active')}
      onClick={() => onClick?.(r)}
    >
      {renderIcon(r.icon)}
      <span>{r.lbl ?? r.label}</span>
      {r.clear && (
        <span
          className="badge navpills-badge-clear my-0 float-end ms-3"
          role="button"
          aria-label="Dismiss"
          onClick={(e) => { e.stopPropagation(); clear?.(r) }}
        >
          &times;
        </span>
      )}
      {r.new && (
        <span className="badge navpills-badge-new float-end ms-4">New</span>
      )}
    </button>
  ))

  if (contain) {
    return (
      <div className={cn('navpills-bar px-2 bg-light rounded-0 mb-0', className)}>
        <nav ref={ref} className="container nav nav-pills overflow-x-auto flex-nowrap">
          {items}
        </nav>
      </div>
    )
  }

  return (
    <nav ref={ref} className={cn('nav nav-pills overflow-x-auto flex-nowrap', className)}>
      {items}
    </nav>
  )
})

NavPills.displayName = 'NavPills'

export { NavPills }
export default NavPills
