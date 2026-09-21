import React, { createContext, useContext, useEffect, useMemo, useReducer, useRef } from 'react'
import type { State, Member, LedgerEntry, CartItem, Order, Redemption, Review, Referral, AuditEntry, UserActivity, AdminSettings } from './types'
import { PRODUCTS, productById, POINTS_PER_DOLLAR, FREE_SHIPPING_THRESHOLD, SHIPPING_FEE } from '@/data/products'
import { REWARDS, rewardById } from '@/data/rewards'
import { TIERS, tierFor, nextTier, MILESTONES, MISSIONS, STREAK_BONUS, DAILY_ENGAGEMENT_CAP, WELCOME_POINTS, WEEKLY_CHALLENGES, ACHIEVEMENTS, LESSONS, LEADERBOARD_PURCHASE_CAP, SPIN_PRIZES } from '@/data/club'
import { LEADERS } from '@/data/community'

const KEY = 'lumiva-glow-club-v1'
export const uid = () => Math.random().toString(36).slice(2, 10)
export const today = (d = new Date()) => d.toISOString().slice(0, 10)
const daysAgo = (n: number) => { const d = new Date(); d.setDate(d.getDate() - n); return d }
export const isoDaysAgo = (n: number) => daysAgo(n).toISOString()
export const monthKey = (d = new Date()) => d.toISOString().slice(0, 7)
export const weekKey = (d = new Date()) => { const t = new Date(d); const day = (t.getDay() + 6) % 7; t.setDate(t.getDate() - day); return t.toISOString().slice(0, 10) }

const defaultAdmin = (): AdminSettings => ({
  tickerEnabled: true, scrollModalEnabled: true, giftDrawerEnabled: true, modalScrollPercent: 30, modalDelaySeconds: 30,
  missionPoints: Object.fromEntries(MISSIONS.map(m => [m.id, m.points])),
  rewardStock: Object.fromEntries(REWARDS.map(r => [r.id, r.stock])),
  hiddenActivity: [], approvedActivity: ['a16'], activityTypes: { redeem: true, earn: true, tier: true, streak: true, milestone: true, order: true, achievement: true },
  announcement: '',
})
export const initialState = (): State => ({
  version: 1, member: null, ledger: [], cart: [], wishlist: [], orders: [], routine: { am: [], pm: [] }, routineLog: {}, checkins: [],
  missionsDone: {}, lessonsDone: [], reviews: [], referrals: [], redemptions: [], savedRewards: [], achievements: {}, weeklyBonusClaimed: [], spins: {}, streakShields: 0, seenAchievements: [],
  userActivity: [], audit: [], admin: defaultAdmin(), prompts: { barDismissed: false, rewardReveal: false, giftDrawerSeenFor: [] },
})

