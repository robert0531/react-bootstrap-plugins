import * as React from 'react'
import { createPortal } from 'react-dom'
import { cn } from '../lib/cn.js'

/* ------------------------------------------------------------------ */
/*  Constants                                                         */
/* ------------------------------------------------------------------ */

const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
const MINUTES = Array.from({ length: 60 }, (_, i) => i)
const YEARS_PER_PAGE = 12

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate()

const isSameDay = (a, b) =>
  a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()

const isDateInRange = (date, min, max) => {
  if (min && date < new Date(min.getFullYear(), min.getMonth(), min.getDate())) return false
  if (max && date > new Date(max.getFullYear(), max.getMonth(), max.getDate())) return false
  return true
}

const buildCalendarGrid = (year, month) => {
  const firstDay = new Date(year, month, 1).getDay()
  const totalDays = daysInMonth(year, month)
  const cells = []

  const prevMonthDays = daysInMonth(year, month - 1)
  for (let i = firstDay - 1; i >= 0; i--) {
    const day = prevMonthDays - i
    cells.push({ day, date: new Date(year, month - 1, day), isOutside: true })
  }

  for (let d = 1; d <= totalDays; d++) {
    cells.push({ day: d, date: new Date(year, month, d), isOutside: false })
  }

  const remaining = 42 - cells.length
  for (let d = 1; d <= remaining; d++) {
    cells.push({ day: d, date: new Date(year, month + 1, d), isOutside: true })
  }

  return cells
}

const formatValue = (date, mode, fmt) => {
  if (!date || isNaN(date.getTime())) return ''

  const y = date.getFullYear()
  const M = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  let h = date.getHours()
  const m = String(date.getMinutes()).padStart(2, '0')
  const a = h >= 12 ? 'PM' : 'AM'
  h = h % 12 || 12
  const hh = String(h).padStart(2, '0')

  if (fmt) {
    return fmt.replace('yyyy', y).replace('MM', M).replace('dd', d).replace('hh', hh).replace('mm', m).replace('aa', a)
  }

  switch (mode) {
    case 'time':     return `${hh}:${m} ${a}`
    case 'datetime': return `${y}-${M}-${d} ${hh}:${m} ${a}`
    default:         return `${y}-${M}-${d}`
  }
}

/**
 * Build a synthetic event object like a native input's onChange.
 * { target: { value, name, type }, preventDefault, stopPropagation }
 */
const makeEvent = (value, inputName, type = 'date') => ({
  target: {
    value,
    name: inputName,
    type,
  },
  preventDefault: () => {},
  stopPropagation: () => {},
  nativeEvent: null,
})

/* ------------------------------------------------------------------ */
/*  Popover positioning                                               */
/* ------------------------------------------------------------------ */

/** Approximate heights — used as a first guess before the real DOM height is measured. */
const POPOVER_GUESS = { date: 300, time: 300, datetime: 400, year: 250 }

/**
 * Find the nearest scrollable ancestor (for capturing scroll events inside
 * modals / side panels / custom containers).
 */
const getScrollParent = (el) => {
  if (!el) return document.documentElement
  let parent = el.parentElement
  while (parent) {
    const style = window.getComputedStyle(parent)
    const overflowY = style.overflowY || style.overflow
    if (overflowY === 'auto' || overflowY === 'scroll') return parent
    parent = parent.parentElement
  }
  return document.documentElement
}

const calcPopoverStyle = (inputEl, popoverHeight) => {
  if (!inputEl) return {}
  const rect = inputEl.getBoundingClientRect()
  const h = popoverHeight || 300

  const spaceBelow = window.innerHeight - rect.bottom
  const spaceAbove = rect.top

  /* Only flip above when below is truly too tight AND above offers more room */
  const placeAbove = spaceBelow < h && spaceAbove > spaceBelow

  /* Responsive: use smaller min-width on mobile to prevent overflow */
  const minW = Math.max(rect.width, window.innerWidth < 576 ? 220 : 260)

  return {
    position: 'fixed',
    top: placeAbove ? Math.max(4, rect.top - h - 4) : rect.bottom + 4,
    left: Math.max(4, Math.min(rect.left, window.innerWidth - minW - 4)),
    minWidth: minW,
    maxWidth: window.innerWidth - 8,
    zIndex: 1070,
  }
}

