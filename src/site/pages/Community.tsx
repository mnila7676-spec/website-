import React, { useState } from 'react'
import { asset } from '@/lib/asset'
import { Link } from 'react-router-dom'
import { Icon } from '@/components/Icon'
import { Avatar } from '@/components/ui'
import { ActivityFeedList } from '@/components/Ticker'
import { useStore, leaderboard } from '@/store/store'
import { n } from '@/lib/format'
import { useLinks } from '@/lib/links'

export function LeaderboardPanel({ compact, dark }: { compact?: boolean; dark?: boolean }) {
  const { state } = useStore(); const [period, setPeriod] = useState<'weekly' | 'monthly' | 'allTime'>('weekly'); const L = useLinks()
  const lb = leaderboard(state, period); const top = lb.rows.slice(0, 3); const rest = lb.rows.slice(3, compact ? 8 : 15)
  const you = lb.youIdx >= 0 ? lb.rows[lb.youIdx] : null
  return <div className="panel">
    <div className="panel-head"><h3>{period === 'weekly' ? 'Weekly' : period === 'monthly' ? 'Monthly' : 'All-time'} Leaderboard</h3>{compact ? <Link to={L.leaderboard} className="link-arrow">View full leaderboard <Icon name="chevron" className="icon-sm" /></Link> : null}</div>
    <div className={`tabs ${dark ? 'burgundy' : ''}`} style={{ marginBottom: 10 }}>{(['weekly', 'monthly', 'allTime'] as const).map(p => <button key={p} className={period === p ? 'active' : ''} onClick={() => setPeriod(p)}>{p === 'allTime' ? 'All Time' : p[0].toUpperCase() + p.slice(1)}</button>)}</div>
    <p className="tiny muted text-center" style={{ marginBottom: 6 }}><Icon name="sparkle" className="icon-sm copper" /> Top 3 unlock a {period === 'weekly' ? '250' : '1,000'}-point bonus</p>
    <div className="podium">{[top[1], top[0], top[2]].filter(Boolean).map((r, i) => { const rank = i === 1 ? 1 : i === 0 ? 2 : 3; return <div key={r.name} className={`pod ${rank === 1 ? 'first' : rank === 2 ? 'second' : 'third'}`}>{rank === 1 && <Icon name="crown" className="crown" />}<div className="pod-ring">{r.initials}<span className="pod-rank">{rank}</span></div><b>{r.name}</b><small className="tnum">{n(r.points)} pts</small></div> })}</div>
    <ul className="lb-list">{rest.map((r, i) => <li key={r.name + i} className={r.you ? 'you' : ''}><span className="rank">{i + 4}</span><Avatar initials={r.initials} variant={r.you ? 'burgundy' : ''} /><span>{r.you ? 'You' : r.name}</span><span className="tnum">{n(r.points)} pts</span></li>)}
      {you && lb.youIdx >= (compact ? 8 : 15) && <li className="you"><span className="rank">{lb.youIdx + 1}</span><Avatar initials={you.initials} variant="burgundy" /><span>You · #{lb.youIdx + 1}</span><span className="tnum">{n(you.points)} pts</span></li>}</ul>
    {you && lb.gapToTop10 > 0 && <div className="lb-gap"><Icon name="bar-chart" className="icon-sm copper" /> <b>{n(lb.gapToTop10)} pts</b> to Top 10</div>}
    {!state.member && <p className="tiny muted text-center" style={{ marginTop: 10 }}><Link to={L.join} className="copper">Join Glow Club</Link> to appear on the leaderboard with your consent.</p>}
  </div>
}

export function Leaderboard() {
  return <div className="container">
    <div className="page-hero"><p className="eyebrow">Community</p><h1>Recognition turns progress into shared momentum</h1><p>Leaderboards score eligible engagement, not simply total spend. Purchase points are capped within calculations so consistency wins.</p></div>
    <div className="two-col"><LeaderboardPanel /><div className="stack">
      <div className="panel"><div className="panel-head"><h3>This month's prize</h3></div><div className="row" style={{ gap: 16 }}><img src={asset('/images/rewards/gift-box.jpg')} alt="" style={{ width: 96, height: 96, borderRadius: 12, objectFit: 'cover' }} /><div><b>Top 3 receive a 1,000-point bonus</b><p className="small muted">Plus a limited monthly achievement badge. Weekly top 3 receive 250 points every Monday.</p></div></div></div>
      <div className="panel"><div className="panel-head"><h3>How ranking works</h3></div><ul className="benefit-list"><li><Icon name="check-circle" className="icon-sm" />Weekly resets Monday 00:00 SGT. Monthly resets on the 1st.</li><li><Icon name="check-circle" className="icon-sm" />Purchase points count up to 1,000 per week. Engagement points count in full.</li><li><Icon name="check-circle" className="icon-sm" />All-time celebrates long-term members separately, so newer members are never excluded.</li><li><Icon name="check-circle" className="icon-sm" />Names show as first name and surname initial, or your approved nickname.</li></ul></div>
    </div></div>
    <div style={{ height: 60 }} />
  </div>
}

export function Activity() {
  return <div className="container">
    <div className="page-hero"><p className="eyebrow">Live member activity</p><h1>Real members, earning and redeeming right now</h1><p>Transparent social proof. Every announcement is verified and shown with the member's permission.</p></div>
    <div className="panel" style={{ maxWidth: 720 }}><ActivityFeedList /></div>
    <div style={{ height: 60 }} />
  </div>
}
