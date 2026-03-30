import { motion, useInView, animate } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import TiltCard from './TiltCard'
import SpotlightCard from './SpotlightCard'


function AnimatedValue({ target, decimals = 2, duration = 2 }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [display, setDisplay] = useState('0')

  useEffect(() => {
    if (!isInView) return
    const controls = animate(0, target, {
      duration,
      ease: 'easeOut',
      onUpdate(v) { setDisplay(v.toFixed(decimals)) },
    })
    return controls.stop
  }, [isInView, target, decimals, duration])

  return <span ref={ref}>{display}</span>
}

const semesters = [
  { sem: '1', cgpa: 9.136 },
  { sem: '2', cgpa: 9.044 },
  { sem: '3', cgpa: 9.224 },
  { sem: '4', cgpa: 9.286 },
  { sem: '5', cgpa: 9.228 },
  { sem: '6', cgpa: 9.199 },
  { sem: '7', cgpa: 9.10 },
]

const maxCgpa = 10

export default function AcademicExcellence() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="academics" className="section-padding" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-primary font-mono text-sm mb-2">Academics</p>
          <h2 className="section-title">
Academic Excellence
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {/* CGPA highlight */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <TiltCard intensity={6}>
              <SpotlightCard className="glass-hover rounded-2xl p-8 flex flex-col items-center justify-center text-center h-full">
                <p className="text-5xl md:text-6xl font-bold gradient-text">
                  <AnimatedValue target={9.10} />
                </p>
                <p className="text-slate-400 mt-2">Cumulative CGPA</p>
                <p className="text-slate-500 text-xs mt-1">B.E CSE — Till VII Semester</p>

                <div className="w-full mt-6 space-y-3">
                  {[
                    { label: '12th (HSC)', value: '85%', width: '85%' },
                    { label: '10th (SSLC)', value: '77%', width: '77%' },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-500">{item.label}</span>
                        <span className="text-white">{item.value}</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={isInView ? { width: item.width } : {}}
                          transition={{ duration: 1.2, delay: 0.5, ease: 'easeOut' }}
                          className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </SpotlightCard>
            </TiltCard>
          </motion.div>

          {/* CGPA Trend - bar chart */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="md:col-span-2"
          >
            <TiltCard intensity={4}>
              <SpotlightCard className="glass-hover rounded-2xl p-6 md:p-8 h-full">
                <h3 className="text-white font-semibold mb-1">CGPA Trend</h3>
                <p className="text-slate-500 text-xs mb-8">7 semesters of consistency</p>

                {/* Bar chart */}
                <div className="flex items-end gap-1.5 sm:gap-3 h-48">
                  {semesters.map((s, idx) => {
                    const height = ((s.cgpa - 8) / (maxCgpa - 8)) * 100
                    return (
                      <div key={s.sem} className="flex-1 flex flex-col items-center gap-1 sm:gap-2 h-full justify-end">
                        <span className="text-white text-[10px] sm:text-xs font-mono">{s.cgpa}</span>
                        <motion.div
                          initial={{ height: 0 }}
                          animate={isInView ? { height: `${height}%` } : {}}
                          transition={{ duration: 0.8, delay: 0.3 + 0.1 * idx, ease: 'easeOut' }}
                          className={`w-full rounded-t-lg ${
                            s.cgpa >= 9.0
                              ? 'bg-gradient-to-t from-primary/60 to-primary'
                              : 'bg-gradient-to-t from-slate-600/60 to-slate-500'
                          }`}
                        />
                        <span className="text-slate-500 text-[10px] sm:text-xs">S{s.sem}</span>
                      </div>
                    )
                  })}
                </div>

              </SpotlightCard>
            </TiltCard>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
