import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { HiChip, HiBeaker, HiLightningBolt } from 'react-icons/hi'
import { FaGithub } from 'react-icons/fa'
import SpotlightCard from './SpotlightCard'
import TiltCard from './TiltCard'


const projects = [
  {
    name: 'VISION X',
    desc: 'Real-time YOLOv8 surveillance engine — 30 FPS, <50ms latency',
    tech: ['Python', 'YOLOv8', 'OpenCV'],
    github: 'https://github.com/Mohana-Prasath-2005',
    type: 'AI',
  },
  {
    name: 'Transaction Reconciliation System',
    desc: 'Full-stack financial platform with real-time dashboards and issue detection',
    tech: ['React', 'Flask', 'SQLite', 'Vite'],
    github: 'https://github.com/Mohana-Prasath-2005',
    type: 'Full-Stack',
  },
  {
    name: '3-in-1 IoT Robot Car',
    desc: 'Gesture, voice & Bluetooth control — 99.9% command success rate',
    tech: ['Arduino', 'IoT', 'Bluetooth'],
    github: 'https://github.com/Mohana-Prasath-2005',
    type: 'IoT',
  },
  {
    name: 'Volume Control via Hand Gesture',
    desc: 'Computer vision based gesture recognition for system control',
    tech: ['Python', 'MediaPipe', 'OpenCV'],
    type: 'AI',
  },
]

const research = [
  {
    name: 'WavDino Emotion Intelligence',
    venue: 'NIT Puducherry',
    tech: ['Deep Learning', 'Audio Processing'],
  },
  {
    name: 'Temporal Facial Dynamics–Driven Audio-Visual Emotion Recognition Using Vision Transformers',
    venue: 'Research Paper',
    tech: ['Vision Transformers', 'Multimodal AI'],
  },
]

const hackathons = [
  { name: 'Smart India Hackathon', detail: 'SIH 2023 & 2024 — National Level' },
  { name: 'UYIR Road Safety Hackathon', detail: 'Road safety solutions' },
  { name: 'Adobe GenSolve Hackathon', detail: 'Generative AI challenge' },
]

export default function Innovation() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="innovation" className="section-padding" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-primary font-mono text-sm mb-2">Innovation</p>
          <h2 className="section-title">
Innovation & Research
          </h2>
        </motion.div>

        {/* Projects grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-10"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 rounded-lg bg-cyan-400/10 text-cyan-400">
              <HiChip size={18} />
            </div>
            <h3 className="text-white font-semibold">Projects</h3>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((item, idx) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.15 + 0.06 * idx }}
              >
                <TiltCard intensity={8}>
                  <SpotlightCard className="glass-hover rounded-xl p-4 flex flex-col h-full">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="text-white text-sm font-medium leading-snug">{item.name}</h4>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-400/10 text-cyan-400">
                          {item.type}
                        </span>
                        {item.github && (
                          <a
                            href={item.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-500 hover:text-white transition-colors"
                          >
                            <FaGithub size={13} />
                          </a>
                        )}
                      </div>
                    </div>
                    <p className="text-slate-500 text-xs leading-relaxed flex-1">{item.desc}</p>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {item.tech.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/[0.03] text-slate-500 shine-tag"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </SpotlightCard>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Research & Hackathons — side by side */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          {/* Research */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 rounded-lg bg-violet-400/10 text-violet-400">
                <HiBeaker size={18} />
              </div>
              <h3 className="text-white font-semibold">Research Papers</h3>
            </div>

            <div className="space-y-3">
              {research.map((r) => (
                <TiltCard key={r.name} intensity={6}>
                  <SpotlightCard className="glass-hover rounded-xl p-4">
                    <h4 className="text-white text-sm font-medium leading-snug">{r.name}</h4>
                    <p className="text-violet-400 text-xs mt-1">{r.venue}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {r.tech.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 rounded text-[10px] font-mono bg-violet-400/10 text-violet-400"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </SpotlightCard>
                </TiltCard>
              ))}
            </div>
          </motion.div>

          {/* Hackathons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 rounded-lg bg-amber-400/10 text-amber-400">
                <HiLightningBolt size={18} />
              </div>
              <h3 className="text-white font-semibold">Hackathons</h3>
            </div>

            <div className="space-y-3">
              {hackathons.map((h) => (
                <TiltCard key={h.name} intensity={6}>
                  <SpotlightCard className="glass-hover rounded-xl p-4 flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
                    <div>
                      <h4 className="text-white text-sm font-medium">{h.name}</h4>
                      <p className="text-slate-500 text-xs mt-0.5">{h.detail}</p>
                    </div>
                  </SpotlightCard>
                </TiltCard>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
