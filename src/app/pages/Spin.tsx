import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Icon } from '@/components/Icon'
import { useStore } from '@/store/store'
import { SPIN_PRIZES, SPIN_RULES } from '@/data/club'
import { n } from '@/lib/format'

const SEG = 360 / SPIN_PRIZES.length
const R = 140, C = 150
const pt = (deg: number, r = R) => { const a = (deg - 90) * Math.PI / 180; return [C + r * Math.cos(a), C + r * Math.sin(a)] }
const seg = (i: number) => { const a0 = i * SEG - SEG / 2, a1 = i * SEG + SEG / 2; const [x0, y0] = pt(a0); const [x1, y1] = pt(a1); return `M${C},${C} L${x0.toFixed(2)},${y0.toFixed(2)} A${R},${R} 0 0 1 ${x1.toFixed(2)},${y1.toFixed(2)} Z` }

export function Sparkles({ count = 14 }: { count?: number }) {
  return <span className="sparkles" aria-hidden="true">{Array.from({ length: count }).map((_, i) => <i key={i} style={{ ['--a' as any]: `${(360 / count) * i}deg`, ['--d' as any]: `${0.05 * (i % 4)}s` }} />)}</span>
}

export function useCountdown() {
  const [now, setNow] = useState(Date.now())
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 30000); return () => clearInterval(t) }, [])
  const mid = new Date(); mid.setHours(24, 0, 0, 0); const ms = mid.getTime() - now
  return `${Math.floor(ms / 3600000)}h ${Math.floor((ms % 3600000) / 60000)}m`
}

export function SpinCard() {
  const { state, d } = useStore(); const left = useCountdown()
  if (!state.member) return null
  const prize = d.spunToday ? SPIN_PRIZES.find(p => p.id === state.spins[new Date().toISOString().slice(0, 10)]) : null
  return <Link to="/app/spin" className={`spin-card ${d.spunToday ? 'done' : ''}`}>
    <span className="spin-mini"><svg viewBox="0 0 300 300">{SPIN_PRIZES.map((p, i) => <path key={p.id} d={seg(i)} fill={i % 2 ? '#f2e2d3' : '#fbf8f3'} stroke="#e7dfd4" />)}<circle cx={C} cy={C} r={26} fill="#b8734a" /></svg><Icon name="sparkle" className="icon-sm" /></span>
    <span style={{ flex: 1 }}><b>Glow Spin</b><small className="muted">{d.spunToday ? `Today: ${prize?.label} ${prize?.sub} · next spin in ${left}` : 'Your daily spin is ready · small rewards, fair odds'}</small></span>
    <span className={`btn btn-sm ${d.spunToday ? 'btn-light' : 'btn-burgundy'}`}>{d.spunToday ? 'View' : 'Spin'}</span>
  </Link>
}