/* ---------- Demo member (Amelia K.) ---------- */
export function demoState(base: State): State {
  const m: Member = {
    id: 'demo', memberId: 'LC-24870', firstName: 'Amelia', lastName: 'Koh', email: 'amelia@example.com', mobile: '+65 9123 4567',
    joinedAt: '2024-03-12T09:00:00.000Z', birthday: '1994-06-18', skinProfile: { type: 'Combination', concerns: ['dullness', 'dehydration'], goal: 'Even, radiant tone' },
    consent: { marketing: true, publicActivity: true, push: true }, addresses: [{ id: 'ad1', label: 'Home', line1: '12 Duxton Hill', line2: '#03-01', postal: '089596', isDefault: true }],
    referralCode: 'AMELIA-GLOW', oneForOneUsed: true, welcomeSeen: true, storeVisited: true,
  }
  const L: LedgerEntry[] = []
  const add = (n: number, type: LedgerEntry['type'], source: string, points: number, note: string, lb = true) => L.push({ id: uid(), ts: isoDaysAgo(n), type, source, points, note, leaderboardEligible: lb })
  add(560, 'earn', 'welcome', 500, 'Welcome to Glow Club')
  add(555, 'earn', 'order', 1880, 'Order LU-1042 · The Lumiva Ritual Set')
  add(520, 'earn', 'order', 850, 'Order LU-1103 · Glow Renewal Serum')
  add(490, 'earn', 'review', 150, 'Review · Glow Renewal Serum')
  add(470, 'earn', 'referral', 500, 'Referral · Sofia T. placed her first order')
  add(440, 'earn', 'order', 900, 'Order LU-1188 · Barrier Repair Cream')
  add(410, 'spend', 'reward', -600, 'Redeemed · Coffee or Matcha')
  add(380, 'earn', 'order', 2625, 'Order LU-1240 · The Complete Ritual')
  add(350, 'earn', 'weekly', 450, '7-Day Barrier Reset completed')
  add(320, 'spend', 'reward', -2000, 'Redeemed · S$20 Lumiva Voucher')
  add(290, 'earn', 'order', 850, 'Order LU-1302 · Glow Renewal Serum')
  add(260, 'earn', 'order', 725, 'Order LU-1355 · Daily Defence SPF')
  add(230, 'earn', 'referral', 500, 'Referral · Chloe D. placed her first order')
  add(170, 'spend', 'reward', -600, 'Redeemed · Coffee or Matcha')
  add(150, 'earn', 'order', 900, 'Order LU-1466 · Barrier Repair Cream')
  add(120, 'earn', 'order', 850, 'Order LU-1520 · Glow Renewal Serum')
  add(100, 'spend', 'reward', -600, 'Redeemed · Coffee or Matcha')
  add(80, 'earn', 'order', 2625, 'Order LU-1588 · The Complete Ritual')
  add(60, 'spend', 'reward', -2000, 'Redeemed · S$20 Lumiva Voucher')
  add(40, 'earn', 'order', 725, 'Order LU-1634 · Daily Defence SPF')
  add(20, 'spend', 'reward', -620, 'Redeemed · Express Delivery + Coffee')
  // Daily engagement over the last 30 days
  for (let d = 20; d >= 1; d--) { add(d, 'earn', 'checkin', 80 + (STREAK_BONUS[Math.min(7, 21 - d)] ?? 0), 'Daily check-in'); if (d % 2 === 0) add(d, 'earn', 'routine', 60, 'AM + PM routine'); if (d % 5 === 0) add(d, 'earn', 'learn', 20, 'Learn and earn') }
  // Match the proposal: earned 18,900 · redeemed 6,420 · balance 12,480
  const earned = L.filter(e => e.points > 0).reduce((s, e) => s + e.points, 0)
  const diff = 18900 - earned
  if (diff > 0) add(90, 'earn', 'milestone', diff, 'Birthday bonus · June 2026')
  const checkins: string[] = []; for (let d = 6; d >= 0; d--) checkins.push(today(daysAgo(d)))
  const routineLog: State['routineLog'] = {}; for (let d = 12; d >= 1; d--) routineLog[today(daysAgo(d))] = { am: isoDaysAgo(d), pm: isoDaysAgo(d) }
  const orders: Order[] = [
    { id: 'LU-1634', ts: isoDaysAgo(40), items: [{ productId: 'spf', qty: 1, price: 58 }], subtotal: 58, discount: 0, shipping: 6, total: 64, status: 'delivered', pointsEarned: 725, address: '12 Duxton Hill #03-01', pointsAt: 1.25 },
    { id: 'LU-1588', ts: isoDaysAgo(80), items: [{ productId: 'complete-set', qty: 1, price: 210 }], subtotal: 210, discount: 0, shipping: 0, total: 210, status: 'delivered', pointsEarned: 2625, address: '12 Duxton Hill #03-01', pointsAt: 1.25 },
    { id: 'LU-1520', ts: isoDaysAgo(120), items: [{ productId: 'serum', qty: 1, price: 68 }], subtotal: 68, discount: 0, shipping: 6, total: 74, status: 'delivered', pointsEarned: 850, address: '12 Duxton Hill #03-01', pointsAt: 1.25 },
    { id: 'LU-1466', ts: isoDaysAgo(150), items: [{ productId: 'cream', qty: 1, price: 72 }], subtotal: 72, discount: 0, shipping: 6, total: 78, status: 'delivered', pointsEarned: 900, address: '12 Duxton Hill #03-01', pointsAt: 1.25 },
  ]
  const redemptions: Redemption[] = [
    { id: uid(), rewardId: 'coffee', ts: isoDaysAgo(20), points: 600, status: 'used', code: 'GLOW-7F2K' },
    { id: uid(), rewardId: 'express-delivery', ts: isoDaysAgo(20), points: 400, status: 'approved', code: 'EXP-9A1M' },
    { id: uid(), rewardId: 'voucher-20', ts: isoDaysAgo(60), points: 2000, status: 'used', code: 'LUM-20-4TQ' },
    { id: uid(), rewardId: 'coffee', ts: isoDaysAgo(100), points: 600, status: 'used', code: 'GLOW-2B8X' },
  ]
  const ach: Record<string, string> = { 'first-glow': isoDaysAgo(500), 'glow-getter': isoDaysAgo(420), 'spa-retreat': isoDaysAgo(150), 'ritual-regular': isoDaysAgo(0), 'streak-7': isoDaysAgo(0), 'review-maven': isoDaysAgo(490), 'referral-circle': isoDaysAgo(470), 'barrier-reset': isoDaysAgo(350), 'first-order': isoDaysAgo(555), 'first-redeem': isoDaysAgo(410), 'gold': isoDaysAgo(420), 'skin-profile': isoDaysAgo(540), 'complete-ritual': isoDaysAgo(380), 'routine-builder': isoDaysAgo(550), 'store-visit': isoDaysAgo(300), 'learner': isoDaysAgo(300), 'anniversary': isoDaysAgo(188), 'first-spin': isoDaysAgo(3) }
  return {
    ...base, member: m, ledger: L, orders, redemptions, checkins, routineLog, achievements: ach, demoSeeded: true,
    routine: { am: ['cleanser', 'serum', 'cream', 'spf'], pm: ['cleanser', 'serum', 'cream'], savedAt: isoDaysAgo(550) },
    reviews: [{ id: uid(), productId: 'serum', rating: 5, text: 'Two weeks in and my skin looks lit from within.', ts: isoDaysAgo(490), verified: true, orderId: 'LU-1103' }],
    referrals: [{ id: uid(), name: 'Sofia T.', email: 'sofia@example.com', ts: isoDaysAgo(475), status: 'ordered' }, { id: uid(), name: 'Chloe D.', email: 'chloe@example.com', ts: isoDaysAgo(240), status: 'ordered' }, { id: uid(), name: 'Rina P.', email: 'rina@example.com', ts: isoDaysAgo(5), status: 'invited' }],
    spins: { [today(daysAgo(1))]: 'p20', [today(daysAgo(2))]: 'p10', [today(daysAgo(3))]: 'p50' }, streakShields: 1, seenAchievements: Object.keys(ach),
    lessonsDone: ['barrier', 'layering', 'spf'], prompts: { barDismissed: true, rewardReveal: false, giftDrawerSeenFor: [] },
    userActivity: [{ id: uid(), type: 'redeem', text: 'You redeemed Coffee or Matcha', ts: isoDaysAgo(20), icon: 'coffee' }],
  }
}

