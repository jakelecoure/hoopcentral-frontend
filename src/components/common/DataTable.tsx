'use client'

import { useState, useMemo } from 'react'
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { ScrollArea } from '@/components/ui/scroll-area'

export interface Column<T> {
  key: string
  header: string
  render?: (row: T) => React.ReactNode
  sortValue?: (row: T) => string | number
  className?: string
  headerClassName?: string
  sortable?: boolean
  align?: 'left' | 'right' | 'center'
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  rowKey: (row: T) => string | number
  onRowClick?: (row: T) => void
  maxHeight?: string
  stickyHeader?: boolean
  emptyMessage?: string
  className?: string
  compact?: boolean
}

export function DataTable<T>({
  columns,
  data,
  rowKey,
  onRowClick,
  maxHeight,
  stickyHeader = true,
  emptyMessage = 'No data available',
  className,
  compact = false,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  const sorted = useMemo(() => {
    if (!sortKey) return data
    const col = columns.find((c) => c.key === sortKey)
    if (!col?.sortValue) return data
    return [...data].sort((a, b) => {
      const av = col.sortValue!(a)
      const bv = col.sortValue!(b)
      const cmp = typeof av === 'number' && typeof bv === 'number'
        ? av - bv
        : String(av).localeCompare(String(bv))
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [data, sortKey, sortDir, columns])

  function handleSort(key: string, sortable?: boolean) {
    if (!sortable) return
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  const cellPad = compact ? 'px-3 py-2' : 'px-4 py-3'

  const table = (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-hoop-dark-border">
          {columns.map((col) => (
            <th
              key={col.key}
              className={cn(
                cellPad,
                'text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap',
                col.headerClassName,
                col.align === 'right' && 'text-right',
                col.align === 'center' && 'text-center',
                col.sortable && 'cursor-pointer select-none hover:text-foreground transition-colors',
                stickyHeader && 'sticky top-0 bg-hoop-dark-card z-10',
              )}
              onClick={() => handleSort(col.key, col.sortable)}
            >
              <span className="inline-flex items-center gap-1">
                {col.header}
                {col.sortable && (
                  sortKey === col.key
                    ? sortDir === 'asc'
                      ? <ChevronUp className="h-3 w-3 text-hoop-orange" />
                      : <ChevronDown className="h-3 w-3 text-hoop-orange" />
                    : <ChevronsUpDown className="h-3 w-3 opacity-30" />
                )}
              </span>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sorted.length === 0 ? (
          <tr>
            <td colSpan={columns.length} className="py-12 text-center text-muted-foreground">
              {emptyMessage}
            </td>
          </tr>
        ) : (
          sorted.map((row, i) => (
            <tr
              key={rowKey(row)}
              className={cn(
                'border-b border-hoop-dark-border/50 transition-colors',
                onRowClick && 'cursor-pointer hover:bg-hoop-dark-hover',
                i % 2 === 0 ? 'bg-transparent' : 'bg-hoop-dark-card/40',
              )}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={cn(
                    cellPad,
                    'whitespace-nowrap tabular-nums',
                    col.className,
                    col.align === 'right' && 'text-right',
                    col.align === 'center' && 'text-center',
                  )}
                >
                  {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? '—')}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  )

  if (maxHeight) {
    return (
      <ScrollArea style={{ maxHeight }} className={cn('rounded-xl border border-hoop-dark-border bg-hoop-dark-card', className)}>
        {table}
      </ScrollArea>
    )
  }

  return (
    <div className={cn('overflow-x-auto rounded-xl border border-hoop-dark-border bg-hoop-dark-card', className)}>
      {table}
    </div>
  )
}
