import React, { useState } from 'react'
import { Routes, Route, NavLink, Link, Navigate } from 'react-router-dom'
import { Icon } from '@/components/Icon'
import { TierBadge, Progress, ProductCard, Empty, Modal } from '@/components/ui'
import { SkinProfileForm } from '@/components/forms'
import { useStore } from '@/store/store'
import { productById, money, PRODUCTS } from '@/data/products'
import { rewardById } from '@/data/rewards'
import { ACHIEVEMENTS } from '@/data/club'
import { n, fmtDate, ago } from '@/lib/format'

const NAV = [['', 'Overview', 'user'], ['orders', 'Orders', 'bag'], ['wallet', 'Rewards wallet', 'gift'], ['points', 'Point history', 'sun'], ['wishlist', 'Saved items', 'heart'], ['referrals', 'Referrals', 'users'], ['addresses', 'Addresses', 'home'], ['preferences', 'Privacy & preferences', 'settings']]

export function Account() {
  const { state } = useStore()
  if (!state.member) return <Navigate to="/sign-in" replace />
  return <div className="container">
    <div className="page-hero"><p className="eyebrow">My account</p><h1>Hello, {state.member.firstName}</h1></div>
    <div className="acct">
      <nav className="acct-nav">{NAV.map(([p, l, i]) => <NavLink key={p} to={`/account/${p}`} end={p === ''} className={({ isActive }) => isActive ? 'active' : ''}><Icon name={i} className="icon-sm" /> {l}</NavLink>)}<Link to="/app"><Icon name="phone" className="icon-sm" /> Open member app</Link></nav>
      <div><Routes>
        <Route index element={<Overview />} /><Route path="orders" element={<Orders />} /><Route path="wallet" element={<Wallet />} /><Route path="points" element={<Points />} /><Route path="wishlist" element={<Wishlist />} /><Route path="referrals" element={<Referrals />} /><Route path="addresses" element={<Addresses />} /><Route path="preferences" element={<Preferences />} />
      </Routes></div>
    </div>
    <div style={{ height: 60 }} />
  </div>
}

