import { useEffect, useRef } from 'react'
import useMediaQuery from '../hooks/useMediaQuery'

// A soft ring that trails the (still visible) native cursor and grows over
// interactive elements. Fine pointers only; disabled for reduced motion.
export default function CustomCursor() {
  const enabled = useMediaQuery('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)')
  const ringRef = useRef(null)

  useEffect(() => {
    const ring = ringRef.current
    if (!enabled || !ring) return

    let x = -100, y = -100, rx = -100, ry = -100
    let frame = 0
    let running = false

    const loop = () => {
      rx += (x - rx) * 0.2
      ry += (y - ry) * 0.2
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`
      if (Math.abs(x - rx) + Math.abs(y - ry) > 0.1) {
        frame = requestAnimationFrame(loop)
      } else {
        running = false
      }
    }
    const kick = () => {
      if (!running) {
        running = true
        frame = requestAnimationFrame(loop)
      }
    }

    const onMove = (e) => {
      x = e.clientX
      y = e.clientY
      ring.style.opacity = '1'
      kick()
    }
    const onOver = (e) => {
      const hit = e.target.closest?.('a, button, [role="button"], summary, label, input, textarea')
      ring.dataset.active = hit ? 'true' : 'false'
    }
    const onLeave = () => { ring.style.opacity = '0' }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerover', onOver, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerover', onOver)
      document.documentElement.removeEventListener('pointerleave', onLeave)
    }
  }, [enabled])

  if (!enabled) return null
  return <div ref={ringRef} className="cursor-ring" style={{ opacity: 0 }} aria-hidden="true" />
}
