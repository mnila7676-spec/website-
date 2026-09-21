import React, { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Icon } from '@/components/Icon'
import { QtyStepper, Empty, TierBadge } from '@/components/ui'
import { GIFT_OPTIONS } from '@/components/Prompts'
import { useStore } from '@/store/store'
import { productById, money, POINTS_PER_DOLLAR, FREE_SHIPPING_THRESHOLD, SHIPPING_FEE, PRODUCTS } from '@/data/products'
import { WELCOME_POINTS } from '@/data/club'
import { n, fmtDate } from '@/lib/format'
import { useLinks } from '@/lib/links'

export function CartView() {
  const { state, d, actions } = useStore(); const L = useLinks()
  const items = state.cart.map(c => ({ ...c, p: productById(c.productId)! })).filter(x => x.p)
  const canGift = state.member && !state.member.oneForOneUsed && items.some(i => !i.gift && i.p.giftEligible && !GIFT_OPTIONS.includes(i.p.id)) && !items.some(i => i.gift)
  const pts = Math.round(d.cartSubtotal * POINTS_PER_DOLLAR * (state.member ? d.tier.multiplier : 1))
  const ship = d.cartSubtotal >= FREE_SHIPPING_THRESHOLD || d.tier.key === 'platinum' ? 0 : SHIPPING_FEE
  if (!items.length) return <Empty title="Your bag is empty" blurb="Build a ritual and earn Glow Points with every product." action={<Link to={L.shop} className="btn btn-primary">Shop skincare</Link>} />
  return <div className={L.app ? '' : 'cart-layout'}>
    <div>
      {items.map(i => <div key={i.productId + (i.gift ? 'g' : '')} className="cart-item"><img src={i.p.image} alt="" /><div><h3>{i.p.name}{i.gift && <span className="pill pill-success tiny" style={{ marginLeft: 8 }}>Complimentary</span>}</h3><p className="small muted">{i.p.tagline} · {i.p.size}</p>{!i.gift && <div className="row" style={{ marginTop: 8 }}><QtyStepper small value={i.qty} onChange={v => actions.setQty(i.productId, v)} /><button className="link-btn tiny" onClick={() => actions.removeFromCart(i.productId)}>Remove</button></div>}{i.gift && <button className="link-btn tiny" onClick={() => actions.removeFromCart(i.productId)}>Remove gift</button>}</div><b className="tnum">{i.gift ? money(0) : money(i.p.price * i.qty)}</b></div>)}
      {canGift && <div className="reminder" style={{ marginTop: 16 }}><Icon name="gift" /><div><b className="small">Your 1-for-1 is unlocked</b><p className="tiny muted">Choose a complimentary item: {GIFT_OPTIONS.map(id => productById(id)!.name).join(', ')}.</p></div><button className="btn btn-sm btn-primary" onClick={() => actions.addToCart(GIFT_OPTIONS[0], 1, true)}>Add gift</button></div>}
      {!state.member && <div className="member-strip"><Icon name="sparkle" className="copper" /><span>Join Glow Club to earn <b>{n(pts)} points</b> on this order, {WELCOME_POINTS} welcome points and a 1-for-1 gift.</span><Link to={L.join} className="btn btn-sm btn-primary" style={{ marginLeft: 'auto' }}>Join</Link></div>}
      {d.cartSubtotal < FREE_SHIPPING_THRESHOLD && d.cartSubtotal > 0 && <p className="tiny muted" style={{ marginTop: 12 }}>Add {money(FREE_SHIPPING_THRESHOLD - d.cartSubtotal)} more for complimentary delivery.</p>}
    </div>
    <aside className="summary" style={L.app ? { position: 'static', marginTop: 16 } : undefined}>
      <h3>Summary</h3>
      <div className="rb-line"><span>Subtotal</span><span className="tnum">{money(d.cartSubtotal)}</span></div>
      <div className="rb-line"><span>Delivery</span><span className="tnum">{ship ? money(ship) : 'Complimentary'}</span></div>
      <div className="rb-line total"><span>Total</span><span className="tnum">{money(d.cartSubtotal + ship)}</span></div>
      {state.member && <p className="pdp-earn" style={{ margin: '6px 0 14px' }}><Icon name="sun" className="icon-sm" /> You will earn +{n(pts)} Glow Points</p>}
      <Link to={L.checkout} className="btn btn-primary btn-block btn-lg">Checkout</Link>
      <Link to={L.shop} className="btn btn-ghost btn-block" style={{ marginTop: 8 }}>Continue shopping</Link>
      {state.member && <div className="member-strip"><TierBadge tier={d.tier} size={34} /><span className="small">{d.tier.name} · {d.tier.multiplier}x points{d.tier.key === 'platinum' ? ' · free delivery' : ''}</span></div>}
    </aside>
  </div>
}
export function Cart() { return <div className="container"><div className="page-hero"><p className="eyebrow">Your bag</p><h1>Bag</h1></div><CartView /><div style={{ height: 60 }} /></div> }

