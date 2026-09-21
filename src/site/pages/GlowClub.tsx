import React from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '@/components/Icon'
import { SectionHead, TierBadge, Progress, RewardCard } from '@/components/ui'
import { useStore } from '@/store/store'
import { TIERS, MILESTONES, MISSIONS, WEEKLY_CHALLENGES, LEADERBOARD_PURCHASE_CAP, DAILY_ENGAGEMENT_CAP } from '@/data/club'
import { REWARDS } from '@/data/rewards'
import { n } from '@/lib/format'
import { LeaderboardPanel } from './Community'
import { MissionList, WeeklyChallengeCard } from '@/app/pages/Daily'

export function GlowClub() {
  const { state, d, actions } = useStore()
  return <div className="container">
    <div className="page-hero"><p className="eyebrow">Glow Club</p><h1>The membership becomes the product around the products</h1><p>A visible identity, real progress and rewards worth wanting. Free to join, calm by design.</p>
      {!state.member && <div className="row" style={{ marginTop: 18 }}><Link to="/join" className="btn btn-primary btn-lg">Join Glow Club · 500 welcome points</Link><Link to="/sign-in" className="btn btn-secondary btn-lg">Sign in</Link></div>}</div>

    {state.member && <section className="glow" style={{ marginBottom: 56 }}>
      <div className="glow-panel">
        <p className="eyebrow" style={{ color: '#fff', opacity: .85 }}>Points wallet</p>
        <div className="glow-balance"><div><span className="lbl">Your balance</span><div className="num tnum">{n(d.balance)}</div><span style={{ fontSize: 13 }}>Glow Points{d.held > 0 && ` · ${n(d.held)} held pending approval`}</span></div><div style={{ textAlign: 'center' }}><TierBadge tier={d.tier} size={58} /><div style={{ fontSize: 12, marginTop: 6 }}>{d.tier.name}</div></div></div>
        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr 1fr', gap: 10, fontSize: 13 }}><div><b className="tnum" style={{ fontSize: 18 }}>{n(d.earned)}</b><br /><span style={{ opacity: .85 }}>Earned</span></div><div><b className="tnum" style={{ fontSize: 18 }}>{n(d.redeemed)}</b><br /><span style={{ opacity: .85 }}>Redeemed</span></div><div><b className="tnum" style={{ fontSize: 18 }}>{n(d.expiring)}</b><br /><span style={{ opacity: .85 }}>Expire in 90 days</span></div></div>
        {d.next && <div style={{ marginTop: 18 }}><div className="between small"><span>{n(d.next.min - d.lifetime)} points to {d.next.short}</span><span className="tnum">{n(d.lifetime)} / {n(d.next.min)}</span></div><div className="progress" style={{ background: 'rgba(255,255,255,.25)' }}><span style={{ width: `${(d.lifetime / d.next.min) * 100}%`, background: '#fff' }} /></div></div>}
        <div className="row" style={{ marginTop: 18 }}><Link to="/rewards" className="btn btn-light">Reward marketplace</Link><Link to="/account/points" style={{ fontSize: 13 }}>Point history</Link></div>
      </div>
      <div className="journey">
        <div className="between" style={{ marginBottom: 16 }}><h3 style={{ margin: 0 }}>Today</h3><span className="pill pill-outline"><Icon name="flame" className="icon-sm copper" /> {d.streak}-day streak</span></div>
        <MissionList />
      </div>
    </section>}

    <section className="section tight" style={{ paddingTop: 0 }}>
      <SectionHead eyebrow="Milestone journey" title="Visible checkpoints" blurb="Every lifetime point counts toward the next checkpoint. Milestone rewards unlock automatically." />
      <div className="milestone-strip">{MILESTONES.map(m => { const done = d.lifetime >= m.points; const cur = d.nextMilestone?.points === m.points; return <div key={m.points} className={`ms ${done ? 'done' : cur ? '' : 'locked'}`}><img src={m.image} alt="" /><span className="num tnum">{n(m.points)}</span><b>{m.name}</b><small>{m.reward}</small>{done ? <span className="pill pill-success tiny" style={{ marginTop: 8 }}>Achieved</span> : cur ? <span className="pill tiny" style={{ marginTop: 8 }}>{n(m.points - d.lifetime)} to go</span> : <span className="pill pill-muted tiny" style={{ marginTop: 8 }}>Locked</span>}</div> })}</div>
      {state.member && d.nextMilestone && <div style={{ marginTop: 16 }}><Progress value={d.lifetime} max={d.nextMilestone.points} /></div>}
    </section>

    <section className="section tight">
      <SectionHead eyebrow="Membership tiers" title="Rewards that improve as commitment grows" blurb="Tiers are based on lifetime points earned. Benefits are applied automatically." />
      <div className="tier-grid">{TIERS.map(t => <div key={t.key} className={`tier-card ${d.tier.key === t.key && state.member ? 'current' : ''}`}>{d.tier.key === t.key && state.member && <span className="pill tier-tag">Your tier</span>}<TierBadge tier={t} size={48} /><h3>{t.name}</h3><p className="small muted">{t.min ? `From ${n(t.min)} lifetime points` : 'From your first day'} · {t.multiplier}x points</p><ul>{t.benefits.map(b => <li key={b}><Icon name="check" className="icon-sm" />{b}</li>)}</ul></div>)}</div>
    </section>

    <section className="section tight" id="missions">
      <SectionHead eyebrow="Daily and weekly engagement" title="Small actions create an ongoing routine" blurb="Challenges reward behaviour that helps you or the community. They never encourage unnecessary product use or excessive purchasing." />
      <div className="mission-grid">{MISSIONS.map(m => <div key={m.id} className="mission"><span className="act-icon"><Icon name={m.icon} className="icon-sm" /></span><div><b>{m.title}</b><p>{m.blurb}</p><span className="pill">+{state.admin.missionPoints[m.id] ?? m.points} pts · {m.cadence === 'daily' ? 'daily' : m.cadence === 'once' ? 'one time' : m.cadence === 'weekly' ? 'weekly' : 'per qualifying action'}</span></div></div>)}</div>
      <div className="two-col" style={{ marginTop: 20 }}>
        {WEEKLY_CHALLENGES.map(c => <WeeklyChallengeCard key={c.id} challenge={c} />)}
      </div>
      <div className="rule-box" style={{ marginTop: 20 }}><b>Streak and frequency controls</b>Daily tasks reset at midnight Singapore time and show exactly what counts. Missed days can use one streak protection per month instead of creating pressure. Engagement points are capped at {DAILY_ENGAGEMENT_CAP} per day and fraud controls prevent repeat actions from being exploited. Marketing messages remain optional and respect your communication preferences.</div>
    </section>

    <section className="section tight">
      <SectionHead eyebrow="Reward marketplace" title="Real, desirable rewards" action={<Link to="/rewards" className="link-arrow">Explore all rewards <Icon name="chevron" className="icon-sm" /></Link>} />
      <div className="rgrid">{['coffee', 'ritual-set', 'facial', 'japan'].map(id => <RewardCard key={id} reward={{ ...REWARDS.find(r => r.id === id)!, hero: false }} />)}</div>
    </section>

    <section className="section tight two-col">
      <LeaderboardPanel compact />
      <div className="panel"><div className="panel-head"><h3>Fairness and privacy</h3></div>
        <ul className="benefit-list">
          <li><Icon name="check-circle" className="icon-sm" />Leaderboards score eligible engagement, not total spend. Purchase points count up to {n(LEADERBOARD_PURCHASE_CAP)} per week.</li>
          <li><Icon name="check-circle" className="icon-sm" />Weekly cycles reset every Monday with achievable bonuses. Monthly recognises sustained participation.</li>
          <li><Icon name="check-circle" className="icon-sm" />Only first name and surname initial, or an approved nickname, appear, and only with your consent.</li>
          <li><Icon name="check-circle" className="icon-sm" />Public activity announcements are verified and permissioned. You can switch them off any time.</li>
        </ul>
        <div className="row" style={{ marginTop: 16 }}><Link to="/leaderboard" className="btn btn-secondary btn-sm">Full leaderboard</Link><Link to="/app" className="btn btn-primary btn-sm">Open the member app</Link></div>
      </div>
    </section>
    <div style={{ height: 40 }} />
  </div>
}
