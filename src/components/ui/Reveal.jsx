import { motion } from 'framer-motion'

const EASE = [0.16, 1, 0.3, 1]

// Fades content up once as it enters the viewport. Reduced motion is handled
// globally by <MotionConfig reducedMotion="user"> (transforms are skipped).
export default function Reveal({ as = 'div', delay = 0, y = 28, className = '', children, ...props }) {
  const Tag = motion[as]
  return (
    <Tag
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.9, delay, ease: EASE }}
      className={className}
      {...props}
    >
      {children}
    </Tag>
  )
}
