import { motion } from 'framer-motion'
import { TbArrowDownRight, TbArrowUpRight } from 'react-icons/tb'
import { FaGithub, FaLinkedin } from 'react-icons/fa'
import { SiLeetcode } from 'react-icons/si'
import MagneticButton from './MagneticButton'
import { person, socials, highlights } from '../data/profile'

const EASE = [0.16, 1, 0.3, 1]
const socialIcons = { github: FaGithub, linkedin: FaLinkedin, leetcode: SiLeetcode }

const rise = (delay) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1, delay, ease: EASE },
})

export default function Hero() {
  return (
    <section id="top" tabIndex={-1} aria-labelledby="hero-title" className="relative flex min-h-[100svh] flex-col">
      <div className="shell flex flex-1 flex-col justify-end pb-6 pt-[49svh] lg:justify-center lg:pb-12 lg:pt-28">
        <div className="max-w-[46rem]">
          <h1 id="hero-title" className="whitespace-nowrap font-display text-[clamp(1.6rem,9.2vw,3.6rem)] font-bold leading-[1] tracking-[-0.04em] lg:text-[clamp(3rem,4.6vw,5rem)]">
            <motion.span {...rise(0.08)} className="text-ice inline-block pb-[0.06em]">Mohana Prasath G</motion.span>
          </h1>

          {/* Role badge: a light trace circles the border */}
          <motion.p {...rise(0.16)} className="badge-ring mt-5 inline-flex max-w-full rounded-full p-px shadow-[0_0_28px_-8px_rgb(var(--accent)/0.6)]">
            <span className="inline-flex min-w-0 items-center gap-2 rounded-full bg-canvas/90 py-1.5 pl-1.5 pr-4 backdrop-blur sm:gap-3 sm:pr-5">
              <span className="grid h-7 w-7 flex-shrink-0 place-items-center rounded-full bg-accent/[0.12]" aria-hidden="true">
                <span className="anim-pulse h-2 w-2 rounded-full bg-accent shadow-[0_0_10px_rgb(var(--accent))]" />
              </span>
              <span className="whitespace-nowrap font-display text-[clamp(0.76rem,3.6vw,0.88rem)] font-semibold tracking-[-0.01em] text-fg sm:text-[1.05rem]">
                {person.role} <span className="px-0.5 font-mono font-normal text-accent">@</span> <span className="text-ice">{person.company}</span>
              </span>
            </span>
          </motion.p>

          <motion.p {...rise(0.24)} className="mt-6 max-w-[36rem] text-[1.05rem] leading-relaxed text-fg-muted sm:text-lg">
            {person.intro}
          </motion.p>

          <motion.div {...rise(0.32)} className="mt-9 flex flex-wrap items-center gap-3">
            <MagneticButton as="a" href="#work" className="btn-primary" strength={0.25}>
              Explore projects
              <TbArrowDownRight aria-hidden="true" size={17} />
            </MagneticButton>
            <MagneticButton as="a" href="#contact" className="btn-ghost" strength={0.25}>
              Contact me
              <TbArrowUpRight aria-hidden="true" size={16} />
            </MagneticButton>
            <ul className="ml-1 flex items-center gap-2" aria-label="Profiles">
              {socials.map((s) => {
                const Icon = socialIcons[s.id]
                return (
                  <li key={s.id}>
                    <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={`${s.label} (opens in new tab)`} className="icon-btn">
                      <Icon aria-hidden="true" size={17} />
                    </a>
                  </li>
                )
              })}
            </ul>
          </motion.div>
        </div>
      </div>

      {/* Base: highlights + stack inspector */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2, delay: 0.5 }} className="shell pb-8">
        <div className="flex flex-col gap-8 border-t border-fg/[0.1] pt-6 lg:flex-row lg:items-end lg:justify-between">
          <dl className="grid grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-4 lg:gap-x-12">
            {highlights.map((h) => (
              <div key={h.label} className="flex flex-col-reverse">
                <dt className="mt-1 font-mono text-[0.64rem] uppercase tracking-[0.16em] text-fg-dim">{h.label}</dt>
                <dd className="font-display text-[1.9rem] font-semibold leading-none tracking-[-0.03em] text-fg">{h.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </motion.div>
    </section>
  )
}
