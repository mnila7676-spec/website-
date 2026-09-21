import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useStore } from '@/store/store'
import { Icon } from './Icon'
import { CONCERNS } from '@/data/products'
import { WELCOME_POINTS } from '@/data/club'

export function JoinForm({ onDone, compact }: { onDone?: () => void; compact?: boolean }) {
  const { actions, state } = useStore(); const nav = useNavigate(); const [sp] = useSearchParams()
  const [f, setF] = useState({ firstName: '', lastName: '', email: sp.get('email') ?? '', mobile: sp.get('mobile') ?? '', marketing: true, publicActivity: false, terms: false })
  const [err, setErr] = useState('')
  const set = (k: string, v: any) => setF(x => ({ ...x, [k]: v }))
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!f.firstName.trim() || !f.lastName.trim()) return setErr('Please add your name.')
    if (!/^\S+@\S+\.\S+$/.test(f.email)) return setErr('Please enter a valid email.')
    if (f.mobile.replace(/\D/g, '').length < 8) return setErr('Please enter a valid mobile number.')
    if (!f.terms) return setErr('Please accept the Glow Club terms.')
    actions.join({ firstName: f.firstName.trim(), lastName: f.lastName.trim(), email: f.email.trim(), mobile: f.mobile.trim(), consent: { marketing: f.marketing, publicActivity: f.publicActivity, push: true } })
    onDone ? onDone() : nav(-1)
  }
  if (state.member) return <p className="muted">You are already a member.</p>
  return (
    <form onSubmit={submit} className="join-form">
      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div className="field"><label className="label">First name</label><input className="input" value={f.firstName} onChange={e => set('firstName', e.target.value)} autoComplete="given-name" /></div>
        <div className="field"><label className="label">Last name</label><input className="input" value={f.lastName} onChange={e => set('lastName', e.target.value)} autoComplete="family-name" /></div>
      </div>
      <div className="field"><label className="label">Email</label><input className="input" type="email" value={f.email} onChange={e => set('email', e.target.value)} autoComplete="email" /></div>
      <div className="field"><label className="label">Mobile number</label><input className="input" type="tel" value={f.mobile} onChange={e => set('mobile', e.target.value)} placeholder="+65" autoComplete="tel" /></div>
      <label className="checkbox"><input type="checkbox" checked={f.marketing} onChange={e => set('marketing', e.target.checked)} /> <span>Send me ritual tips, new launches and exclusive rewards. You can opt out any time.</span></label>
      <label className="checkbox"><input type="checkbox" checked={f.publicActivity} onChange={e => set('publicActivity', e.target.checked)} /> <span>Show my wins in the member activity feed as "{f.firstName || 'First name'} {f.lastName?.[0] ?? 'L'}."</span></label>
      <label className="checkbox"><input type="checkbox" checked={f.terms} onChange={e => set('terms', e.target.checked)} /> <span>I accept the Glow Club terms and the privacy notice (PDPA). Your data is used to run your membership and, if you agree, to personalise offers.</span></label>
      {err && <p className="form-err">{err}</p>}
      <button className="btn btn-primary btn-lg btn-block" type="submit">Join Glow Club · {WELCOME_POINTS} welcome points</button>
      {!compact && <p className="tiny muted text-center" style={{ marginTop: 10 }}>New members receive 1-for-1 on their first eligible purchase. Lowest-priced eligible item complimentary. One redemption per member.</p>}
    </form>
  )
}

export function SignInForm({ onDone }: { onDone?: () => void }) {
  const { actions } = useStore(); const nav = useNavigate()
  const [email, setEmail] = useState(''); const [sent, setSent] = useState(false); const [code, setCode] = useState('')
  const finish = () => { actions.signInDemo(); onDone ? onDone() : nav(-1) }
  return (
    <div className="join-form">
      {!sent ? <>
        <div className="field"><label className="label">Email or mobile</label><input className="input" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" /></div>
        <button className="btn btn-primary btn-block" onClick={() => setSent(true)}>Send sign-in code</button>
        <p className="tiny muted text-center" style={{ marginTop: 10 }}>We send a one-time code. No passwords to remember.</p>
      </> : <>
        <p className="small muted" style={{ marginBottom: 12 }}>Enter the 6-digit code sent to <b>{email || 'your email'}</b>. In this concept build any code works and signs you in as the demo member.</p>
        <div className="field"><input className="input tnum" value={code} onChange={e => setCode(e.target.value)} placeholder="••••••" maxLength={6} style={{ letterSpacing: '.3em', textAlign: 'center', fontSize: 20 }} /></div>
        <button className="btn btn-primary btn-block" onClick={finish}>Verify and sign in</button>
      </>}
      <div className="or"><span>or</span></div>
      <button className="btn btn-secondary btn-block" onClick={finish}><Icon name="sparkle" className="icon-sm copper" /> Explore as Amelia (demo member)</button>
    </div>
  )
}

export function SkinProfileForm({ onDone }: { onDone?: () => void }) {
  const { state, actions } = useStore(); const p = state.member?.skinProfile
  const [type, setType] = useState(p?.type ?? 'Combination'); const [concerns, setConcerns] = useState<string[]>(p?.concerns ?? []); const [goal, setGoal] = useState(p?.goal ?? '')
  const toggle = (k: string) => setConcerns(c => c.includes(k) ? c.filter(x => x !== k) : c.length < 3 ? [...c, k] : c)
  return (
    <div className="join-form">
      <div className="field"><label className="label">Skin type</label><div className="chips">{['Dry', 'Normal', 'Combination', 'Oily', 'Sensitive'].map(t => <button key={t} type="button" className={`chip ${type === t ? 'active' : ''}`} onClick={() => setType(t)}>{t}</button>)}</div></div>
      <div className="field"><label className="label">Top concerns (up to 3)</label><div className="chips">{CONCERNS.map(c => <button key={c.key} type="button" className={`chip ${concerns.includes(c.key) ? 'active' : ''}`} onClick={() => toggle(c.key)}>{c.label}</button>)}</div></div>
      <div className="field"><label className="label">Your goal</label><input className="input" value={goal} onChange={e => setGoal(e.target.value)} placeholder="e.g. Even, radiant tone" /></div>
      <button className="btn btn-primary btn-block" onClick={() => { actions.completeSkinProfile({ type, concerns, goal: goal || 'Healthy, radiant skin' }); onDone?.() }}>Save skin profile</button>
    </div>
  )
}

export function ReviewForm({ productId, onDone }: { productId: string; onDone?: () => void }) {
  const { actions, state } = useStore(); const [rating, setRating] = useState(5); const [text, setText] = useState('')
  const verified = state.orders.some(o => o.items.some(i => i.productId === productId))
  return (
    <div className="join-form">
      <div className="field"><label className="label">Your rating</label><div className="row">{[1, 2, 3, 4, 5].map(r => <button key={r} type="button" className="star-btn" onClick={() => setRating(r)} aria-label={`${r} stars`}><Icon name="star" className={r <= rating ? 'star-on' : ''} /></button>)}</div></div>
      <div className="field"><label className="label">Your review</label><textarea className="input" rows={4} value={text} onChange={e => setText(e.target.value)} placeholder="What changed for your skin? How does it feel and layer?" /></div>
      <p className="tiny muted" style={{ marginBottom: 12 }}>{verified ? 'Verified purchase · earns 150 Glow Points.' : 'Points are awarded for verified purchases only.'}</p>
      <button className="btn btn-primary btn-block" disabled={text.trim().length < 20} onClick={() => { actions.addReview(productId, rating, text.trim()); onDone?.() }}>Submit review</button>
    </div>
  )
}
