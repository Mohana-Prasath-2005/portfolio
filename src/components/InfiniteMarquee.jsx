import useIsMobile from '../hooks/useIsMobile'

export default function InfiniteMarquee({ items, speed = 25, reverse = false }) {
  const doubled = [...items, ...items]
  const isMobile = useIsMobile()
  const duration = isMobile ? speed + 10 : speed

  return (
    <div className="overflow-hidden whitespace-nowrap">
      <div
        className="inline-flex gap-4 marquee-track"
        style={{
          animationDuration: `${duration}s`,
          animationDirection: reverse ? 'reverse' : 'normal',
        }}
      >
        {doubled.map((item, i) => (
          <div
            key={`${item.name}-${i}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass text-sm text-slate-300 hover:text-white hover:border-primary/30 transition-colors duration-300 flex-shrink-0 group"
          >
            {item.icon && <item.icon className="text-primary/60 group-hover:text-primary transition-colors" size={16} />}
            <span className="font-medium">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
