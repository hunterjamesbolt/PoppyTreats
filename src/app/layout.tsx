import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { GoogleMapsProvider } from '@/contexts/GoogleMapsContext'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Poppy Treats - Find Cat Food & Treats Near You',
  description: 'Find Tiki Cat pate and Greenies treats for your feline friend at nearby pet stores',
  manifest: '/manifest.json',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#f17316',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Poppy Treats" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <GoogleMapsProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
          <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
            {children}
          </div>
        </GoogleMapsProvider>
      </body>
    </html>
  )
}