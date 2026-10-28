import { useEffect, useRef, useState } from 'react'
import cseHome from '../assets/cse-home.jpg'
import cseEvents from '../assets/cse-events.jpg'

const ACCENT = '#2ee5ff'
const ICE = '#b8e6ff'
const FG = '237,238,240'
const ALERT = '#ff7a6b'
const MONO = '500 11px "JetBrains Mono", ui-monospace, monospace'

/* ------------------------------------------------------------------ */
/* Shared canvas loop: DPR-aware, pauses off screen, one frame for      */
/* reduced motion, pointer position in CSS pixels.                      */
/* ------------------------------------------------------------------ */
function useCanvas(draw, deps = []) {
  const ref = useRef(null)
  const pointer = useRef({ x: 0, y: 0, inside: false, clicks: [] })

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let w = 0, h = 0, raf = 0, visible = false, t = 0, last = 0
    const state = {}

    const resize = () => {
      const r = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = r.width
      h = r.height
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      if (reduced || !visible) frame(performance.now())
    }
    const frame = (now) => {
      const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016)
      last = now
      t += reduced ? 0 : dt
      ctx.clearRect(0, 0, w, h)
      draw(ctx, { w, h, t: reduced ? 2.5 : t, dt: reduced ? 0 : dt, state, pointer: pointer.current, reduced })
      pointer.current.clicks.length = 0
      if (visible && !reduced) raf = requestAnimationFrame(frame)
    }
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      cancelAnimationFrame(raf)
      last = 0
      if (visible) raf = requestAnimationFrame(frame)
    })
    const ro = new ResizeObserver(resize)
    const local = (e) => {
      const r = canvas.getBoundingClientRect()
      return { x: e.clientX - r.left, y: e.clientY - r.top }
    }
    const onMove = (e) => Object.assign(pointer.current, local(e), { inside: true })
    const onLeave = () => (pointer.current.inside = false)
    const onDown = (e) => {
      const p = local(e)
      Object.assign(pointer.current, p, { inside: true })
      pointer.current.clicks.push(p)
      if (reduced) frame(performance.now())
    }
    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('pointerleave', onLeave)
    canvas.addEventListener('pointerdown', onDown)
    ro.observe(canvas)
    io.observe(canvas)
    resize()
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerleave', onLeave)
      canvas.removeEventListener('pointerdown', onDown)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return ref
}

