import { useEffect, useRef } from 'react'

// Pulls its content toward the pointer on fine-pointer devices. Writes transforms
// directly to the element so pointer movement never re-renders React.
export default function MagneticButton({ children, className = '', as: Tag = 'button', strength = 0.3, ...props }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduced) return

    let frame = 0
    const onMove = (e) => {
      const rect = el.getBoundingClientRect()
      const x = (e.clientX - (rect.left + rect.width / 2)) * strength
      const y = (e.clientY - (rect.top + rect.height / 2)) * strength
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        el.style.transition = 'transform 0.15s ease-out'
        el.style.transform = `translate3d(${x}px, ${y}px, 0)`
      })
    }
    const onLeave = () => {
      cancelAnimationFrame(frame)
      el.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
      el.style.transform = 'translate3d(0, 0, 0)'
    }
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(frame)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
    }
  }, [strength])

  return (
    <Tag ref={ref} className={className} {...props}>
      {children}
    </Tag>
  )
}
