import { Suspense, useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Text as DreiText } from '@react-three/drei'
import { BackSide, Euler, Matrix4, Quaternion, Vector3 } from 'three'
import { artTexture, glowTexture, imageTexture, woodTexture } from './art'
import { contact, experience, projects, skills } from './data'

const ACCENT = '#c8f135'
const INK = '#141414'
const GREEN = '#4d7c0f' // readable accent on white
const WALL = '#ece8e1'
const W = 9 // hall width
const H = 4.2 // hall height
const EYE = 1.7
const SPACING = 5
const SPEED = 4
const START_Z = 3
const MONO = '/fonts/dm-mono.ttf'
const SYNE = '/fonts/syne.ttf'
const Text = (props) => <DreiText font={MONO} {...props} />

const items = [
  ...projects.map((p, i) => ({
    tag: `${String(i + 1).padStart(2, '0')} / Project`,
    title: p.title,
    desc: p.desc,
    sub: p.stack.join('  ·  '),
    url: p.url,
    image: p.image,
  })),
  ...experience.map((e) => ({ tag: `${e.date} / Experience`, title: e.role, desc: e.desc, sub: e.company })),
]

const rows = Math.ceil(items.length / 2)
const END_Z = -(3 + (rows - 1) * SPACING + 5)
const LEN = START_Z - END_Z
const CZ = (START_Z + END_Z) / 2

// Pairs of paintings face each other across the hall; contact sits on the end wall.
export const exhibits = [
  ...items.map((it, i) => {
    const side = i % 2 ? 1 : -1
    const z = -3 - Math.floor(i / 2) * SPACING
    return { ...it, art: i, pos: [side * (W / 2 - 0.02), EYE + 0.1, z], rotY: (-side * Math.PI) / 2 }
  }),
  {
    tag: 'Say hello / Contact',
    title: 'Get In Touch',
    desc: "I'm currently open to co-op and internship opportunities. Whether you have a question or just want to connect — my inbox is always open.",
    sub: `${contact.email}  ·  linkedin.com/in/heinkhantzaw  ·  github.com/heinkhantzaw567`,
    url: `mailto:${contact.email}`,
    art: 3,
    pos: [0, EYE + 0.1, END_Z + 0.02],
    rotY: 0,
  },
].map((ex) => {
  const at = new Vector3(...ex.pos)
  const tangent = new Vector3(Math.cos(ex.rotY), 0, -Math.sin(ex.rotY))
  return {
    ...ex,
    at,
    normal: new Vector3(Math.sin(ex.rotY), 0, Math.cos(ex.rotY)),
    artAt: at.clone().addScaledVector(tangent, -0.95), // painting only
    midAt: at.clone().addScaledVector(tangent, -0.14), // painting + placard
  }
})

// skill sculptures stand against the walls in the gaps between paintings
const SHAPES = ['torusKnot', 'icosahedron', 'torus', 'octahedron', 'dodecahedron', 'cone']
const COLORS = ['#e63946', '#2a9d8f', '#f1c453', '#457b9d', '#ff6b35', ACCENT]
const pedestals = skills.map(([label, list], i) => {
  const side = i % 2 ? 1 : -1
  return { label, list, i, x: side * (W / 2 - 1), z: -3 - (i + 0.5) * SPACING, rotY: (-side * Math.PI) / 2 }
})

const GLOW = glowTexture()