function Stage({ children, label, ratio = '16 / 10' }) {
  return (
    <div className="panel reg relative overflow-hidden !rounded-[22px]" style={{ aspectRatio: ratio }} role="img" aria-label={label}>
      {children}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* VISION X — objects are detected, boxed, tracked and counted          */
/* ------------------------------------------------------------------ */
function VisionSim() {
  const ref = useCanvas((ctx, { w, h, t, dt, state, pointer }) => {
    if (!state.objs) {
      state.objs = Array.from({ length: 5 }, (_, i) => ({
        x: (0.2 + i * 0.15) * w, y: (0.45 + (i % 2) * 0.25) * h,
        vx: (i % 2 ? -1 : 1) * (24 + i * 9), vy: (i % 3 - 1) * 14,
        r: 10 + (i % 3) * 5, bx: 0, by: 0, id: i + 1,
      }))
      state.objs.forEach((o) => { o.bx = o.x; o.by = o.y })
      state.you = { bx: w / 2, by: h / 2 }
    }
    const horizon = h * 0.36
    // perspective floor
    ctx.strokeStyle = `rgba(${FG},0.07)`
    ctx.lineWidth = 1
    for (let i = -8; i <= 8; i++) {
      ctx.beginPath(); ctx.moveTo(w / 2, horizon); ctx.lineTo(w / 2 + i * w * 0.16, h); ctx.stroke()
    }
    for (let i = 1; i < 9; i++) {
      const y = horizon + (h - horizon) * Math.pow(i / 9, 1.8)
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke()
    }
    const objs = state.objs
    const tracked = [...objs]
    if (pointer.inside) tracked.push({ x: pointer.x, y: pointer.y, r: 16, you: true, ...state.you })
    for (const o of objs) {
      o.x += o.vx * dt; o.y += o.vy * dt
      if (o.x < o.r || o.x > w - o.r) o.vx *= -1
      if (o.y < horizon + o.r || o.y > h - o.r) o.vy *= -1
      o.x = Math.min(w - o.r, Math.max(o.r, o.x)); o.y = Math.min(h - o.r, Math.max(horizon + o.r, o.y))
    }
    for (const o of tracked) {
      const k = 1 - Math.exp(-dt * 10)
      const target = o.you ? state.you : o
      target.bx += (o.x - target.bx) * (dt ? k : 1)
      target.by += (o.y - target.by) * (dt ? k : 1)
      // object
      const g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r * 1.8)
      g.addColorStop(0, o.you ? 'rgba(46,229,255,0.9)' : 'rgba(223,246,255,0.95)')
      g.addColorStop(1, 'rgba(46,229,255,0)')
      ctx.fillStyle = g
      ctx.beginPath(); ctx.arc(o.x, o.y, o.r * 1.8, 0, Math.PI * 2); ctx.fill()
      // box
      const s = o.r * 1.7
      const bx = target.bx - s, by = target.by - s
      ctx.strokeStyle = o.you ? ACCENT : 'rgba(184,230,255,0.85)'
      ctx.lineWidth = 1.25
      ctx.strokeRect(bx, by, s * 2, s * 2)
      const label = o.you ? 'you · tracked' : `obj ${String(o.id).padStart(2, '0')}`
      ctx.font = MONO
      const tw = ctx.measureText(label).width + 10
      ctx.fillStyle = o.you ? ACCENT : 'rgba(184,230,255,0.9)'
      ctx.fillRect(bx, by - 16, tw, 15)
      ctx.fillStyle = '#05080a'
      ctx.fillText(label, bx + 5, by - 5)
    }
    // scan line
    const sy = horizon + ((t * 0.35) % 1) * (h - horizon)
    const sg = ctx.createLinearGradient(0, sy - 30, 0, sy)
    sg.addColorStop(0, 'rgba(46,229,255,0)'); sg.addColorStop(1, 'rgba(46,229,255,0.16)')
    ctx.fillStyle = sg; ctx.fillRect(0, sy - 30, w, 30)
    ctx.fillStyle = 'rgba(46,229,255,0.6)'; ctx.fillRect(0, sy, w, 1)
    // HUD
    ctx.font = MONO
    ctx.fillStyle = ALERT
    ctx.beginPath(); ctx.arc(22, 24, 4, 0, Math.PI * 2); ctx.fill()
    ctx.fillStyle = `rgba(${FG},0.85)`
    ctx.fillText('LIVE · 30 FPS · YOLOv8', 34, 28)
    const count = `tracked ${tracked.length}`
    ctx.fillText(count, w - ctx.measureText(count).width - 18, 28)
  })
  return (
    <Stage label="Simulation of VISION X tracking and counting moving objects; your pointer is tracked too">
      <canvas ref={ref} className="absolute inset-0 h-full w-full cursor-crosshair" />
    </Stage>
  )
}

/* ------------------------------------------------------------------ */
/* Reconciliation — settlements matched to transactions, mismatches flagged */
/* ------------------------------------------------------------------ */
function LedgerSim() {
  const ref = useCanvas((ctx, { w, h, dt, state, pointer }) => {
    const rowH = 30, gap = 14
    if (!state.rows) {
      state.rows = []
      state.spawn = 0
      for (let i = 0; i < 9; i++) state.rows.push(makeRow(h - i * (rowH + gap) - 40, i % 5 === 3))
    }
    function makeRow(y, bad) {
      const a = 0.35 + Math.random() * 0.55
      return { y, a, b: bad ? Math.max(0.2, a - 0.12 - Math.random() * 0.2) : a, bad }
    }
    pointer.clicks.forEach(() => state.rows.push(makeRow(h + 10, true))) // inject a mismatch
    state.spawn -= dt
    if (state.spawn <= 0) {
      state.rows.push(makeRow(h + 10, Math.random() < 0.18))
      state.spawn = (rowH + gap) / 26
    }
    const colW = Math.min(220, w * 0.3)
    const lx = w * 0.08, rx = w - w * 0.08 - colW
    ctx.font = MONO
    ctx.fillStyle = `rgba(${FG},0.55)`
    ctx.fillText('SETTLEMENTS', lx, 26)
    const tr = 'TRANSACTIONS'
    ctx.fillText(tr, rx + colW - ctx.measureText(tr).width, 26)
    for (const r of state.rows) {
      r.y -= dt * 26
      if (r.y < 40) continue
      const fade = Math.min(1, (r.y - 40) / 60) * Math.min(1, (h - r.y + 20) / 40)
      ctx.globalAlpha = Math.max(0, fade)
      for (const [x, v] of [[lx, r.a], [rx, r.b]]) {
        ctx.fillStyle = 'rgba(25,28,34,0.95)'
        ctx.strokeStyle = `rgba(${FG},0.12)`
        ctx.beginPath(); ctx.roundRect(x, r.y, colW, rowH, 7); ctx.fill(); ctx.stroke()
        ctx.fillStyle = r.bad && x === rx ? ALERT : `rgba(${FG},0.35)`
        ctx.fillRect(x + 10, r.y + 13, (colW - 20) * v, 4)
      }
      const y = r.y + rowH / 2
      ctx.strokeStyle = r.bad ? ALERT : ACCENT
      ctx.setLineDash(r.bad ? [4, 5] : [])
      ctx.lineWidth = 1.25
      ctx.beginPath(); ctx.moveTo(lx + colW, y); ctx.bezierCurveTo(w / 2, y, w / 2, y, rx, y); ctx.stroke()
      ctx.setLineDash([])
      ctx.fillStyle = r.bad ? ALERT : ACCENT
      const tag = r.bad ? 'FLAGGED' : 'MATCHED'
      const tw = ctx.measureText(tag).width + 14
      ctx.beginPath(); ctx.roundRect(w / 2 - tw / 2, y - 9, tw, 18, 9); ctx.fill()
      ctx.fillStyle = '#05080a'
      ctx.fillText(tag, w / 2 - tw / 2 + 7, y + 4)
      ctx.globalAlpha = 1
    }
    state.rows = state.rows.filter((r) => r.y > -40)
  })
  return (
    <Stage label="Simulation of the reconciliation engine matching settlements to transactions and flagging mismatches">
      <canvas ref={ref} className="absolute inset-0 h-full w-full cursor-pointer" />
    </Stage>
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
  if (kind === 'vision') return <VisionSim />
  if (kind === 'ledger') return <LedgerSim />
  if (kind === 'robot') return <RobotVideo />
  return <ScreensVisual />
}
