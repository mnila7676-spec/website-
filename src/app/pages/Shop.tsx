import React, { useState } from 'react'
import { Link, useParams, useSearchParams, Navigate, useNavigate } from 'react-router-dom'
import { Icon } from '@/components/Icon'
import { ProductCard, Stars, QtyStepper, Modal } from '@/components/ui'
import { ReviewForm } from '@/components/forms'
import { useStore } from '@/store/store'
import { PRODUCTS, productBySlug, productById, money, POINTS_PER_DOLLAR, STEPS } from '@/data/products'
import { REVIEWS } from '@/data/community'
import { n, fmtDate } from '@/lib/format'

const CATS = [['all', 'All'], ['cleansers', 'Cleansers'], ['serums', 'Serums'], ['moisturisers', 'Moisturisers'], ['spf', 'SPF'], ['sets', 'Sets'], ['minis', 'Minis']]
export function AppShop() {
  const [sp] = useSearchParams(); const [cat, setCat] = useState('all'); const [q, setQ] = useState(''); const { d } = useStore()
  const step = sp.get('step')
  const list = PRODUCTS.filter(p => (cat === 'all' || p.category === cat) && (!step || p.step === step) && (!q || (p.name + p.tagline).toLowerCase().includes(q.toLowerCase())))
  return <div className="screen">
    <div className="screen-head"><h1>Shop</h1><Link to="/app/bag" className="icon-btn" aria-label="Bag"><Icon name="bag" />{d.cartCount > 0 && <span className="count">{d.cartCount}</span>}</Link></div>
    <div className="app-search"><input className="input" placeholder="Search products" value={q} onChange={e => setQ(e.target.value)} /><button className="btn btn-light btn-sm"><Icon name="filter" className="icon-sm" /> Filter</button></div>
    <div className="h-scroll" style={{ marginBottom: 12 }}>{CATS.map(([k, l]) => <button key={k} className={`chip ${cat === k ? 'active' : ''}`} onClick={() => setCat(k)} style={{ flex: 'none' }}>{l}</button>)}</div>
    {step && <p className="tiny muted" style={{ marginBottom: 10 }}>Showing step: {STEPS.find(s => s.key === step)?.label} · <Link to="/app/shop" className="copper">clear</Link></p>}
    <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 10 }}>{list.map(p => <ProductCard key={p.id} product={p} compact />)}</div>
  </div>
}

export function AppProduct() {
  const { slug } = useParams(); const p = productBySlug(slug ?? ''); const { state, d, actions } = useStore(); const nav = useNavigate()
  const [img, setImg] = useState(0); const [qty, setQty] = useState(1); const [open, setOpen] = useState('benefits'); const [review, setReview] = useState(false)
  if (!p) return <Navigate to="/app/shop" replace />
  const gallery = [p.image, p.imageDark]; const pts = Math.round(p.price * POINTS_PER_DOLLAR * (state.member ? d.tier.multiplier : 1)); const wished = state.wishlist.includes(p.id)
  const reviews = [...state.reviews.filter(r => r.productId === p.id).map(r => ({ name: 'You', rating: r.rating, text: r.text, date: fmtDate(r.ts), verified: r.verified })), ...(REVIEWS[p.id] ?? [])]
  const Acc = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => <div className="acc-item"><button className="acc-btn" onClick={() => setOpen(open === id ? '' : id)}>{title}<Icon name="chevron-down" className="icon-sm" /></button>{open === id && <div className="acc-body">{children}</div>}</div>
  const step = STEPS.find(s => s.key === p.step)
  return <div className="screen" style={{ paddingTop: 0 }}>
    <div className="pdp-app-img"><img src={gallery[img]} alt={p.name} /><button className="back" style={{ position: 'absolute', top: 14, left: 14, width: 36, height: 36, borderRadius: 18, border: 0, background: 'rgba(255,255,255,.9)', display: 'grid', placeItems: 'center' }} onClick={() => nav(-1)}><Icon name="chevron-left" className="icon-sm" /></button><div style={{ position: 'absolute', top: 14, right: 14, display: 'flex', gap: 8 }}><button className={`pcard-wish ${wished ? 'on' : ''}`} style={{ position: 'static' }} onClick={() => actions.toggleWish(p.id)}><Icon name={wished ? 'heart-fill' : 'heart'} className="icon-sm" /></button><button className="pcard-wish" style={{ position: 'static' }} onClick={() => navigator.share?.({ title: p.name, url: location.href })}><Icon name="share" className="icon-sm" /></button></div></div>
    <div className="dots">{gallery.map((g, i) => <i key={g} className={i === img ? 'on' : ''} onClick={() => setImg(i)} />)}</div>
    <div className="pdp-info-app">
      <div className="between"><h1>{p.name}</h1><Stars rating={p.rating} count={p.reviews} /></div>
      <div className="pdp-price" style={{ fontSize: 20, margin: '6px 0 2px' }}>{money(p.price)}</div>
      <p className="small muted">{p.description.split('.')[0]}.</p>
      <div className="row" style={{ marginTop: 10, flexWrap: 'wrap' }}>{p.skinTypes.map(s => <span key={s} className="pill pill-outline tiny">{s}</span>)}<span className="pill pill-outline tiny">{p.size}</span>{step && <span className="pill pill-outline tiny">Step {step.num} · {step.label}</span>}<span className="pill pill-outline tiny">{p.routine}</span></div>
      <div className="acc" style={{ marginTop: 16 }}>
        <Acc id="benefits" title="Benefits"><ul className="benefit-list">{p.benefits.map(b => <li key={b}><Icon name="check-circle" className="icon-sm" />{b}</li>)}</ul></Acc>
        {p.ingredients.length > 0 && <Acc id="ingredients" title="Ingredients"><ul className="ing">{p.ingredients.map(i => <li key={i.name}><b>{i.name}</b>{i.role}</li>)}</ul></Acc>}
        <Acc id="use" title="How to Use"><ol className="numbered">{p.howToUse.map((h, i) => <li key={h}><span>{i + 1}</span>{h}</li>)}</ol></Acc>
        <Acc id="reviews" title={`Reviews (${reviews.length})`}>{reviews.map((r, i) => <div key={i} className="review"><div className="review-head"><Stars rating={r.rating} /><b className="small">{r.name}</b>{r.verified && <span className="pill pill-success tiny">Verified</span>}</div><p>{r.text}</p></div>)}{state.member && <button className="btn btn-secondary btn-sm" style={{ marginTop: 10 }} onClick={() => setReview(true)}>Write a review · +150 pts</button>}</Acc>
      </div>
      <div className="sub-head"><h2>Pairs with</h2><Link to="/app/routine">Build routine →</Link></div>
      <div className="h-scroll">{PRODUCTS.filter(x => x.id !== p.id && !x.includes && x.category !== 'minis').map(x => <ProductCard key={x.id} product={x} compact />)}</div>
    </div>
    <div className="sticky-cta"><QtyStepper small value={qty} onChange={v => setQty(Math.max(1, v))} /><button className="btn btn-primary btn-lg" style={{ flex: 1 }} onClick={() => actions.addToCart(p.id, qty)}>Add to Bag · {money(p.price * qty)}</button></div>
    <p className="tiny text-center copper" style={{ marginTop: 8 }}><Icon name="sun" className="icon-sm" /> Earn +{n(pts)} points</p>
    {review && <Modal onClose={() => setReview(false)} width={420}><div style={{ padding: 24 }}><h2 style={{ fontSize: 24, marginBottom: 12 }}>Review {p.name}</h2><ReviewForm productId={p.id} onDone={() => setReview(false)} /></div></Modal>}
  </div>
}
