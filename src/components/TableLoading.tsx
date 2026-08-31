import * as React from 'react'

export interface TableLoadingProps {
  /** Number of placeholder rows to render (default 5). Alias: row */
  rows?: number
  /** Alias for `rows` — prefer `rows` as the canonical name */
  row?: number
  /** Number of placeholder columns per row (default 4) */
  columns?: number
}

interface NoDataProps {
  length?: number
  text?: React.ReactNode
}

interface SpinerProps {
  size?: string
}

type TableLoadingComponent = React.FC<TableLoadingProps> & {
  NoData: React.ForwardRefExoticComponent<NoDataProps & React.RefAttributes<HTMLTableRowElement>>
  Spiner: React.ForwardRefExoticComponent<SpinerProps & React.RefAttributes<HTMLSpanElement>>
}

const TableLoading: TableLoadingComponent = ({ rows, row, columns = 4 }) => {
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

const NoData = React.forwardRef<HTMLTableRowElement, NoDataProps>(({length, text}, ref) => (
  <tr ref={ref}>
    <td colSpan={length} className="text-center w-100 py-4">{text}</td>
  </tr>
));

const Spiner = React.forwardRef<HTMLSpanElement, SpinerProps>(({size}, ref) => (
  <span ref={ref} className={`spinner-border spinner-border-${size}`} />
));


NoData.displayName = 'NoData'
Spiner.displayName = 'Spiner'

TableLoading.displayName = 'TableLoading'
TableLoading.NoData = NoData
TableLoading.Spiner = Spiner

export { TableLoading }
// I want to pass NoData and Spiner as props to TableLoading  and be called as <TableLoading.NoData length={12} text="No data found" /> and <TableLoading.Spiner size="sm" />