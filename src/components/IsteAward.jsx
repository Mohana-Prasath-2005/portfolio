import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import TiltCard from './TiltCard'
import SpotlightCard from './SpotlightCard'

const awards = [
  {
    emoji: '🏆',
    label: 'State Recognition',
    title: 'ISTE Chapter Best Student Award',
    subtitle: '',
    year: '2026',
    org: 'ISTE Tamilnadu Section',
    description:
      'Recognized for sustained excellence across academics, leadership, innovation, and professional achievement throughout the undergraduate program.',
    gradient: 'from-amber-500/30 via-yellow-400/20 to-amber-600/30',
    border: 'border-amber-400/30',
    accent: 'text-amber-400',
    iconBg: 'from-amber-400/20 to-yellow-500/10',
    iconBorder: 'border-amber-400/30',
    glowColor: 'rgba(251, 191, 36, 0.15)',
    ribbonGradient: 'from-amber-500 via-yellow-400 to-amber-500',
    featured: true,
  },
  {
    emoji: '🌟',
    label: 'Institutional Recognition',
    title: 'Best Outgoing Student',
    subtitle: '',
    year: '2026',
    org: 'CSE Department · Nandha Engineering College',
    description:
      'Honored as the Best Outgoing Student of the CSE Department for exceptional performance across academics, research, leadership, and professional development throughout the undergraduate program.',
    gradient: 'from-emerald-500/25 via-green-400/20 to-emerald-500/25',
    border: 'border-emerald-400/25',
    accent: 'text-emerald-400',
    iconBg: 'from-emerald-400/20 to-green-500/10',
    iconBorder: 'border-emerald-400/25',
    glowColor: 'rgba(16, 185, 129, 0.12)',
    ribbonGradient: 'from-emerald-500 via-green-400 to-emerald-500',
    featured: false,
  },
  {
    emoji: '🎖️',
    label: 'Department Recognition',
    title: 'Best Co-Curricular Student (CSE)',
    subtitle: '',
    year: '2025',
    org: 'Nandha Engineering College',
    description:
      'Awarded for outstanding contributions in co-curricular activities, leadership roles, and consistent participation across departmental and inter-college events.',
    gradient: 'from-cyan-500/25 via-blue-400/20 to-cyan-500/25',
    border: 'border-cyan-400/25',
    accent: 'text-cyan-400',
    iconBg: 'from-cyan-400/20 to-blue-500/10',
    iconBorder: 'border-cyan-400/25',
    glowColor: 'rgba(6, 182, 212, 0.12)',
    ribbonGradient: 'from-cyan-500 via-blue-400 to-cyan-500',
    featured: false,
  },
  {
    emoji: '🏅',
    label: 'Department Recognition — 2nd Consecutive Year',
    title: 'Best Co-Curricular Student (CSE)',
    subtitle: '',
    year: '2026',
    org: 'Nandha Engineering College',
    description:
      'Awarded for the second consecutive year for outstanding contributions in co-curricular activities, leadership roles, and consistent participation across departmental and inter-college events.',
    gradient: 'from-rose-500/25 via-pink-400/20 to-rose-500/25',
    border: 'border-rose-400/25',
    accent: 'text-rose-400',
    iconBg: 'from-rose-400/20 to-pink-500/10',
    iconBorder: 'border-rose-400/25',
    glowColor: 'rgba(244, 63, 94, 0.12)',
    ribbonGradient: 'from-rose-500 via-pink-400 to-rose-500',
    featured: false,
  },
  {
    emoji: '🎓',
    label: 'National Level',
    title: 'Internship Program',
    subtitle: '',
    year: '2025',
    org: 'NIT Trichy',
    description:
      'A 30-day national-level internship program at one of India\'s premier technical institutions, gaining hands-on exposure to advanced engineering practices.',
    gradient: 'from-violet-500/25 via-purple-400/20 to-violet-500/25',
    border: 'border-violet-400/25',
    accent: 'text-violet-400',
    iconBg: 'from-violet-400/20 to-purple-500/10',
    iconBorder: 'border-violet-400/25',
    glowColor: 'rgba(139, 92, 246, 0.12)',
    ribbonGradient: 'from-violet-500 via-purple-400 to-violet-500',
    featured: false,
  },
]

