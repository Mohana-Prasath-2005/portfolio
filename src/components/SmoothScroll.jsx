import { useEffect } from 'react'
import Lenis from 'lenis'

const HEADER_OFFSET = -72

export default function SmoothScroll() {
  useEffect(() => {
    // Native scrolling on touch devices and for reduced-motion users
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduced) return

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    let frame = requestAnimationFrame(function raf(time) {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    })

    // Delegate in-page anchor clicks (works for links rendered later, e.g. the mobile menu)
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return
      const anchor = e.target.closest?.('a[href^="#"]')
      if (!anchor) return
      const hash = anchor.getAttribute('href')
      const target = hash === '#' || hash === '#top' ? 0 : document.querySelector(hash)
      if (target === null) return
      e.preventDefault()
      lenis.scrollTo(target, {
        offset: target === 0 ? 0 : HEADER_OFFSET,
        onComplete: () => {
          // Move focus for keyboard and screen-reader users
          if (target instanceof HTMLElement) target.focus({ preventScroll: true })
        },
      })
      history.replaceState(null, '', hash === '#top' ? location.pathname : hash)
    }
    document.addEventListener('click', onClick)

    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener('click', onClick)
      lenis.destroy()
    }
  }, [])

  return null
}
