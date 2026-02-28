import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { HiUserGroup, HiAcademicCap, HiStar, HiLightBulb } from 'react-icons/hi'
import SpotlightCard from './SpotlightCard'
import TiltCard from './TiltCard'


const roles = [
  {
    icon: HiStar,
    title: 'Student Secretary',
    org: 'Dept. of CSE, Nandha Engineering College',
    period: '2025 – 2026',
    impact: 'Led departmental student initiatives and represented 500+ students in academic decisions and faculty interactions.',
  },
  {
    icon: HiAcademicCap,
    title: 'Board of Studies Member',
    org: 'Dept. of CSE, Nandha Engineering College',
    period: '2022 – Present',
    impact: 'Contributed to curriculum design and academic policy discussions for 4 consecutive years — from first year.',
  },
  {
    icon: HiUserGroup,
    title: 'Overall Students Joint Secretary',
    org: 'Nandha Engineering College',
    period: '2024 – 2025',
    impact: 'Coordinated inter-departmental events, managed cross-functional student teams, and drove event execution.',
  },
  {
    icon: HiUserGroup,
    title: 'Promotional Team Head',
    org: 'Nandha Engineering College',
    period: '2025 – 2026',
    impact: 'Handling social media presence and promotional activities for the college students association.',
  },
  {
    icon: HiUserGroup,
    title: 'Executive Member',
    org: 'Dept. of CSE, Nandha Engineering College',
    period: '2023 – 2024',
    impact: 'Drove student engagement and supported departmental event planning and coordination.',
  },
  {
    icon: HiLightBulb,
    title: 'Core Member',
    org: 'Dept. of CSE, Nandha Engineering College',
    period: '2022 – 2023',
    impact: 'Contributed to foundational departmental activities and technical event support from first year.',
  },
]

export default function Leadership() {
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
          <p className="text-primary font-mono text-sm mb-2">Leadership</p>
          <h2 className="section-title">
Leadership & Governance
          </h2>
          <p className="section-subtitle">
            4 years of progressive responsibility — from executive member to student secretary.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mt-12">
          {roles.map((role, idx) => (
            <motion.div
              key={role.title + role.period}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 * idx }}
            >
              <TiltCard intensity={5}>
                <SpotlightCard className="glass-hover rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 rounded-xl bg-accent/10 text-accent flex-shrink-0">
                      <role.icon size={20} />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{role.title}</h3>
                      <p className="text-primary text-sm">{role.org}</p>
                      <p className="text-slate-500 font-mono text-xs mt-0.5">{role.period}</p>
                      <p className="text-slate-400 text-sm mt-3 leading-relaxed">{role.impact}</p>
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
