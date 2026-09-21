import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from './Icon'
import { useStore } from '@/store/store'
import { useLinks } from '@/lib/links'
import { cx, n } from '@/lib/format'
import type { Product } from '@/data/products'
import { money, POINTS_PER_DOLLAR } from '@/data/products'
import type { Reward } from '@/data/rewards'
import type { Tier } from '@/data/club'

export function Toasts() {
  const { toasts } = useStore()
  return <div className="toast-wrap" aria-live="polite">{toasts.map(t => <div key={t.id} className={cx('toast', t.copper && 'copper')}><Icon name={t.icon ?? 'sparkle'} className="icon-sm" />{t.msg}</div>)}</div>
}

export function Stars({ rating, count, className }: { rating: number; count?: number; className?: string }) {
  return <span className={cx('stars', className)}><Icon name="star" /> {rating.toFixed(1)}{count !== undefined && <span className="muted"> ({count})</span>}</span>
}

export function Progress({ value, max, variant = '' }: { value: number; max: number; variant?: string }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100))
  return <div className={cx('progress', variant)}><span style={{ width: pct + '%' }} /></div>
}

export function Avatar({ initials, variant = '', size }: { initials: string; variant?: string; size?: number }) {
  return <span className={cx('avatar', variant)} style={size ? { width: size, height: size, fontSize: size / 2.8 } : undefined}>{initials}</span>
}

export function TierBadge({ tier, size = 56 }: { tier: Tier; size?: number }) {
  const g = tier.key === 'gold' ? 'linear-gradient(135deg,#e6c98a,#c9a55e 60%,#a07c34)' : tier.key === 'platinum' ? 'linear-gradient(135deg,#e8e6e2,#b9b4ad 60%,#8d8a86)' : 'linear-gradient(135deg,#d9d6d1,#b9b4ad 60%,#9a958f)'
  return <span className="tier-badge" style={{ width: size, height: size, background: g, fontSize: size * 0.42 }}><span className="serif">L</span></span>
}

export function PointsPill({ dark }: { dark?: boolean }) {
  const { state, d } = useStore(); const L = useLinks()
  if (!state.member) return <Link to={L.join} className={cx('pill', dark ? 'pill-dark' : 'pill-outline')}><Icon name="sparkle" className="icon-sm copper" /> Join Glow Club</Link>
  return <Link to={L.glow} className={cx('pill', dark ? 'pill-dark' : 'pill-outline')} title="Glow Points balance"><Icon name="sun" className="icon-sm copper" /> <span className="tnum">{n(d.balance)} pts</span></Link>
}

export function SectionHead({ eyebrow, title, blurb, action, center }: { eyebrow?: string; title: React.ReactNode; blurb?: string; action?: React.ReactNode; center?: boolean }) {
  return <div className={cx('section-head', center && 'center')}><div>{eyebrow && <p className="eyebrow">{eyebrow}</p>}<h2>{title}</h2>{blurb && <p className="muted section-blurb">{blurb}</p>}</div>{action}</div>
}

export function QtyStepper({ value, onChange, small }: { value: number; onChange: (v: number) => void; small?: boolean }) {
  return <div className={cx('qty', small && 'small')}><button aria-label="Decrease" onClick={() => onChange(value - 1)}><Icon name="minus" className="icon-sm" /></button><span className="tnum">{value}</span><button aria-label="Increase" onClick={() => onChange(value + 1)}><Icon name="plus" className="icon-sm" /></button></div>
}

