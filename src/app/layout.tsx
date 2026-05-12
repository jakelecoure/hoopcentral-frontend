import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { Navbar } from '@/components/layout/Navbar'
import { LiveTicker } from '@/components/layout/LiveTicker'
import { Sidebar } from '@/components/layout/Sidebar'
import { Footer } from '@/components/layout/Footer'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: { default: 'HoopCentral — Live NBA Stats & Analytics', template: '%s | HoopCentral' },
  description: 'Real-time NBA scores, advanced analytics, player stats, team standings, and game logs. The next-generation basketball platform.',
  keywords: ['NBA', 'basketball', 'stats', 'analytics', 'scores', 'standings', 'players', 'teams'],
  authors: [{ name: 'HoopCentral' }],
  openGraph: {
    type: 'website',
    siteName: 'HoopCentral',
    title: 'HoopCentral — Live NBA Stats & Analytics',
    description: 'Real-time NBA scores, advanced analytics, and deep stats.',
  },
  twitter: { card: 'summary_large_image' },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#f97316',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-background antialiased">
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <LiveTicker />
            <div className="flex flex-1 overflow-hidden">
              <Sidebar />
              <main className="flex-1 min-w-0 overflow-x-hidden">
                {children}
              </main>
            </div>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}
