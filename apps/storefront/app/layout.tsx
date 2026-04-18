import type { Metadata } from 'next'
import './globals.css'
import { CartProvider } from '@/lib/cart-context'
import { AuthProvider } from '@/lib/auth-context'
import { Navbar } from '@/components/navbar'

export const metadata: Metadata = {
  title: 'Tofu-ray',
  description: 'VLESS shop.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="dark">
      <body className="font-sans antialiased" suppressHydrationWarning>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <footer className="border-t py-8 mt-16">
              <div className="container text-center text-sm text-muted-foreground">
                <p>© 2026 Junwon Kim. All rights reserved.</p>
              </div>
            </footer>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
