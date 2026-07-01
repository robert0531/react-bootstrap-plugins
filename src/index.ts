/**
 * react-bootstrap-plugins — Production-grade Bootstrap 5 UI components for React
 *
 * @example
 * // Tree-shakeable: import only what you need
 * import { DatePicker, Label } from 'react-bootstrap-plugins'
 *
 * // Or individual entry points for maximum tree-shaking
 * import DatePicker from 'react-bootstrap-plugins/DatePicker'
 * import SearchSelect from 'react-bootstrap-plugins/SearchSelect'
 */

export { DatePicker } from './components/DatePicker.js'
export { SearchSelect } from './components/SearchSelect.js'
export { Label } from './components/Label.js'
export { TableLoading } from './components/TableLoading.js'

export type { DatePickerProps, DatePickerChangeEvent } from './components/DatePicker.js'
export type { SearchSelectProps } from './components/SearchSelect.js'
export type { LabelProps } from './components/Label.js'
export type { TableLoadingProps } from './components/TableLoading.js'
