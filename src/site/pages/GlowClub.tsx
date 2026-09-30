import React from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '@/components/Icon'
import { SectionHead, TierBadge, Progress, RewardCard } from '@/components/ui'
import { useStore } from '@/store/store'
import { TIERS, MILESTONES, MISSIONS, WEEKLY_CHALLENGES, LEADERBOARD_PURCHASE_CAP, DAILY_ENGAGEMENT_CAP, PILLARS, TAGLINES, REFERRAL_MILESTONES, RULEBOOK, POINT_VALUE_SGD } from '@/data/club'
import { REWARDS } from '@/data/rewards'
import { n } from '@/lib/format'
import { LeaderboardPanel } from './Community'
import { MissionList, WeeklyChallengeCard } from '@/app/pages/Daily'

export function GlowClub() {
  const { state, d, actions } = useStore()
  return <div className="container">
    <div className="page-hero"><p className="eyebrow">Glow Club</p><h1>{TAGLINES.club}</h1><p>Not just buying skincare from Lumiva. Being part of Lumiva. A visible identity, real progress, friends you bring along and rewards worth wanting.</p>
      <div className="pillars">{PILLARS.map(p => <div key={p.key} className="pillar"><span className="act-icon"><Icon name={p.icon} className="icon-sm" /></span><b>{p.label}</b><small>{p.objective}</small></div>)}</div>
      {!state.member && <div className="row" style={{ marginTop: 18 }}><Link to="/join" className="btn btn-primary btn-lg">Join Glow Club · 500 welcome points</Link><Link to="/sign-in" className="btn btn-secondary btn-lg">Sign in</Link></div>}</div>

    {state.member && <section className="glow" style={{ marginBottom: 56 }}>
      <div className="glow-panel">
        <p className="eyebrow" style={{ color: '#fff', opacity: .85 }}>Points wallet</p>
        <div className="glow-balance"><div><span className="lbl">Your balance</span><div className="num tnum">{n(d.balance)}</div><span style={{ fontSize: 13 }}>Glow Points{d.held > 0 && ` · ${n(d.held)} held pending approval`}</span></div><div style={{ textAlign: 'center' }}><TierBadge tier={d.tier} size={58} /><div style={{ fontSize: 12, marginTop: 6 }}>{d.tier.name}</div></div></div>
        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr 1fr', gap: 10, fontSize: 13 }}><div><b className="tnum" style={{ fontSize: 18 }}>{n(d.earned)}</b><br /><span style={{ opacity: .85 }}>Earned</span></div><div><b className="tnum" style={{ fontSize: 18 }}>{n(d.redeemed)}</b><br /><span style={{ opacity: .85 }}>Redeemed</span></div><div><b className="tnum" style={{ fontSize: 18 }}>{n(d.expiring)}</b><br /><span style={{ opacity: .85 }}>Expire in 90 days</span></div></div>
        {d.next && <div style={{ marginTop: 18 }}><div className="between small"><span>{n(d.next.need)} {d.next.unit} to {d.next.tier.short}</span><span className="tnum">{d.next.unit === 'points' ? `${n(d.lifetime)} / ${n(d.lifetime + d.next.need)}` : `${d.successfulReferrals} / ${d.successfulReferrals + d.next.need} friends`}</span></div><div className="progress" style={{ background: 'rgba(255,255,255,.25)' }}><span style={{ width: `${d.next.unit === 'points' ? (d.lifetime / (d.lifetime + d.next.need)) * 100 : (d.successfulReferrals / (d.successfulReferrals + d.next.need)) * 100}%`, background: '#fff' }} /></div></div>}
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
      <SectionHead eyebrow="Glow Levels" title="Four levels. One earned by sharing." blurb="Glow, Radiant and Luminous grow with lifetime points from spend and engagement. Glow Ambassador is earned through successful referrals, not money spent." />
      <div className="tier-grid">{TIERS.map(t => <div key={t.key} className={`tier-card ${d.tier.key === t.key && state.member ? 'current' : ''}`}>{d.tier.key === t.key && state.member && <span className="pill tier-tag">Your tier</span>}<TierBadge tier={t} size={48} /><p className="eyebrow" style={{ marginTop: 12 }}>{t.tagline}</p><h3 style={{ marginTop: 2 }}>{t.name}</h3><p className="small muted">{t.how} · {t.multiplier}x points</p>{t.key === 'ambassador' && <p className="small burgundy" style={{ marginTop: 4 }}><b>{TAGLINES.ambassador}</b></p>}<ul>{t.benefits.map(b => <li key={b}><Icon name="check" className="icon-sm" />{b}</li>)}</ul></div>)}</div>
    </section>

    <section className="section tight" id="missions">
      <SectionHead eyebrow="Daily and weekly engagement" title="Small actions create an ongoing routine" blurb="Challenges reward behaviour that helps you or the community. They never encourage unnecessary product use or excessive purchasing." />
      <div className="mission-grid">{MISSIONS.map(m => <div key={m.id} className="mission"><span className="act-icon"><Icon name={m.icon} className="icon-sm" /></span><div><b>{m.title}</b><p>{m.blurb}</p><span className="pill">+{state.admin.missionPoints[m.id] ?? m.points} pts · {m.cadence === 'daily' ? 'daily' : m.cadence === 'once' ? 'one time' : m.cadence === 'weekly' ? 'weekly' : 'per qualifying action'}</span></div></div>)}</div>
      <div className="two-col" style={{ marginTop: 20 }}>
        {WEEKLY_CHALLENGES.map(c => <WeeklyChallengeCard key={c.id} challenge={c} />)}
      </div>
      <div className="rule-box" style={{ marginTop: 20 }}><b>Streak and frequency controls</b>Daily tasks reset at midnight Singapore time and show exactly what counts. Missed days can use one streak protection per month instead of creating pressure. Engagement points are capped at {DAILY_ENGAGEMENT_CAP} per day and fraud controls prevent repeat actions from being exploited. Marketing messages remain optional and respect your communication preferences.</div>
    </section>

    <section className="section tight" id="refer">
      <SectionHead eyebrow="Refer & Glow" title={TAGLINES.refer} blurb="Your friend gets 15% off their first qualifying order. You receive 1,500 Glow Points once it qualifies, and the milestones stack up to Glow Ambassador." action={<Link to={state.member ? '/account/referrals' : '/join'} className="btn btn-burgundy btn-sm">{state.member ? 'Invite a friend' : 'Join to refer'}</Link>} />
      <div className="milestone-strip" style={{ gridTemplateColumns: 'repeat(6, 1fr)' }}>{REFERRAL_MILESTONES.map(ms => { const done = d.successfulReferrals >= ms.count; return <div key={ms.count} className={`ms ${done ? 'done' : ''}`} style={{ padding: 18 }}><span className="num tnum">{ms.count}</span><b>{ms.label}</b><small>{ms.reward}</small>{ms.tier && <span className="pill pill-burgundy tiny" style={{ marginTop: 8 }}><Icon name="crown" className="icon-sm" /> Tier</span>}{done && <span className="pill pill-success tiny" style={{ marginTop: 8 }}>Reached</span>}</div> })}</div>
      <div className="rule-box" style={{ marginTop: 20 }}><b>Conditional by design</b>Referral rewards are released only after the friend's first order completes its qualification period. States: Invited → Clicked → Registered → Purchased → Pending → Qualified → Rewarded. Self-referrals and duplicate accounts are blocked, and every reversal is audited.</div>
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
    <section className="section tight">
      <SectionHead eyebrow="Glow Club rulebook" title="The 15 decisions, locked" blurb={`Point value: 1,000 Glow Points = S$${(1000 * POINT_VALUE_SGD).toFixed(0)}. Everything below is configurable in the admin portal.`} />
      <div className="rulebook">{RULEBOOK.map(([k, v], i) => <div key={k}><span className="rb-n">{String(i + 1).padStart(2, '0')}</span><b>{k}</b><p className="small muted">{v}</p></div>)}</div>
    </section>
    <div style={{ height: 40 }} />
  </div>
}
