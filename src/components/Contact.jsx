import { useState } from 'react'
import { TbArrowUpRight, TbCheck, TbCopy, TbMail, TbPhone } from 'react-icons/tb'
import { FaGithub, FaLinkedin } from 'react-icons/fa'
import { SiLeetcode } from 'react-icons/si'
import SectionHeader from './ui/SectionHeader'
import Reveal from './ui/Reveal'
import MagneticButton from './MagneticButton'
import useMediaQuery from '../hooks/useMediaQuery'
import avatarUrl from '../assets/avatar.jpg'
import { person, socials } from '../data/profile'

const ICON = { github: FaGithub, linkedin: FaLinkedin, leetcode: SiLeetcode, email: TbMail, phone: TbPhone }

const channels = [
  { id: 'email', label: 'Email', value: person.email, href: `mailto:${person.email}` },
  ...socials.map((s) => ({ id: s.id, label: s.label, value: s.handle, href: s.href, external: true })),
  { id: 'phone', label: 'Phone', value: person.phone, href: person.phoneHref },
]

// Node positions (percent) arranged on an arc around the centre portrait
const NODES = [
  [50, 9],
  [88, 30],
  [88, 72],
  [50, 91],
  [12, 51],
]

function CopyEmail() {
  const [state, setState] = useState('idle')
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(person.email)
      setState('copied')
    } catch {
      setState('failed')
    }
    setTimeout(() => setState('idle'), 2200)
  }
  return (
    <button type="button" onClick={copy} className="btn-ghost" aria-label="Copy email address">
      {state === 'copied' ? <TbCheck aria-hidden="true" className="text-accent" /> : <TbCopy aria-hidden="true" />}
      <span aria-live="polite">{state === 'copied' ? 'Copied' : state === 'failed' ? 'Copy failed' : 'Copy'}</span>
    </button>
  )
}

function ConnectionGraph() {
  const [hot, setHot] = useState(null)
  return (
    <nav aria-label="Contact channels" className="relative mx-auto aspect-square w-full max-w-[30rem]" data-figure data-visible="true">
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <circle cx="50" cy="50" r="41" fill="none" className="stroke-fg/[0.08]" strokeWidth="0.25" strokeDasharray="0.6 1.6" />
        <circle cx="50" cy="50" r="22" fill="none" className="stroke-fg/[0.06]" strokeWidth="0.25" />
        {NODES.map(([x, y], i) => {
          const on = hot === i
          return (
            <g key={i}>
              <line x1="50" y1="50" x2={x} y2={y} strokeWidth={on ? 0.5 : 0.3} className={`transition-[stroke] duration-300 ${on ? 'stroke-accent' : 'stroke-fg/20'}`} />
              <circle r="0.9" className="packet-dot fill-accent">
                <animateMotion dur={`${2.4 + i * 0.35}s`} begin={`${i * 0.4}s`} repeatCount="indefinite" path={`M50 50 L${x} ${y}`} />
              </circle>
            </g>
          )
        })}
      </svg>

      {/* centre: the portrait */}
      <div className="absolute left-1/2 top-1/2 w-[28%] -translate-x-1/2 -translate-y-1/2">
        <div className="relative aspect-square overflow-hidden rounded-full shadow-lift ring-1 ring-accent/50">
          <img src={avatarUrl} alt="" width="400" height="400" loading="lazy" className="h-full w-full object-cover" />
        </div>
        <span aria-hidden="true" className="anim-pulse absolute -inset-3 rounded-full ring-1 ring-accent/25" />
      </div>

      {channels.map((c, i) => {
        const Icon = ICON[c.id]
        const [x, y] = NODES[i]
        return (
          <a
            key={c.id}
            href={c.href}
            {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            onMouseEnter={() => setHot(i)}
            onMouseLeave={() => setHot(null)}
            onFocus={() => setHot(i)}
            onBlur={() => setHot(null)}
            className="group absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5"
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            <span className="grid h-12 w-12 place-items-center rounded-full bg-raised text-fg shadow-[inset_0_0_0_1px_rgb(var(--fg)/0.14)] transition-[box-shadow,color,transform] duration-300 group-hover:scale-110 group-hover:text-accent group-hover:shadow-[inset_0_0_0_1.5px_rgb(var(--accent))]">
              <Icon aria-hidden="true" size={19} />
            </span>
            <span className="whitespace-nowrap font-mono text-[0.64rem] uppercase tracking-[0.14em] text-fg-muted group-hover:text-fg">
              {c.label}
              {c.external && <span className="sr-only"> (opens in new tab)</span>}
            </span>
          </a>
        )
      })}
    </nav>
  )
}

export default function Contact() {
  const large = useMediaQuery('(min-width: 1024px)')
  return (
    <section id="contact" tabIndex={-1} aria-labelledby="contact-title" className="section">
      <div className="shell">
        <SectionHeader index="08" label="Contact" id="contact-title" title="Open a channel." />

        <div className="grid items-center gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <p className="max-w-[34rem] text-lg leading-relaxed text-fg-muted">{person.availability}</p>
            <a
              href={`mailto:${person.email}`}
              className="group mt-8 block whitespace-nowrap font-display text-[clamp(1rem,5.4vw,2.1rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-fg lg:text-[clamp(1.6rem,2.5vw,2.6rem)]"
            >
              <span className="text-ice">{person.email.split('@')[0]}</span>
              <span className="text-fg-dim transition-colors duration-300 group-hover:text-accent">@{person.email.split('@')[1]}</span>
            </a>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <MagneticButton as="a" href={`mailto:${person.email}`} className="btn-primary" strength={0.25}>
                Send an email
                <TbArrowUpRight aria-hidden="true" />
              </MagneticButton>
              <CopyEmail />
            </div>
            <p className="mt-8 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-fg-dim">
              {person.location} · IST (UTC+5:30)
            </p>
          </Reveal>

          {large ? (
            <Reveal delay={0.08} className="lg:col-span-5">
              <ConnectionGraph />
            </Reveal>
          ) : (
          <ul className="grid gap-px overflow-hidden rounded-2xl bg-fg/[0.08] sm:grid-cols-2">
            {channels.map((c) => {
              const Icon = ICON[c.id]
              return (
                <li key={c.id} className="bg-canvas">
                  <a
                    href={c.href}
                    {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="flex items-center gap-4 p-4"
                  >
                    <span className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-full bg-raised text-fg">
                      <Icon aria-hidden="true" size={17} />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-mono text-[0.62rem] uppercase tracking-[0.14em] text-fg-dim">{c.label}</span>
                      <span className="block truncate text-fg">{c.value}</span>
                    </span>
                    {c.external && <span className="sr-only">(opens in new tab)</span>}
                  </a>
                </li>
              )
            })}
          </ul>
          )}
        </div>
      </div>
    </section>
  )
}
