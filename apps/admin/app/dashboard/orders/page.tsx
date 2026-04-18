'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { adminOrderAPI } from '@/lib/api-client'

interface Order {
  id: string
  orderNumber: string
  email: string
  totalPrice: number
  currency: string
  status: string
  createdAt: string
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadOrders = async () => {
      setIsLoading(true)
      const result = await adminOrderAPI.getAll()

      if (result.data) {
        const formatted = result.data.map((order: any) => ({
          id: order.id,
          orderNumber: order.orderNumber,
          email: order.email,
          totalPrice: order.totalPrice,
          currency: order.currency || 'CNY',
          status: order.status || 'pending',
          createdAt: new Date(order.createdAt).toLocaleString('ko-KR'),
        }))
        setOrders(formatted)
      }
      setIsLoading(false)
    }

    loadOrders()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning'
      case 'completed':
        return 'success'
      case 'cancelled':
        return 'danger'
      default:
        return 'default'
    }
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: '대기중',
      completed: '완료',
      cancelled: '취소됨',
    }
    return labels[status] || status
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/dashboard" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              대시보드로 돌아가기
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">주문 관리</h1>
          <p className="text-muted-foreground mt-1">총 {orders.length}개의 주문</p>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">주문이 없습니다.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-start justify-between space-y-0">
                  <div>
                    <CardTitle className="text-lg">{order.orderNumber}</CardTitle>
                    <CardDescription>{order.email}</CardDescription>
                  </div>
                  <Badge variant={getStatusColor(order.status) as any}>
                    {getStatusLabel(order.status)}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">결제금액</p>
                      <p className="font-semibold">
                        {order.totalPrice.toLocaleString()} {order.currency}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">주문일시</p>
                      <p className="font-semibold">{order.createdAt}</p>
                    </div>
                    <div className="flex justify-end">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/dashboard/orders/${order.orderNumber}`}>
                          상세보기
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
