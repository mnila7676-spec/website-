import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from './Icon'

/* Preview passcode for the member app and admin portal.
   This is a courtesy gate for a concept build, not real security: anything shipped to the browser can be read.
   Real access control belongs to the authenticated backend described in the proposal. */
const KEY = 'lumiva-preview-unlocked'
const HASH = 2466914090 // hash of the 4-digit preview passcode
const hash = (s: string) => { let h = 5381; for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0; return h >>> 0 }
const salted = (pin: string) => hash('lumiva:' + pin + ':glow')
const isUnlocked = () => { try { return localStorage.getItem(KEY) === '1' } catch { return false } }

export function PasscodeGate({ children, label }: { children: React.ReactNode; label: string }) {
  const [ok, setOk] = useState(isUnlocked); const [pin, setPin] = useState(''); const [err, setErr] = useState(false); const input = useRef<HTMLInputElement>(null)
  useEffect(() => { if (!ok) input.current?.focus() }, [ok])
  useEffect(() => {
    if (pin.length < 4) return
    if (salted(pin) === HASH) { try { localStorage.setItem(KEY, '1') } catch {} setOk(true) }
    else { setErr(true); const t = setTimeout(() => { setPin(''); setErr(false) }, 700); return () => clearTimeout(t) }
  }, [pin])
  if (ok) return <>{children}</>
  return <div className="gate" onClick={() => input.current?.focus()}>
    <div className={`gate-card ${err ? 'shake' : ''}`}>
      <span className="gate-logo">LUMIVA</span>
      <span className="gate-lock"><Icon name="lock" /></span>
      <h1>{label}</h1>
      <p>Private preview. Enter the 4-digit passcode to continue.</p>
      <div className="gate-dots" aria-hidden="true">{[0, 1, 2, 3].map(i => <i key={i} className={pin.length > i ? 'on' : ''} />)}</div>
      <input ref={input} className="gate-input" value={pin} onChange={e => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))} inputMode="numeric" pattern="[0-9]*" autoComplete="off" type="password" aria-label="Passcode" />
      <div className="gate-pad">{['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'].map(k => k === '' ? <span key="sp" /> : <button key={k} type="button" onClick={e => { e.stopPropagation(); setPin(p => k === 'del' ? p.slice(0, -1) : (p + k).slice(0, 4)) }}>{k === 'del' ? <Icon name="chevron-left" className="icon-sm" /> : k}</button>)}</div>
      <p className={`gate-err ${err ? 'on' : ''}`}>Incorrect passcode</p>
      <Link to="/" className="gate-back">Back to website</Link>
    </div>
  </div>
}
