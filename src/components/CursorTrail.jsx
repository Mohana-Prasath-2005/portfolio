import { useEffect, useRef } from 'react'

export default function CursorTrail() {
  const canvasRef = useRef(null)

  useEffect(() => {
    // Hide on touch devices
    if ('ontouchstart' in window) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    const particles = []
    let mouse = { x: -100, y: -100 }

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const onMouseMove = (e) => {
      mouse.x = e.clientX
      mouse.y = e.clientY

      // Spawn 2-3 particles per move
      for (let i = 0; i < 2; i++) {
        particles.push({
          x: mouse.x + (Math.random() - 0.5) * 10,
          y: mouse.y + (Math.random() - 0.5) * 10,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5 - 0.5,
          life: 1,
          decay: 0.015 + Math.random() * 0.01,
          size: Math.random() * 3 + 1,
          hue: Math.random() > 0.5 ? 187 : 263, // cyan or violet
        })
      }
    }

    window.addEventListener('mousemove', onMouseMove)

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        p.life -= p.decay

        if (p.life <= 0) {
          particles.splice(i, 1)
          continue
        }

        const alpha = p.life * 0.6
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${p.hue}, 80%, 65%, ${alpha})`
        ctx.fill()

        // Glow
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * p.life * 3, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${p.hue}, 80%, 65%, ${alpha * 0.15})`
        ctx.fill()
      }

      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [])

  if (typeof window !== 'undefined' && 'ontouchstart' in window) return null

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[99] pointer-events-none"
      style={{ mixBlendMode: 'screen' }}
    />
  )
}
