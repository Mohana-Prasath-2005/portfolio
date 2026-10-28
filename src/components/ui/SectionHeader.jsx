import { motion } from 'framer-motion'
import Reveal from './Reveal'

// Chapter header: "/02  Stack" rule, a title and an optional one-line lede.
export default function SectionHeader({ index, label, title, lede, id, titleClass = '', children }) {
  return (
    <header className="mb-10 md:mb-12">
      <Reveal className="flex items-center gap-3">
        <span className="font-mono text-xs text-accent">/{index}</span>
        <span className="eyebrow">{label}</span>
        <motion.span
          aria-hidden="true"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="ml-2 h-px flex-1 origin-left bg-fg/[0.12]"
        />
      </Reveal>
      <Reveal delay={0.05}>
        <h2 id={id} className={`h-section mt-4 max-w-[22ch] ${titleClass}`}>{title}</h2>
      </Reveal>
      {lede && (
        <Reveal delay={0.1}>
          <p className="lede mt-4">{lede}</p>
        </Reveal>
      )}
      {children}
    </header>
  )
}
