import React, { useState } from 'react'
import { Link, useParams, useSearchParams, Navigate, useNavigate } from 'react-router-dom'
import { Icon } from '@/components/Icon'
import { ProductCard, Stars, QtyStepper, Modal } from '@/components/ui'
import { ReviewForm } from '@/components/forms'
import { useStore } from '@/store/store'
import { PRODUCTS, productBySlug, productById, money, POINTS_PER_DOLLAR, STEPS, RITUALS, forTime } from '@/data/products'
import { REVIEWS } from '@/data/community'
import { n, fmtDate } from '@/lib/format'
import { asset } from '@/lib/asset'

const CATS = [['all', 'All'], ['cleansers', 'Cleansers'], ['essences', 'Essences'], ['serums', 'Serums'], ['moisturisers', 'Moisturisers'], ['spf', 'SPF'], ['tools', 'Tools'], ['sets', 'Sets'], ['minis', 'Minis']]
export function AppShop() {
  const [sp] = useSearchParams(); const [cat, setCat] = useState('all'); const [q, setQ] = useState(''); const { d } = useStore()
  const step = sp.get('step'); const [time, setTime] = useState<string>(sp.get('time') ?? 'all')
  const list = PRODUCTS.filter(p => (cat === 'all' || p.category === cat) && (time === 'all' || forTime(p, time as 'day' | 'night')) && (!step || p.step === step) && (!q || (p.name + p.tagline).toLowerCase().includes(q.toLowerCase())))
  return <div className="screen">
    <div className="screen-head"><h1>Shop</h1><Link to="/app/bag" className="icon-btn" aria-label="Bag"><Icon name="bag" />{d.cartCount > 0 && <span className="count">{d.cartCount}</span>}</Link></div>
    <div className="app-search"><input className="input" placeholder="Search products" value={q} onChange={e => setQ(e.target.value)} /><button className="btn btn-light btn-sm"><Icon name="filter" className="icon-sm" /> Filter</button></div>
    <div className="tabs full" style={{ marginBottom: 10 }}><button className={time === 'all' ? 'active' : ''} onClick={() => setTime('all')}>All</button>{RITUALS.map(r => <button key={r.key} className={time === r.key ? 'active' : ''} onClick={() => setTime(r.key)}><Icon name={r.icon} className="icon-sm" /> {r.label}</button>)}</div>
    <div className="cat-row">{STEPS.map(s => { const img = { cleanse: 'cleanser', prep: 'essence', treat: 'serum', hydrate: 'cream', protect: 'spf' }[s.key]; return <Link key={s.key} to={`/app/shop?step=${s.key}`} style={step === s.key ? { color: 'var(--copper-2)', fontWeight: 600 } : undefined}><span style={step === s.key ? { boxShadow: '0 0 0 2px var(--copper)' } : undefined}><img src={asset(`/images/products/${img}.jpg`)} alt="" /></span>{s.label}</Link> })}</div>
    <div className="h-scroll" style={{ marginBottom: 12 }}>{CATS.map(([k, l]) => <button key={k} className={`chip ${cat === k ? 'active' : ''}`} onClick={() => setCat(k)} style={{ flex: 'none' }}>{l}</button>)}</div>
    {step && <p className="tiny muted" style={{ marginBottom: 10 }}>Showing step: {STEPS.find(s => s.key === step)?.label} · <Link to="/app/shop" className="copper">clear</Link></p>}
    <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 10 }}>{list.map(p => <ProductCard key={p.id} product={p} compact />)}</div>
  </div>
}

