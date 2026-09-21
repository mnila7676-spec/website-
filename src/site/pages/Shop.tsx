import React, { useMemo, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { ProductCard } from '@/components/ui'
import { Icon } from '@/components/Icon'
import { PRODUCTS, CONCERNS, STEPS } from '@/data/products'
import type { Category } from '@/data/products'

const CATS: { key: Category | 'all'; label: string }[] = [{ key: 'all', label: 'All' }, { key: 'cleansers', label: 'Cleansers' }, { key: 'serums', label: 'Serums' }, { key: 'moisturisers', label: 'Moisturisers' }, { key: 'spf', label: 'SPF' }, { key: 'sets', label: 'Sets' }, { key: 'minis', label: 'Minis' }]

export function Shop() {
  const [sp, setSp] = useSearchParams()
  const cat = (sp.get('cat') ?? 'all') as Category | 'all'; const q = sp.get('q') ?? ''; const sort = sp.get('sort') ?? 'featured'
  const [concerns, setConcerns] = useState<string[]>(sp.get('concern') ? [sp.get('concern')!] : []); const [steps, setSteps] = useState<string[]>([]); const [maxPrice, setMaxPrice] = useState(250)
  const set = (k: string, v: string) => { const n = new URLSearchParams(sp); v ? n.set(k, v) : n.delete(k); setSp(n) }
  const list = useMemo(() => {
    let l = PRODUCTS.filter(p => (cat === 'all' || p.category === cat) && p.price <= maxPrice && (!q || (p.name + ' ' + p.tagline + ' ' + p.description + ' ' + p.ingredients.map(i => i.name).join(' ')).toLowerCase().includes(q.toLowerCase())) && (!concerns.length || concerns.some(c => p.concerns.includes(c as any))) && (!steps.length || steps.includes(p.step)))
    if (sort === 'price-asc') l = [...l].sort((a, b) => a.price - b.price); if (sort === 'price-desc') l = [...l].sort((a, b) => b.price - a.price); if (sort === 'best') l = [...l].sort((a, b) => b.reviews - a.reviews); if (sort === 'rating') l = [...l].sort((a, b) => b.rating - a.rating)
    return l
  }, [cat, q, sort, concerns, steps, maxPrice])
  const tog = (arr: string[], setArr: (v: string[]) => void, k: string) => setArr(arr.includes(k) ? arr.filter(x => x !== k) : [...arr, k])
  return <div className="container">
    <div className="page-hero"><p className="eyebrow">Shop</p><h1>{q ? `Results for “${q}”` : cat === 'all' ? 'All skincare' : CATS.find(c => c.key === cat)?.label}</h1><p>Thoughtfully formulated, routine-led skincare. Every product earns Glow Points.</p></div>
    <div className="shop-layout">
      <aside className="filters">
        <div><h4>Category</h4>{CATS.map(c => <label key={c.key}><input type="radio" name="cat" checked={cat === c.key} onChange={() => set('cat', c.key === 'all' ? '' : c.key)} /> {c.label}</label>)}</div>
        <div><h4>Skin concern</h4>{CONCERNS.map(c => <label key={c.key}><input type="checkbox" checked={concerns.includes(c.key)} onChange={() => tog(concerns, setConcerns, c.key)} /> {c.label}</label>)}</div>
        <div><h4>Routine step</h4>{STEPS.map(s => <label key={s.key}><input type="checkbox" checked={steps.includes(s.key)} onChange={() => tog(steps, setSteps, s.key)} /> {s.label}</label>)}</div>
        <div><h4>Max price · S${maxPrice}</h4><input type="range" min={15} max={250} value={maxPrice} onChange={e => setMaxPrice(+e.target.value)} style={{ width: '100%', accentColor: 'var(--copper)' }} /></div>
      </aside>
      <div>
        <div className="shop-toolbar">
          <span className="muted small">{list.length} product{list.length === 1 ? '' : 's'}{q && <> · <button className="link-btn" onClick={() => set('q', '')}>clear search</button></>}</span>
          <label className="row small"><Icon name="filter" className="icon-sm muted" /> <select className="input" style={{ width: 'auto', padding: '8px 12px' }} value={sort} onChange={e => set('sort', e.target.value)}><option value="featured">Featured</option><option value="best">Best sellers</option><option value="rating">Top rated</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option></select></label>
        </div>
        {list.length ? <div className="pgrid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>{list.map(p => <ProductCard key={p.id} product={p} />)}</div>
          : <div className="empty"><h3>No products match</h3><p>Try a different filter or <Link to="/shop" className="copper">view everything</Link>.</p></div>}
      </div>
    </div>
    <div style={{ height: 60 }} />
  </div>
}
