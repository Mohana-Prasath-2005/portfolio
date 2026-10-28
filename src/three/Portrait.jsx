import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import avatarUrl from '../assets/avatar.jpg'

// A halftone replica of the portrait in 3D.
// - The figure is separated from the backdrop by texture energy (the source is a
//   dot-matrix render on a smooth background, so brightness alone can't do it).
// - Tone blends global levels with local contrast so eyes, glasses and beard read,
//   and highlights are compressed so the shirt doesn't dominate the face.
// - Depth is a rounded volume grown from the silhouette, so turning reveals form.
const WIDTH = 5.2 // world width of the portrait
const N = 480 // analysis resolution

function blur(src, w, h, r) {
  const tmp = new Float32Array(src.length)
  const out = new Float32Array(src.length)
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let s = 0, c = 0
      for (let k = -r; k <= r; k++) { const xx = x + k; if (xx >= 0 && xx < w) { s += src[y * w + xx]; c++ } }
      tmp[y * w + x] = s / c
    }
  }
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let s = 0, c = 0
      for (let k = -r; k <= r; k++) { const yy = y + k; if (yy >= 0 && yy < h) { s += tmp[yy * w + x]; c++ } }
      out[y * w + x] = s / c
    }
  }
  return out
}

const quantile = (arr, p) => {
  const a = Float32Array.from(arr).sort()
  return a[Math.floor(p * (a.length - 1))]
}

export function useFigure(cells) {
  const [data, setData] = useState(null)
  useEffect(() => {
    let alive = true
    const img = new Image()
    img.onload = () => {
      const c = document.createElement('canvas')
      c.width = c.height = N
      const ctx = c.getContext('2d', { willReadFrequently: true })
      ctx.drawImage(img, 0, 0, N, N)
      const px = ctx.getImageData(0, 0, N, N).data
      const grey = new Float32Array(N * N)
      for (let i = 0; i < grey.length; i++) grey[i] = (0.2126 * px[i * 4] + 0.7152 * px[i * 4 + 1] + 0.0722 * px[i * 4 + 2]) / 255
      const soft = blur(grey, N, N, 3)

      // per-cell brightness (of the de-dotted image) and texture energy
      const cs = N / cells
      const M = cells * cells
      const lum = new Float32Array(M)
      const tex = new Float32Array(M)
      for (let cy = 0; cy < cells; cy++) {
        for (let cx = 0; cx < cells; cx++) {
          let sl = 0, st = 0, n = 0
          for (let y = Math.floor(cy * cs); y < Math.floor((cy + 1) * cs); y++) {
            for (let x = Math.floor(cx * cs); x < Math.floor((cx + 1) * cs); x++) {
              const i = y * N + x
              sl += soft[i]
              st += Math.abs(grey[i] - soft[i])
              n++
            }
          }
          lum[cy * cells + cx] = sl / n
          tex[cy * cells + cx] = st / n
        }
      }

      // figure mask
      const energy = blur(tex, cells, cells, 3)
      const thr = quantile(energy, 0.55)
      const mask = energy.map((v) => Math.min(1, Math.max(0, (v - thr) / (thr * 0.6))))

      // rounded volume from the silhouette
      let vol = Float32Array.from(mask, (m) => (m > 0.2 ? 1 : 0))
      const r = Math.round(cells / 28)
      for (let i = 0; i < 3; i++) vol = blur(vol, cells, cells, r)

      // tone: global levels + local contrast, highlights compressed
      const lr = Math.round(cells / 14)
      const mean = blur(lum, cells, cells, lr)
      const meanSq = blur(lum.map((v) => v * v), cells, cells, lr)
      const fig = lum.filter((_, i) => mask[i] > 0)
      const lo = quantile(fig, 0.04)
      const hi = quantile(fig, 0.985)

      const tone = new Float32Array(M)
      for (let i = 0; i < M; i++) {
        if (mask[i] <= 0) continue
        const glob = Math.min(1, Math.max(0, (lum[i] - lo) / (hi - lo)))
        const sd = Math.sqrt(Math.max(1e-5, meanSq[i] - mean[i] * mean[i]))
        const loc = Math.min(1, Math.max(0, 0.5 + (lum[i] - mean[i]) / (sd * 3.2)))
        tone[i] = Math.pow(0.55 * glob + 0.45 * loc, 0.9) * (1 - (0.25 * Math.max(0, glob - 0.75)) / 0.25)
        vol[i] = Math.sqrt(vol[i])
      }
      if (alive) setData({ cells, tone, mask, vol, step: WIDTH / cells })
    }
    img.src = avatarUrl
    return () => {
      alive = false
    }
  }, [cells])
  return data
}

