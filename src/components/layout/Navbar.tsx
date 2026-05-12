'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Menu, X, Search, Bell, ChevronDown,
  Activity, Users, Trophy, Calendar, TrendingUp, Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useLeague } from '@/lib/hooks/useLeague'
import { GlobalSearch } from '@/components/search/GlobalSearch'
import type { League } from '@/types'

const NAV_LINKS = [
  { href: '/',          label: 'Home',      icon: Activity },
  { href: '/games',     label: 'Games',     icon: Zap },
  { href: '/teams',     label: 'Teams',     icon: Users },
  { href: '/players',   label: 'Players',   icon: TrendingUp },
  { href: '/standings', label: 'Standings', icon: Trophy },
  { href: '/schedule',  label: 'Schedule',  icon: Calendar },
]

const LEAGUES: { id: League; label: string }[] = [
  { id: 'nba',  label: 'NBA' },
  { id: 'wnba', label: 'WNBA' },
]

export function Navbar() {
  const pathname = usePathname()
  const { league, setLeague } = useLeague()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [leagueOpen, setLeagueOpen] = useState(false)

  return (
    <>
      <nav className="sticky top-0 z-40 border-b border-hoop-dark-border bg-hoop-dark/95 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-screen-2xl items-center gap-4 px-4 lg:px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-hoop-orange font-black text-white text-sm">
              HC
            </span>
            <span className="hidden font-bold text-foreground sm:block">
              Hoop<span className="text-hoop-orange">Central</span>
            </span>
          </Link>

          {/* League selector */}
          <div className="relative shrink-0">
            <button
              onClick={() => setLeagueOpen(!leagueOpen)}
              className="flex items-center gap-1.5 rounded-md border border-hoop-dark-border bg-hoop-dark-card px-2.5 py-1 text-xs font-semibold text-foreground hover:border-hoop-orange/40 transition-colors"
            >
              {league.toUpperCase()}
              <ChevronDown className={cn('h-3 w-3 transition-transform', leagueOpen && 'rotate-180')} />
            </button>
            <AnimatePresence>
              {leagueOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="absolute left-0 top-full mt-1.5 w-24 rounded-lg border border-hoop-dark-border bg-hoop-dark-card py-1 shadow-2xl"
                >
                  {LEAGUES.map((l) => (
                    <button
                      key={l.id}
                      onClick={() => { setLeague(l.id); setLeagueOpen(false) }}
                      className={cn(
                        'w-full px-3 py-2 text-left text-xs font-medium hover:bg-hoop-dark-hover transition-colors',
                        league === l.id && 'text-hoop-orange',
                      )}
                    >
                      {l.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Desktop nav links */}
          <div className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href || (link.href !== '/' && (pathname ?? '').startsWith(link.href))
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                    active
                      ? 'bg-hoop-orange/10 text-hoop-orange'
                      : 'text-muted-foreground hover:bg-hoop-dark-hover hover:text-foreground',
                  )}
                >
                  <link.icon className="h-3.5 w-3.5" />
                  {link.label}
                </Link>
              )
            })}
          </div>

          {/* Right side */}
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 rounded-md border border-hoop-dark-border bg-hoop-dark-card px-3 py-1.5 text-sm text-muted-foreground hover:border-hoop-orange/40 hover:text-foreground transition-colors"
              aria-label="Search"
            >
              <Search className="h-3.5 w-3.5" />
              <span className="hidden sm:block">Search...</span>
              <kbd className="hidden rounded border border-hoop-dark-border px-1.5 py-0.5 text-xs sm:block">⌘K</kbd>
            </button>

            <Button variant="ghost" size="icon" className="relative hidden sm:flex">
              <Bell className="h-4 w-4" />
              <Badge variant="live" className="absolute -right-0.5 -top-0.5 h-4 w-4 p-0 text-[9px] flex items-center justify-center">
                3
              </Badge>
            </Button>

            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile nav */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-t border-hoop-dark-border bg-hoop-dark lg:hidden"
            >
              <div className="flex flex-col gap-1 p-3">
                {NAV_LINKS.map((link) => {
                  const active = pathname === link.href || (link.href !== '/' && (pathname ?? '').startsWith(link.href))
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        'flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                        active
                          ? 'bg-hoop-orange/10 text-hoop-orange'
                          : 'text-muted-foreground hover:bg-hoop-dark-hover hover:text-foreground',
                      )}
                    >
                      <link.icon className="h-4 w-4" />
                      {link.label}
                    </Link>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Search overlay */}
      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
