'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'

interface StatCardProps {
  label: string
  value: string | number
  sub?: string
  accent?: boolean
  trend?: 'up' | 'down' | 'neutral'
  className?: string
  animate?: boolean
}

export function StatCard({ label, value, sub, accent, trend, className, animate = true }: StatCardProps) {
  const trendColor = trend === 'up' ? 'text-hoop-win' : trend === 'down' ? 'text-hoop-loss' : 'text-muted-foreground'

  const content = (
    <div
      className={cn(
        'flex flex-col gap-1 rounded-xl border border-hoop-dark-border bg-hoop-dark-card p-4',
        accent && 'border-hoop-orange/30 bg-hoop-orange/5',
        'hover:border-hoop-dark-border/80 hover:bg-hoop-dark-hover transition-colors',
        className,
      )}
    >
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={cn('text-2xl font-bold tabular-nums leading-none', accent && 'text-hoop-orange')}>
        {value}
      </p>
      {sub && (
        <p className={cn('text-xs', trendColor)}>
          {trend === 'up' && '↑ '}
          {trend === 'down' && '↓ '}
          {sub}
        </p>
      )}
    </div>
  )

  if (!animate) return content

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {content}
    </motion.div>
  )
}

export function StatRow({
  label,
  value,
  highlight,
}: {
  label: string
  value: string | number | undefined | null
  highlight?: boolean
}) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={cn('text-sm font-semibold tabular-nums', highlight && 'text-hoop-orange')}>
        {value ?? '—'}
      </span>
    </div>
  )
}