const vertex = /* glsl */ `
  uniform float uTime;
  uniform float uIntro;
  uniform float uDot;
  uniform float uPixelRatio;
  uniform vec3 uPointer;
  uniform float uScan;
  uniform float uViewport;
  attribute float aLevel;
  attribute float aSize;
  attribute float aSeed;
  attribute float aEdge;
  varying float vLevel;
  varying float vBand;
  varying float vPush;
  varying float vFade;
  varying float vEdge;
  varying float vGlitch;

  float hash(float n) { return fract(sin(n) * 43758.5453); }

  void main() {
    vec3 p = position;
    vEdge = aEdge;
    // hologram interference: now and then a thin slice of rows jumps sideways
    float slice = floor(p.y * 7.0);
    float tick = floor(uTime * 7.0);
    float g = step(0.965, hash(slice * 91.7 + tick * 13.3)) * step(0.5, uIntro) * step(0.001, uTime);
    p.x += g * (hash(slice + tick) - 0.5) * 0.45;
    vGlitch = g;
    // fade the lower edge so the bust dissolves instead of being cut off
    vFade = smoothstep(-2.6, -1.3, position.y);
    // assemble from depth on load
    float t = clamp(uIntro * 1.6 - aSeed * 0.6, 0.0, 1.0);
    t = 1.0 - pow(1.0 - t, 3.0);
    p.z = mix(p.z - 4.0 - aSeed * 3.0, p.z, t);
    p.z += sin(uTime * 1.2 + aSeed * 40.0) * 0.01;

    // pointer pushes dots aside within the picture plane
    vec2 d = p.xy - uPointer.xy;
    float push = smoothstep(0.7, 0.0, length(d)) * uPointer.z;
    p.xy += normalize(d + 1e-4) * push * 0.28;
    p.z += push * 0.45;
    vPush = push;

    vBand = exp(-pow((p.y - uScan) * 9.0, 2.0));

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    // halftone: dot diameter follows brightness, in world units projected to pixels
    float world = uDot * aSize;
    gl_PointSize = max(1.6 * uPixelRatio, world * projectionMatrix[1][1] * uPixelRatio * 0.5 * uViewport / -mv.z);
    vLevel = aLevel;
  }
`

const fragment = /* glsl */ `
  uniform vec3 uDeep;
  uniform vec3 uIce;
  uniform vec3 uAccent;
  varying float vLevel;
  varying float vBand;
  varying float vPush;
  varying float vFade;
  varying float vEdge;
  varying float vGlitch;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = 1.0 - smoothstep(0.42, 0.5, d);
    if (a <= 0.0) discard;
    vec3 col = mix(uDeep, uIce, smoothstep(0.0, 0.95, vLevel));
    // cyan rim light around the silhouette
    col = mix(col, uAccent, vEdge * 0.75);
    col = mix(col, uAccent, clamp(vBand * 0.9 + vPush + vGlitch * 0.8, 0.0, 1.0));
    col += vBand * 0.35;
    gl_FragColor = vec4(col, a * (0.5 + vLevel * 0.5 + vEdge * 0.25) * vFade);
  }
`