/* ------------------------------------------------------------------ */
/*  DatePicker                                                        */
/* ------------------------------------------------------------------ */

/**
 * Custom Bootstrap-styled date / time / datetime picker. Zero dependencies.
 *
 * **Important:** The accompanying CSS **must** be imported for the picker to render correctly:
 * ```js
 * import 'react-bootstrap-plugins/css/datepicker.css'
 * ```
 *
 * @param {'date'|'time'|'datetime'} mode     - Picker mode (default 'date')
 * @param {Date|null} value                    - Currently selected Date (aliases: selected)
 * @param {(e: { target: { value: string|null, name: string, type: string } }) => void} onChange
 *                                             - Synthetic event handler — e.target.value is a pre-formatted string
 *                                               (date → "YYYY-MM-DD", time → "hh:mm AA", datetime → "YYYY-MM-DD hh:mm AA")
 * @param {string}  [dateFormat]               - Display format (yyyy, MM, dd, hh, mm, aa)
 * @param {string}  [placeholderText]          - Placeholder when empty
 * @param {'sm'|'lg'} [size]                  - Bootstrap size variant
 * @param {boolean} [isClearable=false]        - Show a clear button on the input
 * @param {boolean} [disabled=false]           - Disable the input
 * @param {Date}    [minDate]                 - Earliest selectable date
 * @param {Date}    [maxDate]                 - Latest selectable date
 * @param {number}  [timeIntervals=5]          - Minute step in the time list
 * @param {string}  [timezone='Kampala']       - Timezone identifier for the picker
 * @param {string}  [className]               - Additional classes on the input
 */
