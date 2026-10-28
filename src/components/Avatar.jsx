import { useEffect, useRef, useState } from 'react'
import avatarUrl from '../assets/avatar.jpg'
import { person } from '../data/profile'

function Brackets() {
  const c = 'absolute h-3 w-3 border-accent/80'
  return (
    <span aria-hidden="true" className="pointer-events-none absolute inset-2.5 z-10">
      <span className={`${c} left-0 top-0 border-l border-t`} />
      <span className={`${c} right-0 top-0 border-r border-t`} />
      <span className={`${c} bottom-0 left-0 border-b border-l`} />
      <span className={`${c} bottom-0 right-0 border-b border-r`} />
    </span>
  )
}

// The original portrait, framed as an engineer's ID module. The image itself is not altered.
export default function Avatar({ className = '', size = 'lg', tilt = false }) {
  const [failed, setFailed] = useState(false)
  const card = useRef(null)

  useEffect(() => {
    const el = card.current
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!el || !tilt || !fine || reduced) return
    let raf = 0
    const onMove = (e) => {
      const x = e.clientX / window.innerWidth - 0.5
      const y = e.clientY / window.innerHeight - 0.5
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        el.style.transform = `perspective(900px) rotateY(${(x * 9).toFixed(2)}deg) rotateX(${(-y * 7).toFixed(2)}deg)`
      })
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
    }
  }, [tilt])

  const lg = size === 'lg'

  return (
    <div className={`relative ${className}`}>
      {/* cool light spilling from behind the module */}
      <div aria-hidden="true" className="absolute -inset-3 rounded-[32px] bg-accent/[0.07] blur-2xl sm:-inset-6" />
      <div
        ref={card}
        className="relative rounded-[20px] bg-display p-1.5 shadow-lift transition-transform duration-500 ease-out will-change-transform"
        style={{ backgroundImage: 'linear-gradient(180deg, rgb(255 255 255 / 0.10), rgb(255 255 255 / 0.02) 40%)' }}
      >
        <div className="relative aspect-square overflow-hidden rounded-[15px]">
          {failed ? (
            <div className="grid h-full w-full place-items-center bg-raised">
              <span className="text-4xl font-semibold tracking-tight text-fg">MP</span>
            </div>
          ) : (
            <img
              src={avatarUrl}
              alt={`Portrait of ${person.name}`}
              width="400"
              height="400"
              decoding="async"
              fetchpriority="high"
              onError={() => setFailed(true)}
              className="h-full w-full object-cover"
            />
          )}
          <Brackets />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{ background: 'radial-gradient(120% 90% at 50% 35%, transparent 55%, rgb(0 0 0 / 0.5) 100%)' }}
          />
        </div>
        {lg && (
          <div className="flex items-center justify-between gap-3 px-2 pb-1 pt-2.5 font-mono text-[0.62rem] uppercase tracking-[0.16em]">
            <span className="truncate text-fg">{person.name}</span>
            <span className="flex flex-shrink-0 items-center gap-1.5 text-fg-muted">
              <span className="anim-pulse h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
              SWE
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
