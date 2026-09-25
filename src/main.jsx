import { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import { PointerLockControls } from '@react-three/drei'
import { Player, Scene, exhibits } from './Gallery'
import './style.css'

const touch = matchMedia('(pointer: coarse)').matches

function App() {
  const plc = useRef()
  const [entered, setEntered] = useState(false)
  const [near, setNear] = useState(-1)
  const [target, setTarget] = useState(null)
  const ex = exhibits[near]

  const open = () => ex?.url && window.open(ex.url, '_blank', 'noopener')

  useEffect(() => {
    const onKey = (e) => e.code === 'KeyE' && open()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const enter = () => {
    if (touch) {
      setEntered(true)
      setTarget(0)
    } else plc.current?.lock()
  }
  const step = (d) => setTarget((t) => Math.max(0, Math.min(exhibits.length - 1, (t ?? near) + d)))

  return (
    <>
      <Canvas camera={{ position: [0, 1.7, 1], rotation: [0, 0, 0], fov: 70 }} dpr={[1, 2]}>
        <Scene near={near} />
        <Player target={target} setTarget={setTarget} near={near} setNear={setNear} compact={touch} />
        {!touch && <PointerLockControls ref={plc} onLock={() => setEntered(true)} onUnlock={() => setEntered(false)} />}
      </Canvas>

      <a className="corner" href="/classic.html">Classic view →</a>

      <div className="intro" hidden={entered}>
        <img className="headshot" src="/headshot.jpg" alt="Hein Khant Zaw" width="96" height="96" />
        <div className="tag">Available for co-op · Winter 2027</div>
        <h1>Hein Khant <span>Zaw</span></h1>
        <p>Computer Science student at Toronto Metropolitan University. Walk the gallery to see my projects and experience.</p>
        <button className="btn btn-primary" onClick={enter}>{touch ? 'Start tour' : 'Click to enter'}</button>
        <p className="hint">
          {touch ? 'Drag to look · ◀ ▶ to move between exhibits' : 'WASD / arrows to walk · mouse to look · E to open · Esc to exit'}
        </p>
        <a href="/classic.html">Prefer a normal page? Classic view</a>
      </div>

      {entered && !touch && <div className="crosshair" />}

      {entered && touch && (
        <div className="card" aria-live="polite">
          {ex && (
            <>
              <div className="card-tag">{ex.tag}</div>
              <h2>{ex.title}</h2>
              <p>{ex.desc}</p>
              <div className="card-sub">{ex.sub}</div>
            </>
          )}
          <div className="tour">
            <button className="btn btn-outline" onClick={() => step(-1)} aria-label="Previous exhibit">◀</button>
            {ex?.url && <button className="btn btn-primary" onClick={open}>Open ↗</button>}
            <button className="btn btn-outline" onClick={() => step(1)} aria-label="Next exhibit">▶</button>
          </div>
        </div>
      )}
    </>
  )
}

createRoot(document.getElementById('root')).render(<App />)
