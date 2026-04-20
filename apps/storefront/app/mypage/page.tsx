'use client'

import Link from 'next/link'
import { useMemo, useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/lib/auth-context'
import { orderAPI } from '@/lib/api-client'
import { formatPrice } from '@/lib/utils'

const subscriptionInfo = {
  product: 'VPN Subscription - Premium',
  planType: '연간 구독',
  expiresAt: '2027-04-17',
  status: '활성',
}

type Order = {
  id: string
  userId: string | null
  orderNumber: string
  items: any[]
  totalPrice: number
  currency: string
  email: string
  firstName: string
  lastName: string
  status: string
  createdAt: string
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

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('ko-KR')
}

function getStatusBadgeColor(status: string) {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'confirmed':
      return 'bg-blue-100 text-blue-800'
    case 'completed':
      return 'bg-green-100 text-green-800'
    case 'cancelled':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case 'pending':
      return '결제 대기'
    case 'confirmed':
      return '결제 확인됨'
    case 'completed':
      return '완료'
    case 'cancelled':
      return '취소됨'
    default:
      return status
  }
}

export default function MyPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [ordersLoading, setOrdersLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated && user?.userId) {
      setOrdersLoading(true)
      orderAPI
        .getByUser(user.userId)
        .then((result) => {
          if (result.data) {
            setOrders(result.data)
          }
        })
        .catch((err) => console.error('Failed to load orders:', err))
        .finally(() => setOrdersLoading(false))
    }
  }, [isAuthenticated, user?.userId])

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

      <section className="border rounded-lg bg-card p-6 space-y-4">
        <h2 className="text-xl font-semibold">주문 내역</h2>
        {ordersLoading ? (
          <p className="text-muted-foreground">주문 내역을 불러오는 중...</p>
        ) : orders.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">주문 내역이 없습니다.</p>
            <Button asChild>
              <Link href="/products">상품 둘러보기</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <div key={order.id} className="border rounded-lg p-4 hover:bg-muted/50 transition">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-3">
                  <div>
                    <p className="font-mono font-semibold text-lg">{order.orderNumber}</p>
                    <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
                  </div>
                  <Badge className={getStatusBadgeColor(order.status)}>
                    {getStatusLabel(order.status)}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-3 pb-3 border-t">
                  <div>
                    <p className="text-muted-foreground">결제 금액</p>
                    <p className="font-semibold">{formatPrice(order.totalPrice, order.currency)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">구매자</p>
                    <p className="font-semibold">{order.firstName} {order.lastName}</p>
                  </div>
                </div>

                <div className="space-y-1 text-sm mb-3">
                  <p className="text-muted-foreground">주문 상품:</p>
                  <ul className="space-y-1">
                    {order.items && order.items.length > 0 ? (
                      order.items.map((item: any, index: number) => (
                        <li key={index} className="text-sm">
                          • {item.product?.title || item.title || '상품'} × {item.quantity}
                        </li>
                      ))
                    ) : (
                      <li className="text-muted-foreground text-xs">상품 정보 없음</li>
                    )}
                  </ul>
                </div>

                {order.status === 'pending' && (
                  <p className="text-xs text-orange-600 bg-orange-50 rounded px-2 py-1">
                    결제가 확인 중입니다. 최대 24시간이 소요될 수 있습니다.
                  </p>
                )}
                {order.status === 'confirmed' && (
                  <p className="text-xs text-blue-600 bg-blue-50 rounded px-2 py-1">
                    결제가 확인되었습니다. VPN 접속 정보가 이메일로 전송됩니다.
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
