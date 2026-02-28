import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { FaGithub } from 'react-icons/fa'
import { HiChip, HiDatabase, HiCog } from 'react-icons/hi'
import SpotlightCard from './SpotlightCard'
import TiltCard from './TiltCard'


const projects = [
  {
    icon: HiChip,
    title: 'VISION X',
    subtitle: 'Real-Time AI Surveillance Engine',
    role: 'Project Associate',
    year: '2025',
    description:
      'Integrated a YOLOv8-based object tracking system capable of processing live video feeds at 30 FPS with sub-50ms latency, enabling real-time surveillance and analytics.',
    metrics: [
      { label: 'Frame Rate', value: '30 FPS' },
      { label: 'Latency', value: '< 50ms' },
      { label: 'Detection', value: 'Real-time' },
    ],
    tech: ['Python', 'YOLOv8', 'OpenCV', 'Computer Vision', 'AI'],
    github: 'https://github.com/Mohana-Prasath-2005',
    color: 'from-cyan-500/10 to-blue-500/10',
    borderColor: 'border-cyan-500/20',
    accentColor: 'text-cyan-400',
  },
  {
    icon: HiDatabase,
    title: 'Transaction Reconciliation System',
    subtitle: 'Full-Stack Financial Platform',
    role: 'Independent Project',
    year: '2025',
    description:
      'Built a full-stack financial reconciliation engine with real-time dashboards for settlement tracking, issue detection, and performance metrics visualization.',
    metrics: [
      { label: 'Stack', value: 'Full-Stack' },
      { label: 'Data', value: 'Real-time' },
      { label: 'Dashboard', value: 'Interactive' },
    ],
    tech: ['React', 'Vite', 'Flask', 'SQLite', 'REST API', 'CSV Processing'],
    github: 'https://github.com/Mohana-Prasath-2005',
    color: 'from-violet-500/10 to-purple-500/10',
    borderColor: 'border-violet-500/20',
    accentColor: 'text-violet-400',
  },
  {
    icon: HiCog,
    title: '3-in-1 IoT Robot Car',
    subtitle: 'Modular Robotics System',
    role: 'Team Leader',
    year: '2024',
    description:
      'Engineered an IoT-enabled modular robot car with three control modes — gesture recognition, voice commands, and Bluetooth — achieving 99.9% command execution success rate.',
    metrics: [
      { label: 'Success Rate', value: '99.9%' },
      { label: 'Control Modes', value: '3' },
      { label: 'Integration', value: 'HW + SW' },
    ],
    tech: ['Arduino', 'IoT', 'Bluetooth', 'Gesture Recognition', 'Voice Control'],
    github: 'https://github.com/Mohana-Prasath-2005',
    color: 'from-emerald-500/10 to-teal-500/10',
    borderColor: 'border-emerald-500/20',
    accentColor: 'text-emerald-400',
  },
]

export default function Projects() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="projects" className="section-padding" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-primary font-mono text-sm mb-2">Work</p>
          <h2 className="section-title">
Featured Projects
          </h2>
          <p className="section-subtitle">
            Systems I've built — engineered for performance, designed for impact.
          </p>
        </motion.div>

        <div className="space-y-8 mt-12">
          {projects.map((project, idx) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 * idx }}
            >
              <TiltCard intensity={4}>
                <SpotlightCard className={`glass-hover rounded-2xl overflow-hidden border ${project.borderColor}`}>
                  <div className={`bg-gradient-to-r ${project.color} p-6 md:p-8`}>
                    {/* Header */}
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`p-2 rounded-lg glass ${project.accentColor}`}>
                            <project.icon size={20} />
                          </div>
                          <span className="text-slate-500 font-mono text-xs uppercase tracking-wider">
                            {project.role} &middot; {project.year}
                          </span>
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold text-white">{project.title}</h3>
                        <p className={`text-sm ${project.accentColor} mt-1`}>{project.subtitle}</p>
                      </div>

                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-lg glass text-slate-400 hover:text-white transition-colors"
                        aria-label={`${project.title} GitHub`}
                      >
                        <FaGithub size={18} />
                      </a>
                    </div>

                    {/* Description */}
                    <p className="text-slate-400 leading-relaxed mb-6">{project.description}</p>

                    {/* Metrics */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      {project.metrics.map((metric) => (
                        <div key={metric.label} className="glass rounded-xl p-3 text-center">
                          <p className="text-white font-bold text-lg">{metric.value}</p>
                          <p className="text-slate-500 text-xs mt-1">{metric.label}</p>
                        </div>
                      ))}
                    </div>

                    {/* Tech stack */}
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((t) => (
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
