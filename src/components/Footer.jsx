import { TbArrowUp, TbMail } from 'react-icons/tb'
import { FaGithub, FaLinkedin } from 'react-icons/fa'
import { SiLeetcode } from 'react-icons/si'
import Logo from './Logo'
import { person, socials } from '../data/profile'

const ICON = { github: FaGithub, linkedin: FaLinkedin, leetcode: SiLeetcode }

// A trace line running across the top edge, with a packet travelling along it.
function Signal() {
  const d = 'M0 12 H340 L352 3 L364 21 L376 12 H620 L628 6 L636 18 L644 12 H1000'
  return (
    <svg viewBox="0 0 1000 24" preserveAspectRatio="none" className="block h-6 w-full" aria-hidden="true">
      <path d={d} fill="none" vectorEffect="non-scaling-stroke" className="stroke-fg/[0.12]" strokeWidth="1" />
      <path d={d} fill="none" vectorEffect="non-scaling-stroke" pathLength="100" className="packet stroke-accent" strokeWidth="1.5" style={{ animationDuration: '5s' }} />
    </svg>
  )
}

export default function Footer() {
  return (
    <footer className="relative">
      <div className="shell">
        <Signal />
        <div className="flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between">
          <a href="#top" className="flex items-center gap-3" aria-label="Mohana Prasath G — back to top">
            <Logo size={34} />
            <span className="leading-tight">
              <span className="block font-display text-[0.95rem] font-semibold text-fg">{person.name}</span>
            </span>
          </a>

          <ul className="flex items-center gap-2" aria-label="Profiles">
            {socials.map((s) => {
              const Icon = ICON[s.id]
              return (
                <li key={s.id}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={`${s.label} (opens in new tab)`} className="icon-btn !h-10 !w-10">
                    <Icon aria-hidden="true" size={16} />
                  </a>
                </li>
              )
            })}
            <li>
              <a href={`mailto:${person.email}`} aria-label="Email" className="icon-btn !h-10 !w-10">
                <TbMail aria-hidden="true" size={17} />
              </a>
            </li>
          </ul>

          <div className="flex items-center justify-between gap-6 md:justify-end">
            <p className="font-mono text-[0.66rem] uppercase tracking-[0.14em] text-fg-dim">
              © {new Date().getFullYear()}
            </p>
            <a href="#top" className="inline-flex min-h-[40px] items-center gap-1.5 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-fg-muted hover:text-accent">
              Top <TbArrowUp aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
