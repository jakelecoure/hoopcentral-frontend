import { useMemo, useState } from 'react';
import styles from './DataTable.module.css';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T, i: number) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  sortValue?: (row: T) => string | number;
  width?: string;
}

interface Sort {
  key: string;
  dir: 'asc' | 'desc';
}

interface Props<T> {
  columns: Column<T>[];
  rows: T[];
  getKey: (row: T) => string | number;
  emptyMessage?: string;
  defaultSort?: Sort;
  footerRow?: React.ReactNode;
  compact?: boolean;
}

function SortIcon({ active, dir }: { active: boolean; dir?: 'asc' | 'desc' }) {
  return (
    <span className={`${styles.sortIcon} ${active ? styles.sortActive : ''}`}>
      {active && dir === 'desc' ? '↓' : '↑'}
    </span>
  );
}

export function DataTable<T>({
  columns,
  rows,
  getKey,
  emptyMessage = 'No data available.',
  defaultSort,
  footerRow,
  compact,
}: Props<T>) {
  const [sort, setSort] = useState<Sort | null>(defaultSort ?? null);

  const sorted = useMemo(() => {
    if (!sort) return rows;
    const col = columns.find((c) => c.key === sort.key);
    return [...rows].sort((a, b) => {
      const va = col?.sortValue
        ? col.sortValue(a)
        : ((a as Record<string, unknown>)[sort.key] ?? '');
      const vb = col?.sortValue
        ? col.sortValue(b)
        : ((b as Record<string, unknown>)[sort.key] ?? '');
      const numA = Number(va);
      const numB = Number(vb);
      const cmp = !isNaN(numA) && !isNaN(numB) ? numA - numB : String(va).localeCompare(String(vb));
      return sort.dir === 'asc' ? cmp : -cmp;
    });
  }, [rows, sort, columns]);

  function handleSort(col: Column<T>) {
    if (!col.sortable) return;
    setSort((prev) => {
      if (!prev || prev.key !== col.key) return { key: col.key, dir: 'desc' };
      if (prev.dir === 'desc') return { key: col.key, dir: 'asc' };
      return null;
    });
  }

  if (rows.length === 0) {
    return <p className={styles.empty}>{emptyMessage}</p>;
  }

  return (
    <div className={styles.wrapper}>
      <table className={`${styles.table} ${compact ? styles.compact : ''}`}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={`${styles.th} ${col.sortable ? styles.sortable : ''}`}
                style={{ textAlign: col.align ?? 'left', width: col.width }}
                onClick={() => handleSort(col)}
              >
                {col.header}
                {col.sortable && (
                  <SortIcon active={sort?.key === col.key} dir={sort?.dir} />
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row, i) => (
            <tr key={getKey(row)} className={styles.tr}>
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={styles.td}
                  style={{ textAlign: col.align ?? 'left', width: col.width }}
                >
                  {col.render
                    ? col.render(row, i)
                    : String((row as Record<string, unknown>)[col.key] ?? '—')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        {footerRow && (
          <tfoot>
            <tr className={styles.footerRow}>{footerRow}</tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}