export type JoinInput = Omit<Member, 'id' | 'memberId' | 'joinedAt' | 'referralCode' | 'oneForOneUsed' | 'welcomeSeen' | 'storeVisited' | 'addresses' | 'consent'> & { consent?: Partial<Member['consent']> }
/* ---------- Actions ---------- */
type Action =
  | { type: 'HYDRATE'; state: State }
  | { type: 'SIGN_IN_DEMO' } | { type: 'SIGN_OUT' }
  | { type: 'JOIN'; member: JoinInput }
  | { type: 'UPDATE_MEMBER'; patch: Partial<Member> }
  | { type: 'EARN'; source: string; points: number; note: string; leaderboardEligible?: boolean }
  | { type: 'SPEND'; source: string; points: number; note: string }
  | { type: 'LEDGER'; entry: LedgerEntry }
  | { type: 'CART_ADD'; productId: string; qty?: number; gift?: boolean } | { type: 'CART_SET'; productId: string; qty: number } | { type: 'CART_REMOVE'; productId: string } | { type: 'CART_CLEAR' }
  | { type: 'WISH_TOGGLE'; productId: string }
  | { type: 'ORDER_PLACE'; order: Order }
  | { type: 'ROUTINE_SET'; am: string[]; pm: string[] }
  | { type: 'ROUTINE_LOG'; slot: 'am' | 'pm' }
  | { type: 'CHECKIN' }
  | { type: 'MISSION_DONE'; id: string }
  | { type: 'LESSON_DONE'; id: string }
  | { type: 'REVIEW_ADD'; review: Review }
  | { type: 'REFERRAL_ADD'; referral: Referral } | { type: 'REFERRAL_SET'; id: string; status: Referral['status'] }
  | { type: 'REDEEM'; redemption: Redemption } | { type: 'REDEMPTION_SET'; id: string; status: Redemption['status']; note?: string }
  | { type: 'SAVE_REWARD'; id: string }
  | { type: 'ACHIEVE'; id: string }
  | { type: 'WEEKLY_CLAIM'; key: string }
  | { type: 'PROMPT'; patch: Partial<State['prompts']> }
  | { type: 'ACTIVITY_ADD'; item: UserActivity }
  | { type: 'AUDIT'; entry: AuditEntry }
  | { type: 'ADMIN'; patch: Partial<AdminSettings> }
  | { type: 'APPROVE'; id: string; approve: boolean; note?: string }
  | { type: 'ORDER_STATUS'; id: string; status: Order['status'] }
  | { type: 'STREAK_PROTECT'; month: string; day: string; useShield?: boolean }
  | { type: 'SPIN'; prizeId: string }
  | { type: 'SEEN_ACHIEVEMENTS'; ids: string[] }
  | { type: 'RESET' }

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case 'HYDRATE': return a.state
    case 'SIGN_IN_DEMO': return demoState({ ...initialState(), admin: s.admin, audit: s.audit })
    case 'SIGN_OUT': return { ...initialState(), admin: s.admin, audit: s.audit, prompts: { ...s.prompts, rewardReveal: false } }
    case 'JOIN': {
      const { consent: c, ...rest } = a.member
      const m: Member = { ...rest, id: uid(), memberId: 'LC-' + Math.floor(20000 + Math.random() * 79999), joinedAt: new Date().toISOString(), referralCode: (a.member.firstName.toUpperCase() + '-GLOW').replace(/\s/g, ''), oneForOneUsed: false, welcomeSeen: false, storeVisited: false, addresses: [], consent: { marketing: c?.marketing ?? true, publicActivity: c?.publicActivity ?? false, push: c?.push ?? true } }
      const welcome: LedgerEntry = { id: uid(), ts: new Date().toISOString(), type: 'earn', source: 'welcome', points: WELCOME_POINTS, note: 'Welcome to Glow Club', leaderboardEligible: true }
      return { ...s, member: m, ledger: [...s.ledger, welcome], prompts: { ...s.prompts, rewardReveal: true } }
    }
    case 'UPDATE_MEMBER': return s.member ? { ...s, member: { ...s.member, ...a.patch } } : s
    case 'EARN': return { ...s, ledger: [...s.ledger, { id: uid(), ts: new Date().toISOString(), type: 'earn', source: a.source, points: a.points, note: a.note, leaderboardEligible: a.leaderboardEligible ?? true }] }
    case 'SPEND': return { ...s, ledger: [...s.ledger, { id: uid(), ts: new Date().toISOString(), type: 'spend', source: a.source, points: -Math.abs(a.points), note: a.note, leaderboardEligible: false }] }
    case 'LEDGER': return { ...s, ledger: [...s.ledger, a.entry] }
    case 'CART_ADD': {
      const ex = s.cart.find(c => c.productId === a.productId && !!c.gift === !!a.gift)
      if (ex) return { ...s, cart: s.cart.map(c => c === ex ? { ...c, qty: c.qty + (a.qty ?? 1) } : c) }
      return { ...s, cart: [...s.cart, { productId: a.productId, qty: a.qty ?? 1, gift: a.gift }] }
    }
    case 'CART_SET': return { ...s, cart: s.cart.map(c => c.productId === a.productId && !c.gift ? { ...c, qty: Math.max(1, a.qty) } : c) }
    case 'CART_REMOVE': return { ...s, cart: s.cart.filter(c => c.productId !== a.productId) }
    case 'CART_CLEAR': return { ...s, cart: [] }
    case 'WISH_TOGGLE': return { ...s, wishlist: s.wishlist.includes(a.productId) ? s.wishlist.filter(w => w !== a.productId) : [...s.wishlist, a.productId] }
    case 'ORDER_PLACE': return { ...s, orders: [a.order, ...s.orders], cart: [] }
    case 'ROUTINE_SET': return { ...s, routine: { am: a.am, pm: a.pm, savedAt: new Date().toISOString() } }
    case 'ROUTINE_LOG': { const d = today(); return { ...s, routineLog: { ...s.routineLog, [d]: { ...(s.routineLog[d] ?? {}), [a.slot]: new Date().toISOString() } } } }
    case 'CHECKIN': { const d = today(); return s.checkins.includes(d) ? s : { ...s, checkins: [...s.checkins, d] } }
    case 'MISSION_DONE': { const d = today(); const list = s.missionsDone[d] ?? []; return { ...s, missionsDone: { ...s.missionsDone, [d]: [...list, a.id] } } }
    case 'LESSON_DONE': return s.lessonsDone.includes(a.id) ? s : { ...s, lessonsDone: [...s.lessonsDone, a.id] }
    case 'REVIEW_ADD': return { ...s, reviews: [a.review, ...s.reviews] }
    case 'REFERRAL_ADD': return { ...s, referrals: [a.referral, ...s.referrals] }
    case 'REFERRAL_SET': return { ...s, referrals: s.referrals.map(r => r.id === a.id ? { ...r, status: a.status } : r) }
    case 'REDEEM': return { ...s, redemptions: [a.redemption, ...s.redemptions] }
    case 'REDEMPTION_SET': return { ...s, redemptions: s.redemptions.map(r => r.id === a.id ? { ...r, status: a.status, note: a.note ?? r.note } : r) }
    case 'SAVE_REWARD': return { ...s, savedRewards: s.savedRewards.includes(a.id) ? s.savedRewards.filter(x => x !== a.id) : [...s.savedRewards, a.id] }
    case 'ACHIEVE': return s.achievements[a.id] ? s : { ...s, achievements: { ...s.achievements, [a.id]: new Date().toISOString() } }
    case 'WEEKLY_CLAIM': return { ...s, weeklyBonusClaimed: [...s.weeklyBonusClaimed, a.key] }
    case 'PROMPT': return { ...s, prompts: { ...s.prompts, ...a.patch } }
    case 'ACTIVITY_ADD': return { ...s, userActivity: [a.item, ...s.userActivity].slice(0, 50) }
    case 'AUDIT': return { ...s, audit: [a.entry, ...s.audit].slice(0, 200) }
    case 'ADMIN': return { ...s, admin: { ...s.admin, ...a.patch } }
    case 'APPROVE': {
      const r = s.redemptions.find(x => x.id === a.id); const rw = r && rewardById(r.rewardId); if (!r || !rw) return s
      const ledger = s.ledger.filter(e => !(e.type === 'pending' && e.source === 'reward-hold' && e.note.includes(rw.name)))
      if (a.approve) ledger.push({ id: uid(), ts: new Date().toISOString(), type: 'spend', source: 'reward', points: -r.points, note: `Redeemed · ${rw.name} (approved)`, leaderboardEligible: false })
      const stock = s.admin.rewardStock[rw.id]
      const admin = !a.approve && stock !== null && stock !== undefined ? { ...s.admin, rewardStock: { ...s.admin.rewardStock, [rw.id]: stock + 1 } } : s.admin
      return { ...s, ledger, admin, redemptions: s.redemptions.map(x => x.id === a.id ? { ...x, status: a.approve ? 'approved' : 'rejected', note: a.note ?? x.note } : x) }
    }
    case 'ORDER_STATUS': return { ...s, orders: s.orders.map(o => o.id === a.id ? { ...o, status: a.status } : o) }
    case 'STREAK_PROTECT': return s.member ? { ...s, checkins: s.checkins.includes(a.day) ? s.checkins : [...s.checkins, a.day], streakShields: a.useShield ? Math.max(0, s.streakShields - 1) : s.streakShields, member: { ...s.member, streakProtectionMonth: a.useShield ? s.member.streakProtectionMonth : a.month } } : s
    case 'SPIN': {
      const prize = SPIN_PRIZES.find(x => x.id === a.prizeId); const d = today(); if (!prize || s.spins[d] || !s.member) return s
      let next: State = { ...s, spins: { ...s.spins, [d]: prize.id } }
      const ts = new Date().toISOString()
      if (prize.kind === 'points') next = { ...next, ledger: [...next.ledger, { id: uid(), ts, type: 'earn', source: 'spin', points: prize.value, note: `Glow Spin · ${prize.label} points`, leaderboardEligible: true }] }
      if (prize.kind === 'shield') next = { ...next, streakShields: next.streakShields + 1 }
      if (prize.kind === 'express') next = { ...next, redemptions: [{ id: uid(), rewardId: 'express-delivery', ts, points: 0, status: 'approved', code: 'SPIN-' + uid().slice(0, 4).toUpperCase(), note: 'Won on Glow Spin' }, ...next.redemptions] }
      if (prize.kind === 'mini') next = { ...next, redemptions: [{ id: uid(), rewardId: 'mini-cleanser', ts, points: 0, status: 'approved', code: 'SPIN-' + uid().slice(0, 4).toUpperCase(), note: 'Won on Glow Spin' }, ...next.redemptions] }
      return next
    }
    case 'SEEN_ACHIEVEMENTS': return { ...s, seenAchievements: Array.from(new Set([...s.seenAchievements, ...a.ids])) }
    case 'RESET': return initialState()
    default: return s
  }
}

