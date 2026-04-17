import type { Metadata } from 'next'
import './globals.css'
import { CartProvider } from '@/lib/cart-context'
import { Navbar } from '@/components/navbar'

export const metadata: Metadata = {
  title: 'Tofu Ray Commerce',
  description: 'A modern e-commerce storefront built with Next.js and shadcn/ui',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <CartProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <footer className="border-t py-8 mt-16">
            <div className="container text-center text-sm text-muted-foreground">
              <p>© 2024 Tofu Ray Commerce. All rights reserved.</p>
            </div>
          </footer>
        </CartProvider>
      </body>
    </html>
  )
}
