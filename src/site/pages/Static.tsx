import React from 'react'
import { asset } from '@/lib/asset'
import { Link } from 'react-router-dom'
import { Icon } from '@/components/Icon'
import { SectionHead } from '@/components/ui'

export function OurStory() {
  return <div className="container">
    <section className="section story-hero">
      <div><p className="eyebrow">Our Story</p><h1>Thoughtfully made. Visibly radiant.</h1><p>Lumiva began in Singapore with a simple frustration: skincare that promised everything and asked for a cabinet of products in return. We wanted fewer, better formulas that work together, and a way to make the daily ritual feel rewarding rather than routine.</p><p>Every product is formulated around the skin barrier first. Every reward in Glow Club is designed to be useful in real life. And every part of the experience, from the marquee to the leaderboard, is built to feel premium and calm.</p><div className="row" style={{ marginTop: 10 }}><Link to="/shop" className="btn btn-primary">Shop the ritual</Link><Link to="/glow-club" className="btn btn-secondary">About Glow Club</Link></div></div>
      <img src={asset('/images/hero-group.jpg')} alt="Lumiva products on stone" />
    </section>
    <section className="section tight"><SectionHead title="What we stand for" center /><div className="values">
      {[['leaf', 'Barrier first', 'Formulas that respect the skin’s own chemistry. No fragrance, no stripping, no noise.'], ['layers', 'Routine over products', 'Four steps that work together. We would rather you use less, consistently.'], ['users', 'Community, not casino', 'Recognition and rewards without pressure. Gamification with a conscience.']].map(([i, t, b]) => <div key={t}><Icon name={i} className="icon-lg copper" /><h3>{t}</h3><p className="small muted">{b}</p></div>)}
    </div></section>
    <section className="section tight"><div className="dark-band" style={{ borderRadius: 24, padding: 48 }}><div className="two-col" style={{ alignItems: 'center' }}><div><p className="eyebrow">Sustainability</p><h2 style={{ fontSize: 34, margin: '8px 0 12px' }}>Refillable, recyclable, responsible</h2><p className="muted">Our matte black vessels are refillable in store. Copper closures are recyclable. Every order ships in FSC-certified packaging, carbon-offset within Singapore.</p></div><img src={asset('/images/products/cream-dark.jpg')} alt="" style={{ borderRadius: 16 }} /></div></div></section>
  </div>
}

export function Help() {
  const faqs = [
    ['How do I earn Glow Points?', 'Ten points per S$1 spent, multiplied by your tier. Plus daily check-ins, routine check-ins, lessons, verified reviews, referrals and weekly missions.'],
    ['When do points expire?', 'Points expire 12 months after they are earned. We show the amount expiring in the next 90 days in your wallet.'],
    ['How does the 1-for-1 work?', 'New members buy one eligible item and receive a second eligible item (the lowest-priced) on us. One redemption per member. Choose your item in the gift drawer before checkout.'],
    ['How is the hero reward governed?', 'Japan flights for two require an eligibility check and an approval workflow. Points are held, not deducted, until approval. Full terms are shown on the reward page.'],
    ['What appears in the activity feed?', 'Only verified events, only with your consent, shown as first name and surname initial. Turn it off in Account › Privacy.'],
  ]
  return <div className="container">
    <div className="page-hero"><p className="eyebrow">Help</p><h1>Questions, answered</h1></div>
    <div className="two-col" style={{ alignItems: 'start' }}>
      <div className="panel"><h3 style={{ fontSize: 24, marginBottom: 10 }}>FAQ</h3>{faqs.map(([q, a]) => <details key={q} className="faq-item" style={{ padding: '12px 0' }}><summary style={{ cursor: 'pointer', fontWeight: 500 }}>{q}</summary><p className="small muted" style={{ marginTop: 8 }}>{a}</p></details>)}</div>
      <div className="stack">
        <div className="panel" id="shipping"><h3 style={{ fontSize: 22 }}>Shipping</h3><p className="small muted" style={{ marginTop: 6 }}>Complimentary standard delivery over S$80, otherwise S$6. Express same-day available before 2pm. Radiance Platinum members always ship free.</p></div>
        <div className="panel" id="privacy"><h3 style={{ fontSize: 22 }}>Privacy (PDPA)</h3><p className="small muted" style={{ marginTop: 6 }}>We collect only what is needed to run your membership: contact details, orders, points and the preferences you set. Consent records, purpose notices and retention controls are maintained. You can export or delete your data from your account.</p></div>
        <div className="panel" id="terms"><h3 style={{ fontSize: 22 }}>Glow Club terms</h3><p className="small muted" style={{ marginTop: 6 }}>Membership is free. Points have no cash value. Rewards are subject to availability and the terms shown on each reward page. Lumiva may reverse points from cancelled orders or suspicious activity, with a traceable record in your point history.</p></div>
        <div className="panel"><h3 style={{ fontSize: 22 }}>Contact</h3><p className="small muted" style={{ marginTop: 6 }}>hello@lumiva.sg · WhatsApp +65 8000 0000 · 12 Duxton Hill, Singapore</p></div>
      </div>
    </div>
    <div style={{ height: 60 }} />
  </div>
}

export function NotFound() { return <div className="container"><div className="empty" style={{ padding: 100 }}><h3>Page not found</h3><p>Let's get you back to the ritual.</p><Link to="/" className="btn btn-primary" style={{ marginTop: 16 }}>Home</Link></div></div> }
