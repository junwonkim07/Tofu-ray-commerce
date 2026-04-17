'use client'

import Link from 'next/link'

interface NoticePost {
  id: string
  title: string
  content: string
  author: string
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

export default function NoticePage() {
  const posts = initialPosts

  return (
    <div className="container py-12 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">공지사항</h1>
        <p className="text-muted-foreground mt-2">
          총 {posts.length}개의 게시글
        </p>
      </div>

      <div>
        {posts.map((post) => (
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
        ))}
      </div>
    </div>
  )
}
