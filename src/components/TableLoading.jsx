import * as React from 'react'

/**
 * Bootstrap 5 placeholder loading rows for table `<tbody>` elements.
 * Renders a grid of shimmer placeholders matching the table column count.
 *
 * @param {number} [rows=5]    - Number of placeholder rows to render
 * @param {number} [columns=4] - Number of placeholder columns per row
 *
 * @example
 * // Inside a table
 * <table className="table">
 *   <thead><tr><th>Name</th><th>Class</th><th>Status</th></tr></thead>
 *   <tbody>
 *     {loading ? (
 *       <TableLoading rows={8} columns={3} />
 *     ) : (
 *       data.map(row => <tr key={row.id}>...</tr>)
 *     )}
 *   </tbody>
 * </table>
 */
const TableLoading = ({ rows = 5, columns = 4 }) => (
  <>
    {Array.from({ length: rows }, (_, r) => (
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

TableLoading.displayName = 'TableLoading'

export { TableLoading }
export default TableLoading
