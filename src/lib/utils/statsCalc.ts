import type { PlayerStats, GameLogEntry } from '@/types'

export type StatMode = 'per_game' | 'per_36' | 'per_100' | 'advanced'

function minutesToDecimal(min: string | undefined): number {
  if (!min) return 0
  if (typeof min === 'number') return min as number
  const [m, s] = min.toString().split(':').map(Number)
  return (m || 0) + (s || 0) / 60
}

export function calcPer36(stats: PlayerStats): Partial<PlayerStats> {
  const mpg = minutesToDecimal(stats.min)
  if (!mpg) return {}
  const factor = 36 / mpg
  return {
    pts:  +(stats.pts  * factor).toFixed(1),
    reb:  +(stats.reb  * factor).toFixed(1),
    ast:  +(stats.ast  * factor).toFixed(1),
    stl:  +(stats.stl  * factor).toFixed(1),
    blk:  +(stats.blk  * factor).toFixed(1),
    to:   +(stats.to   * factor).toFixed(1),
    oreb: stats.oreb != null ? +(stats.oreb * factor).toFixed(1) : undefined,
    dreb: stats.dreb != null ? +(stats.dreb * factor).toFixed(1) : undefined,
    fg_made:  stats.fg_made  != null ? +(stats.fg_made  * factor).toFixed(1) : undefined,
    fg_att:   stats.fg_att   != null ? +(stats.fg_att   * factor).toFixed(1) : undefined,
    fg3_made: stats.fg3_made != null ? +(stats.fg3_made * factor).toFixed(1) : undefined,
    fg3_att:  stats.fg3_att  != null ? +(stats.fg3_att  * factor).toFixed(1) : undefined,
    ft_made:  stats.ft_made  != null ? +(stats.ft_made  * factor).toFixed(1) : undefined,
    ft_att:   stats.ft_att   != null ? +(stats.ft_att   * factor).toFixed(1) : undefined,
    fg_pct:   stats.fg_pct,
    fg3_pct:  stats.fg3_pct,
    ft_pct:   stats.ft_pct,
    gp:       stats.gp,
    min:      stats.min,
  }
}

export function calcPer100(stats: PlayerStats): Partial<PlayerStats> {
  const mpg = minutesToDecimal(stats.min)
  if (!mpg) return {}
  const factor = 100 / mpg / 2
  return {
    pts:  +(stats.pts  * factor).toFixed(1),
    reb:  +(stats.reb  * factor).toFixed(1),
    ast:  +(stats.ast  * factor).toFixed(1),
    stl:  +(stats.stl  * factor).toFixed(1),
    blk:  +(stats.blk  * factor).toFixed(1),
    to:   +(stats.to   * factor).toFixed(1),
    oreb: stats.oreb != null ? +(stats.oreb * factor).toFixed(1) : undefined,
    dreb: stats.dreb != null ? +(stats.dreb * factor).toFixed(1) : undefined,
    fg_pct:  stats.fg_pct,
    fg3_pct: stats.fg3_pct,
    ft_pct:  stats.ft_pct,
    gp:  stats.gp,
    min: stats.min,
  }
}

export function calcTsPct(pts: number, fga: number, fta: number): number | null {
  const denom = 2 * (fga + 0.44 * fta)
  if (!denom) return null
  return pts / denom
}

export function calcEfgPct(fgm: number, fg3m: number, fga: number): number | null {
  if (!fga) return null
  return (fgm + 0.5 * fg3m) / fga
}

export function applyAdvanced(stats: PlayerStats): PlayerStats {
  const out = { ...stats }
  if (out.ts_pct == null && out.pts != null && out.fg_att != null && out.ft_att != null) {
    out.ts_pct = calcTsPct(out.pts, out.fg_att, out.ft_att) ?? undefined
  }
  if (out.efg_pct == null && out.fg_made != null && out.fg3_made != null && out.fg_att != null) {
    out.efg_pct = calcEfgPct(out.fg_made, out.fg3_made, out.fg_att) ?? undefined
  }
  return out
}

export function calcRollingAverage(
  gameLog: GameLogEntry[],
  stat: keyof Pick<GameLogEntry, 'pts' | 'reb' | 'ast' | 'stl' | 'blk' | 'to'>,
  window: number,
): Array<{ date: string; value: number; rolling: number | null }> {
  const chronological = [...gameLog].reverse()
  return chronological.map((g, i) => {
    const slice = chronological.slice(Math.max(0, i - window + 1), i + 1)
    const rolling = slice.length >= window
      ? slice.reduce((sum, x) => sum + (x[stat] as number), 0) / slice.length
      : null
    return { date: g.date, value: g[stat] as number, rolling }
  })
}
