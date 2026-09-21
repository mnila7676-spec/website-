import React, { useState } from 'react'
import { asset } from '@/lib/asset'
import { useParams, Link, Navigate } from 'react-router-dom'
import { Icon } from '@/components/Icon'
import { Stars, QtyStepper, ProductCard, Modal } from '@/components/ui'
import { ReviewForm } from '@/components/forms'
import { useStore } from '@/store/store'
import { PRODUCTS, productBySlug, productById, money, POINTS_PER_DOLLAR, STEPS } from '@/data/products'
import { REVIEWS } from '@/data/community'
import { fmtDate, n } from '@/lib/format'
import { useLinks } from '@/lib/links'

export function ProductPage() {
  const { slug } = useParams(); const p = productBySlug(slug ?? ''); const { state, actions, d } = useStore(); const L = useLinks()
  const [img, setImg] = useState(0); const [qty, setQty] = useState(1); const [open, setOpen] = useState<string>('benefits'); const [review, setReview] = useState(false)
  if (!p) return <Navigate to={L.shop} replace />
  const gallery = [p.image, p.imageDark, ...(p.includes ? [] : [asset('/images/hero-group.jpg')])]
  const pts = Math.round(p.price * POINTS_PER_DOLLAR * (state.member ? d.tier.multiplier : 1))
  const related = PRODUCTS.filter(x => x.id !== p.id && !x.includes && x.category !== 'minis').slice(0, 4)
  const reviews = [...state.reviews.filter(r => r.productId === p.id).map(r => ({ name: 'You', rating: r.rating, text: r.text, date: fmtDate(r.ts), verified: r.verified })), ...(REVIEWS[p.id] ?? [])]
  const wished = state.wishlist.includes(p.id)
  const step = STEPS.find(s => s.key === p.step)
  const Acc = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => <div className="acc-item"><button className="acc-btn" onClick={() => setOpen(open === id ? '' : id)}>{title}<Icon name="chevron-down" className="icon-sm" style={{ transform: open === id ? 'rotate(180deg)' : 'none' } as any} /></button>{open === id && <div className="acc-body">{children}</div>}</div>
  return <div className="container">
    <div className="crumbs" style={{ marginTop: 24 }}><Link to={L.home}>Home</Link> / <Link to={L.shop}>Shop</Link> / <span>{p.name}</span></div>
    <div className="pdp">
      <div className="pdp-gallery"><div className="pdp-main"><img src={gallery[img]} alt={p.name} /></div><div className="pdp-thumbs">{gallery.map((g, i) => <button key={g} className={i === img ? 'on' : ''} onClick={() => setImg(i)}><img src={g} alt="" /></button>)}</div></div>
      <div className="pdp-info">
        {p.badge && <span className="pill pill-dark tiny">{p.badge}</span>}
        <h1 style={{ marginTop: 8 }}>{p.name}</h1>
        <p className="muted">{p.tagline}</p>
        <div className="row" style={{ marginTop: 8 }}><Stars rating={p.rating} count={p.reviews} /><span className="tiny muted">· {p.size}</span>{step && <span className="pill pill-muted tiny">Step {step.num} · {step.label}</span>}<span className="pill pill-muted tiny">{p.routine}</span></div>
        <div className="pdp-price">{money(p.price)}{p.compareAt && <span className="pcard-compare">{money(p.compareAt)}</span>}</div>
        <p className="pdp-earn"><Icon name="sun" className="icon-sm" /> Earn +{n(pts)} Glow Points{state.member && d.tier.multiplier > 1 ? ` as ${d.tier.short}` : ''}{p.giftEligible && ' · 1-for-1 eligible'}</p>
        <p style={{ marginTop: 16, color: 'var(--ink-3)' }}>{p.description}</p>
        <div className="pdp-buy"><QtyStepper value={qty} onChange={v => setQty(Math.max(1, v))} /><button className="btn btn-primary btn-lg" style={{ flex: 1 }} onClick={() => actions.addToCart(p.id, qty)}>Add to Bag · {money(p.price * qty)}</button><button className={`icon-btn ${wished ? 'copper' : ''}`} style={{ border: '1px solid var(--line)' }} onClick={() => actions.toggleWish(p.id)} aria-label="Save"><Icon name={wished ? 'heart-fill' : 'heart'} /></button></div>
        <ul className="benefit-list">{p.benefits.map(b => <li key={b}><Icon name="check-circle" className="icon-sm" />{b}</li>)}</ul>
        {p.includes && <div className="card card-pad" style={{ margin: '16px 0' }}><b className="small">Includes</b><div className="row" style={{ marginTop: 10, flexWrap: 'wrap' }}>{p.includes.map(id => { const x = productById(id)!; return <Link key={id} to={L.product(x.slug)} className="row small" style={{ gap: 8 }}><img src={x.image} alt="" style={{ width: 40, height: 40, borderRadius: 8 }} />{x.name}</Link> })}</div></div>}
        <div className="acc" style={{ marginTop: 20 }}>
          <Acc id="benefits" title="Benefits & suitability"><p>Suitable for: {p.skinTypes.join(', ')}. Concerns: {p.concerns.map(c => c.replace('-', ' ')).join(', ')}.</p><p style={{ marginTop: 8 }}>Routine placement: {step ? `Step ${step.num}, ${step.label.toLowerCase()}` : 'Complete routine'} · {p.routine}. Typical usage: about {p.usageDays} days per {p.size}.</p></Acc>
          {p.ingredients.length > 0 && <Acc id="ingredients" title="Ingredients"><ul className="ing">{p.ingredients.map(i => <li key={i.name}><b>{i.name}</b>{i.role}</li>)}</ul></Acc>}
          <Acc id="use" title="How to use"><ol className="numbered">{p.howToUse.map((h, i) => <li key={h}><span>{i + 1}</span>{h}</li>)}</ol></Acc>
          {p.faqs.length > 0 && <Acc id="faq" title="FAQs">{p.faqs.map(f => <div key={f.q} style={{ marginBottom: 12 }}><b style={{ color: 'var(--ink)' }}>{f.q}</b><p>{f.a}</p></div>)}</Acc>}
          <Acc id="delivery" title="Delivery & returns"><p>Complimentary delivery over S$80. Standard delivery 1 to 3 working days in Singapore. 30-day returns on unopened items.</p></Acc>
        </div>
      </div>
    </div>

    <section className="section tight">
      <div className="section-head"><h2 style={{ fontSize: 30 }}>Reviews</h2><button className="btn btn-secondary btn-sm" onClick={() => state.member ? setReview(true) : null}>{state.member ? 'Write a review · +150 pts' : <Link to={L.signin}>Sign in to review</Link>}</button></div>
      {reviews.map((r, i) => <div key={i} className="review"><div className="review-head"><Stars rating={r.rating} /><b className="small">{r.name}</b>{r.verified && <span className="pill pill-success tiny">Verified purchase</span>}<span className="tiny muted">{r.date}</span></div><p style={{ color: 'var(--ink-3)' }}>{r.text}</p></div>)}
      {review && <Modal onClose={() => setReview(false)} width={520}><div style={{ padding: 32 }}><h2 style={{ fontSize: 28, marginBottom: 4 }}>Review {p.name}</h2><p className="muted small" style={{ marginBottom: 16 }}>Useful, honest reviews help the community. Points apply to verified purchases only.</p><ReviewForm productId={p.id} onDone={() => setReview(false)} /></div></Modal>}
    </section>
    <section className="section tight"><div className="section-head"><h2 style={{ fontSize: 30 }}>Complete the ritual</h2><Link to={L.ritual} className="link-arrow">Build my routine <Icon name="chevron" className="icon-sm" /></Link></div><div className="pgrid">{related.map(x => <ProductCard key={x.id} product={x} />)}</div></section>
  </div>
}
