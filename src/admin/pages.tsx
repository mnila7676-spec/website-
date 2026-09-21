import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '@/components/Icon'
import { useStore } from '@/store/store'
import { PRODUCTS, productById, money } from '@/data/products'
import { REWARDS, rewardById } from '@/data/rewards'
import { MISSIONS, WEEKLY_CHALLENGES, TIERS } from '@/data/club'
import { ACTIVITY, LEADERS } from '@/data/community'
import { n, fmtDate, ago } from '@/lib/format'

const Head = ({ title, blurb, right }: { title: string; blurb: string; right?: React.ReactNode }) => <div className="admin-head"><div><h1>{title}</h1><p>{blurb}</p></div>{right}</div>
const KPI = ({ label, value, delta, down }: { label: string; value: string; delta?: string; down?: boolean }) => <div className="kpi"><small>{label}</small><b>{value}</b>{delta && <span className={`delta ${down ? 'down' : ''}`}>{delta}</span>}</div>
const Bars = ({ data, labels }: { data: number[]; labels: string[] }) => { const max = Math.max(...data); return <div className="bar-chart" style={{ marginBottom: 24 }}>{data.map((v, i) => <div key={i}><span style={{ height: `${(v / max) * 100}%` }} /><i>{labels[i]}</i></div>)}</div> }

