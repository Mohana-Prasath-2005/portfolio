import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaGithub, FaLinkedin } from 'react-icons/fa'
import { SiLeetcode } from 'react-icons/si'
import Logo from './Logo'
import useActiveSection from '../hooks/useActiveSection'
import { sections, socials } from '../data/profile'

const primary = ['about', 'stack', 'work', 'research', 'journey', 'awards', 'contact']
const primaryLinks = sections.filter((s) => primary.includes(s.id))
const sectionIds = sections.map((s) => s.id)
const socialIcons = { github: FaGithub, linkedin: FaLinkedin, leetcode: SiLeetcode }

function MenuIcon({ open }) {
  return (
    <span className="relative block h-3 w-5" aria-hidden="true">
      <span className={`absolute left-0 h-px w-5 bg-fg transition-transform duration-500 ${open ? 'top-1.5 rotate-45' : 'top-0'}`} />
      <span className={`absolute left-0 h-px bg-fg transition-all duration-500 ${open ? 'top-1.5 w-5 -rotate-45' : 'top-3 w-3.5'}`} />
    </span>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const active = useActiveSection(sectionIds)
  const toggleRef = useRef(null)
  const menuRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Mobile menu: lock scroll, close on Escape, keep focus inside, restore focus on close
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    menuRef.current?.querySelector('a')?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
      if (e.key === 'Tab' && menuRef.current) {
        const items = [toggleRef.current, ...menuRef.current.querySelectorAll('a, button')]
        const idx = items.indexOf(document.activeElement)
        if (e.shiftKey && idx <= 0) {
          e.preventDefault()
          items[items.length - 1].focus()
        } else if (!e.shiftKey && idx === items.length - 1) {
          e.preventDefault()
          items[0].focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    const toggle = toggleRef.current
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
      toggle?.focus({ preventScroll: true })
    }
  }, [open])

  const activeIndex = sections.findIndex((s) => s.id === active)

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow] duration-500 ${
          scrolled || open ? 'bg-canvas/75 shadow-[0_1px_0_rgb(var(--fg)/0.07)] backdrop-blur-xl' : ''
        }`}
      >
        <nav aria-label="Primary" className="shell flex h-16 items-center justify-between gap-6 lg:h-[4.5rem]">
          <a href="#top" className="group flex items-center gap-3" aria-label="Mohana Prasath G — back to top">
            <Logo size={38} className="!h-8 !w-8 lg:!h-[38px] lg:!w-[38px]" />
            <span className="hidden flex-col leading-tight sm:flex">
              <span className="font-display text-[0.95rem] font-semibold tracking-[-0.01em] text-fg">Mohana Prasath G</span>
            </span>
          </a>

          <ul className="hidden items-center gap-0.5 rounded-full bg-fg/[0.05] p-1 lg:flex">
            {primaryLinks.map((link) => {
              const isActive = active === link.id
              return (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    aria-current={isActive ? 'true' : undefined}
                    className={`relative block rounded-full px-3.5 py-2 text-[0.8rem] transition-colors duration-300 xl:px-4 ${
                      isActive ? 'text-canvas' : 'text-fg-muted hover:text-fg'
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full bg-fg"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      />
                    )}
                    <span className="relative">{link.label}</span>
                  </a>
                </li>
              )
            })}
          </ul>

          <div className="flex items-center gap-2">
            <button
              ref={toggleRef}
              type="button"
              className="icon-btn !h-10 !w-10 lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((o) => !o)}
            >
              <MenuIcon open={open} />
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            ref={menuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 overflow-y-auto lg:hidden"
          >
            <div aria-hidden="true" onClick={() => setOpen(false)} className="fixed inset-0 bg-canvas/70 backdrop-blur-sm" />
            <motion.nav
              aria-label="Sections"
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="shell relative pb-6 pt-[4.25rem]"
            >
              <div className="panel origin-top !bg-surface p-2.5">
                <ol className="grid grid-cols-2 gap-1">
                  {sections.map((s, i) => {
                    const isActive = active === s.id
                    return (
                      <li key={s.id}>
                        <a
                          href={`#${s.id}`}
                          onClick={() => setOpen(false)}
                          aria-current={isActive ? 'true' : undefined}
                          className={`flex items-baseline gap-2.5 rounded-xl px-3 py-2.5 transition-colors duration-200 ${
                            isActive ? 'bg-accent/[0.1] text-accent' : 'text-fg hover:bg-fg/[0.04]'
                          }`}
                        >
                          <span className={`font-mono text-[0.6rem] ${isActive ? 'text-accent/70' : 'text-fg-dim'}`}>{String(i + 1).padStart(2, '0')}</span>
                          <span className="font-display text-[0.98rem] font-medium">{s.label}</span>
                        </a>
                      </li>
                    )
                  })}
                </ol>
                <div className="mt-2 flex items-center justify-between border-t border-fg/[0.07] px-1 pt-2.5">
                  <span className="pl-2 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-fg-dim">Profiles</span>
                  <div className="flex gap-2">
                    {socials.map((s) => {
                      const Icon = socialIcons[s.id]
                      return (
                        <a key={s.id} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={`${s.label} (opens in new tab)`} className="icon-btn !h-9 !w-9">
                          {Icon ? <Icon aria-hidden="true" size={15} /> : <span aria-hidden="true" className="font-mono text-[0.6rem]">{s.label.slice(0, 2)}</span>}
                        </a>
                      )
                    })}
                  </div>
                </div>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chapter rail — wide screens */}
      <nav
        aria-label="Section index"
        className={`fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 transition-opacity duration-500 2xl:block ${
          activeIndex >= 0 ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <p className="mb-4 text-right font-mono text-[0.68rem] text-fg-dim" aria-hidden="true">
          <span className="text-fg">{String(activeIndex + 1).padStart(2, '0')}</span> / {String(sections.length).padStart(2, '0')}
        </p>
        <ul className="flex flex-col items-end gap-2">
          {sections.map((s) => {
            const isActive = active === s.id
            return (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  tabIndex={activeIndex >= 0 ? 0 : -1}
                  aria-current={isActive ? 'true' : undefined}
                  className="group flex items-center gap-3 py-1.5"
                >
                  <span
                    className={`font-mono text-[0.65rem] uppercase tracking-[0.16em] transition-all duration-300 ${
                      isActive ? 'text-fg opacity-100' : 'translate-x-2 text-fg-dim opacity-0 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:opacity-100'
                    }`}
                  >
                    {s.label}
                  </span>
                  <span className={`h-px transition-all duration-500 ${isActive ? 'w-8 bg-accent' : 'w-4 bg-fg/25 group-hover:w-6'}`} aria-hidden="true" />
                </a>
              </li>
            )
          })}
        </ul>
      </nav>
    </>
  )
}
