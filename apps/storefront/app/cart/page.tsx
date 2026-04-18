'use client'

import Link from 'next/link'
import { useCart } from '@/lib/cart-context'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'

function getEnglishLabel(handle: string): string {
  const labelMap: Record<string, string> = {
    monthly: 'Monthly',
    quarterly: 'Quarterly',
    yearly: 'Yearly',
    'vpn-team-monthly': '5-account team',
  }
  return labelMap[handle] || handle
}

export default function CartPage() {
  const { cart, removeItem, updateQuantity, totalItems, totalPrice } = useCart()
  
  // Get currency from first item (assuming all items have same currency)
  const currency = cart.items.length > 0 ? cart.items[0].product.currency : 'CNY'

  if (cart.items.length === 0) {
    return (
      <div className="container py-24 flex flex-col items-center justify-center text-center gap-6">
        <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
          <ShoppingBag className="h-12 w-12 text-muted-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">장바구니가 비어 있습니다</h1>
          <p className="text-muted-foreground mt-2">구독 상품을 담은 뒤 결제를 진행해 주세요.</p>
        </div>
        <Button asChild size="lg">
          <Link href="/products">구독 상품 보러가기</Link>
        </Button>
      </div>
    )
  }

  const shipping = 0

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">장바구니 ({totalItems}개)</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <div key={item.product.id} className="flex gap-4 p-4 border rounded-lg bg-card">
              <div className="relative h-24 w-24 rounded-md overflow-hidden bg-gradient-to-br from-primary/20 to-primary/10 shrink-0 flex items-center justify-center p-3">
                <div className="text-center">
                  <h4 className="text-sm font-bold lacquer-regular text-primary leading-tight break-words">
                    {getEnglishLabel(item.product.handle)}
                  </h4>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold truncate">
                      <Link href={`/products/${item.product.handle}`} className="hover:underline">
                        {item.product.title}
                      </Link>
                    </h3>
                    <p className="text-sm text-muted-foreground">{item.product.category}</p>
                  </div>
                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
                    aria-label="상품 삭제"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <span className="font-semibold">
                    {formatPrice(item.product.price * item.quantity, item.product.currency)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="border rounded-lg p-6 bg-card space-y-4 sticky top-20">
            <h2 className="text-xl font-semibold">주문 요약</h2>
            <Separator />
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">상품 금액</span>
                <span>{formatPrice(totalPrice, currency)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">전달 수수료</span>
                <span>{shipping === 0 ? '무료' : formatPrice(shipping, currency)}</span>
              </div>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold text-lg">
              <span>합계</span>
              <span>{formatPrice(totalPrice + shipping, currency)}</span>
            </div>
            <Button className="w-full" size="lg" asChild>
              <Link href="/login?redirect=/checkout">
                결제 진행 <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/products">계속 쇼핑하기</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
