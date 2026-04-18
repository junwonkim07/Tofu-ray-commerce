'use client'

import { useEffect, useRef } from 'react'

export function GlobeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mousePos = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY }
    }

    window.addEventListener('mousemove', handleMouseMove)

    // Animation loop
    let animationId: number
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // 지구본 위치 계산
      const globeX = canvas.width - 200
      const globeY = canvas.height / 2

      // 마우스 위치에 따른 회전 각도 계산
      const deltaX = (mousePos.current.x - globeX) * 0.001
      const deltaY = (mousePos.current.y - globeY) * 0.001

      // 지구본 그리기
      drawGlobe(ctx, globeX, globeY, deltaX, deltaY)

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animationId)
    }
  }, [])

  const drawGlobe = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    rotationX: number,
    rotationY: number
  ) => {
    const radius = 100
    const colors = {
      ocean: 'hsl(210, 40%, 15%)',
      land: 'hsl(35, 70%, 55%)', // 두부색
      grid: 'hsl(35, 70%, 35%)',
    }

    // 그라데이션 배경
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius * 1.5)
    gradient.addColorStop(0, 'hsla(35, 70%, 55%, 0.19)')
    gradient.addColorStop(1, 'hsla(35, 70%, 55%, 0)')
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(x, y, radius * 1.5, 0, Math.PI * 2)
    ctx.fill()

    // 메인 지구본
    ctx.fillStyle = colors.ocean
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fill()

    // 격자선 그리기
    ctx.strokeStyle = colors.grid
    ctx.lineWidth = 0.5
    ctx.globalAlpha = 0.3

    // 위도선
    for (let i = -4; i <= 4; i++) {
      const latY = y + (i * radius) / 4
      ctx.beginPath()
      ctx.ellipse(x, latY, radius * Math.cos((i * Math.PI) / 8), radius * 0.15, 0, 0, Math.PI * 2)
      ctx.stroke()
    }

    // 경도선
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4 + rotationY
      ctx.beginPath()
      ctx.arc(x, y, radius, angle, angle + 0.1, false)
      ctx.stroke()
    }

    ctx.globalAlpha = 1

    // 하이라이트
    const highlightGradient = ctx.createRadialGradient(
      x - 30 - rotationX * 50,
      y - 30 - rotationY * 50,
      0,
      x,
      y,
      radius * 1.2
    )
    highlightGradient.addColorStop(0, 'hsla(35, 70%, 55%, 0.25)')
    highlightGradient.addColorStop(0.5, 'hsla(35, 70%, 55%, 0.12)')
    highlightGradient.addColorStop(1, 'hsla(35, 70%, 55%, 0)')
    ctx.fillStyle = highlightGradient
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fill()

    // 외곽 테두리
    ctx.strokeStyle = colors.land
    ctx.lineWidth = 1
    ctx.globalAlpha = 0.6
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.stroke()
    ctx.globalAlpha = 1
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 0,
      }}
    />
  )
}
