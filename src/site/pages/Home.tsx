import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '@/components/Icon'
import { ProductCard, TierBadge } from '@/components/ui'
import { useStore } from '@/store/store'
import { PRODUCTS, STEPS, productById } from '@/data/products'
import { LESSONS, TAGLINES, PILLARS } from '@/data/club'
import { asset } from '@/lib/asset'
import { n } from '@/lib/format'

const L = (f: string) => asset(`/images/lifestyle/${f}.jpg`)
const CYCLE = [
  { k: 'Diagnose', t: 'Skin profile, concerns and goals. In clinic or in the app.' },
  { k: 'Treat', t: 'Brighten by day, renew by night, sculpt in both.' },
  { k: 'Support', t: 'A guided routine, reminders and Glow Club missions.' },
  { k: 'Renew', t: 'Firm, repair and progress, cycle after cycle.' },
]
const TESTIMONIALS = [
  { name: 'Chloe L.', role: 'Luminous member · Singapore', text: 'The Dual-Action Sculpting Serum changed my jawline in a month. The app keeps me honest with the routine, and the points paid for my facial.' },
  { name: 'Aisha R.', role: 'Radiant member · Kuala Lumpur', text: 'Barrier first, always. My skin stopped reacting to everything once I switched to the cleanser and the night moisturizer.' },
  { name: 'Sofia T.', role: 'Glow Ambassador', text: 'I have brought eight friends in. Not because of the points, because the system works. The points are a lovely bonus.' },
]
const FAQ = [
  ['What is the Kessora skin cycle?', 'Five steps, twice a day: cleanse, prep, treat, sculpt and hydrate. Day products brighten and protect, night products renew and firm. Glow Club keeps you on track between visits.'],
  ['Do I need the whole system?', 'No. Start with the cleanser and the Dual-Action Sculpting Serum. The Routine Builder shows what to add next, and sets save 15%.'],
  ['How does Glow Club work?', 'Free to join. Earn Glow Points on orders, routines, learning, reviews and referrals. Progress through Glow, Radiant, Luminous and Glow Ambassador, and redeem rewards from coffee to a Japan trip.'],
  ['Is Kessora suitable for sensitive skin?', 'Every formula is fragrance-free and barrier-led. Start with the cleanser, essence and Firming Barrier Moisturizer, then add actives slowly.'],
  ['Where can I visit a clinic?', 'Our flagship is at Duxton Hill, Singapore, with partner clinics in Kuala Lumpur, Bangkok, Hong Kong and Tokyo. Book a diagnosis in the app.'],
]

