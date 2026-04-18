'use client'

import { useEffect, useRef } from 'react'

export function CubeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mousePos = useRef({ x: 0, y: 0 })
  const rotation = useRef({ x: 0, y: 0 })

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

    interface Point3D {
      x: number
      y: number
      z: number
    }

    interface Point2D {
      x: number
      y: number
      z: number
    }

    const rotateX = (point: Point3D, angle: number): Point3D => {
      const cos = Math.cos(angle)
      const sin = Math.sin(angle)
      return {
        x: point.x,
        y: point.y * cos - point.z * sin,
        z: point.y * sin + point.z * cos,
      }
    }

    const rotateY = (point: Point3D, angle: number): Point3D => {
      const cos = Math.cos(angle)
      const sin = Math.sin(angle)
      return {
        x: point.x * cos + point.z * sin,
        y: point.y,
        z: -point.x * sin + point.z * cos,
      }
    }

    const project = (point: Point3D, width: number, height: number): Point2D => {
      const scale = 300 / (300 + point.z)
      return {
        x: point.x * scale + width / 2,
        y: point.y * scale + height / 2,
        z: point.z,
      }
    }

    const animate = () => {
      // Update rotation based on mouse position with higher sensitivity
      rotation.current.x += (mousePos.current.y * 1.2 - rotation.current.x) * 0.08
      rotation.current.y += (mousePos.current.x * 1.2 - rotation.current.y) * 0.08

      ctx.fillStyle = 'transparent'
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Cube vertices - 크기 조정
      const size = 100
      const vertices: Point3D[] = [
        { x: -size, y: -size, z: -size },
        { x: size, y: -size, z: -size },
        { x: size, y: size, z: -size },
        { x: -size, y: size, z: -size },
        { x: -size, y: -size, z: size },
        { x: size, y: -size, z: size },
        { x: size, y: size, z: size },
        { x: -size, y: size, z: size },
      ]

      // Rotate vertices
      let rotatedVertices = vertices.map((v) => rotateX(v, rotation.current.x))
      rotatedVertices = rotatedVertices.map((v) => rotateY(v, rotation.current.y))

      // Project to 2D
      const projected = rotatedVertices.map((v) => project(v, canvas.width, canvas.height))

      // Define cube faces
      const faces = [
        [0, 1, 2, 3], // front
        [4, 5, 6, 7], // back
        [0, 1, 5, 4], // bottom
        [2, 3, 7, 6], // top
        [0, 3, 7, 4], // left
        [1, 2, 6, 5], // right
      ]

      // Calculate face depths and sort
      const faceData = faces.map((face, idx) => ({
        indices: face,
        depth: face.reduce((sum, i) => sum + rotatedVertices[i].z, 0) / face.length,
        faceIndex: idx,
      }))

      faceData.sort((a, b) => a.depth - b.depth)

      // Face colors - Glass Morphism 스타일 (강렬한 발광)
      const faceColors = [
        'hsla(35, 75%, 60%, 0.35)', // 앞
        'hsla(35, 75%, 55%, 0.33)', // 뒤
        'hsla(35, 75%, 50%, 0.31)', // 아래
        'hsla(35, 75%, 65%, 0.37)', // 위
        'hsla(35, 75%, 53%, 0.32)', // 왼쪽
        'hsla(35, 75%, 58%, 0.34)', // 오른쪽
      ]

      // Draw faces with rounded corners
      faceData.forEach(({ indices, faceIndex }) => {
        ctx.fillStyle = faceColors[faceIndex]
        ctx.lineWidth = 1.5

        const points = indices.map((i) => projected[i])

        ctx.beginPath()
        // Round corners approximation using quadratic curves
        const radius = 8
        ctx.moveTo(points[0].x + radius, points[0].y)

        for (let i = 0; i < points.length; i++) {
          const current = points[i]
          const next = points[(i + 1) % points.length]

          const cp1x = current.x + (next.x - current.x) * 0.7
          const cp1y = current.y + (next.y - current.y) * 0.7

          ctx.quadraticCurveTo(cp1x, cp1y, next.x, next.y)
        }

        ctx.closePath()
        ctx.fill()
        
        // Glass Morphism border effect - 강렬한 발광 테두리
        ctx.strokeStyle = 'hsla(35, 100%, 70%, 0.8)'
        ctx.lineWidth = 2.5
        ctx.stroke()
        
        // Inner glow - 매우 강한 하이라이트
        ctx.strokeStyle = 'hsla(0, 0%, 100%, 0.4)'
        ctx.lineWidth = 1.2
        ctx.stroke()
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      container.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <>
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-full pointer-events-none"
        style={{
          zIndex: 0,
          background: 'radial-gradient(ellipse 600px 400px at 85% 50%, hsla(35, 85%, 60%, 0.35) 0%, hsla(35, 70%, 55%, 0.15) 30%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
      <canvas
        ref={canvasRef}
        className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-full pointer-events-none"
        style={{
          zIndex: 1,
        }}
      />
    </>
  )
}
