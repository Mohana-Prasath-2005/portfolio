import { useEffect, useRef, useState } from 'react'

export default function CustomCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const [isHovering, setIsHovering] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Hide on touch devices
    if ('ontouchstart' in window) return

    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let mouseX = 0, mouseY = 0
    let ringX = 0, ringY = 0

    const onMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
      dot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`
      if (!isVisible) setIsVisible(true)
    }

    const onMouseDown = () => setIsClicking(true)
    const onMouseUp = () => setIsClicking(false)
    const onMouseLeave = () => setIsVisible(false)
    const onMouseEnter = () => setIsVisible(true)

    // Detect hovering on interactive elements
    const onMouseOver = (e) => {
      const target = e.target.closest('a, button, [role="button"], input, textarea, .cursor-hover')
      setIsHovering(!!target)
    }

    // Smooth ring follow
    const animate = () => {
      ringX += (mouseX - ringX) * 0.15
      ringY += (mouseY - ringY) * 0.15
      ring.style.transform = `translate(${ringX - 20}px, ${ringY - 20}px)`
      requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup', onMouseUp)
    window.addEventListener('mouseover', onMouseOver)
    document.documentElement.addEventListener('mouseleave', onMouseLeave)
    document.documentElement.addEventListener('mouseenter', onMouseEnter)

    const animId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('mouseover', onMouseOver)
      document.documentElement.removeEventListener('mouseleave', onMouseLeave)
      document.documentElement.removeEventListener('mouseenter', onMouseEnter)
      cancelAnimationFrame(animId)
    }
  }, [isVisible])

  // Don't render on touch devices
  if (typeof window !== 'undefined' && 'ontouchstart' in window) return null

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        className="cursor-dot"
        style={{
          opacity: isVisible ? 1 : 0,
          width: isClicking ? '6px' : '8px',
          height: isClicking ? '6px' : '8px',
        }}
      />
      {/* Ring */}
      <div
        ref={ringRef}
        className="cursor-ring"
        style={{
          opacity: isVisible ? 1 : 0,
          width: isHovering ? '60px' : '40px',
          height: isHovering ? '60px' : '40px',
          borderColor: isHovering
            ? 'rgba(6, 182, 212, 0.6)'
            : 'rgba(6, 182, 212, 0.3)',
          background: isHovering
            ? 'rgba(6, 182, 212, 0.05)'
            : 'transparent',
        }}
      />
    </>
  )
}
