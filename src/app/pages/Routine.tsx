import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '@/components/Icon'
import { useStore } from '@/store/store'
import { useRoutineBuilder, RoutineSlot } from '@/site/pages/Ritual'
import { productById, money } from '@/data/products'
import { n } from '@/lib/format'

export function AppRoutine() {
  const rb = useRoutineBuilder(); const { actions, state, d } = useStore(); const [slot, setSlot] = useState<'am' | 'pm'>(new Date().getHours() < 15 ? 'am' : 'pm')
  const ids = slot === 'am' ? rb.am : rb.pm; const ready = ids.length
  const serumOrder = state.orders.find(o => o.items.some(i => i.productId === 'serum' || productById(i.productId)?.includes?.includes('serum')))
  const daysLeft = serumOrder ? Math.max(0, 45 - Math.round((Date.now() - new Date(serumOrder.ts).getTime()) / 864e5)) : null
  const nextRefill = new Date(Date.now() + (daysLeft ?? 30) * 864e5).toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric' })
  return <div className="screen rb-app">
    <div className="screen-head"><h1>My Routine <Icon name="info" className="icon-sm muted" /></h1><Link to="/app/bag" className="icon-btn"><Icon name="bag" />{d.cartCount > 0 && <span className="count">{d.cartCount}</span>}</Link></div>
    <div className="tabs full" style={{ marginBottom: 12 }}><button className={slot === 'am' ? 'active' : ''} onClick={() => setSlot('am')}><Icon name="sun" className="icon-sm" /> AM</button><button className={slot === 'pm' ? 'active' : ''} onClick={() => setSlot('pm')}><Icon name="moon" className="icon-sm" /> PM</button></div>
    <p className="small" style={{ marginBottom: 8 }}><b>{ready} of {slot === 'am' ? 4 : 3} products ready</b>{state.routine.savedAt ? '' : ' · save to unlock daily check-ins'}</p>
    <RoutineSlot slot={slot} ids={ids} options={rb.options} setStep={rb.setStep} log={state.routine.savedAt ? () => actions.logRoutine(slot) : undefined} />
    {daysLeft !== null && <div className="reminder"><Icon name="bell" /><div style={{ flex: 1 }}><b className="small">{daysLeft > 0 ? `Serum may run low in ${daysLeft} days` : 'Time to reorder your serum'}</b><p className="tiny muted">We'll remind you to reorder.</p></div><Icon name="chevron" className="icon-sm muted" /></div>}
    <div className="between small" style={{ margin: '14px 0 10px' }}><span className="muted">Next refill estimate: <b style={{ color: 'var(--ink)' }}>{nextRefill}</b></span><Icon name="calendar" className="icon-sm muted" /></div>
    <button className="btn btn-primary btn-lg btn-block" onClick={rb.addAll} disabled={!rb.all.length}>Add Routine to Bag · {money(rb.discounted)}</button>
    <button className="btn btn-secondary btn-block" style={{ marginTop: 8 }} onClick={rb.save}>Save routine · earn 30 pts per check-in</button>
    <p className="tiny text-center copper" style={{ marginTop: 8 }}><Icon name="sun" className="icon-sm" /> Earn +{n(rb.pts)} points{rb.all.length >= 4 ? ' · complete ritual saves 15%' : ''}</p>
  </div>
}
