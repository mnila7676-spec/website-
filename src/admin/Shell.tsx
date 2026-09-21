import React from 'react'
import { Outlet, NavLink, Link } from 'react-router-dom'
import { Icon } from '@/components/Icon'
import { useStore } from '@/store/store'

const NAV = [['/admin', 'Dashboard', 'grid', true], ['/admin/commerce', 'Commerce', 'bag', false], ['/admin/members', 'Members', 'users', false], ['/admin/challenges', 'Challenges', 'sun', false], ['/admin/rewards', 'Rewards', 'gift', false], ['/admin/community', 'Community activity', 'sparkle', false], ['/admin/campaigns', 'Campaigns', 'bell', false], ['/admin/risk', 'Risk controls', 'shield', false], ['/admin/analytics', 'Analytics', 'bar-chart', false]] as const
export function AdminShell() {
  const { state } = useStore()
  return <div className="admin">
    <aside className="admin-side"><Link to="/" className="logo">LUMIVA<small>ADMIN PORTAL</small></Link>
      <nav className="admin-nav">{NAV.map(([to, l, i, end]) => <NavLink key={to} to={to} end={end} className={({ isActive }) => isActive ? 'active' : ''}><Icon name={i} className="icon-sm" />{l}</NavLink>)}</nav>
      <div style={{ marginTop: 'auto', fontSize: 12 }}><p style={{ color: '#fff' }}>Eddie · Owner</p><p>Role: Administrator</p><p style={{ marginTop: 10 }}>{state.audit.length} audit events</p><div className="row" style={{ marginTop: 12 }}><Link to="/" className="btn btn-sm btn-light">Website</Link><Link to="/app" className="btn btn-sm btn-ghost" style={{ color: '#fff' }}>App</Link></div></div>
    </aside>
    <main className="admin-main"><Outlet /></main>
  </div>
}