function Overview() {
  const { state, d } = useStore(); const m = state.member!; const [prof, setProf] = useState(false)
  const badges = Object.keys(state.achievements).length
  return <div className="stack">
    <div className="glow-panel" style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', gap: 16 }}><div><p className="eyebrow" style={{ color: '#fff', opacity: .85 }}>{d.tier.name} · Member {m.memberId}</p><div className="serif tnum" style={{ fontSize: 48, lineHeight: 1 }}>{n(d.balance)}</div><span>Glow Points{d.held > 0 && ` · ${n(d.held)} held`}</span>{d.next && <div style={{ marginTop: 12, maxWidth: 320 }}><div className="progress" style={{ background: 'rgba(255,255,255,.25)' }}><span style={{ width: `${(d.lifetime / d.next.min) * 100}%`, background: '#fff' }} /></div><span className="tiny">{n(d.next.min - d.lifetime)} points to {d.next.short}</span></div>}</div><TierBadge tier={d.tier} size={72} /></div>
    <div className="stat-grid"><div className="stat"><b className="tnum">{d.streak}</b><small>Day streak</small></div><div className="stat"><b className="tnum">{n(d.earned)}</b><small>Lifetime earned</small></div><div className="stat"><b className="tnum">{badges}</b><small>Badges unlocked</small></div><div className="stat"><b className="tnum">{state.orders.length}</b><small>Orders</small></div></div>
    <div className="two-col">
      <div className="panel"><div className="panel-head"><h3>Skin profile</h3><button className="btn btn-sm btn-secondary" onClick={() => setProf(true)}>{m.skinProfile ? 'Edit' : 'Complete · +200 pts'}</button></div>{m.skinProfile ? <p className="small">{m.skinProfile.type} · {m.skinProfile.concerns.join(', ')} · Goal: {m.skinProfile.goal}</p> : <p className="small muted">Tell us about your skin for tailored recommendations and missions.</p>}</div>
      <div className="panel"><div className="panel-head"><h3>My routine</h3><Link to="/ritual" className="link-arrow">Edit <Icon name="chevron" className="icon-sm" /></Link></div>{state.routine.savedAt ? <p className="small">AM: {state.routine.am.map(id => productById(id)?.name).join(' → ')}<br />PM: {state.routine.pm.map(id => productById(id)?.name).join(' → ')}</p> : <p className="small muted">No routine saved yet. <Link to="/ritual" className="copper">Build one</Link>.</p>}</div>
    </div>
    <div className="panel"><div className="panel-head"><h3>Recent achievements</h3><Link to="/app/achievements" className="link-arrow">All badges <Icon name="chevron" className="icon-sm" /></Link></div><div className="row" style={{ flexWrap: 'wrap' }}>{Object.entries(state.achievements).sort((a, b) => b[1].localeCompare(a[1])).slice(0, 6).map(([id, ts]) => { const a = ACHIEVEMENTS.find(x => x.id === id)!; return <span key={id} className="pill pill-gold"><Icon name={a.icon} className="icon-sm" /> {a.name}</span> })}{!badges && <p className="small muted">Badges appear here as you progress.</p>}</div></div>
    {prof && <Modal onClose={() => setProf(false)} width={560}><div style={{ padding: 32 }}><h2 style={{ fontSize: 28, marginBottom: 14 }}>Your skin profile</h2><SkinProfileForm onDone={() => setProf(false)} /></div></Modal>}
  </div>
}
function Orders() {
  const { state } = useStore()
  if (!state.orders.length) return <Empty title="No orders yet" action={<Link to="/shop" className="btn btn-primary">Shop skincare</Link>} />
  return <div>{state.orders.map(o => <div key={o.id} className="order-row"><div className="between"><div><b className="tnum">{o.id}</b> <span className="tiny muted">· {fmtDate(o.ts)}</span></div><span className={`pill tiny ${o.status === 'delivered' ? 'pill-success' : o.status === 'refunded' ? 'pill-muted' : 'pill-gold'}`}>{o.status}</span></div><div className="order-items">{o.items.map(i => <img key={i.productId + (i.gift ? 'g' : '')} src={productById(i.productId)?.image} alt="" title={productById(i.productId)?.name} />)}</div><div className="between small" style={{ marginTop: 10 }}><span className="muted">{o.items.map(i => productById(i.productId)?.name).join(', ')}</span><span><b>{money(o.total)}</b> · <span className="copper">+{n(o.pointsEarned)} pts</span></span></div>{o.status === 'delivered' && <Link to={`/product/${productById(o.items[0].productId)?.slug}`} className="tiny copper">Review for +150 pts →</Link>}</div>)}</div>
}
function Wallet() {
  const { state } = useStore()
  const active = state.redemptions.filter(r => r.status === 'approved' || r.status === 'pending'); const past = state.redemptions.filter(r => r.status === 'used' || r.status === 'fulfilled' || r.status === 'rejected')
  const Row = ({ r }: { r: typeof state.redemptions[0] }) => { const rw = rewardById(r.rewardId)!; return <div className="order-row row" style={{ gap: 14 }}><img src={rw.image} alt="" style={{ width: 56, height: 56, borderRadius: 10, objectFit: 'cover' }} /><div style={{ flex: 1 }}><b>{rw.name}</b><p className="tiny muted">{fmtDate(r.ts)} · {n(r.points)} pts · Code <span className="tnum">{r.code}</span>{r.note && ` · ${r.note}`}</p></div><span className={`pill tiny ${r.status === 'pending' ? 'pill-gold' : r.status === 'rejected' ? 'pill-muted' : r.status === 'approved' ? 'pill-success' : 'pill-muted'}`}>{r.status === 'approved' ? 'ready to use' : r.status}</span></div> }
  return <div><h3 style={{ fontSize: 24, marginBottom: 12 }}>Ready to use</h3>{active.length ? active.map(r => <Row key={r.id} r={r} />) : <p className="small muted" style={{ marginBottom: 20 }}>No active rewards. <Link to="/rewards" className="copper">Browse the marketplace</Link>.</p>}<h3 style={{ fontSize: 24, margin: '20px 0 12px' }}>History</h3>{past.map(r => <Row key={r.id} r={r} />)}<div className="panel" style={{ marginTop: 16 }}><b className="small">Saved rewards</b><div className="row" style={{ flexWrap: 'wrap', marginTop: 8 }}>{state.savedRewards.map(id => <Link key={id} to={`/rewards/${id}`} className="pill pill-outline">{rewardById(id)?.name}</Link>)}{!state.savedRewards.length && <span className="small muted">Track rewards to see them here.</span>}</div></div></div>
}
function Points() {
  const { state, d } = useStore(); const [f, setF] = useState('all')
  const list = [...state.ledger].reverse().filter(e => f === 'all' || (f === 'earn' && e.points > 0 && e.type !== 'pending') || (f === 'spend' && e.points < 0 && e.type !== 'pending') || (f === 'pending' && e.type === 'pending'))
  return <div><div className="stat-grid"><div className="stat"><b className="tnum">{n(d.balance)}</b><small>Balance</small></div><div className="stat"><b className="tnum">{n(d.earned)}</b><small>Earned</small></div><div className="stat"><b className="tnum">{n(d.redeemed)}</b><small>Redeemed</small></div><div className="stat"><b className="tnum">{n(d.held)}</b><small>Held pending approval</small></div></div>
    <p className="tiny muted" style={{ marginBottom: 12 }}>{n(d.expiring)} points expire in the next 90 days. Every adjustment is recorded here.</p>
    <div className="tabs" style={{ marginBottom: 12 }}>{['all', 'earn', 'spend', 'pending'].map(k => <button key={k} className={f === k ? 'active' : ''} onClick={() => setF(k)}>{k[0].toUpperCase() + k.slice(1)}</button>)}</div>
    <ul className="ledger">{list.map(e => <li key={e.id}><div><b className="small">{e.note}</b><p className="tiny muted">{fmtDate(e.ts)} · {e.type}{!e.leaderboardEligible && e.points > 0 ? ' · not counted for leaderboard' : ''}</p></div><span className={`amt ${e.type === 'pending' ? 'pend' : e.points > 0 ? 'pos' : 'neg'}`}>{e.points > 0 ? '+' : ''}{n(e.points)}</span></li>)}</ul></div>
}
function Wishlist() { const { state } = useStore(); const list = state.wishlist.map(productById).filter(Boolean) as typeof PRODUCTS; return list.length ? <div className="pgrid" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>{list.map(p => <ProductCard key={p.id} product={p} />)}</div> : <Empty title="No saved items" action={<Link to="/shop" className="btn btn-primary">Shop skincare</Link>} /> }
function Referrals() {
  const { state, actions } = useStore(); const m = state.member!; const [name, setName] = useState(''); const [email, setEmail] = useState('')
  return <div className="stack"><div className="panel"><h3 style={{ fontSize: 24 }}>Invite a friend</h3><p className="small muted" style={{ margin: '6px 0 14px' }}>Your friend gets 1-for-1 and 500 welcome points. You receive 500 points only after their first qualifying order. Your code: <b className="tnum">{m.referralCode}</b></p><div className="grid" style={{ gridTemplateColumns: '1fr 1fr auto', gap: 8 }}><input className="input" placeholder="Friend's name" value={name} onChange={e => setName(e.target.value)} /><input className="input" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} /><button className="btn btn-primary" disabled={!name || !email} onClick={() => { actions.refer(name, email); setName(''); setEmail('') }}>Send invite</button></div></div>
    <div className="panel"><h3 style={{ fontSize: 22, marginBottom: 10 }}>Your referrals</h3>{state.referrals.map(r => <div key={r.id} className="between" style={{ padding: '10px 0', borderBottom: '1px solid var(--line)' }}><div><b className="small">{r.name}</b><p className="tiny muted">{r.email} · {ago(r.ts)}</p></div><div className="row"><span className={`pill tiny ${r.status === 'ordered' ? 'pill-success' : r.status === 'joined' ? 'pill-gold' : 'pill-muted'}`}>{r.status === 'ordered' ? '+500 pts' : r.status}</span>{r.status !== 'ordered' && <button className="btn btn-sm btn-light" onClick={() => actions.simulateReferralOrder(r.id)} title="Concept build: simulate the friend's first order">Simulate order</button>}</div></div>)}{!state.referrals.length && <p className="small muted">No invitations yet.</p>}</div></div>
}
function Addresses() {
  const { state, actions, toast } = useStore(); const m = state.member!; const [line1, setLine1] = useState(''); const [postal, setPostal] = useState('')
  return <div className="stack">{m.addresses.map(a => <div key={a.id} className="order-row between"><div><b className="small">{a.label}</b><p className="small muted">{a.line1} {a.line2} · {a.postal}</p></div>{a.isDefault && <span className="pill tiny">Default</span>}</div>)}
    <div className="panel"><h3 style={{ fontSize: 22, marginBottom: 10 }}>Add address</h3><div className="grid" style={{ gridTemplateColumns: '2fr 1fr auto', gap: 8 }}><input className="input" placeholder="Street and unit" value={line1} onChange={e => setLine1(e.target.value)} /><input className="input" placeholder="Postal code" value={postal} onChange={e => setPostal(e.target.value)} /><button className="btn btn-primary" disabled={!line1 || !postal} onClick={() => { actions.updateMember({ addresses: [...m.addresses, { id: Math.random().toString(36).slice(2), label: 'Address', line1, postal, isDefault: !m.addresses.length }] }); setLine1(''); setPostal(''); toast('Address saved') }}>Save</button></div></div></div>
}
function Preferences() {
  const { state, actions, toast } = useStore(); const m = state.member!
  const T = ({ k, label, sub }: { k: keyof typeof m.consent; label: string; sub: string }) => <div className="switch"><div>{label}<small>{sub}</small></div><button className={`toggle ${m.consent[k] ? 'on' : ''}`} onClick={() => actions.updateMember({ consent: { ...m.consent, [k]: !m.consent[k] } })} aria-label={label} /></div>
  return <div className="stack">
    <div className="panel"><h3 style={{ fontSize: 24, marginBottom: 6 }}>Privacy & communication</h3><p className="small muted" style={{ marginBottom: 10 }}>PDPA-ready. Consent records are kept with a timestamp. Change anything, any time.</p>
      <T k="publicActivity" label="Show my wins in the member activity feed" sub={`Displayed as “${m.nickname || `${m.firstName} ${m.lastName[0]}.`}” only for verified events.`} />
      <T k="marketing" label="Ritual tips, launches and offers" sub="Email and SMS. Transactional messages are always sent." />
      <T k="push" label="Push notifications" sub="Reorder reminders, mission resets and reward updates in the app." />
      <div className="field" style={{ marginTop: 14 }}><label className="label">Public nickname (optional, reviewed before display)</label><div className="row"><input className="input" defaultValue={m.nickname ?? ''} placeholder="e.g. GlowAmelia" onBlur={e => { actions.updateMember({ nickname: e.target.value || undefined }); toast('Nickname submitted for review') }} /></div></div>
      <div className="field"><label className="label">Birthday (for your birthday gift)</label><input className="input" type="date" defaultValue={m.birthday ?? ''} onChange={e => actions.updateMember({ birthday: e.target.value })} style={{ maxWidth: 240 }} /></div>
    </div>
    <div className="panel"><h3 style={{ fontSize: 22 }}>Your data</h3><p className="small muted" style={{ margin: '6px 0 12px' }}>Export a copy of your membership data or sign out on this device.</p><div className="row"><button className="btn btn-secondary btn-sm" onClick={() => { const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'lumiva-membership.json'; a.click() }}><Icon name="download" className="icon-sm" /> Export data</button><button className="btn btn-light btn-sm" onClick={() => actions.signOut()}>Sign out</button></div></div>
  </div>
}