export function CheckoutView() {
  const { state, d, actions } = useStore(); const L = useLinks(); const nav = useNavigate()
  const items = state.cart.map(c => ({ ...c, p: productById(c.productId)! }))
  const vouchers = state.redemptions.filter(r => r.rewardId === 'voucher-20' && r.status === 'approved')
  const express = state.redemptions.find(r => r.rewardId === 'express-delivery' && r.status === 'approved')
  const [voucher, setVoucher] = useState<string>(''); const [useExpress, setUseExpress] = useState(false); const [addr, setAddr] = useState(state.member?.addresses[0] ? `${state.member.addresses[0].line1} ${state.member.addresses[0].line2 ?? ''}, ${state.member.addresses[0].postal}` : ''); const [name, setName] = useState(state.member ? `${state.member.firstName} ${state.member.lastName}` : ''); const [email, setEmail] = useState(state.member?.email ?? ''); const [pay, setPay] = useState('card')
  const sub = d.cartSubtotal; const disc = voucher && sub >= 60 ? 20 : 0; const ship = useExpress ? 0 : sub >= FREE_SHIPPING_THRESHOLD || d.tier.key === 'platinum' ? 0 : SHIPPING_FEE; const total = Math.max(0, sub - disc + ship)
  const pts = state.member ? Math.round(sub * POINTS_PER_DOLLAR * d.tier.multiplier) : 0
  if (!items.length) return <Empty title="Nothing to check out" action={<Link to={L.shop} className="btn btn-primary">Shop skincare</Link>} />
  const place = () => { if (!name || !email || !addr) return; const v = vouchers.find(x => x.id === voucher); const o = actions.placeOrder({ voucher: v, express: useExpress, address: addr }); if (useExpress && express) actions.useRedemption(express.id); nav(`${L.base}/order/${o.id}`) }
  return <div className={L.app ? '' : 'cart-layout'}>
    <div>
      <div className="checkout-steps"><span className="on">1 Details</span><span>›</span><span className="on">2 Delivery</span><span>›</span><span className="on">3 Payment</span></div>
      {!state.member && <div className="member-strip" style={{ marginBottom: 16 }}><Icon name="sparkle" className="copper" /><span>Members earn points on this order. <Link to={L.join} className="copper">Join free</Link> or <Link to={L.signin} className="copper">sign in</Link>.</span></div>}
      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 12 }}><div className="field"><label className="label">Full name</label><input className="input" value={name} onChange={e => setName(e.target.value)} /></div><div className="field"><label className="label">Email</label><input className="input" value={email} onChange={e => setEmail(e.target.value)} /></div></div>
      <div className="field"><label className="label">Delivery address</label><input className="input" value={addr} onChange={e => setAddr(e.target.value)} placeholder="Street, unit, postal code" /></div>
      <h3 style={{ fontSize: 20, margin: '18px 0 8px' }}>Delivery</h3>
      <label className={`opt ${!useExpress ? 'on' : ''}`}><input type="radio" checked={!useExpress} onChange={() => setUseExpress(false)} /> Standard · 1 to 3 working days · {sub >= FREE_SHIPPING_THRESHOLD || d.tier.key === 'platinum' ? 'Complimentary' : money(SHIPPING_FEE)}</label>
      <label className={`opt ${useExpress ? 'on' : ''}`} style={{ opacity: express ? 1 : .6 }}><input type="radio" checked={useExpress} disabled={!express} onChange={() => setUseExpress(true)} /> Express same-day · {express ? 'Complimentary (reward in wallet)' : 'Redeem Express Delivery reward for 400 pts'}</label>
      {state.member && <><h3 style={{ fontSize: 20, margin: '18px 0 8px' }}>Rewards</h3>
        <label className={`opt ${!voucher ? 'on' : ''}`}><input type="radio" checked={!voucher} onChange={() => setVoucher('')} /> No voucher</label>
        {vouchers.map(v => <label key={v.id} className={`opt ${voucher === v.id ? 'on' : ''}`}><input type="radio" checked={voucher === v.id} onChange={() => setVoucher(v.id)} /> S$20 Lumiva Voucher · {v.code} {sub < 60 && <span className="tiny muted">(min spend S$60)</span>}</label>)}
        {!vouchers.length && <p className="tiny muted">No vouchers in your wallet. <Link to={L.reward('voucher-20')} className="copper">Redeem one for 2,000 pts</Link>.</p>}</>}
      <h3 style={{ fontSize: 20, margin: '18px 0 8px' }}>Payment</h3>
      {[['card', 'Credit or debit card'], ['paynow', 'PayNow'], ['apple', 'Apple Pay / Google Pay']].map(([k, l]) => <label key={k} className={`opt ${pay === k ? 'on' : ''}`}><input type="radio" checked={pay === k} onChange={() => setPay(k)} /> {l}</label>)}
      <div className="pay-box"><Icon name="lock" className="icon-sm" /> Payment is processed by the gateway in the live build. This concept build places a demo order without charging anything. No card details are collected here.</div>
    </div>
    <aside className="summary" style={L.app ? { position: 'static', marginTop: 16 } : undefined}>
      <h3>Order</h3>
      {items.map(i => <div key={i.productId + (i.gift ? 'g' : '')} className="rb-line"><span>{i.p.name}{i.gift ? ' (gift)' : ` × ${i.qty}`}</span><span className="tnum">{i.gift ? money(0) : money(i.p.price * i.qty)}</span></div>)}
      {disc > 0 && <div className="rb-line"><span className="copper">Voucher</span><span className="copper tnum">−{money(disc)}</span></div>}
      <div className="rb-line"><span>Delivery</span><span className="tnum">{ship ? money(ship) : 'Complimentary'}</span></div>
      <div className="rb-line total"><span>Total</span><span className="tnum">{money(total)}</span></div>
      {state.member && <p className="pdp-earn" style={{ margin: '6px 0 14px' }}><Icon name="sun" className="icon-sm" /> +{n(pts)} Glow Points on delivery</p>}
      <button className="btn btn-primary btn-block btn-lg" onClick={place} disabled={!name || !email || !addr}>Place order · {money(total)}</button>
    </aside>
  </div>
}
export function Checkout() { return <div className="container"><div className="page-hero"><p className="eyebrow">Checkout</p><h1>Almost there</h1></div><CheckoutView /><div style={{ height: 60 }} /></div> }

