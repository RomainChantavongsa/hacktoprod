import React, { useMemo, useState } from 'react'
import './DataTable.scss'

/**
 * Simple reusable DataTable
 * props:
 * - columns: [{ key, header, sortable?, width?, render?: (row) => ReactNode }]
 * - data: any[]
 * - loading?: boolean
 * - emptyMessage?: string
 * - defaultPageSize?: number
 * - pageSizeOptions?: number[]
 */
export default function DataTable({
  columns,
  data,
  loading = false,
  emptyMessage = 'Aucune donnée',
  defaultPageSize = 10,
  pageSizeOptions = [5, 10, 25, 50]
}) {
  const [query, setQuery] = useState('')
  const [sortKey, setSortKey] = useState(null)
  const [sortDir, setSortDir] = useState('asc')
  const [pageSize, setPageSize] = useState(defaultPageSize)
  const [page, setPage] = useState(1)

  const normalized = useMemo(() => (query || '').toLowerCase().trim(), [query])

  const filtered = useMemo(() => {
    if (!normalized) return data
    return data.filter((row) =>
      Object.values(row).some((val) => String(val ?? '').toLowerCase().includes(normalized))
    )
  }, [data, normalized])

  const sorted = useMemo(() => {
    if (!sortKey) return filtered
    const sortedCopy = [...filtered].sort((a, b) => {
      const va = a[sortKey]
      const vb = b[sortKey]
      if (va == null && vb == null) return 0
      if (va == null) return -1
      if (vb == null) return 1
      if (typeof va === 'number' && typeof vb === 'number') return va - vb
      return String(va).localeCompare(String(vb), undefined, { numeric: true, sensitivity: 'base' })
    })
    return sortDir === 'asc' ? sortedCopy : sortedCopy.reverse()
  }, [filtered, sortKey, sortDir])

  const total = sorted.length
  const maxPage = Math.max(1, Math.ceil(total / pageSize))
  const currentPage = Math.min(page, maxPage)

  const pageSlice = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return sorted.slice(start, start + pageSize)
  }, [sorted, currentPage, pageSize])

  const onSort = (key, sortable) => {
    if (!sortable) return
    if (key === sortKey) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const onChangePageSize = (e) => {
    setPageSize(Number(e.target.value))
    setPage(1)
  }

  const onChangeQuery = (e) => {
    setQuery(e.target.value)
    setPage(1)
  }

  const goto = (p) => setPage(Math.max(1, Math.min(p, maxPage)))

  return (
    <div className="datatable">
      <div className="datatable__toolbar">
        <input
          className="datatable__search"
          type="search"
          placeholder="Rechercher..."
          value={query}
          onChange={onChangeQuery}
        />
        <div className="datatable__controls">
          <label>
            Lignes:
            <select value={pageSize} onChange={onChangePageSize}>
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </label>
          <span className="datatable__count">
            {total} résultat{total > 1 ? 's' : ''}
          </span>
        </div>
      </div>

      <div className="datatable__container">
        <table className="datatable__table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={col.width ? { width: col.width } : undefined}
                  className={col.sortable ? 'sortable' : ''}
                  onClick={() => onSort(col.key, col.sortable)}
                >
                  <span>{col.header}</span>
                  {sortKey === col.key && (
                    <span className={`sort-ind ${sortDir}`} aria-hidden>▾</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="empty" colSpan={columns.length}>Chargement…</td></tr>
            ) : pageSlice.length === 0 ? (
              <tr><td className="empty" colSpan={columns.length}>{emptyMessage}</td></tr>
            ) : (
              pageSlice.map((row) => (
                <tr key={row.id}>
                  {columns.map((col) => (
                    <td key={col.key}>
                      {col.render ? col.render(row) : (row[col.key] ?? '-')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="datatable__pagination">
        <button className="btn btn-sm" onClick={() => goto(1)} disabled={currentPage === 1}>{'<<'}</button>
        <button className="btn btn-sm" onClick={() => goto(currentPage - 1)} disabled={currentPage === 1}>{'<'}</button>
        <span className="datatable__pageinfo">Page {currentPage} / {maxPage}</span>
        <button className="btn btn-sm" onClick={() => goto(currentPage + 1)} disabled={currentPage === maxPage}>{'>'}</button>
        <button className="btn btn-sm" onClick={() => goto(maxPage)} disabled={currentPage === maxPage}>{'>>'}</button>
      </div>
    </div>
  )
}
