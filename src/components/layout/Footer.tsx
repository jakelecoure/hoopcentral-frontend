import Link from 'next/link'
import { Separator } from '@/components/ui/separator'

export function Footer() {
  return (
    <footer className="border-t border-hoop-dark-border bg-hoop-dark-card mt-auto">
      <div className="mx-auto max-w-screen-2xl px-4 py-8 lg:px-6">
        <div className="grid gap-6 sm:grid-cols-3">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-hoop-orange font-black text-white text-xs">
                HC
              </span>
              <span className="font-bold">
                Hoop<span className="text-hoop-orange">Central</span>
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Next-generation basketball analytics and live data platform.
            </p>
          </div>
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Explore</p>
            <div className="flex flex-col gap-2">
              {[
                ['/games',     'Games'],
                ['/teams',     'Teams'],
                ['/players',   'Players'],
                ['/standings', 'Standings'],
                ['/schedule',  'Schedule'],
              ].map(([href, label]) => (
                <Link key={href} href={href} className="text-xs text-muted-foreground hover:text-hoop-orange transition-colors">
                  {label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Data</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Stats powered by FastAPI + Supabase backend. Live updates via WebSocket.
            </p>
          </div>
        </div>
        <Separator className="my-6" />
        <p className="text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} HoopCentral. All stats for informational purposes.
        </p>
      </div>
    </footer>
  )
}
