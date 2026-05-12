'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { useLeague } from '@/lib/hooks/useLeague'
import { useFetch } from '@/lib/hooks/useFetch'
import { fetchTeams } from '@/lib/api/teams'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { SkeletonTable } from '@/components/common/SkeletonCard'
import { ErrorState } from '@/components/common/ErrorState'
import { EmptyState } from '@/components/common/EmptyState'
import { getTeamColor, getTeamAbbr } from '@/lib/utils/constants'
import type { Team } from '@/types'

const CONFERENCES = ['All', 'Eastern', 'Western']

export default function TeamsPage() {
  const { league } = useLeague()
  const [query, setQuery] = useState('')
  const [conf, setConf] = useState('All')

  const { data, loading, error, refetch } = useFetch<Team[]>(
    () => fetchTeams(league),
    [league],
  )

  const filtered = useMemo(() => {
    let list = data ?? []
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter((t) => t.name.toLowerCase().includes(q) || t.city?.toLowerCase().includes(q))
    }
    if (conf !== 'All') {
      list = list.filter((t) => t.conference?.toLowerCase().includes(conf.toLowerCase()))
    }
    return list
  }, [data, query, conf])

  // Group by division
  const byConf = useMemo(() => {
    const grouped: Record<string, Team[]> = {}
    filtered.forEach((t) => {
      const key = t.conference ?? 'Other'
      if (!grouped[key]) grouped[key] = []
      grouped[key].push(t)
    })
    return grouped
  }, [filtered])

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-6 lg:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-black">Teams</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {league.toUpperCase()} · {data?.length ?? 0} teams
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search teams..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          {CONFERENCES.map((c) => (
            <button
              key={c}
              onClick={() => setConf(c)}
              className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
                conf === c
                  ? 'border-hoop-orange bg-hoop-orange/10 text-hoop-orange'
                  : 'border-hoop-dark-border bg-hoop-dark-card text-muted-foreground hover:border-hoop-dark-border/80'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="h-28 rounded-xl border border-hoop-dark-border bg-hoop-dark-card animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : filtered.length === 0 ? (
        <EmptyState title="No teams found" />
      ) : conf !== 'All' ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((t, i) => <TeamCard key={t.id} team={t} index={i} />)}
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(byConf).map(([conference, teams]) => (
            <div key={conference}>
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                {conference} Conference
              </h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {teams.map((t, i) => <TeamCard key={t.id} team={t} index={i} />)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function TeamCard({ team, index }: { team: Team; index: number }) {
  const color = getTeamColor(team.name)
  const abbr  = getTeamAbbr(team.name)

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
    >
      <Link href={`/teams/${team.id}`}>
        <div className="group relative overflow-hidden rounded-xl border border-hoop-dark-border bg-hoop-dark-card p-4 hover:-translate-y-0.5 hover:shadow-lg transition-all hover:border-hoop-dark-border/80">
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ background: `linear-gradient(135deg, ${color}08 0%, transparent 60%)` }}
          />
          <div className="relative flex items-center gap-3">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-sm font-black"
              style={{ backgroundColor: color + '20', border: `1.5px solid ${color}40`, color }}
            >
              {abbr}
            </div>
            <div className="min-w-0">
              {team.city && (
                <p className="text-[10px] text-muted-foreground">{team.city}</p>
              )}
              <p className="font-semibold text-foreground group-hover:text-hoop-orange transition-colors truncate">
                {team.name}
              </p>
              <div className="mt-0.5 flex items-center gap-1.5">
                {team.conference && (
                  <Badge variant="secondary" className="text-[9px] py-0 px-1">{team.conference}</Badge>
                )}
                {team.division && (
                  <span className="text-[9px] text-muted-foreground">{team.division}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
