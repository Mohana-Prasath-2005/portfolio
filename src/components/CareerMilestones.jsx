import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { HiBriefcase, HiGlobe } from 'react-icons/hi'
import SpotlightCard from './SpotlightCard'
import TiltCard from './TiltCard'


const placements = [
  {
    company: 'Open Fabric',
    location: 'Singapore',
    role: 'Software Engineer Intern',
    type: 'Paid International Internship',
    color: 'from-cyan-500/10 to-blue-500/10',
    borderColor: 'border-cyan-500/20',
    accentColor: 'text-cyan-400',
    iconBg: 'bg-cyan-500/10',
    icon: HiGlobe,
    tags: ['International', 'Remote', 'Product Engineering'],
  },
  {
    company: 'Cognizant',
    location: 'India',
    role: 'Software Engineer',
    type: 'Full-Time Placement',
    color: 'from-violet-500/10 to-purple-500/10',
    borderColor: 'border-violet-500/20',
    accentColor: 'text-violet-400',
    iconBg: 'bg-violet-500/10',
    icon: HiBriefcase,
    tags: ['Full-Time', 'MNC', 'Enterprise'],
  },
]

export default function CareerMilestones() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="career" className="section-padding" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-primary font-mono text-sm mb-2">Career</p>
          <h2 className="section-title">
Career Milestones
          </h2>
          <p className="section-subtitle">Market-validated. Placed before final semester.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mt-12">
          {placements.map((p, idx) => (
            <motion.div
              key={p.company}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 * idx }}
            >
              <TiltCard intensity={6}>
                <SpotlightCard className={`glass-hover rounded-2xl border ${p.borderColor} overflow-hidden`}>
                  <div className={`bg-gradient-to-br ${p.color} p-6 md:p-8`}>
                    <div className="flex items-start justify-between mb-5">
                      <div className={`p-2.5 rounded-xl ${p.iconBg} ${p.accentColor}`}>
                        <p.icon size={24} />
                      </div>
                      <span className={`text-xs font-mono uppercase tracking-wider ${p.accentColor} px-3 py-1 rounded-full glass`}>
                        {p.type}
                      </span>
                    </div>

                    <h3 className="text-xl md:text-2xl font-bold text-white">{p.company}</h3>
                    <p className="text-slate-400 text-sm mt-1">{p.role} &middot; {p.location}</p>

                    <div className="flex flex-wrap gap-2 mt-6">
                      {p.tags.map((t) => (
                        <span
                          key={t}
                          className="px-3 py-1 rounded-full text-xs font-mono glass text-slate-400 shine-tag"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </SpotlightCard>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
