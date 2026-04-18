'use client'

import { useState, useEffect } from 'react'
import { useCart } from '@/lib/cart-context'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { inquiryAPI } from '@/lib/api-client'

type InquiryMode = 'chat' | 'wechat'

interface TextMessage {
  id: string
  sender: 'user' | 'admin'
  type: 'text'
  text: string
}

interface OrderMessage {
  id: string
  sender: 'admin'
  type: 'order'
  items: Array<{
    label: string
    quantity: number
    price: number
    currency: string
  }>
  total: number
  totalCurrency: string
}

type Message = TextMessage | OrderMessage

function getEnglishLabel(handle: string): string {
  const labelMap: Record<string, string> = {
    monthly: 'Monthly',
    quarterly: 'Quarterly',
    yearly: 'Yearly',
    'vpn-team-monthly': '5-account team',
  }
  return labelMap[handle] || handle
}

export default function InquiryPage() {
  const { cart } = useCart()
  const [mode, setMode] = useState<InquiryMode>('chat')
  const [messages, setMessages] = useState<Message[]>([])
  const [draft, setDraft] = useState('')
  const [inquiryId, setInquiryId] = useState<string | null>(null)
  const [isSending, setIsSending] = useState(false)

  // Initialize messages with cart info
  useEffect(() => {
    const initializeInquiry = async () => {
      const userId = localStorage.getItem('userId')
      const lastOrderNumber = localStorage.getItem('lastOrderNumber')

      // Create or get inquiry
      let currentInquiryId = inquiryId
      if (!currentInquiryId && userId) {
        const result = await inquiryAPI.create({
          userId,
          subject: `Order: ${lastOrderNumber || 'General Inquiry'}`,
          initialMessage: null,
        })

        if (result.data) {
          currentInquiryId = result.data.inquiryId
          setInquiryId(currentInquiryId)
        }
      }

      const initialMessages: Message[] = [
        {
          id: 'm0',
          sender: 'admin',
          type: 'text',
          text: '안녕하세요! 구독을 원하신 상품 정보를 확인했습니다. 아래 정보로 구독을 진행하시겠습니까?',
        },
      ]

      if (cart.items.length > 0) {
        const orderItems = cart.items.map((item) => ({
          label: getEnglishLabel(item.product.handle),
          quantity: item.quantity,
          price: item.product.price,
          currency: item.product.currency,
        }))

        const totalAmount = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

        const cartMessage: OrderMessage = {
          id: 'cart-info',
          sender: 'admin',
          type: 'order',
          items: orderItems,
          total: totalAmount,
          totalCurrency: cart.items[0]?.product.currency || 'CNY',
        }
        initialMessages.push(cartMessage)

        initialMessages.push({
          id: 'm1',
          sender: 'admin',
          type: 'text',
          text: '위 상품에 대해 구독 발급을 진행하겠습니다. 구독 링크와 접속 정보는 이메일로 발송될 예정입니다.',
        })
      } else {
        initialMessages.push({
          id: 'm1',
          sender: 'admin',
          type: 'text',
          text: '주문번호 또는 구독을 원하시는 상품을 알려주세요.',
        })
      }

      setMessages(initialMessages)
    }

    initializeInquiry()
  }, [cart])

  const sendMessage = async () => {
    const content = draft.trim()
    if (!content || !inquiryId || isSending) return

    setIsSending(true)

    try {
      // Send message to API
      const result = await inquiryAPI.addMessage(inquiryId, {
        sender: 'user',
        content,
        messageType: 'text',
      })

      if (result.error) {
        console.error('Failed to send message:', result.error)
        setIsSending(false)
        return
      }

      const userMessage: TextMessage = {
        id: result.data?.messageId || crypto.randomUUID(),
        sender: 'user',
        type: 'text',
        text: content,
      }

      const adminReply: TextMessage = {
        id: crypto.randomUUID(),
        sender: 'admin',
        type: 'text',
        text: '확인했습니다. 결제 내역 확인 후 VPN 구독 종류/만료일/접속 링크를 전달드리겠습니다.',
      }

      setMessages((prev) => [...prev, userMessage, adminReply])
      setDraft('')
    } catch (err) {
      console.error('Error sending message:', err)
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="container py-12 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">문의</h1>
        <p className="text-muted-foreground mt-2">
          자체 채팅 또는 위챗 문의 중 편한 방식을 선택해서 구독 발급을 요청하세요.
        </p>
      </div>

      <div className="flex gap-2">
        <Button variant={mode === 'chat' ? 'default' : 'outline'} onClick={() => setMode('chat')}>
          자체 채팅 문의
        </Button>
        <Button variant={mode === 'wechat' ? 'default' : 'outline'} onClick={() => setMode('wechat')}>
          위챗 문의
        </Button>
      </div>

      {mode === 'chat' ? (
        <section className="border rounded-lg bg-card p-4 space-y-4">
          <div className="space-y-2 max-h-[500px] overflow-auto pr-1">
            {messages.map((message) => {
              if (message.type === 'text') {
                return (
                  <div
                    key={message.id}
                    className={`rounded-md px-3 py-2 text-sm whitespace-pre-wrap w-fit max-w-[80%] ${
                      message.sender === 'user'
                        ? 'ml-auto bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground'
                    }`}
                  >
                    {message.text}
                  </div>
                )
              } else if (message.type === 'order') {
                return (
                  <div key={message.id} className="w-full flex justify-start">
                    <Card className="w-full max-w-2xl border-muted-foreground/30">
                      <CardContent className="p-6 space-y-4">
                        <h3 className="font-semibold text-base">📦 주문 정보</h3>
                        <div className="space-y-3">
                          {message.items.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{item.label}</span>
                                <Badge variant="secondary" className="text-xs">
                                  ×{item.quantity}
                                </Badge>
                              </div>
                              <span className="font-semibold">
                                {formatPrice(item.price * item.quantity, item.currency)}
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className="border-t pt-3 flex justify-between items-center font-semibold text-base">
                          <span>총액</span>
                          <span className="text-primary text-lg">
                            {formatPrice(message.total, message.totalCurrency)}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )
              }
            })}
          </div>
          <div className="flex gap-2">
            <Input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="주문번호 또는 문의 내용을 입력하세요"
              disabled={!inquiryId || isSending}
            />
            <Button type="button" onClick={sendMessage} disabled={!inquiryId || isSending || !draft.trim()}>
              {isSending ? '전송 중...' : '전송'}
            </Button>
          </div>
        </section>
      ) : (
        <section className="border rounded-lg bg-card p-6 space-y-3">
          <h2 className="text-xl font-semibold">위챗 문의 안내</h2>
          <p className="text-sm text-muted-foreground">
            아래 위챗 ID로 연락 주시면 결제 확인 후 구독 정보와 접속 링크를 보내드립니다.
          </p>
          <div className="rounded-md border bg-background p-4 text-sm space-y-1">
            <p>
              <span className="text-muted-foreground">WeChat ID:</span> tofuray_support
            </p>
            <p>
              <span className="text-muted-foreground">운영시간:</span> 10:00 - 22:00 (KST)
            </p>
            <p>
              <span className="text-muted-foreground">안내:</span> 주문번호를 함께 전달해 주세요.
            </p>
          </div>
        </section>
      )}
    </div>
  )
}
