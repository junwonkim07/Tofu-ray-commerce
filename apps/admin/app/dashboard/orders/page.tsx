'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { ArrowRight, Search, Loader2 } from 'lucide-react'
import { adminOrderAPI } from '@/lib/api-client'
import AdminLayout from '@/components/admin-layout'

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
  const [searchTerm, setSearchTerm] = useState('')

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

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending':
        return 'secondary'
      case 'confirmed':
        return 'default'
      case 'completed':
        return 'default'
      case 'cancelled':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: '대기 중',
      confirmed: '확인됨',
      completed: '완료',
      cancelled: '취소됨',
    }
    return labels[status] || status
  }

  const filteredOrders = orders.filter(
    (order) =>
      order.orderNumber.includes(searchTerm) ||
      order.email.includes(searchTerm)
  )

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">주문 관리</h1>
            <p className="text-muted-foreground mt-1">
              총 {orders.length}건의 주문
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="주문번호 또는 이메일로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>주문 목록</CardTitle>
            <CardDescription>
              {filteredOrders.length}건의 주문이 표시 중입니다
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">로드 중...</span>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">주문이 없습니다</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        주문번호
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        이메일
                      </th>
                      <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                        금액
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        상태
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        주문일시
                      </th>
                      <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                        작업
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="border-b transition-colors hover:bg-muted/50"
                      >
                        <td className="h-16 px-4 align-middle">
                          <div className="font-mono font-semibold text-sm">
                            {order.orderNumber}
                          </div>
                        </td>
                        <td className="h-16 px-4 align-middle">
                          <div className="text-sm">{order.email}</div>
                        </td>
                        <td className="h-16 px-4 align-middle text-right">
                          <div className="font-semibold">
                            {order.totalPrice.toLocaleString()} {order.currency}
                          </div>
                        </td>
                        <td className="h-16 px-4 align-middle">
                          <Badge variant={getStatusBadgeVariant(order.status)}>
                            {getStatusLabel(order.status)}
                          </Badge>
                        </td>
                        <td className="h-16 px-4 align-middle">
                          <div className="text-sm text-muted-foreground">
                            {order.createdAt}
                          </div>
                        </td>
                        <td className="h-16 px-4 align-middle text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className="gap-2"
                          >
                            <Link href={`/dashboard/orders/${order.orderNumber}`}>
                              상세보기 <ArrowRight className="h-4 w-4" />
                            </Link>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