const DatePicker = React.forwardRef(({
  className,
  mode = 'date',
  selected,
  value,
  onChange,
  dateFormat,
  placeholderText,
  size,
  isClearable = false,
  disabled = false,
  minDate,
  maxDate,
  timeIntervals = 5,
  timezone = 'Kampala',
  id,
  name,
  ...props
}, ref) => {
  /* ---- derived ---- */
  const resolveValue = (v) => {
    if (!v) return null
    if (v instanceof Date) return isNaN(v.getTime()) ? null : v
    if (typeof v === 'string' || typeof v === 'number') {
      // Standard Date parsing (works for ISO 8601, "YYYY-MM-DD", etc.)
      const d = new Date(v)
      if (!isNaN(d.getTime())) return d

      // Handle time-only strings from formatValue: "hh:mm AA"
      if (typeof v === 'string') {
        const timeMatch = v.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
        if (timeMatch) {
          let h = parseInt(timeMatch[1], 10)
          const m = parseInt(timeMatch[2], 10)
          const ap = timeMatch[3].toUpperCase()
          if (h === 12 && ap === 'AM') h = 0
          if (h !== 12 && ap === 'PM') h += 12
          const now = new Date()
          return new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0, 0)
        }

        // Handle datetime strings from formatValue: "YYYY-MM-DD hh:mm AA"
        const dtMatch = v.match(/^(\d{4})-(\d{2})-(\d{2})\s+(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
        if (dtMatch) {
          let h = parseInt(dtMatch[4], 10)
          const m = parseInt(dtMatch[5], 10)
          const ap = dtMatch[6].toUpperCase()
          if (h === 12 && ap === 'AM') h = 0
          if (h !== 12 && ap === 'PM') h += 12
          return new Date(parseInt(dtMatch[1]), parseInt(dtMatch[2]) - 1, parseInt(dtMatch[3]), h, m, 0, 0)
        }
      }
      return null
    }
    return null
  }
  const resolvedValue = React.useMemo(
    () => resolveValue(selected ?? value),
    [
      selected instanceof Date ? selected.getTime() : selected,
      value instanceof Date ? value.getTime() : value,
    ],
  )
  const showCalendar = mode === 'date' || mode === 'datetime'
  const showTime = mode === 'time' || mode === 'datetime'

  /* ---- internal state ---- */
  const [isOpen, setIsOpen] = React.useState(false)
  const [viewYear, setViewYear] = React.useState(() =>
    resolvedValue ? resolvedValue.getFullYear() : new Date().getFullYear())
  const [viewMonth, setViewMonth] = React.useState(() =>
    resolvedValue ? resolvedValue.getMonth() : new Date().getMonth())
  const [tempDate, setTempDate] = React.useState(resolvedValue)
  const [tempHours, setTempHours] = React.useState(() =>
    resolvedValue ? (resolvedValue.getHours() % 12 || 12) : 12)
  const [tempMins, setTempMins] = React.useState(() =>
    resolvedValue ? resolvedValue.getMinutes() : 0)
  const [tempAmPm, setTempAmPm] = React.useState(() =>
    resolvedValue ? (resolvedValue.getHours() >= 12 ? 'PM' : 'AM') : 'AM')
  const [showYearPicker, setShowYearPicker] = React.useState(false)
  const [yearPage, setYearPage] = React.useState(() =>
    Math.floor((resolvedValue ? resolvedValue.getFullYear() : new Date().getFullYear()) / YEARS_PER_PAGE) * YEARS_PER_PAGE
  )
  const [popoverStyle, setPopoverStyle] = React.useState({})

  const inputRef = React.useRef(null)
  const popoverRef = React.useRef(null)
  const portalRef = React.useRef(null)

  /* ---- portal container ---- */
  React.useEffect(() => {
    const el = document.createElement('div')
    el.className = 'datepicker-portal-root'
    document.body.appendChild(el)
    portalRef.current = el
    return () => {
      if (el.parentNode) document.body.removeChild(el)
      portalRef.current = null
    }
  }, [])

  /* ---- sync temp state when value changes externally ---- */
  React.useEffect(() => {
    if (resolvedValue && !isNaN(resolvedValue.getTime())) {
      setTempDate(resolvedValue)
      setViewYear(resolvedValue.getFullYear())
      setViewMonth(resolvedValue.getMonth())
      setTempHours(resolvedValue.getHours() % 12 || 12)
      setTempMins(resolvedValue.getMinutes())
      setTempAmPm(resolvedValue.getHours() >= 12 ? 'PM' : 'AM')
      setYearPage(Math.floor(resolvedValue.getFullYear() / YEARS_PER_PAGE) * YEARS_PER_PAGE)
    } else {
      setTempDate(null)
    }
  }, [resolvedValue])

  /* ---- reposition popover on open / scroll / resize ---- */
  React.useEffect(() => {
    if (!isOpen) return

    /* Measure actual popover height so we position with no wasted space */
    const getHeight = () => {
      if (popoverRef.current) {
        return popoverRef.current.getBoundingClientRect().height
      }
      return POPOVER_GUESS[showYearPicker ? 'year' : mode] || 300
    }

    const scrollParent = getScrollParent(inputRef.current)

    const update = () => {
      /* Force a paint frame so the popover has its real size */
      requestAnimationFrame(() => {
        setPopoverStyle(calcPopoverStyle(inputRef.current, getHeight()))
      })
    }
    update()

    /* Listen on the nearest scrollable ancestor (e.g. modal body) AND the window */
    scrollParent.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      scrollParent.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [isOpen, mode, showYearPicker])

  /* ---- click outside to close ---- */
  React.useEffect(() => {
    if (!isOpen) return
    const handler = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target) &&
          inputRef.current && !inputRef.current.contains(e.target)) {
        setIsOpen(false)
        setShowYearPicker(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [isOpen])

  /* ---- commit helpers ---- */
  const buildDate = (base, h12, mins, ampm) => {
    const d = new Date(base)
    let h = h12 % 12
    if (ampm === 'PM') h += 12
    if (h === 12 && ampm === 'AM') h = 0
    d.setHours(h, mins, 0, 0)
    return d
  }

  /**
   * Fire onChange with a pre-built date without closing the popover.
   * Callers must build the complete date (including time) before passing it in.
   */
  const fireChange = (date) => {
    if (!date || isNaN(date.getTime())) return
    const formatted = formatValue(date, mode, dateFormat)
    onChange?.(makeEvent(formatted, name, mode))
  }

  const commit = (date) => {
    if (!date) {
      onChange?.(makeEvent(null, name, mode))
      setIsOpen(false)
      setShowYearPicker(false)
      return
    }
    fireChange(date)
    if (mode === 'date') { setIsOpen(false); setShowYearPicker(false) }
  }

  const commitDateOnly = (date) => {
    setTempDate(date)
    if (mode === 'date') {
      commit(date)
    } else if (mode === 'datetime') {
      // Build full datetime (date + current time selection) and fire
      const d = buildDate(date, tempHours, tempMins, tempAmPm)
      fireChange(d)
    }
  }

  /* ---- calendar grid ---- */
  const grid = buildCalendarGrid(viewYear, viewMonth)

  const handlePrevMonth = () => {
    let newY = viewYear, newM = viewMonth
    if (viewMonth === 0) { newY = viewYear - 1; newM = 11 }
    else newM = viewMonth - 1
    setViewYear(newY); setViewMonth(newM)
    const base = tempDate || new Date()
    const maxD = daysInMonth(newY, newM)
    const newDate = new Date(newY, newM, Math.min(base.getDate(), maxD))
    setTempDate(newDate)
    fireChange(showTime ? buildDate(newDate, tempHours, tempMins, tempAmPm) : newDate)
  }
  const handleNextMonth = () => {
    let newY = viewYear, newM = viewMonth
    if (viewMonth === 11) { newY = viewYear + 1; newM = 0 }
    else newM = viewMonth + 1
    setViewYear(newY); setViewMonth(newM)
    const base = tempDate || new Date()
    const maxD = daysInMonth(newY, newM)
    const newDate = new Date(newY, newM, Math.min(base.getDate(), maxD))
    setTempDate(newDate)
    fireChange(showTime ? buildDate(newDate, tempHours, tempMins, tempAmPm) : newDate)
  }

  const today = new Date()
  const minDt = minDate ? new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate()) : null
  const maxDt = maxDate ? new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate()) : null

  /* ---- time change handlers ---- */
  const handleHourChange = (h) => {
    setTempHours(h)
    if (showTime) {
      const d = buildDate(tempDate || new Date(), h, tempMins, tempAmPm)
      onChange?.(makeEvent(formatValue(d, mode, dateFormat), name, mode))
    }
  }
  const handleMinChange = (m) => {
    setTempMins(m)
    if (showTime) {
      const d = buildDate(tempDate || new Date(), tempHours, m, tempAmPm)
      onChange?.(makeEvent(formatValue(d, mode, dateFormat), name, mode))
    }
  }
  const handleAmPmChange = (ap) => {
    setTempAmPm(ap)
    if (showTime) {
      const d = buildDate(tempDate || new Date(), tempHours, tempMins, ap)
      onChange?.(makeEvent(formatValue(d, mode, dateFormat), name, mode))
    }
  }

  /* ---- year picker ---- */
  const openYearPicker = () => {
    setYearPage(Math.floor(viewYear / YEARS_PER_PAGE) * YEARS_PER_PAGE)
    setShowYearPicker(true)
  }

  const handleYearSelect = (y) => {
    setViewYear(y)
    setShowYearPicker(false)
    const base = tempDate || new Date()
    const maxD = daysInMonth(y, viewMonth)
    const newDate = new Date(y, viewMonth, Math.min(base.getDate(), maxD))
    setTempDate(newDate)
    fireChange(showTime ? buildDate(newDate, tempHours, tempMins, tempAmPm) : newDate)
  }

  const yearPageStart = Math.floor(yearPage / YEARS_PER_PAGE) * YEARS_PER_PAGE
  const years = Array.from({ length: YEARS_PER_PAGE }, (_, i) => yearPageStart + i)

  /* ---- clear ---- */
  const handleClear = (e) => {
    e.stopPropagation()
    setTempDate(null)
    onChange?.(makeEvent(null, name))
  }

  /* ---- keyboard ---- */
  const handleInputKeyDown = (e) => {
    if (e.key === 'Escape') { setIsOpen(false); setShowYearPicker(false); inputRef.current?.blur() }
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setIsOpen(true)
    }
  }

  /* ---- merged ref ---- */
  const mergeInputRef = React.useCallback((node) => {
    inputRef.current = node
    if (typeof ref === 'function') ref(node)
    else if (ref) ref.current = node
  }, [ref])

  /* ---- render ---- */
  const placeholder = placeholderText
    ?? (mode === 'time' ? 'Select time' : mode === 'datetime' ? 'Select date & time' : 'Select date')

  const popover = (
    <div
      ref={popoverRef}
      className={cn(
        'datepicker-popover card border shadow-sm',
        mode === 'datetime' && 'datepicker-popover--wide'
      )}
      style={popoverStyle}
    >
      {/* ============== YEAR PICKER ============== */}
      {showYearPicker && showCalendar && (
        <div className="datepicker-year-picker p-3">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <button type="button" className="btn btn-sm btn-outline-secondary border-0 px-1" onClick={() => setYearPage(yearPage - YEARS_PER_PAGE)} aria-label="Previous years">&lsaquo;</button>
            <span className="fw-semibold small">{yearPageStart} – {yearPageStart + YEARS_PER_PAGE - 1}</span>
            <button type="button" className="btn btn-sm btn-outline-secondary border-0 px-1" onClick={() => setYearPage(yearPage + YEARS_PER_PAGE)} aria-label="Next years">&rsaquo;</button>
          </div>
          <div className="datepicker-year-grid">
            {years.map((y) => {
              const isCurrentYear = y === new Date().getFullYear()
              const isSelected = tempDate && y === tempDate.getFullYear()
              return (
                <button
                  key={y}
                  type="button"
                  className={cn(
                    'datepicker-year-cell btn btn-sm',
                    isSelected && 'btn-primary',
                    !isSelected && isCurrentYear && 'btn-outline-primary',
                    !isSelected && !isCurrentYear && 'btn-light border'
                  )}
                  onClick={() => handleYearSelect(y)}
                >
                  {y}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* ============== CALENDAR + TIME ============== */}
      {!showYearPicker && (
        <>

          {/* ---- CALENDAR + TIME CONTAINER ---- */}
          <div className={cn('d-flex', mode === 'datetime' ? 'flex-row' : 'flex-column')}>

          {/* ---- CALENDAR ---- */}
          {showCalendar && (
            <div className="datepicker-calendar p-2">
              {/* Month / Year header */}
              <div className="d-flex align-items-center justify-content-between mb-2">
                <button type="button" className="btn btn-sm btn-outline-secondary border-0 px-1" onClick={handlePrevMonth} aria-label="Previous month">&lsaquo;</button>
                <div className="d-flex align-items-center gap-1">
                  <span className="fw-semibold small">{MONTHS[viewMonth]}</span>
                  <button
                    type="button"
                    className="btn btn-sm btn-link text-decoration-none text-primary fw-semibold small p-0"
                    onClick={openYearPicker}
                    aria-label="Choose year"
                  >{viewYear}</button>
                </div>
                <button type="button" className="btn btn-sm btn-outline-secondary border-0 px-1" onClick={handleNextMonth} aria-label="Next month">&rsaquo;</button>
              </div>

              {/* Day-of-week headers */}
              <div className="datepicker-days-header">
                {DAYS_OF_WEEK.map(d => (
                  <div key={d} className="datepicker-day-label">{d}</div>
                ))}
              </div>

              {/* Day grid */}
              <div className="datepicker-days-grid">
                {grid.map((cell, i) => {
                  const isToday = isSameDay(cell.date, today)
                  const isSelected = tempDate && isSameDay(cell.date, tempDate)
                  const inRange = isDateInRange(cell.date, minDt, maxDt)
                  const isDisabledDay = cell.isOutside || !inRange

                  return (
                    <button
                      key={i}
                      type="button"
                      disabled={isDisabledDay}
                      className={cn(
                        'datepicker-day',
                        isToday && 'datepicker-day--today',
                        isSelected && 'datepicker-day--selected',
                        cell.isOutside && 'datepicker-day--outside',
                        !inRange && 'datepicker-day--disabled'
                      )}
                      onClick={() => commitDateOnly(cell.date)}
                      tabIndex={cell.isOutside ? -1 : 0}
                    >
                      {cell.day}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* ---- DIVIDER (datetime mode) ---- */}
          {mode === 'datetime' && <div className="vr mx-1 my-2" />}

          {/* ---- TIME ---- */}
          {showTime && (
            <div className="datepicker-time p-2 d-flex flex-column" style={{ minWidth: 180 }}>
              {mode === 'datetime' && <div className="small fw-semibold text-muted text-center mb-1">Time</div>}
              <div className="d-flex justify-content-center gap-2">
                {/* Hour column */}
                <div className="datepicker-time-col">
                  <div className="datepicker-time-col-label">Hour</div>
                  <div className="datepicker-time-col-scroll">
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(h => (
                      <button
                        key={h}
                        type="button"
                        className={cn('datepicker-time-item', h === tempHours && 'active')}
                        onClick={() => handleHourChange(h)}
                      >
                        {String(h).padStart(2, '0')}
                      </button>
                    ))}
                  </div>
                </div>
                <span className="datepicker-time-separator">:</span>
                {/* Minute column */}
                <div className="datepicker-time-col">
                  <div className="datepicker-time-col-label">Min</div>
                  <div className="datepicker-time-col-scroll">
                    {MINUTES.map(m => (
                      <button
                        key={m}
                        type="button"
                        className={cn('datepicker-time-item', m === tempMins && 'active')}
                        onClick={() => handleMinChange(m)}
                      >
                        {String(m).padStart(2, '0')}
                      </button>
                    ))}
                  </div>
                </div>
                {/* AM/PM column */}
                <div className="datepicker-time-col">
                  <div className="datepicker-time-col-label">&nbsp;</div>
                  <div className="d-flex flex-column gap-1 mt-1">
                    {['AM', 'PM'].map(ap => (
                      <button
                        key={ap}
                        type="button"
                        className={cn('datepicker-time-item', 'datepicker-time-item--ampm', tempAmPm === ap && 'active')}
                        onClick={() => handleAmPmChange(ap)}
                      >
                        {ap}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        </>
      )}
    </div>
  )

  return (
    <div className="position-relative d-inline-block w-100" style={{ minWidth: 0 }}>
      {/* ---- Input ---- */}
      <div className="position-relative">
        <input
          ref={mergeInputRef}
          id={id}
          name={name}
          type="text"
          readOnly
          disabled={disabled}
          className={cn(
            'form-control',
            size === 'sm' && 'form-control-sm',
            size === 'lg' && 'form-control-lg',
            'pe-5',
            className
          )}
          placeholder={placeholder}
          value={formatValue(resolvedValue, mode, dateFormat)}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onKeyDown={handleInputKeyDown}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          autoComplete="off"
          {...props}
        />
        {/* clear button */}
        {isClearable && resolvedValue && !disabled && (
          <button
            type="button"
            className="btn btn-sm btn-link position-absolute top-50 end-0 translate-middle-y pe-2 text-secondary"
            style={{ zIndex: 2 }}
            onClick={handleClear}
            tabIndex={-1}
            aria-label="Clear"
          >
            &times;
          </button>
        )}
      </div>

      {/* ---- Portal the popover to document.body ---- */}
      {isOpen && !disabled && portalRef.current && createPortal(popover, portalRef.current)}
    </div>
  )
})

DatePicker.displayName = 'DatePicker'

export { DatePicker }
export default DatePicker
