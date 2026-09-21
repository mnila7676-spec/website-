import React, { useEffect, useState } from 'react'
import { asset } from '@/lib/asset'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '@/store/store'
import { Icon } from './Icon'
import { Modal, Drawer, TierBadge } from './ui'
import { PRODUCTS, productById, money } from '@/data/products'
import { WELCOME_POINTS } from '@/data/club'
import { useLinks } from '@/lib/links'
import { n } from '@/lib/format'

const SS = { modal: 'lumiva-modal-shown', bar: 'lumiva-bar-dismissed' }
const ss = { get: (k: string) => { try { return sessionStorage.getItem(k) } catch { return null } }, set: (k: string, v: string) => { try { sessionStorage.setItem(k, v) } catch {} } }

/* 1. Scroll modal at ~30% + 2. Floating reminder */
export function MembershipPrompts() {
  const { state } = useStore(); const nav = useNavigate(); const L = useLinks()
  const [modal, setModal] = useState(false); const [bar, setBar] = useState(false)
  const [email, setEmail] = useState(''); const [mobile, setMobile] = useState('')
  const eligible = !state.member && state.admin.scrollModalEnabled
  useEffect(() => {
    if (!eligible) return
    if (ss.get(SS.modal)) { if (!ss.get(SS.bar)) setBar(true); return }
    let fired = false
    const fire = () => { if (fired) return; fired = true; setModal(true); ss.set(SS.modal, '1'); window.removeEventListener('scroll', onScroll); clearTimeout(timer) }
    const onScroll = () => { const h = document.documentElement; const pct = (h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight)) * 100; if (pct >= state.admin.modalScrollPercent) fire() }
    // Whichever comes first: ~30% scroll, or the member has been browsing for the configured dwell time (default 30s)
    const timer = setTimeout(fire, Math.max(5, state.admin.modalDelaySeconds ?? 30) * 1000)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { window.removeEventListener('scroll', onScroll); clearTimeout(timer) }
  }, [eligible, state.admin.modalScrollPercent, state.admin.modalDelaySeconds])
  if (!eligible) return null
  const go = () => { setModal(false); setBar(false); nav(`${L.join}?email=${encodeURIComponent(email)}&mobile=${encodeURIComponent(mobile)}`) }
  const later = () => { setModal(false); if (!ss.get(SS.bar)) setBar(true) }
  return <>
    {modal && <Modal onClose={later} className="promo-modal">
      <div className="promo-grid">
        <div className="promo-copy">
          <p className="eyebrow">New member exclusive</p>
          <h2>Join Glow Club.<br />Receive 1-for-1.</h2>
          <p className="muted">Purchase one eligible skincare item and choose a second eligible item on us.</p>
          <input className="input" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} type="email" />
          <input className="input" placeholder="Mobile number" value={mobile} onChange={e => setMobile(e.target.value)} type="tel" />
          <button className="btn btn-primary btn-block" onClick={go}>Unlock My 1-for-1</button>
          <button className="link-btn" onClick={later}>Maybe later</button>
          <p className="tiny muted">Lowest-priced eligible item complimentary. One redemption per new member. Shown once per session. T&amp;Cs apply.</p>
        </div>
        <div className="promo-img"><img src={asset('/images/hero-group.jpg')} alt="Lumiva ritual" /></div>
      </div>
    </Modal>}
    {bar && !modal && <div className="promo-bar">
      <span className="promo-tag">1-for-1</span>
      <div className="promo-bar-copy"><b>Your first Glow Club reward is waiting</b><span className="tiny">Join free and choose a complimentary eligible item at checkout.</span></div>
      <input className="input" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <button className="btn btn-primary btn-sm" onClick={go}>Join &amp; Unlock</button>
      <button className="promo-bar-x" aria-label="Dismiss" onClick={() => { setBar(false); ss.set(SS.bar, '1') }}><Icon name="x" className="icon-sm" /></button>
    </div>}
  </>
}

