'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, User, Users, Zap, ArrowRight, X } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { Input } from '@/components/ui/input'
import { fuzzyMatch } from '@/lib/api/search'
import { fetchPlayers } from '@/lib/api/players'
import { fetchTeams } from '@/lib/api/teams'
import { useLeague } from '@/lib/hooks/useLeague'
import type { SearchResult, Player, Team } from '@/types'

interface GlobalSearchProps {
  open: boolean
  onClose: () => void
}

const TYPE_ICONS = {
  player: User,
  team:   Users,
  game:   Zap,
}

export function GlobalSearch({ open, onClose }: GlobalSearchProps) {
  const router = useRouter()
  const { league } = useLeague()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [players, setPlayers] = useState<Player[]>([])
  const [teams, setTeams]     = useState<Team[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Preload data for instant search
  useEffect(() => {
    if (!open) return
    fetchPlayers(league).then(setPlayers).catch(() => {})
    fetchTeams(league).then(setTeams).catch(() => {})
  }, [open, league])

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50)
      setQuery('')
      setResults([])
      setSelectedIndex(0)
    }
  }, [open])

  // Keyboard shortcut ⌘K
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        open ? onClose() : void 0
      }
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const handleSearch = useCallback(
    (q: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        setResults(fuzzyMatch(q, players, teams))
        setSelectedIndex(0)
      }, 150)
    },
    [players, teams],
  )

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const q = e.target.value
    setQuery(q)
    handleSearch(q)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((i) => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      navigateTo(results[selectedIndex])
    }
  }

  function navigateTo(result: SearchResult) {
    router.push(result.href)
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.2, type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed left-1/2 top-16 z-50 w-full max-w-lg -translate-x-1/2 rounded-xl border border-hoop-dark-border bg-hoop-dark-card shadow-2xl"
          >
            {/* Search input */}
            <div className="flex items-center gap-3 border-b border-hoop-dark-border px-4 py-3">
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                ref={inputRef}
                value={query}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="Search players, teams, games..."
                className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
              {query && (
                <button onClick={() => { setQuery(''); setResults([]) }}>
                  <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                </button>
              )}
              <kbd className="rounded border border-hoop-dark-border px-1.5 py-0.5 text-xs text-muted-foreground">
                ESC
              </kbd>
            </div>

            {/* Results */}
            {query.length >= 2 && (
              <div className="max-h-80 overflow-y-auto py-2">
                {results.length === 0 ? (
                  <div className="py-8 text-center text-sm text-muted-foreground">
                    No results for &ldquo;{query}&rdquo;
                  </div>
                ) : (
                  results.map((result, i) => {
                    const Icon = TYPE_ICONS[result.type]
                    return (
                      <button
                        key={`${result.type}-${result.id}`}
                        onClick={() => navigateTo(result)}
                        className={cn(
                          'flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors',
                          i === selectedIndex
                            ? 'bg-hoop-orange/10 text-foreground'
                            : 'text-muted-foreground hover:bg-hoop-dark-hover hover:text-foreground',
                        )}
                      >
                        <div className={cn(
                          'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                          i === selectedIndex ? 'bg-hoop-orange/20' : 'bg-hoop-dark-border',
                        )}>
                          <Icon className={cn('h-4 w-4', i === selectedIndex && 'text-hoop-orange')} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-foreground truncate">{result.label}</p>
                          {result.sublabel && (
                            <p className="text-xs text-muted-foreground truncate">{result.sublabel}</p>
                          )}
                        </div>
                        <ArrowRight className={cn('h-3.5 w-3.5 shrink-0', i === selectedIndex ? 'text-hoop-orange' : 'opacity-0')} />
                      </button>
                    )
                  })
                )}
              </div>
            )}

            {/* Empty state hint */}
            {query.length < 2 && (
              <div className="grid grid-cols-3 gap-px p-3">
                {[
                  { label: 'Players', icon: User, href: '/players' },
                  { label: 'Teams',   icon: Users, href: '/teams' },
                  { label: 'Games',   icon: Zap,   href: '/games' },
                ].map(({ label, icon: Icon, href }) => (
                  <button
                    key={href}
                    onClick={() => { router.push(href); onClose() }}
                    className="flex flex-col items-center gap-1.5 rounded-lg p-3 hover:bg-hoop-dark-hover transition-colors"
                  >
                    <Icon className="h-5 w-5 text-hoop-orange" />
                    <span className="text-xs text-muted-foreground">{label}</span>
                  </button>
                ))}
              </div>
            )}

            <div className="border-t border-hoop-dark-border px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><kbd className="rounded border border-hoop-dark-border px-1">↑↓</kbd> Navigate</span>
                <span className="flex items-center gap-1"><kbd className="rounded border border-hoop-dark-border px-1">↵</kbd> Open</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
