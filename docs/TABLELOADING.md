# TableLoading

> Bootstrap 5 placeholder loading skeleton for table `<tbody>` elements. Renders shimmer placeholder rows that match your table's column layout during data fetching.

---

## Import

```js
// Default import (recommended for single-component tree-shaking)
import TableLoading from 'react-bootstrap-plugins/TableLoading'

// Named import from individual entry point
import { TableLoading } from 'react-bootstrap-plugins/TableLoading'

// Barrel import
import { TableLoading } from 'react-bootstrap-plugins'
```

---

## Basic Usage

The component is designed to be placed **inside a `<tbody>`** element, replacing real data rows during loading:

```jsx
import { useState, useEffect } from 'react'
import { TableLoading } from 'react-bootstrap-plugins'

function StudentTable() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStudents().then(data => {
      setStudents(data)
      setLoading(false)
    })
  }, [])

  return (
    <table className="table table-striped">
      <thead>
        <tr>
          <th>Name</th>
          <th>Class</th>
          <th>Status</th>
          <th>Fees</th>
        </tr>
      </thead>
      <tbody>
        {loading ? (
          <TableLoading rows={8} columns={4} />
        ) : (
          students.map(s => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.class}</td>
              <td>{s.status}</td>
              <td>{s.fees}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  )
}
```

---

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `rows` | `number` | `5` | Number of placeholder rows to render |
| `columns` | `number` | `4` | Number of placeholder columns per row |

---

## Dark Mode

The TableLoading uses Bootstrap's `placeholder-glow` and `placeholder` classes, which automatically adapt to dark mode. Set `data-bs-theme="dark"` on any parent element.

---

## Bundle Size

~0.2 KB (min+gzip).

---

## See Also

- [DatePicker](./DATEPICKER.md) — Date, time, and datetime picker
- [SearchSelect](./SEARCHSELECT.md) — Filterable, searchable select dropdown
- [Label](./LABEL.md) — Bootstrap-styled form label with required indicator
- [Main README](../README.md) — Package overview, installation, and general info
