import { useEffect, useRef, useState } from 'react'
import { animate, useInView, useReducedMotion } from 'framer-motion'
import SectionHeader from './ui/SectionHeader'
import Reveal from './ui/Reveal'
import { awards, competitionStats, keyWins } from '../data/profile'

const mono = { fontFamily: '"JetBrains Mono", ui-monospace, monospace' }

// Hexagonal seal for the headline honour — drawn in the site's ice/cyan line language.
function Seal() {
  const hex = (r) =>
    Array.from({ length: 6 }, (_, i) => {
      const a = (Math.PI / 3) * i - Math.PI / 2
      return `${100 + Math.cos(a) * r},${100 + Math.sin(a) * r}`
    }).join(' ')
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden="true">
      <defs>
        <path id="seal-ring" d="M100 100 m-84 0 a84 84 0 1 1 168 0 a84 84 0 1 1 -168 0" />
      </defs>
      <g className="anim-spin-slow" style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
        <text fontSize="8" letterSpacing="3.2" className="fill-signal/80" style={mono}>
          <textPath href="#seal-ring">ISTE · CHAPTER BEST STUDENT · TAMILNADU SECTION · 2026 ·</textPath>
        </text>
      </g>
      <polygon points={hex(66)} fill="none" className="stroke-fg/30" strokeWidth="1" />
      <polygon points={hex(56)} className="fill-accent/[0.06] stroke-accent/70" strokeWidth="1.25" />
      {Array.from({ length: 6 }, (_, i) => {
        const a = (Math.PI / 3) * i - Math.PI / 2
        return <circle key={i} cx={100 + Math.cos(a) * 56} cy={100 + Math.sin(a) * 56} r="2.6" className="fill-accent" />
      })}
      <text x="100" y="94" textAnchor="middle" fontSize="11" letterSpacing="4" className="fill-signal" style={mono}>ISTE</text>
      <text x="100" y="122" textAnchor="middle" fontSize="28" fontWeight="700" className="fill-fg" style={{ fontFamily: '"Chakra Petch", sans-serif', letterSpacing: '-0.5px' }}>2026</text>
    </svg>
  )
}

function Counter({ target, suffix = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const reduce = useReducedMotion()
  const [value, setValue] = useState(reduce ? target : 0)
  useEffect(() => {
    if (!inView || reduce) return
    const controls = animate(0, target, { duration: 1.4, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setValue(Math.round(v)) })
    return controls.stop
  }, [inView, reduce, target])
  return (
    <span ref={ref}>
      <span aria-hidden="true">{value}{suffix}</span>
      <span className="sr-only">{target}{suffix}</span>
    </span>
  )
}

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: '1st', label: '1st place' },
  { id: '2nd', label: '2nd place' },
]

