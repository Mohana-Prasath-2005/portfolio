import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import {
  FaPython, FaJsSquare, FaNodeJs, FaJava, FaGitAlt, FaGithub, FaDocker
} from 'react-icons/fa'
import {
  SiTypescript, SiFlask, SiExpress, SiSqlite,
  SiNumpy, SiPandas, SiReact, SiTailwindcss, SiPostman
} from 'react-icons/si'
import { HiChartBar } from 'react-icons/hi'
import { HiDatabase, HiChip, HiCode, HiCube, HiBeaker } from 'react-icons/hi'
import SpotlightCard from './SpotlightCard'
import TiltCard from './TiltCard'

import InfiniteMarquee from './InfiniteMarquee'

const categories = [
  {
    title: 'Core Engineering',
    icon: HiCode,
    skills: [
      { name: 'Python', icon: FaPython },
      { name: 'JavaScript', icon: FaJsSquare },
      { name: 'Node.js', icon: FaNodeJs },
      { name: 'SQL', icon: HiDatabase },
      { name: 'Java', icon: FaJava },
      { name: 'TypeScript', icon: SiTypescript },
    ],
  },
  {
    title: 'AI & Data',
    icon: HiChip,
    skills: [
      { name: 'NumPy', icon: SiNumpy },
      { name: 'Pandas', icon: SiPandas },
      { name: 'YOLOv8', icon: HiChip },
      { name: 'Power BI', icon: HiChartBar },
      { name: 'Matplotlib', icon: FaPython },
      { name: 'Excel', icon: HiDatabase },
    ],
  },
  {
    title: 'Backend & Systems',
    icon: HiCube,
    skills: [
      { name: 'Flask', icon: SiFlask },
      { name: 'Express', icon: SiExpress },
      { name: 'SQLite', icon: SiSqlite },
      { name: 'REST APIs', icon: HiCube },
      { name: 'React', icon: SiReact },
      { name: 'Tailwind', icon: SiTailwindcss },
    ],
  },
  {
    title: 'Tools & DevOps',
    icon: FaGitAlt,
    skills: [
      { name: 'Git', icon: FaGitAlt },
      { name: 'GitHub', icon: FaGithub },
      { name: 'Docker', icon: FaDocker },
      { name: 'Bruno', icon: HiBeaker },
      { name: 'Postman', icon: SiPostman },
      { name: 'Agile', icon: HiCube },
    ],
  },
]

// Flatten all skills for the marquee
const allSkills = categories.flatMap((c) => c.skills)
const row1 = allSkills.slice(0, 12)
const row2 = allSkills.slice(12).concat(allSkills.slice(0, 12 - (allSkills.length - 12)))

export default function Skills() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="skills" className="section-padding" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-primary font-mono text-sm mb-2">Skills</p>
          <h2 className="section-title">
Tech Arsenal
          </h2>
          <p className="section-subtitle">Tools and technologies I use to build production systems.</p>
        </motion.div>

        {/* Infinite scrolling marquee */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-10 space-y-4"
        >
          <InfiniteMarquee items={row1} speed={30} />
          <InfiniteMarquee items={row2} speed={35} reverse />
        </motion.div>

        {/* Category cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          {categories.map((cat, catIdx) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 * catIdx }}
            >
              <TiltCard intensity={8}>
                <SpotlightCard className="glass-hover rounded-2xl p-6 h-full">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <cat.icon size={20} />
                    </div>
                    <h3 className="text-white font-semibold">{cat.title}</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {cat.skills.map((skill, i) => (
                      <motion.div
                        key={skill.name}
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : {}}
                        transition={{ delay: 0.3 + 0.05 * i + 0.1 * catIdx }}
                        className="flex items-center gap-2 text-sm text-slate-400 hover:text-primary transition-colors duration-300 shine-tag rounded-lg px-2 py-1.5 hover:bg-primary/5"
                      >
                        <skill.icon className="text-slate-500 flex-shrink-0" size={14} />
                        <span>{skill.name}</span>
                      </motion.div>
                    ))}
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
