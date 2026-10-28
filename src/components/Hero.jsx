import { motion } from 'framer-motion'
import { TbArrowDownRight, TbArrowUpRight } from 'react-icons/tb'
import { FaGithub, FaLinkedin } from 'react-icons/fa'
import { SiLeetcode } from 'react-icons/si'
import MagneticButton from './MagneticButton'
import Avatar from './Avatar'
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
      <div className="shell flex flex-1 flex-col justify-end pb-6 pt-[44svh] lg:justify-center lg:pb-12 lg:pt-28">
        <div className="max-w-[46rem]">
          <motion.div {...rise(0)} className="flex items-center gap-5">
            <Avatar size="sm" tilt className="w-24 flex-shrink-0 sm:w-28 lg:w-36" />
            <div className="min-w-0">
              <p className="inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-accent">
                <span className="anim-pulse h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
                {person.role}
              </p>
              <p className="mt-2 text-base text-fg sm:text-lg">@ {person.company}</p>
            </div>
          </motion.div>

          <h1 id="hero-title" className="mt-8 whitespace-nowrap font-display text-[clamp(1.6rem,9.2vw,3.6rem)] font-bold leading-[1] tracking-[-0.04em] lg:text-[clamp(3rem,4.6vw,5rem)]">
            <motion.span {...rise(0.08)} className="text-ice inline-block pb-[0.06em]">Mohana Prasath G</motion.span>
          </h1>

          <motion.p {...rise(0.24)} className="mt-7 max-w-[36rem] text-[1.05rem] leading-relaxed text-fg-muted sm:text-lg">
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
