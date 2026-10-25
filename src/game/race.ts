/* Glow Race: a deterministic marble race.
   The whole race is simulated from a seed with a fixed timestep and only +, -, *, / and sqrt,
   so every device that knows the seed replays the identical race. The server (or, in this
   prototype, the wall clock) publishes a hash of the seed before picks close and reveals the
   seed at lock, which makes the race provably fair. */

export interface Ball { id: string; name: string; color: string; ring: string; label: string }
export const BALLS: Ball[] = [
  { id: 'serum', name: 'Serum', color: '#1d1a17', ring: '#c98a5e', label: 'S' },
  { id: 'cream', name: 'Cream', color: '#f3e7c9', ring: '#c9a55e', label: 'C' },
  { id: 'cleanser', name: 'Cleanser', color: '#4a423b', ring: '#d9d6d1', label: 'L' },
  { id: 'spf', name: 'SPF', color: '#b8734a', ring: '#f0d8a8', label: 'P' },
]

export const W = 100, H = 880, FINISH_Y = 830, R = 3
export interface Peg { x: number; y: number; r: number }
export interface Ramp { x1: number; y1: number; x2: number; y2: number }
export interface Course { pegs: Peg[]; ramps: Ramp[]; starts: number[] }
export interface Race { seed: number; course: Course; frames: Float32Array[]; order: string[]; finishFrame: number[]; totalFrames: number }

/* ---- seeded RNG (mulberry32) and a stable string hash ---- */
export function hash32(str: string) { let h = 1779033703 ^ str.length; for (let i = 0; i < str.length; i++) { h = Math.imul(h ^ str.charCodeAt(i), 3432918353); h = (h << 13) | (h >>> 19) } h = Math.imul(h ^ (h >>> 16), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); return (h ^= h >>> 16) >>> 0 }
export function rng(seed: number) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296 } }
export const seedHash = (seed: number) => hash32('glow-race-commit:' + seed).toString(16).padStart(8, '0') + hash32('salt:' + seed).toString(16).padStart(8, '0')

/* ---- course ---- */
export function buildCourse(seed: number): Course {
  const r = rng(seed ^ 0x9e3779b9)
  const pegs: Peg[] = []; const ramps: Ramp[] = []
  let y = 70; let row = 0
  while (y < FINISH_Y - 70) {
    if (row % 4 === 3) {
      // angled ramp from one wall toward the centre, alternating sides
      const left = (row >> 2) % 2 === 0
      const len = 44 + r() * 12; const drop = 18 + r() * 8
      ramps.push(left ? { x1: 0, y1: y, x2: len, y2: y + drop } : { x1: W, y1: y, x2: W - len, y2: y + drop })
      y += 42
    } else {
      const offset = row % 2 === 0 ? 0 : 6.25; const spacing = 12.5
      for (let x = offset + 6.25; x < W - 2; x += spacing) { if (r() < 0.2) continue; const px = x + (r() - 0.5) * 3; if (px < 10.5 || px > W - 10.5) continue; pegs.push({ x: px, y: y + (r() - 0.5) * 4, r: 1.8 + r() * 0.5 }) }
      y += 48
    }
    row++
  }
  // funnel near the finish
  ramps.push({ x1: 0, y1: FINISH_Y - 70, x2: 28, y2: FINISH_Y - 34 }, { x1: W, y1: FINISH_Y - 70, x2: 72, y2: FINISH_Y - 34 })
  // shuffle lanes so no marble has a structural advantage
  const lanes = [20, 40, 60, 80]; for (let i = lanes.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); const t = lanes[i]; lanes[i] = lanes[j]; lanes[j] = t }
  const starts = lanes.map(x => x + (r() - 0.5) * 2.4)
  return { pegs, ramps, starts }
}

