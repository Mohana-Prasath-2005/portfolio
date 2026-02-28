import { useRef, useState } from 'react'

export default function TiltCard({ children, className = '', intensity = 10 }) {
  const ref = useRef(null)
  const [style, setStyle] = useState({})

  const handleMouseMove = (e) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateX = ((y - centerY) / centerY) * -intensity
    const rotateY = ((x - centerX) / centerX) * intensity

    setStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
      transition: 'transform 0.1s ease-out',
    })
  }

  const handleMouseLeave = () => {
    setStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.5s ease-out',
    })
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={style}
    >
      {children}
    </div>
  )
}
