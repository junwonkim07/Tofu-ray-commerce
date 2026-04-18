'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { adminInquiryAPI } from '@/lib/api-client'

interface Inquiry {
  id: string
  subject: string
  status: string
  createdAt: string
}

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadInquiries = async () => {
      setIsLoading(true)
      const result = await adminInquiryAPI.getAll()

      if (result.data) {
        const formatted = result.data.map((inquiry: any) => ({
          id: inquiry.id,
          subject: inquiry.subject,
          status: inquiry.status || 'open',
          createdAt: new Date(inquiry.createdAt).toLocaleString('ko-KR'),
        }))
        setInquiries(formatted)
      }
      setIsLoading(false)
    }

    loadInquiries()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'warning'
      case 'closed':
        return 'success'
      default:
        return 'default'
    }
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      open: '열림',
      closed: '닫힘',
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
          <h1 className="text-2xl font-bold">문의 관리</h1>
          <p className="text-muted-foreground mt-1">총 {inquiries.length}개의 문의</p>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : inquiries.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">문의가 없습니다.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {inquiries.map((inquiry) => (
              <Card key={inquiry.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-start justify-between space-y-0">
                  <div>
                    <CardTitle className="text-lg">{inquiry.subject}</CardTitle>
                    <CardDescription>문의 ID: {inquiry.id.slice(0, 8)}...</CardDescription>
                  </div>
                  <Badge variant={getStatusColor(inquiry.status) as any}>
                    {getStatusLabel(inquiry.status)}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">{inquiry.createdAt}</p>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/inquiries/${inquiry.id}`}>
                        답변하기
                      </Link>
                    </Button>
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
