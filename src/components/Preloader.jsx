import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

export default function Preloader({ onComplete }) {
  const [count, setCount] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    // Simulate loading with eased counter
    const duration = 2000
    const start = Date.now()

    const tick = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * 100))

      if (progress < 1) {
        requestAnimationFrame(tick)
      } else {
        setTimeout(() => setDone(true), 400)
        setTimeout(() => onComplete(), 1200)
      }
    }

    requestAnimationFrame(tick)
  }, [onComplete])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          exit={{ y: '-100%' }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#030014]"
        >
          {/* Gradient orbs */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
            <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] rounded-full bg-accent/5 blur-[100px]" />
          </div>

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="relative z-10"
          >
            <div className="text-6xl md:text-8xl font-bold tracking-tighter">
              <motion.span
                className="inline-block gradient-text"
                animate={{ rotateY: [0, 360] }}
                transition={{ duration: 2, ease: 'easeInOut' }}
              >
                M
              </motion.span>
              <motion.span
                className="inline-block text-white"
                animate={{ rotateY: [0, 360] }}
                transition={{ duration: 2, ease: 'easeInOut', delay: 0.1 }}
              >
                P
              </motion.span>
            </div>
          </motion.div>

          {/* Progress bar */}
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: '200px' }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="relative z-10 mt-8 h-[2px] bg-white/5 rounded-full overflow-hidden"
          >
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
              style={{ width: `${count}%` }}
            />
          </motion.div>

          {/* Counter */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="relative z-10 mt-4 font-mono text-sm text-slate-500"
          >
            {count}%
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
