'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth-context'

const subscriptionInfo = {
  product: 'VPN Subscription - Premium',
  planType: '연간 구독',
  expiresAt: '2027-04-17',
  status: '활성',
}

function formatLastLogin(value: string | null) {
  if (!value) {
    return '기록 없음'
  }

  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return value
  }

  return parsed.toLocaleString('ko-KR')
}

export default function MyPage() {
  const { user, isAuthenticated, isLoading } = useAuth()

  const loginInfo = useMemo(
    () => ({
      id: user?.userId ? user.userId.slice(0, 8) : '-',
      email: user?.email || '-',
      lastLogin:
        typeof window !== 'undefined'
          ? formatLastLogin(localStorage.getItem('lastLoginAt'))
          : '기록 없음',
    }),
    [user]
  )

  if (isLoading) {
    return (
      <div className="container py-12">
        <p className="text-muted-foreground">로그인 상태를 확인하는 중입니다...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="container py-12 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">마이페이지</h1>
          <p className="text-muted-foreground mt-2">로그인 후 계정 및 구독 정보를 확인할 수 있습니다.</p>
        </div>
        <div className="border rounded-lg bg-card p-6 space-y-4">
          <p className="text-sm text-muted-foreground">현재 로그인되어 있지 않습니다.</p>
          <Button asChild>
            <Link href="/login?redirect=/mypage">로그인하러 가기</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-12 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">마이페이지</h1>
        <p className="text-muted-foreground mt-2">현재 로그인 정보와 VPN 구독 정보를 확인할 수 있습니다.</p>
      </div>

      <section className="border rounded-lg bg-card p-6 space-y-3">
        <h2 className="text-xl font-semibold">로그인 정보</h2>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-muted-foreground">아이디</dt>
            <dd className="font-medium">{loginInfo.id}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">이메일</dt>
            <dd className="font-medium">{loginInfo.email}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">최근 로그인</dt>
            <dd className="font-medium">{loginInfo.lastLogin}</dd>
          </div>
        </dl>
      </section>

      <section className="border rounded-lg bg-card p-6 space-y-3">
        <h2 className="text-xl font-semibold">구독 정보 (VPN Subscription)</h2>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-muted-foreground">구독 종류</dt>
            <dd className="font-medium">{subscriptionInfo.planType}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">상품명</dt>
            <dd className="font-medium">{subscriptionInfo.product}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">만료일</dt>
            <dd className="font-medium">{subscriptionInfo.expiresAt}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">상태</dt>
            <dd className="font-medium">{subscriptionInfo.status}</dd>
          </div>
        </dl>
      </section>
    </div>
  )
}
