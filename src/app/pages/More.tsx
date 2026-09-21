import React, { useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { Icon } from '@/components/Icon'
import { ProductCard, Empty } from '@/components/ui'
import { useStore } from '@/store/store'
import { productById, PRODUCTS } from '@/data/products'
import { rewardById } from '@/data/rewards'
import { WEEKLY_CHALLENGES } from '@/data/club'
import { n, ago } from '@/lib/format'

const Head = ({ title }: { title: string }) => { const nav = useNavigate(); return <div className="screen-head"><button className="icon-btn" onClick={() => nav(-1)}><Icon name="chevron-left" /></button><h1 style={{ fontSize: 26 }}>{title}</h1><span style={{ width: 38 }} /></div> }

export function AppSaved() {
  const { state } = useStore(); const items = state.wishlist.map(productById).filter(Boolean) as typeof PRODUCTS
  return <div className="screen"><Head title="Saved" />
    <div className="sub-head" style={{ marginTop: 0 }}><h2>Saved items</h2><Link to="/app/shop">Shop →</Link></div>
    {items.length ? <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 10 }}>{items.map(p => <ProductCard key={p.id} product={p} compact />)}</div> : <p className="small muted">Tap the heart on any product to save it here.</p>}
    <div className="sub-head"><h2>Tracked rewards</h2><Link to="/app/rewards/catalogue">All →</Link></div>
    {state.savedRewards.length ? state.savedRewards.map(id => { const r = rewardById(id)!; return <Link key={id} to={`/app/rewards/${id}`} className="rcard-app"><img src={r.image} alt="" /><div><b>{r.name}</b><p>{r.blurb}</p><div className="pts"><Icon name="sun" className="icon-sm" /> {n(r.points)} pts</div></div><Icon name="chevron" className="icon-sm muted" /></Link> }) : <p className="small muted">Track a reward to see your distance to it here.</p>}
  </div>
}

export function AppAddresses() {
  const { state, actions, toast } = useStore(); const m = state.member; const [line1, setLine1] = useState(''); const [postal, setPostal] = useState('')
  if (!m) return <Navigate to="/app/profile" replace />
  return <div className="screen"><Head title="Addresses" />
    {m.addresses.map(a => <div key={a.id} className="app-card between"><div><b className="small">{a.label}</b><p className="small muted">{a.line1} {a.line2} · {a.postal}</p></div>{a.isDefault && <span className="pill tiny">Default</span>}</div>)}
    <div className="app-card"><b className="small">Add address</b><div className="stack" style={{ marginTop: 10 }}><input className="input" placeholder="Street and unit" value={line1} onChange={e => setLine1(e.target.value)} /><input className="input" placeholder="Postal code" value={postal} onChange={e => setPostal(e.target.value)} /><button className="btn btn-primary" disabled={!line1 || !postal} onClick={() => { actions.updateMember({ addresses: [...m.addresses, { id: Math.random().toString(36).slice(2), label: 'Address', line1, postal, isDefault: !m.addresses.length }] }); setLine1(''); setPostal(''); toast('Address saved') }}>Save</button></div></div>
    <div className="app-card"><b className="small">Payment</b><p className="small muted" style={{ marginTop: 4 }}>Cards and PayNow are handled by the payment gateway at checkout. No card details are stored in this concept build.</p></div>
  </div>
}

export function AppNotifications() {
  const { state, d } = useStore()
  const items: { icon: string; title: string; sub: string; to: string; time: string }[] = []
  if (state.member) {
    if (!d.checkedInToday) items.push({ icon: 'calendar', title: 'Your daily check-in is ready', sub: `Claim ${80} pts and keep your ${d.streak}-day streak`, to: '/app/daily', time: 'Today' })
    if (!d.spunToday) items.push({ icon: 'compass', title: 'Glow Spin is ready', sub: 'One spin a day, small rewards, fair odds', to: '/app/spin', time: 'Today' })
    state.redemptions.filter(r => r.status === 'pending').forEach(r => items.push({ icon: 'clock', title: `${rewardById(r.rewardId)?.name} request received`, sub: 'We will confirm within 5 working days', to: `/app/rewards/${r.rewardId}`, time: ago(r.ts) }))
    state.redemptions.filter(r => r.status === 'approved').slice(0, 2).forEach(r => items.push({ icon: 'gift', title: `${rewardById(r.rewardId)?.name} is ready to use`, sub: `Code ${r.code}`, to: '/app/profile', time: ago(r.ts) }))
    const serum = state.orders.find(o => o.items.some(i => i.productId === 'serum' || productById(i.productId)?.includes?.includes('serum')))
    if (serum) items.push({ icon: 'bell', title: 'Serum may run low soon', sub: 'Based on typical usage. Reorder in one tap.', to: '/app/routine', time: 'Reminder' })
    if (d.next) items.push({ icon: 'medal', title: `${n(d.next.min - d.lifetime)} points to ${d.next.name}`, sub: d.next.benefits[0], to: '/app/journey', time: 'Progress' })
    if (d.expiring) items.push({ icon: 'clock', title: `${n(d.expiring)} points expire in 90 days`, sub: 'Use them on a coffee, a voucher or a mini', to: '/app/rewards/catalogue', time: 'Wallet' })
    items.push({ icon: 'shield', title: WEEKLY_CHALLENGES[1].title + ' is live', sub: `${WEEKLY_CHALLENGES[1].bonus} pts and a limited badge`, to: '/app/daily', time: 'This week' })
  }
  return <div className="screen"><Head title="Notifications" />
    {items.length ? <div className="app-card" style={{ padding: '4px 14px' }}>{items.map((x, i) => <Link key={i} to={x.to} className="app-row"><span className="act-icon"><Icon name={x.icon} className="icon-sm" /></span><div style={{ flex: 1 }}><b>{x.title}</b><small>{x.sub}</small></div><span className="tiny muted">{x.time}</span></Link>)}</div> : <Empty title="Nothing yet" blurb="Join Glow Club to receive mission, reward and reorder updates." action={<Link to="/app/join" className="btn btn-primary">Join</Link>} />}
    <p className="tiny muted">Notifications follow your preferences. Marketing messages are optional.</p>
    <Link to="/app/activity" className="btn btn-light btn-block" style={{ marginTop: 10 }}>Member wins feed</Link>
  </div>
}
