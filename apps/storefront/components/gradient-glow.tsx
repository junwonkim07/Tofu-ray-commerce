'use client'

import { useEffect, useRef } from 'react'

export function GradientGlow() {
  const glowRef = useRef<HTMLDivElement>(null)
  const mousePos = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = {
        x: e.clientX,
        y: e.clientY,
      }
    }

    const animate = () => {
      if (glowRef.current) {
        const x = mousePos.current.x
        const y = mousePos.current.y

        glowRef.current.style.backgroundImage = `
          radial-gradient(ellipse 600px 400px at ${x}px ${y}px, hsla(35, 85%, 60%, 0.25) 0%, hsla(35, 70%, 55%, 0.12) 30%, transparent 70%)
        `
      }

      requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', handleMouseMove)
    const animationId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <div
      ref={glowRef}
      className="absolute inset-0 pointer-events-none"
      style={{
        zIndex: 0,
        filter: 'blur(80px)',
      }}
    />
  )
}
