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
const TESTIMONIALS = [
  { name: 'Chloe L.', role: 'Luminous member · Singapore', title: 'Sculpting Serum', text: 'The Dual-Action Sculpting Serum changed my jawline in a month. The app keeps me honest with the routine, and the points paid for my facial.' },
  { name: 'Aisha R.', role: 'Radiant member · Kuala Lumpur', title: 'Barrier first', text: 'My skin stopped reacting to everything once I switched to the cleanser and the Firming Barrier Moisturizer. Calm within a week.' },
  { name: 'Sofia T.', role: 'Glow Ambassador', title: 'Refer & Glow', text: 'I have brought eight friends in. Not because of the points, because the system works. The points are a lovely bonus.' },
  { name: 'Mei Lin W.', role: 'Glow member · Singapore', title: 'Vitamin C Day Serum', text: 'A golden drop in the morning and my makeup sits better all day. No stinging, no pilling under sunscreen.' },
  { name: 'Hannah K.', role: 'Radiant member · Hong Kong', title: 'Night Cycle Set', text: 'Sculpt & Renew at night, firmer by morning. I did not expect the gold flakes to feel this light.' },
  { name: 'Priya N.', role: 'Luminous member · Bangkok', title: 'Fresh Shake Emulsion', text: 'Finally a daytime moisturiser that survives humidity. Shaking it is the best part of my morning.' },
  { name: 'Grace T.', role: 'Glow member · Singapore', title: 'Routine Builder', text: 'Five steps, twice a day, and the app reminds me. My cycle has never been this consistent.' },
  { name: 'Nadia S.', role: 'Radiant member · Tokyo', title: 'Niacinamide Essence', text: 'Pores look finer after a month. It made every serum after it work harder.' },
  { name: 'Jasmine O.', role: 'Glow member · Singapore', title: 'Glow Race', text: 'I call the marble race with my coffee every morning. Free, fun, and I have earned a facial from it.' },
]

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

    {/* Testimonials: three endless vertical columns */}
    <section className="t-testi-band"><div className="t-wide">
      <p className="eyebrow" style={{ color: '#9f9f9f', textAlign: 'center' }}>Trusted customer and member testimonials</p>
      <h2 className="t-title" style={{ color: '#fff', marginTop: 10 }}>What members say</h2>
      <div className="t-testi-cols" style={{ marginTop: 40 }}>
        {[0, 1, 2].map(col => { const items = TESTIMONIALS.filter((_, i) => i % 3 === col); return <div key={col} className={`t-testi-col ${col === 1 ? 'down' : 'up'}`}><div className="t-testi-track">{[...items, ...items].map((t, i) => <div key={i} className="t-testi-card"><div className="stars">{[1, 2, 3, 4, 5].map(k => <Icon key={k} name="star" />)}</div><b>{t.title}</b><p>“{t.text}”</p><small>{t.name} — {t.role}</small></div>)}</div></div> })}
      </div>
      <div className="t-center"><Link to="/product/vitamin-c-day-serum" className="t-link" style={{ color: '#fff' }}>See all reviews</Link></div>
    </div></section>

    {/* Philosophy */}
    <section className="t-section"><div className="t-wide t-philo">
      <div><p className="eyebrow" style={{ marginBottom: 14 }}>Our philosophy</p><p>When we create a formula, we make sure you can understand every ingredient in it. Seven products, two finishes, one cycle: cleanse, prep, treat, sculpt and hydrate. Simple enough to keep, serious enough to work, gentle enough for sensitive skin.</p></div>
      <div className="t-pillars">{[['Fewer ingredients, higher standards', 'Every ingredient earns its place and is listed on the product page.'], ['Barrier first', 'Ceramides, oat lipids and pH-balanced cleansing in every cycle.'], ['Clinic and home', 'What begins in clinic continues at home, tracked in the member app.'], ['Always improving', 'Formulas are revised with member feedback and verified reviews.']].map(([t, b]) => <div key={t}><b>{t}</b><small>{b}</small></div>)}</div>
    </div></section>
  </div>
}
