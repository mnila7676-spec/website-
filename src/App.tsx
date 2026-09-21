import React, { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { SiteLayout } from '@/site/Layout'
import { siteRoutes } from '@/site/routes'
import { AppShell } from '@/app/Shell'
import { appRoutes } from '@/app/routes'
import { AdminShell } from '@/admin/Shell'
import { adminRoutes } from '@/admin/routes'
import { Toasts } from '@/components/ui'
import { PasscodeGate } from '@/components/PasscodeGate'

function ScrollTop() { const { pathname } = useLocation(); useEffect(() => { if (!pathname.startsWith('/app')) window.scrollTo(0, 0); else document.querySelector('.phone-scroll')?.scrollTo(0, 0) }, [pathname]); return null }

export default function App() {
  return <>
    <ScrollTop />
    <Routes>
      <Route path="/app" element={<PasscodeGate label="Member App"><AppShell /></PasscodeGate>}>{appRoutes}</Route>
      <Route path="/admin" element={<PasscodeGate label="Admin Portal"><AdminShell /></PasscodeGate>}>{adminRoutes}</Route>
      <Route path="/" element={<SiteLayout />}>{siteRoutes}</Route>
    </Routes>
    <Toasts />
  </>
}
