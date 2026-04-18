'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LogOut, Package, MessageSquare, FileText } from 'lucide-react'
import { adminOrderAPI, adminInquiryAPI, adminNoticeAPI } from '@/lib/api-client'

export default function DashboardPage() {
  const router = useRouter()
  const [orderCount, setOrderCount] = useState(0)
  const [inquiryCount, setInquiryCount] = useState(0)
  const [noticeCount, setNoticeCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [orders, inquiries, notices] = await Promise.all([
          adminOrderAPI.getAll(),
          adminInquiryAPI.getAll(),
          adminNoticeAPI.getAll(),
        ])

        setOrderCount(orders.data?.length || 0)
        setInquiryCount(inquiries.data?.length || 0)
        setNoticeCount(notices.data?.length || 0)
      } catch (err) {
        console.error('Failed to load stats:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadStats()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminEmail')
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-tofu">Tofu-ray 관리자</h1>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            로그아웃
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Orders Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">주문</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? '-' : orderCount}</div>
              <p className="text-xs text-muted-foreground">총 주문 수</p>
            </CardContent>
          </Card>

          {/* Inquiries Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">문의</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? '-' : inquiryCount}</div>
              <p className="text-xs text-muted-foreground">총 문의 수</p>
            </CardContent>
          </Card>

          {/* Notices Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">공지사항</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? '-' : noticeCount}</div>
              <p className="text-xs text-muted-foreground">총 공지사항 수</p>
            </CardContent>
          </Card>
        </div>

        {/* Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                주문 관리
              </CardTitle>
              <CardDescription>주문 현황 조회 및 상태 관리</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={() => router.push('/dashboard/orders')}>
                주문 관리로 이동
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                문의 관리
              </CardTitle>
              <CardDescription>고객 문의 확인 및 답변</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={() => router.push('/dashboard/inquiries')}>
                문의 관리로 이동
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                공지사항 관리
              </CardTitle>
              <CardDescription>공지사항 작성 및 관리</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={() => router.push('/dashboard/notices')}>
                공지사항 관리로 이동
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