/* ---------- Derived selectors ---------- */
export function derive(s: State) {
  const balance = s.ledger.filter(e => e.type !== 'pending').reduce((t, e) => t + e.points, 0)
  const earned = s.ledger.filter(e => e.points > 0 && e.type !== 'pending').reduce((t, e) => t + e.points, 0)
  const redeemed = s.ledger.filter(e => e.points < 0).reduce((t, e) => t - e.points, 0)
  const pending = s.ledger.filter(e => e.type === 'pending').reduce((t, e) => t + e.points, 0)
  const held = s.redemptions.filter(r => r.status === 'pending' && rewardById(r.rewardId)?.requiresApproval).reduce((t, r) => t + r.points, 0)
  const lifetime = earned
  const tier = tierFor(lifetime)
  const next = nextTier(lifetime)
  const nextMilestone = MILESTONES.find(m => m.points > lifetime) ?? null
  const cartCount = s.cart.reduce((t, c) => t + c.qty, 0)
  const cartSubtotal = s.cart.reduce((t, c) => t + (c.gift ? 0 : (productById(c.productId)?.price ?? 0) * c.qty), 0)
  const d = today()
  const missionsToday = s.missionsDone[d] ?? []
  const checkedInToday = s.checkins.includes(d)
  const streak = computeStreak(s.checkins)
  const routineCheckins = Object.values(s.routineLog).reduce((t, r) => t + (r.am ? 1 : 0) + (r.pm ? 1 : 0), 0)
  const wk = weekKey()
  const weekRoutines = Object.entries(s.routineLog).filter(([k]) => k >= wk).reduce((t, [, r]) => t + (r.am ? 1 : 0) + (r.pm ? 1 : 0), 0)
  const engagementToday = s.ledger.filter(e => e.ts.slice(0, 10) === d && e.points > 0 && !['order', 'welcome', 'referral', 'weekly', 'adjust', 'milestone'].includes(e.source)).reduce((t, e) => t + e.points, 0)
  const weekly = leaderboardPoints(s, wk)
  const expiring = Math.min(balance, 1200)
  const spunToday = !!s.spins[d]
  const spinStreak = computeStreak(Object.keys(s.spins))
  return { spunToday, spinStreak, balance, earned, redeemed, pending, held, available: balance - held, lifetime, tier, next, nextMilestone, cartCount, cartSubtotal, missionsToday, checkedInToday, streak, routineCheckins, weekRoutines, engagementToday, weeklyPoints: weekly, expiring }
}
function computeStreak(checkins: string[]) {
  if (!checkins.length) return 0
  const set = new Set(checkins); let n = 0; const d = new Date()
  if (!set.has(today(d))) d.setDate(d.getDate() - 1)
  while (set.has(today(d))) { n++; d.setDate(d.getDate() - 1) }
  return n
}
function leaderboardPoints(s: State, weekStart: string) {
  const entries = s.ledger.filter(e => e.ts.slice(0, 10) >= weekStart && e.points > 0 && e.leaderboardEligible)
  const purchase = Math.min(LEADERBOARD_PURCHASE_CAP, entries.filter(e => e.source === 'order').reduce((t, e) => t + e.points, 0))
  const other = entries.filter(e => e.source !== 'order').reduce((t, e) => t + e.points, 0)
  return purchase + other
}
export function leaderboard(s: State, period: 'weekly' | 'monthly' | 'allTime') {
  const d = derive(s)
  const you = s.member ? { name: s.member.nickname || `${s.member.firstName} ${s.member.lastName[0] ?? ''}.`, initials: (s.member.firstName[0] + (s.member.lastName[0] ?? '')).toUpperCase(), points: period === 'weekly' ? (s.demoSeeded ? 6780 : d.weeklyPoints) : period === 'monthly' ? (s.demoSeeded ? 16400 : d.weeklyPoints) : d.lifetime, you: true } : null
  const rows = LEADERS.filter(l => !(s.demoSeeded && l.name === 'Amelia K.') || period === 'allTime').map(l => ({ name: l.name, initials: l.initials, points: l[period], you: false }))
  if (s.demoSeeded && period === 'allTime') { const idx = rows.findIndex(r => r.name === 'Amelia K.'); if (idx >= 0) rows[idx] = { ...rows[idx], you: true } }
  else if (you) rows.push(you)
  rows.sort((a, b) => b.points - a.points)
  const youIdx = rows.findIndex(r => r.you)
  const gapToTop10 = youIdx > 9 ? rows[9].points - rows[youIdx].points + 10 : 0
  return { rows, youIdx, gapToTop10 }
}