/* ------------------------------------------------------------------ */
/* Style 1 — halftone dots                                              */
/* ------------------------------------------------------------------ */
function buildDots(fig) {
    const { cells, tone, mask, vol, step } = fig
    const pos = [], level = [], sz = [], seed = []
    for (let y = 0; y < cells; y++) {
      for (let x = 0; x < cells; x++) {
        const i = y * cells + x
        if (mask[i] <= 0) continue
        const t = tone[i]
        pos.push((x - cells / 2 + 0.5) * step, (cells / 2 - y - 0.5) * step, vol[i] * WIDTH * 0.22 + t * WIDTH * 0.06 - WIDTH * 0.12)
        level.push(t)
        sz.push((0.18 + 0.82 * Math.pow(t, 0.75)) * (0.55 + 0.45 * mask[i]))
        seed.push(Math.random())
      }
    }
    return pointGeometry(pos, level, sz, seed)
}

function pointGeometry(pos, level, sz, seed, edge) {
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  g.setAttribute('aLevel', new THREE.Float32BufferAttribute(level, 1))
  g.setAttribute('aSize', new THREE.Float32BufferAttribute(sz, 1))
  g.setAttribute('aSeed', new THREE.Float32BufferAttribute(seed, 1))
  g.setAttribute('aEdge', new THREE.Float32BufferAttribute(edge || new Array(level.length).fill(0), 1))
  return g
}

// Engraved scan lines: each row is a run of tightly packed points whose size
// follows brightness, so lines swell where the face is lit; depth lifts each row.
function buildEngraving(fig) {
  const { cells, tone, mask, vol, step } = fig
  const ROW = 2   // a line every 2 cells
  const SUB = 3   // points per cell along the line
  const pos = [], level = [], sz = [], seed = [], edge = []
  const at = (arr, x, y) => arr[y * cells + Math.min(cells - 1, Math.max(0, x))]
  for (let y = 0; y < cells; y += ROW) {
    const rowSeed = y / cells
    for (let x = 0; x < cells - 1; x++) {
      for (let k = 0; k < SUB; k++) {
        const f = k / SUB
        const m = at(mask, x, y) * (1 - f) + at(mask, x + 1, y) * f
        if (m <= 0.05) continue
        const t = at(tone, x, y) * (1 - f) + at(tone, x + 1, y) * f
        const v = at(vol, x, y) * (1 - f) + at(vol, x + 1, y) * f
        const z = v * WIDTH * 0.24 + t * WIDTH * 0.05
        pos.push((x + f - cells / 2 + 0.5) * step, (cells / 2 - y - 0.5) * step + z * 0.3, z - WIDTH * 0.12)
        level.push(t)
        // thickness: thin hairline in shadow, up to ~half the row spacing in light
        sz.push((0.35 + 1.25 * Math.pow(t, 0.85)) * Math.min(1, m * 1.6))
        seed.push(rowSeed * 0.8 + Math.random() * 0.2)
        // thin volume = near the silhouette edge
        edge.push(1 - Math.min(1, Math.max(0, (v - 0.35) / 0.4)))
      }
    }
  }
  return pointGeometry(pos, level, sz, seed, edge)
}

function Dots({ fig, scale, pointer, animate, scan, build = buildDots }) {
  const mat = useRef()
  const { gl, size } = useThree()
  const geometry = useMemo(() => build(fig), [fig, build])
  useEffect(() => () => geometry.dispose(), [geometry])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uIntro: { value: animate ? 0 : 1 },
      uDot: { value: 0 },
      uViewport: { value: size.height },
      uPixelRatio: { value: Math.min(gl.getPixelRatio(), 2) },
      uPointer: { value: pointer.current },
      uScan: { value: 9 },
      uDeep: { value: new THREE.Color('#2b44d6') },
      uIce: { value: new THREE.Color('#e6fbff') },
      uAccent: { value: new THREE.Color('#2ee5ff') },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [animate, gl]
  )

  useFrame((state, delta) => {
    const u = mat.current?.uniforms
    if (!u) return
    u.uDot.value = fig.step * scale
    u.uViewport.value = state.size.height
    if (animate) {
      u.uTime.value += delta
      u.uIntro.value = Math.min(1, u.uIntro.value + delta * 0.5)
      u.uScan.value = WIDTH / 2 - ((u.uTime.value * 0.28) % 1) * WIDTH * 1.2
    } else u.uScan.value = 99
    if (scan) scan.current = u.uScan.value
  })

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial ref={mat} uniforms={uniforms} vertexShader={vertex} fragmentShader={fragment} transparent depthWrite={false} />
    </points>
  )
}