export function AppSpin() {
  const { state, d, actions } = useStore(); const nav = useNavigate(); const left = useCountdown()
  const [rot, setRot] = useState(0); const [spinning, setSpinning] = useState(false); const [pending, setPending] = useState<string | null>(null); const [result, setResult] = useState<string | null>(null)
  const todayPrize = state.spins[new Date().toISOString().slice(0, 10)]
  const shown = result ?? todayPrize; const prize = shown ? SPIN_PRIZES.find(p => p.id === shown) : null
  const total = useMemo(() => SPIN_PRIZES.reduce((t, p) => t + p.weight, 0), [])
  const go = () => {
    if (spinning || todayPrize || !state.member) return
    const id = actions.spin(); if (!id) return
    const i = SPIN_PRIZES.findIndex(p => p.id === id)
    const target = (360 - i * SEG) % 360; const cur = ((rot % 360) + 360) % 360
    const jitter = (Math.random() - 0.5) * (SEG * 0.6)
    setPending(id); setSpinning(true); setRot(rot + 5 * 360 + ((target - cur + 360) % 360) + jitter)
  }
  const done = () => { if (!pending) return; actions.applySpin(pending); setResult(pending); setSpinning(false); setPending(null) }
  useEffect(() => { if (!pending) return; const t = setTimeout(done, 5200); return () => clearTimeout(t) }, [pending])
  const canSpin = !!state.member && !todayPrize && !spinning
  return <div className="screen">
    <div className="screen-head"><button className="icon-btn" onClick={() => nav(-1)}><Icon name="chevron-left" /></button><h1 style={{ fontSize: 26 }}>Glow Spin</h1><span className="pill pill-outline"><Icon name="flame" className="icon-sm copper" /> {d.spinStreak} day{d.spinStreak === 1 ? '' : 's'}</span></div>
    <p className="small muted text-center" style={{ marginBottom: 12 }}>{state.member ? (todayPrize ? `Next spin in ${left}` : d.checkedInToday ? 'One spin a day. Small rewards, shown odds.' : 'Check in first, then spin.') : 'Join Glow Club to spin daily.'}</p>
    <div className="wheel-wrap">
      <span className="wheel-pointer" />
      <div className={`wheel ${spinning ? 'spinning' : ''}`} style={{ transform: `rotate(${rot}deg)` }} onTransitionEnd={done}>
        <svg viewBox="0 0 300 300">
          <defs><radialGradient id="hub" cx="40%" cy="35%"><stop offset="0" stopColor="#d59a6f" /><stop offset="1" stopColor="#8f5330" /></radialGradient></defs>
          <circle cx={C} cy={C} r={R + 6} fill="#1d1a17" />
          <circle cx={C} cy={C} r={R + 3} fill="none" stroke="#c98a5e" strokeWidth="1.5" />
          {SPIN_PRIZES.map((p, i) => <path key={p.id} d={seg(i)} fill={p.rare ? '#6b1f3f' : i % 2 ? '#f2e2d3' : '#fbf8f3'} stroke="#d9cfc2" strokeWidth="1" />)}
          {SPIN_PRIZES.map((p, i) => <g key={p.id + 'l'} transform={`rotate(${i * SEG} ${C} ${C})`}><text x={C} y={48} textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontSize={p.kind === 'points' ? 30 : 20} fontWeight="600" fill={p.rare ? '#f0d8a8' : '#1d1a17'}>{p.label}</text><text x={C} y={66} textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="9" letterSpacing="1" fill={p.rare ? '#f0d8a8' : '#7d7168'}>{p.short}</text></g>)}
          {SPIN_PRIZES.map((_, i) => { const [x, y] = pt(i * SEG + SEG / 2, R); return <circle key={i} cx={x} cy={y} r={3} fill="#c98a5e" /> })}
          <circle cx={C} cy={C} r={34} fill="url(#hub)" stroke="#f0d8a8" strokeWidth="2" />
          <text x={C} y={C + 8} textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontSize="30" fontWeight="600" fill="#fff">L</text>
        </svg>
      </div>
    </div>
    {prize && !spinning ? <div className={`spin-result ${prize.rare ? 'rare' : ''}`}><Sparkles /><span className="ring"><Icon name={prize.icon} className="icon-lg" /></span><small>{result ? 'You won' : 'Today you won'}</small><b>{prize.kind === 'points' ? `${prize.label} Glow Points` : prize.sub}</b><p className="tiny">{prize.kind === 'points' ? 'Added to your wallet.' : prize.kind === 'shield' ? `Protects one missed day. You have ${state.streakShields}.` : 'Saved in your rewards wallet.'}</p><div className="row" style={{ justifyContent: 'center', marginTop: 10 }}><Link to="/app/rewards" className="btn btn-sm btn-light">Wallet</Link><Link to="/app/daily" className="btn btn-sm btn-primary">More missions</Link></div></div>
      : <button className="btn btn-burgundy btn-lg btn-block" disabled={!canSpin} onClick={go}>{spinning ? 'Spinning…' : state.member ? 'Spin the wheel' : 'Join to spin'}</button>}
    {!state.member && <Link to="/app/join" className="btn btn-light btn-block" style={{ marginTop: 8 }}>Join Glow Club</Link>}
    <div className="app-card" style={{ marginTop: 16 }}><div className="between"><h3>Fair play · odds</h3><span className="tiny muted">per spin</span></div><ul className="odds">{SPIN_PRIZES.map(p => <li key={p.id}><span className={`odds-dot ${p.rare ? 'rare' : ''}`} /><span>{p.kind === 'points' ? `${p.label} Glow Points` : p.sub}</span><b className="tnum">{Math.round((p.weight / total) * 100)}%</b></li>)}</ul></div>
    <div className="app-card"><h3 style={{ marginBottom: 6 }}>How it works</h3><ul className="benefit-list">{SPIN_RULES.map(r => <li key={r} style={{ fontSize: 13 }}><Icon name="check-circle" className="icon-sm" />{r}</li>)}</ul></div>
    {Object.keys(state.spins).length > 0 && <div className="app-card"><h3 style={{ marginBottom: 4 }}>Recent spins</h3>{Object.entries(state.spins).sort((a, b) => b[0].localeCompare(a[0])).slice(0, 7).map(([day, id]) => { const p = SPIN_PRIZES.find(x => x.id === id)!; return <div key={day} className="app-row"><span className="act-icon"><Icon name={p.icon} className="icon-sm" /></span><div><b>{p.kind === 'points' ? `${p.label} Glow Points` : p.sub}</b><small>{new Date(day + 'T00:00').toLocaleDateString('en-SG', { weekday: 'short', day: 'numeric', month: 'short' })}</small></div></div> })}</div>}
  </div>
}
