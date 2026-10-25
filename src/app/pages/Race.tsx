import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Icon } from '@/components/Icon'
import { Avatar } from '@/components/ui'
import { useStore } from '@/store/store'
import { BALLS, roundInfo, simulate, crowd, type Race } from '@/game/race'
import { drawRace, newRenderState } from '@/game/render'
import { n, ago } from '@/lib/format'
import { Sparkles } from './Spin'

const useClock = (ms = 250) => { const [now, setNow] = useState(Date.now()); useEffect(() => { const t = setInterval(() => setNow(Date.now()), ms); return () => clearInterval(t) }, [ms]); return now }
const fmt = (ms: number) => { const s = Math.max(0, Math.ceil(ms / 1000)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}` }
const ball = (id: string) => BALLS.find(b => b.id === id)!

/* Small live card used on Home, Glow Club and Daily */
export function RaceCard() {
  const { state, d } = useStore(); const now = useClock(1000); const r = roundInfo(now)
  if (!state.admin.race?.enabled) return null
  const pick = state.race.picks.find(p => p.roundId === r.id)
  return <Link to="/app/race" className="race-card">
    <span className="race-dot" /><span className="race-mini">{BALLS.map(b => <i key={b.id} style={{ background: b.color, borderColor: b.ring }} />)}</span>
    <span style={{ flex: 1 }}><b>Glow Race · {r.phase === 'open' ? 'calls open' : r.phase === 'lock' ? 'locking' : r.phase === 'race' ? 'racing now' : 'results'}</b><small className="muted">{r.phase === 'open' ? `${fmt(r.phaseEnd - now)} to call a winner` : r.phase === 'race' ? 'Watch live' : `Next race in ${fmt(r.phaseEnd - now)}`}{pick ? ` · you called ${ball(pick.win).name}` : state.member ? ` · ${d.raceEntriesAllowed - d.raceEntriesToday} free calls left` : ''}</small></span>
    <span className={`btn btn-sm ${r.phase === 'open' ? 'btn-burgundy' : 'btn-light'}`}>{r.phase === 'open' ? 'Call it' : 'Watch'}</span>
  </Link>
}

export function AppRace() {
  const { state, d, actions } = useStore(); const nav = useNavigate(); const now = useClock(250); const r = roundInfo(now)
  const canvas = useRef<HTMLCanvasElement>(null); const rs = useRef(newRenderState()); const settledRef = useRef<string>('')
  const [podiumMode, setPodiumMode] = useState(false); const [podium, setPodium] = useState<string[]>([])
  const race: Race = useMemo(() => simulate(r.seed), [r.seed])
  const cw = crowd(r.index)
  const pick = state.race.picks.find(p => p.roundId === r.id)
  const raceT = now - r.raceStart; const frameIdx = raceT < 0 ? 0 : Math.floor(raceT / 1000 * 60)
  const finished = r.phase === 'result' || (r.phase === 'race' && frameIdx >= race.totalFrames - 1)
  const standings = useMemo(() => { const f = race.frames[Math.max(0, Math.min(race.frames.length - 1, frameIdx))]; return BALLS.map((b, i) => ({ b, y: f[i * 2 + 1], fin: race.order.indexOf(b.id) >= 0 && race.finishFrame[i] <= frameIdx })).sort((a, b) => (b.fin ? 1000 + (3 - race.order.indexOf(b.b.id)) : b.y) - (a.fin ? 1000 + (3 - race.order.indexOf(a.b.id)) : a.y)) }, [race, frameIdx])
  // reset camera for a new round
  useEffect(() => { rs.current = newRenderState() }, [r.index])
  // draw loop
  useEffect(() => {
    const c = canvas.current; if (!c) return; const ctx = c.getContext('2d'); if (!ctx) return
    let raf = 0
    const loop = () => { const dpr = window.devicePixelRatio || 1; const w = c.clientWidth, h = c.clientHeight; if (c.width !== Math.round(w * dpr)) { c.width = Math.round(w * dpr); c.height = Math.round(h * dpr) }
      const t = Date.now() - r.raceStart; const fi = r.phase === 'open' || r.phase === 'lock' ? 0 : t < 0 ? 0 : Math.floor(t / 1000 * 60)
      drawRace(ctx, race, r.phase === 'result' ? race.totalFrames - 1 : fi, rs.current, w, h, dpr); raf = requestAnimationFrame(loop) }
    raf = requestAnimationFrame(loop); return () => cancelAnimationFrame(raf)
  }, [race, r.phase, r.raceStart])
  // settle once the race has finished
  useEffect(() => { if (finished && pick && !pick.settled && settledRef.current !== r.id) { settledRef.current = r.id; actions.raceSettle(r.id, race.order) } }, [finished, pick?.roundId, pick?.settled])
  const call = (id: string) => { if (r.phase !== 'open') return; if (podiumMode) { const p = podium.includes(id) ? podium.filter(x => x !== id) : [...podium, id].slice(0, 3); setPodium(p); if (p.length === 3) actions.racePick(r.id, r.index, p[0], p) } else actions.racePick(r.id, r.index, id) }
  const cfg = state.admin.race ?? { win: 100, podium: 500, dailyCap: 1000, freeEntries: 3 }
  const history = state.race.picks.filter(p => p.settled).slice(0, 8)
  const calls = state.race.picks.filter(p => p.settled); const hits = calls.filter(p => (p.points ?? 0) > 0).length
  return <div className="screen race">
    <div className="screen-head"><button className="icon-btn" onClick={() => nav(-1)}><Icon name="chevron-left" /></button><h1 style={{ fontSize: 26 }}>Glow Race</h1><span className="pill pill-outline"><span className="race-dot" /> {n(cw.watching)} watching</span></div>
    <div className="race-stage">
      <canvas ref={canvas} className="race-canvas" />
      <div className="race-hud">
        <span className={`race-phase ${r.phase}`}>{r.phase === 'open' ? `Calls close in ${fmt(r.phaseEnd - now)}` : r.phase === 'lock' ? 'Locked · seed revealed' : r.phase === 'race' && !finished ? 'LIVE' : 'Result'}</span>
        <span className="race-round tnum">Round {r.id}</span>
      </div>
      {(r.phase === 'race' || r.phase === 'result') && <div className="race-standings">{standings.map((s, i) => <div key={s.b.id} className={`st ${s.fin ? 'fin' : ''}`}><span className="st-pos">{i + 1}</span><i style={{ background: s.b.color, borderColor: s.b.ring }} /><span>{s.b.name}</span>{pick?.win === s.b.id && <Icon name="flame" className="icon-sm" style={{ color: 'var(--copper)' }} />}</div>)}</div>}
      {r.phase === 'open' && <div className="race-overlay"><p className="eyebrow" style={{ color: '#f0d8a8' }}>Next race</p><h2>Who takes the Glow Race?</h2><p>Four marbles, one course, same race on every phone. Call the winner for +{cfg.win} pts, or the exact podium for +{cfg.podium}.</p></div>}
      {r.phase === 'lock' && <div className="race-overlay"><h2>Calls locked</h2><p className="tnum" style={{ fontSize: 12, opacity: .8 }}>Seed {race.seed.toString(16)} · commit {r.commit.slice(0, 12)}…</p><p>Starting in {fmt(r.phaseEnd - now)}</p></div>}
      {finished && <div className="race-result"><Sparkles count={16} /><div className="winner"><i style={{ background: ball(race.order[0]).color, borderColor: ball(race.order[0]).ring }} /><div><small>Winner</small><b>{ball(race.order[0]).name}</b></div></div>{pick ? <p className={`race-outcome ${(pick.points ?? 0) > 0 ? 'win' : ''}`}>{(pick.points ?? 0) > 0 ? `You called it · +${pick.points} pts` : `You called ${ball(pick.win).name}. Next race in ${fmt(r.phaseEnd - now)}`}</p> : <p className="race-outcome">Next race in {fmt(r.phaseEnd - now)}</p>}</div>}
    </div>

    <div className="app-card">
      <div className="between"><h3>{r.phase === 'open' ? 'Make your call' : 'Your call'}</h3>{state.member && <span className="tiny muted">{d.raceEntriesAllowed - d.raceEntriesToday} of {d.raceEntriesAllowed} free calls left today</span>}</div>
      <div className="race-picks">{BALLS.map((b, i) => { const on = podiumMode ? podium.includes(b.id) : pick?.win === b.id; const rank = podium.indexOf(b.id); return <button key={b.id} className={`race-pick ${on ? 'on' : ''}`} disabled={r.phase !== 'open'} onClick={() => call(b.id)}><i style={{ background: b.color, borderColor: b.ring }}>{podiumMode && rank >= 0 ? rank + 1 : ''}</i><b>{b.name}</b><small>{cw.shares[i]}% of the crowd</small></button> })}</div>
      {state.member ? <div className="between" style={{ marginTop: 10 }}><label className="row small" style={{ gap: 8 }}><button className={`toggle ${podiumMode ? 'on' : ''}`} onClick={() => { setPodiumMode(v => !v); setPodium([]) }} /> Exact podium · +{cfg.podium} pts</label>{pick && <span className="pill pill-burgundy tiny"><Icon name="flame" className="icon-sm" /> {ball(pick.win).name}{pick.podium ? ' · podium' : ''}</span>}</div> : <Link to="/app/join" className="btn btn-burgundy btn-block" style={{ marginTop: 10 }}>Join Glow Club to call the race</Link>}
      {podiumMode && podium.length < 3 && r.phase === 'open' && <p className="tiny muted" style={{ marginTop: 6 }}>Tap three marbles in finishing order.</p>}
    </div>

    <div className="app-card"><div className="between"><h3>Your record</h3><span className="tiny muted">Today: {n(d.racePointsToday)} / {n(cfg.dailyCap)} pts</span></div>
      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 8 }}><div className="stat"><b className="tnum" style={{ fontSize: 22 }}>{calls.length}</b><small>Races called</small></div><div className="stat"><b className="tnum" style={{ fontSize: 22 }}>{hits}</b><small>Correct</small></div><div className="stat"><b className="tnum" style={{ fontSize: 22 }}>{calls.length ? Math.round((hits / calls.length) * 100) : 0}%</b><small>Hit rate</small></div></div>
      {history.length > 0 && <div style={{ marginTop: 8 }}>{history.map(p => <div key={p.roundId} className="app-row"><i className="race-swatch" style={{ background: ball(p.result![0]).color, borderColor: ball(p.result![0]).ring }} /><div style={{ flex: 1 }}><b>{ball(p.result![0]).name} won · you called {ball(p.win).name}{p.podium ? ' + podium' : ''}</b><small>{ago(p.ts)} · {p.result!.map(id => ball(id).label).join(' › ')}</small></div><span className={`pill tiny ${(p.points ?? 0) > 0 ? 'pill-success' : 'pill-muted'}`}>{(p.points ?? 0) > 0 ? `+${p.points}` : 'miss'}</span></div>)}</div>}
    </div>

    <div className="app-card"><h3 style={{ marginBottom: 6 }}>Fair play</h3><ul className="benefit-list">{['Free to play. A wrong call never costs you anything.', `${cfg.freeEntries} free calls a day, plus one for each Glow Level.`, `Winnings capped at ${n(cfg.dailyCap)} points a day.`, 'Every race is simulated from a published seed, so every phone sees the identical race and nobody can change the result.', 'The seed is committed before calls close and revealed at lock. Verify any round from its commit.'].map(t => <li key={t} style={{ fontSize: 13 }}><Icon name="check-circle" className="icon-sm" />{t}</li>)}</ul></div>
  </div>
}