/* ------------------------------------------------------------------ */
/* Style 2 — lidar scan lines: rows displaced by depth                  */
/* ------------------------------------------------------------------ */
const lineVertex = /* glsl */ `
  uniform float uTime;
  uniform float uIntro;
  uniform vec3 uPointer;
  uniform float uScan;
  attribute float aTone;
  attribute float aRow;
  varying float vTone;
  varying float vBand;
  varying float vFade;
  void main() {
    vec3 p = position;
    vFade = smoothstep(-2.6, -1.3, position.y);
    // rows draw in from the left on load
    float reveal = smoothstep(p.x - 0.6, p.x, (uIntro * 1.4 - aRow * 0.4) * 6.0 - 3.0);
    p.z *= reveal;
    // pointer: a ripple that lifts the lines
    float d = length(p.xy - uPointer.xy);
    float lift = smoothstep(0.9, 0.0, d) * uPointer.z;
    p.y += lift * 0.12 * sin(d * 18.0 - uTime * 6.0);
    p.z += lift * 0.35;
    vBand = exp(-pow((p.y - uScan) * 7.0, 2.0)) + lift * 0.6;
    vTone = aTone * reveal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`
const lineFragment = /* glsl */ `
  uniform vec3 uDeep;
  uniform vec3 uIce;
  uniform vec3 uAccent;
  varying float vTone;
  varying float vBand;
  varying float vFade;
  void main() {
    vec3 col = mix(uDeep, uIce, smoothstep(0.05, 0.9, vTone));
    col = mix(col, uAccent, clamp(vBand, 0.0, 1.0) * 0.85);
    gl_FragColor = vec4(col, (0.12 + vTone * 0.95) * vFade);
  }
`

function Lines({ fig, pointer, animate, mobile }) {
  const mat = useRef()
  const geometry = useMemo(() => {
    const { cells, tone, mask, vol, step } = fig
    const every = mobile ? 2 : 2
    const pos = [], tn = [], row = []
    for (let y = 0; y < cells; y += every) {
      const yy = (cells / 2 - y - 0.5) * step
      let prev = null
      for (let x = 0; x < cells; x++) {
        const i = y * cells + x
        if (mask[i] <= 0.05) { prev = null; continue }
        const t = tone[i]
        const z = vol[i] * WIDTH * 0.24 + t * WIDTH * 0.05
        // Joy-Division style: depth also lifts the line, so form reads head-on
        const v = [(x - cells / 2 + 0.5) * step, yy + z * 0.32, z - WIDTH * 0.12]
        if (prev) {
          pos.push(...prev.v, ...v)
          tn.push(prev.t * Math.min(1, prev.m * 2), t * Math.min(1, mask[i] * 2))
          row.push(y / cells, y / cells)
        }
        prev = { v, t, m: mask[i] }
      }
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
    g.setAttribute('aTone', new THREE.Float32BufferAttribute(tn, 1))
    g.setAttribute('aRow', new THREE.Float32BufferAttribute(row, 1))
    return g
  }, [fig, mobile])
  useEffect(() => () => geometry.dispose(), [geometry])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uIntro: { value: animate ? 0 : 1 },
      uPointer: { value: pointer.current },
      uScan: { value: 9 },
      uDeep: { value: new THREE.Color('#1d4fb0') },
      uIce: { value: new THREE.Color('#e3f8ff') },
      uAccent: { value: new THREE.Color('#2ee5ff') },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [animate]
  )

  useFrame((state, delta) => {
    const u = mat.current?.uniforms
    if (!u) return
    if (animate) {
      u.uTime.value += delta
      u.uIntro.value = Math.min(1, u.uIntro.value + delta * 0.45)
      u.uScan.value = WIDTH / 2 - ((u.uTime.value * 0.22) % 1) * WIDTH * 1.2
    } else u.uScan.value = 99
  })

  return (
    <lineSegments geometry={geometry} frustumCulled={false}>
      <shaderMaterial ref={mat} uniforms={uniforms} vertexShader={lineVertex} fragmentShader={lineFragment} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
    </lineSegments>
  )
}

