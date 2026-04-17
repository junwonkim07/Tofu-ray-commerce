import Link from 'next/link'
import { mockProducts } from '@tofu-ray/core'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/components/product-card'
import { GradientGlow } from '@/components/gradient-glow'
import { ArrowRight, MessageCircle, Shield, KeyRound } from 'lucide-react'

export default function HomePage() {
  const featuredProducts = mockProducts.slice(0, 3)

  return (
    <div>
      <section className="relative bg-muted/30 min-h-screen flex items-center overflow-hidden">
        <GradientGlow />
        <div className="container flex flex-col items-start justify-center gap-6 py-24 relative z-10">
          <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
            
          </span>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight max-w-3xl lacquer-regular">
            
            <span className="text-primary">Tofu-ray</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl text-left">
           
            </p>
            <p className="text-left">
            빠르고 안정적인 VPN 구독 서비스 입니다.
          </p>
          <div className="flex gap-4 flex-wrap justify-start">
            <Button size="lg" asChild>
              <Link href="/products">
                구독 상품 보기 <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/inquiry">문의 바로가기</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-12 border-y">
        <div className="container grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">안전한 네트워크</h3>
              <p className="text-sm text-muted-foreground">VLESS + Reality 프로토콜</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <KeyRound className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">간편한 계정 발급</h3>
              <p className="text-sm text-muted-foreground">구매 후 문의에서 계정 안내</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <MessageCircle className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">실시간 상담</h3>
              <p className="text-sm text-muted-foreground">자체 채팅 또는 위챗으로 문의 가능</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold">구독제</h2>
            </div>
            <Button variant="ghost" asChild>
              <Link href="/products">
                전체 보기 <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">문의 방법</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-lg mx-auto">
            결제 완료 후 문의 탭에서 주문번호를 알려주시면, 관리자가 구독 정보와 접속 링크를
            전달해드립니다.
          </p>
          <Button
            size="lg"
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
            asChild
          >
            <Link href="/inquiry">문의 시작하기</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
