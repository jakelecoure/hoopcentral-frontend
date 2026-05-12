import { cn } from '@/lib/utils/cn'

interface QuarterScoresProps {
  homeTeam: string
  awayTeam: string
  quarterScores?: { home: number[]; away: number[] }
  homeScore?: number
  awayScore?: number
}

export function QuarterScores({
  homeTeam,
  awayTeam,
  quarterScores,
  homeScore,
  awayScore,
}: QuarterScoresProps) {
  const periods = quarterScores
    ? Math.max(quarterScores.home.length, quarterScores.away.length)
    : 4

  const periodLabels = Array.from({ length: periods }, (_, i) =>
    i < 4 ? `Q${i + 1}` : `OT${i - 3}`,
  )

  return (
    <div className="overflow-x-auto rounded-xl border border-hoop-dark-border bg-hoop-dark-card">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-hoop-dark-border">
            <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Team</th>
            {periodLabels.map((p) => (
              <th key={p} className="px-3 py-3 text-center text-xs font-semibold text-muted-foreground w-12">
                {p}
              </th>
            ))}
            <th className="px-4 py-3 text-center text-xs font-bold text-foreground w-16">T</th>
          </tr>
        </thead>
        <tbody>
          <QuarterRow
            team={awayTeam}
            scores={quarterScores?.away ?? []}
            total={awayScore}
            periods={periods}
            isWinner={awayScore != null && homeScore != null && awayScore > homeScore}
          />
          <QuarterRow
            team={homeTeam}
            scores={quarterScores?.home ?? []}
            total={homeScore}
            periods={periods}
            isWinner={homeScore != null && awayScore != null && homeScore > awayScore}
            isLast
          />
        </tbody>
      </table>
    </div>
  )
}

function QuarterRow({
  team,
  scores,
  total,
  periods,
  isWinner,
  isLast,
}: {
  team: string
  scores: number[]
  total?: number
  periods: number
  isWinner: boolean
  isLast?: boolean
}) {
  return (
    <tr className={cn(!isLast && 'border-b border-hoop-dark-border/50')}>
      <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap">{team}</td>
      {Array.from({ length: periods }, (_, i) => (
        <td key={i} className="px-3 py-3 text-center text-sm tabular-nums text-muted-foreground">
          {scores[i] ?? '—'}
        </td>
      ))}
      <td className={cn(
        'px-4 py-3 text-center text-base font-bold tabular-nums',
        isWinner ? 'text-hoop-orange' : 'text-foreground',
      )}>
        {total ?? '—'}
      </td>
    </tr>
  )
}
