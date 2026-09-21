import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Icon } from '@/components/Icon'
import { Progress } from '@/components/ui'
import { useStore, weekKey } from '@/store/store'
import { MISSIONS, WEEKLY_CHALLENGES, STREAK_BONUS, DAILY_ENGAGEMENT_CAP } from '@/data/club'
import type { WeeklyChallenge } from '@/data/club'
import { useLinks } from '@/lib/links'
import { n } from '@/lib/format'
import { SpinCard } from './Spin'

export function MissionList() {
  const { state, d, actions } = useStore(); const L = useLinks(); const nav = useNavigate(); const m = state.member
  const today = new Date().toISOString().slice(0, 10); const done = state.missionsDone[today] ?? []; const log = state.routineLog[today] ?? {}
  const pts = (id: string) => state.admin.missionPoints[id] ?? MISSIONS.find(x => x.id === id)?.points ?? 0
  const rows: { id: string; icon: string; title: string; sub: string; pts: number; done: boolean; go: () => void }[] = [
    { id: 'checkin', icon: 'calendar', title: 'Daily Check-In', sub: d.checkedInToday ? "You've claimed today" : `+${STREAK_BONUS[Math.min(7, d.streak + 1)] ?? 0} streak bonus`, pts: pts('checkin') + (STREAK_BONUS[Math.min(7, d.streak + 1)] ?? 0), done: d.checkedInToday, go: () => actions.checkIn() },
    { id: 'am', icon: 'sun', title: 'Complete AM routine', sub: state.routine.savedAt ? 'Confirm your morning ritual' : 'Save a routine first', pts: pts('am'), done: !!log.am, go: () => state.routine.savedAt ? actions.logRoutine('am') : nav(L.ritual) },
    { id: 'pm', icon: 'moon', title: 'Complete PM routine', sub: state.routine.savedAt ? 'Confirm your evening ritual' : 'Save a routine first', pts: pts('pm'), done: !!log.pm, go: () => state.routine.savedAt ? actions.logRoutine('pm') : nav(L.ritual) },
    { id: 'learn', icon: 'book', title: 'Learn: ' + (['Barrier care 101', 'Layering serums', 'Why SPF every day', 'Vitamin C, explained', 'To double cleanse or not', 'Skincare in humid climates'].find((t, i) => !state.lessonsDone.includes(['barrier', 'layering', 'spf', 'vitc', 'double-cleanse', 'humidity'][i])) ?? 'All lessons done'), sub: 'Read and pass a quick check', pts: pts('learn'), done: done.includes('learn'), go: () => nav(L.app ? '/app/learn' : '/learn') },
    { id: 'review', icon: 'star', title: 'Review your last purchase', sub: state.orders.length ? 'Verified reviews earn points' : 'After your first order', pts: pts('review'), done: done.includes('review'), go: () => nav(state.orders.length ? L.product(['glow-renewal-serum', 'barrier-repair-cream', 'gentle-cloud-cleanser', 'daily-defence-spf', 'the-lumiva-ritual-set', 'the-complete-ritual'].find(s => true)!) : L.shop) },
  ]
  if (m && !m.skinProfile) rows.push({ id: 'skin-profile', icon: 'face', title: 'Complete your skin profile', sub: 'Better recommendations', pts: pts('skin-profile'), done: false, go: () => nav(L.app ? '/app/profile/skin' : '/skin-solutions') })
  rows.push({ id: 'refer', icon: 'users', title: 'Refer a friend', sub: 'Points after their first order', pts: pts('refer'), done: false, go: () => nav(L.app ? '/app/profile/referrals' : '/account/referrals') })
  if (m && !m.storeVisited) rows.push({ id: 'visit', icon: 'store', title: 'Visit Lumiva', sub: 'Scan the store code', pts: pts('visit'), done: false, go: () => actions.storeVisit() })
  return <div>
    {rows.map(r => <div key={r.id} className="mission-row"><span className="act-icon"><Icon name={r.icon} className="icon-sm" /></span><div style={{ flex: 1, minWidth: 0 }}><b style={{ fontSize: 13.5, display: 'block' }}>{r.title}</b><small className="muted" style={{ fontSize: 11.5 }}>{r.sub}</small></div><span className="mpts">+{r.pts} pts</span>{r.done ? <span className="mdone"><Icon name="check" className="icon-sm" /></span> : <button className="mgo" onClick={m ? r.go : () => nav(L.join)} aria-label="Go"><Icon name="chevron" className="icon-sm" /></button>}</div>)}
    {m && <p className="tiny muted" style={{ marginTop: 8 }}>Engagement points today: {n(d.engagementToday)} of {DAILY_ENGAGEMENT_CAP}. Tasks reset at midnight SGT.</p>}
  </div>
}

