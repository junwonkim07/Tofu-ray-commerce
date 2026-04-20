'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/cart-context'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { CheckCircle, ArrowLeft, Copy, Check } from 'lucide-react'
import { orderAPI } from '@/lib/api-client'
import type { CheckoutForm } from '@tofu-ray/core'

const initialForm: CheckoutForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  postalCode: '',
  country: '대한민국',
}

type PaymentMethod = 'wechat' | 'alipay' | 'toss' | null

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, totalPrice } = useCart()
  const [form, setForm] = useState<CheckoutForm>(initialForm)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null)
  const [submitted, setSubmitted] = useState(false)
  const [orderNumber, setOrderNumber] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paymentConfirmed, setPaymentConfirmed] = useState(false)
  const [copiedBankAccount, setCopiedBankAccount] = useState(false)

  const shipping = 0
  const total = totalPrice + shipping
  const currency = cart.items.length > 0 ? cart.items[0].product.currency : 'CNY'

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleCopyBankAccount = () => {
    navigator.clipboard.writeText('1002433856199')
    setCopiedBankAccount(true)
    setTimeout(() => setCopiedBankAccount(false), 2000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    if (!paymentMethod) {
      setError('결제 방법을 선택해주세요')
      return
    }
    
    setIsLoading(true)

    try {
      const userId = localStorage.getItem('userId')
      const orderData = {
        userId: userId || null,
        items: cart.items,
        totalPrice,
        currency,
        email: form.email,
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        address: form.address,
        city: form.city,
        state: form.state,
        postalCode: form.postalCode,
        country: form.country,
      }

      const result = await orderAPI.create(orderData)

      if (result.error) {
        setError(result.error)
        setIsLoading(false)
        return
      }

      if (result.data) {
        localStorage.setItem('lastOrderNumber', result.data.orderNumber)
        localStorage.setItem('lastPaymentMethod', paymentMethod)
        setOrderNumber(result.data.orderNumber)
        setSubmitted(true)
      }
    } catch (err) {
      setError('주문 처리 중 오류가 발생했습니다')
      setIsLoading(false)
    }
  }

  if (submitted) {
    if (!paymentConfirmed) {
      return (
        <div className="container py-12">
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/products">
                  <ArrowLeft className="mr-2 h-4 w-4" /> 계속 쇼핑하기
                </Link>
              </Button>
            </div>

            <div className="border rounded-lg p-8 bg-card space-y-6">
              <div className="text-center space-y-2 mb-8">
                <h1 className="text-3xl font-bold">결제 정보 확인</h1>
                <p className="text-muted-foreground">주문번호: <span className="font-mono font-semibold">{orderNumber}</span></p>
              </div>

              {paymentMethod === 'wechat' && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold">WeChat Pay로 결제하기</h2>
                  <div className="flex justify-center p-6 bg-muted rounded-lg">
                    <Image
                      src="/weixinQR.svg"
                      alt="WeChat QR Code"
                      width={256}
                      height={256}
                      priority
                      className="w-64 h-64"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    위의 QR 코드를 WeChat으로 스캔하여 결제해주세요.
                  </p>
                </div>
              )}

              {paymentMethod === 'alipay' && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold">Alipay로 결제하기</h2>
                  <div className="flex justify-center p-6 bg-muted rounded-lg">
                    <Image
                      src="/zhifubaoQR.svg"
                      alt="Alipay QR Code"
                      width={256}
                      height={256}
                      priority
                      className="w-64 h-64"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    위의 QR 코드를 Alipay로 스캔하여 결제해주세요.
                  </p>
                </div>
              )}

              {paymentMethod === 'toss' && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold">토스뱅크 계좌로 결제하기</h2>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">은행</p>
                      <p className="text-xl font-semibold">토스뱅크</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">계좌번호</p>
                      <div className="flex items-center gap-2">
                        <p className="text-xl font-mono font-semibold">1002-433-856199</p>
                        <button
                          onClick={handleCopyBankAccount}
                          className="p-2 hover:bg-blue-100 rounded transition"
                          title="계좌번호 복사"
                        >
                          {copiedBankAccount ? (
                            <Check className="h-4 w-4 text-blue-600" />
                          ) : (
                            <Copy className="h-4 w-4 text-muted-foreground" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">예금주</p>
                      <p className="text-lg font-semibold">김준원</p>
                    </div>
                    <div className="pt-2 border-t">
                      <p className="text-sm font-medium text-muted-foreground mb-2">결제금액</p>
                      <p className="text-2xl font-bold">{formatPrice(total, currency)}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    위의 계좌로 입금해주세요. 입금 후 아래 "결제 완료" 버튼을 눌러주세요.
                  </p>
                </div>
              )}

              <Separator />

              <div className="space-y-3">
                <div className="text-sm">
                  <p className="font-medium mb-2">주문 정보</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>결제 금액: <span className="text-foreground font-semibold">{formatPrice(total, currency)}</span></li>
                    <li>결제 방법: <span className="text-foreground font-semibold capitalize">{paymentMethod === 'wechat' ? 'WeChat Pay' : paymentMethod === 'alipay' ? 'Alipay' : '토스뱅크'}</span></li>
                  </ul>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={() => setPaymentConfirmed(true)}
                  className="w-full"
                  size="lg"
                >
                  결제 완료
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSubmitted(false)}
                  className="w-full"
                  size="lg"
                >
                  결제 방법 변경
                </Button>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="container py-24 flex flex-col items-center justify-center text-center gap-6">
        <div className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">결제가 완료되었습니다</h1>
          <p className="text-muted-foreground mt-2 max-w-md">
            주문번호: <span className="font-mono font-semibold">{orderNumber}</span>
          </p>
          <p className="text-muted-foreground mt-4 max-w-md">
            결제 확인 후 마이페이지에서 구독 정보(VPN Subscription)를 확인하실 수 있습니다.
          </p>
        </div>
        <Button onClick={() => router.push('/mypage')} size="lg">
          마이페이지로 이동
        </Button>
      </div>
    )
  }

  if (cart.items.length === 0) {
    return (
      <div className="container py-24 flex flex-col items-center justify-center text-center gap-4">
        <h1 className="text-2xl font-bold">장바구니가 비어 있습니다</h1>
        <Button asChild>
          <Link href="/products">구독 상품 보기</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container py-12">
      <div className="mb-8">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/cart">
            <ArrowLeft className="mr-2 h-4 w-4" /> 장바구니로 돌아가기
          </Link>
        </Button>
        <h1 className="text-3xl font-bold mt-4">결제 정보 입력</h1>
      </div>

      <form onSubmit={handleSubmit}>
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500 text-red-600 rounded-lg">
            {error}
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="border rounded-lg p-6 bg-card space-y-4">
              <h2 className="text-lg font-semibold">연락처 정보</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">이름</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    required
                    placeholder="길동"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">성</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    required
                    placeholder="홍"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">이메일 주소</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="example@email.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">연락처</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="010-0000-0000"
                />
              </div>
            </div>

            <div className="border rounded-lg p-6 bg-card space-y-4">
              <h2 className="text-lg font-semibold">청구지 주소</h2>
              <div className="space-y-2">
                <Label htmlFor="address">상세 주소</Label>
                <Input
                  id="address"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  required
                  placeholder="서울시 강남구 ..."
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">도시</Label>
                  <Input
                    id="city"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    required
                    placeholder="서울"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">시/도</Label>
                  <Input
                    id="state"
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    placeholder="서울특별시"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="postalCode">우편번호</Label>
                  <Input
                    id="postalCode"
                    name="postalCode"
                    value={form.postalCode}
                    onChange={handleChange}
                    required
                    placeholder="12345"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">국가</Label>
                  <Input
                    id="country"
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    required
                    placeholder="대한민국"
                  />
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-6 bg-card space-y-4">
              <h2 className="text-lg font-semibold">결제 방법 선택</h2>
              <div className="space-y-3">
                <label className={lex items-center gap-4 p-4 border rounded-lg cursor-pointer transition \}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="wechat"
                    checked={paymentMethod === 'wechat'}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="w-4 h-4"
                  />
                  <div>
                    <p className="font-semibold">WeChat Pay</p>
                    <p className="text-sm text-muted-foreground">중국 위챗으로 결제</p>
                  </div>
                </label>

                <label className={lex items-center gap-4 p-4 border rounded-lg cursor-pointer transition \}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="alipay"
                    checked={paymentMethod === 'alipay'}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="w-4 h-4"
                  />
                  <div>
                    <p className="font-semibold">Alipay</p>
                    <p className="text-sm text-muted-foreground">알리페이로 결제</p>
                  </div>
                </label>

                <label className={lex items-center gap-4 p-4 border rounded-lg cursor-pointer transition \}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="toss"
                    checked={paymentMethod === 'toss'}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="w-4 h-4"
                  />
                  <div>
                    <p className="font-semibold">토스뱅크</p>
                    <p className="text-sm text-muted-foreground">1002-433-856199 (김준원)</p>
                  </div>
                </label>
              </div>
            </div>

            <div className="border rounded-lg p-6 bg-muted/30 space-y-2">
              <h2 className="text-lg font-semibold">결제 후 안내</h2>
              <p className="text-sm text-muted-foreground">
                결제 완료 후 <strong>마이페이지</strong>에서 주문 내역을 확인할 수 있습니다. 
                관리자가 결제를 확인하면 구독 정보(VPN 접속 정보)를 이메일로 전달해드립니다.
              </p>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="border rounded-lg p-6 bg-card space-y-4 sticky top-20">
              <h2 className="text-xl font-semibold">주문 요약</h2>
              <Separator />
              <div className="space-y-3">
                {cart.items.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-sm gap-2">
                    <span className="text-muted-foreground">
                      {item.product.title} <span className="text-xs">×{item.quantity}</span>
                    </span>
                    <span>{formatPrice(item.product.price * item.quantity, item.product.currency)}</span>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">상품 금액</span>
                  <span>{formatPrice(totalPrice, currency)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">배송료</span>
                  <span>{shipping === 0 ? '무료' : formatPrice(shipping, currency)}</span>
                </div>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>합계</span>
                <span>{formatPrice(total, currency)}</span>
              </div>
              <Button type="submit" className="w-full" size="lg" disabled={isLoading || !paymentMethod}>
                {isLoading ? '주문 처리 중...' : '다음: 결제 확인'}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
