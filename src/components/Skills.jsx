import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  SiReact, SiVite, SiTypescript, SiJavascript, SiNodedotjs, SiExpress, SiFlask, SiGraphql,
  SiPostgresql, SiHasura, SiMysql, SiAwslambda, SiAmazonapigateway, SiDocker, SiGithubactions,
  SiPython, SiOpencv, SiPandas, SiNumpy, SiPostman, SiBruno, SiTermius,
} from 'react-icons/si'
import { TbApi, TbScan, TbTestPipe, TbChartBar } from 'react-icons/tb'
import SectionHeader from './ui/SectionHeader'
import Reveal from './ui/Reveal'
import Logo from './Logo'
import { stackLayers } from '../data/profile'

// Brand marks via Simple Icons; neutral glyphs where no brand mark exists.
const ICONS = {
  React: SiReact, Vite: SiVite, TypeScript: SiTypescript, JavaScript: SiJavascript,
  'Node.js': SiNodedotjs, Express: SiExpress, Flask: SiFlask, GraphQL: SiGraphql, REST: TbApi,
  PostgreSQL: SiPostgresql, Hasura: SiHasura, MySQL: SiMysql,
  'AWS Lambda': SiAwslambda, 'API Gateway': SiAmazonapigateway, Docker: SiDocker, 'GitHub Actions': SiGithubactions,
  Python: SiPython, YOLOv8: TbScan, OpenCV: SiOpencv, Pandas: SiPandas, NumPy: SiNumpy,
  Postman: SiPostman, Bruno: SiBruno, SoapUI: TbTestPipe, Termius: SiTermius, 'Power BI': TbChartBar,
}

const total = stackLayers.reduce((n, l) => n + l.tools.length, 0)
const N = stackLayers.length
const C = 500 // viewBox centre (1000 × 1000)
const R_CAT = 190
const R_IN = 330
const R_OUT = 430

const polar = (r, deg) => {
  const a = (deg * Math.PI) / 180
  return [C + Math.cos(a) * r, C + Math.sin(a) * r]
}

function wedge(r0, r1, a0, a1) {
  const [x0, y0] = polar(r0, a0)
  const [x1, y1] = polar(r1, a0)
  const [x2, y2] = polar(r1, a1)
  const [x3, y3] = polar(r0, a1)
  return `M${x0} ${y0} L${x1} ${y1} A${r1} ${r1} 0 0 1 ${x2} ${y2} L${x3} ${y3} A${r0} ${r0} 0 0 0 ${x0} ${y0} Z`
}

// Radial layout: six sectors; tools alternate between two rings so labels never collide.
function useLayout() {
  return useMemo(
    () =>
      stackLayers.map((layer, i) => {
        const span = 360 / N
        const a0 = -90 - span / 2 + i * span
        const mid = a0 + span / 2
        const step = (span - 10) / layer.tools.length
        const tools = layer.tools.map((name, j) => {
          const ang = mid + (j - (layer.tools.length - 1) / 2) * step
          const r = j % 2 ? R_IN : R_OUT
          const [x, y] = polar(r, ang)
          return { name, x, y }
        })
        const [cx, cy] = polar(R_CAT, mid)
        return { ...layer, index: i, a0, a1: a0 + span, cx, cy, tools }
      }),
    []
  )
}