export function WeeklyChallengeCard({ challenge }: { challenge: WeeklyChallenge }) {
  const { state, d, actions } = useStore(); const wk = weekKey(); const key = `${challenge.id}:${wk}`
  const doneWeek = Object.entries(state.missionsDone).filter(([k]) => k >= wk).flatMap(([, v]) => v)
  const progress = challenge.tasks.map(t => ({ ...t, value: t.mission === 'routine' ? d.weekRoutines : doneWeek.filter(x => x === t.mission).length + (t.mission === 'save-routine' && state.routine.savedAt && state.routine.savedAt >= wk ? 0 : 0) }))
  const complete = progress.every(t => t.value >= t.target); const claimed = state.weeklyBonusClaimed.includes(key)
  const total = progress.reduce((s, t) => s + Math.min(t.value, t.target), 0); const max = progress.reduce((s, t) => s + t.target, 0)
  return <div className="weekly">
    <div className="between"><h3><Icon name="shield" className="icon-sm copper" /> {challenge.title}</h3><span className="pill pill-copper tiny">Bonus +{challenge.bonus} pts</span></div>
    <p className="tiny muted" style={{ margin: '4px 0 8px' }}>{challenge.blurb}{challenge.badge ? ' · limited badge' : ''}</p>
    <Progress value={total} max={max} /><div className="between tiny muted" style={{ marginTop: 4 }}><span>{total} of {max}</span><span>Resets Monday</span></div>
    {challenge.tasks.length > 1 && <div style={{ marginTop: 6 }}>{progress.map(t => <div key={t.id} className={`task ${t.value >= t.target ? 'done' : ''}`}><span>{t.value >= t.target ? '✓ ' : ''}{t.label}</span><span className="tnum">{Math.min(t.value, t.target)}/{t.target}</span></div>)}</div>}
    {claimed ? <span className="pill pill-success tiny" style={{ marginTop: 8 }}>Bonus claimed this week</span> : complete && state.member ? <button className="btn btn-copper btn-sm" style={{ marginTop: 8 }} onClick={() => actions.claimWeekly(challenge.id)}>Claim +{challenge.bonus} pts</button> : null}
  </div>
}

export function AppDaily() {
  const { state, d, actions } = useStore(); const nav = useNavigate()
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']; const now = new Date(); const dow = (now.getDay() + 6) % 7
  const week = days.map((lbl, i) => { const dt = new Date(now); dt.setDate(now.getDate() - dow + i); const key = dt.toISOString().slice(0, 10); return { lbl, key, on: state.checkins.includes(key), today: i === dow, future: i > dow } })
  const canProtect = state.member && !week.find(w => w.key === new Date(Date.now() - 864e5).toISOString().slice(0, 10))?.on && d.streak === 0 && state.checkins.length > 0 && (state.streakShields > 0 || state.member.streakProtectionMonth !== now.toISOString().slice(0, 7))
  return <div className="screen">
    <div className="screen-head"><button className="icon-btn" onClick={() => nav(-1)}><Icon name="chevron-left" /></button><h1 style={{ fontSize: 26 }}>Daily Glow</h1><span className="pill pill-outline"><Icon name="flame" className="icon-sm copper" /> {d.streak} day streak</span></div>
    <div className="app-card"><b className="small">7-Day Streak</b><div className="streak-row">{week.map(w => <div key={w.key}>{w.lbl}<span className={`${w.on ? 'on' : ''} ${w.today ? 'today' : ''}`}>{w.on ? <Icon name="check" className="icon-sm" /> : ''}</span></div>)}</div>
      <div className="between" style={{ background: 'var(--cream)', borderRadius: 10, padding: '10px 12px', fontSize: 13, marginTop: 8 }}><span>Day {Math.min(7, d.streak + (d.checkedInToday ? 0 : 1))} · +{80 + (STREAK_BONUS[Math.min(7, d.streak + 1)] ?? 0)} pts</span>{d.checkedInToday ? <span className="pill pill-success tiny">Claimed</span> : <button className="btn btn-sm btn-primary" onClick={() => actions.checkIn()}>Claim</button>}</div>
      {canProtect && <button className="btn btn-light btn-sm btn-block" style={{ marginTop: 8 }} onClick={() => actions.useStreakProtection()}><Icon name="shield" className="icon-sm" /> Use streak protection ({state.streakShields > 0 ? `${state.streakShields} shield${state.streakShields > 1 ? 's' : ''}` : '1 per month'})</button>}
      {state.member && <p className="shield-pill" style={{ marginTop: 8 }}><Icon name="shield" className="icon-sm" /> {state.streakShields} streak shield{state.streakShields === 1 ? '' : 's'} · win more on Glow Spin</p>}
    </div>
    <SpinCard />
    <div className="app-card"><h3 style={{ marginBottom: 4 }}>Daily Missions</h3><MissionList /></div>
    {WEEKLY_CHALLENGES.map(c => <WeeklyChallengeCard key={c.id} challenge={c} />)}
    <p className="tiny muted">Missions reward behaviour that helps you or the community. They never encourage unnecessary product use. Points are capped per day and fraud controls apply.</p>
  </div>
}
