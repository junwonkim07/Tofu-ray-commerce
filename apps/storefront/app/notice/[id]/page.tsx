'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft } from 'lucide-react'

interface NoticePost {
  id: string
  title: string
  content: string
  author: string
  createdAt: string
}

interface Comment {
  id: string
  author: string
  content: string
  createdAt: string
}

const initialPosts: NoticePost[] = [
  {
    id: 'n1',
    title: 'VPN 구독 발급 안내',
    content: '결제 후 문의 탭에서 주문번호를 남겨주시면 순차적으로 구독 링크를 전달해드립니다.',
    author: '관리자',
    createdAt: '2026-04-17 21:00',
  },
  {
    id: 'n2',
    title: '야간 서빙 안내',
    content: '야간에도 문의 남겨주시면 다음 영업일에 빠르게 처리합니다.',
    author: '관리자',
    createdAt: '2026-04-17 21:10',
  },
]

interface NoticeDetailPageProps {
  params: Promise<{ id: string }>
}

export default function NoticeDetailPage({ params }: NoticeDetailPageProps) {
  const resolvedParams = React.use(params)
  const post = initialPosts.find((p) => p.id === resolvedParams.id)

  const [comments, setComments] = useState<Comment[]>([
    {
      id: 'c1',
      author: '운영팀',
      content: '추가로 궁금한 점이 있으시면 문의 탭에서 연락주세요.',
      createdAt: '2026-04-17 21:10',
    },
  ])
  const [commentText, setCommentText] = useState('')

  if (!post) {
    return (
      <div className="container py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">게시글을 찾을 수 없습니다</h1>
          <Button asChild>
            <Link href="/notice">공지사항으로 돌아가기</Link>
          </Button>
        </div>
      </div>
    )
  }

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentText.trim()) return

    const newComment: Comment = {
      id: crypto.randomUUID(),
      author: '방문자',
      content: commentText.trim(),
      createdAt: new Date().toLocaleString('ko-KR'),
    }

    setComments((prev) => [...prev, newComment])
    setCommentText('')
  }

  return (
    <div className="container py-12 max-w-2xl">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/notice" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          뒤로가기
        </Link>
      </Button>

      <article className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
          <p className="text-sm text-muted-foreground">
            {post.author} · {post.createdAt}
          </p>
        </div>

        <div className="prose prose-invert max-w-none">
          <p className="text-base leading-relaxed whitespace-pre-wrap">{post.content}</p>
        </div>
      </article>

      <div className="mt-12 border-t pt-8 space-y-6">
        <h2 className="text-2xl font-bold">댓글 ({comments.length})</h2>

        <form onSubmit={handleAddComment} className="space-y-3">
          <div className="flex gap-2">
            <Input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="댓글을 입력하세요"
              className="flex-1"
            />
            <Button type="submit" disabled={!commentText.trim()}>
              등록
            </Button>
          </div>
        </form>

        <div className="space-y-3">
          {comments.map((comment) => (
            <div key={comment.id} className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">{comment.author}</span>
                <span className="text-xs text-muted-foreground">{comment.createdAt}</span>
              </div>
              <p className="text-sm leading-relaxed">{comment.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