export default function IsteAward() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const timelineHeight = useTransform(scrollYProgress, [0, 0.8], ['0%', '100%'])

  return (
    <section id="awards" className="section-padding pt-8 pb-8" ref={ref}>
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={isInView ? { scale: 1, rotate: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-block mb-4"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400/20 to-yellow-500/10 border border-amber-400/20 flex items-center justify-center">
              <span className="text-3xl">🏅</span>
            </div>
          </motion.div>
          <p className="text-amber-400 font-mono text-sm mb-2 tracking-widest uppercase">Awards & Recognitions</p>
          <h2 className="section-title">
            Honors That <span className="gradient-text">Define Excellence</span>
          </h2>
        </motion.div>

        {/* Timeline with awards */}
        <div className="relative">
          {/* Animated timeline line — desktop only */}
          <div className="hidden md:block absolute left-8 top-0 bottom-0 w-[2px]">
            <div className="absolute inset-0 bg-white/5 rounded-full" />
            <motion.div
              className="absolute top-0 left-0 w-full bg-gradient-to-b from-amber-400/60 via-cyan-400/60 to-violet-400/60 rounded-full"
              style={{ height: timelineHeight }}
            />
          </div>

          <div className="space-y-6 md:space-y-8">
            {awards.map((award, idx) => (
              <motion.div
                key={award.title}
                initial={{ opacity: 0, x: -30, scale: 0.95 }}
                animate={isInView ? { opacity: 1, x: 0, scale: 1 } : {}}
                transition={{ duration: 0.7, delay: 0.2 + 0.2 * idx, ease: [0.16, 1, 0.3, 1] }}
                className="relative md:pl-20"
              >
                {/* Timeline dot — desktop only */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + 0.2 * idx, type: 'spring' }}
                  className="hidden md:flex absolute left-[18px] top-8 w-6 h-6 rounded-full items-center justify-center z-10"
                >
                  <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${award.ribbonGradient} flex items-center justify-center`}>
                    <div className="w-2.5 h-2.5 rounded-full bg-dark-900" />
                  </div>
                  <div
                    className="absolute inset-0 rounded-full animate-ping-slow"
                    style={{ background: award.glowColor }}
                  />
                </motion.div>

                <TiltCard intensity={4}>
                  <div className="relative rounded-2xl overflow-hidden group">
                    {/* Gradient border glow */}
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${award.gradient} blur-sm animate-pulse-slow`} />

                    {/* Featured badge for top award */}
                    {award.featured && (
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className="absolute top-4 right-4 z-20"
                      >
                        <div className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-400/30 backdrop-blur-sm">
                          <span className="text-amber-300 text-xs font-semibold tracking-wider uppercase">Highest Honor</span>
                        </div>
                      </motion.div>
                    )}

                    <SpotlightCard className={`relative glass rounded-2xl ${award.border} ${award.featured ? 'p-6 md:p-10' : 'p-6 md:p-10'}`}>
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
                            className={`${award.featured ? 'w-20 h-20 md:w-24 md:h-24' : 'w-20 h-20 md:w-24 md:h-24'} rounded-2xl bg-gradient-to-br ${award.iconBg} flex items-center justify-center border ${award.iconBorder} relative`}
                          >
                            <span className={`${award.featured ? 'text-4xl md:text-5xl' : 'text-4xl md:text-5xl'}`}>{award.emoji}</span>
                            {/* Glow ring behind icon */}
                            <div
                              className="absolute inset-0 rounded-2xl blur-xl opacity-40 group-hover:opacity-70 transition-opacity duration-500"
                              style={{ background: award.glowColor }}
                            />
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
                            <h2 className={`${award.featured ? 'text-2xl md:text-3xl lg:text-4xl' : 'text-2xl md:text-3xl lg:text-4xl'} font-bold text-white mb-1`}>
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

                          {/* Award shine bar */}
                          <motion.div
                            initial={{ scaleX: 0 }}
                            animate={isInView ? { scaleX: 1 } : {}}
                            transition={{ duration: 0.8, delay: 0.6 + 0.15 * idx, ease: [0.16, 1, 0.3, 1] }}
                            className={`mt-5 h-[2px] bg-gradient-to-r ${award.ribbonGradient} rounded-full origin-left opacity-40`}
                          />
                        </div>
                      </div>
                    </SpotlightCard>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
