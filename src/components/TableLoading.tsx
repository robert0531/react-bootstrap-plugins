import * as React from 'react'

export interface TableLoadingProps {
  /** Number of placeholder rows to render (default 5). Alias: row */
  rows?: number
  /** Alias for `rows` — prefer `rows` as the canonical name */
  row?: number
  /** Number of placeholder columns per row (default 4) */
  columns?: number
}

const TableLoading: React.FC<TableLoadingProps> = ({ rows, row, columns = 4 }) => {
  const effectiveRows = rows ?? row ?? 5

  return (
    <>
      {Array.from({ length: effectiveRows }, (_, r) => (
        <tr key={r}>
          {Array.from({ length: columns }, (_, c) => (
            <td key={c} className="placeholder-glow">
              <span
                className="placeholder rounded py-2 col-12"
                style={{ height: 14, display: 'block' }}
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  )
}

TableLoading.displayName = 'TableLoading'

export { TableLoading }
export default TableLoading
