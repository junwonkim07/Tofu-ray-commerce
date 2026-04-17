'use client'

import { useEffect, useRef } from 'react'

export function TofuCharacter() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mousePos = useRef({ x: 0, y: 0 })
  const tofuPos = useRef({ x: 0, y: 0 })
  const eyePos = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Mouse tracking
    const container = canvas.parentElement
    if (!container) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      mousePos.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      }
    }

    container.addEventListener('mousemove', handleMouseMove)

    // Animation loop
    let animationId: number

    const animate = () => {
      ctx.fillStyle = 'transparent'
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Tofu position on the right side
      const targetX = canvas.width - 150
      const targetY = canvas.height / 2

      // Smooth movement towards target
      tofuPos.current.x += (targetX - tofuPos.current.x) * 0.03
      tofuPos.current.y += (targetY - tofuPos.current.y) * 0.03

      // Eye following mouse
      const dx = mousePos.current.x * canvas.width - tofuPos.current.x
      const dy = mousePos.current.y * canvas.height - tofuPos.current.y
      const angle = Math.atan2(dy, dx)

      eyePos.current.x = Math.cos(angle) * 8
      eyePos.current.y = Math.sin(angle) * 8

      drawTofu(ctx, tofuPos.current.x, tofuPos.current.y, eyePos.current.x, eyePos.current.y)

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      container.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animationId)
    }
  }, [])

  const drawTofu = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    eyeOffsetX: number,
    eyeOffsetY: number
  ) => {
    const width = 100
    const height = 120
    const radius = 12

    // 두부 그림자
    ctx.fillStyle = 'hsla(35, 70%, 30%, 0.1)'
    ctx.beginPath()
    ctx.ellipse(x, y + height / 2 + 15, width / 2 + 10, 8, 0, 0, Math.PI * 2)
    ctx.fill()

    // 두부 본체 - 그라데이션
    const gradient = ctx.createLinearGradient(x - width / 2, y - height / 2, x + width / 2, y + height / 2)
    gradient.addColorStop(0, 'hsla(35, 70%, 60%, 1)')
    gradient.addColorStop(0.5, 'hsla(35, 70%, 55%, 1)')
    gradient.addColorStop(1, 'hsla(35, 70%, 50%, 1)')

    ctx.fillStyle = gradient
    ctx.beginPath()
    // 둥근 네모 (rounded rectangle)
    ctx.moveTo(x - width / 2 + radius, y - height / 2)
    ctx.lineTo(x + width / 2 - radius, y - height / 2)
    ctx.quadraticCurveTo(x + width / 2, y - height / 2, x + width / 2, y - height / 2 + radius)
    ctx.lineTo(x + width / 2, y + height / 2 - radius)
    ctx.quadraticCurveTo(x + width / 2, y + height / 2, x + width / 2 - radius, y + height / 2)
    ctx.lineTo(x - width / 2 + radius, y + height / 2)
    ctx.quadraticCurveTo(x - width / 2, y + height / 2, x - width / 2, y + height / 2 - radius)
    ctx.lineTo(x - width / 2, y - height / 2 + radius)
    ctx.quadraticCurveTo(x - width / 2, y - height / 2, x - width / 2 + radius, y - height / 2)
    ctx.closePath()
    ctx.fill()

    // 두부 테두리
    ctx.strokeStyle = 'hsla(35, 70%, 45%, 0.6)'
    ctx.lineWidth = 2
    ctx.stroke()

    // 광택 효과
    ctx.fillStyle = 'hsla(35, 90%, 75%, 0.4)'
    ctx.beginPath()
    ctx.ellipse(x - 20, y - 30, 25, 20, -0.3, 0, Math.PI * 2)
    ctx.fill()

    // 왼쪽 눈
    const leftEyeX = x - 20
    const leftEyeY = y - 15
    drawEye(ctx, leftEyeX, leftEyeY, eyeOffsetX, eyeOffsetY)

    // 오른쪽 눈
    const rightEyeX = x + 20
    const rightEyeY = y - 15
    drawEye(ctx, rightEyeX, rightEyeY, eyeOffsetX, eyeOffsetY)

    // 입
    ctx.strokeStyle = 'hsla(35, 70%, 35%, 0.8)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(x, y + 15, 12, 0.2, Math.PI - 0.2, false)
    ctx.stroke()

    // 볼
    ctx.fillStyle = 'hsla(35, 60%, 60%, 0.3)'
    ctx.beginPath()
    ctx.ellipse(x - 40, y, 12, 10, 0, 0, Math.PI * 2)
    ctx.fill()

    ctx.beginPath()
    ctx.ellipse(x + 40, y, 12, 10, 0, 0, Math.PI * 2)
    ctx.fill()
  }

  const drawEye = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    offsetX: number,
    offsetY: number
  ) => {
    // 눈 흰자
    ctx.fillStyle = 'hsla(0, 0%, 100%, 0.9)'
    ctx.beginPath()
    ctx.arc(x, y, 10, 0, Math.PI * 2)
    ctx.fill()

    ctx.strokeStyle = 'hsla(35, 70%, 40%, 0.5)'
    ctx.lineWidth = 1
    ctx.stroke()

    // 동공
    ctx.fillStyle = 'hsla(35, 70%, 20%, 1)'
    ctx.beginPath()
    ctx.arc(x + offsetX * 1.5, y + offsetY * 1.5, 6, 0, Math.PI * 2)
    ctx.fill()

    // 눈 반짝임
    ctx.fillStyle = 'hsla(0, 0%, 100%, 0.6)'
    ctx.beginPath()
    ctx.arc(x + offsetX * 1.5 + 2, y + offsetY * 1.5 - 2, 2, 0, Math.PI * 2)
    ctx.fill()
  }

  return (
    <canvas
      ref={canvasRef}
      className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-full pointer-events-none"
      style={{
        zIndex: 1,
      }}
    />
  )
}
