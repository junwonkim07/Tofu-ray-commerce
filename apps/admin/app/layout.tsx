import type { Metadata } from 'next'
import './globals.css'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Tofu-ray Management',
  description: 'Tofu Ray Admin Dashboard',
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="ko" className="dark">
      <body className="min-h-screen bg-background text-foreground">
        {children}
      </body>
    </html>
  )
}