/* ------------------------------------------------------------------ */
/* Style 3 — pin art: lit 3D pins extruded by brightness                */
/* ------------------------------------------------------------------ */
function Pins({ fig, pointer, animate }) {
  const mesh = useRef()
  const pins = useMemo(() => {
    // coarser grid so each pin reads as an object
    const out = []
    const { cells, tone, mask, vol, step } = fig
    const k = 1
    for (let y = 0; y < cells; y += k) {
      for (let x = 0; x < cells; x += k) {
        const i = y * cells + x
        if (mask[i] <= 0.15) continue
        out.push({
          x: (x - cells / 2 + k / 2) * step,
          y: (cells / 2 - y - k / 2) * step,
          base: vol[i] * WIDTH * 0.18 - WIDTH * 0.1,
          len: 0.02 + Math.pow(tone[i], 1.2) * 0.32,
          t: tone[i],
          m: mask[i],
          press: 0,
        })
      }
    }
    return { list: out, size: step * k * 0.84 }
  }, [fig])

  const geo = useMemo(() => {
    const g = new THREE.BoxGeometry(1, 1, 1)
    g.translate(0, 0, 0.5) // extrude toward the viewer
    return g
  }, [])
  const mat = useMemo(() => new THREE.MeshStandardMaterial({ roughness: 0.35, metalness: 0.25, vertexColors: false }), [])
  useEffect(() => () => { geo.dispose(); mat.dispose() }, [geo, mat])

  const tmp = useMemo(() => new THREE.Object3D(), [])
  const col = useMemo(() => new THREE.Color(), [])
  const deep = useMemo(() => new THREE.Color('#0b1d45'), [])
  const ice = useMemo(() => new THREE.Color('#e6f8ff'), [])
  const intro = useRef(animate ? 0 : 1)

  useEffect(() => {
    const m = mesh.current
    if (!m) return
    pins.list.forEach((p, i) => {
      col.copy(deep).lerp(ice, Math.pow(p.t, 1.15))
      m.setColorAt(i, col)
    })
    m.instanceColor.needsUpdate = true
  }, [pins, col, deep, ice])

  useFrame((state, delta) => {
    const m = mesh.current
    if (!m) return
    if (animate) intro.current = Math.min(1, intro.current + delta * 0.5)
    const ease = 1 - Math.pow(1 - intro.current, 3)
    const P = pointer.current
    const k = animate ? 1 - Math.exp(-delta * 10) : 1
    const t = state.clock.elapsedTime
    pins.list.forEach((p, i) => {
      const d = Math.hypot(p.x - P.x, p.y - P.y)
      const target = P.z * Math.max(0, 1 - d / 0.7)
      p.press += (target - p.press) * k
      const wave = animate ? Math.sin(t * 1.6 - p.y * 3.0) * 0.015 : 0
      // pressed pins sink, the ring around the pointer rises (pin-art toy)
      const ring = P.z * Math.exp(-Math.pow((d - 0.75) * 6, 2)) * 0.12
      const len = Math.max(0.015, (p.len * (1 - p.press * 0.9) + ring + wave) * ease)
      tmp.position.set(p.x, p.y, p.base)
      tmp.scale.set(pins.size, pins.size, len)
      tmp.updateMatrix()
      m.setMatrixAt(i, tmp.matrix)
    })
    m.instanceMatrix.needsUpdate = true
  })

  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 4, 6]} intensity={2.2} color="#eaf6ff" />
      <directionalLight position={[-5, -1, 2]} intensity={1.4} color="#2ee5ff" />
      <instancedMesh ref={mesh} args={[geo, mat, pins.list.length]} frustumCulled={false} />
    </>
  )
}

/* ------------------------------------------------------------------ */
/* Hologram rig — projector base, light cone, rising data, orbit, beam  */
/* ------------------------------------------------------------------ */
const BASE_Y = -2.45 // where the bust dissolves into the projector

