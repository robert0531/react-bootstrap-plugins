import * as React from 'react'
import { cn } from '../lib/cn.js'

export interface SearchSelectProps<T = unknown> {
  /** Additional CSS classes on the wrapper */
  className?: string
  /** Selectable options — primitives (string|number|boolean) or objects */
  options?: T[]
  /** Key for display text when options are objects (default 'label') */
  labelKey?: string
  /** Key for the value when options are objects (default 'value') */
  valueKey?: string
  /** Placeholder text (default 'Select...') */
  placeholder?: string
  /** Currently selected value */
  value?: T | null
  /** Called with synthetic event; e.target.value is the selected value, e.target.name is the input name */
  onChange?: (e: { target: { value: T | null; name: string } }) => void
  /** Input element ID */
  id?: string
  /** Input name attribute — surfaces as e.target.name in onChange */
  name?: string
  /** Disable the input */
  disabled?: boolean
}

/**
 * A filterable, searchable select dropdown styled with Bootstrap 5.
 * Supports both primitive arrays and object arrays with configurable label/value keys.
 */
interface SearchSelectComponent {
  <T>(props: SearchSelectProps<T> & React.RefAttributes<HTMLDivElement>): React.ReactElement | null
  displayName?: string
}

const SearchSelectInner = <T,>({
    className,
    options = [] as T[],
    labelKey = 'label',
    valueKey = 'value',
    placeholder = 'Select...',
    value = null,
    onChange,
    id = 'filterable-select',
    name,
    disabled = false,
    ...props
  }: SearchSelectProps<T> & React.RefAttributes<HTMLDivElement>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const [isOpen, setIsOpen] = React.useState(false)
    const [searchTerm, setSearchTerm] = React.useState('')
    const wrapperRef = React.useRef<HTMLDivElement>(null)

    // AUTO-DETECT: primitives vs objects
    const isPrimitiveArray = options.length > 0 &&
      (typeof options[0] === 'string' || typeof options[0] === 'number' || typeof options[0] === 'boolean')

    const getLabel = (option: T): string => {
      if (isPrimitiveArray) return String(option)
      return (option as Record<string, unknown>)?.[labelKey] as string || ''
    }

    const getValue = (option: T): T | null => {
      if (isPrimitiveArray) return option
      return ((option as Record<string, unknown>)?.[valueKey] as T) ?? null
    }

    const selectedOption = options.find(opt => getValue(opt) === value)

    // Sync input when value changes externally
    React.useEffect(() => {
      if (selectedOption !== undefined) {
        setSearchTerm(getLabel(selectedOption))
      } else {
        setSearchTerm('')
      }
    }, [value, options, labelKey, valueKey])

    // Filter options
    const filteredOptions = options.filter(option =>
      getLabel(option).toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Click outside to close
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
          setIsOpen(false)
        }
      }
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleSelect = (option: T) => {
      const selectedValue = getValue(option)
      setSearchTerm(getLabel(option))
      setIsOpen(false)
      if (onChange) onChange({ target: { value: selectedValue, name: name || id } })
    }

    return (
      <div
        ref={(node) => {
          wrapperRef.current = node
          if (typeof ref === 'function') ref(node)
          else if (ref) ref.current = node
        }}
        className={cn('searchselect-wrapper position-relative ', className)}
        style={{ minWidth: 0 }}
        {...props}
      >
        <input
          id={id}
          type="text"
          className="form-select"
          placeholder={placeholder}
          value={searchTerm}
          disabled={disabled}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          style={{ cursor: 'text', borderRadius: 'inherit' }}
        />

        {isOpen && !disabled && (
          <ul
            className="dropdown-menu show w-100 overflow-x-hidden"
            style={{
              maxHeight: '200px',
              marginTop: '2px',
              zIndex: 1050,
              borderRadius: '0.375rem',
              boxShadow: '0 0.5rem 1rem rgba(0,0,0,0.15)',
            }}
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => {
                const key = (getValue(option) as string | number) ?? `option-${index}`
                return (
                  <li key={key}>
                    <button
                      type="button"
                      className="dropdown-item text-truncate"
                      onClick={() => handleSelect(option)}
                    >
                      {getLabel(option)}
                    </button>
                  </li>
                )
              })
            ) : (
              <li>
                <span className="dropdown-item disabled text-muted" style={{ cursor: 'default' }}>
                  No options found
                </span>
              </li>
            )}
          </ul>
        )}
      </div>
    )
  }

const SearchSelect = React.forwardRef(SearchSelectInner) as SearchSelectComponent
SearchSelect.displayName = 'SearchSelect'

export default SearchSelect
export { SearchSelect }
