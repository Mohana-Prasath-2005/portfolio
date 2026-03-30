import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const achievements = [
  { icon: '🏆', text: 'ISTE Best Outgoing Student 2026' },
  { icon: '🎖️', text: 'Best Co-Curricular Student — CSE' },
  { icon: '🥇', text: '6+ First Prize Wins' },
  { icon: '🌏', text: 'Open Fabric — Singapore Internship' },
  { icon: '🎓', text: 'NIT Trichy Internship Program' },
  { icon: '📄', text: '2 Research Papers Published' },
  { icon: '💻', text: 'Cognizant Full-Time Placement' },
  { icon: '🏅', text: '15+ Podium Finishes' },
  { icon: '🧠', text: 'Smart India Hackathon Finalist' },
  { icon: '📊', text: '9.10 CGPA' },
]

function TickerItem({ icon, text }) {
  return (
    <div className="flex items-center gap-3 px-6 py-3 mx-2 rounded-full glass border border-white/5 whitespace-nowrap select-none hover:border-primary/20 transition-colors duration-300">
      <span className="text-lg">{icon}</span>
      <span className="text-sm font-medium text-slate-300">{text}</span>
    </div>
  )
}

export default function AchievementsTicker() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  const doubled = [...achievements, ...achievements]

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.8 }}
      className="py-6 overflow-hidden relative"
    >
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-r from-dark-900 to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-l from-dark-900 to-transparent pointer-events-none" />

      {/* Row 1 — left to right */}
      <div className="flex mb-3">
        <div className="flex ticker-track" style={{ animationDuration: '40s' }}>
          {doubled.map((a, i) => (
            <TickerItem key={`r1-${i}`} icon={a.icon} text={a.text} />
          ))}
        </div>
      </div>

      {/* Row 2 — right to left */}
      <div className="flex">
        <div className="flex ticker-track-reverse" style={{ animationDuration: '45s' }}>
          {[...doubled].reverse().map((a, i) => (
            <TickerItem key={`r2-${i}`} icon={a.icon} text={a.text} />
          ))}
        </div>
      </div>
    </motion.div>
  )
}