// Ring on the XZ plane as line segments; `on`/`period` cut it into dashes,
// `tick` adds short radial marks instead of an arc.
function ringGeometry(r, { segs = 128, on = 0, period = 0, tick = 0 } = {}) {
  const pts = []
  for (let i = 0; i < segs; i++) {
    const a0 = (i / segs) * Math.PI * 2
    const a1 = ((i + 1) / segs) * Math.PI * 2
    if (tick) {
      const len = i % 8 === 0 ? tick * 2 : tick
      pts.push(Math.cos(a0) * r, 0, Math.sin(a0) * r, Math.cos(a0) * (r + len), 0, Math.sin(a0) * (r + len))
      continue
    }
    if (period && i % period >= on) continue
    pts.push(Math.cos(a0) * r, 0, Math.sin(a0) * r, Math.cos(a1) * r, 0, Math.sin(a1) * r)
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3))
  return g
}

function Ring({ r, opacity, speed = 0, animate, ...opts }) {
  const ref = useRef()
  const geo = useMemo(() => ringGeometry(r, opts), [r, opts.segs, opts.on, opts.period, opts.tick]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => geo.dispose(), [geo])
  useFrame((_, delta) => {
    if (animate && ref.current) ref.current.rotation.y += delta * speed
  })
  return (
    <lineSegments ref={ref} geometry={geo}>
      <lineBasicMaterial color="#2ee5ff" transparent opacity={opacity} blending={THREE.AdditiveBlending} depthWrite={false} />
    </lineSegments>
  )
}

const coneVertex = /* glsl */ `
  varying float vY;
  varying float vRim;
  void main() {
    vY = uv.y;
    vec3 n = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vRim = 1.0 - abs(dot(n, normalize(-mv.xyz)));
    gl_Position = projectionMatrix * mv;
  }
`
const coneFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uTime;
  varying float vY;
  varying float vRim;
  void main() {
    float fall = pow(1.0 - vY, 2.2);
    float bands = 0.75 + 0.25 * sin(vY * 40.0 - uTime * 3.0);
    gl_FragColor = vec4(uColor, fall * (0.05 + vRim * 0.16) * bands);
  }
`

const glowFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uTime;
  varying vec2 vUv;
  void main() {
    float d = length(vUv - 0.5) * 2.0;
    float core = smoothstep(1.0, 0.0, d);
    float pulse = 0.85 + 0.15 * sin(uTime * 2.0);
    gl_FragColor = vec4(uColor, core * core * 0.45 * pulse);
  }
`
const uvVertex = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`

const riseVertex = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  attribute float aSeed;
  attribute float aAngle;
  attribute float aR;
  varying float vLife;
  void main() {
    float life = fract(aSeed + uTime * (0.06 + aSeed * 0.05));
    float r = aR * mix(1.0, 1.35, life);
    vec3 p = vec3(cos(aAngle) * r, life * 3.6, sin(aAngle) * r);
    vLife = life;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (1.5 + aSeed * 2.5) * uPixelRatio * (8.0 / -mv.z);
  }
`
const riseFragment = /* glsl */ `
  uniform vec3 uColor;
  varying float vLife;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float a = smoothstep(0.0, 0.1, vLife) * (1.0 - vLife);
    gl_FragColor = vec4(uColor, a * (1.0 - d * 2.0) * 0.9);
  }
`

