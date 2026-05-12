'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ChevronUp, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { ScrollArea } from '@/components/ui/scroll-area'
import { PlayerHeadshot } from '@/components/media/PlayerHeadshot'
import { calcPer36, calcPer100, applyAdvanced, type StatMode } from '@/lib/utils/statsCalc'
import { fmtPct, fmtStat } from '@/lib/utils/formatters'
import type { Player, PlayerStats } from '@/types'

interface PlayerRow {
  player: Player
  stats: PlayerStats
}

interface ColDef {
  key: string
  label: string
  modes: StatMode[]
  fmt: (v: number | undefined | null) => string
  highlight?: boolean
}

const COLS: ColDef[] = [
  { key: 'gp',      label: 'GP',   modes: ['per_game', 'per_36', 'per_100', 'advanced'], fmt: (v) => v?.toString() ?? '—' },
  { key: 'min',     label: 'MIN',  modes: ['per_game', 'per_36', 'per_100'],              fmt: (v) => v?.toString() ?? '—' },
  { key: 'pts',     label: 'PTS',  modes: ['per_game', 'per_36', 'per_100'],              fmt: fmtStat, highlight: true },
  { key: 'reb',     label: 'REB',  modes: ['per_game', 'per_36', 'per_100'],              fmt: fmtStat },
  { key: 'ast',     label: 'AST',  modes: ['per_game', 'per_36', 'per_100'],              fmt: fmtStat },
  { key: 'stl',     label: 'STL',  modes: ['per_game', 'per_36', 'per_100'],              fmt: fmtStat },
  { key: 'blk',     label: 'BLK',  modes: ['per_game', 'per_36', 'per_100'],              fmt: fmtStat },
  { key: 'to',      label: 'TOV',  modes: ['per_game', 'per_36', 'per_100'],              fmt: fmtStat },
  { key: 'oreb',    label: 'OREB', modes: ['per_game', 'per_36', 'per_100'],              fmt: fmtStat },
  { key: 'dreb',    label: 'DREB', modes: ['per_game', 'per_36', 'per_100'],              fmt: fmtStat },
  { key: 'fg_pct',  label: 'FG%',  modes: ['per_game', 'per_36', 'per_100', 'advanced'], fmt: fmtPct },
  { key: 'fg3_pct', label: '3P%',  modes: ['per_game', 'per_36', 'per_100', 'advanced'], fmt: fmtPct },
  { key: 'ft_pct',  label: 'FT%',  modes: ['per_game', 'per_36', 'per_100', 'advanced'], fmt: fmtPct },
  { key: 'ts_pct',  label: 'TS%',  modes: ['advanced'],                                  fmt: fmtPct, highlight: true },
  { key: 'efg_pct', label: 'eFG%', modes: ['advanced'],                                  fmt: fmtPct },
  { key: 'per',     label: 'PER',  modes: ['advanced'],                                  fmt: (v) => v?.toFixed(1) ?? '—', highlight: true },
  { key: 'usg_pct', label: 'USG%', modes: ['advanced'],                                  fmt: fmtPct },
  { key: 'bpm',     label: 'BPM',  modes: ['advanced'],                                  fmt: (v) => v?.toFixed(1) ?? '—' },
  { key: 'vorp',    label: 'VORP', modes: ['advanced'],                                  fmt: (v) => v?.toFixed(1) ?? '—' },
]

const MODE_LABELS: Record<StatMode, string> = {
  per_game: 'Per Game',
  per_36:   'Per 36',
  per_100:  'Per 100',
  advanced: 'Advanced',
}

interface StatsTableProps {
  rows: PlayerRow[]
  defaultMode?: StatMode
  defaultSort?: string
}

