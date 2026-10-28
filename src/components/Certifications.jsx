import { motion } from 'framer-motion'
import Reveal from './ui/Reveal'
import { certifications } from '../data/profile'

const MARK = {
  'IIT Madras (NPTEL)': 'NPTEL',
  'Infosys Springboard': 'INF',
  'Microsoft & LinkedIn': 'MS',
  LinkedIn: 'IN',
  HackerRank: 'HR',
  'NIT Trichy': 'NIT',
}

// Group certifications by issuer, preserving first-seen order
const groups = certifications.reduce((acc, c) => {
  const g = acc.find((x) => x.org === c.org)
  const m = c.name.match(/^(.*?)\s*\((\d+(?:\.\d+)?)%\)$/)
  const item = m ? { name: m[1], score: parseFloat(m[2]) } : { name: c.name }
  if (g) g.items.push(item)
  else acc.push({ org: c.org, items: [item] })
  return acc
}, [])

function Hex({ text }) {
  return (
    <svg viewBox="0 0 64 64" className="h-12 w-12 flex-shrink-0" aria-hidden="true">
      <path d="M32 4 56.2 18v28L32 60 7.8 46V18Z" className="fill-accent/[0.06] stroke-accent/60" strokeWidth="1.5" strokeLinejoin="round" />
      <text x="32" y="36" textAnchor="middle" fontSize={text.length > 3 ? 10 : 13} fontWeight="600" className="fill-fg" style={{ fontFamily: '"Chakra Petch", sans-serif' }}>
        {text}
      </text>
    </svg>
  )
}

export default function Certifications() {
  return (
    <div className="mt-12">
      <Reveal className="flex flex-wrap items-baseline justify-between gap-4">
        <h3 className="text-2xl font-semibold text-fg sm:text-3xl">Credentials</h3>
        <p className="text-[0.66rem] uppercase tracking-[0.16em] text-fg-dim">
          {certifications.length} certifications · {groups.length} issuers
        </p>
      </Reveal>

      <ul className="mt-6 grid gap-px overflow-hidden rounded-2xl bg-fg/[0.09] sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((g, gi) => (
          <Reveal as="li" key={g.org} delay={(gi % 3) * 0.05} className="group bg-canvas p-5 transition-colors duration-500 hover:bg-surface sm:p-6">
            <div className="flex items-center gap-4">
              <Hex text={MARK[g.org] || g.org.slice(0, 3).toUpperCase()} />
              <div>
                <p className="font-display text-lg font-semibold leading-tight text-fg">{g.org}</p>
                <p className="text-[0.62rem] uppercase tracking-[0.14em] text-fg-dim">{g.items.length} credential{g.items.length > 1 ? 's' : ''}</p>
              </div>
            </div>
            <ul className="mt-5 space-y-3">
              {g.items.map((it) => (
                <li key={it.name}>
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-[0.88rem] leading-snug text-fg-muted transition-colors duration-300 group-hover:text-fg">{it.name}</span>
                    {it.score && <span className="flex-shrink-0 text-[0.8rem] font-semibold text-accent">{it.score}%</span>}
                  </div>
                  {it.score && (
                    <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-fg/[0.08]" aria-hidden="true">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${it.score}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        className="h-full rounded-full bg-accent"
                      />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </ul>
    </div>
  )
}
