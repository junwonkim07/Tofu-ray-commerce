'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { noticeAPI } from '@/lib/api-client'

interface NoticePost {
  id: string
  title: string
  content: string
  author: string
  createdAt: string
}

export default function NoticePage() {
  const [posts, setPosts] = useState<NoticePost[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadNotices = async () => {
      setIsLoading(true)
      const result = await noticeAPI.getAll()

      if (result.data) {
        // Format dates
        const formatted = result.data.map((notice) => ({
          id: notice.id,
          title: notice.title,
          content: notice.content,
          author: notice.author || '관리자',
          createdAt: new Date(notice.createdAt).toLocaleString('ko-KR'),
        }))
        setPosts(formatted)
      }
      setIsLoading(false)
    }

    loadNotices()
  }, [])

  if (isLoading) {
    return (
      <div className="container py-12 space-y-8">
        <div>
          <h1 className="text-3xl font-bold">공지사항</h1>
        </div>
        <div className="text-center text-muted-foreground">로드 중...</div>
      </div>
    )
  }

  return (
    <div className="container py-12 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">공지사항</h1>
        <p className="text-muted-foreground mt-2">
          총 {posts.length}개의 게시글
        </p>
      </div>

      <div>
        {posts.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            공지사항이 없습니다.
          </div>
        ) : (
          posts.map((post) => (
            <Link key={post.id} href={`/notice/${post.id}`} className="block mb-8">
              <article className="border rounded-lg bg-card p-6 space-y-4 hover:shadow-md transition-shadow cursor-pointer">
                <div>
                  <h3 className="text-xl font-semibold">{post.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {post.author} · {post.createdAt}
                  </p>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2">{post.content}</p>
              </article>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