/* ---------- Context ---------- */
interface Ctx { state: State; d: ReturnType<typeof derive>; dispatch: React.Dispatch<Action>; actions: ReturnType<typeof makeActions>; toast: (msg: string, opts?: { icon?: string; copper?: boolean }) => void; toasts: Toast[] }
interface Toast { id: string; msg: string; icon?: string; copper?: boolean }
const StoreCtx = createContext<Ctx | null>(null)

function load(): State {
  try { const raw = localStorage.getItem(KEY); if (raw) { const p = JSON.parse(raw); if (p && p.version === 1) return { ...initialState(), ...p, admin: { ...defaultAdmin(), ...(p.admin ?? {}) } } } } catch {}
  return initialState()
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, load)
  const [toasts, setToasts] = React.useState<Toast[]>([])
  const toast = React.useCallback((msg: string, opts?: { icon?: string; copper?: boolean }) => {
    const id = uid(); setToasts(t => [...t, { id, msg, ...opts }]); setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3200)
  }, [])
  const d = useMemo(() => derive(state), [state])
  const skip = useRef(true)
  useEffect(() => { if (skip.current) { skip.current = false; return } try { localStorage.setItem(KEY, JSON.stringify(state)) } catch {} }, [state])
  useEffect(() => {
    const onStorage = (e: StorageEvent) => { if (e.key === KEY && e.newValue) { try { dispatch({ type: 'HYDRATE', state: JSON.parse(e.newValue) }) } catch {} } }
    window.addEventListener('storage', onStorage); return () => window.removeEventListener('storage', onStorage)
  }, [])
  const actions = useMemo(() => makeActions(dispatch, () => stateRef.current, toast), [toast])
  const stateRef = useRef(state); stateRef.current = state
  // Achievement engine
  useEffect(() => { checkAchievements(state, d, dispatch, toast) }, [state.ledger.length, state.routineLog, state.checkins.length, state.reviews.length, state.referrals, state.lessonsDone.length, state.orders.length, state.redemptions.length, state.routine.savedAt, state.spins])
  return <StoreCtx.Provider value={{ state, d, dispatch, actions, toast, toasts }}>{children}</StoreCtx.Provider>
}
export const useStore = () => { const c = useContext(StoreCtx); if (!c) throw new Error('StoreProvider missing'); return c }

