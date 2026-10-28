import { TbArrowUpRight } from 'react-icons/tb'
import SectionHeader from './ui/SectionHeader'
import Reveal from './ui/Reveal'
import { research, hackathons } from '../data/profile'

const mono = { fontFamily: '"JetBrains Mono", ui-monospace, monospace' }

/* Method visuals — illustrative diagrams of each paper's approach (not results) */

// WavDino: speech + facial frames, temporal attention across frames, fused into an emotion.
function AttentionVisual() {
  const bars = Array.from({ length: 50 }, (_, i) => 6 + Math.abs(Math.sin(i * 0.55) * Math.cos(i * 0.21)) * 26)
  const frames = Array.from({ length: 12 }, (_, i) => i)
  return (
    <svg viewBox="0 0 520 290" className="h-auto w-full" role="img" aria-label="Illustration: speech waveform and twelve facial frames weighted by temporal attention, fused into an emotion prediction">
      <g style={mono} fontSize="9" className="fill-fg-dim" letterSpacing="1.5">
        <text x="20" y="24">SPEECH</text>
        <text x="20" y="104">FACIAL FRAMES · 8–16</text>
        <text x="20" y="196">TEMPORAL ATTENTION</text>
      </g>
      {bars.map((h, i) => (
        <rect key={i} x={20 + i * 7.4} y={56 - h / 2} width="3.2" height={h} rx="1.6" className="fill-signal/70" />
      ))}
      {frames.map((i) => (
        <g key={i}>
          <rect x={20 + i * 30} y="116" width="25" height="34" rx="4" className="fill-fg/[0.05] stroke-fg/20" strokeWidth="1" />
          <circle cx={32.5 + i * 30} cy="129" r="5" className="fill-none stroke-fg/40" strokeWidth="1" />
          <path d={`M${26.5 + i * 30} 143 q6 4 12 0`} fill="none" className="stroke-fg/40" strokeWidth="1" />
          <rect
            x={24 + i * 30}
            y="208"
            width="17"
            height="40"
            rx="3"
            className="anim-attn fill-accent"
            style={{ transformBox: 'fill-box', transformOrigin: 'bottom', animationDelay: `${(i * 0.23) % 2.4}s` }}
          />
        </g>
      ))}
      <path d="M394 56 C450 56 450 145 478 145 M384 133 L478 145 M384 228 C450 228 450 145 478 145" fill="none" className="stroke-fg/25" strokeWidth="1" />
      <circle cx="488" cy="145" r="10" className="fill-accent/20 stroke-accent" strokeWidth="1.5" />
      <text x="488" y="172" textAnchor="middle" fontSize="9" letterSpacing="1.5" className="fill-accent" style={mono}>FUSION</text>
      <text x="488" y="186" textAnchor="middle" fontSize="9" letterSpacing="1.2" className="fill-fg-dim" style={mono}>EMOTION</text>
    </svg>
  )
}

// Temporal ViT: frames split into patches; a sweep across time feeds the transformer.
function PatchVisual() {
  const frames = [0, 1, 2, 3]
  return (
    <svg viewBox="0 0 520 290" className="h-auto w-full" role="img" aria-label="Illustration: video frames split into patches, attended across time by a Vision Transformer to recognise emotion">
      <g style={mono} fontSize="9" className="fill-fg-dim" letterSpacing="1.5">
        <text x="20" y="24">FRAMES → PATCHES</text>
        <text x="20" y="206">PATCH TOKENS</text>
      </g>
      {frames.map((f) => (
        <g key={f} transform={`translate(${20 + f * 96} ${40 + f * 8})`}>
          {Array.from({ length: 16 }, (_, k) => (
            <rect
              key={k}
              x={(k % 4) * 19}
              y={Math.floor(k / 4) * 19}
              width="17"
              height="17"
              rx="2"
              className={`fill-fg/[0.06] stroke-fg/15 ${[5, 6, 9, 10].includes(k) ? 'anim-patch' : ''}`}
              strokeWidth="1"
              style={{ animationDelay: `${f * 0.4}s` }}
            />
          ))}
          <text x="0" y="92" fontSize="9" className="fill-fg-dim" style={mono}>t{f + 1}</text>
        </g>
      ))}
      {Array.from({ length: 24 }, (_, i) => (
        <rect
          key={i}
          x={20 + i * 15.2}
          y="218"
          width="11"
          height="22"
          rx="2"
          className={`fill-signal/25 ${i % 4 === 1 || i % 4 === 2 ? 'anim-patch' : ''}`}
          style={{ animationDelay: `${Math.floor(i / 6) * 0.4}s` }}
        />
      ))}
      <rect x="404" y="196" width="96" height="64" rx="10" className="fill-accent/[0.08] stroke-accent/70" strokeWidth="1.25" />
      <text x="452" y="224" textAnchor="middle" fontSize="10" className="fill-fg" style={mono}>ViT</text>
      <text x="452" y="242" textAnchor="middle" fontSize="8.5" letterSpacing="1.2" className="fill-fg-dim" style={mono}>ATTENTION</text>
      <path d="M386 229 L400 229" className="stroke-accent" strokeWidth="1.25" />
    </svg>
  )
}