function Painting({ ex, active }) {
  const art = useMemo(() => (ex.image ? imageTexture : artTexture)(ex.title, ex.art, ex.image), [ex])
  const px = 1.12 // placard offset
  return (
    <group position={ex.pos} rotation={[0, ex.rotY, 0]}>
      {/* fake spotlight pool + track light */}
      <mesh position={[-0.95, 0.1, 0.004]}>
        <planeGeometry args={[3.6, 3.2]} />
        <meshBasicMaterial map={GLOW} transparent opacity={active ? 0.9 : 0.55} depthWrite={false} />
      </mesh>
      <group position={[-0.95, H - EYE - 0.25, 1.0]}>
        <mesh position={[0, 0.12, 0]}>
          <cylinderGeometry args={[0.01, 0.01, 0.25]} />
          <meshStandardMaterial color="#222" />
        </mesh>
        <mesh rotation={[0.6, 0, 0]}>
          <cylinderGeometry args={[0.07, 0.05, 0.2, 16]} />
          <meshStandardMaterial color="#1b1b1b" metalness={0.6} roughness={0.4} />
        </mesh>
      </group>

      {/* frame, mat, canvas */}
      <mesh position={[-0.95, 0, 0.03]}>
        <boxGeometry args={[2.2, 1.6, 0.06]} />
        <meshStandardMaterial color="#1c1a17" roughness={0.5} />
      </mesh>
      <mesh position={[-0.95, 0, 0.061]}>
        <planeGeometry args={[2.06, 1.46]} />
        <meshStandardMaterial color="#faf8f3" />
      </mesh>
      <mesh position={[-0.95, 0, 0.062]}>
        <planeGeometry args={[1.8, 1.26]} />
        <meshBasicMaterial map={art} />
      </mesh>

      {/* museum placard */}
      <group position={[px, -0.05, 0]}>
        <mesh position={[0, 0, 0.015]}>
          <boxGeometry args={[1.3, 1.7, 0.03]} />
          <meshBasicMaterial color="#f4f2ec" />
        </mesh>
        <mesh position={[-0.665, 0, 0.02]}>
          <boxGeometry args={[0.03, 1.7, 0.04]} />
          <meshBasicMaterial color={active ? ACCENT : '#cfcac1'} />
        </mesh>
        <Suspense fallback={null}>
          <Text position={[-0.56, 0.75, 0.032]} anchorX="left" anchorY="top" fontSize={0.045} color="#8a8a8a" letterSpacing={0.06}>
            {ex.tag.toUpperCase()}
          </Text>
          <Text position={[-0.56, 0.66, 0.032]} anchorX="left" anchorY="top" fontSize={ex.title.length > 18 ? 0.08 : 0.1} maxWidth={1.12} color={INK} font={SYNE}>
            {ex.title}
          </Text>
          <Text position={[-0.56, 0.3, 0.032]} anchorX="left" anchorY="top" fontSize={0.05} maxWidth={1.12} lineHeight={1.5} color="#3a3a3a">
            {ex.desc}
          </Text>
          <Text position={[-0.56, -0.74, 0.032]} anchorX="left" anchorY="bottom" fontSize={0.042} maxWidth={1.12} lineHeight={1.45} color={GREEN}>
            {ex.sub}
          </Text>
          {ex.url && active && (
            <Text position={[0.56, 0.75, 0.032]} anchorX="right" anchorY="top" fontSize={0.045} color={GREEN}>
              [E] OPEN
            </Text>
          )}
        </Suspense>
      </group>
    </group>
  )
}

function Sculpture({ p }) {
  const ref = useRef()
  useFrame(({ clock }) => {
    const t = clock.elapsedTime + p.i
    ref.current.rotation.set(t * 0.3, t * 0.6, 0)
    ref.current.position.y = 1.55 + Math.sin(t * 1.3) * 0.07
  })
  const Shape = `${SHAPES[p.i % SHAPES.length]}Geometry`
  const args = { torusKnot: [0.2, 0.065, 128, 16], icosahedron: [0.28], torus: [0.22, 0.08, 24, 64], octahedron: [0.3], dodecahedron: [0.28], cone: [0.24, 0.45, 32] }[SHAPES[p.i % SHAPES.length]]
  return (
    <group position={[p.x, 0, p.z]} rotation={[0, p.rotY, 0]}>
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[0.7, 1, 0.7]} />
        <meshStandardMaterial color="#f7f5f0" />
      </mesh>
      <mesh ref={ref}>
        <Shape args={args} />
        <meshStandardMaterial color={COLORS[p.i % COLORS.length]} metalness={0.35} roughness={0.25} />
      </mesh>
      <mesh position={[0, 1.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.25, 32]} />
        <meshBasicMaterial map={GLOW} transparent opacity={0.8} depthWrite={false} />
      </mesh>
      <Suspense fallback={null}>
        <Text position={[0, 0.86, 0.352]} fontSize={0.06} color={INK} font={SYNE} anchorY="top">
          {p.label}
        </Text>
        <Text position={[0, 0.76, 0.352]} fontSize={0.036} maxWidth={0.6} lineHeight={1.5} textAlign="center" color="#555" anchorY="top">
          {p.list}
        </Text>
      </Suspense>
    </group>
  )
}

