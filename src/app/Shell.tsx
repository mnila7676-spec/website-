import React, { useEffect, useState } from 'react'
import { Outlet, NavLink, Link, useLocation } from 'react-router-dom'
import { Icon } from '@/components/Icon'
import { GiftDrawer, RewardReveal } from '@/components/Prompts'
import { useStore } from '@/store/store'
import { Modal } from '@/components/ui'
import { ACHIEVEMENTS } from '@/data/club'
import { Sparkles } from './pages/Spin'

const TABS = [['/app', 'Home', 'home', true], ['/app/shop', 'Shop', 'grid', false], ['/app/routine', 'Routine', 'route', false], ['/app/rewards', 'Rewards', 'sparkle', false], ['/app/profile', 'Profile', 'user', false]] as const

export function AppShell() {
  const { state, d } = useStore(); const loc = useLocation()
  const [time, setTime] = useState(new Date())
  useEffect(() => { const t = setInterval(() => setTime(new Date()), 30000); return () => clearInterval(t) }, [])
  const { actions } = useStore()
  const unseen = state.member ? Object.keys(state.achievements).filter(id => !state.seenAchievements.includes(id)) : []
  const mounted = React.useRef(false)
  useEffect(() => { if (!mounted.current) { mounted.current = true; if (unseen.length && (state.demoSeeded || unseen.length > 3)) actions.markAchievementsSeen(unseen) } }, [])
  const celebrate = unseen.length && mounted.current ? ACHIEVEMENTS.find(a => a.id === unseen[0]) : null
  return <div className="app-stage">
    <aside className="app-aside">
      <p className="eyebrow">Lumiva member app</p>
      <h1>Glow Club, in your hand</h1>
      <p>An installable web app that shares one account, points wallet and activity history with the website. Open this URL on your phone and add it to your home screen.</p>
      <ul className="kv-list"><li><Icon name="check-circle" className="icon-sm" />Personalised home, shop, routine builder and smart reorder reminders</li><li><Icon name="check-circle" className="icon-sm" />Daily Glow missions, streaks and weekly challenges</li><li><Icon name="check-circle" className="icon-sm" />Journey milestones, achievements, rewards and leaderboard</li><li><Icon name="check-circle" className="icon-sm" />Membership card, wallet, point history and privacy controls</li></ul>
      <div className="row" style={{ marginTop: 14 }}><Link to="/" className="btn btn-secondary btn-sm">Back to website</Link><Link to="/admin" className="btn btn-ghost btn-sm">Admin portal</Link></div>
      <p className="tiny muted" style={{ marginTop: 14 }}>{state.member ? `Signed in as ${state.member.firstName} · ${d.balance.toLocaleString()} pts` : 'Not signed in. Join or use the demo member from the Profile tab.'}</p>
    </aside>
    <div className="phone"><div className="phone-screen">
      <div className="phone-notch" />
      <div className="status-bar"><span>{time.getHours() % 12 || 12}:{String(time.getMinutes()).padStart(2, '0')}</span><span style={{ fontSize: 11 }}>●●● ᯤ ▮</span></div>
      <div className="phone-scroll"><Outlet /></div>
      <nav className="tabbar">{TABS.map(([to, l, i, end]) => <NavLink key={to} to={to} end={end} className={({ isActive }) => isActive || (!end && loc.pathname.startsWith(to)) ? 'active' : ''}><Icon name={i} />{l}</NavLink>)}</nav>
      <div className="home-bar" />
      <GiftDrawer /><RewardReveal />
      {celebrate && <Modal className="ach" width={340} onClose={() => actions.markAchievementsSeen([celebrate.id])}><div className="ach-modal"><Sparkles count={18} /><span className="ring"><Icon name={celebrate.icon} className="icon-lg" /></span><small>Badge unlocked</small><h2>{celebrate.name}</h2><p>{celebrate.blurb}</p><div className="row" style={{ justifyContent: 'center', marginTop: 16 }}><Link to="/app/achievements" className="btn btn-light btn-sm" onClick={() => actions.markAchievementsSeen([celebrate.id])}>View collection</Link><button className="btn btn-sm" style={{ background: '#f0d8a8', color: '#4f1530' }} onClick={() => actions.markAchievementsSeen([celebrate.id])}>Continue</button></div></div></Modal>}
    </div></div>
  </div>
}
