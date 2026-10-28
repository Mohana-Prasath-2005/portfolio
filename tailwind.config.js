/** @type {import('tailwindcss').Config} */
const token = (name) => `rgb(var(--${name}) / <alpha-value>)`

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // All colors come from the design tokens in src/index.css (:root)
      colors: {
        canvas: token('canvas'),
        surface: token('surface'),
        raised: token('raised'),
        fg: {
          DEFAULT: token('fg'),
          muted: token('fg-muted'),
          dim: token('fg-dim'),
        },
        accent: {
          DEFAULT: token('accent'),
          soft: token('accent-soft'),
        },
        signal: token('signal'),
        warm: token('warm'),
        display: token('display'),
      },
      fontFamily: {
        // Technical type system: squared display face + monospace for everything else
        display: ['"Chakra Petch"', '"JetBrains Mono"', 'system-ui', 'sans-serif'],
        sans: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      maxWidth: {
        shell: '80rem',
      },
      boxShadow: {
        panel: 'var(--shadow-panel)',
        lift: 'var(--shadow-lift)',
      },
    },
  },
  plugins: [],
}