function Hall() {
  const floor = useMemo(() => woodTexture(W / 2, LEN / 2), [])
  const lights = Array.from({ length: Math.ceil(LEN / 10) }, (_, i) => START_Z - 5 - i * 10)
  return (
    <>
      <mesh position={[0, H / 2, CZ]}>
        <boxGeometry args={[W, H, LEN]} />
        <meshStandardMaterial color={WALL} side={BackSide} />
      </mesh>
      <mesh position={[0, 0.01, CZ]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[W, LEN]} />
        <meshStandardMaterial map={floor} roughness={0.55} />
      </mesh>
      <mesh position={[0, H - 0.005, CZ]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[W, LEN]} />
        <meshBasicMaterial color="#dcd8d0" />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * (W / 2 - 0.01), 0.07, CZ]}>
          <boxGeometry args={[0.02, 0.14, LEN]} />
          <meshStandardMaterial color="#2b2926" />
        </mesh>
      ))}
      {[-1.4, 1.4].map((x) => (
        <mesh key={x} position={[x, H - 0.01, CZ]}>
          <boxGeometry args={[0.12, 0.03, LEN - 1]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      ))}
      {lights.map((z) => (
        <pointLight key={z} position={[0, H - 0.5, z]} intensity={0.7} distance={14} decay={0} />
      ))}
    </>
  )
}

function BackWall() {
  return (
    <group position={[0, 0, START_Z - 0.02]} rotation={[0, Math.PI, 0]}>
      <Text position={[0, 3.1, 0]} fontSize={0.1} color={GREEN} letterSpacing={0.14}>
        AVAILABLE FOR CO-OP · WINTER 2027
      </Text>
      <Text position={[0, 2.65, 0]} fontSize={0.5} color={INK} letterSpacing={-0.02} font={SYNE}>
        HEIN KHANT ZAW
      </Text>
      <Text position={[0, 2.2, 0]} fontSize={0.09} color="#555">
        Full-stack developer · CS @ Toronto Metropolitan University
      </Text>
      <Text position={[0, 1.95, 0]} fontSize={0.07} color="#8a8a8a">
        Turn around and walk the gallery
      </Text>
    </group>
  )
}

function useKeys() {
  const keys = useRef({})
  useEffect(() => {
    const down = (e) => (keys.current[e.code] = true)
    const up = (e) => (keys.current[e.code] = false)
    const clear = () => (keys.current = {})
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    window.addEventListener('blur', clear)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
      window.removeEventListener('blur', clear)
    }
  }, [])
  return keys
}

const fwd = new Vector3()
const right = new Vector3()
const rel = new Vector3()
const view = new Vector3()
const look = new Quaternion()
const lookM = new Matrix4()
const UP = new Vector3(0, 1, 0)
const euler = new Euler(0, 0, 0, 'YXZ')

