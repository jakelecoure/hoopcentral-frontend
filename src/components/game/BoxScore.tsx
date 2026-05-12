'use client'

import { DataTable, type Column } from '@/components/common/DataTable'
import { Badge } from '@/components/ui/badge'
import { fmtPlusMinus } from '@/lib/utils/formatters'
import type { GamePlayerStats } from '@/types'
import Link from 'next/link'

const COLUMNS: Column<GamePlayerStats>[] = [
  {
    key: 'player_name',
    header: 'Player',
    className: 'min-w-[140px]',
    render: (row) => (
      <div className="flex items-center gap-2">
        {row.starter && (
          <span className="text-[9px] font-bold text-hoop-orange uppercase">S</span>
        )}
        <Link
          href={`/players/${row.player_id}`}
          className="font-medium text-foreground hover:text-hoop-orange transition-colors"
        >
          {row.player_name}
        </Link>
      </div>
    ),
  },
  { key: 'min',  header: 'MIN', sortable: true, sortValue: (r) => parseFloat(r.min) || 0, align: 'right' },
  { key: 'pts',  header: 'PTS', sortable: true, sortValue: (r) => r.pts, align: 'right',
    render: (r) => <span className={r.pts >= 20 ? 'font-bold text-hoop-orange' : ''}>{r.pts}</span>,
  },
  { key: 'reb',  header: 'REB', sortable: true, sortValue: (r) => r.reb, align: 'right' },
  { key: 'ast',  header: 'AST', sortable: true, sortValue: (r) => r.ast, align: 'right' },
  { key: 'stl',  header: 'STL', sortable: true, sortValue: (r) => r.stl, align: 'right' },
  { key: 'blk',  header: 'BLK', sortable: true, sortValue: (r) => r.blk, align: 'right' },
  { key: 'to',   header: 'TO',  sortable: true, sortValue: (r) => r.to,  align: 'right' },
  { key: 'fg',   header: 'FG',  align: 'right', render: (r) => r.fg  ?? '—' },
  { key: 'fg3',  header: '3PT', align: 'right', render: (r) => r.fg3 ?? '—' },
  { key: 'ft',   header: 'FT',  align: 'right', render: (r) => r.ft  ?? '—' },
  {
    key: 'plus_minus',
    header: '+/-',
    sortable: true,
    sortValue: (r) => r.plus_minus ?? 0,
    align: 'right',
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

interface BoxScoreProps {
  homePlayers: GamePlayerStats[]
  awayPlayers: GamePlayerStats[]
  homeTeam: string
  awayTeam: string
}

export function BoxScore({ homePlayers, awayPlayers, homeTeam, awayTeam }: BoxScoreProps) {
  return (
    <div className="space-y-6">
      <TeamBoxScore players={awayPlayers} teamName={awayTeam} />
      <TeamBoxScore players={homePlayers} teamName={homeTeam} />
    </div>
  )
}

function TeamBoxScore({ players, teamName }: { players: GamePlayerStats[]; teamName: string }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 px-1">
        <h3 className="text-sm font-semibold text-foreground">{teamName}</h3>
        <Badge variant="secondary" className="text-[10px]">
          {players.length} players
        </Badge>
      </div>
      <DataTable
        columns={COLUMNS}
        data={players}
        rowKey={(r) => r.player_id}
        compact
        maxHeight="360px"
      />
    </div>
  )
}
