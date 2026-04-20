'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Search, Loader2, ArrowRight } from 'lucide-react'
import { adminInquiryAPI } from '@/lib/api-client'
import AdminLayout from '@/components/admin-layout'

interface Inquiry {
  id: string
  subject: string
  status: string
  createdAt: string
}

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

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

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      open: '미답변',
      closed: '답변완료',
    }
    return labels[status] || status
  }

  const getStatusVariant = (status: string) => {
    return status === 'open' ? 'secondary' : 'default'
  }

  const filteredInquiries = inquiries.filter((inquiry) =>
    inquiry.subject.includes(searchTerm) || inquiry.id.includes(searchTerm)
  )

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">문의 관리</h1>
          <p className="text-muted-foreground mt-1">
            총 {inquiries.length}건의 문의
          </p>
        </div>

        {/* Search Bar */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="제목이나 문의ID로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Inquiries Table */}
        <Card>
          <CardHeader>
            <CardTitle>문의 목록</CardTitle>
            <CardDescription>
              {filteredInquiries.length}건의 문의가 표시 중입니다
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">로드 중...</span>
              </div>
            ) : filteredInquiries.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">문의가 없습니다</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        제목
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        상태
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        작성일
                      </th>
                      <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                        작업
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInquiries.map((inquiry) => (
                      <tr
                        key={inquiry.id}
                        className="border-b transition-colors hover:bg-muted/50"
                      >
                        <td className="h-16 px-4 align-middle">
                          <div className="font-semibold text-sm">{inquiry.subject}</div>
                          <div className="text-xs text-muted-foreground">ID: {inquiry.id.slice(0, 8)}</div>
                        </td>
                        <td className="h-16 px-4 align-middle">
                          <Badge variant={getStatusVariant(inquiry.status)}>
                            {getStatusLabel(inquiry.status)}
                          </Badge>
                        </td>
                        <td className="h-16 px-4 align-middle">
                          <div className="text-sm text-muted-foreground">
                            {inquiry.createdAt}
                          </div>
                        </td>
                        <td className="h-16 px-4 align-middle text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className="gap-2"
                          >
                            <Link href={`/dashboard/inquiries/${inquiry.id}`}>
                              답변 <ArrowRight className="h-4 w-4" />
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
