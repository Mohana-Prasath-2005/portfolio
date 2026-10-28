import { motion } from 'framer-motion'
import SectionHeader from './ui/SectionHeader'
import Reveal from './ui/Reveal'
import Certifications from './Certifications'
import { experience, education } from '../data/profile'

const [openFabric, nitTrichy] = experience
const EASE = [0.16, 1, 0.3, 1]

// Ring gauge (value out of max) drawn when it scrolls into view
function Gauge({ value, max, size = 160, stroke = 8, label, display }) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  return (
    <figure className="relative m-0 max-w-full" style={{ width: size, aspectRatio: '1' }} aria-label={`${label}: ${display ?? value}`}>
      <svg viewBox={`0 0 ${size} ${size}`} className="h-full w-full -rotate-90" aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} className="stroke-fg/[0.08]" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          className="stroke-accent"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          whileInView={{ strokeDashoffset: c * (1 - value / max) }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, ease: EASE }}
        />
      </svg>
      <figcaption className="absolute inset-0 grid place-content-center text-center">
        <span className="font-display font-bold leading-none text-fg" style={{ fontSize: `min(${size * 0.26}px, 9vw)` }}>{display ?? value}</span>
        <span className="mt-1 text-[0.6rem] uppercase tracking-[0.16em] text-fg-dim">{label}</span>
      </figcaption>
    </figure>
  )
}

// Live trace for the current role
function Trace() {
  const d = 'M0 20 H120 L132 6 L144 34 L156 20 H300 L310 12 L320 28 L330 20 H600'
  return (
    <svg viewBox="0 0 600 40" preserveAspectRatio="none" className="h-8 w-full" aria-hidden="true">
      <path d={d} fill="none" vectorEffect="non-scaling-stroke" className="stroke-fg/[0.12]" strokeWidth="1" />
      <path d={d} fill="none" vectorEffect="non-scaling-stroke" pathLength="100" className="packet stroke-accent" strokeWidth="1.5" style={{ animationDuration: '3.2s' }} />
    </svg>
  )
}

function SemesterBars() {
  const MIN = 8.5
  const MAX = 10
  const last = education.semesters.length - 1
  return (
    <figure className="m-0" aria-label={`Semester GPA: ${education.semesters.map((s) => `S${s.sem} ${s.gpa}`).join(', ')}`}>
      <div className="flex h-48 items-end gap-1.5 sm:gap-3" aria-hidden="true">
        {education.semesters.map((s, i) => {
          const h = ((s.gpa - MIN) / (MAX - MIN)) * 100
          const top = i === last
          return (
            <div key={s.sem} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
              <span className={`text-[0.66rem] ${top ? 'font-semibold text-accent' : 'text-fg-muted'}`}>{top ? s.gpa.toFixed(1) : s.gpa.toFixed(2)}</span>
              <motion.div
                initial={{ height: 0 }}
                whileInView={{ height: `${h}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.06 * i, ease: EASE }}
                className={`relative w-full rounded-t-md ${top ? 'bg-accent' : 'bg-fg/[0.14]'}`}
                style={{ boxShadow: top ? '0 0 30px rgb(var(--accent) / 0.35)' : undefined }}
              >
                {/* lit top face for depth */}
                <span className={`absolute inset-x-0 top-0 h-1.5 rounded-t-md ${top ? 'bg-white/70' : 'bg-fg/25'}`} />
              </motion.div>
              <span className="text-[0.62rem] text-fg-dim">S{s.sem}</span>
            </div>
          )
        })}
      </div>
    </figure>
  )
}

export default function Journey() {
  return (
    <section id="journey" tabIndex={-1} aria-labelledby="journey-title" className="section">
      <div className="shell">
        <SectionHeader index="05" label="Experience & education" id="journey-title" title="Experience & education" />

        <div className="grid gap-5 lg:grid-cols-12">
          {/* Experience */}
          <Reveal className="min-w-0 lg:col-span-7">
            <article className="panel reg flex h-full flex-col p-6 sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <p className="text-[0.66rem] uppercase tracking-[0.16em] text-fg-dim">Experience · current</p>
                <span className="inline-flex items-center gap-2 rounded-full bg-accent/[0.12] px-3 py-1 text-[0.62rem] uppercase tracking-[0.14em] text-accent">
                  <span className="anim-pulse h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" /> Active
                </span>
              </div>
              <h3 className="mt-6 font-display text-[2.6rem] font-bold leading-none text-fg sm:text-6xl">{openFabric.org}</h3>
              <p className="mt-3 text-signal">{openFabric.role} · {openFabric.where}</p>
              <p className="mt-4 max-w-[34rem] leading-relaxed text-fg-muted">{openFabric.detail}</p>
              <div className="mt-6"><Trace /></div>

              <div className="mt-auto pt-8">
                <div className="flex flex-col gap-2 border-t border-fg/[0.08] pt-5 sm:flex-row sm:items-baseline sm:justify-between">
                  <p className="font-display text-xl font-semibold text-fg">{nitTrichy.org} <span className="text-fg-dim">·</span> {nitTrichy.role}</p>
                  <p className="text-[0.66rem] uppercase tracking-[0.14em] text-fg-dim">{nitTrichy.where}</p>
                </div>
                <p className="mt-2 text-[0.88rem] leading-relaxed text-fg-muted">{nitTrichy.detail}</p>
              </div>
            </article>
          </Reveal>

          {/* Education */}
          <Reveal delay={0.06} className="min-w-0 lg:col-span-5">
            <article className="panel flex h-full flex-col p-6 sm:p-8">
              <p className="text-[0.66rem] uppercase tracking-[0.16em] text-fg-dim">Education · {education.period}</p>
              <h3 className="mt-3 text-xl font-semibold leading-snug text-fg">{education.degree}</h3>
              <p className="mt-1 text-[0.85rem] text-signal">{education.school}</p>
              <div className="mt-6 grid flex-1 grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] items-center gap-4 sm:gap-6">
                <Gauge value={Number(education.cgpa)} max={10} size={168} label="CGPA / 10" display={education.cgpa} />
                <div className="flex flex-col items-center gap-4">
                  {education.school12.map((s) => (
                    <Gauge key={s.label} value={s.value} max={100} size={92} stroke={6} label={s.label.split(' ')[0]} display={`${s.value}%`} />
                  ))}
                </div>
              </div>
            </article>
          </Reveal>

          {/* Semesters */}
          <Reveal delay={0.04} className="min-w-0 lg:col-span-12">
            <div className="panel p-6 sm:p-8">
              <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <h3 className="text-lg font-semibold text-fg">Semester performance</h3>
                <p className="text-[0.66rem] uppercase tracking-[0.14em] text-fg-dim">GPA by semester · S8 = 10.0</p>
              </div>
              <SemesterBars />
            </div>
          </Reveal>
        </div>

        <Certifications />
      </div>
    </section>
  )
}
