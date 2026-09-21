import React, { useState } from 'react'
import { asset } from '@/lib/asset'
import { Link, useNavigate } from 'react-router-dom'
import { Icon } from '@/components/Icon'
import { TierBadge, Progress, Avatar } from '@/components/ui'
import { ActivityCard } from '@/components/Ticker'
import { useStore, leaderboard } from '@/store/store'
import { REWARDS, REWARD_TABS } from '@/data/rewards'
import { MILESTONES } from '@/data/club'
import { n } from '@/lib/format'
import { SpinCard } from './Spin'

export function AppRewards() {
  const { state, d } = useStore(); const lb = leaderboard(state, 'weekly')
  if (!state.member) return <div className="screen"><div className="screen-head"><h1>Glow Club</h1></div><div className="banner copper"><div className="banner-copy"><h2>Join Glow Club</h2><p>Points, missions, milestones and rewards.</p><Link to="/app/join" className="btn btn-light btn-sm">Join free</Link></div><img src={asset('/images/hero-group.jpg')} alt="" /></div><AppCatalogueList tab="everyday" /></div>
  return <div className="screen">
    <div className="screen-head"><h1>Glow Club</h1><Link to="/app/notifications" className="icon-btn"><Icon name="bell" /></Link></div>
    <ActivityCard />
    <div className="glow-card" style={{ marginTop: 12 }}><div className="between"><div><span className="lbl">Your balance</span><div className="num tnum">{n(d.balance)}</div><span style={{ fontSize: 12 }}>Glow Points</span></div><div style={{ textAlign: 'center' }}><TierBadge tier={d.tier} size={50} /><div style={{ fontSize: 11, marginTop: 4 }}>{d.tier.name}</div></div></div>
      {d.next && <><div className="progress"><span style={{ width: `${(d.lifetime / d.next.min) * 100}%` }} /></div><div className="between" style={{ fontSize: 11.5 }}><span>{n(d.next.min - d.lifetime)} points to {d.next.short}</span><Icon name="medal" className="icon-sm" /></div></>}</div>
    <div className="app-card"><div className="between"><h3>Milestone Rewards</h3><Link to="/app/journey" className="tiny muted">View All</Link></div>
      <div className="ms-row" style={{ marginTop: 10 }}>{[0, 2, 4].map((idx, i) => { const m = MILESTONES[idx]; return <React.Fragment key={m.points}>{i > 0 && <span className="dash" />}<Link to="/app/journey" className={`node ${d.lifetime >= m.points ? '' : 'locked'}`}><img src={m.image} alt="" /><b>{m.name}</b><small>at {n(m.points)} pts</small></Link></React.Fragment> })}</div></div>
    <SpinCard />
    <Link to="/app/daily" className="daily-cta"><Icon name="sun" /><b style={{ flex: 1 }}>Daily Glow · {d.checkedInToday ? 'missions' : 'Collect 80 pts'}</b><Icon name="chevron" className="icon-sm" /></Link>
    <Link to="/app/leaderboard" className="app-card" style={{ display: 'block' }}><div className="row"><Icon name="bar-chart" className="copper" /><div style={{ flex: 1 }}><b className="small">Leaderboard</b><p className="tiny muted">You are #{lb.youIdx + 1} this week</p></div><Icon name="chevron" className="icon-sm muted" /></div><div className="row" style={{ marginTop: 10, gap: 4 }}>{lb.rows.slice(0, 3).map(r => <Avatar key={r.name} initials={r.initials} size={28} />)}<span className="tiny muted" style={{ marginLeft: 6 }}>See how you rank</span></div></Link>
    <div className="sub-head"><h2>Use Your Points</h2><Link to="/app/rewards/catalogue">All rewards →</Link></div>
    <AppCatalogueList tab="everyday" limit={3} />
  </div>
}

function AppCatalogueList({ tab, limit }: { tab: string; limit?: number }) {
  const { state, actions, d } = useStore()
  const list = REWARDS.filter(r => r.category === tab).slice(0, limit ?? 99)
  return <div>{list.map(r => { const saved = state.savedRewards.includes(r.id); return <div key={r.id} className="rcard-app"><Link to={`/app/rewards/${r.id}`}><img src={r.image} alt="" /></Link><Link to={`/app/rewards/${r.id}`}><b>{r.name}</b><p>{r.blurb}</p><div className="pts"><Icon name="sun" className="icon-sm" /> {r.points ? `${n(r.points)} pts` : 'Tier benefit'}</div>{r.hero && state.member && <div style={{ marginTop: 6 }}><Progress value={d.available} max={r.points} /><span className="tiny muted tnum">{n(d.available)} / {n(r.points)} pts</span></div>}</Link><button className={`save ${saved ? 'on' : ''}`} onClick={() => actions.saveReward(r.id)} aria-label="Save"><Icon name={saved ? 'heart-fill' : 'heart'} className="icon-sm" /></button></div> })}</div>
}
export function AppCatalogue() {
  const { state, d } = useStore(); const [tab, setTab] = useState('everyday'); const nav = useNavigate()
  return <div className="screen">
    <div className="screen-head"><button className="icon-btn" onClick={() => nav(-1)}><Icon name="chevron-left" /></button><h1 style={{ fontSize: 24 }}>Use Your Points</h1>{state.member ? <span className="pill pill-outline"><Icon name="sun" className="icon-sm copper" /> {n(d.available)} pts</span> : <span />}</div>
    <div className="h-scroll" style={{ marginBottom: 12 }}>{REWARD_TABS.map(t => <button key={t.key} className={`chip ${tab === t.key ? 'active' : ''}`} style={{ flex: 'none' }} onClick={() => setTab(t.key)}>{t.label}</button>)}</div>
    <AppCatalogueList tab={tab} />
  </div>
}