export function Player({ target, setTarget, near, setNear, compact }) {
  const { camera, gl } = useThree()
  const keys = useKeys()
  const bob = useRef(0)

  // drag-to-look (touch + unlocked mouse); pointer-lock mouse look comes from PointerLockControls
  useEffect(() => {
    const el = gl.domElement
    let last = null
    const down = (e) => (last = [e.clientX, e.clientY])
    const up = () => (last = null)
    const move = (e) => {
      if (!last || document.pointerLockElement) return
      euler.setFromQuaternion(camera.quaternion)
      euler.y += (e.clientX - last[0]) * 0.005
      euler.x = Math.max(-1.2, Math.min(1.2, euler.x + (e.clientY - last[1]) * 0.005))
      camera.quaternion.setFromEuler(euler)
      last = [e.clientX, e.clientY]
      setTarget(null)
    }
    el.addEventListener('pointerdown', down)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointermove', move)
    return () => {
      el.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointermove', move)
    }
  }, [camera, gl, setTarget])

  useFrame((_, dt) => {
    const k = keys.current
    const f = (k.KeyW || k.ArrowUp ? 1 : 0) - (k.KeyS || k.ArrowDown ? 1 : 0)
    const s = (k.KeyD || k.ArrowRight ? 1 : 0) - (k.KeyA || k.ArrowLeft ? 1 : 0)
    const p = camera.position

    if (f || s) {
      if (target !== null) setTarget(null)
      camera.getWorldDirection(fwd)
      fwd.y = 0
      fwd.normalize()
      right.crossVectors(fwd, camera.up)
      p.addScaledVector(fwd, f * SPEED * dt).addScaledVector(right, s * SPEED * dt)
      bob.current += dt * 9
      // walk around pedestals
      for (const ped of pedestals) {
        const dx = p.x - ped.x
        const dz = p.z - ped.z
        const d = Math.hypot(dx, dz)
        if (d < 0.8) (p.x = ped.x + (dx / d) * 0.8), (p.z = ped.z + (dz / d) * 0.8)
      }
    } else {
      bob.current = 0
      if (target !== null) {
        // stand back far enough that the exhibit fits the screen width. Compact (touch) frames only the
        // portrait painting and aims low so it sits above the HTML info card; otherwise painting + placard.
        const ex = exhibits[target]
        const tight = compact && camera.aspect < 1
        const focus = tight ? ex.artAt : ex.midAt
        const halfH = Math.atan(Math.tan((camera.fov * Math.PI) / 360) * camera.aspect)
        const d = Math.min(8, Math.max(2.8, (tight ? 1.3 : 2.1) / Math.tan(halfH)))
        view.copy(focus).addScaledVector(ex.normal, d).setY(EYE)
        rel.copy(focus).setY(focus.y - (tight ? 1.1 : 0.35))
        look.setFromRotationMatrix(lookM.lookAt(view, rel, UP))
        const t = 1 - Math.exp(-4 * dt)
        p.lerp(view, t)
        camera.quaternion.slerp(look, t)
      }
    }

    p.x = Math.max(-W / 2 + 0.6, Math.min(W / 2 - 0.6, p.x))
    p.z = Math.max(END_Z + 0.8, Math.min(START_Z - 0.8, p.z))
    p.y = EYE + Math.sin(bob.current) * 0.03

    // active exhibit = the one in front of you that you're most directly looking at
    camera.getWorldDirection(fwd)
    let best = -1
    let bestScore = 0.6
    exhibits.forEach((ex, i) => {
      rel.subVectors(ex.at, p)
      const along = -rel.dot(ex.normal)
      if (along < 0.5 || along > 8.5 || rel.lengthSq() - along * along > 4) return
      const score = rel.normalize().dot(fwd)
      if (score > bestScore) (best = i), (bestScore = score)
    })
    if (best !== near) setNear(best)
  })

  return null
}

export function Scene({ near }) {
  return (
    <>
      <color attach="background" args={[WALL]} />
      <fog attach="fog" args={[WALL, 18, 60]} />
      <ambientLight intensity={0.55} />
      <hemisphereLight args={['#fffaf0', '#b89a74', 0.6]} />
      <Hall />
      <Suspense fallback={null}>
        <BackWall />
      </Suspense>
      {exhibits.map((ex, i) => (
        <Painting key={i} ex={ex} active={i === near} />
      ))}
      {pedestals.map((p) => (
        <Sculpture key={p.label} p={p} />
      ))}
    </>
  )
}