function HoloBase({ animate, mobile }) {
  const { gl } = useThree()
  const cone = useRef()
  const glow = useRef()
  const rise = useRef()
  const coneUniforms = useMemo(() => ({ uColor: { value: new THREE.Color('#2ee5ff') }, uTime: { value: 0 } }), [])
  const glowUniforms = useMemo(() => ({ uColor: { value: new THREE.Color('#2ee5ff') }, uTime: { value: 0 } }), [])
  const riseUniforms = useMemo(
    () => ({ uColor: { value: new THREE.Color('#b8f3ff') }, uTime: { value: 0 }, uPixelRatio: { value: Math.min(gl.getPixelRatio(), 2) } }),
    [gl]
  )
  const riseGeo = useMemo(() => {
    const n = mobile ? 90 : 180
    const g = new THREE.BufferGeometry()
    const seed = new Float32Array(n), angle = new Float32Array(n), r = new Float32Array(n)
    for (let i = 0; i < n; i++) {
      seed[i] = Math.random()
      angle[i] = Math.random() * Math.PI * 2
      r[i] = 0.4 + Math.sqrt(Math.random()) * 1.4
    }
    g.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(n * 3), 3))
    g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1))
    g.setAttribute('aAngle', new THREE.BufferAttribute(angle, 1))
    g.setAttribute('aR', new THREE.BufferAttribute(r, 1))
    return g
  }, [mobile])
  useEffect(() => () => riseGeo.dispose(), [riseGeo])

  useFrame((_, delta) => {
    if (!animate) return
    for (const m of [cone, glow, rise]) if (m.current) m.current.uniforms.uTime.value += delta
  })

  return (
    <group position={[0, BASE_Y, 0.15]}>
      {/* light cone rising from the emitter */}
      <mesh position={[0, 1.9, 0]} renderOrder={-1}>
        <cylinderGeometry args={[2.3, 1.55, 3.8, 64, 1, true]} />
        <shaderMaterial ref={cone} uniforms={coneUniforms} vertexShader={coneVertex} fragmentShader={coneFragment} transparent depthWrite={false} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
      </mesh>
      {/* emitter glow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4.6, 4.6]} />
        <shaderMaterial ref={glow} uniforms={glowUniforms} vertexShader={uvVertex} fragmentShader={glowFragment} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
      <Ring r={1.55} opacity={0.9} animate={animate} />
      <Ring r={1.85} opacity={0.55} speed={0.25} on={10} period={16} animate={animate} />
      <Ring r={2.2} opacity={0.4} speed={-0.12} segs={96} tick={0.08} animate={animate} />
      <Ring r={2.55} opacity={0.22} speed={0.06} on={2} period={4} segs={160} animate={animate} />
      {/* data rising through the beam */}
      <points geometry={riseGeo} frustumCulled={false}>
        <shaderMaterial ref={rise} uniforms={riseUniforms} vertexShader={riseVertex} fragmentShader={riseFragment} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>
    </group>
  )
}

