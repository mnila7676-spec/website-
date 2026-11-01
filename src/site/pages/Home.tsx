import React from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '@/components/Icon'
import { ProductCard } from '@/components/ui'
import { useStore } from '@/store/store'
import { PRODUCTS, productById, money, RITUALS } from '@/data/products'
import { TAGLINES } from '@/data/club'
import { REVIEWS } from '@/data/community'
import { asset } from '@/lib/asset'

const L = (f: string) => asset(`/images/lifestyle/${f}.jpg`)

export function Home() {
  const { state, d } = useStore()
  const best = ['sculpt-serum', 'serum', 'cream'].map(id => productById(id)!)
  const fresh = ['renew-serum', 'emulsion', 'essence', 'cleanser'].map(id => productById(id)!)
  const routines = PRODUCTS.filter(p => p.category === 'sets')
  const review = REVIEWS.serum[0]
  return <div className="t-home">
    {/* Hero */}
    <section className="t-hero dark">
      <img src={L('satin-15')} alt="Kessora Dual-Action Sculpting Serum" fetchPriority="high" />
      <div className="t-hero-copy"><p className="eyebrow">New: the Night Cycle</p><h1>Sculpt, firm and renew while you sleep.</h1><p>Sculpt & Renew Serum with gold-suspended actives and the Firming Barrier Moisturizer.</p><Link to="/product/the-night-cycle-set" className="t-link">Discover now</Link></div>
    </section>

    {/* Statement */}
    <section className="t-statement"><p className="eyebrow">Our formulations are</p><h2><span>Barrier-first,</span><span>fragrance-free,</span><span>made in Singapore</span></h2></section>

    {/* Best sellers */}
    <section className="t-section tight"><div className="t-wide">
      <h2 className="t-title">Best<br />sellers</h2>
      <div className="pgrid three" style={{ marginTop: 34 }}>{best.map(p => <ProductCard key={p.id} product={{ ...p, badge: 'Best-seller' }} />)}</div>
      <div className="t-center"><Link to="/shop?sort=best" className="t-link">View more</Link></div>
    </div></section>

    {/* Feature: night set */}
    <section className="t-feature">
      <img src={L('satin-14')} alt="Sculpt & Renew Serum" />
      <div className="copy"><p className="eyebrow">The Night Cycle Set</p><h2>Four steps. One night.</h2><p>Gentle Barrier Cleanser, Niacinamide Activating Essence, Sculpt & Renew Serum and Firming Barrier Moisturizer. Save 15% on the set.</p><Link to="/product/the-night-cycle-set" className="t-link">Discover now</Link></div>
    </section>

    {/* Routines */}
    <section className="t-section"><div className="t-wide">
      <h2 className="t-title">Skin cycle routines</h2>
      <div className="t-carousel" style={{ marginTop: 34 }}>
        {routines.map(p => <Link key={p.id} to={`/product/${p.slug}`} className="t-routine"><img src={p.image} alt={p.name} /><b>{p.name}</b><small>{p.includes?.length} products — {money(p.price)}</small></Link>)}
        {RITUALS.map(r => <Link key={r.key} to={`/shop?time=${r.key}`} className="t-routine"><img src={L(r.key === 'day' ? 'satin-19' : 'satin-06')} alt={r.title} /><b>{r.title}</b><small>{r.ids.length} steps — build it in the app</small></Link>)}
      </div>
      <div className="t-center"><Link to="/ritual" className="t-link">View all routines</Link></div>
    </div></section>

    {/* Diagnostic */}
    <section className="t-banner"><img src={asset('/images/kessora/before-after.jpg')} alt="" /><div className="copy"><p className="eyebrow">Kessora skin diagnostic</p><h2>Understand your skin<br />and its complex needs.</h2><Link to="/skin-solutions" className="btn btn-outline">Begin diagnostic test</Link></div></section>

    {/* New arrivals */}
    <section className="t-section"><div className="t-wide">
      <h2 className="t-title">New arrivals</h2>
      <div className="pgrid four" style={{ marginTop: 34 }}>{fresh.map(p => <ProductCard key={p.id} product={p} />)}</div>
      <div className="t-center"><Link to="/shop" className="t-link">View more</Link></div>
    </div></section>

    {/* Glow Club */}
    <section className="t-section"><div className="t-wide t-club">
      <div>
        <p className="eyebrow">Glow Club membership</p>
        <h2>{TAGLINES.club}</h2>
        <ul>
          {[['01', '500 welcome Glow Points and 1-for-1 on your first eligible order'], ['02', 'Earn on orders, routines, learning, reviews and referrals'], ['03', 'Four levels: Glow, Radiant, Luminous and Glow Ambassador'], ['04', 'Rewards from coffee to a Japan experience, with a daily cap and full terms']].map(([n, t]) => <li key={n}><span>{n}</span>{t}</li>)}
        </ul>
        <div className="row" style={{ marginTop: 22 }}>{state.member ? <Link to="/glow-club" className="btn btn-primary">My Glow Club · {d.tier.short}</Link> : <Link to="/join" className="btn btn-primary">Join Glow Club</Link>}<Link to="/app" className="t-link">Open the member app</Link></div>
      </div>
      <img src={L('satin-17')} alt="Kessora Glow Club" />
    </div></section>

    {/* Reviews */}
    <section className="t-section alt"><div className="t-wide t-reviews">
      <div className="big">4.8 out of 5 stars</div>
      <p className="sub">From over 1,200 verified reviews</p>
      <blockquote>“{review.text}”</blockquote>
      <p className="who">{review.name} — Verified purchase</p>
      <p className="about">About Vitamin C Day Serum</p>
      <Link to="/product/vitamin-c-day-serum" className="t-link">See all reviews</Link>
    </div></section>

    {/* Philosophy */}
    <section className="t-section"><div className="t-wide t-philo">
      <div><p className="eyebrow" style={{ marginBottom: 14 }}>Our philosophy</p><p>When we create a formula, we make sure you can understand every ingredient in it. Seven products, two finishes, one cycle: cleanse, prep, treat, sculpt and hydrate. Simple enough to keep, serious enough to work, gentle enough for sensitive skin.</p></div>
      <div className="t-pillars">{[['Fewer ingredients, higher standards', 'Every ingredient earns its place and is listed on the product page.'], ['Barrier first', 'Ceramides, oat lipids and pH-balanced cleansing in every cycle.'], ['Clinic and home', 'What begins in clinic continues at home, tracked in the member app.'], ['Always improving', 'Formulas are revised with member feedback and verified reviews.']].map(([t, b]) => <div key={t}><b>{t}</b><small>{b}</small></div>)}</div>
    </div></section>
  </div>
}
