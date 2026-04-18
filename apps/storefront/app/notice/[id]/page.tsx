'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft } from 'lucide-react'
import { noticeAPI } from '@/lib/api-client'

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

interface NoticeDetailPageProps {
  params: Promise<{ id: string }>
}

export default function NoticeDetailPage({ params }: NoticeDetailPageProps) {
  const resolvedParams = React.use(params)
  const [post, setPost] = useState<NoticePost | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [commentText, setCommentText] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const loadNotice = async () => {
      setIsLoading(true)
      const result = await noticeAPI.getById(resolvedParams.id)

      if (result.data) {
        const postData: NoticePost = {
          id: result.data.id,
          title: result.data.title,
          content: result.data.content,
          author: result.data.author || '관리자',
          createdAt: new Date(result.data.createdAt).toLocaleString('ko-KR'),
        }
        setPost(postData)

        const formattedComments = (result.data.comments || []).map((comment) => ({
          id: comment.id,
          author: comment.author,
          content: comment.content,
          createdAt: new Date(comment.createdAt).toLocaleString('ko-KR'),
        }))
        setComments(formattedComments)
      }
      setIsLoading(false)
    }

    loadNotice()
  }, [resolvedParams.id])

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentText.trim() || !post) return

    setIsSubmitting(true)
    try {
      const result = await noticeAPI.addComment(post.id, {
        author: '방문자',
        content: commentText.trim(),
      })

      if (result.data) {
        const newComment: Comment = {
          id: result.data.commentId,
          author: '방문자',
          content: commentText.trim(),
          createdAt: new Date().toLocaleString('ko-KR'),
        }
        setComments((prev) => [...prev, newComment])
        setCommentText('')
      }
    } catch (err) {
      console.error('Failed to add comment:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container py-12">
        <div className="text-center text-muted-foreground">로드 중...</div>
      </div>
    )
  }

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
              disabled={isSubmitting}
            />
            <Button type="submit" disabled={!commentText.trim() || isSubmitting}>
              {isSubmitting ? '등록 중...' : '등록'}
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
