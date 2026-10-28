import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import SectionHeader from './ui/SectionHeader'
import Reveal from './ui/Reveal'
import { person, spec, workAreas } from '../data/profile'

const highlight = new Set(['product', 'surface', 'services', 'screens'])

function Word({ word, progress, range }) {
  const opacity = useTransform(progress, range, [0.2, 1])
  return (
    <motion.span style={{ opacity }} className={highlight.has(word) ? 'text-accent' : undefined}>
      {word}{' '}
    </motion.span>
  )
}

// Statement that resolves word by word as it scrolls through the viewport.
function Statement({ text }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.55'] })
  const words = text.split(' ')
  return (
    <p ref={ref} className="relative font-display text-[1.55rem] font-semibold leading-[1.25] tracking-[-0.01em] text-fg sm:text-[2rem] lg:text-[2.3rem]">
      {reduce
        ? words.map((w, i) => <span key={i} className={highlight.has(w) ? 'text-accent' : undefined}>{w} </span>)
        : words.map((w, i) => <Word key={i} word={w} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} />)}
    </p>
  )
}

export default function About() {
  return (
    <section id="about" tabIndex={-1} aria-labelledby="about-title" className="section">
      <div className="shell">
        <SectionHeader index="01" label="About" id="about-title" title="What I work on" />

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <Statement text={person.about[0]} />
            <Reveal className="mt-6">
              <p className="lede">{person.about[1]}</p>
            </Reveal>
          </div>

          <Reveal delay={0.1} className="lg:col-span-5">
            <div className="panel p-6 sm:p-7">
              <p className="eyebrow mb-5 flex items-center justify-between">
                <span>Spec sheet</span>
                <span className="normal-case tracking-normal text-fg-dim">$ whoami</span>
              </p>
              <dl className="divide-y divide-fg/[0.07]">
                {spec.map((f) => (
                  <div key={f.label} className="grid grid-cols-[6rem_1fr] gap-4 py-3 first:pt-0 last:pb-0">
                    <dt className="pt-0.5 text-[0.66rem] uppercase tracking-[0.14em] text-fg-dim">{f.label}</dt>
                    <dd className="text-[0.88rem] text-fg">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </div>

        {/* Work surface: the areas I've worked in */}
        <Reveal className="mt-12">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="text-xl font-semibold text-fg">Work surface</h3>
            <p className="text-[0.66rem] uppercase tracking-[0.16em] text-fg-dim">{workAreas.length} areas · Open Fabric</p>
          </div>
          <ul className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-fg/[0.09] sm:grid-cols-3 lg:grid-cols-6">
            {workAreas.map((area, i) => (
              <li
                key={area}
                className="group relative flex min-h-[7.5rem] flex-col justify-between bg-canvas p-4 transition-colors duration-500 hover:bg-surface sm:p-5"
              >
                <span className="flex items-center justify-between text-[0.62rem] text-fg-dim" aria-hidden="true">
                  <span>{String(i + 1).padStart(2, '0')}</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-fg/20 transition-colors duration-300 group-hover:bg-accent group-hover:shadow-[0_0_10px_rgb(var(--accent))]" />
                </span>
                <span className="font-display text-lg font-semibold leading-tight text-fg transition-colors duration-300 group-hover:text-accent">
                  {area}
                </span>
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-accent transition-transform duration-500 group-hover:scale-x-100"
                />
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