export function AppProduct() {
  const { slug } = useParams(); const p = productBySlug(slug ?? ''); const { state, d, actions } = useStore(); const nav = useNavigate()
  const [img, setImg] = useState(0); const [qty, setQty] = useState(1); const [open, setOpen] = useState('benefits'); const [review, setReview] = useState(false)
  if (!p) return <Navigate to="/app/shop" replace />
  const gallery = [p.image, p.imageDark]; const pts = Math.round(p.price * d.pointsPerDollar * (state.member ? d.tier.multiplier : 1)); const wished = state.wishlist.includes(p.id)
  const reviews = [...state.reviews.filter(r => r.productId === p.id).map(r => ({ name: 'You', rating: r.rating, text: r.text, date: fmtDate(r.ts), verified: r.verified })), ...(REVIEWS[p.id] ?? [])]
  const Acc = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => <div className="acc-item"><button className="acc-btn" onClick={() => setOpen(open === id ? '' : id)}>{title}<Icon name={open === id ? 'minus' : 'plus'} className="icon-sm" /></button>{open === id && <div className="acc-body">{children}</div>}</div>
  const step = STEPS.find(s => s.key === p.step)
  const benefitIcon = ['sparkle', 'droplet', 'sun', 'shield']
  return <div className="screen">
    <div className="screen-head"><button className="icon-btn" onClick={() => nav(-1)}><Icon name="chevron-left" /></button><h1 style={{ fontSize: 16, fontFamily: 'var(--font-body)', fontWeight: 600 }}>Product Details</h1><div className="row" style={{ gap: 2 }}><button className="icon-btn" onClick={() => actions.toggleWish(p.id)} aria-label="Save"><Icon name={wished ? 'heart-fill' : 'heart'} className={wished ? 'copper' : ''} /></button><Link to="/app/bag" className="icon-btn" aria-label="Bag"><Icon name="bag" />{d.cartCount > 0 && <span className="count">{d.cartCount}</span>}</Link></div></div>
    <div className="pd-top">
      <div className="pd-thumbs">{gallery.map((g, i) => <button key={g} className={i === img ? 'on' : ''} onClick={() => setImg(i)}><img src={g} alt="" /></button>)}<button onClick={() => setImg(0)}><img src={asset('/images/hero-group.jpg')} alt="" /></button></div>
      <div className="pd-main"><img src={gallery[img]} alt={p.name} /><button className="pd-btn" style={{ right: 10 }} onClick={() => navigator.share?.({ title: p.name, url: location.href })} aria-label="Share"><Icon name="share" className="icon-sm" /></button></div>
    </div>
    <div className="dots">{gallery.map((g, i) => <i key={g} className={i === img ? 'on' : ''} onClick={() => setImg(i)} />)}</div>
    <div className="pdp-info-app">
      <div className="pd-title"><h1>{p.name}</h1><span className="pd-price">{money(p.price)}</span></div>
      <p className="pd-sub">{p.ingredients.slice(0, 2).map(i => i.name.split(' (')[0].replace(/ \d+%$/, '')).join(' + ') || p.tagline}</p>
      <div className="row" style={{ gap: 8 }}><Stars rating={p.rating} count={p.reviews} />{step && <span className="pill pill-muted tiny">Step {step.num} · {step.label}</span>}<span className="pill pill-muted tiny">{p.size}</span></div>
      <div className="benefit-tiles">{p.benefits.slice(0, 4).map((b, i) => <div key={b}><span><Icon name={benefitIcon[i]} className="icon-sm" /></span>{b}</div>)}</div>
      <div className="pd-acc">
        <Acc id="benefits" title="Description"><p>{p.description}</p><p style={{ marginTop: 6 }}>Suitable for {p.skinTypes.join(', ').toLowerCase()} · {p.routine}.</p></Acc>
        {p.ingredients.length > 0 && <Acc id="ingredients" title="Ingredients"><ul className="ing">{p.ingredients.map(i => <li key={i.name}><b>{i.name}</b>{i.role}</li>)}</ul></Acc>}
        <Acc id="use" title="How to Use"><ol className="numbered">{p.howToUse.map((h, i) => <li key={h}><span>{i + 1}</span>{h}</li>)}</ol></Acc>
        <Acc id="reviews" title={`Reviews (${reviews.length})`}>{reviews.map((r, i) => <div key={i} className="review"><div className="review-head"><Stars rating={r.rating} /><b className="small">{r.name}</b>{r.verified && <span className="pill pill-success tiny">Verified</span>}</div><p>{r.text}</p></div>)}{state.member && <button className="btn btn-secondary btn-sm" style={{ marginTop: 10 }} onClick={() => setReview(true)}>Write a review · +250 pts</button>}</Acc>
      </div>
      <p className="tiny copper" style={{ margin: '4px 0 10px' }}><Icon name="sun" className="icon-sm" /> Earn +{n(pts)} Glow Points with this product</p>
      <div className="sub-head"><h2>Pairs with</h2><Link to="/app/routine">Build routine →</Link></div>
      <div className="h-scroll">{PRODUCTS.filter(x => x.id !== p.id && !x.includes && x.category !== 'minis').slice(0, 6).map(x => <ProductCard key={x.id} product={x} compact />)}</div>
    </div>
    <div className="sticky-cta"><QtyStepper small value={qty} onChange={v => setQty(Math.max(1, v))} /><button className="btn btn-primary btn-lg" style={{ flex: 1 }} onClick={() => actions.addToCart(p.id, qty)}>Add to Cart · {money(p.price * qty)}</button></div>
    {review && <Modal onClose={() => setReview(false)} width={420}><div style={{ padding: 24 }}><h2 style={{ fontSize: 24, marginBottom: 12 }}>Review {p.name}</h2><ReviewForm productId={p.id} onDone={() => setReview(false)} /></div></Modal>}
  </div>
}
