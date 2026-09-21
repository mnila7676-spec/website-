import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from './Icon'
import { useStore } from '@/store/store'
import { ACTIVITY } from '@/data/community'
import { ago, displayName } from '@/lib/format'
import { useLinks } from '@/lib/links'

export interface FeedItem { id: string; icon: string; name: string; text: string; time: string; type: string; ts: number; you?: boolean }
export function useFeed(): FeedItem[] {
  const { state } = useStore(); const a = state.admin
  return useMemo(() => {
    const now = Date.now()
    const seeded: FeedItem[] = ACTIVITY.filter(x => (x.approved || a.approvedActivity.includes(x.id)) && !a.hiddenActivity.includes(x.id) && a.activityTypes[x.type] !== false)
      .map(x => ({ id: x.id, icon: x.icon, name: x.name, text: x.text, time: ago(now - x.minutesAgo * 60000), type: x.type, ts: now - x.minutesAgo * 60000 }))
    const mine: FeedItem[] = state.member && state.member.consent.publicActivity ? state.userActivity.filter(u => a.activityTypes[u.type] !== false).map(u => ({ id: u.id, icon: u.icon, name: displayName(state.member), text: u.text.replace(/^You /, ''), time: ago(u.ts), type: u.type, ts: new Date(u.ts).getTime(), you: true })) : []
    return [...mine, ...seeded].sort((x, y) => y.ts - x.ts)
  }, [state.admin, state.userActivity, state.member])
}

/* Desktop: slim copper marquee. Mobile: one message rotating every 6s. */
export function Ticker() {
  const { state } = useStore(); const feed = useFeed(); const L = useLinks()
  const [i, setI] = useState(0)
  useEffect(() => { const t = setInterval(() => setI(x => x + 1), 6000); return () => clearInterval(t) }, [])
  if (!state.admin.tickerEnabled || !feed.length) return null
  const items = feed.slice(0, 8); const cur = items[i % items.length]
  return (
    <div className="ticker" role="status" aria-label="Live member activity">
      <div className="ticker-live"><span className="ticker-dot" /> LIVE</div>
      <div className="ticker-track desktop-only"><div className="ticker-inner">{[...items, ...items].map((x, k) => <span key={k} className="ticker-item"><Icon name={x.icon} className="icon-sm" /><b>{x.name}</b> {x.text} <span className="ticker-time">· {x.time}</span><span className="ticker-sep">•</span></span>)}</div></div>
      <div className="ticker-single mobile-only" key={cur.id + i}><Icon name={cur.icon} className="icon-sm" /><span><b>{cur.name}</b> {cur.text} · {cur.time}</span></div>
      <Link to={L.activity} className="ticker-link desktop-only">View activity <Icon name="chevron" className="icon-sm" /></Link>
    </div>
  )
}

/* App: rounded activity card beneath the Glow Club summary */
export function ActivityCard() {
  const feed = useFeed(); const [i, setI] = useState(0); const L = useLinks()
  useEffect(() => { const t = setInterval(() => setI(x => x + 1), 6000); return () => clearInterval(t) }, [])
  if (!feed.length) return null
  const cur = feed[i % Math.min(5, feed.length)]
  return (
    <Link to={L.activity} className="act-card" key={cur.id + i}>
      <span className="act-icon"><Icon name={cur.icon} className="icon-sm" /></span>
      <span className="act-text"><b>{cur.name}</b> {cur.text} <span className="muted">· {cur.time}</span></span>
      <Icon name="chevron" className="icon-sm muted" />
    </Link>
  )
}

export function ActivityFeedList({ limit }: { limit?: number }) {
  const feed = useFeed(); const items = limit ? feed.slice(0, limit) : feed
  return <ul className="feed">{items.map(x => <li key={x.id} className="feed-item"><span className="act-icon"><Icon name={x.icon} className="icon-sm" /></span><div><p><b>{x.name}</b> {x.text}</p><p className="tiny muted">{x.time}{x.you && ' · shown with your permission'}</p></div></li>)}</ul>
}