export function OrderConfirmView() {
  const { id } = useParams(); const { state, d } = useStore(); const L = useLinks(); const o = state.orders.find(x => x.id === id)
  if (!o) return <Empty title="Order not found" action={<Link to={L.shop} className="btn btn-primary">Shop</Link>} />
  return <div className="reveal" style={{ padding: L.app ? '24px 0' : '48px 0' }}>
    <span className="reveal-check"><Icon name="check" /></span>
    <h2>Thank you{state.member ? `, ${state.member.firstName}` : ''}</h2>
    <p className="muted">Order <b className="tnum">{o.id}</b> is being prepared. A confirmation is on its way to your inbox.</p>
    <div className="reveal-card" style={{ maxWidth: 440 }}><div style={{ textAlign: 'left' }}>{o.items.map(i => <p key={i.productId + (i.gift ? 'g' : '')} className="small">{productById(i.productId)?.name}{i.gift ? ' · complimentary' : ` × ${i.qty}`}</p>)}<p className="small" style={{ marginTop: 6 }}><b>Total {money(o.total)}</b> · {o.express ? 'Express same-day' : 'Standard delivery'}</p></div>{state.member && <div style={{ textAlign: 'center' }}><span className="tiny muted">Earned</span><div className="serif copper tnum" style={{ fontSize: 28 }}>+{n(o.pointsEarned)}</div><span className="tiny muted">pts</span></div>}</div>
    {state.member && d.nextMilestone && <p className="small muted" style={{ marginTop: 14 }}>{n(d.nextMilestone.points - d.lifetime)} points to {d.nextMilestone.name}. Review this purchase once it arrives for +150 points.</p>}
    <div className="row" style={{ justifyContent: 'center', marginTop: 18 }}><Link to={state.member ? (L.app ? '/app/profile/orders' : '/account/orders') : L.shop} className="btn btn-primary">{state.member ? 'Track order' : 'Continue shopping'}</Link><Link to={L.ritual} className="btn btn-light">Set up my routine</Link></div>
  </div>
}
export function OrderConfirm() { return <div className="container"><OrderConfirmView /></div> }
