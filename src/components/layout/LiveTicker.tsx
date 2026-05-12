'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils/cn'
import { fetchGames } from '@/lib/api/games'
import { useLeague } from '@/lib/hooks/useLeague'
import { useWebSocket } from '@/lib/hooks/useWebSocket'
import type { Game, WsMessage } from '@/types'

export function LiveTicker() {
  const { league } = useLeague()
  const [games, setGames] = useState<Game[]>([])

  useEffect(() => {
    fetchGames(league).then((all) => {
      const live = all.filter((g) => g.status === 'live')
      const soon = all.filter((g) => g.status === 'scheduled').slice(0, 4)
      setGames([...live, ...soon])
    }).catch(() => {})
  }, [league])

  useWebSocket((msg: WsMessage) => {
    if (msg.type === 'game_update' || msg.type === 'score_update') {
      fetchGames(league).then((all) => {
        const live = all.filter((g) => g.status === 'live')
        const soon = all.filter((g) => g.status === 'scheduled').slice(0, 4)
        setGames([...live, ...soon])
      }).catch(() => {})
    }
  })

  if (games.length === 0) return null

  const tickerItems = [...games, ...games] // duplicate for seamless loop

  return (
    <div className="relative h-8 overflow-hidden border-b border-hoop-dark-border bg-hoop-dark-card">
      <div className="flex h-full items-center">
        {/* Label */}
        <div className="shrink-0 flex items-center gap-2 border-r border-hoop-dark-border bg-hoop-dark px-3 h-full z-10">
          <span className="h-1.5 w-1.5 rounded-full bg-hoop-live animate-live-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-hoop-orange">
            LIVE
          </span>
        </div>

        {/* Scrolling content */}
        <div className="flex-1 overflow-hidden">
          <div className="flex w-max animate-ticker items-center gap-8 px-4">
            {tickerItems.map((game, i) => (
              <TickerGame key={`${game.id}-${i}`} game={game} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function TickerGame({ game }: { game: Game }) {
  const isLive = game.status === 'live'
  const hasScore = game.home_score != null && game.away_score != null

  return (
    <Link href={`/games/${game.id}`} className="flex items-center gap-2 whitespace-nowrap group">
      {isLive && (
        <span className="h-1.5 w-1.5 rounded-full bg-hoop-live animate-live-pulse" />
      )}
      <span className={cn('text-xs font-medium', isLive ? 'text-foreground' : 'text-muted-foreground')}>
        {game.away_team}
      </span>
      {hasScore && (
        <span className={cn(
          'text-xs font-bold tabular-nums',
          isLive ? 'text-hoop-orange' : 'text-muted-foreground',
        )}>
          {game.away_score} - {game.home_score}
        </span>
      )}
      <span className={cn('text-xs font-medium', isLive ? 'text-foreground' : 'text-muted-foreground')}>
        {game.home_team}
      </span>
      {isLive && game.period && (
        <span className="text-[10px] text-hoop-live font-semibold">
          Q{game.period}
          {game.clock && ` ${game.clock}`}
        </span>
      )}
      <span className="text-hoop-dark-border">|</span>
    </Link>
  )
}
