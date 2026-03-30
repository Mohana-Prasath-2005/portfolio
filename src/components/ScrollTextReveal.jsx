import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

function Word({ children, range, progress }) {
  const opacity = useTransform(progress, range, [0.15, 1])
  const y = useTransform(progress, range, [8, 0])
  const blur = useTransform(progress, [range[0], range[1]], [4, 0])
  const filter = useTransform(blur, (v) => `blur(${v}px)`)

  return (
    <motion.span
      style={{ opacity, y, filter }}
      className="inline-block mr-[0.3em] will-change-transform"
    >
      {children}
    </motion.span>
  )
}

export default function ScrollTextReveal() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.85', 'start 0.25'],
  })

  const words = 'Building systems that merge data, software, and AI — recognized for sustained excellence across academics, leadership, and innovation.'.split(' ')

  return (
    <section ref={ref} className="section-padding py-16 md:py-24">
      <div className="max-w-4xl mx-auto text-center">
        <p className="flex flex-wrap justify-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-snug tracking-tight">
          {words.map((word, i) => {
            const start = i / words.length
            const end = start + 1 / words.length
            const isHighlight = ['data,', 'software,', 'AI', 'excellence', 'leadership,', 'innovation.'].includes(word)
            return (
              <Word key={i} range={[start, end]} progress={scrollYProgress}>
                <span className={isHighlight ? 'gradient-text' : 'text-white'}>
                  {word}
                </span>
              </Word>
            )
          })}
        </p>
      </div>
    </section>
  )
}
