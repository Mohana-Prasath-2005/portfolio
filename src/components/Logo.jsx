// Original mark: a hexagonal cell framing a circuit-trace "M" with terminal nodes.
// Same geometry as public/logo.svg (the favicon). The trace redraws on hover.
export default function Logo({ size = 36, className = '', animated = true }) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={`group/logo flex-shrink-0 ${className}`}
      aria-hidden="true"
    >
      <path
        d="M32 7.5 53.2 19.75v24.5L32 56.5 10.8 44.25v-24.5Z"
        fill="none"
        className="stroke-fg/85 transition-[stroke] duration-500 group-hover/logo:stroke-accent/60"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="M21 42V23l11 11 11-11v19"
        fill="none"
        pathLength="100"
        className={`stroke-accent ${animated ? 'logo-trace' : ''}`}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="21" cy="42" r="3.6" className="fill-accent" />
      <circle cx="43" cy="42" r="3.6" className="fill-accent" />
      <circle cx="32" cy="34" r="3.2" className="fill-fg" />
    </svg>
  )
}
