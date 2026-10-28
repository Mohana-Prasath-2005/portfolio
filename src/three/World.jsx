import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import Portrait from './Portrait'
import { stackStore } from './store'

/* ------------------------------------------------------------------ */
/* Terrain — a procedural landscape drawn as topographic contour lines */
/* ------------------------------------------------------------------ */

// Ashima 2D simplex noise (MIT)
const noise = /* glsl */ `
  vec3 permute(vec3 x){return mod(((x*34.0)+1.0)*x,289.0);}
  float snoise(vec2 v){
    const vec4 C=vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);
    vec2 i=floor(v+dot(v,C.yy));
    vec2 x0=v-i+dot(i,C.xx);
    vec2 i1=(x0.x>x0.y)?vec2(1.0,0.0):vec2(0.0,1.0);
    vec4 x12=x0.xyxy+C.xxzz;
    x12.xy-=i1;
    i=mod(i,289.0);
    vec3 p=permute(permute(i.y+vec3(0.0,i1.y,1.0))+i.x+vec3(0.0,i1.x,1.0));
    vec3 m=max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0);
    m=m*m; m=m*m;
    vec3 x=2.0*fract(p*C.www)-1.0;
    vec3 h=abs(x)-0.5;
    vec3 ox=floor(x+0.5);
    vec3 a0=x-ox;
    m*=1.79284291400159-0.85373472095314*(a0*a0+h*h);
    vec3 g;
    g.x=a0.x*x0.x+h.x*x0.y;
    g.yz=a0.yz*x12.xz+h.yz*x12.yw;
    return 130.0*dot(m,g);
  }
`

const terrainVertex = /* glsl */ `
  uniform float uTime;
  varying float vH;
  varying vec3 vWorld;
  ${noise}
  float height(vec2 p) {
    float h = snoise(p * 0.06 + vec2(0.0, uTime * 0.015)) * 1.0
            + snoise(p * 0.14 - vec2(uTime * 0.01, 0.0)) * 0.45
            + snoise(p * 0.33) * 0.12;
    // a calm valley along the camera path, ridges either side
    float valley = smoothstep(2.5, 14.0, abs(p.x));
    return h * (0.35 + valley * 2.2) + valley * 1.2;
  }
  void main() {
    vec3 p = position;
    vec4 world = modelMatrix * vec4(p, 1.0);
    float h = height(world.xz);
    world.y += h;
    vH = h;
    vWorld = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`

const terrainFragment = /* glsl */ `
  uniform vec3 uLine;
  uniform vec3 uGlow;
  uniform vec3 uCam;
  uniform vec2 uPointer;
  uniform float uDim;
  varying float vH;
  varying vec3 vWorld;

  void main() {
    float d = distance(vWorld.xz, uCam.xz);
    float fade = smoothstep(46.0, 6.0, d);
    // contour lines every ~0.32 units of height, anti-aliased with derivatives
    float v = vH * 3.1;
    float lines = smoothstep(0.5 - fwidth(v) * 1.3, 0.5, abs(fract(v) - 0.5));
    // sparse survey grid
    vec2 g = abs(fract(vWorld.xz / 2.0) - 0.5);
    float dots = 1.0 - smoothstep(0.0, 0.035, length(g - 0.5));
    // ridges catch more light
    float lift = smoothstep(-0.5, 2.6, vH);
    // a soft pool of light that follows the pointer across the terrain
    float halo = smoothstep(9.0, 0.0, distance(vWorld.xz, uPointer));
    vec3 col = mix(uLine, uGlow, lift) ;
    float a = (lines * (0.16 + lift * 0.5 + halo * 0.45) + dots * 0.25) * fade;
    gl_FragColor = vec4(col, a * uDim);
  }
`