function RadialMap({ layout, active, setActive, tool, setTool }) {
  const stage = useRef(null)
  const tilt = useRef(null)

  useEffect(() => {
    const el = stage.current
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!el || !fine || reduced) return
    let raf = 0
    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width - 0.5
      const y = (e.clientY - r.top) / r.height - 0.5
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        tilt.current.style.transform = `rotateX(${(-y * 10).toFixed(2)}deg) rotateY(${(x * 10).toFixed(2)}deg)`
      })
    }
    const onLeave = () => {
      cancelAnimationFrame(raf)
      tilt.current.style.transform = 'rotateX(0deg) rotateY(0deg)'
    }
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <div ref={stage} className="[perspective:1600px]" data-figure data-visible="true">
      <div ref={tilt} className="relative aspect-square w-full transition-transform duration-700 ease-out [transform-style:preserve-3d]">
        <svg viewBox="0 0 1000 1000" className="absolute inset-0 h-full w-full" aria-hidden="true">
          {[R_CAT, R_IN, R_OUT].map((r) => (
            <circle key={r} cx={C} cy={C} r={r} fill="none" className="stroke-fg/[0.08]" strokeDasharray="2 7" />
          ))}
          {layout.map((g) => {
            const on = g.index === active
            return (
              <g key={g.id}>
                <path d={wedge(70, 470, g.a0 + 1, g.a1 - 1)} className={`transition-[fill] duration-500 ${on ? 'fill-accent/[0.07]' : 'fill-transparent'}`} />
                <line x1={C} y1={C} x2={g.cx} y2={g.cy} strokeWidth={on ? 1.6 : 1} className={on ? 'stroke-accent' : 'stroke-fg/[0.14]'} />
                {g.tools.map((t) => {
                  const hot = on && (!tool || tool === t.name)
                  return (
                    <line
                      key={t.name}
                      x1={g.cx} y1={g.cy} x2={t.x} y2={t.y}
                      strokeWidth={hot ? 1.4 : 1}
                      className={`transition-[stroke] duration-300 ${hot ? 'stroke-accent/80' : 'stroke-fg/[0.1]'}`}
                    />
                  )
                })}
                {on && (
                  <circle r="5" className="packet-dot fill-accent">
                    <animateMotion dur="2.2s" repeatCount="indefinite" path={`M${C} ${C} L${g.cx} ${g.cy}`} />
                  </circle>
                )}
              </g>
            )
          })}
        </svg>

        {/* centre */}
        <div className="absolute left-1/2 top-1/2 grid -translate-x-1/2 -translate-y-1/2 place-items-center text-center">
          <Logo size={56} animated={false} />
          <p className="mt-2 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-fg-dim">{total} tools</p>
        </div>

        {/* categories */}
        {layout.map((g) => {
          const on = g.index === active
          return (
            <button
              key={g.id}
              type="button"
              onMouseEnter={() => { setActive(g.index); setTool(null) }}
              onFocus={() => { setActive(g.index); setTool(null) }}
              onClick={() => { setActive(g.index); setTool(null) }}
              aria-pressed={on}
              className={`absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full px-3.5 py-1.5 font-display text-[0.85rem] font-semibold transition-[background-color,color,box-shadow] duration-300 ${
                on ? 'bg-accent text-canvas' : 'bg-raised text-fg shadow-[inset_0_0_0_1px_rgb(var(--fg)/0.14)] hover:shadow-[inset_0_0_0_1px_rgb(var(--accent)/0.7)]'
              }`}
              style={{ left: `${g.cx / 10}%`, top: `${g.cy / 10}%` }}
            >
              {g.title}
            </button>
          )
        })}

        {/* tools (the side panel and mobile list carry the same content accessibly) */}
        {layout.map((g) =>
          g.tools.map((t) => {
            const Icon = ICONS[t.name]
            const on = g.index === active
            return (
              <div
                key={t.name}
                aria-hidden="true"
                onMouseEnter={() => { setActive(g.index); setTool(t.name) }}
                onMouseLeave={() => setTool(null)}
                className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1"
                style={{ left: `${t.x / 10}%`, top: `${t.y / 10}%` }}
              >
                <span
                  className={`grid h-10 w-10 place-items-center rounded-full bg-surface transition-[box-shadow,color,transform] duration-300 ${
                    tool === t.name ? 'scale-110 text-accent shadow-[inset_0_0_0_1.5px_rgb(var(--accent))]' : on ? 'text-fg shadow-[inset_0_0_0_1px_rgb(var(--accent)/0.6)]' : 'text-fg-muted shadow-[inset_0_0_0_1px_rgb(var(--fg)/0.12)]'
                  }`}
                >
                  {Icon && <Icon size={17} />}
                </span>
                <span className={`whitespace-nowrap font-mono text-[0.62rem] transition-colors duration-300 ${on ? 'text-fg' : 'text-fg-dim'}`}>{t.name}</span>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default function Skills() {
  const layout = useLayout()
  const [active, setActive] = useState(0)
  const [tool, setTool] = useState(null)
  const layer = layout[active]

  return (
    <section id="stack" tabIndex={-1} aria-labelledby="stack-title" className="section">
      <div className="shell">
        <SectionHeader
          index="02"
          label="Tech arsenal"
          id="stack-title"
          title="Tools I engineer with"
          lede={`${total} technologies in ${N} domains, from interface to intelligence.`}
        />

        {/* Radial map + detail panel (large screens) */}
        <Reveal className="hidden items-center gap-10 lg:grid lg:grid-cols-12">
          <div className="lg:col-span-7">
            <RadialMap layout={layout} active={active} setActive={setActive} tool={tool} setTool={setTool} />
          </div>
          <div className="lg:col-span-5">
            <div className="panel p-7" aria-live="polite">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={layer.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-fg-dim">
                    domain {String(active + 1).padStart(2, '0')} / {String(N).padStart(2, '0')}
                  </p>
                  <h3 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-fg">{layer.title}</h3>
                  <ul className="mt-6 grid grid-cols-2 gap-2.5">
                    {layer.tools.map((t) => {
                      const Icon = ICONS[t.name]
                      return (
                        <li
                          key={t.name}
                          className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm transition-colors duration-300 ${
                            tool === t.name ? 'bg-accent/[0.12] text-fg' : 'bg-fg/[0.04] text-fg-muted'
                          }`}
                        >
                          {Icon && <Icon aria-hidden="true" size={17} className="flex-shrink-0 text-fg" />}
                          {t.name}
                        </li>
                      )
                    })}
                  </ul>
                </motion.div>
              </AnimatePresence>
              <div className="mt-7 flex flex-wrap gap-1.5 border-t border-fg/[0.08] pt-5" role="group" aria-label="Choose a domain">
                {layout.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => { setActive(g.index); setTool(null) }}
                    aria-pressed={g.index === active}
                    className={`min-h-[32px] rounded-full px-3 py-1.5 font-mono text-[0.68rem] uppercase tracking-[0.12em] transition-colors duration-300 ${
                      g.index === active ? 'bg-fg text-canvas' : 'bg-fg/[0.05] text-fg-muted hover:text-fg'
                    }`}
                  >
                    {g.title}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        {/* Categorised list (touch / smaller screens) */}
        <div className="grid gap-4 sm:grid-cols-2 lg:hidden">
          {layout.map((g) => (
            <Reveal key={g.id} className="panel p-5">
              <h3 className="flex items-baseline justify-between text-lg font-semibold text-fg">
                {g.title}
                <span className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-fg-dim">{g.tools.length} tools</span>
              </h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {g.tools.map((t) => {
                  const Icon = ICONS[t.name]
                  return (
                    <li key={t.name} className="flex items-center gap-2 rounded-full bg-fg/[0.05] px-3 py-1.5 text-sm text-fg-muted">
                      {Icon && <Icon aria-hidden="true" size={14} className="text-fg" />}
                      {t.name}
                    </li>
                  )
                })}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
