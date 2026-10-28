import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { TbPlus } from 'react-icons/tb'
import SectionHeader from './ui/SectionHeader'
import Reveal from './ui/Reveal'
import { leadership } from '../data/profile'

const W = 1000
const H = 330
const YEARS = [2022, 2023, 2024, 2025, 2026]
const X = (year) => 70 + (year - 2022) * 215
const role = (title) => leadership.find((r) => r.title === title)

// Progression drawn as a staircase: each step is a role, rising with responsibility.
const STEPS = [
  { ...role('Core Member'), from: 2022, to: 2023, y: 290 },
  { ...role('Executive Member'), from: 2023, to: 2024, y: 225 },
  { ...role('Overall Students Joint Secretary'), from: 2024, to: 2025, y: 160 },
  { ...role('Student Secretary'), from: 2025, to: 2026, y: 95 },
  { ...role('Promotional Team Head'), from: 2025, to: 2026, y: 40, branch: true },
]

// Mobile timeline order: most recent first; within a year, the main staircase role before the branch
const MOBILE_STEPS = [...STEPS].sort((a, b) => b.from - a.from || b.y - a.y)

const stair = `M${X(2022)} 290 H${X(2023)} V225 H${X(2024)} V160 H${X(2025)} V95 H${X(2026)}`
const branch = `M${X(2025)} 160 V40 H${X(2026)}`

export default function Leadership() {
  const [active, setActive] = useState(3)
  const [openStep, setOpenStep] = useState(MOBILE_STEPS[0].title)
  const current = STEPS[active]

  return (
    <section id="leadership" tabIndex={-1} aria-labelledby="leadership-title" className="section">
      <div className="shell">
        <SectionHeader
          index="06"
          label="Leadership"
          id="leadership-title"
          title="Leadership, step by step"
          lede="Four years at Nandha Engineering College — select a role to see what it involved."
        />

        {/* Staircase (md and up) */}
        <Reveal className="panel hidden p-6 md:block lg:p-8">
          <div className="relative w-full" style={{ aspectRatio: `${W} / ${H}` }}>
            <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
              {YEARS.map((y) => (
                <g key={y}>
                  <line x1={X(y)} x2={X(y)} y1="20" y2={H - 20} className="stroke-fg/[0.07]" strokeDasharray="2 6" />
                  <text x={X(y)} y={H - 2} textAnchor="middle" fontSize="13" className="fill-fg-dim" style={{ fontFamily: '"JetBrains Mono", monospace' }}>{y}</text>
                </g>
              ))}
              <motion.path
                d={stair}
                fill="none"
                strokeWidth="2"
                className="stroke-fg/30"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
              />
              <motion.path
                d={branch}
                fill="none"
                strokeWidth="2"
                strokeDasharray="5 6"
                className="stroke-fg/25"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 1.2 }}
              />
              {STEPS.map((s, i) => (
                <line
                  key={s.title}
                  x1={X(s.from)}
                  x2={X(s.to)}
                  y1={s.y}
                  y2={s.y}
                  strokeLinecap="round"
                  strokeWidth={i === active ? 6 : 0}
                  className={`transition-[stroke,stroke-width] duration-300 ${i === active ? 'stroke-accent' : 'stroke-fg/25'}`}
                  style={i === active ? { filter: 'drop-shadow(0 0 8px rgb(46 229 255 / 0.6))' } : undefined}
                />
              ))}
            </svg>

            {STEPS.map((s, i) => {
              const on = i === active
              const mid = (X(s.from) + X(s.to)) / 2
              return (
                <button
                  key={s.title}
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  aria-pressed={on}
                  className="absolute -translate-x-1/2 -translate-y-full whitespace-nowrap px-2 pb-2 text-center"
                  style={{ left: `${(mid / W) * 100}%`, top: `${(s.y / H) * 100}%` }}
                >
                  <span className={`block font-display text-[0.95rem] font-semibold leading-tight transition-colors duration-300 ${on ? 'text-accent' : 'text-fg hover:text-accent'}`}>
                    {s.title}
                  </span>
                  <span className="block text-[0.62rem] text-fg-dim">{s.period}</span>
                </button>
              )
            })}
          </div>

          <div className="mt-6 grid gap-2 border-t border-fg/[0.08] pt-5 md:grid-cols-[16rem_minmax(0,1fr)] md:gap-6" aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={current.title}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                className="contents"
              >
                <div>
                  <p className="font-display text-lg font-semibold text-fg">{current.title}</p>
                  <p className="text-[0.75rem] text-signal">{current.org} · {current.period}</p>
                </div>
                <p className="leading-relaxed text-fg-muted">{current.impact}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </Reveal>

        {/* Timeline (small screens): most recent first, tap a role to expand */}
        <Reveal className="panel p-5 md:hidden">
          <div className="mb-6 flex items-center justify-between font-mono text-[0.62rem] uppercase tracking-[0.16em] text-fg-dim">
            <span>2022 → 2026</span>
            <span>{STEPS.length} roles</span>
          </div>
          <ol className="relative">
            <span aria-hidden="true" className="absolute bottom-3 left-[7px] top-2 w-px bg-gradient-to-b from-accent via-accent/30 to-fg/10" />
            {MOBILE_STEPS.map((s, n) => {
              const on = openStep === s.title
              return (
                <li key={s.title} className="relative pb-5 pl-8 last:pb-0">
                  <span
                    aria-hidden="true"
                    className={`absolute left-0 top-[0.35rem] h-[15px] w-[15px] rounded-full border transition-all duration-300 ${
                      on ? 'border-accent bg-accent shadow-[0_0_12px_rgb(var(--accent)/0.7)]' : n === 0 ? 'border-accent bg-canvas' : 'border-fg/30 bg-canvas'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setOpenStep(on ? null : s.title)}
                    aria-expanded={on}
                    aria-controls={on ? `lead-${n}` : undefined}
                    className="flex w-full items-start justify-between gap-3 text-left"
                  >
                    <span className="min-w-0">
                      <span className="block font-mono text-[0.62rem] uppercase tracking-[0.14em] text-fg-dim">{s.period}</span>
                      <span className={`mt-1 block font-display text-[1.08rem] font-semibold leading-snug transition-colors duration-300 ${on ? 'text-accent' : 'text-fg'}`}>
                        {s.title}
                      </span>
                      <span className="mt-0.5 block font-mono text-[0.72rem] text-signal">{s.org}</span>
                    </span>
                    <TbPlus aria-hidden="true" size={16} className={`mt-5 flex-shrink-0 text-fg-dim transition-transform duration-300 ${on ? 'rotate-45 text-accent' : ''}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {on && (
                      <motion.p
                        id={`lead-${n}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <span className="block pt-2 text-[0.85rem] leading-relaxed text-fg-muted">{s.impact}</span>
                      </motion.p>
                    )}
                  </AnimatePresence>
                </li>
              )
            })}
          </ol>
        </Reveal>
      </div>
    </section>
  )
}
