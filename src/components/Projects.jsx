import { FaGithub } from 'react-icons/fa'
import { TbArrowUpRight } from 'react-icons/tb'
import SectionHeader from './ui/SectionHeader'
import Reveal from './ui/Reveal'
import { ProjectVisual } from './ProjectVisuals'
import { projects } from '../data/profile'

const pad = (n) => String(n).padStart(2, '0')

export default function Projects() {
  return (
    <section id="work" tabIndex={-1} aria-labelledby="work-title" className="section">
      <div className="shell">
        <SectionHeader
          index="03"
          label="Selected work"
          id="work-title"
          title="Systems I've built"
          lede="Live simulations and real demo footage — interact with each one."
        />

        <div className="space-y-16 md:space-y-20">
          {projects.map((p, i) => {
            const flip = i % 2 === 1
            return (
              <article key={p.id} aria-labelledby={`${p.id}-title`} className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
                <Reveal className={`min-w-0 lg:col-span-7 ${flip ? 'lg:order-2' : ''}`}>
                  <ProjectVisual kind={p.visual} />
                </Reveal>

                <Reveal delay={0.06} className={`min-w-0 lg:col-span-5 ${flip ? 'lg:order-1' : ''}`}>
                  <div className="flex items-end gap-4">
                    <span
                      aria-hidden="true"
                      className="font-display text-[4.5rem] font-bold leading-[0.8] tracking-[-0.06em] text-transparent [-webkit-text-stroke:1px_rgb(var(--fg)/0.28)] sm:text-[5.5rem]"
                    >
                      {pad(i + 1)}
                    </span>
                    <p className="pb-1 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-fg-dim">
                      {p.role} · {p.year}
                    </p>
                  </div>
                  <h3 id={`${p.id}-title`} className="mt-5 text-[1.8rem] font-semibold tracking-[-0.03em] text-fg sm:text-[2.2rem]">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-signal">{p.subtitle}</p>
                  <p className="mt-4 leading-relaxed text-fg-muted">{p.description}</p>

                  <dl className="mt-6 grid grid-cols-3 border-y border-fg/[0.08]">
                    {p.metrics.map((m, mi) => (
                      <div key={m.label} className={`flex flex-col-reverse py-3 ${mi ? 'pl-4' : ''} ${mi < 2 ? 'border-r border-fg/[0.08] pr-3' : ''}`}>
                        <dt className="mt-1 font-mono text-[0.6rem] uppercase tracking-[0.12em] text-fg-dim">{m.label}</dt>
                        <dd className="font-display text-base font-semibold text-fg sm:text-lg">{m.value}</dd>
                      </div>
                    ))}
                  </dl>

                  <ul className="mt-5 flex flex-wrap gap-2" aria-label="Technologies">
                    {p.tech.map((t) => (
                      <li key={t} className="chip">{t}</li>
                    ))}
                  </ul>

                  <a
                    href={p.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost mt-6"
                    aria-label={`View ${p.title} source code on GitHub (opens in new tab)`}
                  >
                    <FaGithub aria-hidden="true" size={16} />
                    View source
                    <TbArrowUpRight aria-hidden="true" size={15} />
                  </a>
                </Reveal>
              </article>
            )
          })}
        </div>

      </div>
    </section>
  )
}
