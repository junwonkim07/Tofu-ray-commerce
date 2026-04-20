'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Check, AlertCircle } from 'lucide-react'
import { adminOrderAPI } from '@/lib/api-client'
import AdminLayout from '@/components/admin-layout'

interface OrderItem {
  product: {
    title: string
    handle: string
  }
  quantity: number
  price: number
  currency: string
}

interface OrderDetail {
  id: string
  orderNumber: string
  email: string
  firstName?: string
  lastName?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  postalCode?: string
  country?: string
  totalPrice: number
  currency: string
  status: string
  createdAt: string
  items: OrderItem[]
}

const STATUS_OPTIONS = [
  { value: 'pending', label: '결제 대기', color: 'secondary' },
  { value: 'confirmed', label: '결제 확인됨', color: 'default' },
  { value: 'completed', label: '완료', color: 'default' },
  { value: 'cancelled', label: '취소됨', color: 'destructive' },
]

function getStatusLabel(status: string) {
  const option = STATUS_OPTIONS.find((opt) => opt.value === status)
  return option ? option.label : status
}

function getStatusVariant(status: string) {
  const option = STATUS_OPTIONS.find((opt) => opt.value === status)
  return (option?.color as any) || 'secondary'
}

export default function OrderDetailPage() {
  const params = useParams<{ orderNumber: string }>()
  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [status, setStatus] = useState('pending')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    const loadOrder = async () => {
      setIsLoading(true)
      const result = await adminOrderAPI.getByNumber(params.orderNumber)

      if (result.data) {
        setOrder(result.data)
        setStatus(result.data.status || 'pending')
      } else if (result.error) {
        setError(result.error)
      }

      setIsLoading(false)
    }

    loadOrder()
  }, [params.orderNumber])

  const handleSave = async () => {
    if (!order) return
    setIsSaving(true)
    setError(null)
    setSuccessMessage(null)
    
    const result = await adminOrderAPI.updateStatus(order.orderNumber, status)
    if (result.error) {
      setError(result.error)
    } else {
      setOrder((prev) => (prev ? { ...prev, status } : prev))
      setSuccessMessage('주문 상태가 업데이트되었습니다.')
      setTimeout(() => setSuccessMessage(null), 3000)
    }
    setIsSaving(false)
  }

  return (
    <AdminLayout>
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">로딩 중...</p>
        </div>
      ) : error && !order ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            <p>{error || '주문을 찾을 수 없습니다.'}</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/dashboard/orders">목록으로</Link>
          </Button>
        </div>
      ) : order ? (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <Button variant="ghost" asChild className="mb-4">
                <Link href="/dashboard/orders" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  주문 목록
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl font-bold font-mono">{order.orderNumber}</h1>
                <p className="text-muted-foreground mt-1">{order.email}</p>
              </div>
            </div>
            <Badge variant={getStatusVariant(order.status)} className="text-base px-3 py-1">
              {getStatusLabel(order.status)}
            </Badge>
          </div>

          {/* Alerts */}
          {error && (
            <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              {error}
            </div>
          )}
          
          {successMessage && (
            <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
              <Check className="h-5 w-5 flex-shrink-0" />
              {successMessage}
            </div>
          )}

          {/* Order Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Shipping Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">배송 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase">이름</p>
                  <p className="text-sm font-semibold mt-1">
                    {order.firstName} {order.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase">연락처</p>
                  <p className="text-sm font-semibold mt-1">{order.phone || '-'}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase">이메일</p>
                  <p className="text-sm font-semibold mt-1">{order.email}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase">주소</p>
                  <p className="text-sm font-semibold mt-1">
                    {[order.address, order.city, order.state, order.postalCode, order.country]
                      .filter(Boolean)
                      .join(' ') || '-'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Payment Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">결제 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase">결제 금액</p>
                  <p className="text-2xl font-bold mt-1">
                    {order.totalPrice.toLocaleString()} {order.currency}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase">주문일시</p>
                  <p className="text-sm font-semibold mt-1">
                    {order.createdAt ? new Date(order.createdAt).toLocaleString('ko-KR') : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase">상품 수</p>
                  <p className="text-sm font-semibold mt-1">
                    {order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0}개
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>주문 상품 목록</CardTitle>
            </CardHeader>
            <CardContent>
              {order.items && order.items.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                          상품명
                        </th>
                        <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground">
                          수량
                        </th>
                        <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                          단가
                        </th>
                        <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                          합계
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map((item, index) => (
                        <tr key={index} className="border-b">
                          <td className="h-16 px-4 align-middle">
                            <p className="font-semibold">
                              {item.product?.title || item.product?.handle || '상품'}
                            </p>
                          </td>
                          <td className="h-16 px-4 align-middle text-center">
                            {item.quantity}개
                          </td>
                          <td className="h-16 px-4 align-middle text-right">
                            {item.price.toLocaleString()} {item.currency}
                          </td>
                          <td className="h-16 px-4 align-middle text-right">
                            <p className="font-semibold">
                              {(item.price * item.quantity).toLocaleString()} {item.currency}
                            </p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted-foreground">상품이 없습니다.</p>
              )}
            </CardContent>
          </Card>

          {/* Status Management */}
          <Card>
            <CardHeader>
              <CardTitle>주문 상태 관리</CardTitle>
              <CardDescription>주문 상태를 변경하고 저장할 수 있습니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">상태</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  disabled={isSaving}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <Button
                onClick={handleSave}
                disabled={isSaving || status === order.status}
                size="lg"
                className="w-full"
              >
                {isSaving ? '저장 중...' : '상태 저장'}
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </AdminLayout>
  )
}

export default function OrderDetailPage() {
  const params = useParams<{ orderNumber: string }>()
  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [status, setStatus] = useState('pending')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
