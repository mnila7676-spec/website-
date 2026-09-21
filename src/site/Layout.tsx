import React, { useState } from 'react'
import { asset } from '@/lib/asset'
import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom'
import { Icon } from '@/components/Icon'
import { PointsPill } from '@/components/ui'
import { Ticker } from '@/components/Ticker'
import { MembershipPrompts, GiftDrawer, RewardReveal } from '@/components/Prompts'
import { useStore } from '@/store/store'
import { PRODUCTS, money } from '@/data/products'

const LINKS = [['/shop', 'Shop'], ['/skin-solutions', 'Skin Solutions'], ['/ritual', 'The Ritual'], ['/glow-club', 'Glow Club'], ['/our-story', 'Our Story']]

export function SiteLayout() {
  const { d, state } = useStore(); const nav = useNavigate()
  const [search, setSearch] = useState(false); const [q, setQ] = useState(''); const [menu, setMenu] = useState(false)
  const results = q.trim().length > 1 ? PRODUCTS.filter(p => (p.name + p.tagline + p.category).toLowerCase().includes(q.toLowerCase())) : []
  return (
    <div className="site">
      <header className="site-header">
        <Ticker />
        <nav className="nav">
          <div className="container nav-inner">
            <button className="icon-btn mobile-only" aria-label="Menu" onClick={() => setMenu(true)}><Icon name="menu" /></button>
            <Link to="/" className="logo">LUMIVA</Link>
            <div className="nav-links">{LINKS.map(([to, l]) => <NavLink key={to} to={to} className={({ isActive }) => isActive ? 'active' : ''}>{l}</NavLink>)}</div>
            <div className="nav-actions">
              <button className="icon-btn" aria-label="Search" onClick={() => setSearch(s => !s)}><Icon name="search" /></button>
              <Link to={state.member ? '/account' : '/sign-in'} className="icon-btn desktop-only" aria-label="Account"><Icon name="user" /></Link>
              <span className="desktop-only"><PointsPill /></span>
              <Link to="/app" className="btn btn-primary btn-sm nav-app"><Icon name="phone" className="icon-sm" /> <span>Member App</span></Link>
              <Link to="/cart" className="icon-btn" aria-label="Bag"><Icon name="bag" />{d.cartCount > 0 && <span className="count">{d.cartCount}</span>}</Link>
            </div>
          </div>
          {search && <div className="nav-search"><div className="container">
            <input autoFocus className="input" placeholder="Search products, concerns, ingredients" value={q} onChange={e => setQ(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { nav('/shop?q=' + encodeURIComponent(q)); setSearch(false) } if (e.key === 'Escape') setSearch(false) }} />
            {results.length > 0 && <div className="search-results">{results.slice(0, 5).map(p => <Link key={p.id} to={`/product/${p.slug}`} onClick={() => setSearch(false)}><img src={p.image} alt="" /><div><b className="small">{p.name}</b><p className="tiny muted">{p.tagline} · {money(p.price)}</p></div></Link>)}</div>}
          </div></div>}
        </nav>
      </header>
      {menu && <div className="mobile-menu">
        <div className="between"><Link to="/" className="logo" onClick={() => setMenu(false)}>LUMIVA</Link><button className="icon-btn" onClick={() => setMenu(false)} aria-label="Close"><Icon name="x" /></button></div>
        {LINKS.map(([to, l]) => <Link key={to} to={to} onClick={() => setMenu(false)}>{l}</Link>)}
        <Link to={state.member ? '/account' : '/sign-in'} onClick={() => setMenu(false)}>{state.member ? 'My Account' : 'Sign in'}</Link>
        <Link to="/app" onClick={() => setMenu(false)}>Open the member app</Link>
        <div style={{ marginTop: 16 }}><PointsPill dark /></div>
      </div>}
      <main className="site-main"><Outlet /></main>
      <Footer />
      <MembershipPrompts /><GiftDrawer /><RewardReveal />
    </div>
  )
}

function Footer() {
  const { toast } = useStore(); const [email, setEmail] = useState('')
  return <>
    <section className="newsletter"><div className="container newsletter-inner">
      <div className="row" style={{ gap: 20 }}><img src={asset('/images/products/serum.jpg')} alt="" style={{ width: 90, height: 90, borderRadius: 14, objectFit: 'cover' }} /><div><h3>Glow starts in your inbox</h3><p className="muted small">Get ritual tips, new launches and exclusive rewards.</p></div></div>
      <form onSubmit={e => { e.preventDefault(); if (email) { toast('Welcome to the list', { icon: 'mail' }); setEmail('') } }}><input className="input" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} type="email" /><button className="btn btn-primary">Subscribe</button></form>
    </div></section>
    <footer className="footer"><div className="container">
      <div className="footer-grid">
        <div><Link to="/" className="logo">LUMIVA</Link><p className="small" style={{ marginTop: 12, maxWidth: 240 }}>Skincare that rewards your ritual. Made in Singapore.</p><div className="social"><span>IG</span><span>FB</span><span>TT</span><span>YT</span></div></div>
        <div><h4>Shop</h4><Link to="/shop">All Products</Link><Link to="/shop?sort=best">Best Sellers</Link><Link to="/shop?cat=sets">Sets &amp; Gifts</Link><Link to="/shop?cat=minis">Minis</Link></div>
        <div><h4>Skin Solutions</h4><Link to="/skin-solutions">Find your routine</Link><Link to="/learn">Learn</Link><Link to="/skin-solutions#ingredients">Ingredients</Link></div>
        <div><h4>The Ritual</h4><Link to="/ritual">Build Your Routine</Link><Link to="/product/the-lumiva-ritual-set">The Ritual Set</Link><Link to="/learn">Ritual Guide</Link></div>
        <div><h4>Glow Club</h4><Link to="/glow-club">How it works</Link><Link to="/rewards">Rewards</Link><Link to="/leaderboard">Leaderboard</Link><Link to="/app">Member app</Link></div>
        <div><h4>Help</h4><Link to="/help">FAQ</Link><Link to="/help#shipping">Shipping</Link><Link to="/help#privacy">Privacy (PDPA)</Link><Link to="/help#terms">Terms</Link><Link to="/admin">Admin portal</Link></div>
      </div>
      <div className="footer-bottom"><span>© 2026 Lumiva Pte. Ltd. All rights reserved.</span><span>Singapore (S$ SGD) · Concept build by BrillianceTech</span></div>
    </div></footer>
  </>
}
