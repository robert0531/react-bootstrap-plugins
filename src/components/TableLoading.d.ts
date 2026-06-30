import * as React from 'react'

export interface TableLoadingProps {
  /** Number of placeholder rows to render (default 5) */
  rows?: number
  /** Number of placeholder columns per row (default 4) */
  columns?: number
}

declare const TableLoading: React.FC<TableLoadingProps>

export default TableLoading
export { TableLoading }
