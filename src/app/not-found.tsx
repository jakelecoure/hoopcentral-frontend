import Link from 'next/link'
import { Home, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="mb-6 text-8xl font-black text-hoop-orange opacity-20">404</div>
      <h1 className="text-2xl font-black mb-2">Page Not Found</h1>
      <p className="text-muted-foreground mb-8 max-w-sm">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="flex gap-3">
        <Button variant="orange" asChild>
          <Link href="/">
            <Home className="h-4 w-4 mr-2" />
            Go Home
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/search">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Link>
        </Button>
      </div>
    </div>
  )
}
