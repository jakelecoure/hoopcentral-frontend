'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Activity, Zap, Users, TrendingUp, Trophy, Calendar,
  ChevronRight, BarChart2,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { Separator } from '@/components/ui/separator'

const MAIN_NAV = [
  { href: '/',          label: 'Dashboard',  icon: Activity },
  { href: '/games',     label: 'Games',      icon: Zap },
  { href: '/teams',     label: 'Teams',      icon: Users },
  { href: '/players',   label: 'Players',    icon: TrendingUp },
  { href: '/standings', label: 'Standings',  icon: Trophy },
  { href: '/schedule',  label: 'Schedule',   icon: Calendar },
  { href: '/stats',     label: 'Stats Hub',  icon: BarChart2 },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden w-56 shrink-0 flex-col border-r border-hoop-dark-border bg-hoop-dark lg:flex">
      <div className="flex flex-col gap-1 p-3 pt-4">
        {MAIN_NAV.map((item) => {
          const active = pathname === item.href || (item.href !== '/' && (pathname ?? '').startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'group flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-all',
                active
                  ? 'bg-hoop-orange/10 text-hoop-orange'
                  : 'text-muted-foreground hover:bg-hoop-dark-hover hover:text-foreground',
              )}
            >
              <item.icon className={cn('h-4 w-4 shrink-0', active && 'text-hoop-orange')} />
              <span className="flex-1">{item.label}</span>
              {active && <ChevronRight className="h-3.5 w-3.5 text-hoop-orange" />}
            </Link>
          )
        })}
      </div>

      <Separator className="my-2" />

      <div className="px-4 pb-4">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Quick Links
        </p>
        <div className="space-y-1">
          {['NBA Leaders', 'Top Scorers', 'Rookie Rankings'].map((label) => (
            <button
              key={label}
              className="w-full rounded-md px-2 py-1.5 text-left text-xs text-muted-foreground hover:bg-hoop-dark-hover hover:text-foreground transition-colors"
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </aside>
  )
}
