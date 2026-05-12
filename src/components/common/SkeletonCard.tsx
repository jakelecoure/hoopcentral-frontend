import { Skeleton } from '@/components/ui/skeleton'

export function SkeletonStatCards({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-xl border border-hoop-dark-border bg-hoop-dark-card p-4">
          <Skeleton className="mb-2 h-3 w-16" />
          <Skeleton className="h-7 w-20" />
        </div>
      ))}
    </div>
  )
}

export function SkeletonTable({ rows = 6, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="rounded-xl border border-hoop-dark-border bg-hoop-dark-card overflow-hidden">
      <div className="border-b border-hoop-dark-border px-4 py-3">
        <Skeleton className="h-4 w-40" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 px-4 py-3 border-b border-hoop-dark-border/50">
          {Array.from({ length: cols }).map((_, j) => (
            <Skeleton key={j} className="h-4 flex-1" style={{ maxWidth: j === 0 ? 160 : 60 }} />
          ))}
        </div>
      ))}
    </div>
  )
}

export function SkeletonGameCard() {
  return (
    <div className="rounded-xl border border-hoop-dark-border bg-hoop-dark-card p-4 space-y-3">
      <Skeleton className="h-3 w-20" />
      <div className="flex items-center justify-between">
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="space-y-1.5 text-right">
          <Skeleton className="h-6 w-8 ml-auto" />
          <Skeleton className="h-6 w-8 ml-auto" />
        </div>
      </div>
    </div>
  )
}

export function SkeletonPlayerHeader() {
  return (
    <div className="rounded-xl border border-hoop-dark-border bg-hoop-dark-card p-6">
      <div className="flex gap-6">
        <Skeleton className="h-24 w-24 rounded-full shrink-0" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-32" />
          <div className="flex gap-4 pt-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </div>
    </div>
  )
}
