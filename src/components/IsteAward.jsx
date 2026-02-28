import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import TiltCard from './TiltCard'
import SpotlightCard from './SpotlightCard'

const awards = [
  {
    emoji: '🏆',
    label: 'Institutional Recognition',
    title: 'ISTE Chapter Best Student Award',
    year: '2026',
    org: 'Nandha Engineering College',
    description:
      'Recognized for sustained excellence across academics, leadership, innovation, and professional achievement throughout the undergraduate program.',
    gradient: 'from-amber-500/20 via-yellow-400/20 to-amber-500/20',
    border: 'border-amber-400/20',
    accent: 'text-amber-400',
    iconBg: 'from-amber-400/20 to-yellow-500/10',
    iconBorder: 'border-amber-400/20',
  },
  {
    emoji: '🎖️',
    label: 'Department Recognition',
    title: 'Best Co-Curricular Student (CSE)',
    year: '2025',
    org: 'Nandha Engineering College',
    description:
      'Awarded for outstanding contributions in co-curricular activities, leadership roles, and consistent participation across departmental and inter-college events.',
    gradient: 'from-cyan-500/20 via-blue-400/20 to-cyan-500/20',
    border: 'border-cyan-400/20',
    accent: 'text-cyan-400',
    iconBg: 'from-cyan-400/20 to-blue-500/10',
    iconBorder: 'border-cyan-400/20',
  },
  {
    emoji: '🎓',
    label: 'National Level',
    title: 'Internship Program',
    year: '2024',
    org: 'NIT Trichy',
    description:
      'A 30-day national-level internship program at one of India\'s premier technical institutions, gaining hands-on exposure to advanced engineering practices.',
    gradient: 'from-violet-500/20 via-purple-400/20 to-violet-500/20',
    border: 'border-violet-400/20',
    accent: 'text-violet-400',
    iconBg: 'from-violet-400/20 to-purple-500/10',
    iconBorder: 'border-violet-400/20',
  },
]

export default function IsteAward() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <section className="section-padding pt-4 pb-4" ref={ref}>
      <div className="max-w-5xl mx-auto space-y-5">
        {awards.map((award, idx) => (
          <motion.div
            key={award.title}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.15 * idx }}
          >
            <TiltCard intensity={4}>
              <div className="relative rounded-2xl overflow-hidden">
                {/* Gradient border glow */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${award.gradient} blur-sm animate-pulse-slow`} />

                <SpotlightCard className={`relative glass rounded-2xl ${award.border} p-6 md:p-10`}>
                  <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
                    {/* Icon */}
                    <motion.div
                      initial={{ opacity: 0, rotate: -10 }}
                      animate={isInView ? { opacity: 1, rotate: 0 } : {}}
                      transition={{ duration: 0.6, delay: 0.2 + 0.15 * idx }}
                      className="flex-shrink-0"
                    >
                      <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: idx * 0.5 }}
                        className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br ${award.iconBg} flex items-center justify-center border ${award.iconBorder}`}
                      >
                        <span className="text-4xl md:text-5xl">{award.emoji}</span>
                      </motion.div>
                    </motion.div>

                    {/* Content */}
                    <div className="flex-1">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.3 + 0.15 * idx }}
                      >
                        <p className={`${award.accent} font-mono text-xs uppercase tracking-widest mb-2`}>
                          {award.label}
                        </p>
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2">
                          {award.title}
                        </h2>
                        <p className={`${award.accent} opacity-80 font-medium text-lg`}>
                          {award.year} &middot; {award.org}
                        </p>
                      </motion.div>

                      <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.4 + 0.15 * idx }}
                        className="text-slate-400 mt-4 leading-relaxed max-w-2xl"
                      >
                        {award.description}
                      </motion.p>
                    </div>
                  </div>
                </SpotlightCard>
              </div>
            </TiltCard>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