export function StatsTable({ rows, defaultMode = 'per_game', defaultSort = 'pts' }: StatsTableProps) {
  const [mode, setMode]       = useState<StatMode>(defaultMode)
  const [sortKey, setSortKey] = useState(defaultSort)
  const [sortDir, setSortDir] = useState<'desc' | 'asc'>('desc')

  const visibleCols = COLS.filter((c) => c.modes.includes(mode))

  const processed = useMemo(() => {
    return rows.map(({ player, stats }) => {
      const base = applyAdvanced(stats)
      const s = mode === 'per_36'  ? { ...base, ...calcPer36(base) }
               : mode === 'per_100' ? { ...base, ...calcPer100(base) }
               : base
      return { player, stats: s }
    })
  }, [rows, mode])

  const sorted = useMemo(() => {
    return [...processed].sort((a, b) => {
      const av = getStatVal(a.stats, sortKey)
      const bv = getStatVal(b.stats, sortKey)
      return sortDir === 'desc' ? bv - av : av - bv
    })
  }, [processed, sortKey, sortDir])

  function handleSort(key: string) {
    if (key === sortKey) {
      setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'))
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  return (
    <div className="rounded-xl border border-hoop-dark-border bg-hoop-dark-card overflow-hidden">
      {/* Mode toggle */}
      <div className="flex items-center gap-1 border-b border-hoop-dark-border p-3">
        {(Object.entries(MODE_LABELS) as [StatMode, string][]).map(([m, label]) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={cn(
              'rounded-lg px-3 py-1.5 text-xs font-semibold transition-all',
              mode === m
                ? 'bg-hoop-orange text-white'
                : 'text-muted-foreground hover:text-foreground hover:bg-hoop-dark-hover',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <ScrollArea className="w-full" style={{ maxHeight: 520 }}>
        <table className="w-full min-w-max">
          <thead className="sticky top-0 z-10 bg-hoop-dark-card border-b border-hoop-dark-border">
            <tr>
              <th className="px-4 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground w-8">#</th>
              <th className="px-4 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground min-w-[180px]">Player</th>
              <th className="px-2 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Team</th>
              {visibleCols.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className={cn(
                    'px-3 py-2 text-right text-[10px] font-semibold uppercase tracking-wider cursor-pointer select-none whitespace-nowrap',
                    sortKey === col.key ? 'text-hoop-orange' : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  <span className="inline-flex items-center gap-0.5 justify-end">
                    {col.label}
                    {sortKey === col.key && (
                      sortDir === 'desc'
                        ? <ChevronDown className="h-3 w-3" />
                        : <ChevronUp className="h-3 w-3" />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map(({ player, stats }, i) => (
              <tr
                key={player.id}
                className="border-b border-hoop-dark-border/30 hover:bg-hoop-dark-hover transition-colors group"
              >
                <td className="px-4 py-2.5 text-xs font-bold text-muted-foreground">{i + 1}</td>
                <td className="px-4 py-2.5">
                  <Link href={`/players/${player.id}`} className="flex items-center gap-2.5 group-hover:text-hoop-orange transition-colors">
                    <PlayerHeadshot
                      nbaId={(player as Record<string, unknown>).nba_id as string | number | undefined}
                      photoUrl={player.photo_url}
                      name={player.name}
                      team={player.team}
                      size={28}
                    />
                    <span className="text-sm font-medium text-foreground group-hover:text-hoop-orange transition-colors truncate max-w-[120px]">
                      {player.name}
                    </span>
                  </Link>
                </td>
                <td className="px-2 py-2.5 text-xs text-muted-foreground whitespace-nowrap">{player.team}</td>
                {visibleCols.map((col) => {
                  const raw = getStatRaw(stats, col.key)
                  const val = raw != null ? Number(raw) : undefined
                  return (
                    <td
                      key={col.key}
                      className={cn(
                        'px-3 py-2.5 text-right text-sm tabular-nums',
                        sortKey === col.key && col.highlight ? 'text-hoop-orange font-bold' : 'text-foreground',
                        sortKey === col.key && !col.highlight ? 'font-semibold' : '',
                      )}
                    >
                      {col.key === 'min' ? (raw?.toString() ?? '—') : col.fmt(val)}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollArea>
    </div>
  )
}

function getStatVal(stats: Partial<PlayerStats>, key: string): number {
  const raw = (stats as Record<string, unknown>)[key]
  const n = Number(raw)
  return isNaN(n) ? 0 : n
}

function getStatRaw(stats: Partial<PlayerStats>, key: string): unknown {
  return (stats as Record<string, unknown>)[key]
}
