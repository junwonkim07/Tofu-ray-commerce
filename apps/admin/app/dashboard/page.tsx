'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Package, MessageSquare, FileText, ArrowRight } from 'lucide-react'
import { adminOrderAPI, adminInquiryAPI, adminNoticeAPI } from '@/lib/api-client'
import AdminLayout from '@/components/admin-layout'

interface DashboardStats {
  orderCount: number
  inquiryCount: number
  noticeCount: number
  recentOrders: any[]
  recentInquiries: any[]
}

export default function DashboardPage() {
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats>({
    orderCount: 0,
    inquiryCount: 0,
    noticeCount: 0,
    recentOrders: [],
    recentInquiries: [],
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [orders, inquiries, notices] = await Promise.all([
          adminOrderAPI.getAll(),
          adminInquiryAPI.getAll(),
          adminNoticeAPI.getAll(),
        ])

        setStats({
          orderCount: orders.data?.length || 0,
          inquiryCount: inquiries.data?.length || 0,
          noticeCount: notices.data?.length || 0,
          recentOrders: (orders.data || []).slice(0, 5),
          recentInquiries: (inquiries.data || []).slice(0, 5),
        })
      } catch (err) {
        console.error('Failed to load stats:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadStats()
  }, [])

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">주문</CardTitle>
              <Package className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{isLoading ? '-' : stats.orderCount}</div>
              <p className="text-xs text-muted-foreground mt-1">총 주문 수</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">문의</CardTitle>
              <MessageSquare className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{isLoading ? '-' : stats.inquiryCount}</div>
              <p className="text-xs text-muted-foreground mt-1">총 문의 수</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">공지사항</CardTitle>
              <FileText className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{isLoading ? '-' : stats.noticeCount}</div>
              <p className="text-xs text-muted-foreground mt-1">총 공지사항 수</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>최근 주문</CardTitle>
              <CardDescription>가장 최근 주문 5건</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/orders">
                모두 보기 <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {stats.recentOrders.length === 0 ? (
              <p className="text-muted-foreground text-sm py-4">주문이 없습니다</p>
            ) : (
              <div className="space-y-4">
                {stats.recentOrders.map((order: any) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition"
                  >
                    <div>
                      <p className="font-mono font-semibold text-sm">{order.orderNumber}</p>
                      <p className="text-xs text-muted-foreground">{order.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">
                        {order.totalPrice.toLocaleString()} {order.currency}
                      </p>
                      <Badge variant={order.status === 'pending' ? 'secondary' : 'default'}>
                        {order.status === 'pending' ? '대기' : order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Inquiries */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>최근 문의</CardTitle>
              <CardDescription>가장 최근 문의 5건</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/inquiries">
                모두 보기 <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {stats.recentInquiries.length === 0 ? (
              <p className="text-muted-foreground text-sm py-4">문의가 없습니다</p>
            ) : (
              <div className="space-y-4">
                {stats.recentInquiries.map((inquiry: any) => (
                  <div
                    key={inquiry.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{inquiry.subject}</p>
                      <p className="text-xs text-muted-foreground">ID: {inquiry.id.slice(0, 8)}</p>
                    </div>
                    <Badge variant={inquiry.status === 'open' ? 'secondary' : 'default'}>
                      {inquiry.status === 'open' ? '오픈' : '해결됨'}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