/* 3. Gift drawer: after an eligible product enters the bag */
export const GIFT_OPTIONS = ['mini-cleanser', 'mini-serum', 'mini-cream']
export function GiftDrawer() {
  const { state, actions } = useStore(); const L = useLinks()
  const [open, setOpen] = useState<string | null>(null); const [choice, setChoice] = useState(GIFT_OPTIONS[0])
  const hasGift = state.cart.some(c => c.gift)
  const eligibleInCart = state.cart.find(c => !c.gift && productById(c.productId)?.giftEligible && !GIFT_OPTIONS.includes(c.productId))
  const canUnlock = !!state.member && !state.member.oneForOneUsed
  useEffect(() => {
    if (!state.admin.giftDrawerEnabled || hasGift || !eligibleInCart) return
    if (state.member && state.member.oneForOneUsed) return
    if (state.prompts.giftDrawerSeenFor.includes(eligibleInCart.productId)) return
    setOpen(eligibleInCart.productId); actions.prompt({ giftDrawerSeenFor: [...state.prompts.giftDrawerSeenFor, eligibleInCart.productId] })
  }, [state.cart.length])
  if (!open) return null
  const paid = productById(open)!
  const add = () => { actions.addToCart(choice, 1, true); setOpen(null) }
  return (
    <Drawer onClose={() => setOpen(null)} title="Your complimentary item" sub={canUnlock ? 'Welcome to Glow Club' : 'New-member 1-for-1'}
      footer={canUnlock ? <div className="stack"><button className="btn btn-primary btn-block" onClick={add}>Add Complimentary Item</button><button className="btn btn-light btn-block" onClick={() => setOpen(null)}>Continue without gift</button><p className="tiny muted text-center">Paid item: {paid.name} · Complimentary item: {money(0)}</p></div>
        : <div className="stack"><Link to={L.join} className="btn btn-primary btn-block" onClick={() => setOpen(null)}>Join Glow Club to unlock</Link><button className="btn btn-light btn-block" onClick={() => setOpen(null)}>Continue without gift</button><p className="tiny muted text-center">Free to join · {WELCOME_POINTS} welcome points · one complimentary item on your first eligible order.</p></div>}>
      <p className="small muted" style={{ marginBottom: 14 }}>{canUnlock ? 'Choose one eligible item below. It ships with your order at no charge.' : `${paid.name} is 1-for-1 eligible. Join Glow Club and choose one of these on us.`}</p>
      <ul className="gift-list">{GIFT_OPTIONS.map(id => { const p = productById(id)!; return <li key={id}><label className={`gift-opt ${choice === id ? 'on' : ''}`}><input type="radio" name="gift" checked={choice === id} onChange={() => setChoice(id)} /><img src={p.image} alt="" /><div><b>{p.name}</b><p className="tiny muted">{p.tagline}</p></div><span className="pill pill-success tiny">Free</span></label></li> })}</ul>
    </Drawer>
  )
}

/* 4. Reward reveal after registration */
export function RewardReveal() {
  const { state, actions, d } = useStore(); const L = useLinks()
  if (!state.member || !state.prompts.rewardReveal) return null
  const close = () => actions.prompt({ rewardReveal: false })
  return (
    <Modal onClose={close} width={520} className="reveal-modal">
      <div className="reveal">
        <span className="reveal-check"><Icon name="check" /></span>
        <h2>Your 1-for-1 is unlocked</h2>
        <p className="muted">Add one eligible product to your bag. You will choose your complimentary item before checkout.</p>
        <div className="reveal-card"><div><b>Glow Club</b><p className="small muted">{d.tier.name} member</p><p className="small copper">{n(WELCOME_POINTS)} welcome points</p></div><TierBadge tier={d.tier} size={54} /></div>
        <div className="row" style={{ justifyContent: 'center', marginTop: 16 }}><Link to={L.shop} className="btn btn-primary" onClick={close}>Start Shopping</Link><Link to={L.rewards} className="btn btn-light" onClick={close}>View My Rewards</Link></div>
      </div>
    </Modal>
  )
}