export default function IsteAward() {
  const [featured, ...rest] = awards
  const years = [...new Set(rest.map((a) => a.year))].sort().reverse()
  const [filter, setFilter] = useState('all')
  const wins = keyWins.filter((w) => filter === 'all' || w.prize === filter)

  return (
    <section id="awards" tabIndex={-1} aria-labelledby="awards-title" className="section">
      <div className="shell">
        <SectionHeader index="07" label="Awards & recognitions" id="awards-title" title="Recognition" lede="ISTE Tamilnadu Section and Nandha Engineering College." />

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Headline honour */}
          <Reveal className="lg:col-span-5">
            <article className="relative">
              <div className="mx-auto w-48 sm:w-56 lg:mx-0">
                <Seal />
              </div>
              <p className="mt-6 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-accent">{featured.label} · highest honour</p>
              <h3 className="mt-3 text-[1.9rem] font-semibold tracking-[-0.03em] text-fg sm:text-[2.3rem]">{featured.title}</h3>
              <p className="mt-2 text-signal">{featured.org}</p>
              <p className="mt-4 leading-relaxed text-fg-muted">{featured.description}</p>
            </article>
          </Reveal>

          {/* Timeline of other honours */}
          <div className="lg:col-span-7">
            {years.map((year) => (
              <Reveal key={year} className="grid grid-cols-[4.5rem_1fr] gap-4 sm:grid-cols-[6rem_1fr]">
                <p className="pt-5 font-display text-2xl font-semibold tracking-[-0.03em] text-fg-dim">{year}</p>
                <ol className="border-l border-fg/[0.1]">
                  {rest.filter((a) => a.year === year).map((a) => (
                    <li key={a.id} className="group relative py-5 pl-6">
                      <span aria-hidden="true" className="absolute -left-[5px] top-7 h-[9px] w-[9px] rotate-45 bg-canvas shadow-[inset_0_0_0_1.5px_rgb(var(--accent))] transition-colors duration-300 group-hover:bg-accent" />
                      <p className="font-mono text-[0.64rem] uppercase tracking-[0.14em] text-fg-dim">{a.label}</p>
                      <h3 className="mt-1.5 text-xl font-semibold tracking-[-0.02em] text-fg">{a.title}</h3>
                      <p className="mt-0.5 text-sm text-signal">{a.org}</p>
                      <p className="mt-2 max-w-[38rem] text-[0.95rem] leading-relaxed text-fg-muted">{a.description}</p>
                    </li>
                  ))}
                </ol>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Competition record */}
        <div className="mt-14 border-t border-fg/[0.08] pt-10">
          <Reveal className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h3 className="text-2xl font-semibold tracking-[-0.03em] text-fg sm:text-3xl">Competition record</h3>
              <p className="mt-1 text-fg-muted">Papers, design, code and quizzes.</p>
            </div>
            <dl className="grid grid-cols-4 items-end gap-6 sm:gap-10">
              {competitionStats.map((s) => (
                <div key={s.label} className="flex flex-col-reverse">
                  <dt className="mt-1 font-mono text-[0.58rem] uppercase tracking-[0.12em] text-fg-dim sm:text-[0.62rem]">{s.label}</dt>
                  <dd className="font-display text-3xl font-semibold tracking-[-0.04em] text-fg sm:text-4xl">
                    <Counter target={s.value} suffix={s.suffix} />
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={0.05} className="mt-8">
            <div className="flex items-center justify-between gap-4">
              <h4 className="eyebrow">Key wins</h4>
              <div className="flex gap-1.5" role="group" aria-label="Filter key wins">
                {FILTERS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFilter(f.id)}
                    aria-pressed={filter === f.id}
                    className={`min-h-[34px] rounded-full px-3 font-mono text-[0.66rem] uppercase tracking-[0.12em] transition-colors duration-300 ${
                      filter === f.id ? 'bg-fg text-canvas' : 'bg-fg/[0.05] text-fg-muted hover:text-fg'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
            <table className="mt-4 w-full border-collapse text-left">
              <caption className="sr-only">Key competition wins</caption>
              <thead className="hidden sm:table-header-group">
                <tr className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-fg-dim">
                  <th scope="col" className="w-20 py-2 font-normal">Place</th>
                  <th scope="col" className="py-2 font-normal">Event</th>
                  <th scope="col" className="py-2 font-normal">Venue</th>
                  <th scope="col" className="w-16 py-2 text-right font-normal">Year</th>
                </tr>
              </thead>
              <tbody>
                {wins.map((w) => (
                  <tr key={`${w.event}-${w.venue}`} className="group border-t border-fg/[0.07] transition-colors duration-300 hover:bg-fg/[0.02]">
                    <td className="py-3.5 pr-3 align-top">
                      <span className={`inline-flex w-11 justify-center rounded-full py-0.5 font-mono text-[0.7rem] font-medium ${w.prize === '1st' ? 'bg-accent/[0.14] text-accent' : 'bg-fg/[0.07] text-fg-muted'}`}>
                        {w.prize}
                      </span>
                    </td>
                    <td className="py-3.5 pr-3 align-top">
                      <span className="text-[0.95rem] text-fg">{w.event}</span>
                      <span className="mt-0.5 block text-sm text-fg-dim sm:hidden">{w.venue}{w.year ? ` · ${w.year}` : ''}</span>
                    </td>
                    <td className="hidden py-3.5 pr-3 align-top text-sm text-fg-muted sm:table-cell">{w.venue}</td>
                    <td className="hidden py-3.5 text-right align-top font-mono text-sm text-fg-dim sm:table-cell">{w.year || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
