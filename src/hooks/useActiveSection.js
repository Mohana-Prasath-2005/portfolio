import { useEffect, useState } from 'react'

// Tracks which section currently crosses a line ~35% down the viewport.
export default function useActiveSection(ids) {
  const [active, setActive] = useState('')

  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean)
    if (!els.length) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-35% 0px -64% 0px' }
    )
    els.forEach((el) => observer.observe(el))

    // Clear when scrolled back above the first section
    const onScroll = () => {
      if (els[0].getBoundingClientRect().top > window.innerHeight * 0.36) setActive('')
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [ids])

  return active
}