/* ---------- Action helpers (business rules live here) ---------- */
function makeActions(dispatch: React.Dispatch<Action>, get: () => State, toast: Ctx['toast']) {
  const activity = (type: string, text: string, icon: string) => dispatch({ type: 'ACTIVITY_ADD', item: { id: uid(), type, text, ts: new Date().toISOString(), icon } })
  const audit = (actor: string, action: string, detail: string) => dispatch({ type: 'AUDIT', entry: { id: uid(), ts: new Date().toISOString(), actor, action, detail } })
  const missionPts = (id: string) => get().admin.missionPoints[id] ?? MISSIONS.find(m => m.id === id)?.points ?? 0
  const earnCapped = (source: string, points: number, note: string) => {
    const d = derive(get()); const room = Math.max(0, DAILY_ENGAGEMENT_CAP - d.engagementToday); const p = Math.min(points, room)
    if (p <= 0) { toast('Daily engagement limit reached. Points resume tomorrow.'); return 0 }
    dispatch({ type: 'EARN', source, points: p, note }); return p
  }
  return {
    signInDemo() { dispatch({ type: 'SIGN_IN_DEMO' }); toast('Welcome back, Amelia', { icon: 'sparkle', copper: true }) },
    signOut() { dispatch({ type: 'SIGN_OUT' }) },
    join(m: JoinInput) { dispatch({ type: 'JOIN', member: m }); audit('system', 'member.join', `${m.firstName} joined Glow Club (+${WELCOME_POINTS} welcome points)`) },
    updateMember(patch: Partial<Member>) { dispatch({ type: 'UPDATE_MEMBER', patch }) },
    addToCart(productId: string, qty = 1, gift = false) { dispatch({ type: 'CART_ADD', productId, qty, gift }); if (!gift) toast(`${productById(productId)?.name} added to bag`, { icon: 'bag' }) },
    setQty(productId: string, qty: number) { if (qty <= 0) dispatch({ type: 'CART_REMOVE', productId }); else dispatch({ type: 'CART_SET', productId, qty }) },
    removeFromCart(productId: string) { dispatch({ type: 'CART_REMOVE', productId }) },
    toggleWish(productId: string) { const s = get(); dispatch({ type: 'WISH_TOGGLE', productId }); toast(s.wishlist.includes(productId) ? 'Removed from saved items' : 'Saved to wishlist', { icon: 'heart' }) },
    placeOrder(opts: { voucher?: Redemption; express?: boolean; address: string }) {
      const s = get(); const d = derive(s); const items = s.cart.map(c => ({ productId: c.productId, qty: c.qty, price: c.gift ? 0 : (productById(c.productId)?.price ?? 0), gift: c.gift }))
      const subtotal = items.reduce((t, i) => t + i.price * i.qty, 0)
      const discount = opts.voucher ? 20 : 0
      const shipping = opts.express ? 0 : subtotal >= FREE_SHIPPING_THRESHOLD || d.tier.key === 'platinum' ? 0 : SHIPPING_FEE
      const total = Math.max(0, subtotal - discount + shipping)
      const mult = s.member ? d.tier.multiplier : 0
      const pointsEarned = Math.round(subtotal * POINTS_PER_DOLLAR * mult)
      const order: Order = { id: 'LU-' + Math.floor(1700 + Math.random() * 8000), ts: new Date().toISOString(), items, subtotal, discount, shipping, total, status: 'processing', pointsEarned, voucherUsed: opts.voucher?.id, express: opts.express, address: opts.address, pointsAt: mult }
      dispatch({ type: 'ORDER_PLACE', order })
      if (opts.voucher) dispatch({ type: 'REDEMPTION_SET', id: opts.voucher.id, status: 'used' })
      if (s.member) {
        if (pointsEarned > 0) dispatch({ type: 'EARN', source: 'order', points: pointsEarned, note: `Order ${order.id}`, leaderboardEligible: true })
        if (items.some(i => i.gift)) dispatch({ type: 'UPDATE_MEMBER', patch: { oneForOneUsed: true } })
        const names = items.filter(i => !i.gift).map(i => productById(i.productId)?.name).filter(Boolean)
        activity('order', `You checked out ${names[0]}${names.length > 1 ? ` +${names.length - 1}` : ''}`, 'bag')
        // referral completion simulation: a pending referral completes on the referred friend's order, not ours; nothing here
      }
      audit('system', 'order.placed', `${order.id} · ${money(total)} · ${pointsEarned} pts`)
      return order
    },
    saveRoutine(am: string[], pm: string[]) { const first = !get().routine.savedAt; dispatch({ type: 'ROUTINE_SET', am, pm }); if (get().member) { dispatch({ type: 'MISSION_DONE', id: 'save-routine' }); if (first) dispatch({ type: 'ACHIEVE', id: 'routine-builder' }) } toast('Routine saved', { icon: 'check' }) },
    logRoutine(slot: 'am' | 'pm') {
      const s = get(); if (!s.member) { toast('Join Glow Club to earn routine points'); return }
      if (s.routineLog[today()]?.[slot]) { toast(`${slot.toUpperCase()} routine already logged today`); return }
      dispatch({ type: 'ROUTINE_LOG', slot }); dispatch({ type: 'MISSION_DONE', id: slot })
      const p = earnCapped('routine', missionPts(slot), `${slot.toUpperCase()} routine completed`)
      if (p) toast(`${slot.toUpperCase()} routine complete · +${p} pts`, { icon: slot === 'am' ? 'sun' : 'moon', copper: true })
      if (slot === 'am' && new Date().getHours() < 8) dispatch({ type: 'ACHIEVE', id: 'early-bird' })
    },
    checkIn() {
      const s = get(); if (!s.member) { toast('Join Glow Club to start your streak'); return 0 }
      if (s.checkins.includes(today())) { toast('Already claimed today. See you tomorrow.'); return 0 }
      const streakBefore = computeStreak(s.checkins); const day = Math.min(7, streakBefore + 1)
      const bonus = STREAK_BONUS[day] ?? 0; const base = missionPts('checkin')
      dispatch({ type: 'CHECKIN' }); dispatch({ type: 'MISSION_DONE', id: 'checkin' })
      dispatch({ type: 'EARN', source: 'checkin', points: base + bonus, note: `Daily check-in · day ${streakBefore + 1}${bonus ? ` · streak bonus +${bonus}` : ''}` })
      toast(`Checked in · +${base + bonus} pts`, { icon: 'flame', copper: true })
      const newStreak = streakBefore + 1
      if (newStreak === 7) activity('streak', 'You completed a 7-day streak', 'flame')
      if (newStreak === 30) activity('streak', 'You completed a 30-day streak', 'flame')
      return base + bonus
    },
    useStreakProtection() {
      const s = get(); if (!s.member) return false
      const mk = monthKey(); const y = today(daysAgo(1)); if (s.checkins.includes(y)) { toast('Your streak is intact'); return false }
      if (s.streakShields > 0) { dispatch({ type: 'STREAK_PROTECT', month: mk, day: y, useShield: true }); toast('Streak shield used. Your streak continues.', { icon: 'shield', copper: true }); return true }
      if (s.member.streakProtectionMonth === mk) { toast('Streak protection already used this month'); return false }
      dispatch({ type: 'STREAK_PROTECT', month: mk, day: y })
      toast('Streak protected. No pressure, just consistency.', { icon: 'shield' }); return true
    },
    completeLesson(id: string, correct: boolean) {
      const s = get(); if (!s.member) { toast('Join Glow Club to earn from lessons'); return }
      if (s.lessonsDone.includes(id)) { toast('Lesson already completed'); return }
      if (!correct) { toast('Not quite. Re-read and try again.'); return }
      dispatch({ type: 'LESSON_DONE', id })
      const doneToday = (s.missionsDone[today()] ?? []).filter(m => m === 'learn').length
      dispatch({ type: 'MISSION_DONE', id: 'learn' }); dispatch({ type: 'MISSION_DONE', id: 'learn:' + id })
      if (doneToday >= 1) { toast('Lesson complete. Points for lessons resume tomorrow.', { icon: 'book' }); return }
      const p = earnCapped('learn', missionPts('learn'), `Lesson · ${LESSONS.find(l => l.id === id)?.title}`)
      if (p) toast(`Lesson complete · +${p} pts`, { icon: 'book', copper: true })
    },
    addReview(productId: string, rating: number, text: string) {
      const s = get(); if (!s.member) { toast('Sign in to review'); return }
      const order = s.orders.find(o => o.items.some(i => i.productId === productId))
      const verified = !!order
      if (s.reviews.some(r => r.productId === productId)) { toast('You have already reviewed this product'); return }
      dispatch({ type: 'REVIEW_ADD', review: { id: uid(), productId, rating, text, ts: new Date().toISOString(), verified, orderId: order?.id } })
      if (verified) { dispatch({ type: 'MISSION_DONE', id: 'review' }); dispatch({ type: 'EARN', source: 'review', points: missionPts('review'), note: `Verified review · ${productById(productId)?.name}` }); toast(`Thank you · +${missionPts('review')} pts`, { icon: 'star', copper: true }) }
      else toast('Review submitted. Points apply to verified purchases only.', { icon: 'star' })
    },
    refer(name: string, email: string) {
      const s = get(); if (!s.member) return
      dispatch({ type: 'REFERRAL_ADD', referral: { id: uid(), name, email, ts: new Date().toISOString(), status: 'invited' } })
      toast(`Invitation sent to ${name}. Points arrive after their first order.`, { icon: 'users' })
    },
    simulateReferralOrder(id: string) {
      const s = get(); const r = s.referrals.find(x => x.id === id); if (!r || r.status === 'ordered') return
      dispatch({ type: 'REFERRAL_SET', id, status: 'ordered' }); dispatch({ type: 'EARN', source: 'referral', points: missionPts('refer'), note: `Referral · ${r.name} placed their first order` })
      toast(`${r.name} ordered · +${missionPts('refer')} pts`, { icon: 'users', copper: true })
    },
    completeSkinProfile(profile: Member['skinProfile']) {
      const s = get(); if (!s.member) return
      const first = !s.member.skinProfile
      dispatch({ type: 'UPDATE_MEMBER', patch: { skinProfile: profile } })
      if (first) { dispatch({ type: 'MISSION_DONE', id: 'skin-profile' }); dispatch({ type: 'EARN', source: 'profile', points: missionPts('skin-profile'), note: 'Skin profile completed' }); dispatch({ type: 'ACHIEVE', id: 'skin-profile' }); toast(`Skin profile saved · +${missionPts('skin-profile')} pts`, { icon: 'face', copper: true }) } else toast('Skin profile updated')
    },
    storeVisit() {
      const s = get(); if (!s.member || s.member.storeVisited) { toast('Store visit already recorded'); return }
      dispatch({ type: 'UPDATE_MEMBER', patch: { storeVisited: true } }); dispatch({ type: 'EARN', source: 'visit', points: missionPts('visit'), note: 'Store visit' }); dispatch({ type: 'ACHIEVE', id: 'store-visit' })
      toast(`Welcome in store · +${missionPts('visit')} pts`, { icon: 'store', copper: true })
    },
    claimWeekly(challengeId: string) {
      const s = get(); const key = `${challengeId}:${weekKey()}`; if (s.weeklyBonusClaimed.includes(key)) return
      const ch = WEEKLY_CHALLENGES.find(c => c.id === challengeId)!; dispatch({ type: 'WEEKLY_CLAIM', key })
      dispatch({ type: 'EARN', source: 'weekly', points: ch.bonus, note: `Weekly challenge · ${ch.title}` }); if (ch.badge) dispatch({ type: 'ACHIEVE', id: ch.badge })
      activity('earn', `You completed ${ch.title}`, 'shield'); toast(`Challenge complete · +${ch.bonus} pts`, { icon: 'sparkle', copper: true })
    },
    redeem(rewardId: string) {
      const s = get(); const d = derive(s); const r = rewardById(rewardId); if (!r || !s.member) { toast('Join Glow Club to redeem rewards'); return null }
      const stock = s.admin.rewardStock[r.id]; if (stock !== null && stock !== undefined && stock <= 0) { toast('This reward is currently out of stock'); return null }
      if (r.minTier && TIERS.findIndex(t => t.key === d.tier.key) < TIERS.findIndex(t => t.key === r.minTier)) { toast(`Available from ${TIERS.find(t => t.key === r.minTier)?.name}`); return null }
      if (d.available < r.points) { toast(`You need ${(r.points - d.available).toLocaleString()} more points`); return null }
      const code = (r.id.slice(0, 3).toUpperCase() + '-' + uid().slice(0, 4).toUpperCase())
      const red: Redemption = { id: uid(), rewardId, ts: new Date().toISOString(), points: r.points, status: r.requiresApproval ? 'pending' : 'approved', code }
      dispatch({ type: 'REDEEM', redemption: red })
      if (r.requiresApproval) { dispatch({ type: 'LEDGER', entry: { id: uid(), ts: new Date().toISOString(), type: 'pending', source: 'reward-hold', points: -r.points, note: `Held for approval · ${r.name}`, leaderboardEligible: false } }); toast(`Request submitted. ${r.points.toLocaleString()} points held pending approval.`, { icon: 'clock' }) }
      else { dispatch({ type: 'SPEND', source: 'reward', points: r.points, note: `Redeemed · ${r.name}` }); toast(`${r.name} redeemed`, { icon: 'gift', copper: true }) }
      if (stock !== null && stock !== undefined) dispatch({ type: 'ADMIN', patch: { rewardStock: { ...s.admin.rewardStock, [r.id]: stock - 1 } } })
      activity('redeem', `You redeemed ${r.name}`, r.id === 'japan' ? 'plane' : r.id === 'coffee' ? 'coffee' : 'gift')
      audit('member', 'reward.redeem', `${s.member.firstName} · ${r.name} · ${r.points} pts${r.requiresApproval ? ' · pending approval' : ''}`)
      return red
    },
    saveReward(id: string) { dispatch({ type: 'SAVE_REWARD', id }) },
    useRedemption(id: string) { dispatch({ type: 'REDEMPTION_SET', id, status: 'used' }) },
    spin(): string | null {
      const s = get(); if (!s.member) { toast('Join Glow Club to spin'); return null }
      if (s.spins[today()]) { toast('You have already spun today. Come back tomorrow.'); return null }
      const total = SPIN_PRIZES.reduce((t, p) => t + p.weight, 0); let r = Math.random() * total
      const prize = SPIN_PRIZES.find(p => { r -= p.weight; return r <= 0 }) ?? SPIN_PRIZES[0]
      return prize.id
    },
    applySpin(prizeId: string) {
      const s = get(); if (!s.member || s.spins[today()]) return
      dispatch({ type: 'SPIN', prizeId }); dispatch({ type: 'ACHIEVE', id: 'first-spin' })
      const prize = SPIN_PRIZES.find(x => x.id === prizeId)!
      audit('system', 'spin.prize', `${s.member.firstName} · ${prize.label} ${prize.sub}`)
      if (prize.kind !== 'points') activity('earn', `You won ${prize.sub.toLowerCase()} on Glow Spin`, prize.icon)
    },
    markAchievementsSeen(ids: string[]) { dispatch({ type: 'SEEN_ACHIEVEMENTS', ids }) },
    prompt(patch: Partial<State['prompts']>) { dispatch({ type: 'PROMPT', patch }) },
    /* Admin */
    adminApprove(id: string, approve: boolean, note?: string) {
      const s = get(); const r = s.redemptions.find(x => x.id === id); if (!r) return; const rw = rewardById(r.rewardId)!
      dispatch({ type: 'APPROVE', id, approve, note })
      audit('admin', approve ? 'reward.approve' : 'reward.reject', `${rw.name} · ${r.points} pts${note ? ' · ' + note : ''}`)
      toast(approve ? `${rw.name} approved · ${r.points.toLocaleString()} pts deducted` : `${rw.name} rejected · points released`)
    },
    adminAdjust(points: number, reason: string) {
      dispatch({ type: 'LEDGER', entry: { id: uid(), ts: new Date().toISOString(), type: 'adjust', source: 'adjust', points, note: `Adjustment · ${reason}`, leaderboardEligible: false } })
      audit('admin', 'points.adjust', `${points > 0 ? '+' : ''}${points} pts · ${reason}`)
    },
    adminSet(patch: Partial<AdminSettings>, detail: string) { dispatch({ type: 'ADMIN', patch }); audit('admin', 'settings.update', detail) },
    adminOrderStatus(id: string, status: Order['status']) { dispatch({ type: 'ORDER_STATUS', id, status }); audit('admin', 'order.status', `${id} → ${status}`) },
    reset() { dispatch({ type: 'RESET' }); try { localStorage.removeItem(KEY) } catch {} },
    audit,
  }
}
const money = (n: number) => `S$${n}`

