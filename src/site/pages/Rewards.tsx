import React, { useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { Icon } from '@/components/Icon'
import { RewardCard, Progress, Modal, BackButton } from '@/components/ui'
import { useStore } from '@/store/store'
import { REWARDS, REWARD_TABS, rewardById } from '@/data/rewards'
import { TIERS } from '@/data/club'
import { n } from '@/lib/format'
import { useLinks } from '@/lib/links'

export function Rewards() {
  const { state, d } = useStore(); const [tab, setTab] = useState<string>('all'); const [afford, setAfford] = useState(false)
  const list = REWARDS.filter(r => (tab === 'all' || r.category === tab) && (!afford || r.points <= d.available))
  return <div className="container">
    <div className="page-hero between" style={{ alignItems: 'flex-end', flexWrap: 'wrap' }}><div><p className="eyebrow">Reward marketplace</p><h1>Use your points</h1><p>Coffee, skincare, treatments, experiences and a carefully governed hero reward. Every reward shows points, availability, eligibility and terms.</p></div>{state.member && <div className="card card-pad" style={{ textAlign: 'right' }}><span className="tiny muted">Available to redeem</span><div className="serif tnum" style={{ fontSize: 36, lineHeight: 1 }}>{n(d.available)}</div><span className="small muted">Glow Points</span></div>}</div>
    <div className="shop-toolbar"><div className="chips"><button className={`chip ${tab === 'all' ? 'active' : ''}`} onClick={() => setTab('all')}>All</button>{REWARD_TABS.map(t => <button key={t.key} className={`chip ${tab === t.key ? 'active' : ''}`} onClick={() => setTab(t.key)}>{t.label}</button>)}</div>{state.member && <label className="row small"><input type="checkbox" checked={afford} onChange={e => setAfford(e.target.checked)} /> Only what I can redeem now</label>}</div>
    <div className="rgrid" style={{ marginTop: 8 }}>{list.map(r => <RewardCard key={r.id} reward={r} />)}</div>
    {!list.length && <div className="empty"><h3>Nothing here yet</h3><p>Keep earning. Your next reward is closer than you think.</p></div>}
    <div style={{ height: 60 }} />
  </div>
}

export function RewardDetail({ inApp }: { inApp?: boolean }) {
  const { id } = useParams(); const r = rewardById(id ?? ''); const { state, d, actions } = useStore(); const L = useLinks(); const [confirm, setConfirm] = useState(false); const [done, setDone] = useState<string | null>(null)
  if (!r) return <Navigate to={L.rewards} replace />
  const stock = state.admin.rewardStock[r.id]; const out = stock !== null && stock !== undefined && stock <= 0
  const tierOk = !r.minTier || TIERS.findIndex(t => t.key === d.tier.key) >= TIERS.findIndex(t => t.key === r.minTier)
  const can = !!state.member && d.available >= r.points && tierOk && !out && r.points > 0
  const saved = state.savedRewards.includes(r.id)
  const mine = state.redemptions.filter(x => x.rewardId === r.id)
  const go = () => { const red = actions.redeem(r.id); if (red) { setDone(red.code); setConfirm(false) } }
  const Body = <>
    <div className="rd">
      <div className="rd-img"><img src={r.image} alt={r.name} /></div>
      <div>
        <span className={`pill ${r.hero ? 'pill-gold' : 'pill-muted'} tiny`}>{r.hero ? 'Hero reward' : REWARD_TABS.find(t => t.key === r.category)?.label}</span>
        <h1 style={{ marginTop: 10 }}>{r.name}</h1>
        <p className="muted">{r.blurb}</p>
        <div className="rd-pts"><Icon name="sun" /> {r.points ? `${n(r.points)} points` : 'Tier benefit'}</div>
        {state.member && r.points > 0 && <div style={{ marginBottom: 16 }}><div className="between small"><span>Your progress</span><b className="tnum">{n(Math.min(d.available, r.points))} / {n(r.points)}</b></div><Progress value={d.available} max={r.points} />{d.available < r.points && <p className="tiny muted" style={{ marginTop: 6 }}>{n(r.points - d.available)} more points. {r.hero ? 'Achievable through long-term loyalty, not a single purchase.' : ''}</p>}</div>}
        <p style={{ color: 'var(--ink-3)' }}>{r.description}</p>
        <div className="kv"><div><b>Eligibility</b>{r.eligibility}</div><div><b>Valid for</b>{r.validity}</div><div><b>Availability</b>{out ? 'Out of stock' : stock === null || stock === undefined ? r.availability : `${stock} available`}</div><div><b>Redemption</b>{r.requiresApproval ? 'Approval required · 5 working days' : 'Instant'}</div></div>
        <div className="row" style={{ margin: '18px 0' }}>
          {state.member ? <button className="btn btn-primary btn-lg" disabled={!can} onClick={() => setConfirm(true)}>{out ? 'Out of stock' : !tierOk ? `From ${TIERS.find(t => t.key === r.minTier)?.short}` : r.points === 0 ? 'Included in your tier' : d.available < r.points ? 'Keep earning' : r.requiresApproval ? 'Request this reward' : 'Redeem now'}</button> : <Link to={L.join} className="btn btn-primary btn-lg">Join to redeem</Link>}
          <button className={`btn btn-secondary ${saved ? 'copper' : ''}`} onClick={() => actions.saveReward(r.id)}><Icon name={saved ? 'heart-fill' : 'heart'} className="icon-sm" /> {saved ? 'Tracking' : 'Track this reward'}</button>
        </div>
        {!can && state.member && d.available < r.points && <Link to={L.daily} className="link-arrow">How to earn faster <Icon name="chevron" className="icon-sm" /></Link>}
        <h3 style={{ fontSize: 22, margin: '22px 0 6px' }}>How to redeem</h3><ol className="numbered">{r.redemptionSteps.map((s, i) => <li key={s}><span>{i + 1}</span>{s}</li>)}</ol>
        <h3 style={{ fontSize: 22, margin: '18px 0 6px' }}>Terms</h3><ul className="terms">{r.terms.map(t => <li key={t}>{t}</li>)}</ul>
        {mine.length > 0 && <><h3 style={{ fontSize: 22, margin: '18px 0 6px' }}>Your redemptions</h3>{mine.map(m => <div key={m.id} className="between small card card-pad" style={{ marginBottom: 8 }}><span>Code <b className="tnum">{m.code}</b></span><span className={`pill tiny ${m.status === 'pending' ? 'pill-gold' : m.status === 'rejected' ? 'pill-muted' : 'pill-success'}`}>{m.status}</span></div>)}</>}
      </div>
    </div>
    {confirm && <Modal onClose={() => setConfirm(false)} width={480}><div style={{ padding: 32 }}><h2 style={{ fontSize: 28 }}>{r.requiresApproval ? 'Request' : 'Redeem'} {r.name}?</h2><p className="muted" style={{ margin: '8px 0 18px' }}>{n(r.points)} points will be {r.requiresApproval ? 'held while our team verifies eligibility. They are only deducted on approval.' : 'deducted from your balance. Your new balance will be ' + n(d.available - r.points) + ' points.'}</p><div className="row"><button className="btn btn-primary" onClick={go}>Confirm</button><button className="btn btn-light" onClick={() => setConfirm(false)}>Cancel</button></div></div></Modal>}
    {done && <Modal onClose={() => setDone(null)} width={480}><div className="reveal"><span className="reveal-check"><Icon name="check" /></span><h2>{r.requiresApproval ? 'Request submitted' : 'Reward redeemed'}</h2><p className="muted">{r.requiresApproval ? 'You will hear from us within 5 working days. Track the status in your wallet.' : 'Your reward is in your wallet. Show this code to redeem.'}</p><div className="reveal-card" style={{ justifyContent: 'center' }}><b className="tnum" style={{ fontSize: 24, letterSpacing: '.08em' }}>{done}</b></div><div className="row" style={{ justifyContent: 'center', marginTop: 16 }}><Link to={L.account} className="btn btn-primary" onClick={() => setDone(null)}>View my wallet</Link><button className="btn btn-light" onClick={() => setDone(null)}>Done</button></div></div></Modal>}
  </>
  if (inApp) return Body
  return <div className="container" style={{ paddingTop: 24 }}><BackButton to={L.rewards} label="All rewards" />{Body}<div style={{ height: 60 }} /></div>
}
