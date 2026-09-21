import React from 'react'
import { Link, Navigate } from 'react-router-dom'
import { JoinForm, SignInForm } from '@/components/forms'
import { useStore } from '@/store/store'
import { useLinks } from '@/lib/links'
import { WELCOME_POINTS } from '@/data/club'

export function Join() {
  const { state } = useStore(); const L = useLinks()
  if (state.member) return <Navigate to={L.account} replace />
  return <div className="container" style={{ padding: '48px 0 80px' }}><div className="auth"><p className="eyebrow">Glow Club</p><h1>Join Glow Club</h1><p className="muted small" style={{ marginBottom: 20 }}>Free forever. {WELCOME_POINTS} welcome points the moment you join, 1-for-1 on your first eligible purchase and one account across the website and app.</p><JoinForm /><p className="small text-center" style={{ marginTop: 16 }}>Already a member? <Link to={L.signin} className="copper">Sign in</Link></p></div></div>
}
export function SignIn() {
  const { state } = useStore(); const L = useLinks()
  if (state.member) return <Navigate to={L.account} replace />
  return <div className="container" style={{ padding: '48px 0 80px' }}><div className="auth"><p className="eyebrow">Welcome back</p><h1>Sign in</h1><p className="muted small" style={{ marginBottom: 20 }}>Email or mobile sign-in with a one-time code. Your points, orders and routine sync everywhere.</p><SignInForm /><p className="small text-center" style={{ marginTop: 16 }}>New here? <Link to={L.join} className="copper">Join Glow Club</Link></p></div></div>
}
