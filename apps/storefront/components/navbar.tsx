'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/cart-context'
import { useAuth } from '@/lib/auth-context'
import { Package, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Navbar() {
  const router = useRouter()
  const { totalItems } = useCart()
  const { user, isAuthenticated, isLoading, logout } = useAuth()

  const handleLogout = () => {
    logout()
    router.push('/')
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex min-h-16 flex-wrap items-center justify-between gap-x-8 gap-y-2 py-2">
        <Link href="/" className="font-bold text-lg whitespace-nowrap flex items-center gap-2">
          <Package className="h-6 w-6 text-primary" />
          <span className="lacquer-regular">Tofu-ray</span>
        </Link>

        <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium">
          <Link href="/notice" className="text-muted-foreground hover:text-foreground transition-colors">
            공지사항
          </Link>
          <Link href="/mypage" className="text-muted-foreground hover:text-foreground transition-colors">
            마이페이지
          </Link>
          <Link href="/cart" className="text-muted-foreground hover:text-foreground transition-colors">
            장바구니 ({totalItems})
          </Link>
          <Link href="/search" className="text-muted-foreground hover:text-foreground transition-colors">
            검색
          </Link>
          <Link href="/inquiry" className="text-muted-foreground hover:text-foreground transition-colors">
            문의
          </Link>
          <div className="flex items-center gap-2 ml-2 pl-2 border-l border-border">
            {isLoading ? (
              <Button variant="ghost" size="sm" disabled>
                확인 중...
              </Button>
            ) : isAuthenticated && user ? (
              <>
                <span className="text-xs text-muted-foreground max-w-[140px] truncate" title={user.email}>
                  {user.email}
                </span>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-1" />
                  로그아웃
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">로그인</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/signup">회원가입</Link>
                </Button>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}
