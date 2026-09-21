import React, { useState } from 'react'
import { Link, useNavigate, useParams, Navigate } from 'react-router-dom'
import { Icon } from '@/components/Icon'
import { Modal, Progress } from '@/components/ui'
import { useStore } from '@/store/store'
import { rewardById, REWARD_TABS } from '@/data/rewards'
import { TIERS } from '@/data/club'
import { n } from '@/lib/format'
import { Sparkles } from './Spin'

export function AppRewardDetail() {
  const { id } = useParams(); const r = rewardById(id ?? ''); const { state, d, actions } = useStore(); const nav = useNavigate()
  const [confirm, setConfirm] = useState(false); const [done, setDone] = useState<string | null>(null); const [how, setHow] = useState(false)
  if (!r) return <Navigate to="/app/rewards" replace />
  const stock = state.admin.rewardStock[r.id]; const out = stock !== null && stock !== undefined && stock <= 0
  const tierOk = !r.minTier || TIERS.findIndex(t => t.key === d.tier.key) >= TIERS.findIndex(t => t.key === r.minTier)
  const can = !!state.member && d.available >= r.points && tierOk && !out && r.points > 0
  const saved = state.savedRewards.includes(r.id); const mine = state.redemptions.filter(x => x.rewardId === r.id)
  const go = () => { const red = actions.redeem(r.id); if (red) { setDone(red.code); setConfirm(false) } }
  return <div className="screen" style={{ paddingTop: 0 }}>
    <div className="reward-hero"><img src={r.image} alt={r.name} /><span className="shade" />
      <button className="hero-btn" onClick={() => nav(-1)} aria-label="Back"><Icon name="chevron-left" className="icon-sm" /></button>
      <button className="hero-btn right" onClick={() => navigator.share?.({ title: r.name, url: location.href })} aria-label="Share"><Icon name="share" className="icon-sm" /></button>
      <div className="over"><h1>{r.name}</h1><span className="pill pill-copper"><Icon name="sun" className="icon-sm" /> {r.points ? `${n(r.points)} points` : 'Tier benefit'}</span></div>
    </div>
    {state.member && r.points > 0 && <div className="app-card"><span className="tiny muted" style={{ letterSpacing: '.12em', textTransform: 'uppercase' }}>Your progress</span><div className="row" style={{ alignItems: 'baseline', gap: 6 }}><span className="serif tnum burgundy" style={{ fontSize: 36, lineHeight: 1 }}>{n(Math.min(d.available, r.points))}</span><span className="muted small">/ {n(r.points)}</span></div><div style={{ margin: '8px 0 6px' }}><Progress value={d.available} max={r.points} variant="burgundy" /></div><p className="small muted">{r.description}</p></div>}
    {!state.member && <div className="app-card"><p className="small muted">{r.description}</p></div>}
    <div className="app-card" style={{ padding: '4px 14px' }}>
      {[['sparkle', 'Eligibility', r.eligibility], ['calendar', 'Valid for', r.validity], ['info', r.requiresApproval ? 'Approval' : 'Availability', r.requiresApproval ? 'Approval required · 5 working days' : out ? 'Out of stock' : stock === null || stock === undefined ? r.availability : `${stock} available`]].map(([i, k, v]) => <div key={k} className="app-row"><span className="act-icon"><Icon name={i} className="icon-sm" /></span><div><b>{k}</b><small>{v}</small></div></div>)}
    </div>
    {state.member ? <button className="btn btn-burgundy btn-lg btn-block" disabled={!can && r.points > 0} onClick={() => can ? setConfirm(true) : null}>{out ? 'Out of stock' : !tierOk ? `From ${TIERS.find(t => t.key === r.minTier)?.name}` : r.points === 0 ? 'Included in your tier' : can ? (r.requiresApproval ? 'Request this reward' : 'Redeem now') : `${n(r.points - d.available)} points to go`}</button> : <Link to="/app/join" className="btn btn-burgundy btn-lg btn-block">Join to redeem</Link>}
    <div className="row" style={{ marginTop: 8 }}><button className={`btn btn-block ${saved ? 'btn-light' : 'btn-secondary'}`} onClick={() => actions.saveReward(r.id)}><Icon name={saved ? 'heart-fill' : 'heart'} className="icon-sm copper" /> {saved ? 'Tracking' : 'Track This Reward'}</button><button className="btn btn-block btn-gold" onClick={() => setHow(v => !v)}>How to Earn Faster</button></div>
    {how && <div className="app-card fade-up" style={{ marginTop: 10, borderColor: 'var(--gold)' }}><b className="small">Fastest routes to {r.name}</b><ul className="benefit-list" style={{ marginTop: 6 }}>{[['calendar', 'Daily check-in · up to 160 pts/day with streak bonus'], ['sun', 'AM + PM routine · 60 pts/day'], ['compass', 'Glow Spin · up to 80 pts/day'], ['shield', 'Weekly challenges · 300 to 450 pts'], ['users', 'Refer a friend · 500 pts per first order'], ['bag', `Shop · ${10 * d.tier.multiplier} pts per S$1 as ${d.tier.short}`]].map(([i, t]) => <li key={t} style={{ fontSize: 13 }}><Icon name={i} className="icon-sm" />{t}</li>)}</ul><Link to="/app/daily" className="btn btn-sm btn-primary" style={{ marginTop: 8 }}>Go to missions</Link></div>}
    <div className="app-card" style={{ marginTop: 12 }}><h3 style={{ marginBottom: 6 }}>How to redeem</h3><ol className="numbered">{r.redemptionSteps.map((s, i) => <li key={s} style={{ fontSize: 13 }}><span>{i + 1}</span>{s}</li>)}</ol></div>
    <div className="app-card"><h3 style={{ marginBottom: 6 }}>Terms</h3><ul className="terms">{r.terms.map(t => <li key={t}>{t}</li>)}</ul><p className="tiny muted" style={{ marginTop: 8 }}>{REWARD_TABS.find(t => t.key === r.category)?.label} reward{r.hero ? ' · hero reward, governed by approval' : ''}.</p></div>
    {mine.length > 0 && <div className="app-card"><h3 style={{ marginBottom: 4 }}>Your redemptions</h3>{mine.map(m => <div key={m.id} className="app-row"><div><b className="tnum">{m.code}</b><small>{m.note ?? ''}</small></div><span className={`pill tiny end ${m.status === 'pending' ? 'pill-gold' : m.status === 'rejected' ? 'pill-muted' : 'pill-success'}`}>{m.status}</span></div>)}</div>}
    {confirm && <Modal onClose={() => setConfirm(false)} width={360}><div style={{ padding: 24 }}><h2 style={{ fontSize: 24 }}>{r.requiresApproval ? 'Request' : 'Redeem'} {r.name}?</h2><p className="muted small" style={{ margin: '8px 0 16px' }}>{n(r.points)} points will be {r.requiresApproval ? 'held while we verify eligibility. Deducted only on approval.' : `deducted. New balance ${n(d.available - r.points)}.`}</p><div className="row"><button className="btn btn-burgundy" onClick={go}>Confirm</button><button className="btn btn-light" onClick={() => setConfirm(false)}>Cancel</button></div></div></Modal>}
    {done && <Modal onClose={() => setDone(null)} width={360}><div className="reveal" style={{ padding: '32px 20px 24px' }}><Sparkles /><span className="reveal-check"><Icon name="check" /></span><h2 style={{ fontSize: 28 }}>{r.requiresApproval ? 'Request submitted' : 'Redeemed'}</h2><p className="muted small">{r.requiresApproval ? 'We will confirm within 5 working days.' : 'Show this code to redeem.'}</p><div className="reveal-card" style={{ justifyContent: 'center' }}><b className="tnum" style={{ fontSize: 22, letterSpacing: '.08em' }}>{done}</b></div><button className="btn btn-primary btn-block" style={{ marginTop: 14 }} onClick={() => setDone(null)}>Done</button></div></Modal>}
  </div>
}
