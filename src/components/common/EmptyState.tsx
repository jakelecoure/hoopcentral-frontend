import { cn } from '@/lib/utils/cn'
import type { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon?: LucideIcon
  title?: string
  description?: string
  className?: string
  action?: React.ReactNode
}

export function EmptyState({ icon: Icon, title = 'No data', description, className, action }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 px-4 text-center', className)}>
      {Icon && (
        <div className="mb-4 rounded-full bg-hoop-dark-border p-4">
          <Icon className="h-8 w-8 text-muted-foreground" />
        </div>
      )}
      <h3 className="text-base font-semibold">{title}</h3>
      {description && <p className="mt-1 text-sm text-muted-foreground max-w-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
