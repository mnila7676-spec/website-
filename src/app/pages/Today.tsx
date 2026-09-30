import React from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '@/components/Icon'
import { useStore } from '@/store/store'
import { MissionList } from './Daily'
import { SpinCard } from './Spin'
import { STREAK_BONUS, REFERRAL_MILESTONES, TAGLINES } from '@/data/club'
import { REWARDS } from '@/data/rewards'
import { n } from '@/lib/format'

export function WeekStrip() {
  const { state } = useStore(); const now = new Date(); const dow = (now.getDay() + 6) % 7
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((l, i) => { const dt = new Date(now); dt.setDate(now.getDate() - dow + i); const key = dt.toISOString().slice(0, 10); return { l, num: dt.getDate(), key, on: state.checkins.includes(key), today: i === dow, routine: !!(state.routineLog[key]?.am || state.routineLog[key]?.pm), spin: !!state.spins[key] } })
  return <div className="week-strip">{days.map(d => <div key={d.key} className={d.today ? 'today' : ''}><small>{d.l}</small><span className={`num ${d.today ? 'on' : ''}`}>{d.num}</span><span className="dots"><i className={d.on ? 'copper' : ''} /><i className={d.routine ? 'burgundy' : ''} /><i className={d.spin ? 'gold' : ''} /></span></div>)}</div>
}

export function WeeklyDots() {
  const { state, d } = useStore(); const target = 5; const done = Math.min(target, d.weekRoutines)
  const claimed = state.weeklyBonusClaimed.includes(`routines-5:${weekStart()}`)
  return <div className="weekly-dots-wrap">
    <div className="between small"><b>Weekly progress</b><span>{done} of {target} completed</span></div>
    <div className="weekly-dots">{Array.from({ length: target }).map((_, i) => <React.Fragment key={i}>{i > 0 && <span className={`line ${i < done ? 'on' : ''}`} />}<span className={`dot ${i < done ? 'on' : ''}`}>{i < done && <Icon name="check" className="icon-sm" />}</span></React.Fragment>)}<span className={`line ${done >= target ? 'on' : ''}`} /><span className={`dot prize ${done >= target ? 'on' : ''}`}><Icon name="gift" className="icon-sm" /></span></div>
    <p className="tiny muted">{claimed ? 'Bonus claimed this week. Keep the rhythm going.' : done >= target ? <Link to="/app/daily" className="burgundy"><b>Claim your 300-point bonus →</b></Link> : <>Complete {target} routines to earn a <b className="burgundy">300-point bonus</b></>}</p>
  </div>
}
function weekStart() { const t = new Date(); const day = (t.getDay() + 6) % 7; t.setDate(t.getDate() - day); return t.toISOString().slice(0, 10) }

export function TodaySection() {
  const { state, d, actions } = useStore()
  if (!state.member) return null
  const bonus = STREAK_BONUS[Math.min(7, d.streak + 1)] ?? 0
  return <div className="today">
    <div className="between" style={{ marginBottom: 6 }}><h2 className="serif" style={{ fontSize: 30 }}>Today's Glow</h2><span className="pill pill-outline"><Icon name="flame" className="icon-sm copper" /> {d.streak} day streak</span></div>
    <WeekStrip />
    <button className={`checkin-row ${d.checkedInToday ? 'done' : ''}`} onClick={() => !d.checkedInToday && actions.checkIn()}><span className="ck"><Icon name="check" /></span><span style={{ flex: 1, textAlign: 'left' }}><b>Daily Check-In <em>+{80 + bonus} pts</em></b><small>{d.checkedInToday ? "You've claimed today" : 'Claim to keep your streak alive'}</small></span><span className={`mgo ${d.checkedInToday ? 'ok' : ''}`}><Icon name={d.checkedInToday ? 'check' : 'chevron'} className="icon-sm" /></span></button>
    <SpinCard />
    <div className="app-card" style={{ padding: '4px 14px' }}><MissionList /></div>
    <div className="app-card"><WeeklyDots /></div>
  </div>
}

export function GlowCircle() {
  const { state, d } = useStore(); if (!state.member) return null
  const target = d.thresholds.ambassador; const c = d.successfulReferrals; const isAmb = c >= target
  const nextMs = REFERRAL_MILESTONES.find(m => m.count > c)
  return <div className="app-card glow-circle">
    <div className="between"><h3>Your Glow Circle</h3><span className="tiny muted">{TAGLINES.refer}</span></div>
    <div className="row" style={{ alignItems: 'baseline', gap: 6, marginTop: 4 }}><span className="serif tnum" style={{ fontSize: 34, lineHeight: 1 }}>{c}</span><span className="small muted">successful referral{c === 1 ? '' : 's'}</span></div>
    <div className="gc-bar"><span style={{ width: `${Math.min(100, (c / target) * 100)}%` }} /></div>
    <div className="between tiny"><span className="tnum">{Math.min(c, target)} / {target}</span><span className="burgundy"><b>{isAmb ? 'Glow Ambassador' : `${target - c} more → Glow Ambassador`}</b> <Icon name="crown" className="icon-sm" style={{ verticalAlign: '-3px' }} /></span></div>
    {nextMs && !isAmb && <p className="tiny muted" style={{ marginTop: 6 }}>Next milestone: {nextMs.label} at {nextMs.count} · {nextMs.reward}</p>}
    <Link to="/app/profile/referrals" className="btn btn-burgundy btn-block" style={{ marginTop: 10 }}><Icon name="users" className="icon-sm" /> Invite a friend · +{n(state.admin.referralReward ?? 1500)} pts</Link>
  </div>
}

export function YourRewards() {
  const { state, d } = useStore(); if (!state.member) return null
  const list = [...REWARDS.filter(r => r.points > 0 && r.points <= d.available).sort((a, b) => b.points - a.points).slice(0, 2), ...REWARDS.filter(r => r.points > d.available).sort((a, b) => a.points - b.points).slice(0, 1)]
  return <div className="app-card"><div className="between"><h3>Your Rewards</h3><Link to="/app/rewards/catalogue" className="tiny muted">All rewards</Link></div>
    {list.map(r => <Link key={r.id} to={`/app/rewards/${r.id}`} className="app-row"><img src={r.image} alt="" style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover' }} /><div style={{ flex: 1 }}><b>{r.name}</b><small>{r.points <= d.available ? 'Ready to redeem' : `${n(r.points - d.available)} pts to go`}</small></div><span className={`pill tiny ${r.points <= d.available ? 'pill-success' : 'pill-muted'}`}>{n(r.points)} pts</span></Link>)}
  </div>
}