export function Dashboard() {
  const { state, d } = useStore()
  const pending = state.redemptions.filter(r => r.status === 'pending')
  return <>
    <Head title="Dashboard" blurb={`Live overview · ${new Date().toLocaleDateString('en-SG', { weekday: 'long', day: 'numeric', month: 'long' })}`} right={<span className="status ok">All systems operational</span>} />
    <div className="kpi-grid"><KPI label="Active members (30d)" value="4,812" delta="+12.4% vs last month" /><KPI label="Repeat purchase rate" value="41%" delta="+3.1 pts" /><KPI label="Points issued (7d)" value={n(184_200 + d.earned)} delta="+8%" /><KPI label="Redemptions (7d)" value={String(312 + state.redemptions.length)} delta="+14%" /></div>
    <div className="admin-grid-2">
      <div className="admin-panel"><h3>Needs attention</h3>
        {pending.length ? pending.map(r => <div key={r.id} className="between" style={{ padding: '10px 0', borderBottom: '1px solid var(--line)', fontSize: 13.5 }}><span><b>{rewardById(r.rewardId)?.name}</b> · {n(r.points)} pts · {ago(r.ts)}</span><Link to="/admin/rewards" className="btn btn-sm btn-primary">Review</Link></div>) : <p className="small muted">No hero reward requests awaiting approval.</p>}
        <div className="between" style={{ padding: '10px 0', fontSize: 13.5 }}><span><b>1</b> winner story awaiting moderation</span><Link to="/admin/community" className="btn btn-sm btn-light">Moderate</Link></div>
        <div className="between" style={{ padding: '10px 0', fontSize: 13.5 }}><span><b>{state.orders.filter(o => o.status === 'processing').length}</b> orders processing</span><Link to="/admin/commerce" className="btn btn-sm btn-light">Fulfil</Link></div>
      </div>
      <div className="admin-panel"><h3>Membership growth · 12 weeks</h3><Bars data={[210, 260, 240, 310, 380, 350, 420, 460, 510, 480, 560, 610]} labels={['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10', 'W11', 'W12']} /><p className="tiny muted">New verified members per week. Includes website and app sign-ups.</p></div>
    </div>
    <div className="admin-panel"><h3>Recent audit events</h3><ul className="audit">{state.audit.slice(0, 6).map(a => <li key={a.id}><span className="who">{fmtDate(a.ts)} {new Date(a.ts).toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit' })}</span><span className="status neutral">{a.actor}</span><span><b>{a.action}</b> · {a.detail}</span></li>)}{!state.audit.length && <p className="small muted">Actions taken in the portal, member joins, orders and redemptions appear here with a traceable record.</p>}</ul></div>
  </>
}

export function Commerce() {
  const { state, actions } = useStore(); const [tab, setTab] = useState('products')
  return <>
    <Head title="Commerce" blurb="Products, categories, inventory, orders, refunds, fulfilment and promotional rules." right={<div className="tabs">{['products', 'orders', 'promotions'].map(t => <button key={t} className={tab === t ? 'active' : ''} onClick={() => setTab(t)}>{t[0].toUpperCase() + t.slice(1)}</button>)}</div>} />
    {tab === 'products' && <div className="admin-panel"><table className="table"><thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Rating</th><th>Points</th><th>1-for-1</th></tr></thead><tbody>{PRODUCTS.map(p => <tr key={p.id}><td><div className="row"><img src={p.image} alt="" style={{ width: 36, height: 36, borderRadius: 6, objectFit: 'cover' }} /><b>{p.name}</b></div></td><td>{p.category}</td><td>{money(p.price)}</td><td><span className={`status ${p.stock < 30 ? 'warn' : 'ok'}`}>{p.stock}</span></td><td>{p.rating} ({p.reviews})</td><td>+{p.price * 10}</td><td>{p.giftEligible ? <span className="status ok">eligible</span> : <span className="status neutral">no</span>}</td></tr>)}</tbody></table></div>}
    {tab === 'orders' && <div className="admin-panel">{state.orders.length ? <table className="table"><thead><tr><th>Order</th><th>Date</th><th>Items</th><th>Total</th><th>Points</th><th>Status</th><th></th></tr></thead><tbody>{state.orders.map(o => <tr key={o.id}><td><b>{o.id}</b></td><td>{fmtDate(o.ts)}</td><td>{o.items.map(i => productById(i.productId)?.name + (i.gift ? ' (gift)' : '')).join(', ')}</td><td>{money(o.total)}</td><td>+{n(o.pointsEarned)}</td><td><span className={`status ${o.status === 'delivered' ? 'ok' : o.status === 'refunded' ? 'bad' : 'warn'}`}>{o.status}</span></td><td><select className="input admin-inline-input" style={{ width: 'auto' }} value={o.status} onChange={e => actions.adminOrderStatus(o.id, e.target.value as any)}>{['processing', 'shipped', 'delivered', 'refunded'].map(s => <option key={s}>{s}</option>)}</select></td></tr>)}</tbody></table> : <p className="small muted">No orders on this device yet. Orders placed on the website or app appear here.</p>}</div>}
    {tab === 'promotions' && <div className="admin-panel"><h3>Promotional rules</h3><table className="table"><thead><tr><th>Rule</th><th>Detail</th><th>Status</th></tr></thead><tbody>
      <tr><td><b>New-member 1-for-1</b></td><td>Buy one eligible item, lowest-priced eligible mini complimentary. One per member.</td><td><span className="status ok">active</span></td></tr>
      <tr><td><b>Complete ritual 15% off</b></td><td>All four steps in one order.</td><td><span className="status ok">active</span></td></tr>
      <tr><td><b>Complimentary delivery</b></td><td>Orders over S$80, and all Platinum orders.</td><td><span className="status ok">active</span></td></tr>
      <tr><td><b>Points per S$1</b></td><td>10 base · Silver 1x · Gold 1.25x · Platinum 1.5x</td><td><span className="status ok">active</span></td></tr>
    </tbody></table></div>}
  </>
}

export function Members() {
  const { state, d, actions } = useStore(); const [pts, setPts] = useState(''); const [reason, setReason] = useState('')
  const rows = [...(state.member ? [{ name: `${state.member.firstName} ${state.member.lastName}`, id: state.member.memberId, tier: d.tier.short, balance: d.balance, lifetime: d.lifetime, consent: state.member.consent.publicActivity, joined: state.member.joinedAt, you: true }] : []), ...LEADERS.filter(l => !(state.demoSeeded && l.name === 'Amelia K.')).map((l, i) => ({ name: l.name, id: 'LC-' + (24000 + i * 37), tier: l.allTime > 150000 ? 'Platinum' : l.allTime > 60000 ? 'Gold' : 'Silver', balance: Math.round(l.allTime * 0.08), lifetime: l.allTime, consent: i % 4 !== 3, joined: new Date(Date.now() - (200 + i * 40) * 864e5).toISOString(), you: false }))]
  return <>
    <Head title="Members" blurb="Profiles, tiers, consent, points ledger, redemptions, activity history and account support." right={<span className="status neutral">{rows.length} shown · 4,812 total</span>} />
    <div className="admin-panel"><table className="table"><thead><tr><th>Member</th><th>ID</th><th>Tier</th><th>Balance</th><th>Lifetime</th><th>Public activity</th><th>Joined</th></tr></thead><tbody>{rows.map(r => <tr key={r.id} style={r.you ? { background: 'var(--copper-soft)' } : undefined}><td><b>{r.name}</b>{r.you && <span className="status warn" style={{ marginLeft: 8 }}>this device</span>}</td><td>{r.id}</td><td>{r.tier}</td><td>{n(r.balance)}</td><td>{n(r.lifetime)}</td><td>{r.consent ? <span className="status ok">consented</span> : <span className="status neutral">off</span>}</td><td>{fmtDate(r.joined)}</td></tr>)}</tbody></table></div>
    {state.member && <div className="admin-grid-2">
      <div className="admin-panel"><h3>Point adjustment · {state.member.firstName}</h3><p className="small muted" style={{ marginBottom: 12 }}>Every adjustment creates a ledger entry visible to the member and an audit record. Adjustments never count toward leaderboards.</p><div className="admin-form"><div><label className="label">Points (+/−)</label><input className="input" value={pts} onChange={e => setPts(e.target.value)} placeholder="e.g. 200 or -150" /></div><div><label className="label">Reason</label><input className="input" value={reason} onChange={e => setReason(e.target.value)} placeholder="Goodwill, reversal, duplicate…" /></div><button className="btn btn-primary" disabled={!pts || !reason || isNaN(+pts)} onClick={() => { actions.adminAdjust(+pts, reason); setPts(''); setReason('') }}>Apply</button></div></div>
      <div className="admin-panel"><h3>Ledger · last 8</h3><ul className="ledger">{[...state.ledger].reverse().slice(0, 8).map(e => <li key={e.id}><div><b className="small">{e.note}</b><p className="tiny muted">{fmtDate(e.ts)} · {e.type} · {e.source}</p></div><span className={`amt ${e.type === 'pending' ? 'pend' : e.points > 0 ? 'pos' : 'neg'}`}>{e.points > 0 ? '+' : ''}{n(e.points)}</span></li>)}</ul></div>
    </div>}
  </>
}

export function Challenges() {
  const { state, actions } = useStore()
  const set = (id: string, v: number) => actions.adminSet({ missionPoints: { ...state.admin.missionPoints, [id]: v } }, `mission ${id} points → ${v}`)
  return <>
    <Head title="Challenges" blurb="Create daily or weekly missions, eligibility, point values, limits, dates and completion rules." right={<button className="btn btn-primary btn-sm"><Icon name="plus" className="icon-sm" /> New mission</button>} />
    <div className="admin-panel"><h3>Daily and ongoing missions</h3><table className="table"><thead><tr><th>Mission</th><th>Cadence</th><th>Points</th><th>Limit</th><th>Status</th></tr></thead><tbody>{MISSIONS.map(m => <tr key={m.id}><td><b>{m.title}</b><p className="tiny muted">{m.blurb}</p></td><td>{m.cadence}</td><td><input className="input admin-inline-input" type="number" value={state.admin.missionPoints[m.id] ?? m.points} onChange={e => set(m.id, +e.target.value)} /></td><td>{m.cadence === 'daily' ? '1 / day' : m.cadence === 'once' ? '1 lifetime' : 'per qualifying action'}</td><td><span className="status ok">live</span></td></tr>)}</tbody></table></div>
    <div className="admin-panel"><h3>Weekly challenges</h3><table className="table"><thead><tr><th>Challenge</th><th>Tasks</th><th>Bonus</th><th>Badge</th><th>Window</th></tr></thead><tbody>{WEEKLY_CHALLENGES.map(c => <tr key={c.id}><td><b>{c.title}</b><p className="tiny muted">{c.blurb}</p></td><td>{c.tasks.map(t => `${t.label} (${t.target})`).join(' · ')}</td><td>+{c.bonus}</td><td>{c.badge ?? '—'}</td><td>Mon–Sun, resets 00:00 SGT</td></tr>)}</tbody></table></div>
    <div className="admin-panel"><h3>Controls</h3><ul className="benefit-list"><li><Icon name="check-circle" className="icon-sm" />Engagement points capped at 400 per day per member.</li><li><Icon name="check-circle" className="icon-sm" />Streak protection limited to one per calendar month.</li><li><Icon name="check-circle" className="icon-sm" />Lesson points limited to one lesson per day; review points only for verified purchases.</li><li><Icon name="check-circle" className="icon-sm" />Referral points released only after the referred member's first qualifying order.</li></ul></div>
  </>
}

export function RewardsAdmin() {
  const { state, actions } = useStore(); const [note, setNote] = useState('')
  const pending = state.redemptions.filter(r => r.status === 'pending')
  const setStock = (id: string, v: string) => actions.adminSet({ rewardStock: { ...state.admin.rewardStock, [id]: v === '' ? null : +v } }, `reward ${id} stock → ${v || 'unlimited'}`)
  return <>
    <Head title="Rewards" blurb="Catalogue, partner details, stock, redemption approval, expiry and fulfilment status." />
    <div className="admin-panel"><h3>Approval queue · hero and high-value rewards</h3>{pending.length ? pending.map(r => { const rw = rewardById(r.rewardId)!; return <div key={r.id} className="between" style={{ padding: '12px 0', borderBottom: '1px solid var(--line)', flexWrap: 'wrap' }}><div className="row"><img src={rw.image} alt="" style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover' }} /><div><b>{rw.name}</b> · {n(r.points)} pts held<p className="tiny muted">{state.member?.firstName} {state.member?.lastName} · {state.member?.memberId} · requested {ago(r.ts)} · eligibility: {rw.eligibility}</p></div></div><div className="row"><input className="input" style={{ width: 200, padding: '8px 10px' }} placeholder="Note (optional)" value={note} onChange={e => setNote(e.target.value)} /><button className="btn btn-sm btn-primary" onClick={() => { actions.adminApprove(r.id, true, note); setNote('') }}>Approve</button><button className="btn btn-sm btn-light" onClick={() => { actions.adminApprove(r.id, false, note || 'Not eligible'); setNote('') }}>Reject & release points</button></div></div> }) : <p className="small muted">Queue is empty. Requests for the Japan flight and staycation rewards appear here. Hero rewards require approval before fulfilment.</p>}</div>
    <div className="admin-panel"><table className="table"><thead><tr><th>Reward</th><th>Category</th><th>Points</th><th>Stock</th><th>Min tier</th><th>Approval</th><th>Redeemed (device)</th></tr></thead><tbody>{REWARDS.map(r => <tr key={r.id}><td><b>{r.name}</b>{r.hero && <span className="status warn" style={{ marginLeft: 6 }}>hero</span>}</td><td>{r.category}</td><td>{n(r.points)}</td><td><input className="input admin-inline-input" placeholder="∞" value={state.admin.rewardStock[r.id] ?? ''} onChange={e => setStock(r.id, e.target.value)} /></td><td>{r.minTier ?? 'all'}</td><td>{r.requiresApproval ? <span className="status warn">required</span> : <span className="status ok">instant</span>}</td><td>{state.redemptions.filter(x => x.rewardId === r.id).length}</td></tr>)}</tbody></table></div>
  </>
}

export function Community() {
  const { state, actions } = useStore(); const a = state.admin
  const toggleHide = (id: string) => actions.adminSet({ hiddenActivity: a.hiddenActivity.includes(id) ? a.hiddenActivity.filter(x => x !== id) : [...a.hiddenActivity, id] }, `activity ${id} ${a.hiddenActivity.includes(id) ? 'shown' : 'hidden'}`)
  const approve = (id: string) => actions.adminSet({ approvedActivity: [...a.approvedActivity, id] }, `activity ${id} approved`)
  const toggleType = (t: string) => actions.adminSet({ activityTypes: { ...a.activityTypes, [t]: !(a.activityTypes[t] !== false) } }, `activity type ${t} ${a.activityTypes[t] !== false ? 'disabled' : 'enabled'}`)
  return <>
    <Head title="Community activity" blurb="Approve winner stories, anonymise names, moderate content and control which event types appear." />
    <div className="admin-grid-2">
      <div className="admin-panel"><h3>Event types shown</h3>{Object.keys(a.activityTypes).map(t => <div key={t} className="switch"><div style={{ textTransform: 'capitalize' }}>{t}</div><button className={`toggle ${a.activityTypes[t] !== false ? 'on' : ''}`} onClick={() => toggleType(t)} /></div>)}</div>
      <div className="admin-panel"><h3>Ticker</h3><div className="switch"><div>Live activity ticker<small>Desktop marquee, mobile rotation, app card</small></div><button className={`toggle ${a.tickerEnabled ? 'on' : ''}`} onClick={() => actions.adminSet({ tickerEnabled: !a.tickerEnabled }, `ticker ${a.tickerEnabled ? 'off' : 'on'}`)} /></div><p className="tiny muted" style={{ marginTop: 10 }}>Names are always first name + surname initial or an approved nickname. Only verified, consented events are eligible.</p></div>
    </div>
    <div className="admin-panel"><h3>Moderation queue and feed</h3><table className="table"><thead><tr><th>Event</th><th>Type</th><th>Member</th><th>Consent</th><th>Status</th><th></th></tr></thead><tbody>{ACTIVITY.map(x => { const approved = x.approved || a.approvedActivity.includes(x.id); const hidden = a.hiddenActivity.includes(x.id); return <tr key={x.id}><td><b>{x.name}</b> {x.text}</td><td>{x.type}</td><td>{x.name}</td><td><span className="status ok">yes</span></td><td>{hidden ? <span className="status bad">hidden</span> : approved ? <span className="status ok">live</span> : <span className="status warn">pending</span>}</td><td className="row">{!approved && <button className="btn btn-sm btn-primary" onClick={() => approve(x.id)}>Approve</button>}<button className="btn btn-sm btn-light" onClick={() => toggleHide(x.id)}>{hidden ? 'Show' : 'Hide'}</button></td></tr> })}</tbody></table></div>
  </>
}

export function Campaigns() {
  const { state, actions } = useStore(); const a = state.admin
  return <>
    <Head title="Campaigns" blurb="Build popups, announcement bars, push notifications, email segments and scheduled promotions." />
    <div className="admin-grid-2">
      <div className="admin-panel"><h3>Promotional prompts</h3>
        <div className="switch"><div>Scroll modal (1-for-1)<small>Once per session at {a.modalScrollPercent}% scroll or after {a.modalDelaySeconds ?? 30}s of browsing, then a floating bar</small></div><button className={`toggle ${a.scrollModalEnabled ? 'on' : ''}`} onClick={() => actions.adminSet({ scrollModalEnabled: !a.scrollModalEnabled }, `scroll modal ${a.scrollModalEnabled ? 'off' : 'on'}`)} /></div>
        <div className="switch"><div>Gift drawer<small>After an eligible product enters the bag</small></div><button className={`toggle ${a.giftDrawerEnabled ? 'on' : ''}`} onClick={() => actions.adminSet({ giftDrawerEnabled: !a.giftDrawerEnabled }, `gift drawer ${a.giftDrawerEnabled ? 'off' : 'on'}`)} /></div>
        <div className="field" style={{ marginTop: 12 }}><label className="label">Modal trigger · scroll depth %</label><input type="range" min={10} max={80} value={a.modalScrollPercent} onChange={e => actions.adminSet({ modalScrollPercent: +e.target.value }, `modal scroll → ${e.target.value}%`)} style={{ width: '100%', accentColor: 'var(--copper)' }} /></div>
        <div className="field"><label className="label">Modal trigger · browsing time (seconds)</label><input type="range" min={5} max={120} step={5} value={a.modalDelaySeconds ?? 30} onChange={e => actions.adminSet({ modalDelaySeconds: +e.target.value }, `modal delay → ${e.target.value}s`)} style={{ width: '100%', accentColor: 'var(--copper)' }} /></div>
        <p className="tiny muted">Frequency and trust: shown once per session, dismissal remembered, full terms displayed, never claims a reward was won unless genuinely earned.</p></div>
      <div className="admin-panel"><h3>Scheduled</h3><table className="table"><thead><tr><th>Campaign</th><th>Channel</th><th>Segment</th><th>When</th><th>Status</th></tr></thead><tbody>
        <tr><td><b>7-Day Barrier Reset</b></td><td>Push + email</td><td>Members with saved routine</td><td>Mon 09:00</td><td><span className="status ok">live</span></td></tr>
        <tr><td><b>Reorder reminder · serum</b></td><td>Push</td><td>Serum buyers, day 38</td><td>Rolling</td><td><span className="status ok">live</span></td></tr>
        <tr><td><b>Gold tier welcome</b></td><td>Email</td><td>New Gold members</td><td>On upgrade</td><td><span className="status ok">live</span></td></tr>
        <tr><td><b>Japan reward spotlight</b></td><td>Announcement bar</td><td>All visitors</td><td>1–14 Oct</td><td><span className="status warn">scheduled</span></td></tr>
      </tbody></table></div>
    </div>
  </>
}

export function Risk() {
  const { state } = useStore()
  return <>
    <Head title="Risk controls" blurb="Audit logs, role permissions, suspicious activity review, point reversals and duplicate-account checks." />
    <div className="kpi-grid"><KPI label="Flags open" value="3" /><KPI label="Reversals (30d)" value="12" /><KPI label="Duplicate checks" value="41" delta="2 merged" /><KPI label="Roles" value="4" /></div>
    <div className="admin-grid-2">
      <div className="admin-panel"><h3>Suspicious activity</h3><table className="table"><thead><tr><th>Signal</th><th>Member</th><th>Action</th></tr></thead><tbody><tr><td>Rapid repeat check-ins from 3 devices</td><td>LC-25113</td><td><span className="status warn">review</span></td></tr><tr><td>Referral loop (self-referral pattern)</td><td>LC-24990</td><td><span className="status bad">points held</span></td></tr><tr><td>Review on non-purchased product</td><td>LC-25201</td><td><span className="status neutral">no points issued</span></td></tr></tbody></table></div>
      <div className="admin-panel"><h3>Roles and permissions</h3><table className="table"><thead><tr><th>Role</th><th>Can</th></tr></thead><tbody><tr><td><b>Administrator</b></td><td>Everything, including hero reward approval and role management</td></tr><tr><td><b>Operations</b></td><td>Orders, fulfilment, reward stock, redemption fulfilment</td></tr><tr><td><b>Community</b></td><td>Moderate activity, approve nicknames, campaigns</td></tr><tr><td><b>Support</b></td><td>View members, small point adjustments (≤ 500) with reason</td></tr></tbody></table></div>
    </div>
    <div className="admin-panel"><h3>Audit log</h3><ul className="audit">{state.audit.map(a => <li key={a.id}><span className="who">{fmtDate(a.ts)} {new Date(a.ts).toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit' })}</span><span className="status neutral">{a.actor}</span><span><b>{a.action}</b> · {a.detail}</span></li>)}{!state.audit.length && <p className="small muted">No events yet on this device.</p>}</ul></div>
  </>
}

export function Analytics() {
  return <>
    <Head title="Analytics" blurb="Membership growth, repeat purchase, challenge completion, reward redemption, referrals and retention." />
    <div className="kpi-grid"><KPI label="Visitor → member" value="6.8%" delta="+0.9 pts" /><KPI label="30-day active" value="62%" delta="+4 pts" /><KPI label="Challenge completion" value="48%" delta="+6 pts" /><KPI label="Member revenue share" value="71%" delta="+5 pts" /></div>
    <div className="admin-grid-2">
      <div className="admin-panel"><h3>Conversion funnel · this month</h3><ul className="funnel">{[['Visitors', 42800, 100], ['Product views', 26100, 61], ['Added to bag', 6400, 15], ['Joined Glow Club', 2900, 6.8], ['Checked out', 2100, 4.9]].map(([l, v, p]) => <li key={l as string}><span>{l}</span><div className="bar"><span style={{ width: `${p}%` }} /></div><b className="tnum">{n(v as number)}</b></li>)}</ul></div>
      <div className="admin-panel"><h3>Redemptions by category</h3><Bars data={[312, 188, 64, 22]} labels={['Everyday', 'Beauty', 'Experiences', 'Travel']} /><p className="tiny muted">Breakage this quarter: 11%. Average fulfilment time 1.8 days.</p></div>
      <div className="admin-panel"><h3>Retention cohorts</h3><table className="table"><thead><tr><th>Cohort</th><th>D30</th><th>D60</th><th>D90</th></tr></thead><tbody>{[['Jun', 68, 54, 47], ['Jul', 71, 58, 49], ['Aug', 74, 61, '—'], ['Sep', 77, '—', '—']].map(r => <tr key={r[0] as string}><td>{r[0]}</td><td>{r[1]}%</td><td>{r[2]}{r[2] !== '—' ? '%' : ''}</td><td>{r[3]}{r[3] !== '—' ? '%' : ''}</td></tr>)}</tbody></table></div>
      <div className="admin-panel"><h3>Trust</h3><ul className="funnel">{[['Opt-out rate', 1.2, 12], ['Complaints / 1k members', 0.8, 8], ['Fraud flags / 1k', 0.6, 6], ['Support resolution (hrs)', 6, 30]].map(([l, v, p]) => <li key={l as string}><span>{l}</span><div className="bar"><span style={{ width: `${p}%` }} /></div><b className="tnum">{v}</b></li>)}</ul></div>
    </div>
  </>
}
