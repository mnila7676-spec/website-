import { BALLS, W, H, FINISH_Y, R, type Race } from './race'

export interface RenderState { camY: number; trails: number[][][] }
export const newRenderState = (): RenderState => ({ camY: 0, trails: BALLS.map(() => []) })

/* Draws one frame of the race onto a canvas. Camera follows the leading pack. */
export function drawRace(ctx: CanvasRenderingContext2D, race: Race, frameIdx: number, st: RenderState, cssW: number, cssH: number, dpr: number) {
  const f = race.frames[Math.max(0, Math.min(race.frames.length - 1, frameIdx))]
  const scale = cssW / W; const viewH = cssH / scale
  // camera: track the furthest ball still visible on course, keep ahead room
  let lead = 0; for (let i = 0; i < BALLS.length; i++) lead = Math.max(lead, Math.min(f[i * 2 + 1], FINISH_Y))
  const target = Math.max(0, Math.min(H - viewH, lead - viewH * 0.42))
  st.camY += (target - st.camY) * 0.12
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, cssW, cssH)
  // background
  const bg = ctx.createLinearGradient(0, 0, 0, cssH); bg.addColorStop(0, '#fbf8f3'); bg.addColorStop(1, '#efe6da'); ctx.fillStyle = bg; ctx.fillRect(0, 0, cssW, cssH)
  ctx.save(); ctx.scale(scale, scale); ctx.translate(0, -st.camY)
  // lane shading
  ctx.fillStyle = 'rgba(184,115,74,0.05)'; for (let x = 0; x < W; x += 25) if ((x / 25) % 2 === 0) ctx.fillRect(x, st.camY, 25, viewH)
  // ramps
  for (const q of race.course.ramps) { if (Math.max(q.y1, q.y2) < st.camY - 10 || Math.min(q.y1, q.y2) > st.camY + viewH + 10) continue; ctx.lineCap = 'round'; ctx.lineWidth = 3.2; ctx.strokeStyle = '#2e2925'; ctx.beginPath(); ctx.moveTo(q.x1, q.y1); ctx.lineTo(q.x2, q.y2); ctx.stroke(); ctx.lineWidth = 1; ctx.strokeStyle = '#c98a5e'; ctx.beginPath(); ctx.moveTo(q.x1, q.y1 - 1.1); ctx.lineTo(q.x2, q.y2 - 1.1); ctx.stroke() }
  // pegs
  for (const p of race.course.pegs) { if (p.y < st.camY - 6 || p.y > st.camY + viewH + 6) continue; const g = ctx.createRadialGradient(p.x - p.r * 0.4, p.y - p.r * 0.4, 0.2, p.x, p.y, p.r); g.addColorStop(0, '#e6b48c'); g.addColorStop(1, '#8f5330'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill() }
  // finish line
  if (FINISH_Y > st.camY - 10 && FINISH_Y < st.camY + viewH + 10) { for (let x = 0; x < W; x += 5) { ctx.fillStyle = (x / 5) % 2 === 0 ? '#1d1a17' : '#fbf8f3'; ctx.fillRect(x, FINISH_Y, 5, 2.4) } ctx.fillStyle = '#6b1f3f'; ctx.font = '600 4px Inter, sans-serif'; ctx.textAlign = 'center'; ctx.fillText('FINISH', W / 2, FINISH_Y + 7) }
  // trails + balls
  for (let i = 0; i < BALLS.length; i++) {
    const b = BALLS[i]; const x = f[i * 2], y = f[i * 2 + 1]
    const tr = st.trails[i]; if (y <= FINISH_Y) { tr.push([x, y]); if (tr.length > 10) tr.shift() } else if (tr.length) tr.shift()
    for (let k = 0; k < tr.length - 1; k++) { ctx.globalAlpha = (k / tr.length) * 0.35; ctx.fillStyle = b.ring; ctx.beginPath(); ctx.arc(tr[k][0], tr[k][1], R * (0.4 + k / tr.length * 0.5), 0, Math.PI * 2); ctx.fill() }
    ctx.globalAlpha = 1
    if (y > FINISH_Y + 10) continue
    ctx.fillStyle = 'rgba(29,26,23,0.18)'; ctx.beginPath(); ctx.ellipse(x + 0.6, y + R * 0.9, R * 1.05, R * 0.55, 0, 0, Math.PI * 2); ctx.fill()
    const g = ctx.createRadialGradient(x - R * 0.45, y - R * 0.5, 0.3, x, y, R); g.addColorStop(0, lighten(b.color)); g.addColorStop(1, b.color); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, R, 0, Math.PI * 2); ctx.fill()
    ctx.lineWidth = 0.7; ctx.strokeStyle = b.ring; ctx.stroke()
    ctx.fillStyle = b.color === '#f3e7c9' ? '#6b4f14' : b.ring; ctx.font = '700 3px Inter, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(b.label, x, y + 0.2)
  }
  ctx.restore()
  // walls
  ctx.fillStyle = '#1d1a17'; ctx.fillRect(0, 0, 2, cssH); ctx.fillRect(cssW - 2, 0, 2, cssH)
}
function lighten(hex: string) { const n = parseInt(hex.slice(1), 16); const r = Math.min(255, (n >> 16) + 70), g = Math.min(255, ((n >> 8) & 255) + 60), b = Math.min(255, (n & 255) + 50); return `rgb(${r},${g},${b})` }
