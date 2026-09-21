import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ProductCard, SectionHead, Modal } from '@/components/ui'
import { SkinProfileForm } from '@/components/forms'
import { Icon } from '@/components/Icon'
import { PRODUCTS, CONCERNS } from '@/data/products'
import { useStore } from '@/store/store'

export function SkinSolutions() {
  const { state } = useStore(); const [sel, setSel] = useState<string>(state.member?.skinProfile?.concerns?.[0] ?? 'dullness'); const [prof, setProf] = useState(false)
  const list = PRODUCTS.filter(p => p.concerns.includes(sel as any) && p.category !== 'minis')
  const c = CONCERNS.find(x => x.key === sel)!
  return <div className="container">
    <div className="page-hero"><p className="eyebrow">Skin Solutions</p><h1>Start with your skin, not a product</h1><p>Choose your main concern and we will map the routine, ingredients and products that address it, without noise.</p>
      <div className="row" style={{ marginTop: 18 }}><button className="btn btn-primary" onClick={() => setProf(true)}>{state.member?.skinProfile ? 'Update my skin profile' : 'Complete my skin profile · +200 pts'}</button>{state.member?.skinProfile && <span className="pill pill-outline">{state.member.skinProfile.type} · {state.member.skinProfile.goal}</span>}</div></div>
    <div className="concern-grid">{CONCERNS.map(x => <button key={x.key} className={`concern ${sel === x.key ? 'on' : ''}`} onClick={() => setSel(x.key)}><h3>{x.label}</h3><p className="small muted">{x.blurb}</p></button>)}</div>
    <section className="section">
      <SectionHead eyebrow="Recommended for" title={c.label} blurb={`A ${list.length}-step approach. Products below are ordered by routine step.`} action={<Link to={`/shop?concern=${sel}`} className="link-arrow">Shop all for {c.label.toLowerCase()} <Icon name="chevron" className="icon-sm" /></Link>} />
      <div className="pgrid">{list.sort((a, b) => ['cleanse', 'treat', 'hydrate', 'protect', 'all'].indexOf(a.step) - ['cleanse', 'treat', 'hydrate', 'protect', 'all'].indexOf(b.step)).map(p => <ProductCard key={p.id} product={p} />)}</div>
    </section>
    <section className="section tight" id="ingredients">
      <SectionHead title="Ingredients we trust" blurb="Every ingredient earns its place. Here is what does the work in each formula." />
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>{PRODUCTS.filter(p => p.ingredients.length).flatMap(p => p.ingredients.map(i => ({ ...i, product: p }))).map((i, k) => <div key={k} className="card card-pad"><b className="small">{i.name}</b><p className="small muted" style={{ margin: '4px 0 8px' }}>{i.role}</p><Link to={`/product/${i.product.slug}`} className="tiny copper">In {i.product.name}</Link></div>)}</div>
    </section>
    {prof && <Modal onClose={() => setProf(false)} width={560}><div style={{ padding: 32 }}><h2 style={{ fontSize: 28 }}>Your skin profile</h2><p className="muted small" style={{ margin: '6px 0 16px' }}>Used only to personalise recommendations and missions. {state.member ? '' : 'Join Glow Club to save your profile and earn 200 points.'}</p>{state.member ? <SkinProfileForm onDone={() => setProf(false)} /> : <Link to="/join" className="btn btn-primary btn-block">Join Glow Club</Link>}</div></Modal>}
  </div>
}
