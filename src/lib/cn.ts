type CnArg = string | false | null | undefined | CnArg[] | Record<string, boolean | undefined | null>

/**
 * Utility for conditionally joining CSS class names together.
 * Filters out falsy values and joins with space.
 *
 * @example
 * cn('btn', isActive && 'btn-primary', 'px-3')
 * // => 'btn btn-primary px-3'
 *
 * @example
 * cn('base-class', { 'active': isActive, 'disabled': isDisabled })
 * // => 'base-class active'  (when isActive=true, isDisabled=false)
 */
export function cn(...args: CnArg[]): string {
  const classes: string[] = []

  for (const arg of args) {
    if (!arg) continue

    if (typeof arg === 'string') {
      classes.push(arg)
    } else if (Array.isArray(arg)) {
      const nested = cn(...arg)
      if (nested) classes.push(nested)
    } else if (typeof arg === 'object') {
      for (const [key, value] of Object.entries(arg)) {
        if (value) classes.push(key)
      }
    }
  }

  return classes.join(' ')
}
