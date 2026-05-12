'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Search, Users } from 'lucide-react'
import { useLeague } from '@/lib/hooks/useLeague'
import { useFetch } from '@/lib/hooks/useFetch'
import { fetchPlayers } from '@/lib/api/players'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { SkeletonTable } from '@/components/common/SkeletonCard'
import { ErrorState } from '@/components/common/ErrorState'
import { EmptyState } from '@/components/common/EmptyState'
import { DataTable, type Column } from '@/components/common/DataTable'
import { getTeamColor } from '@/lib/utils/constants'
import { fmtStat, fmtPct } from '@/lib/utils/formatters'
import { useRouter } from 'next/navigation'
import type { Player } from '@/types'

const POSITIONS = ['All', 'PG', 'SG', 'SF', 'PF', 'C', 'G', 'F']

function getInitials(name: string): string {
  const p = name.split(' ')
  return p.length >= 2 ? p[0][0] + p[p.length - 1][0] : name.slice(0, 2)
}

const COLUMNS: Column<Player>[] = [
  {
    key: 'name',
    header: 'Player',
    className: 'min-w-[180px]',
    render: (p) => {
      const color = getTeamColor(p.team)
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarFallback className="text-xs font-bold" style={{ backgroundColor: color + '20', color }}>
              {getInitials(p.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-foreground">{p.name}</p>
            {p.jersey_number && (
              <p className="text-[10px] text-muted-foreground">#{p.jersey_number}</p>
            )}
          </div>
        </div>
      )
    },
  },
  {
    key: 'team',
    header: 'Team',
    render: (p) => (
      <Link href={`/teams/${p.team_id}`} className="text-sm hover:text-hoop-orange transition-colors">
        {p.team}
      </Link>
    ),
  },
  {
    key: 'position',
    header: 'POS',
    render: (p) => p.position ? (
      <Badge variant="secondary" className="text-[10px]">{p.position}</Badge>
    ) : <span className="text-muted-foreground">—</span>,
  },
  {
    key: 'pts',
    header: 'PTS',
    align: 'right',
    sortable: true,
    sortValue: (p) => Number((p as Record<string, unknown>).pts) || 0,
    render: (p) => {
      const v = Number((p as Record<string, unknown>).pts)
      return <span className={v >= 20 ? 'font-bold text-hoop-orange' : ''}>{isNaN(v) ? '—' : v.toFixed(1)}</span>
    },
  },
  {
    key: 'reb',
    header: 'REB',
    align: 'right',
    sortable: true,
    sortValue: (p) => Number((p as Record<string, unknown>).reb) || 0,
    render: (p) => fmtStat(Number((p as Record<string, unknown>).reb) || undefined),
  },
  {
    key: 'ast',
    header: 'AST',
    align: 'right',
    sortable: true,
    sortValue: (p) => Number((p as Record<string, unknown>).ast) || 0,
    render: (p) => fmtStat(Number((p as Record<string, unknown>).ast) || undefined),
  },
  {
    key: 'height',
    header: 'Height',
    render: (p) => p.height ?? '—',
  },
]

export default function PlayersPage() {
  const router = useRouter()
  const { league } = useLeague()
  const [query, setQuery] = useState('')
  const [posFilter, setPosFilter] = useState('All')
  const [page, setPage] = useState(1)
  const PER_PAGE = 25

  const { data, loading, error, refetch } = useFetch<Player[]>(
    () => fetchPlayers(league),
    [league],
  )

  const filtered = useMemo(() => {
    let list = data ?? []
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.team.toLowerCase().includes(q),
      )
    }
    if (posFilter !== 'All') {
      list = list.filter((p) => p.position === posFilter)
    }
    return list
  }, [data, query, posFilter])

  const paginated = filtered.slice(0, page * PER_PAGE)
  const hasMore   = paginated.length < filtered.length

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-6 lg:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-black">Players</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {league.toUpperCase()} · {data?.length ?? 0} players
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search players or teams..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1) }}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {POSITIONS.map((pos) => (
            <button
              key={pos}
              onClick={() => { setPosFilter(pos); setPage(1) }}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                posFilter === pos
                  ? 'border-hoop-orange bg-hoop-orange/10 text-hoop-orange'
                  : 'border-hoop-dark-border bg-hoop-dark-card text-muted-foreground hover:border-hoop-dark-border/80'
              }`}
            >
              {pos}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <SkeletonTable rows={12} cols={6} />
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : filtered.length === 0 ? (
        <EmptyState icon={Users} title="No players found" description="Try adjusting your filters." />
      ) : (
        <div className="space-y-4">
          <DataTable
            columns={COLUMNS}
            data={paginated}
            rowKey={(p) => p.id}
            onRowClick={(p) => router.push(`/players/${p.id}`)}
            maxHeight="600px"
          />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Showing {paginated.length} of {filtered.length} players</span>
            {hasMore && (
              <button
                onClick={() => setPage((p) => p + 1)}
                className="text-hoop-orange hover:text-hoop-orange-400 transition-colors font-medium"
              >
                Load more
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
