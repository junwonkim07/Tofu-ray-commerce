'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Loader2, Plus } from 'lucide-react'
import { adminNoticeAPI } from '@/lib/api-client'

interface Notice {
  id: string
  title: string
  content: string
  author: string
  createdAt: string
}

export default function NoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadNotices = async () => {
      setIsLoading(true)
      const result = await adminNoticeAPI.getAll()

      if (result.data) {
        const formatted = result.data.map((notice: any) => ({
          id: notice.id,
          title: notice.title,
          content: notice.content,
          author: notice.author || '관리자',
          createdAt: new Date(notice.createdAt).toLocaleString('ko-KR'),
        }))
        setNotices(formatted)
      }
      setIsLoading(false)
    }

    loadNotices()
  }, [])

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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">공지사항 관리</h1>
              <p className="text-muted-foreground mt-1">총 {notices.length}개의 공지사항</p>
            </div>
            <Button asChild>
              <Link href="/dashboard/notices/new">
                <Plus className="mr-2 h-4 w-4" />
                새 공지사항
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : notices.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground mb-4">공지사항이 없습니다.</p>
              <Button asChild>
                <Link href="/dashboard/notices/new">
                  <Plus className="mr-2 h-4 w-4" />
                  새 공지사항 작성
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {notices.map((notice) => (
              <Card key={notice.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{notice.title}</CardTitle>
                  <CardDescription>
                    {notice.author} · {notice.createdAt}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {notice.content}
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/notices/${notice.id}`}>
                        상세보기
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/notices/${notice.id}/edit`}>
                        수정
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
