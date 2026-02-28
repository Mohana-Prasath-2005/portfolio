import { motion, useInView, animate } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'

import TiltCard from './TiltCard'
import SpotlightCard from './SpotlightCard'

function Counter({ target, suffix = '', duration = 2 }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [display, setDisplay] = useState('0')
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!isInView) return
    const controls = animate(0, target, {
      duration,
      ease: 'easeOut',
      onUpdate(v) { setDisplay(Math.floor(v).toString()) },
      onComplete() { setDone(true) },
    })
    return controls.stop
  }, [isInView, target, duration])

  return (
    <span ref={ref} className={done ? 'counter-glow' : ''}>
      {display}{suffix}
    </span>
  )
}

const stats = [
  { emoji: '🥇', label: 'First Prizes', value: 6, suffix: '+', color: 'from-amber-400 to-yellow-500', glow: 'shadow-amber-400/20' },
  { emoji: '🥈', label: 'Second Prizes', value: 8, suffix: '+', color: 'from-slate-300 to-slate-400', glow: 'shadow-slate-300/20' },
  { emoji: '🏅', label: 'Podium Finishes', value: 15, suffix: '+', color: 'from-orange-400 to-amber-500', glow: 'shadow-orange-400/20' },
  { emoji: '⚡', label: 'Events Participated', value: 50, suffix: '+', color: 'from-cyan-400 to-blue-500', glow: 'shadow-cyan-400/20' },
]

const highlights = [
  { prize: '🏆', event: 'Best Co-Curricular Student (CSE)', venue: 'Nandha Engineering College, 2025' },
  { prize: '1st', event: 'Paper Presentation — Security Technologies', venue: 'PIET, Pollachi' },
  { prize: '1st', event: 'UI/UX Design Competition', venue: 'GALAXY\'24, GCE Erode' },
  { prize: '1st', event: 'Paper Presentation — AI in Healthcare', venue: 'ESEC' },
  { prize: '1st', event: 'IPL Auction Strategy Event', venue: 'GALAXY\'24, GCE Erode' },
  { prize: '2nd', event: 'Code Cracking — Java Programming', venue: 'GCE Erode' },
  { prize: '2nd', event: 'Python Quiz & Reasoning', venue: 'GCE Erode (IIC & ISTE)' },
  { prize: '2nd', event: 'The Brainiacs — Technical Quiz', venue: 'syNECtics\'24, NEC' },
]

export default function CompetitionWins() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="section-padding" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-primary font-mono text-sm mb-2">Competitions</p>
          <h2 className="section-title">
Competition Dominance
          </h2>
          <p className="section-subtitle">Consistent podium finisher across technical events.</p>
        </motion.div>

        {/* Stats counters with animated borders */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
          {stats.map((s, idx) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.1 * idx }}
            >
              <TiltCard intensity={8}>
                <div className="stat-card-border rounded-2xl">
                  <SpotlightCard className="glass-hover rounded-2xl p-6 text-center">
                    <motion.span
                      className="text-3xl mb-3 block"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: idx * 0.5 }}
                    >
                      {s.emoji}
                    </motion.span>
                    <p className={`text-3xl md:text-4xl font-bold bg-gradient-to-r ${s.color} bg-clip-text text-transparent`}>
                      <Counter target={s.value} suffix={s.suffix} />
                    </p>
                    <p className="text-slate-500 text-xs mt-2 uppercase tracking-wider">{s.label}</p>
                  </SpotlightCard>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>

        {/* Key wins */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10"
        >
          <h3 className="text-white font-semibold text-lg mb-5">Key Wins</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {highlights.map((h, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.4 + 0.05 * i }}
                className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-primary/20 hover:bg-white/[0.04] transition-all duration-300 group"
              >
                <span className={`flex-shrink-0 px-2 py-0.5 rounded text-xs font-bold transition-transform duration-300 group-hover:scale-110 ${
                  h.prize === '🏆'
                    ? 'bg-amber-400/20 text-amber-300'
                    : h.prize === '1st'
                    ? 'bg-amber-400/10 text-amber-400'
                    : 'bg-slate-400/10 text-slate-400'
                }`}>
                  {h.prize}
                </span>
                <div className="min-w-0">
                  <p className="text-white text-sm truncate group-hover:text-primary transition-colors duration-300">{h.event}</p>
                  <p className="text-slate-500 text-xs">{h.venue}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
