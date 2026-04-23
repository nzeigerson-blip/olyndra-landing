import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Olyndra | Fintech for Entrepreneurs',
  description: 'The Fintech for Entrepreneurs Leading Global Agentic Commerce. Secure, fast, and intelligent financial solutions.',
  openGraph: {
    title: 'Olyndra | Fintech for Entrepreneurs',
    description: 'The Fintech for Entrepreneurs Leading Global Agency.',
    images: [
      {
        url: 'https://www.olyndra.ai/icon.svg', // Must be an absolute URL
        width: 800,
        height: 600,
        alt: 'Olyndra Logo',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
      </head>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
