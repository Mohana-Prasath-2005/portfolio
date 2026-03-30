import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { useState, useEffect, useCallback, useRef } from 'react'
import { HiDownload } from 'react-icons/hi'
import { FaGithub, FaLinkedin } from 'react-icons/fa'
import { SiLeetcode } from 'react-icons/si'
import ParticleBackground from './ParticleBackground'
import MagneticButton from './MagneticButton'
import useIsMobile from '../hooks/useIsMobile'

const roles = ['Software Engineer', 'Data Analyst', 'Full-Stack Developer']

function TypingEffect() {
  const [text, setText] = useState('')
  const [roleIndex, setRoleIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  const tick = useCallback(() => {
    const current = roles[roleIndex]
    if (!isDeleting) {
      setText(current.slice(0, text.length + 1))
      if (text.length + 1 === current.length) {
        setTimeout(() => setIsDeleting(true), 1800)
        return
      }
    } else {
      setText(current.slice(0, text.length - 1))
      if (text.length - 1 === 0) {
        setIsDeleting(false)
        setRoleIndex((prev) => (prev + 1) % roles.length)
        return
      }
    }
  }, [text, roleIndex, isDeleting])

  useEffect(() => {
    const speed = isDeleting ? 40 : 80
    const timer = setTimeout(tick, speed)
    return () => clearTimeout(timer)
  }, [tick, isDeleting])

  return (
    <span className="gradient-text">
      {text}
      <span className="inline-block w-[2px] h-[1em] bg-primary ml-1 animate-pulse align-middle" />
    </span>
  )
}

// 3D perspective name with mouse tracking
function AnimatedName3D() {
  const ref = useRef(null)
  const isMobile = useIsMobile()
  const firstName = 'Mohana Prasath'
  const lastName = 'G'

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [8, -8]), { stiffness: 150, damping: 20 })
  const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-8, 8]), { stiffness: 150, damping: 20 })

  useEffect(() => {
    if (isMobile) return
    const handleMouse = (e) => {
      const rect = ref.current?.getBoundingClientRect()
      if (!rect) return
      mouseX.set(e.clientX - rect.left - rect.width / 2)
      mouseY.set(e.clientY - rect.top - rect.height / 2)
    }
    window.addEventListener('mousemove', handleMouse)
    return () => window.removeEventListener('mousemove', handleMouse)
  }, [isMobile, mouseX, mouseY])

  return (
    <motion.div
      ref={ref}
      style={isMobile ? {} : { rotateX, rotateY, transformPerspective: 800 }}
      className="will-change-transform"
    >
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-4xl sm:text-5xl md:text-7xl font-bold text-white tracking-tight mb-6"
      >
        {firstName.split('').map((char, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 50, rotateX: -90 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.8 + i * 0.04,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="inline-block"
            style={{ transformOrigin: 'bottom' }}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
        {' '}
        <motion.span
          initial={{ opacity: 0, scale: 0, rotate: -180 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.8 + firstName.length * 0.04 + 0.1,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="inline-block gradient-text"
        >
          {lastName}
        </motion.span>
      </motion.h1>

      {/* Glowing underline beneath the name */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 1, delay: 1.4, ease: [0.16, 1, 0.3, 1] }}
        className="h-[2px] w-48 md:w-64 mx-auto bg-gradient-to-r from-transparent via-primary/60 to-transparent origin-center -mt-3 mb-6"
      />
    </motion.div>
  )
}

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center section-padding pt-28 overflow-hidden"
    >
      {/* Particle background */}
      <ParticleBackground />

      {/* Background orbs */}
      <div className="bg-orb w-96 h-96 bg-primary/20 top-20 -left-48" />
      <div className="bg-orb w-80 h-80 bg-accent/20 bottom-20 -right-40" />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* 3D Name with mouse tracking */}
        <AnimatedName3D />

        {/* Typing title */}
        <motion.div
          initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.6, delay: 1.5 }}
          className="text-lg sm:text-xl md:text-2xl font-medium text-slate-300 mb-4 h-9"
        >
          <TypingEffect />
        </motion.div>

        {/* Description with highlighted keywords */}
        <motion.p
          initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.6, delay: 1.7 }}
          className="text-slate-400 max-w-2xl mx-auto mb-8 text-base sm:text-lg leading-relaxed"
        >
          Final-year <span className="text-white">Computer Science</span> engineer who builds practical solutions using{' '}
          <span className="text-primary">data</span>, <span className="text-primary">software</span>, and{' '}
          <span className="text-primary">AI</span>.
          From real-time computer vision systems and IoT-based robotics to financial transaction
          reconciliation platforms — I turn ideas into <span className="text-white">systems that actually work</span>. Alongside technical
          work, I've held <span className="text-white">leadership roles</span> across campus, driving outcomes across teams and departments.
        </motion.p>

        {/* CTA Buttons with Magnetic Effect */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.9 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-12"
        >
          <MagneticButton as="a" href="#projects" className="btn-uiverse" strength={0.4}>
            View Projects
          </MagneticButton>
          <MagneticButton as="a" href="#contact" className="btn-shimmer" strength={0.4}>
            Get in Touch
          </MagneticButton>
          <MagneticButton
            as="a"
            href="/portfolio/Mohana_Prasath_Resume.pdf"
            download="Mohana_Prasath_Resume.pdf"
            className="btn-pulse"
            strength={0.4}
          >
            <HiDownload size={16} />
            Download CV
          </MagneticButton>
        </motion.div>

        {/* Social links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 2.1 }}
          className="flex items-center justify-center gap-5"
        >
          {[
            { icon: FaGithub, href: 'https://github.com/Mohana-Prasath-2005', label: 'GitHub' },
            { icon: FaLinkedin, href: 'https://www.linkedin.com/in/mohana-prasath-g-279139267/', label: 'LinkedIn' },
            { icon: SiLeetcode, href: 'https://leetcode.com/u/MOHAN-2005/', label: 'LeetCode' },
          ].map(({ icon: Icon, href, label }) => (
            <MagneticButton
              key={label}
              as="a"
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl glass text-slate-400 social-magnetic"
              aria-label={label}
              strength={0.5}
            >
              <Icon size={20} />
            </MagneticButton>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-slate-600 text-xs font-mono tracking-wider">SCROLL</span>
            <div className="w-[1px] h-8 bg-gradient-to-b from-slate-500 to-transparent" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
