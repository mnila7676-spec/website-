import React, { useEffect, useState } from 'react'
import { asset } from '@/lib/asset'

const KEY = 'kessora-intro-seen'
export const INTRO_EVENT = 'kessora:ready'
const WM = asset('/images/kessora/wordmark.png')

// One-time intro: black screen, the wordmark wipes open from the centre, then the
// screen splits top and bottom to reveal the site. No progress bar, no timing text.
export function Preloader() {
  const [phase, setPhase] = useState<'idle' | 'logo' | 'open' | 'done'>(() => {
    try { return sessionStorage.getItem(KEY) || window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'done' : 'idle' } catch { return 'idle' }
  })
  useEffect(() => {
    if (phase === 'done') { window.dispatchEvent(new Event(INTRO_EVENT)); return }
    document.documentElement.classList.add('preloading')
    const t1 = window.setTimeout(() => setPhase('logo'), 60)
    const t2 = window.setTimeout(() => setPhase('open'), 2300)
    const t3 = window.setTimeout(() => {
      setPhase('done')
      document.documentElement.classList.remove('preloading')
      try { sessionStorage.setItem(KEY, '1') } catch {}
      window.dispatchEvent(new Event(INTRO_EVENT))
    }, 3400)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); document.documentElement.classList.remove('preloading') }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  if (phase === 'done') return null
  return <div className={`intro ${phase}`} aria-hidden="true">
    <div className="intro-panel top" />
    <div className="intro-panel bottom" />
    <div className="intro-logo"><div className="intro-mark">
      <img src={WM} alt="" />
      <span className="shine" style={{ WebkitMaskImage: `url(${WM})`, maskImage: `url(${WM})` }} />
    </div></div>
  </div>
}