/* ---------- Achievement engine ---------- */
function checkAchievements(s: State, d: ReturnType<typeof derive>, dispatch: React.Dispatch<Action>, toast: Ctx['toast']) {
  if (!s.member) return
  const unlock = (id: string) => { if (!s.achievements[id]) { dispatch({ type: 'ACHIEVE', id }); const a = ACHIEVEMENTS.find(x => x.id === id); if (a) toast(`Badge unlocked · ${a.name}`, { icon: 'medal', copper: true }) } }
  if (d.lifetime >= 2500) unlock('first-glow'); if (d.lifetime >= 5000) unlock('glow-getter'); if (d.lifetime >= 10000) unlock('spa-retreat'); if (d.lifetime >= 20000) unlock('weekend-ready'); if (d.lifetime >= 50000) unlock('japan-bound')
  if (d.tier.key === 'gold' || d.tier.key === 'platinum') unlock('gold'); if (d.tier.key === 'platinum') unlock('platinum')
  if (d.routineCheckins >= 7) unlock('ritual-regular'); if (d.routineCheckins >= 30) unlock('ritual-devotee')
  if (d.streak >= 7) unlock('streak-7'); if (d.streak >= 30) unlock('streak-30'); if (d.streak >= 100) unlock('streak-100')
  if (s.reviews.some(r => r.verified)) unlock('review-maven'); if (s.reviews.filter(r => r.verified).length >= 5) unlock('review-5')
  if (s.referrals.some(r => r.status === 'ordered')) unlock('referral-circle'); if (s.referrals.filter(r => r.status === 'ordered').length >= 5) unlock('referral-5')
  if (s.lessonsDone.length >= 3) unlock('learner'); if (s.lessonsDone.length >= LESSONS.length) unlock('scholar')
  if (computeStreak(Object.keys(s.spins)) >= 7) unlock('spin-7')
  if (s.orders.length) unlock('first-order'); if (s.redemptions.length) unlock('first-redeem'); if (s.redemptions.filter(r => r.rewardId === 'coffee').length >= 5) unlock('coffee-club')
  const owned = new Set(s.orders.flatMap(o => o.items.flatMap(i => productById(i.productId)?.includes ?? [i.productId])))
  if (['cleanser', 'serum', 'cream', 'spf'].every(p => owned.has(p))) unlock('complete-ritual')
  const pmNights = [0, 1, 2, 3, 4, 5, 6].every(n => s.routineLog[today(daysAgo(n))]?.pm); if (pmNights) unlock('night-owl')
  if (s.member.joinedAt && Date.now() - new Date(s.member.joinedAt).getTime() > 365 * 864e5) unlock('anniversary')
}
export { PRODUCTS, REWARDS, TIERS, MILESTONES, MISSIONS, WEEKLY_CHALLENGES }
