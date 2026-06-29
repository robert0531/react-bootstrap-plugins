import React, { useState, useRef, useEffect } from 'react'
import { cn } from '../lib/cn.js'

/**
 * A filterable, searchable select dropdown styled with Bootstrap 5.
 * Supports both primitive arrays and object arrays with configurable label/value keys.
 *
 * @param {string}   [className]           - Additional CSS classes on the wrapper
 * @param {Array<string|number|boolean|object>} [options=[]] - Selectable options (primitives or objects)
 * @param {string}   [labelKey='label']    - Key for display text when options are objects
 * @param {string}   [valueKey='value']    - Key for the value when options are objects
 * @param {string}   [placeholder='Select...'] - Placeholder text
 * @param {any}      [value=null]          - Currently selected value
 * @param {(value: any) => void} [onChange] - Called with the selected value when user picks
 * @param {string}   [id='filterable-select'] - Input element ID
 * @param {boolean}  [disabled=false]      - Disable the input
 */
const SearchSelect = React.forwardRef(({
  className,
  options = [],
  labelKey = 'label',
  valueKey = 'value',
  placeholder = 'Select...',
  value = null,
  onChange = null,
  id = 'filterable-select',
  disabled = false,
  ...props
}, ref) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const wrapperRef = useRef(null)

  // AUTO-DETECT: primitives vs objects
  const isPrimitiveArray = options.length > 0 &&
    (typeof options[0] === 'string' || typeof options[0] === 'number' || typeof options[0] === 'boolean')

  const getLabel = (option) => {
    if (isPrimitiveArray) return String(option)
    return option?.[labelKey] || ''
  }

  const getValue = (option) => {
    if (isPrimitiveArray) return option
    return option?.[valueKey] ?? null
  }

  const selectedOption = options.find(opt => getValue(opt) === value)

  // Sync input when value changes externally
  useEffect(() => {
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
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (option) => {
    const selectedValue = getValue(option)
    setSearchTerm(getLabel(option))
    setIsOpen(false)
    if (onChange) onChange(selectedValue)
  }

  return (
    <div
      ref={(node) => {
        wrapperRef.current = node
        if (typeof ref === 'function') ref(node)
        else if (ref) ref.current = node
      }}
      // flex-fill lets the wrapper participate in Bootstrap input-group flex layout
      // rounded gives the wrapper a border-radius so the inner input can inherit it
      // correctly when the input-group adjusts border-radius on adjacent items
      className={cn('position-relative ', className)}
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
              const key = getValue(option) ?? `option-${index}`
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
})

SearchSelect.displayName = 'SearchSelect'

export default SearchSelect