function Terrain({ animate, input, mobile }) {
  const mat = useRef()
  const seg = mobile ? 140 : 240
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uLine: { value: new THREE.Color('#2ee5ff') },
      uGlow: { value: new THREE.Color('#d8f4ff') },
      uCam: { value: new THREE.Vector3() },
      uPointer: { value: new THREE.Vector2(4, -4) },
      uDim: { value: 1 },
    }),
    []
  )
  const pointer = useMemo(() => new THREE.Vector2(4, -4), [])

  useFrame((state, delta) => {
    if (!mat.current) return
    const u = mat.current.uniforms
    if (animate) u.uTime.value += delta
    // quieter behind reading sections than in the hero
    u.uDim.value = 1 - input.current.explode * 0.45
    u.uCam.value.copy(state.camera.position)
    // project the pointer roughly onto the ground ahead of the camera
    const s = input.current
    pointer.set(state.camera.position.x + s.px * 9, state.camera.position.z - 12 + s.py * 6)
    u.uPointer.value.lerp(pointer, animate ? 1 - Math.exp(-delta * 3) : 1)
  })

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.4, -26]} frustumCulled={false}>
      <planeGeometry args={[90, 90, seg, seg]} />
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        vertexShader={terrainVertex}
        fragmentShader={terrainFragment}
        transparent
        depthWrite={false}
        extensions={{ derivatives: true }}
      />
    </mesh>
  )
}

/* ------------------------------------------------------------------ */
/* Ambient motes — a sparse, slow particle volume for depth            */
/* ------------------------------------------------------------------ */
function Motes({ count, animate }) {
  const ref = useRef()
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const p = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 40
      p[i * 3 + 1] = Math.random() * 9 - 2
      p[i * 3 + 2] = 10 - Math.random() * 70
    }
    g.setAttribute('position', new THREE.BufferAttribute(p, 3))
    return g
  }, [count])
  useEffect(() => () => geo.dispose(), [geo])
  useFrame((state, delta) => {
    if (animate && ref.current) ref.current.rotation.y += delta * 0.004
  })
  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial color="#b8e6ff" size={0.035} sizeAttenuation transparent opacity={0.55} depthWrite={false} />
    </points>
  )
}

/* ------------------------------------------------------------------ */
/* Camera — glides along the valley as the page scrolls                */
/* ------------------------------------------------------------------ */
function Rig({ input, animate }) {
  const look = useMemo(() => new THREE.Vector3(), [])
  useFrame((state, delta) => {
    const s = input.current
    const cam = state.camera
    const k = animate ? 1 - Math.exp(-delta * 2.2) : 1
    const tz = 9 - s.page * 46
    const ty = 1.3 + s.page * 1.6
    cam.position.x += (s.px * 0.45 - cam.position.x) * k
    cam.position.y += (ty + s.py * 0.25 - cam.position.y) * k
    cam.position.z += (tz - cam.position.z) * k
    look.set(cam.position.x * 0.5, cam.position.y - 1.1 - s.page * 0.6, cam.position.z - 10)
    cam.lookAt(look)
  })
  return null
}

// ?portrait=dots|lines|pins switches the hero rendering (for comparing styles)
const portraitStyle = new URLSearchParams(window.location.search).get('portrait') || 'lines'

export default function World({ mobile, reducedMotion }) {
  const animate = !reducedMotion
  const input = useRef({ px: 0, py: 0, explode: 0, page: 0, inside: false })

  useEffect(() => {
    const s = input.current
    const onPointer = (e) => {
      s.px = (e.clientX / window.innerWidth) * 2 - 1
      s.py = -((e.clientY / window.innerHeight) * 2 - 1)
      s.inside = true
    }
    const onLeave = () => {
      s.inside = false
    }
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      s.page = max > 0 ? Math.min(1, window.scrollY / max) : 0
      s.explode = Math.min(1, window.scrollY / (window.innerHeight * 0.8))
    }
    onScroll()
    if (!animate) return
    window.addEventListener('pointermove', onPointer, { passive: true })
    window.addEventListener('pointerdown', onPointer, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('pointermove', onPointer)
      window.removeEventListener('pointerdown', onPointer)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [animate])

  return (
    <Canvas
      dpr={[1, mobile ? 1.5 : 1.75]}
      frameloop={animate ? 'always' : 'demand'}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 1.3, 9], fov: mobile ? 52 : 40, near: 0.1, far: 120 }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0)
        stackStore.ready()
      }}
      style={{
        position: reducedMotion ? 'absolute' : 'fixed',
        inset: 0,
        width: '100%',
        height: reducedMotion ? '100svh' : '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    >
      <fog attach="fog" args={['#07080a', 10, 40]} />
      <Rig input={input} animate={animate} />
      <Terrain animate={animate} input={input} mobile={mobile} />
      <Motes count={mobile ? 250 : 600} animate={animate} />
      <Portrait input={input} animate={animate} mobile={mobile} style={portraitStyle} />
    </Canvas>
  )
}
