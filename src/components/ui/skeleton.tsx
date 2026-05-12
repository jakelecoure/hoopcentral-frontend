import { cn } from '@/lib/utils/cn'

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-md bg-hoop-dark-border',
        'before:absolute before:inset-0 before:bg-gradient-to-r',
        'before:from-transparent before:via-white/5 before:to-transparent',
        'before:animate-shimmer before:bg-[length:1000px_100%]',
        className,
      )}
      {...props}
    />
  )
}

export { Skeleton }