// A tilted ring orbiting the chest, with nodes travelling along it.
function Orbit({ animate }) {
  const spin = useRef()
  const nodes = useRef([])
  const R = 2.35
  const geo = useMemo(() => ringGeometry(R, { segs: 160, on: 6, period: 8 }), [])
  useEffect(() => () => geo.dispose(), [geo])
  useFrame((state, delta) => {
    if (!animate) return
    if (spin.current) spin.current.rotation.y += delta * 0.18
    const t = state.clock.elapsedTime
    nodes.current.forEach((n, i) => {
      if (!n) return
      const a = t * (0.5 + i * 0.12) + (i * Math.PI * 2) / 3
      n.position.set(Math.cos(a) * R, 0, Math.sin(a) * R)
    })
  })
  return (
    <group position={[0, -0.55, 0.1]} rotation={[0.22, 0, -0.1]}>
      <group ref={spin}>
        <lineSegments geometry={geo}>
          <lineBasicMaterial color="#2ee5ff" transparent opacity={0.35} blending={THREE.AdditiveBlending} depthWrite={false} />
        </lineSegments>
        {[0, 1, 2].map((i) => (
          <mesh key={i} ref={(el) => (nodes.current[i] = el)} position={[Math.cos((i * Math.PI * 2) / 3) * R, 0, Math.sin((i * Math.PI * 2) / 3) * R]}>
            <sphereGeometry args={[0.04, 12, 12]} />
            <meshBasicMaterial color={i === 0 ? '#ffffff' : '#2ee5ff'} transparent opacity={0.95} blending={THREE.AdditiveBlending} depthWrite={false} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

const beamFragment = /* glsl */ `
  uniform vec3 uColor;
  varying vec2 vUv;
  void main() {
    float y = abs(vUv.y - 0.5) * 2.0;
    float x = 1.0 - pow(abs(vUv.x - 0.5) * 2.0, 4.0);
    float line = smoothstep(0.08, 0.0, y);
    float haze = pow(1.0 - y, 3.0) * 0.18;
    gl_FragColor = vec4(uColor, (line * 0.8 + haze) * x);
  }
`

// Horizontal scanning beam that follows the scan band in the figure.
function Beam({ scan }) {
  const ref = useRef()
  const uniforms = useMemo(() => ({ uColor: { value: new THREE.Color('#2ee5ff') } }), [])
  useFrame(() => {
    const m = ref.current
    if (!m) return
    const y = scan.current
    m.visible = y > BASE_Y + 0.4 && y < WIDTH / 2
    m.position.y = y
  })
  return (
    <mesh ref={ref} position={[0, 99, 0.6]}>
      <planeGeometry args={[WIDTH * 0.9, 0.5]} />
      <shaderMaterial uniforms={uniforms} vertexShader={uvVertex} fragmentShader={beamFragment} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
    </mesh>
  )
}

/* ------------------------------------------------------------------ */

const Engraving = (props) => <Dots {...props} build={buildEngraving} />
const STYLES = { dots: Dots, lines: Engraving, scan: Lines, pins: Pins }

export default function Portrait({ input, animate, mobile, style = 'lines' }) {
  const fig = useFigure(style === 'pins' ? (mobile ? 90 : 120) : mobile ? 120 : 160)
  const group = useRef()
  const { size } = useThree()
  const pointer = useRef(new THREE.Vector3(99, 99, 0))
  const scan = useRef(99)
  const ray = useMemo(() => new THREE.Raycaster(), [])
  const ndc = useMemo(() => new THREE.Vector2(), [])
  const plane = useMemo(() => new THREE.Plane(), [])
  const normal = useMemo(() => new THREE.Vector3(), [])
  const hit = useMemo(() => new THREE.Vector3(), [])

  const wide = size.width >= 1024
  const fit = Math.min(1, size.width / size.height / 1.6)
  const base = wide ? [3.1 * fit, 0.55, 0] : [0, 2.7, -2.6]
  const scale = wide ? 0.72 * Math.max(0.66, fit) : 0.6
  const yaw = wide ? -0.28 * fit : 0

  useFrame((state, delta) => {
    const g = group.current
    if (!g) return
    const s = input.current
    const k = animate ? 1 - Math.exp(-delta * 3) : 1

    // rise out of frame as the hero scrolls away
    const e = s.explode
    g.position.set(base[0], base[1] + e * e * 6, base[2] - e * 4)
    g.scale.setScalar(scale)
    g.visible = e < 0.98
    const px = s.inside ? s.px : 0
    const py = s.inside ? s.py : 0
    const sway = animate && !s.inside ? Math.sin(state.clock.elapsedTime * 0.35) * 0.12 : 0
    g.rotation.y += (yaw + sway + px * 0.32 - g.rotation.y) * k
    g.rotation.x += (0.16 - py * 0.1 - g.rotation.x) * k // lean back so the projector reads from above

    // pointer → local portrait plane
    const P = pointer.current
    if (animate && s.inside) {
      ndc.set(s.px, s.py)
      ray.setFromCamera(ndc, state.camera)
      normal.set(0, 0, 1).applyQuaternion(g.quaternion)
      plane.setFromNormalAndCoplanarPoint(normal, g.position)
      if (ray.ray.intersectPlane(plane, hit)) {
        g.worldToLocal(hit)
        P.x += (hit.x - P.x) * 0.35
        P.y += (hit.y - P.y) * 0.35
      }
      P.z += (1 - P.z) * k
    } else {
      P.z += (0 - P.z) * k
    }
  })

  const Style = STYLES[style] || Lines
  return (
    <group ref={group}>
      {fig && <Style fig={fig} scale={scale} pointer={pointer} animate={animate} mobile={mobile} scan={scan} />}
      {fig && (
        <>
          <HoloBase animate={animate} mobile={mobile} />
          <Orbit animate={animate} />
          {animate && <Beam scan={scan} />}
        </>
      )}
    </group>
  )
}
