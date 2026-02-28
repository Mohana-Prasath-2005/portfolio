import { useState, useEffect } from 'react'

export default function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' &&
      (window.innerWidth < breakpoint || 'ontouchstart' in window)
  )

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint || 'ontouchstart' in window)
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [breakpoint])

  return isMobile
}
