import React from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '@/components/Icon'
import { useStore } from '@/store/store'
import { MissionList } from './Daily'
import { SpinCard } from './Spin'
import { STREAK_BONUS } from '@/data/club'

export function WeekStrip() {
  const { state } = useStore(); const now = new Date(); const dow = (now.getDay() + 6) % 7
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((l, i) => { const dt = new Date(now); dt.setDate(now.getDate() - dow + i); const key = dt.toISOString().slice(0, 10); return { l, num: dt.getDate(), key, on: state.checkins.includes(key), today: i === dow, routine: !!(state.routineLog[key]?.am || state.routineLog[key]?.pm), spin: !!state.spins[key] } })
  return <div className="week-strip">{days.map(d => <div key={d.key} className={d.today ? 'today' : ''}><small>{d.l}</small><span className={`num ${d.today ? 'on' : ''}`}>{d.num}</span><span className="dots"><i className={d.on ? 'copper' : ''} /><i className={d.routine ? 'burgundy' : ''} /><i className={d.spin ? 'gold' : ''} /></span></div>)}</div>
}

export function WeeklyDots() {
  const { state, d } = useStore(); const target = 5; const done = Math.min(target, d.weekRoutines)
  const claimed = state.weeklyBonusClaimed.includes(`routines-5:${weekStart()}`)
  return <div className="weekly-dots-wrap">
    <div className="between small"><b>Weekly progress</b><span>{done} of {target} completed</span></div>
    <div className="weekly-dots">{Array.from({ length: target }).map((_, i) => <React.Fragment key={i}>{i > 0 && <span className={`line ${i < done ? 'on' : ''}`} />}<span className={`dot ${i < done ? 'on' : ''}`}>{i < done && <Icon name="check" className="icon-sm" />}</span></React.Fragment>)}<span className={`line ${done >= target ? 'on' : ''}`} /><span className={`dot prize ${done >= target ? 'on' : ''}`}><Icon name="gift" className="icon-sm" /></span></div>
    <p className="tiny muted">{claimed ? 'Bonus claimed this week. Keep the rhythm going.' : done >= target ? <Link to="/app/daily" className="burgundy"><b>Claim your 300-point bonus →</b></Link> : <>Complete {target} routines to earn a <b className="burgundy">300-point bonus</b></>}</p>
  </div>
}
function weekStart() { const t = new Date(); const day = (t.getDay() + 6) % 7; t.setDate(t.getDate() - day); return t.toISOString().slice(0, 10) }

export function TodaySection() {
  const { state, d, actions } = useStore()
  if (!state.member) return null
  const bonus = STREAK_BONUS[Math.min(7, d.streak + 1)] ?? 0
  return <div className="today">
    <div className="between" style={{ marginBottom: 6 }}><h2 className="serif" style={{ fontSize: 30 }}>Today</h2><span className="pill pill-outline"><Icon name="flame" className="icon-sm copper" /> {d.streak} day streak</span></div>
    <WeekStrip />
    <button className={`checkin-row ${d.checkedInToday ? 'done' : ''}`} onClick={() => !d.checkedInToday && actions.checkIn()}><span className="ck"><Icon name="check" /></span><span style={{ flex: 1, textAlign: 'left' }}><b>Daily Check-In <em>+{80 + bonus} pts</em></b><small>{d.checkedInToday ? "You've claimed today" : 'Claim to keep your streak alive'}</small></span><span className={`mgo ${d.checkedInToday ? 'ok' : ''}`}><Icon name={d.checkedInToday ? 'check' : 'chevron'} className="icon-sm" /></span></button>
    <SpinCard />
    <div className="app-card" style={{ padding: '4px 14px' }}><MissionList /></div>
    <div className="app-card"><WeeklyDots /></div>
  </div>
}
