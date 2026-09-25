import { CanvasTexture, RepeatWrapping, SRGBColorSpace } from 'three'

const PALETTES = [
  ['#f4efe6', '#e63946', '#1d3557', '#f1c453', '#457b9d'],
  ['#fdf6ec', '#ff6b35', '#004e89', '#1a659e', '#efefd0'],
  ['#f7f3e9', '#2a9d8f', '#e9c46a', '#f4a261', '#264653'],
  ['#fff8f0', '#c8f135', '#111111', '#3dffc0', '#ff5d8f'],
  ['#f2e9e4', '#22223b', '#4a4e69', '#9a8c98', '#c9ada7'],
  ['#fefae0', '#bc6c25', '#283618', '#606c38', '#dda15e'],
]

// seeded PRNG so each project always gets the same painting
function rng(seed) {
  let h = 2166136261
  for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619)
  return () => {
    h += 0x6d2b79f5
    let t = h
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function texture(canvas) {
  const t = new CanvasTexture(canvas)
  t.colorSpace = SRGBColorSpace
  t.anisotropy = 8
  return t
}

export function artTexture(seed, i, palette = PALETTES[i % PALETTES.length]) {
  const c = document.createElement('canvas')
  c.width = 1024
  c.height = 720
  const g = c.getContext('2d')
  const r = rng(seed)
  const [bg, ...cols] = palette
  const pick = () => cols[Math.floor(r() * cols.length)]
  g.fillStyle = bg
  g.fillRect(0, 0, c.width, c.height)

  const style = i % 3
  if (style === 0) {
    // Bauhaus: overlapping circles and blocks
    for (let k = 0; k < 8; k++) {
      g.fillStyle = pick()
      if (r() < 0.5) {
        g.beginPath()
        g.arc(r() * 1024, r() * 720, 60 + r() * 220, 0, Math.PI * 2)
        g.fill()
      } else g.fillRect(r() * 900, r() * 600, 80 + r() * 320, 40 + r() * 260)
    }
  } else if (style === 1) {
    // nested rainbow arcs
    const cx = 200 + r() * 624
    for (let k = 12; k > 0; k--) {
      g.fillStyle = k === 1 ? bg : cols[k % cols.length]
      g.beginPath()
      g.arc(cx, 720, k * 62, Math.PI, 0)
      g.fill()
    }
    g.fillStyle = pick()
    g.beginPath()
    g.arc(r() * 1024, 90 + r() * 120, 50 + r() * 40, 0, Math.PI * 2)
    g.fill()
  } else {
    // Truchet tiles: quarter circles
    const s = 128
    for (let x = 0; x < 1024; x += s)
      for (let y = 0; y < 720; y += s) {
        g.save()
        g.beginPath()
        g.rect(x, y, s, s)
        g.clip()
        g.fillStyle = pick()
        g.fillRect(x, y, s, s)
        g.fillStyle = pick()
        const q = Math.floor(r() * 4)
        g.beginPath()
        g.arc(x + (q & 1) * s, y + (q >> 1) * s, s, 0, Math.PI * 2)
        g.fill()
        g.restore()
      }
  }
  return texture(c)
}

const loadImage = (src) =>
  new Promise((res, rej) => {
    const img = new Image()
    img.onload = () => res(img)
    img.onerror = rej
    img.src = src
  })

// Project screenshot(s); shows the generated art until they load. One roughly-canvas-shaped image is
// cover-cropped from the top-left (UI screenshots). Several images, or odd shapes like terminal
// strips, are stacked and fitted centered on the first image's corner colour (white if transparent).
// `fit` is the share of the canvas a fitted image may fill (logos use less for breathing room).
export function imageTexture(seed, i, src, fit = 0.94) {
  const t = artTexture(seed, i)
  Promise.all([].concat(src).map(loadImage))
    .then((imgs) => {
      const c = t.image
      c.width = 1600 // sharper UI text than the 1024px art canvas
      c.height = 1120
      const g = c.getContext('2d')
      const w = Math.max(...imgs.map((m) => m.width))
      const h = imgs.reduce((sum, m) => sum + m.height, 0)
      const cover = fit > 0.9 && imgs.length === 1 && Math.abs(w / h - c.width / c.height) < 0.25
      const s = cover ? Math.max(c.width / w, c.height / h) : Math.min(c.width / w, c.height / h) * fit

      g.drawImage(imgs[0], 0, 0, 1, 1, 0, 0, 1, 1)
      const [r, gr, b, a] = g.getImageData(0, 0, 1, 1).data
      g.fillStyle = a < 128 ? '#ffffff' : `rgb(${r},${gr},${b})`
      g.fillRect(0, 0, c.width, c.height)

      let y = cover ? 0 : (c.height - h * s) / 2
      for (const m of imgs) {
        g.drawImage(m, cover ? 0 : (c.width - m.width * s) / 2, y, m.width * s, m.height * s)
        y += m.height * s
      }
      t.dispose() // size changed: GPU texture must be reallocated
      t.needsUpdate = true
    })
    .catch(() => {}) // a missing screenshot just leaves the generated art
  return t
}

export function woodTexture(repeatX, repeatY) {
  const c = document.createElement('canvas')
  c.width = c.height = 512
  const g = c.getContext('2d')
  const r = rng('floor')
  const rowH = 64
  for (let y = 0; y < 512; y += rowH) {
    let x = -r() * 200
    while (x < 512) {
      const w = 180 + r() * 220
      const l = 58 + r() * 10
      g.fillStyle = `hsl(32, 38%, ${l}%)`
      g.fillRect(x, y, w, rowH)
      g.fillStyle = 'rgba(80,50,20,0.35)'
      g.fillRect(x, y, 2, rowH)
      x += w
    }
    g.fillStyle = 'rgba(80,50,20,0.4)'
    g.fillRect(0, y, 512, 2)
  }
  const t = texture(c)
  t.wrapS = t.wrapT = RepeatWrapping
  t.repeat.set(repeatX, repeatY)
  return t
}

export function glowTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 256
  const g = c.getContext('2d')
  const grad = g.createRadialGradient(128, 128, 0, 128, 128, 128)
  grad.addColorStop(0, 'rgba(255,248,230,0.9)')
  grad.addColorStop(1, 'rgba(255,248,230,0)')
  g.fillStyle = grad
  g.fillRect(0, 0, 256, 256)
  return texture(c)
}
