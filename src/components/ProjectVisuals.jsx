import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { FaBicycle, FaCarSide, FaPersonWalking } from 'react-icons/fa6'
import { TbRefresh } from 'react-icons/tb'
import cseHome from '../assets/cse-home.jpg'
import cseEvents from '../assets/cse-events.jpg'

/* ------------------------------------------------------------------ */
/* VISION X — the app's dashboard: detections on the feed, metrics,     */
/* per-class counts and the confidence threshold (drag it to filter).   */
/* ------------------------------------------------------------------ */
const DETECTIONS = [
  { cls: 'person', conf: 0.94, box: [8, 18, 13, 68], Icon: FaPersonWalking },
  { cls: 'person', conf: 0.87, box: [24, 30, 10, 56], Icon: FaPersonWalking },
  { cls: 'bicycle', conf: 0.72, box: [37, 56, 16, 30], Icon: FaBicycle },
  { cls: 'car', conf: 0.91, box: [56, 46, 28, 38], Icon: FaCarSide },
  { cls: 'person', conf: 0.61, box: [86, 32, 9, 50], Icon: FaPersonWalking },
]

function VisionDashboard() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })
  const [threshold, setThreshold] = useState(0.5)
  // stagger only the first reveal; threshold changes respond immediately
  const revealed = useRef(false)
  useEffect(() => {
    if (!inView) return
    const id = setTimeout(() => (revealed.current = true), 1200)
    return () => clearTimeout(id)
  }, [inView])
  const visible = DETECTIONS.filter((d) => d.conf >= threshold)
  const counts = Object.entries(
    visible.reduce((acc, d) => ({ ...acc, [d.cls]: (acc[d.cls] || 0) + 1 }), {})
  ).sort((x, y) => y[1] - x[1])
  const max = Math.max(1, ...counts.map(([, n]) => n))
  const kpis = [
    { label: 'Tracked', value: visible.length },
    { label: 'FPS', value: 30 },
    { label: 'Classes', value: counts.length },
  ]

  return (
    <div ref={ref} className="panel reg relative overflow-hidden !rounded-[22px] p-4 sm:p-6">
      <div className="flex items-center justify-between gap-3 font-mono text-[0.62rem] uppercase tracking-[0.16em]">
        <span className="flex items-center gap-2 text-fg-dim">
          <span className="anim-pulse h-1.5 w-1.5 rounded-full bg-[#ff7a6b]" aria-hidden="true" />
          Live · webcam
        </span>
        <span className="text-fg-dim">yolov8n · &lt; 50 ms</span>
      </div>

      {/* Feed */}
      <div
        className="relative mt-3 aspect-[16/8] overflow-hidden rounded-xl bg-[#05080b] shadow-[inset_0_0_0_1px_rgb(var(--fg)/0.08)]"
        style={{
          backgroundImage:
            'linear-gradient(rgb(var(--fg) / 0.04) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--fg) / 0.04) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
        role="img"
        aria-label={`Sample VISION X frame: ${visible.length} objects detected above ${Math.round(threshold * 100)}% confidence`}
      >
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-accent/[0.06] to-transparent" />
        {DETECTIONS.map((d, i) => {
          const [x, y, w, h] = d.box
          const on = d.conf >= threshold
          return (
            <motion.div
              key={i}
              aria-hidden="true"
              initial={{ opacity: 0, scale: 1.15 }}
              animate={inView ? { opacity: on ? 1 : 0.12, scale: 1 } : {}}
              transition={{ duration: 0.45, delay: revealed.current ? 0 : 0.2 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="absolute"
              style={{ left: `${x}%`, top: `${y}%`, width: `${w}%`, height: `${h}%` }}
            >
              <d.Icon className="absolute inset-[12%] h-[76%] w-[76%] text-signal/25" />
              <span className={`absolute inset-0 rounded-[3px] border ${on ? 'border-accent/90' : 'border-dashed border-fg/40'}`} />
              {on && (
                <span className={`absolute bottom-full mb-px whitespace-nowrap ${x + w > 80 ? 'right-[-1px]' : 'left-[-1px]'} rounded-sm bg-accent px-1 font-mono text-[0.5rem] leading-[1.4] text-[#03141a] sm:text-[0.58rem]`}>
                  {d.cls} {d.conf.toFixed(2)}
                </span>
              )}
            </motion.div>
          )
        })}
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_1fr]">
        <div>
          <dl className="grid grid-cols-3 gap-2">
            {kpis.map((k) => (
              <div key={k.label} className="flex flex-col-reverse rounded-xl bg-fg/[0.03] p-2.5 shadow-[inset_0_0_0_1px_rgb(var(--fg)/0.06)]">
                <dt className="mt-0.5 font-mono text-[0.56rem] uppercase tracking-[0.12em] text-fg-dim">{k.label}</dt>
                <dd className="font-display text-xl font-semibold tabular-nums text-fg">{k.value}</dd>
              </div>
            ))}
          </dl>
          <label className="mt-3 block">
            <span className="flex items-center justify-between font-mono text-[0.6rem] uppercase tracking-[0.12em] text-fg-dim">
              Confidence threshold
              <span className="tabular-nums text-accent">{threshold.toFixed(2)}</span>
            </span>
            <input
              type="range"
              min="0.3"
              max="0.95"
              step="0.05"
              value={threshold}
              onChange={(e) => setThreshold(parseFloat(e.target.value))}
              className="mt-2 w-full accent-[rgb(var(--accent))]"
            />
          </label>
        </div>
        <div>
          <p className="font-mono text-[0.6rem] uppercase tracking-[0.12em] text-fg-dim">Object counts</p>
          <ul className="mt-2 space-y-1.5">
            {counts.map(([cls, n]) => (
              <li key={cls} className="grid grid-cols-[4.5rem_1fr_1.5rem] items-center gap-2 font-mono text-[0.7rem]">
                <span className="text-fg-muted">{cls}</span>
                <span className="h-1.5 overflow-hidden rounded-full bg-fg/[0.08]" aria-hidden="true">
                  <span className="block h-full rounded-full bg-accent transition-[width] duration-500" style={{ width: `${(n / max) * 100}%` }} />
                </span>
                <span className="text-right tabular-nums text-fg">{n}</span>
              </li>
            ))}
            {!counts.length && <li className="font-mono text-[0.7rem] text-fg-dim">No objects above threshold</li>}
          </ul>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Reconciliation — a run that matches transactions to settlements      */
/* and flags what doesn't line up. Runs once in view; can be re-run.    */
/* ------------------------------------------------------------------ */
const RECON_ROWS = [
  { id: 'TXN-80412', amount: 1240.0, settled: 1240.0 },
  { id: 'TXN-80413', amount: 389.5, settled: 389.5 },
  { id: 'TXN-80414', amount: 2105.75, settled: 2085.75 },
  { id: 'TXN-80415', amount: 76.2, settled: 76.2 },
  { id: 'TXN-80416', amount: 954.0, settled: null },
  { id: 'TXN-80417', amount: 412.9, settled: 412.9 },
]
const money = (v) => v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

function reconStatus(r) {
  if (r.settled == null) return { ok: false, text: 'Missing' }
  if (r.settled !== r.amount) return { ok: false, text: `Δ ${money(r.amount - r.settled)}` }
  return { ok: true, text: 'Matched' }
}

function LedgerDashboard() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })
  const [step, setStep] = useState(0)
  const [run, setRun] = useState(0)

  useEffect(() => {
    if (!inView) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setStep(RECON_ROWS.length)
      return
    }
    let i = 0
    setStep(0)
    const id = setInterval(() => {
      i += 1
      setStep(i)
      if (i >= RECON_ROWS.length) clearInterval(id)
    }, 520)
    return () => clearInterval(id)
  }, [inView, run])

  const done = RECON_ROWS.slice(0, step)
  const matched = done.filter((r) => reconStatus(r).ok).length
  const flagged = done.length - matched
  const rate = done.length ? Math.round((matched / done.length) * 100) : 0
  const running = inView && step < RECON_ROWS.length
  const kpis = [
    { label: 'Matched', value: matched, tone: 'text-accent' },
    { label: 'Flagged', value: flagged, tone: 'text-[#ff7a6b]' },
    { label: 'Match rate', value: `${rate}%`, tone: 'text-fg', bar: rate },
  ]

  return (
    <div ref={ref} className="panel reg relative overflow-hidden !rounded-[22px] p-4 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-fg-dim">
            <span className={`h-1.5 w-1.5 rounded-full ${running ? 'anim-pulse bg-accent' : 'bg-accent'}`} aria-hidden="true" />
            Recon run · {running ? 'in progress' : 'complete'}
          </p>
          <p className="mt-1 truncate font-mono text-[0.72rem] text-fg-muted">transactions.csv ⇄ settlements.csv</p>
        </div>
        <button
          type="button"
          onClick={() => setRun((n) => n + 1)}
          disabled={running}
          className="inline-flex min-h-[34px] flex-shrink-0 items-center gap-1.5 rounded-full bg-fg/[0.05] px-3 font-mono text-[0.64rem] uppercase tracking-[0.12em] text-fg-muted shadow-[inset_0_0_0_1px_rgb(var(--fg)/0.12)] transition-colors hover:text-fg disabled:opacity-40"
        >
          <TbRefresh aria-hidden="true" size={13} className={running ? 'animate-spin' : ''} />
          Re-run
        </button>
      </div>

      <dl className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
        {kpis.map((k) => (
          <div key={k.label} className="relative flex flex-col-reverse rounded-xl bg-fg/[0.03] p-3 shadow-[inset_0_0_0_1px_rgb(var(--fg)/0.06)]">
            {k.bar !== undefined && (
              <div className="absolute inset-x-3 bottom-1.5 h-[3px] overflow-hidden rounded-full bg-fg/[0.08]" aria-hidden="true">
                <div className="h-full rounded-full bg-accent transition-[width] duration-500" style={{ width: `${k.bar}%` }} />
              </div>
            )}
            <dt className="mt-1 font-mono text-[0.56rem] uppercase tracking-[0.12em] text-fg-dim sm:text-[0.6rem]">{k.label}</dt>
            <dd className={`font-display text-xl font-semibold tabular-nums sm:text-2xl ${k.tone}`}>{k.value}</dd>
          </div>
        ))}
      </dl>

      <table className="mt-4 w-full border-collapse text-left font-mono text-[0.66rem] sm:text-[0.74rem]">
        <caption className="sr-only">Sample reconciliation run: each transaction compared with its settlement</caption>
        <thead>
          <tr className="text-[0.56rem] uppercase tracking-[0.12em] text-fg-dim sm:text-[0.6rem]">
            <th scope="col" className="py-1.5 font-normal">Txn</th>
            <th scope="col" className="py-1.5 text-right font-normal">Amount</th>
            <th scope="col" className="py-1.5 text-right font-normal">Settled</th>
            <th scope="col" className="py-1.5 pl-2 text-right font-normal">Status</th>
          </tr>
        </thead>
        <tbody>
          {RECON_ROWS.map((r, i) => {
            const st = reconStatus(r)
            const checked = i < step
            const checking = i === step && running && inView
            return (
              <tr key={r.id} className={`border-t border-fg/[0.07] transition-colors duration-300 ${checking ? 'bg-accent/[0.05]' : ''}`}>
                <td className="py-2 text-fg-muted">{r.id}</td>
                <td className="py-2 text-right tabular-nums text-fg">{money(r.amount)}</td>
                <td className="py-2 text-right tabular-nums text-fg-muted">{r.settled == null ? '—' : money(r.settled)}</td>
                <td className="py-2 pl-2 text-right">
                  {checked ? (
                    <span className={`inline-block rounded-full px-2 py-0.5 text-[0.58rem] uppercase tracking-[0.08em] sm:text-[0.62rem] ${st.ok ? 'bg-accent/[0.12] text-accent' : 'bg-[#ff7a6b]/[0.12] text-[#ff7a6b]'}`}>
                      {st.text}
                    </span>
                  ) : (
                    <span className={`text-[0.6rem] uppercase tracking-[0.08em] ${checking ? 'anim-pulse text-accent' : 'text-fg-dim'}`}>
                      {checking ? 'Checking' : 'Queued'}
                    </span>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Robot car — real footage of each control mode (from the project repo) */
/* ------------------------------------------------------------------ */
const MEDIA = `${import.meta.env.BASE_URL}media/`
const MODES = [
  { id: 'gesture', label: 'Gesture', caption: 'Hand-gesture control' },
  { id: 'voice', label: 'Voice', caption: 'Voice commands from a phone' },
  { id: 'bluetooth', label: 'Bluetooth', caption: 'Bluetooth remote from a phone' },
]

function RobotVideo() {
  const [mode, setMode] = useState('gesture')
  const [paused, setPaused] = useState(false)
  const [inView, setInView] = useState(false)
  const video = useRef(null)
  const frame = useRef(null)
  const current = MODES.find((m) => m.id === mode)

  // Only load and play while on screen; respect reduced motion
  useEffect(() => {
    const el = frame.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) setPaused(true)
  }, [])

  useEffect(() => {
    const v = video.current
    if (!v) return
    if (inView && !paused) v.play().catch(() => {})
    else v.pause()
  }, [inView, paused, mode])

  return (
    <div>
      <div ref={frame} className="panel reg relative overflow-hidden !rounded-[22px] bg-black" style={{ aspectRatio: '16 / 10' }}>
        <video
          ref={video}
          key={mode}
          src={inView || paused ? `${MEDIA}robot-${mode}.mp4` : undefined}
          poster={`${MEDIA}robot-${mode}.jpg`}
          muted
          loop
          playsInline
          preload="none"
          className="absolute inset-0 h-full w-full object-cover"
          aria-label={`3-in-1 IoT Robot Car demo video — ${current.caption.toLowerCase()}`}
        />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4 text-[0.68rem] uppercase tracking-[0.16em] text-white/90">
          <span className="flex items-center gap-2">
            <span className={`h-1.5 w-1.5 rounded-full ${paused ? 'bg-white/50' : 'anim-pulse bg-[#ff7a6b]'}`} aria-hidden="true" />
            Mode · {current.label}
          </span>
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            className="pointer-events-auto rounded-full bg-black/40 px-3 py-1.5 text-[0.66rem] uppercase tracking-[0.14em] text-white backdrop-blur hover:bg-black/60"
            aria-label={paused ? 'Play video' : 'Pause video'}
          >
            {paused ? 'Play' : 'Pause'}
          </button>
        </div>
        <p className="absolute inset-x-0 bottom-0 p-4 text-sm text-white">{current.caption}</p>
      </div>
      <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Control mode">
        {MODES.map((md) => (
          <button
            key={md.id}
            type="button"
            onClick={() => setMode(md.id)}
            aria-pressed={mode === md.id}
            className={`min-h-[40px] rounded-full px-4 text-[0.72rem] uppercase tracking-[0.12em] transition-[background-color,color,box-shadow] duration-300 ${
              mode === md.id ? 'bg-accent text-canvas' : 'bg-fg/[0.05] text-fg-muted shadow-[inset_0_0_0_1px_rgb(var(--fg)/0.12)] hover:text-fg'
            }`}
          >
            {md.label}
          </button>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* CSE Department site — real screens in dimensional browser frames     */
/* ------------------------------------------------------------------ */
function Browser({ src, alt, className = '', style }) {
  return (
    <div className={`overflow-hidden rounded-xl bg-raised shadow-lift ${className}`} style={style}>
      <div className="flex items-center gap-1.5 border-b border-fg/[0.08] px-3 py-2" aria-hidden="true">
        <span className="h-2 w-2 rounded-full bg-fg/20" />
        <span className="h-2 w-2 rounded-full bg-fg/20" />
        <span className="h-2 w-2 rounded-full bg-fg/20" />
        <span className="ml-3 h-3 flex-1 rounded bg-fg/[0.06]" />
      </div>
      <img src={src} alt={alt} loading="lazy" decoding="async" width="1200" height="750" className="block w-full" />
    </div>
  )
}

function ScreensVisual() {
  const wrap = useRef(null)
  useEffect(() => {
    const el = wrap.current
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
        el.style.setProperty('--rx', `${(-y * 8).toFixed(2)}deg`)
        el.style.setProperty('--ry', `${(x * 10 - 14).toFixed(2)}deg`)
      })
    }
    const onLeave = () => { el.style.setProperty('--rx', '6deg'); el.style.setProperty('--ry', '-14deg') }
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => { cancelAnimationFrame(raf); el.removeEventListener('pointermove', onMove); el.removeEventListener('pointerleave', onLeave) }
  }, [])

  return (
    <div className="panel reg relative overflow-hidden !rounded-[22px] [perspective:1400px]" style={{ aspectRatio: '16 / 10' }}>
      <div
        ref={wrap}
        className="absolute inset-0 transition-transform duration-700 ease-out [transform-style:preserve-3d]"
        style={{ '--rx': '6deg', '--ry': '-14deg', transform: 'rotateX(var(--rx)) rotateY(var(--ry))' }}
      >
        <Browser
          src={cseEvents}
          alt="Events timeline page of the CSE Departmental Association website"
          className="absolute right-[6%] top-[12%] w-[64%] opacity-80"
          style={{ transform: 'translateZ(-60px)' }}
        />
        <Browser
          src={cseHome}
          alt="Home page of the CSE Departmental Association website — Tech Matrix, CSE Students Association"
          className="absolute bottom-[10%] left-[6%] w-[66%]"
          style={{ transform: 'translateZ(40px)' }}
        />
      </div>
    </div>
  )
}

export function ProjectVisual({ kind }) {
  if (kind === 'vision') return <VisionDashboard />
  if (kind === 'ledger') return <LedgerDashboard />
  if (kind === 'robot') return <RobotVideo />
  return <ScreensVisual />
}
