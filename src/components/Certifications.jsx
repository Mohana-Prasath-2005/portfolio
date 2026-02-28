import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { HiAcademicCap } from 'react-icons/hi'
import SpotlightCard from './SpotlightCard'


const certifications = [
  { name: 'Data Science Workshop', org: 'NIT Trichy', weight: 'heavy' },
  { name: 'Career Essentials in Data Analysis', org: 'Microsoft & LinkedIn', weight: 'heavy' },
  { name: 'AI Foundation (97.5%)', org: 'Infosys Springboard', weight: 'heavy' },
  { name: 'Docker Foundations Professional', org: 'LinkedIn', weight: 'heavy' },
  { name: 'SQL (Intermediate)', org: 'HackerRank', weight: 'heavy' },
  { name: 'NPTEL — Problem Solving Through C', org: 'IIT Madras (NPTEL)', weight: 'heavy' },
  { name: 'NPTEL — Cyber Security & Privacy', org: 'IIT Madras (NPTEL)', weight: 'normal' },
  { name: 'Applied Generative AI (82.5%)', org: 'Infosys Springboard', weight: 'normal' },
]

export default function Certifications() {
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
          <p className="text-primary font-mono text-sm mb-2">Certifications</p>
          <h2 className="section-title">
Selected Certifications
          </h2>
          <p className="section-subtitle">
            Curated credentials — NPTEL, Microsoft, Infosys, HackerRank.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-12">
          {certifications.map((cert, idx) => (
            <motion.div
              key={cert.name}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.05 * idx }}
            >
              <SpotlightCard className={`glass-hover rounded-xl p-4 h-full ${
                cert.weight === 'heavy' ? 'border border-primary/10' : ''
              }`}>
                <div className="flex items-start gap-3">
                  <HiAcademicCap className={`mt-0.5 flex-shrink-0 ${
                    cert.weight === 'heavy' ? 'text-primary' : 'text-slate-500'
                  }`} size={16} />
                  <div>
                    <p className="text-white text-sm font-medium">{cert.name}</p>
                    <p className="text-slate-500 text-xs mt-1">{cert.org}</p>
                  </div>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
