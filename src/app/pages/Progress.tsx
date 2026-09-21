import React from 'react'
import { asset } from '@/lib/asset'
import { Link, useNavigate } from 'react-router-dom'
import { Icon } from '@/components/Icon'
import { ActivityFeedList } from '@/components/Ticker'
import { useStore } from '@/store/store'
import { MILESTONES, ACHIEVEMENTS } from '@/data/club'
import { LeaderboardPanel } from '@/site/pages/Community'
import { n, fmtDate } from '@/lib/format'

const Head = ({ title, right }: { title: string; right?: React.ReactNode }) => { const nav = useNavigate(); return <div className="screen-head"><button className="icon-btn" onClick={() => nav(-1)}><Icon name="chevron-left" /></button><h1 style={{ fontSize: 26 }}>{title}</h1>{right ?? <span style={{ width: 38 }} />}</div> }

export function AppJourney() {
  const { state, d } = useStore()
  return <div className="screen">
    <Head title="Your Journey" right={<Icon name="info" className="muted" />} />
    <p className="small muted" style={{ marginBottom: 6 }}>Your progress. Your rewards. {state.member ? `${n(d.lifetime)} lifetime points.` : 'Join to begin.'}</p>
    <div className="timeline">{MILESTONES.map(m => { const done = d.lifetime >= m.points; const cur = d.nextMilestone?.points === m.points; const ts = Object.entries(state.achievements).find(([id]) => ({ 2500: 'first-glow', 5000: 'glow-getter', 10000: 'spa-retreat', 20000: 'weekend-ready', 50000: 'japan-bound' } as any)[m.points] === id)?.[1]
      return <div key={m.points} className={`tl-item ${done ? 'done' : cur ? 'current' : ''}`}><span className="tl-dot">{done ? <Icon name="check" /> : cur ? 'L' : <span style={{ width: 10, height: 10, borderRadius: 5, background: 'var(--line-2)' }} />}</span><div className="num tnum">{n(m.points)}</div><b>{m.name}</b><small>{done ? `Achieved${ts ? ' on ' + fmtDate(ts) : ''}` : cur ? `Current milestone · ${n(m.points - d.lifetime)} to go` : m.blurb}</small>{cur && <div style={{ marginTop: 8 }}><Link to={`/app/rewards/${m.rewardId}`} className="pill pill-gold tiny">{m.reward}</Link></div>}</div> })}</div>
  </div>
}

export function AppAchievements() {
  const { state } = useStore(); const unlocked = Object.keys(state.achievements).length
  const latest = Object.entries(state.achievements).sort((a, b) => b[1].localeCompare(a[1]))[0]
  const la = latest ? ACHIEVEMENTS.find(a => a.id === latest[0]) : null
  return <div className="screen">
    <Head title="Achievements" />
    <p className="small muted text-center" style={{ marginBottom: 16 }}>{unlocked} of {ACHIEVEMENTS.length} unlocked</p>
    <div className="badge-grid">{[...ACHIEVEMENTS].sort((a, b) => (state.achievements[b.id] ? 1 : 0) - (state.achievements[a.id] ? 1 : 0)).map(a => { const on = !!state.achievements[a.id]; return <div key={a.id} className={`badge ${on ? (a.id === la?.id ? 'burgundy' : '') : 'locked'}`}><span className="ring"><Icon name={a.icon} className="icon-lg" /></span><b>{on ? a.name : a.category === 'milestone' ? a.name : 'Locked'}</b><small>{on ? 'Unlocked' : a.blurb}</small></div> })}</div>
    {la && <div className="latest-badge"><span className="ring"><Icon name={la.icon} /></span><div><small>Latest badge</small><b>{la.name}</b><span className="tiny">unlocked {fmtDate(latest![1])}</span></div></div>}
  </div>
}

export function AppLeaderboard() {
  return <div className="screen"><Head title="Leaderboard" /><div className="lb-app"><LeaderboardPanel dark /></div><div className="app-card" style={{ marginTop: 12 }}><div className="row"><img src={asset('/images/rewards/gift-box.jpg')} alt="" style={{ width: 72, height: 72, borderRadius: 12, objectFit: 'cover' }} /><div><small className="tiny muted">This Month's Prize</small><div className="serif" style={{ fontSize: 20, lineHeight: 1.1 }}>Top 3 receive a 1,000-point bonus</div></div></div></div><p className="tiny muted">Ranked by eligible engagement. Purchase points count up to 1,000 per week. Names shown with consent.</p></div>
}

export function AppActivity() {
  return <div className="screen"><Head title="Member wins" /><p className="small muted" style={{ marginBottom: 10 }}>Verified, permissioned announcements from real members.</p><div className="app-card"><ActivityFeedList /></div></div>
}
