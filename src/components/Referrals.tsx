import React, { useState } from 'react'
import { Icon } from './Icon'
import { Avatar } from './ui'
import { useStore } from '@/store/store'
import { REFERRAL_MILESTONES, REFERRAL_STATES, TAGLINES } from '@/data/club'
import { n, ago } from '@/lib/format'

/* Refer & Glow: invitation, milestone ladder and referral states. Shared by the website account and the app. */
export function ReferAndGlow({ compact }: { compact?: boolean }) {
  const { state, actions, toast } = useStore(); const m = state.member!; const [name, setName] = useState(''); const [email, setEmail] = useState('')
  const count = state.referrals.filter(r => r.status === 'rewarded').length
  const reward = state.admin.referralReward ?? 1500; const disc = state.admin.friendDiscount ?? 15
  const link = `${location.origin}${import.meta.env.BASE_URL.replace(/\/$/, '')}/join?ref=${m.referralCode}`
  const copy = () => { navigator.clipboard?.writeText(link).then(() => toast('Referral link copied', { icon: 'users' })).catch(() => toast(link)) }
  return <div className="stack">
    <div className={compact ? 'app-card' : 'panel'} style={{ background: 'var(--burgundy-grad)', color: '#fff', borderColor: 'transparent' }}>
      <p className="eyebrow" style={{ color: '#f0d8a8' }}>Refer & Glow</p>
      <h3 className="serif" style={{ fontSize: compact ? 24 : 30, fontWeight: 500, margin: '4px 0 6px' }}>{TAGLINES.refer}</h3>
      <p className="small" style={{ opacity: .9 }}>Your friend gets <b>{disc}% off</b> their first qualifying order. You receive <b>{n(reward)} Glow Points</b> once it qualifies.</p>
      <div className="row" style={{ marginTop: 12, flexWrap: 'wrap' }}><span className="pill" style={{ background: 'rgba(255,255,255,.14)', color: '#fff' }}>Code · <b className="tnum">{m.referralCode}</b></span><button className="btn btn-sm btn-light" onClick={copy}><Icon name="share" className="icon-sm" /> Copy link</button></div>
    </div>
    <div className={compact ? 'app-card' : 'panel'}>
      <div className="between"><h3 style={{ fontSize: compact ? 16 : 22 }}>Your Glow Circle</h3><span className="pill pill-burgundy tiny"><Icon name="crown" className="icon-sm" /> {count >= (state.admin.thresholds?.ambassador ?? 10) ? 'Glow Ambassador' : `${(state.admin.thresholds?.ambassador ?? 10) - count} more to Ambassador`}</span></div>
      <p className="small muted" style={{ margin: '4px 0 10px' }}>{count} successful referral{count === 1 ? '' : 's'}. Ambassador status is earned by helping Lumiva grow, not by spend.</p>
      <ul className="ladder">{REFERRAL_MILESTONES.map(ms => { const done = count >= ms.count; const next = !done && count < ms.count && REFERRAL_MILESTONES.find(x => count < x.count) === ms; return <li key={ms.count} className={`${done ? 'done' : ''} ${next ? 'next' : ''}`}><span className="ladder-n">{done ? <Icon name="check" className="icon-sm" /> : ms.count}</span><div><b>{ms.label}</b><small>{ms.count} friend{ms.count > 1 ? 's' : ''} · {ms.reward}</small></div>{ms.tier && <Icon name="crown" className="icon-sm" style={{ color: 'var(--gold)' }} />}</li> })}</ul>
    </div>
    <div className={compact ? 'app-card' : 'panel'}>
      <h3 style={{ fontSize: compact ? 16 : 22, marginBottom: 8 }}>Invite a friend</h3>
      <div className={compact ? 'stack' : 'grid'} style={compact ? undefined : { gridTemplateColumns: '1fr 1fr auto', gap: 8 }}><input className="input" placeholder="Friend's name" value={name} onChange={e => setName(e.target.value)} /><input className="input" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} /><button className="btn btn-primary" disabled={!name || !email} onClick={() => { actions.refer(name, email); setName(''); setEmail('') }}>Send invite</button></div>
      <p className="tiny muted" style={{ marginTop: 8 }}>Rewards are conditional: Invited → Clicked → Registered → Purchased → Pending ({state.admin.qualificationDays ?? 14} days) → Qualified → Rewarded. Self-referrals and duplicate accounts are blocked.</p>
    </div>
    <div className={compact ? 'app-card' : 'panel'}>
      <h3 style={{ fontSize: compact ? 16 : 22, marginBottom: 6 }}>Your referrals</h3>
      {state.referrals.length ? state.referrals.map(r => { const st = REFERRAL_STATES.find(x => x.key === r.status)!; const idx = REFERRAL_STATES.indexOf(st); return <div key={r.id} className="app-row" style={{ alignItems: 'flex-start' }}><Avatar initials={r.name.split(' ').map(x => x[0]).join('').slice(0, 2)} variant={r.status === 'rewarded' ? 'burgundy' : ''} /><div style={{ flex: 1, minWidth: 0 }}><b>{r.name}</b><small>{st.label} · {st.blurb} · {ago(r.ts)}</small><div className="ref-steps">{REFERRAL_STATES.map((x, i) => <i key={x.key} className={i <= idx ? 'on' : ''} title={x.label} />)}</div></div><div className="end" style={{ flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}><span className={`pill tiny ${r.status === 'rewarded' ? 'pill-success' : r.status === 'pending' || r.status === 'qualified' ? 'pill-gold' : 'pill-muted'}`}>{r.status === 'rewarded' ? `+${n(reward)}` : st.label}</span>{r.status !== 'rewarded' && <button className="btn btn-sm btn-light" onClick={() => actions.advanceReferral(r.id)} title="Concept build: simulate the next referral state">Next step</button>}</div></div> }) : <p className="small muted">No invitations yet. Your first friend earns you {n(reward)} points.</p>}
    </div>
  </div>
}
