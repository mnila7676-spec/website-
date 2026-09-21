import React from 'react'
import { asset } from '@/lib/asset'
import { Link } from 'react-router-dom'
import { Icon } from '@/components/Icon'
import { ProductCard, TierBadge, Progress } from '@/components/ui'
import { ActivityCard } from '@/components/Ticker'
import { useStore } from '@/store/store'
import { PRODUCTS, BEST_SELLERS, STEPS, productById } from '@/data/products'
import { greeting, n } from '@/lib/format'
import { TodaySection } from './Today'

export function AppHome() {
  const { state, d, actions } = useStore(); const m = state.member
  const best = BEST_SELLERS.map(id => PRODUCTS.find(p => p.id === id)!)
  const rec = m?.skinProfile ? PRODUCTS.filter(p => p.concerns.some(c => m.skinProfile!.concerns.includes(c)) && p.category !== 'minis').slice(0, 4) : best
  const todayLog = state.routineLog[new Date().toISOString().slice(0, 10)] ?? {}
  const serumOrder = state.orders.find(o => o.items.some(i => i.productId === 'serum' || productById(i.productId)?.includes?.includes('serum')))
  const daysLeft = serumOrder ? Math.max(0, 45 - Math.round((Date.now() - new Date(serumOrder.ts).getTime()) / 864e5)) : null
  return <div className="screen">
    <div className="hello"><div><b>{m ? `${greeting()}, ${m.firstName} 👋` : 'Hello 👋'}</b><small>{m ? (d.checkedInToday ? `Day ${d.streak} streak · keep glowing` : 'Your glow starts here') : 'Your glow starts here'}</small></div><span className="app-logo">LUMIVA</span><Link to="/app/notifications" className="icon-btn" aria-label="Notifications"><Icon name="bell" /></Link></div>
    <div className="app-search"><Link to="/app/shop" className="input" style={{ color: 'var(--taupe-2)', display: 'flex', alignItems: 'center', gap: 8 }}><Icon name="search" className="icon-sm" /> Search Lumiva</Link><Link to="/app/rewards" className="pill pill-outline"><Icon name="sun" className="icon-sm copper" /> {m ? `${n(d.balance)} pts` : 'Join'}</Link></div>
    {m && <ActivityCard />}
    {m ? <div className="glow-card" style={{ marginTop: 12 }}>
      <div className="between"><div><span className="lbl">Your balance</span><div className="num tnum">{n(d.balance)}</div><span style={{ fontSize: 12 }}>Glow Points</span></div><div style={{ textAlign: 'center' }}><TierBadge tier={d.tier} size={50} /><div style={{ fontSize: 11, marginTop: 4 }}>{d.tier.name}</div></div></div>
      {d.next ? <><div className="progress"><span style={{ width: `${(d.lifetime / d.next.min) * 100}%` }} /></div><div className="between" style={{ fontSize: 11.5 }}><span>{n(d.next.min - d.lifetime)} points to {d.next.short}</span><span className="tnum">{n(d.lifetime)} / {n(d.next.min)}</span></div></> : <p style={{ fontSize: 12 }}>Top tier reached. Thank you for glowing with us.</p>}
      <div className="quick-4" style={{ margin: '14px 0 0' }}>{[['/app/daily', 'Earn Points', 'sun'], ['/app/rewards/catalogue', 'Redeem', 'gift'], ['/app/profile', 'My Rewards', 'wallet'], ['/app/profile', 'Member Perks', 'medal']].map(([to, l, i]) => <Link key={l} to={to} style={{ color: '#fff' }}><span style={{ background: 'rgba(255,255,255,.18)', border: 0, color: '#fff' }}><Icon name={i} className="icon-sm" /></span>{l}</Link>)}</div>
    </div> : <div className="banner copper"><div className="banner-copy"><h2>Join Glow Club</h2><p>500 welcome points, 1-for-1 on your first order and rewards made for real life.</p><Link to="/app/join" className="btn btn-light btn-sm">Join free</Link></div><img src={asset('/images/hero-group.jpg')} alt="" style={{ opacity: .9 }} /></div>}
    <TodaySection />
    {m && d.nextMilestone && <div className="app-card"><span className="tiny muted">Next milestone</span><div className="row" style={{ marginTop: 8 }}><img src={d.nextMilestone.image} alt="" style={{ width: 84, height: 84, borderRadius: 12, objectFit: 'cover' }} /><div style={{ flex: 1 }}><b className="small">{n(d.nextMilestone.points)} Points</b><div className="serif" style={{ fontSize: 22 }}>{d.nextMilestone.name}</div><p className="tiny muted">{n(d.nextMilestone.points - d.lifetime)} to go. You're on your way!</p><Link to="/app/journey" className="btn btn-sm btn-light" style={{ marginTop: 6 }}>See Journey <Icon name="chevron" className="icon-sm" /></Link></div></div><div style={{ marginTop: 10 }}><Progress value={d.lifetime} max={d.nextMilestone.points} /></div></div>}
    <div className="banner"><div className="banner-copy"><h2>The Lumiva Ritual</h2><p>Premium skincare. Thoughtfully made. Visibly radiant.</p><Link to="/app/product/the-lumiva-ritual-set" className="btn btn-primary btn-sm">Shop Collection</Link></div><img src={asset('/images/hero.jpg')} alt="" /></div>
    <div className="cat-row">{STEPS.map(s => <Link key={s.key} to={`/app/shop?step=${s.key}`}><span><Icon name={s.key === 'cleanse' ? 'droplet' : s.key === 'treat' ? 'bottle' : s.key === 'hydrate' ? 'jar' : 'sun'} /></span>{s.label}</Link>)}</div>
    <div className="sub-head"><h2>{m?.skinProfile ? 'Recommended for you' : 'Best Sellers'}</h2><Link to="/app/shop">View All →</Link></div>
    <div className="h-scroll">{rec.map(p => <ProductCard key={p.id} product={p} compact />)}</div>
    {daysLeft !== null && <div className="reminder" style={{ marginTop: 14 }}><Icon name="bell" /><div style={{ flex: 1 }}><b className="small">{daysLeft > 0 ? `Serum may run low in ${daysLeft} days` : 'Time to reorder your serum'}</b><p className="tiny muted">We'll remind you to reorder. Manage in settings.</p></div><button className="btn btn-sm btn-primary" onClick={() => actions.addToCart('serum')}>Reorder</button></div>}
    <div className="banner copper" style={{ marginTop: 14 }}><div className="banner-copy"><small style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase' }}>Complete Your Ritual</small><h2>Save 15%</h2><p>When you add 2 or more products.</p><Link to="/app/routine" className="btn btn-light btn-sm">Shop Now</Link></div><img src={asset('/images/hero-group.jpg')} alt="" style={{ mixBlendMode: 'multiply', opacity: .9 }} /></div>
  </div>
}