/* ---- simulation ---- */
const DT = 1 / 120, G = 125, E_PEG = 0.48, E_WALL = 0.45, E_BALL = 0.6, DAMP = 0.9996, MAX_T = 32
export function simulate(seed: number): Race {
  const course = buildCourse(seed); const r = rng(seed ^ 0x51f15e)
  const n = BALLS.length
  const x = new Float64Array(n), y = new Float64Array(n), vx = new Float64Array(n), vy = new Float64Array(n)
  const done: number[] = new Array(n).fill(-1); const stuck = new Float64Array(n)
  for (let i = 0; i < n; i++) { x[i] = course.starts[i]; y[i] = 8; vx[i] = (r() - 0.5) * 6; vy[i] = r() * 4 }
  const frames: Float32Array[] = []; const order: string[] = []
  const steps = Math.floor(MAX_T / DT)
  for (let s = 0; s < steps; s++) {
    for (let i = 0; i < n; i++) {
      if (done[i] >= 0) continue
      vy[i] += G * DT; vx[i] *= DAMP; vy[i] *= DAMP
      x[i] += vx[i] * DT; y[i] += vy[i] * DT
      // walls
      if (x[i] < R) { x[i] = R; vx[i] = -vx[i] * E_WALL } else if (x[i] > W - R) { x[i] = W - R; vx[i] = -vx[i] * E_WALL }
      // pegs
      for (const p of course.pegs) {
        if (p.y < y[i] - 12 || p.y > y[i] + 12) continue
        const dx = x[i] - p.x, dy = y[i] - p.y; const d2 = dx * dx + dy * dy; const rr = R + p.r
        if (d2 < rr * rr && d2 > 0) { const d = Math.sqrt(d2); const nx = dx / d, ny = dy / d; x[i] = p.x + nx * rr; y[i] = p.y + ny * rr; const vn = vx[i] * nx + vy[i] * ny; if (vn < 0) { vx[i] -= (1 + E_PEG) * vn * nx; vy[i] -= (1 + E_PEG) * vn * ny; vx[i] *= 0.985; vy[i] *= 0.985 } }
      }
      // ramps (segments)
      for (const q of course.ramps) {
        if (y[i] < Math.min(q.y1, q.y2) - 8 || y[i] > Math.max(q.y1, q.y2) + 8) continue
        const ex = q.x2 - q.x1, ey = q.y2 - q.y1; const l2 = ex * ex + ey * ey
        let t = ((x[i] - q.x1) * ex + (y[i] - q.y1) * ey) / l2; t = t < 0 ? 0 : t > 1 ? 1 : t
        const cx = q.x1 + ex * t, cy = q.y1 + ey * t; const dx = x[i] - cx, dy = y[i] - cy; const d2 = dx * dx + dy * dy
        if (d2 < R * R && d2 > 0) { const d = Math.sqrt(d2); const nx = dx / d, ny = dy / d; x[i] = cx + nx * R; y[i] = cy + ny * R; const vn = vx[i] * nx + vy[i] * ny; if (vn < 0) { vx[i] -= (1 + 0.3) * vn * nx; vy[i] -= (1 + 0.3) * vn * ny; vx[i] *= 0.995; vy[i] *= 0.995 } }
      }
      // anti-stall: a tiny deterministic nudge if a ball rests for too long
      const sp = vx[i] * vx[i] + vy[i] * vy[i]
      if (sp < 4) { stuck[i] += DT; if (stuck[i] > 0.45) { const inward = x[i] < W / 2 ? 1 : -1; vx[i] += inward * (12 + r() * 18); vy[i] -= 8 + r() * 8; stuck[i] = 0 } } else stuck[i] = 0
      if (y[i] >= FINISH_Y) { done[i] = s; order.push(BALLS[i].id) }
    }
    // ball-ball collisions
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
      if (done[i] >= 0 || done[j] >= 0) continue
      const dx = x[j] - x[i], dy = y[j] - y[i]; const d2 = dx * dx + dy * dy; const rr = R * 2
      if (d2 < rr * rr && d2 > 0) { const d = Math.sqrt(d2); const nx = dx / d, ny = dy / d; const overlap = (rr - d) / 2; x[i] -= nx * overlap; y[i] -= ny * overlap; x[j] += nx * overlap; y[j] += ny * overlap; const rvx = vx[j] - vx[i], rvy = vy[j] - vy[i]; const vn = rvx * nx + rvy * ny; if (vn < 0) { const imp = -(1 + E_BALL) * vn / 2; vx[i] -= imp * nx; vy[i] -= imp * ny; vx[j] += imp * nx; vy[j] += imp * ny } }
    }
    if (s % 2 === 0) { const f = new Float32Array(n * 2); for (let i = 0; i < n; i++) { f[i * 2] = x[i]; f[i * 2 + 1] = done[i] >= 0 ? FINISH_Y + 14 : y[i] } frames.push(f) }
    if (order.length === n) break
  }
  // rank any ball that never finished by how far it got
  if (order.length < n) { const rest = BALLS.map((b, i) => ({ b, i })).filter(({ b }) => !order.includes(b.id)).sort((a, b) => y[b.i] - y[a.i]); rest.forEach(({ b }) => order.push(b.id)) }
  return { seed, course, frames, order, finishFrame: done.map(d => (d < 0 ? frames.length - 1 : Math.floor(d / 2))), totalFrames: frames.length }
}

/* ---- round schedule (prototype: derived from the wall clock so every device agrees) ---- */
export const ROUND_MS = 90000, OPEN_MS = 40000, LOCK_MS = 5000, RACE_MS = 30000
export type Phase = 'open' | 'lock' | 'race' | 'result'
export function roundInfo(now = Date.now()) {
  const index = Math.floor(now / ROUND_MS); const start = index * ROUND_MS; const t = now - start
  const phase: Phase = t < OPEN_MS ? 'open' : t < OPEN_MS + LOCK_MS ? 'lock' : t < OPEN_MS + LOCK_MS + RACE_MS ? 'race' : 'result'
  const phaseEnd = phase === 'open' ? start + OPEN_MS : phase === 'lock' ? start + OPEN_MS + LOCK_MS : phase === 'race' ? start + OPEN_MS + LOCK_MS + RACE_MS : start + ROUND_MS
  const seed = hash32('glow-race-v1:' + index)
  return { index, id: 'R' + index.toString(36).toUpperCase(), start, t, phase, phaseEnd, raceStart: start + OPEN_MS + LOCK_MS, seed, commit: seedHash(seed) }
}
/* Crowd flavour for the prototype, seeded so it is the same on every device */
export function crowd(index: number) { const r = rng(hash32('crowd:' + index)); const w = [r(), r(), r(), r()]; const s = w.reduce((a, b) => a + b, 0); return { watching: 600 + Math.floor(r() * 1900), shares: w.map(x => Math.round((x / s) * 100)) } }