export function ProductCard({ product, compact, className }: { product: Product; compact?: boolean; className?: string }) {
  const { state, actions, d } = useStore(); const L = useLinks()
  const wished = state.wishlist.includes(product.id)
  const basePts = product.price * POINTS_PER_DOLLAR; const pts = state.member ? Math.round(basePts * d.tier.multiplier) : basePts
  return (
    <article className={cx('pcard', compact && 'compact', className)}>
      <Link to={L.product(product.slug)} className="pcard-img"><img src={product.image} alt={product.name} loading="lazy" />{product.badge && <span className="pcard-badge">{product.badge}</span>}</Link>
      <button className={cx('pcard-wish', wished && 'on')} aria-label="Save" onClick={() => actions.toggleWish(product.id)}><Icon name={wished ? 'heart-fill' : 'heart'} className="icon-sm" /></button>
      <div className="pcard-body">
        <Link to={L.product(product.slug)}><h3>{product.name}</h3></Link>
        <p className="muted small">{product.tagline}</p>
        <div className="pcard-row">
          <div><span className="pcard-price">{money(product.price)}</span>{product.compareAt && <span className="pcard-compare">{money(product.compareAt)}</span>}</div>
          <button className="pcard-add" aria-label="Add to bag" onClick={() => actions.addToCart(product.id)}><Icon name="plus" className="icon-sm" /></button>
        </div>
        <div className="pcard-meta"><Stars rating={product.rating} count={compact ? undefined : product.reviews} /><span className="pill tiny">+{n(pts)} pts</span></div>
      </div>
    </article>
  )
}

export function RewardCard({ reward, horizontal }: { reward: Reward; horizontal?: boolean }) {
  const { state, actions, d } = useStore(); const L = useLinks()
  const saved = state.savedRewards.includes(reward.id); const pct = Math.min(100, (d.available / reward.points) * 100)
  return (
    <article className={cx('rcard', horizontal && 'horizontal', reward.hero && 'hero')}>
      <Link to={L.reward(reward.id)} className="rcard-img"><img src={reward.image} alt={reward.name} loading="lazy" /></Link>
      <div className="rcard-body">
        <Link to={L.reward(reward.id)}><h3>{reward.name}</h3></Link>
        <p className="muted small">{reward.blurb}</p>
        <div className="rcard-pts"><Icon name="sun" className="icon-sm copper" /> {reward.points ? `${n(reward.points)} pts` : 'Tier benefit'}</div>
        {reward.hero && state.member && <div className="rcard-progress"><Progress value={d.available} max={reward.points} /><span className="tiny muted tnum">{n(d.available)} / {n(reward.points)} pts</span></div>}
        {!horizontal && !reward.hero && state.member && pct < 100 && <p className="tiny muted">{n(reward.points - d.available)} pts to go</p>}
      </div>
      <button className={cx('rcard-save', saved && 'on')} aria-label="Save reward" onClick={() => actions.saveReward(reward.id)}><Icon name={saved ? 'heart-fill' : 'heart'} className="icon-sm" /></button>
    </article>
  )
}

export function Modal({ onClose, children, width, className }: { onClose: () => void; children: React.ReactNode; width?: number; className?: string }) {
  useEffect(() => { const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose(); document.addEventListener('keydown', k); document.body.style.overflow = 'hidden'; return () => { document.removeEventListener('keydown', k); document.body.style.overflow = '' } }, [onClose])
  return <><div className="overlay" onClick={onClose} /><div className={cx('modal', className)} role="dialog" aria-modal="true" style={width ? { width: `min(${width}px, calc(100% - 32px))` } : undefined}><button className="modal-close" aria-label="Close" onClick={onClose}><Icon name="x" className="icon-sm" /></button>{children}</div></>
}
export function Drawer({ onClose, title, sub, children, footer }: { onClose: () => void; title: string; sub?: string; children: React.ReactNode; footer?: React.ReactNode }) {
  useEffect(() => { document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = '' } }, [])
  return <><div className="overlay" onClick={onClose} /><aside className="drawer" role="dialog" aria-modal="true"><div className="drawer-head between"><div><h3 style={{ fontSize: 24 }}>{title}</h3>{sub && <p className="muted small">{sub}</p>}</div><button className="modal-close" style={{ position: 'static' }} aria-label="Close" onClick={onClose}><Icon name="x" className="icon-sm" /></button></div><div className="drawer-body">{children}</div>{footer && <div className="drawer-foot">{footer}</div>}</aside></>
}
export function Empty({ title, blurb, action }: { title: string; blurb?: string; action?: React.ReactNode }) { return <div className="empty"><h3>{title}</h3>{blurb && <p>{blurb}</p>}{action && <div style={{ marginTop: 16 }}>{action}</div>}</div> }
export function BackButton({ to, label = 'Back' }: { to?: string; label?: string }) { const L = useLinks(); return <Link to={to ?? L.home} className="back-btn"><Icon name="chevron-left" className="icon-sm" /> {label}</Link> }
