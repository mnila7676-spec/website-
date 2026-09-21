import React from 'react'
import { Link, useNavigate, useParams, Navigate } from 'react-router-dom'
import { Icon } from '@/components/Icon'
import { CartView, CheckoutView, OrderConfirmView } from '@/site/pages/Commerce'
import { LessonBody } from '@/site/pages/Learn'
import { useStore } from '@/store/store'
import { LESSONS } from '@/data/club'

const Head = ({ title }: { title: string }) => { const nav = useNavigate(); return <div className="screen-head"><button className="icon-btn" onClick={() => nav(-1)}><Icon name="chevron-left" /></button><h1 style={{ fontSize: 26 }}>{title}</h1><span style={{ width: 38 }} /></div> }
export function AppBag() { return <div className="screen"><Head title="Your Bag" /><CartView /></div> }
export function AppCheckout() { return <div className="screen"><Head title="Checkout" /><CheckoutView /></div> }
export function AppOrder() { return <div className="screen"><OrderConfirmView /></div> }
export function AppLearn() { const { state } = useStore(); return <div className="screen"><Head title="Learn & Earn" />{LESSONS.map(l => { const done = state.lessonsDone.includes(l.id); return <Link key={l.id} to={`/app/learn/${l.id}`} className="app-card" style={{ display: 'block' }}><div className="between"><span className="pill pill-muted tiny">{l.tag} · {l.minutes} min</span><span className={`pill tiny ${done ? 'pill-success' : ''}`}>{done ? 'Done' : '+20 pts'}</span></div><h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 22, marginTop: 6 }}>{l.title}</h3><p className="tiny muted">{l.summary}</p></Link> })}</div> }
export function AppLesson() { const { id } = useParams(); if (!LESSONS.find(l => l.id === id)) return <Navigate to="/app/learn" replace />; return <div className="screen"><Head title="Lesson" /><div className="lesson-app"><LessonBody id={id!} /></div></div> }
