import React from 'react'
import { asset } from '@/lib/asset'
import { Link } from 'react-router-dom'
import { Icon } from '@/components/Icon'
import { ProductCard, RewardCard, SectionHead, TierBadge, Progress } from '@/components/ui'
import { ActivityFeedList } from '@/components/Ticker'
import { useStore, leaderboard } from '@/store/store'
import { PRODUCTS, BEST_SELLERS, STEPS } from '@/data/products'
import { REWARDS } from '@/data/rewards'
import { MILESTONES } from '@/data/club'
import { n } from '@/lib/format'
import { LeaderboardPanel } from './Community'

export function Home() {
  const { state, d } = useStore()
  const best = BEST_SELLERS.map(id => PRODUCTS.find(p => p.id === id)!)
  const featured = ['coffee', 'voucher-20', 'staycation', 'japan'].map(id => REWARDS.find(r => r.id === id)!)
  return <>
    <section className="hero"><div className="container hero-inner">
      <div className="hero-copy fade-up">
        <h1>Skincare that rewards your ritual.</h1>
        <p>Build your routine, earn Glow Points and unlock rewards made for real life.</p>
        <div className="row"><Link to="/shop" className="btn btn-primary btn-lg">Shop Skincare</Link><Link to="/glow-club" className="btn btn-secondary btn-lg">Explore Glow Club</Link></div>
      </div>
      <div className="hero-img">
        <picture><source media="(max-width: 720px)" srcSet={asset('/images/hero-mobile.jpg')} /><img src={asset('/images/hero.jpg')} alt="The Lumiva ritual: cleanser, serum, cream and SPF" {...({ fetchpriority: 'high' } as any)} /></picture>
        {state.member ? <div className="hero-chip" style={{ left: 24, bottom: 28 }}><TierBadge tier={d.tier} size={40} /><div><b>{n(d.balance)} Glow Points</b><span className="muted">{d.tier.name} · {d.nextMilestone ? `${n(d.nextMilestone.points - d.lifetime)} to ${d.nextMilestone.name}` : 'All milestones reached'}</span></div></div>
          : <div className="hero-chip" style={{ left: 24, bottom: 28 }}><span className="act-icon"><Icon name="gift" className="icon-sm" /></span><div><b>New member 1-for-1</b><span className="muted">Join free, 500 welcome points</span></div></div>}
      </div>
    </div></section>

    <div className="value-bar"><div className="container">
      {[['leaf', 'Thoughtfully Formulated'], ['bottle', 'Routine-Led Skincare'], ['sun', 'Rewards With Real Value'], ['truck', 'Complimentary Delivery Over S$80']].map(([i, t]) => <div key={t} className="value-item"><Icon name={i} className="copper" />{t}</div>)}
    </div></div>

    <section className="section"><div className="container">
      <SectionHead title="Best Sellers" action={<Link to="/shop" className="link-arrow">View all <Icon name="chevron" className="icon-sm" /></Link>} />
      <div className="pgrid">{best.map(p => <ProductCard key={p.id} product={p} />)}</div>
    </div></section>

    <section className="section tight"><div className="container">
      <div className="ritual">
        <div className="ritual-img"><img src={asset('/images/hero-group.jpg')} alt="The Lumiva ritual set" loading="lazy" /></div>
        <div className="ritual-copy">
          <p className="eyebrow">The Ritual</p>
          <h2>A routine designed to work together</h2>
          <p className="muted">Simple steps. Powerful results. Better together.</p>
          <div className="steps">{STEPS.map(s => <div key={s.key} className="step"><Icon name={s.key === 'cleanse' ? 'droplet' : s.key === 'treat' ? 'bottle' : s.key === 'hydrate' ? 'jar' : 'sun'} /><span className="num">{s.num}</span><b>{s.label}</b><small>{s.blurb}</small></div>)}</div>
          <Link to="/ritual" className="btn btn-primary">Build My Routine</Link>
        </div>
      </div>
    </div></section>

    <section className="section"><div className="container">
      <div className="glow">
        <div className="glow-panel">
          <p className="eyebrow" style={{ color: '#fff', opacity: .85 }}>Glow Club</p>
          <h2>Your routine goes further</h2>
          <p style={{ opacity: .9 }}>Earn Glow Points every time you shop, then redeem rewards that make life a little brighter.</p>
          <div className="glow-balance"><div><span className="lbl">{state.member ? 'Your balance' : 'Welcome balance'}</span><div className="num tnum">{n(state.member ? d.balance : 500)}</div><span style={{ fontSize: 13 }}>Glow Points</span></div><div style={{ textAlign: 'center' }}><TierBadge tier={d.tier} size={58} /><div style={{ fontSize: 12, marginTop: 6 }}>{d.tier.name}</div></div></div>
          <div className="glow-steps">
            <div><b><Icon name="bag" className="icon-sm" /> Shop</b><small>Choose your favourites</small></div>
            <div><b><Icon name="sun" className="icon-sm" /> Earn</b><small>Collect points with every action</small></div>
            <div><b><Icon name="gift" className="icon-sm" /> Redeem</b><small>Unlock rewards you'll love</small></div>
          </div>
          <div className="row">{state.member ? <Link to="/glow-club" className="btn btn-light">View my Glow Club</Link> : <><Link to="/join" className="btn btn-light">Join Glow Club</Link><Link to="/sign-in" style={{ fontSize: 13 }}>Already a member? Sign in</Link></>}</div>
        </div>
        <div className="journey">
          <h3>Your Glow Journey</h3>
          <div className="journey-track">{MILESTONES.map(m => { const done = d.lifetime >= m.points; const cur = d.nextMilestone?.points === m.points; return <div key={m.points} className={`jnode ${done ? 'done' : cur ? 'current' : 'locked'}`}><img src={m.image} alt="" /><b>{m.name}</b><small>{n(m.points)} pts</small><span className="jstate">{done ? 'Achieved' : cur ? 'Next' : 'Locked'}</span></div> })}</div>
          {state.member ? <div style={{ marginTop: 18 }}><Progress value={d.lifetime} max={d.nextMilestone?.points ?? 50000} /><div className="between" style={{ marginTop: 8 }}><span className="you-here"><i /> You are here · {n(d.lifetime)} lifetime pts</span><span className="tiny muted">{d.nextMilestone ? `${n(d.nextMilestone.points - d.lifetime)} to ${d.nextMilestone.name}` : 'Journey complete'}</span></div></div>
            : <span className="you-here"><i /> Join to start your journey with 500 points</span>}
        </div>
      </div>
    </div></section>

    <section className="section tight"><div className="container">
      <SectionHead title="Real rewards. Real life." action={<Link to="/rewards" className="link-arrow">Explore all rewards <Icon name="chevron" className="icon-sm" /></Link>} />
      <div className="rgrid">{featured.map(r => <RewardCard key={r.id} reward={{ ...r, hero: false }} />)}</div>
    </div></section>

    <section className="section"><div className="container two-col">
      <LeaderboardPanel compact />
      <div className="panel"><div className="panel-head"><h3>Member Activity</h3><Link to="/activity" className="link-arrow">View all activity <Icon name="chevron" className="icon-sm" /></Link></div><ActivityFeedList limit={6} /><p className="tiny muted" style={{ marginTop: 12 }}>Activity shown with member permission.</p></div>
    </div></section>
  </>
}
