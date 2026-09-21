import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '@/components/Icon'
import { Progress } from '@/components/ui'
import { useStore } from '@/store/store'
import { PRODUCTS, STEPS, productById, money, POINTS_PER_DOLLAR } from '@/data/products'
import { n } from '@/lib/format'
import { useLinks } from '@/lib/links'

export function useRoutineBuilder() {
  const { state, actions, d } = useStore()
  const [am, setAm] = useState<string[]>(state.routine.am.length ? state.routine.am : ['cleanser', 'serum', 'cream', 'spf'])
  const [pm, setPm] = useState<string[]>(state.routine.pm.length ? state.routine.pm : ['cleanser', 'serum', 'cream'])
  const all = Array.from(new Set([...am, ...pm])).map(id => productById(id)!).filter(Boolean)
  const total = all.reduce((t, p) => t + p.price, 0)
  const discounted = all.length >= 4 ? Math.round(total * 0.85) : total
  const pts = Math.round(discounted * POINTS_PER_DOLLAR * (state.member ? d.tier.multiplier : 1))
  const options = (step: string) => PRODUCTS.filter(p => p.step === step && p.category !== 'minis')
  const setStep = (slot: 'am' | 'pm', step: string, id: string | null) => { const set = slot === 'am' ? setAm : setPm; set(cur => { const rest = cur.filter(x => productById(x)?.step !== step); return id ? [...rest, id] : rest }) }
  const addAll = () => { all.forEach(p => actions.addToCart(p.id)); }
  const save = () => actions.saveRoutine(am, pm)
  return { am, pm, all, total, discounted, pts, options, setStep, addAll, save, state, d }
}

export function RoutineSlot({ slot, ids, options, setStep, log }: { slot: 'am' | 'pm'; ids: string[]; options: (s: string) => typeof PRODUCTS; setStep: (slot: 'am' | 'pm', step: string, id: string | null) => void; log?: () => void }) {
  const { state } = useStore(); const L = useLinks()
  const steps = slot === 'am' ? STEPS : STEPS.filter(s => s.key !== 'protect')
  const doneToday = state.routineLog[new Date().toISOString().slice(0, 10)]?.[slot]
  return <div className="rb-slot">
    <div className="rb-slot-head"><h3><Icon name={slot === 'am' ? 'sun' : 'moon'} className="copper" /> {slot.toUpperCase()} routine</h3>{log && (doneToday ? <span className="pill pill-success"><Icon name="check" className="icon-sm" /> Done today</span> : <button className="btn btn-copper btn-sm" onClick={log}>Mark complete · +30 pts</button>)}</div>
    {steps.map((s, i) => { const cur = ids.map(productById).find(p => p?.step === s.key); const opts = options(s.key); return <div key={s.key} className={`rb-step ${cur ? '' : 'empty'}`}>
      <span className={`rb-num ${cur ? '' : 'muted'}`}>{i + 1}</span>
      {cur ? <img src={cur.image} alt="" /> : <span style={{ width: 64, height: 64, borderRadius: 8, background: 'var(--sand)' }} />}
      <div>{cur ? <><Link to={L.product(cur.slug)}><b>{cur.name}</b></Link><small>{s.label} · {cur.tagline} · {money(cur.price)}</small></> : <><b>{s.label}</b><small>{s.blurb}</small></>}</div>
      <select className="input" style={{ width: 'auto', padding: '8px 10px', fontSize: 13 }} value={cur?.id ?? ''} onChange={e => setStep(slot, s.key, e.target.value || null)}><option value="">Skip</option>{opts.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}</select>
    </div> })}
  </div>
}

export function Ritual() {
  const rb = useRoutineBuilder(); const { actions } = useStore()
  const serum = productById('serum')!; const lastOrder = rb.state.orders.find(o => o.items.some(i => i.productId === 'serum'))
  const daysLeft = lastOrder ? Math.max(0, serum.usageDays - Math.round((Date.now() - new Date(lastOrder.ts).getTime()) / 864e5)) : null
  return <div className="container">
    <div className="page-hero"><p className="eyebrow">Routine Builder</p><h1>Build your AM / PM ritual</h1><p>Choose a product for each step, save the routine to your account and add the complete set to your bag in one tap. Saving a routine unlocks daily routine check-ins worth 30 points each.</p></div>
    <div className="rb">
      <div>
        <RoutineSlot slot="am" ids={rb.am} options={rb.options} setStep={rb.setStep} log={rb.state.routine.savedAt ? () => actions.logRoutine('am') : undefined} />
        <RoutineSlot slot="pm" ids={rb.pm} options={rb.options} setStep={rb.setStep} log={rb.state.routine.savedAt ? () => actions.logRoutine('pm') : undefined} />
      </div>
      <aside className="rb-summary">
        <h3>Your ritual</h3>
        <p className="muted small" style={{ marginBottom: 10 }}>{rb.all.length} product{rb.all.length === 1 ? '' : 's'} · {rb.all.length >= 4 ? 'Complete ritual · save 15%' : rb.all.length === 3 ? 'Add SPF to save 15% on the full set' : 'Add 2 or more products to build a set'}</p>
        {rb.all.map(p => <div key={p.id} className="rb-line"><span>{p.name}</span><span className="tnum">{money(p.price)}</span></div>)}
        {rb.all.length >= 4 && <div className="rb-line"><span className="copper">Complete ritual discount</span><span className="copper tnum">−{money(rb.total - rb.discounted)}</span></div>}
        <div className="rb-line total"><span>Total</span><span className="tnum">{money(rb.discounted)}</span></div>
        <p className="pdp-earn" style={{ marginBottom: 14 }}><Icon name="sun" className="icon-sm" /> Earn +{n(rb.pts)} Glow Points</p>
        <div className="stack"><button className="btn btn-primary btn-block" onClick={rb.addAll} disabled={!rb.all.length}>Add Routine to Bag · {money(rb.discounted)}</button><button className="btn btn-secondary btn-block" onClick={rb.save}>{rb.state.member ? 'Save routine to my account' : 'Save routine (join to sync)'}</button></div>
        {rb.state.member && rb.state.routine.savedAt && <div style={{ marginTop: 16 }}><div className="between small"><span>This week's routine check-ins</span><b>{Math.min(5, rb.d.weekRoutines)} of 5</b></div><Progress value={rb.d.weekRoutines} max={5} /><p className="tiny muted" style={{ marginTop: 6 }}>Complete 5 routines this week for a 300-point bonus.</p></div>}
        {daysLeft !== null && <div className="reminder"><Icon name="bell" /><div><b className="small">Serum may run low in {daysLeft} days</b><p className="tiny muted">Based on your typical usage. We will remind you to reorder. You control reminders in your account.</p></div></div>}
      </aside>
    </div>
    <div style={{ height: 60 }} />
  </div>
}
