import { motion } from 'framer-motion'

export default function InfiniteMarquee({ items, speed = 25, reverse = false }) {
  // Double the items for seamless loop
  const doubled = [...items, ...items]

  return (
    <div className="overflow-hidden whitespace-nowrap">
      <motion.div
        className="inline-flex gap-4"
        animate={{ x: reverse ? ['0%', '-50%'] : ['-50%', '0%'] }}
        transition={{
          x: {
            duration: speed,
            repeat: Infinity,
            ease: 'linear',
          },
        }}
      >
        {doubled.map((item, i) => (
          <div
            key={`${item.name}-${i}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass text-sm text-slate-300 hover:text-white hover:border-primary/30 transition-all duration-300 flex-shrink-0 group"
          >
            {item.icon && <item.icon className="text-primary/60 group-hover:text-primary transition-colors" size={16} />}
            <span className="font-medium">{item.name}</span>
          </div>
        ))}
      </motion.div>
    </div>
  )
}
