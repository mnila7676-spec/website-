import React, { useState } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { Icon } from '@/components/Icon'
import { BackButton } from '@/components/ui'
import { useStore } from '@/store/store'
import { LESSONS } from '@/data/club'
import { useLinks } from '@/lib/links'

export function Learn() {
  const { state } = useStore(); const L = useLinks()
  return <div className="container">
    <div className="page-hero"><p className="eyebrow">Learn and earn</p><h1>Short lessons, real understanding</h1><p>Two to three minutes each. Pass the knowledge check to earn 20 Glow Points, one lesson per day.</p></div>
    <div className="lesson-grid">{LESSONS.map(l => { const done = state.lessonsDone.includes(l.id); return <Link key={l.id} to={L.learn(l.id)} className={`lesson-card ${done ? 'done' : ''}`}><div className="between"><span className="pill pill-muted tiny">{l.tag}</span><span className="tiny muted">{l.minutes} min</span></div><h3>{l.title}</h3><p className="small muted">{l.summary}</p><span className={`pill tiny ${done ? 'pill-success' : ''}`} style={{ alignSelf: 'flex-start', marginTop: 'auto' }}>{done ? <><Icon name="check" className="icon-sm" /> Completed</> : '+20 pts'}</span></Link> })}</div>
    <div style={{ height: 60 }} />
  </div>
}

export function LessonBody({ id }: { id: string }) {
  const l = LESSONS.find(x => x.id === id)!; const { state, actions } = useStore(); const [pick, setPick] = useState<number | null>(null)
  const done = state.lessonsDone.includes(l.id)
  return <div className="lesson-body">
    <span className="pill pill-muted tiny">{l.tag} · {l.minutes} min</span>
    <h1 style={{ fontSize: 40, margin: '10px 0 18px' }}>{l.title}</h1>
    {l.body.map(p => <p key={p}>{p}</p>)}
    <div className="quiz"><h3>Knowledge check</h3><p style={{ fontSize: 15, marginBottom: 12 }}>{l.quiz.q}</p>
      <div className="stack">{l.quiz.options.map((o, i) => <label key={o} className={`opt ${pick === i ? 'on' : ''}`}><input type="radio" name="q" checked={pick === i} onChange={() => setPick(i)} /> {o}</label>)}</div>
      {done ? <p className="pill pill-success" style={{ marginTop: 12 }}><Icon name="check" className="icon-sm" /> Completed</p> : <button className="btn btn-primary" style={{ marginTop: 12 }} disabled={pick === null} onClick={() => actions.completeLesson(l.id, pick === l.quiz.answer)}>Check answer · +20 pts</button>}
    </div>
  </div>
}
export function LessonPage() {
  const { id } = useParams(); const L = useLinks()
  if (!LESSONS.find(x => x.id === id)) return <Navigate to="/learn" replace />
  return <div className="container" style={{ paddingTop: 24 }}><BackButton to="/learn" label="All lessons" /><LessonBody id={id!} /><div style={{ height: 60 }} /></div>
}
