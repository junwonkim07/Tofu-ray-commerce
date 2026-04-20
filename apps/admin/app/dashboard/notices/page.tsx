'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, Plus, ArrowRight, Search, Trash2 } from 'lucide-react'
import { adminNoticeAPI } from '@/lib/api-client'
import AdminLayout from '@/components/admin-layout'

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
  const [searchTerm, setSearchTerm] = useState('')

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

  const filteredNotices = notices.filter((notice) =>
    notice.title.includes(searchTerm) || notice.content.includes(searchTerm)
  )

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">공지사항 관리</h1>
            <p className="text-muted-foreground mt-1">
              총 {notices.length}건의 공지사항
            </p>
          </div>
          <Button asChild>
            <Link href="/dashboard/notices/new" className="gap-2">
              <Plus className="h-4 w-4" />
              새 공지사항
            </Link>
          </Button>
        </div>

        {/* Search Bar */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="제목이나 내용으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Notices Table */}
        <Card>
          <CardHeader>
            <CardTitle>공지사항 목록</CardTitle>
            <CardDescription>
              {filteredNotices.length}건의 공지사항이 표시 중입니다
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">로드 중...</span>
              </div>
            ) : filteredNotices.length === 0 ? (
              <div className="py-12 text-center space-y-4">
                <p className="text-muted-foreground">공지사항이 없습니다</p>
                <Button asChild>
                  <Link href="/dashboard/notices/new" className="gap-2">
                    <Plus className="h-4 w-4" />
                    새 공지사항 작성
                  </Link>
                </Button>
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
                        작성자
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
                    {filteredNotices.map((notice) => (
                      <tr
                        key={notice.id}
                        className="border-b transition-colors hover:bg-muted/50"
                      >
                        <td className="h-16 px-4 align-middle">
                          <div className="font-semibold text-sm">{notice.title}</div>
                          <div className="text-xs text-muted-foreground line-clamp-1">
                            {notice.content}
                          </div>
                        </td>
                        <td className="h-16 px-4 align-middle">
                          <div className="text-sm">{notice.author}</div>
                        </td>
                        <td className="h-16 px-4 align-middle">
                          <div className="text-sm text-muted-foreground">
                            {notice.createdAt}
                          </div>
                        </td>
                        <td className="h-16 px-4 align-middle text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              asChild
                            >
                              <Link href={`/dashboard/notices/${notice.id}/edit`}>
                                수정
                              </Link>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
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