export function Home() {
  const { state, d } = useStore(); const [ba, setBa] = useState(0); const [faq, setFaq] = useState(0)
  const whatsNew = ['sculpt-serum', 'renew-serum', 'emulsion'].map(id => productById(id)!)
  return <div className="k-home">
    {/* 1. Hero */}
    <section className="k-hero container">
      <div className="k-hero-copy">
        <img src={asset('/images/products/sculpt-serum.jpg')} alt="" className="k-hero-thumb" />
        <h1><em>KESSORA</em> is a complete skin cycle system: clinic, home care, and long-term skin support.</h1>
        <div className="row"><Link to="/shop" className="btn btn-primary">Shop the cycle</Link><Link to={state.member ? '/glow-club' : '/join'} className="link-arrow">{state.member ? 'My Glow Club' : 'Join Glow Club'} <Icon name="chevron" className="icon-sm" /></Link></div>
      </div>
      <div className="k-hero-img"><img src={asset('/images/kessora/after.jpg')} alt="Kessora skin" /></div>
      <div className="k-word">Kessora</div>
    </section>

    {/* 2. Intro */}
    <section className="k-intro container">
      <p>KESSORA is a skincare house <img src={L('satin-15')} alt="" /> and a member community <img src={asset('/images/kessora/after.jpg')} alt="" /> built on the principle of natural renewal of the skin.</p>
      <Link to="/our-story" className="btn btn-secondary btn-sm">Discover more</Link>
    </section>

    {/* 3. System tiles */}
    <section className="section tight container">
      <h2 className="k-h2 text-center"><em>KESSORA</em> is a complete skin cycle system</h2>
      <div className="k-tiles">
        {[['Clinic', 'Diagnosis, treatments and in-clinic rituals with our therapists.', asset('/images/kessora/before-after.jpg'), '/skin-solutions'], ['Shop', 'Seven formulas, two finishes, one cycle. Delivered anywhere in Singapore.', L('satin-13'), '/shop'], ['Community & Membership', 'Glow Club: points, missions, workshops and rewards.', L('satin-17'), '/glow-club']].map(([t, b, img, to]) => <Link key={t} to={to} className="k-tile"><img src={img} alt="" /><b>{t}</b><small>{b}</small></Link>)}
      </div>
    </section>

    {/* 4. Skin cycle dark band */}
    <section className="k-dark"><div className="container">
      <h2 className="k-h2 text-center" style={{ color: '#fff' }}>Skin <em>Cycle</em></h2>
      <div className="k-cycle">{CYCLE.map((c, i) => <div key={c.k} className="k-circle"><span className="k-circle-dot" /><b>{c.k}</b><small>{c.t}</small>{i < CYCLE.length - 1 && <i className="k-circle-link" />}</div>)}</div>
    </div></section>

    {/* 5. Products */}
    <section className="section container">
      <h2 className="k-h2 text-center"><em>KESSORA</em> Products</h2>
      <div className="between" style={{ margin: '18px 0 14px' }}><b>What's New</b><Link to="/shop" className="link-arrow">Shop All Products <Icon name="chevron" className="icon-sm" /></Link></div>
      <div className="pgrid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>{whatsNew.map(p => <ProductCard key={p.id} product={p} />)}</div>
    </section>

    {/* 6. Advantages */}
    <section className="section tight container">
      <h2 className="k-h2 text-center">Our <em>Advantages</em></h2>
      <div className="k-adv">{[['leaf', 'Natural Skin Renewal', 'Formulas that work with the skin’s own 28-day cycle, never against it.'], ['layers', 'Clinic + Home Care System', 'One diagnosis, one plan. What happens in clinic continues at home.'], ['users', 'Personalised Skin Support', 'Routine Builder, reminders and a member community that keeps you going.']].map(([i, t, b]) => <div key={t}><span className="k-adv-icon"><Icon name={i} /></span><b>{t}</b><small>{b}</small></div>)}</div>
    </section>

    {/* 7. Membership preview */}
    <section className="section tight container">
      <h2 className="k-h2 text-center">Membership <em>preview</em></h2>
      <div className="k-member">
        <div className="k-member-phone"><div className="k-phone"><div className="k-phone-notch" /><div className="k-phone-body">
          <small className="eyebrow">Your Glow Level</small><div className="serif" style={{ fontSize: 24, letterSpacing: '.06em' }}>{state.member ? d.tier.short.toUpperCase() : 'LUMINOUS'}</div>
          <div className="serif tnum" style={{ fontSize: 34, lineHeight: 1 }}>{state.member ? n(d.balance) : '12,480'}</div><small className="muted">Glow Points</small>
          <div className="progress" style={{ margin: '10px 0 6px' }}><span style={{ width: '64%' }} /></div><small className="tiny muted">550 points until your next reward</small>
          <div className="k-phone-rows">{['AM routine · +25', 'Learn & Earn · +100', 'Weekly challenge · +500'].map(r => <div key={r}><Icon name="check-circle" className="icon-sm" />{r}</div>)}</div>
          <div className="row" style={{ marginTop: 10 }}><TierBadge tier={d.tier} size={28} /><small className="tiny">8 of 10 referrals to Ambassador</small></div>
        </div></div><Link to="/app" className="btn btn-primary btn-sm" style={{ marginTop: 12 }}>Open the member app</Link><small className="muted tiny" style={{ display: 'block', marginTop: 6 }}>Membership app</small></div>
        <Link to="/glow-club" className="k-member-tile"><img src={L('satin-16')} alt="" /><small>Member workshops and skin diagnosis</small></Link>
        <Link to="/rewards" className="k-member-tile"><img src={L('satin-18')} alt="" /><small>Gifts and rewards for members</small></Link>
      </div>
    </section>

    {/* 8. Before / After */}
    <section className="section tight k-ba-wrap"><div className="container">
      <h2 className="k-h2 text-center">Before <em>/ After</em></h2>
      <div className="tabs k-ba-tabs">{['Barrier recovery', 'Firming', 'Brightening', 'Long-term care'].map((t, i) => <button key={t} className={ba === i ? 'active' : ''} onClick={() => setBa(i)}>{t}</button>)}</div>
      <div className="k-ba"><figure><img src={asset('/images/kessora/before.jpg')} alt="Before" /><figcaption>Before</figcaption></figure><figure><img src={asset('/images/kessora/after.jpg')} alt="After" /><figcaption>After · 8 weeks</figcaption></figure></div>
      <p className="k-ba-strip">New Season Essential · Rescue Your Skin · Made with love</p>
    </div></section>

    {/* 9. Start your cycle banner */}
    <section className="k-banner"><img src={L('satin-07')} alt="" /><div className="k-banner-copy"><div className="k-banner-card"><small className="eyebrow">Carefully curated products from us</small><b>Start Your Cycle</b><em>Confident Skin</em><Link to={state.member ? '/ritual' : '/join'} className="btn btn-light btn-sm">{state.member ? 'Build my routine' : 'Join Glow Club'}</Link></div></div><div className="k-word light">Kessora</div></section>

    {/* 10. Locations */}
    <section className="section tight container">
      <h2 className="k-h2 text-center">Location <em>map</em></h2>
      <div className="k-map">
        {[['Singapore', 62, 58, 'Flagship · 12 Duxton Hill'], ['Kuala Lumpur', 60, 52, 'Partner clinic · Bangsar'], ['Bangkok', 61, 44, 'Partner clinic · Thonglor'], ['Hong Kong', 70, 36, 'Partner clinic · Central'], ['Tokyo', 82, 30, 'Partner clinic · Omotesando']].map(([c, x, y, a]) => <div key={c} className="k-pin" style={{ left: `${x}%`, top: `${y}%` }}><span /><b>{c}</b><small>{a}</small></div>)}
      </div>
    </section>

    {/* 11. Testimonials dark */}
    <section className="k-dark"><div className="container">
      <h2 className="k-h2 text-center" style={{ color: '#fff' }}>Trusted Customer <em>& Member Testimonials</em></h2>
      <div className="k-testi">{TESTIMONIALS.map(t => <div key={t.name} className="k-testi-card"><div className="stars" style={{ color: 'var(--gold)' }}>{[1, 2, 3, 4, 5].map(i => <Icon key={i} name="star" />)}</div><p>“{t.text}”</p><b>{t.name}</b><small>{t.role}</small></div>)}</div>
    </div></section>

    {/* 12. Articles */}
    <section className="section tight container">
      <h2 className="k-h2 text-center">Beauty Tips <em>& Articles</em></h2>
      <div className="k-articles">{LESSONS.slice(0, 3).map((l, i) => <Link key={l.id} to={`/learn/${l.id}`} className="k-article"><img src={L(['satin-09', 'satin-18', 'satin-13'][i])} alt="" /><small className="eyebrow">{l.tag} · {l.minutes} min</small><b>{l.title}</b><p>{l.summary}</p></Link>)}</div>
    </section>

    {/* 13. FAQ */}
    <section className="section tight container k-faq">
      <h2 className="k-h2 text-center">Got Questions? <em>We've Got Answers</em></h2>
      <div className="k-faq-list">{FAQ.map(([q, a], i) => <div key={q} className={`k-faq-item ${faq === i ? 'open' : ''}`}><button onClick={() => setFaq(faq === i ? -1 : i)}>{q}<Icon name={faq === i ? 'minus' : 'plus'} className="icon-sm" /></button>{faq === i && <p>{a}</p>}</div>)}</div>
      <p className="text-center small muted" style={{ marginTop: 18 }}>{TAGLINES.club} · {PILLARS.map(p => p.label).join(' · ')}</p>
    </section>
  </div>
}
