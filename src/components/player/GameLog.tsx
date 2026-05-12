'use client'

import { useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils/cn'
import { DataTable, type Column } from '@/components/common/DataTable'
import { Badge } from '@/components/ui/badge'
import { fmtShortDate, fmtPlusMinus } from '@/lib/utils/formatters'
import type { GameLogEntry } from '@/types'

const COLUMNS: Column<GameLogEntry>[] = [
  {
    key: 'date',
    header: 'Date',
    render: (r) => <span className="text-muted-foreground">{fmtShortDate(r.date)}</span>,
  },
  {
    key: 'opponent',
    header: 'Opp',
    render: (r) => (
      <span className="font-medium text-foreground">
        {r.home_away === 'away' ? '@ ' : 'vs '}
        {r.opponent}
      </span>
    ),
  },
  {
    key: 'result',
    header: 'W/L',
    render: (r) => (
      <Badge variant={r.result === 'W' ? 'win' : 'loss'} className="text-[10px] py-0 px-1.5">
        {r.result}
      </Badge>
    ),
  },
  { key: 'score', header: 'Score', className: 'text-muted-foreground' },
  { key: 'min', header: 'MIN', align: 'right', sortable: true, sortValue: (r) => parseFloat(r.min) || 0 },
  {
    key: 'pts',
    header: 'PTS',
    align: 'right',
    sortable: true,
    sortValue: (r) => r.pts,
    render: (r) => <span className={cn('font-semibold', r.pts >= 20 && 'text-hoop-orange')}>{r.pts}</span>,
  },
  { key: 'reb', header: 'REB', align: 'right', sortable: true, sortValue: (r) => r.reb },
  { key: 'ast', header: 'AST', align: 'right', sortable: true, sortValue: (r) => r.ast },
  { key: 'stl', header: 'STL', align: 'right', sortable: true, sortValue: (r) => r.stl },
  { key: 'blk', header: 'BLK', align: 'right', sortable: true, sortValue: (r) => r.blk },
  { key: 'to',  header: 'TO',  align: 'right', sortable: true, sortValue: (r) => r.to },
  { key: 'fg',  header: 'FG',  align: 'right', render: (r) => r.fg  ?? '—' },
  { key: 'fg3', header: '3P',  align: 'right', render: (r) => r.fg3 ?? '—' },
  { key: 'ft',  header: 'FT',  align: 'right', render: (r) => r.ft  ?? '—' },
  {
    key: 'plus_minus',
    header: '+/-',
    align: 'right',
    sortable: true,
    sortValue: (r) => r.plus_minus ?? 0,
    render: (r) => {
      const pm = r.plus_minus
      if (pm == null) return '—'
      return (
        <span className={pm > 0 ? 'text-hoop-win' : pm < 0 ? 'text-hoop-loss' : ''}>
          {fmtPlusMinus(pm)}
        </span>
      )
    },
  },
]

interface GameLogProps {
  entries: GameLogEntry[]
}

export function GameLog({ entries }: GameLogProps) {
  const [limit, setLimit] = useState(20)
  const shown = entries.slice(0, limit)

  return (
    <div className="space-y-3">
      <DataTable
        columns={COLUMNS}
        data={shown}
        rowKey={(r) => r.game_id}
        compact
        maxHeight="520px"
        emptyMessage="No game log available"
      />
      {entries.length > limit && (
        <div className="flex justify-center">
          <button
            onClick={() => setLimit((l) => l + 20)}
            className="text-sm text-muted-foreground hover:text-hoop-orange transition-colors"
          >
            Show more ({entries.length - limit} remaining)
          </button>
        </div>
      )}
    </div>
  )
}
