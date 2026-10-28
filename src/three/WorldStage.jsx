import { Component, Suspense, lazy, useEffect, useState } from 'react'
import useMediaQuery from '../hooks/useMediaQuery'
import { useStack } from './store'

const World = lazy(() => import('./World'))

function hasWebGL() {
  try {
    const c = document.createElement('canvas')
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')))
  } catch {
    return false
  }
}

class SceneBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch(error) {
    console.warn('3D environment disabled:', error?.message)
  }
  render() {
    return this.state.failed ? null : this.props.children
  }
}

// Persistent 3D environment behind the page. Loads after first paint;
// the static backdrop remains when WebGL is unavailable.
export default function WorldStage() {
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const mobile = useMediaQuery('(max-width: 767px), (pointer: coarse)')
  const ready = useStack((s) => s.ready)
  const [supported] = useState(hasWebGL)
  const [mount, setMount] = useState(false)

  useEffect(() => {
    if (!supported) return
    const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 200))
    const cancel = window.cancelIdleCallback || clearTimeout
    const id = idle(() => setMount(true), { timeout: 1200 })
    return () => cancel(id)
  }, [supported])

  return (
    <div aria-hidden="true" data-stage={supported ? (ready ? 'webgl' : 'loading') : 'fallback'}>
      <div className="world-fallback" />
      {mount && (
        <SceneBoundary>
          <Suspense fallback={null}>
            <div className="transition-opacity duration-[1600ms] ease-out" style={{ opacity: ready ? 1 : 0 }}>
              <World mobile={mobile} reducedMotion={reducedMotion} />
            </div>
          </Suspense>
        </SceneBoundary>
      )}
      <div className="world-scrim" />
    </div>
  )
}
