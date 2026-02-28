import { useEffect, useRef } from 'react'

export default function ParticleBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animationId
    let mouse = { x: -1000, y: -1000 }
    let time = 0

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }
    resize()
    window.addEventListener('resize', resize)

    const w = () => canvas.width / window.devicePixelRatio
    const h = () => canvas.height / window.devicePixelRatio

    // Particles
    const particleCount = 80
    const particles = []
    const connectionDistance = 130

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * w(),
        y: Math.random() * h(),
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5 + 0.5,
        pulse: Math.random() * Math.PI * 2,
      })
    }

    const onMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    }
    const onMouseLeave = () => { mouse.x = -1000; mouse.y = -1000 }
    canvas.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('mouseleave', onMouseLeave)

    const draw = () => {
      time += 0.005
      const cw = w()
      const ch = h()
      ctx.clearRect(0, 0, cw, ch)

      // Animated grid
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.03)'
      ctx.lineWidth = 0.5
      const gridSize = 60
      const offsetX = (time * 20) % gridSize
      const offsetY = (time * 15) % gridSize

      for (let x = -gridSize + offsetX; x < cw + gridSize; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, ch)
        ctx.stroke()
      }
      for (let y = -gridSize + offsetY; y < ch + gridSize; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(cw, y)
        ctx.stroke()
      }

      // Aurora waves
      for (let wave = 0; wave < 3; wave++) {
        ctx.beginPath()
        const gradient = ctx.createLinearGradient(0, 0, cw, 0)
        const alpha = 0.015 - wave * 0.003
        gradient.addColorStop(0, `rgba(6, 182, 212, 0)`)
        gradient.addColorStop(0.3, `rgba(6, 182, 212, ${alpha})`)
        gradient.addColorStop(0.5, `rgba(139, 92, 246, ${alpha})`)
        gradient.addColorStop(0.7, `rgba(6, 182, 212, ${alpha})`)
        gradient.addColorStop(1, `rgba(139, 92, 246, 0)`)

        ctx.fillStyle = gradient
        ctx.moveTo(0, ch)
        for (let x = 0; x <= cw; x += 4) {
          const y = ch * 0.3 +
            Math.sin(x * 0.003 + time * 2 + wave) * 80 +
            Math.sin(x * 0.007 + time * 1.5 + wave * 2) * 40
          ctx.lineTo(x, y)
        }
        ctx.lineTo(cw, ch)
        ctx.closePath()
        ctx.fill()
      }

      // Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        p.pulse += 0.02

        if (p.x < 0 || p.x > cw) p.vx *= -1
        if (p.y < 0 || p.y > ch) p.vy *= -1

        // Mouse interaction
        const dx = p.x - mouse.x
        const dy = p.y - mouse.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 180) {
          const force = (180 - dist) / 180 * 0.015
          p.vx += dx * force
          p.vy += dy * force
        }

        p.vx *= 0.99
        p.vy *= 0.99

        // Pulsing glow
        const pulseSize = p.r + Math.sin(p.pulse) * 0.5
        const glowAlpha = 0.3 + Math.sin(p.pulse) * 0.15

        // Glow
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, pulseSize * 8)
        glow.addColorStop(0, `rgba(6, 182, 212, ${glowAlpha * 0.3})`)
        glow.addColorStop(1, 'rgba(6, 182, 212, 0)')
        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(p.x, p.y, pulseSize * 8, 0, Math.PI * 2)
        ctx.fill()

        // Core
        ctx.beginPath()
        ctx.arc(p.x, p.y, pulseSize, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(6, 182, 212, ${glowAlpha})`
        ctx.fill()

        // Connections
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const cdx = p.x - p2.x
          const cdy = p.y - p2.y
          const cdist = Math.sqrt(cdx * cdx + cdy * cdy)
          if (cdist < connectionDistance) {
            const opacity = (1 - cdist / connectionDistance) * 0.12
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = `rgba(6, 182, 212, ${opacity})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      // Mouse glow
      if (mouse.x > 0 && mouse.y > 0) {
        const mouseGlow = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 200)
        mouseGlow.addColorStop(0, 'rgba(6, 182, 212, 0.06)')
        mouseGlow.addColorStop(0.5, 'rgba(139, 92, 246, 0.02)')
        mouseGlow.addColorStop(1, 'rgba(6, 182, 212, 0)')
        ctx.fillStyle = mouseGlow
        ctx.beginPath()
        ctx.arc(mouse.x, mouse.y, 200, 0, Math.PI * 2)
        ctx.fill()
      }

      animationId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-0"
      style={{ opacity: 0.9 }}
    />
  )
}
