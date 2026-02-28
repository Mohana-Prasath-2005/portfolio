import { motion, useScroll, useTransform } from 'framer-motion'
import useIsMobile from '../hooks/useIsMobile'

const shapes = [
  { type: 'circle', size: 6, x: '10%', y: '20%', color: 'bg-primary/10', delay: 0 },
  { type: 'square', size: 4, x: '85%', y: '15%', color: 'bg-accent/10', delay: 1 },
  { type: 'circle', size: 8, x: '75%', y: '45%', color: 'bg-primary/5', delay: 2 },
  { type: 'triangle', size: 5, x: '15%', y: '60%', color: 'border-accent/20', delay: 0.5 },
  { type: 'square', size: 3, x: '90%', y: '70%', color: 'bg-primary/8', delay: 1.5 },
  { type: 'circle', size: 5, x: '50%', y: '85%', color: 'bg-accent/8', delay: 3 },
  { type: 'ring', size: 10, x: '20%', y: '80%', color: 'border-primary/10', delay: 2.5 },
  { type: 'square', size: 6, x: '60%', y: '25%', color: 'bg-accent/5', delay: 0.8 },
]

function Shape({ shape }) {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 5000], [0, -shape.size * 40])
  const rotate = useTransform(scrollY, [0, 5000], [0, 360])

  if (shape.type === 'triangle') {
    return (
      <motion.div
        style={{ left: shape.x, top: shape.y, y, rotate }}
        className="absolute pointer-events-none z-0"
      >
        <div
          style={{
            borderLeftWidth: shape.size * 2,
            borderRightWidth: shape.size * 2,
            borderBottomWidth: shape.size * 3.5,
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            borderBottomColor: 'rgba(139, 92, 246, 0.08)',
          }}
        />
      </motion.div>
    )
  }

  if (shape.type === 'ring') {
    return (
      <motion.div
        style={{
          left: shape.x, top: shape.y, y, rotate,
          width: shape.size * 4, height: shape.size * 4,
        }}
        className={`absolute pointer-events-none z-0 rounded-full border ${shape.color}`}
      />
    )
  }

  return (
    <motion.div
      style={{
        left: shape.x, top: shape.y, y,
        rotate: shape.type === 'square' ? rotate : undefined,
        width: shape.size * 4, height: shape.size * 4,
      }}
      className={`absolute pointer-events-none z-0 ${shape.color} ${
        shape.type === 'circle' ? 'rounded-full' : 'rounded-sm'
      }`}
    />
  )
}

export default function FloatingShapes() {
  const isMobile = useIsMobile()

  // Skip entirely on mobile — too many scroll-linked transforms
  if (isMobile) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {shapes.map((shape, i) => (
        <Shape key={i} shape={shape} />
      ))}
    </div>
  )
}