const VISUALS = [AttentionVisual, PatchVisual]

export default function Innovation() {
  return (
    <section id="research" tabIndex={-1} aria-labelledby="research-title" className="section">
      <div className="shell">
        <SectionHeader
          index="04"
          label="Research & innovation"
          id="research-title"
          title="Research lab"
          lede="Published work in multimodal AI, and the national hackathons I've built for."
        />

        <div className="space-y-12 md:space-y-16">
          {research.map((r, i) => {
            const Visual = VISUALS[i] || AttentionVisual
            const flip = i % 2 === 1
            return (
              <article key={r.name} className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12" aria-labelledby={`paper-${i}`}>
                <Reveal className={`lg:col-span-6 ${flip ? 'lg:order-2' : ''}`}>
                  <figure className="panel reg m-0 p-5 sm:p-6">
                    <Visual />
                  </figure>
                </Reveal>
                <Reveal delay={0.06} className={`lg:col-span-6 ${flip ? 'lg:order-1' : ''}`}>
                  <p className="flex items-center gap-3 text-[0.68rem] uppercase tracking-[0.16em]">
                    <span className="text-accent">paper {String(i + 1).padStart(2, '0')}</span>
                    <span className="h-px w-6 bg-fg/20" aria-hidden="true" />
                    <span className="text-signal">{r.venue}</span>
                  </p>
                  <h3 id={`paper-${i}`} className="mt-3 text-[1.6rem] font-semibold leading-[1.15] text-fg sm:text-[2rem]">{r.name}</h3>
                  <p className="mt-4 leading-relaxed text-fg-muted">{r.summary}</p>
                  <ul className="mt-5 flex flex-wrap gap-2" aria-label="Topics">
                    {r.tech.map((t) => (
                      <li key={t} className="chip">{t}</li>
                    ))}
                  </ul>
                  <div className="mt-6 flex flex-wrap gap-3">
                    {r.links.map((l) => (
                      <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="btn-ghost !min-h-[42px] !px-5">
                        {l.label}
                        <TbArrowUpRight aria-hidden="true" size={15} />
                        <span className="sr-only">(opens in new tab)</span>
                      </a>
                    ))}
                  </div>
                </Reveal>
              </article>
            )
          })}
        </div>

        {/* Hackathons */}
        <Reveal className="mt-14">
          <h3 className="text-xl font-semibold text-fg">Hackathons</h3>
          <ul className="mt-5 grid gap-px overflow-hidden rounded-2xl bg-fg/[0.09] md:grid-cols-3">
            {hackathons.map((h, i) => (
              <li key={h.name} className="group relative bg-canvas p-6 transition-colors duration-500 hover:bg-surface">
                <span className="text-[0.62rem] text-fg-dim" aria-hidden="true">H{String(i + 1).padStart(2, '0')}</span>
                <p className="mt-6 font-display text-xl font-semibold leading-tight text-fg transition-colors duration-300 group-hover:text-accent">{h.name}</p>
                <p className="mt-2 text-sm text-fg-muted">{h.detail}</p>
                <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-accent transition-transform duration-500 group-hover:scale-x-100" />
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
