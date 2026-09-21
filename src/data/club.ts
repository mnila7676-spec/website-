import { asset } from '@/lib/asset'
export type TierKey = 'silver' | 'gold' | 'platinum'
export interface Tier { key: TierKey; name: string; short: string; min: number; multiplier: number; benefits: string[]; color: string }
export const TIERS: Tier[] = [
  { key: 'silver', name: 'Radiance Silver', short: 'Silver', min: 0, multiplier: 1, color: '#b9b4ad',
    benefits: ['10 Glow Points per S$1', 'Daily missions and streaks', 'Access to the rewards marketplace', 'Member-only launches'] },
  { key: 'gold', name: 'Radiance Gold', short: 'Gold', min: 5000, multiplier: 1.25, color: '#c9a55e',
    benefits: ['1.25x points on every spend', 'Birthday gift', 'Early reward access', 'Priority facial bookings'] },
  { key: 'platinum', name: 'Radiance Platinum', short: 'Platinum', min: 25000, multiplier: 1.5, color: '#8d8a86',
    benefits: ['1.5x points on every spend', 'Complimentary express delivery', 'Annual full-size gift', 'Invitations to member evenings'] },
]
export const tierFor = (lifetime: number): Tier => [...TIERS].reverse().find(t => lifetime >= t.min) ?? TIERS[0]
export const nextTier = (lifetime: number): Tier | null => TIERS.find(t => t.min > lifetime) ?? null

export interface Milestone { points: number; name: string; blurb: string; reward: string; rewardId?: string; image: string }
export const MILESTONES: Milestone[] = [
  { points: 2500, name: 'First Glow', blurb: 'Your first checkpoint.', reward: 'Coffee or Matcha + First Glow badge', rewardId: 'coffee', image: asset('/images/rewards/coffee-cup.jpg') },
  { points: 5000, name: 'Glow Getter', blurb: 'Radiance Gold unlocked.', reward: 'S$20 voucher + Gold tier', rewardId: 'voucher-20', image: asset('/images/rewards/voucher.jpg') },
  { points: 10000, name: 'Spa Retreat', blurb: 'Time to recharge.', reward: 'Signature Facial', rewardId: 'facial', image: asset('/images/rewards/spa-retreat.jpg') },
  { points: 20000, name: 'Weekend Escape', blurb: 'Keep going.', reward: 'Staycation for Two', rewardId: 'staycation', image: asset('/images/rewards/staycation.jpg') },
  { points: 50000, name: 'Japan for Two', blurb: 'The ultimate escape.', reward: 'Return flights to Japan for two', rewardId: 'japan', image: asset('/images/rewards/japan-pagoda.jpg') },
]

export interface Mission { id: string; title: string; blurb: string; points: number; cadence: 'daily' | 'once' | 'weekly' | 'per-purchase'; icon: string; limitPerDay?: number }
export const MISSIONS: Mission[] = [
  { id: 'checkin', title: 'Daily Check-In', blurb: 'Keep your streak alive. Earn points every day.', points: 80, cadence: 'daily', icon: 'calendar' },
  { id: 'am', title: 'Complete AM routine', blurb: 'Confirm your morning ritual.', points: 30, cadence: 'daily', icon: 'sun' },
  { id: 'pm', title: 'Complete PM routine', blurb: 'Confirm your evening ritual.', points: 30, cadence: 'daily', icon: 'moon' },
  { id: 'learn', title: 'Learn and earn', blurb: 'Read a short lesson and pass a quick check.', points: 20, cadence: 'daily', icon: 'book', limitPerDay: 1 },
  { id: 'review', title: 'Review a verified purchase', blurb: 'Share a useful review for a product you bought.', points: 150, cadence: 'per-purchase', icon: 'star' },
  { id: 'skin-profile', title: 'Complete your skin profile', blurb: 'Tell us about your skin for better recommendations.', points: 200, cadence: 'once', icon: 'face' },
  { id: 'refer', title: 'Refer a friend', blurb: 'Points arrive after your friend’s first order.', points: 500, cadence: 'per-purchase', icon: 'users' },
  { id: 'visit', title: 'Visit Lumiva', blurb: 'Scan the store code at the counter.', points: 50, cadence: 'once', icon: 'store' },
]
export const STREAK_BONUS = [0, 0, 10, 20, 30, 40, 50, 80] // extra points by streak day (index = day, capped at 7)
export const DAILY_ENGAGEMENT_CAP = 400
export const LEADERBOARD_PURCHASE_CAP = 1000 // purchase points counted per week
export const WELCOME_POINTS = 500

export interface WeeklyChallenge { id: string; title: string; blurb: string; bonus: number; badge?: string; tasks: { id: string; label: string; target: number; mission: string }[] }
export const WEEKLY_CHALLENGES: WeeklyChallenge[] = [
  { id: 'routines-5', title: 'Complete 5 routines', blurb: 'Gentle consistency, not perfection.', bonus: 300,
    tasks: [{ id: 'r', label: 'Routine check-ins', target: 5, mission: 'routine' }] },
  { id: 'barrier-reset', title: '7-Day Barrier Reset', blurb: 'Save a routine, four check-ins, one guide, one review.', bonus: 450, badge: 'barrier-reset',
    tasks: [
      { id: 'save', label: 'Save a routine', target: 1, mission: 'save-routine' },
      { id: 'r', label: 'Routine check-ins', target: 4, mission: 'routine' },
      { id: 'l', label: 'Read the barrier-care guide', target: 1, mission: 'learn:barrier' },
      { id: 'rev', label: 'Review a verified purchase', target: 1, mission: 'review' },
    ] },
]

export interface Achievement { id: string; name: string; blurb: string; icon: string; category: 'milestone' | 'routine' | 'community' | 'learning' | 'referral' }
export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first-glow', name: 'First Glow', blurb: 'Reach 2,500 lifetime points', icon: 'sparkle', category: 'milestone' },
  { id: 'glow-getter', name: 'Glow Getter', blurb: 'Reach 5,000 lifetime points', icon: 'sun', category: 'milestone' },
  { id: 'spa-retreat', name: 'Spa Retreat', blurb: 'Reach 10,000 lifetime points', icon: 'leaf', category: 'milestone' },
  { id: 'weekend-ready', name: 'Weekend Ready', blurb: 'Reach 20,000 lifetime points', icon: 'bag', category: 'milestone' },
  { id: 'japan-bound', name: 'Japan Bound', blurb: 'Reach 50,000 lifetime points', icon: 'torii', category: 'milestone' },
  { id: 'ritual-regular', name: 'Ritual Regular', blurb: '7 routine check-ins', icon: 'calendar-check', category: 'routine' },
  { id: 'ritual-devotee', name: 'Ritual Devotee', blurb: '30 routine check-ins', icon: 'calendar-check', category: 'routine' },
  { id: 'streak-7', name: 'Seven Days', blurb: '7-day check-in streak', icon: 'flame', category: 'routine' },
  { id: 'streak-30', name: 'Thirty Days', blurb: '30-day check-in streak', icon: 'flame', category: 'routine' },
  { id: 'streak-100', name: 'Century', blurb: '100-day check-in streak', icon: 'flame', category: 'routine' },
  { id: 'barrier-reset', name: 'Barrier Reset', blurb: 'Complete the 7-Day Barrier Reset', icon: 'shield', category: 'routine' },
  { id: 'routine-builder', name: 'Routine Builder', blurb: 'Save your first AM/PM routine', icon: 'layers', category: 'routine' },
  { id: 'review-maven', name: 'Review Maven', blurb: 'Write a verified review', icon: 'pen', category: 'community' },
  { id: 'review-5', name: 'Trusted Voice', blurb: 'Write 5 verified reviews', icon: 'pen', category: 'community' },
  { id: 'referral-circle', name: 'Referral Circle', blurb: 'Refer a friend who orders', icon: 'users', category: 'referral' },
  { id: 'referral-5', name: 'Glow Ambassador', blurb: 'Refer 5 friends who order', icon: 'users', category: 'referral' },
  { id: 'learner', name: 'Curious Mind', blurb: 'Complete 3 lessons', icon: 'book', category: 'learning' },
  { id: 'scholar', name: 'Skin Scholar', blurb: 'Complete every lesson', icon: 'book', category: 'learning' },
  { id: 'first-order', name: 'First Ritual', blurb: 'Place your first order', icon: 'bag', category: 'milestone' },
  { id: 'complete-ritual', name: 'Complete Ritual', blurb: 'Own all four steps', icon: 'layers', category: 'routine' },
  { id: 'first-redeem', name: 'Well Deserved', blurb: 'Redeem your first reward', icon: 'gift', category: 'milestone' },
  { id: 'coffee-club', name: 'Coffee Club', blurb: 'Redeem 5 coffees', icon: 'coffee', category: 'milestone' },
  { id: 'top-10', name: 'Top Ten', blurb: 'Finish a week in the top 10', icon: 'crown', category: 'community' },
  { id: 'gold', name: 'Radiance Gold', blurb: 'Reach Gold tier', icon: 'medal', category: 'milestone' },
  { id: 'platinum', name: 'Radiance Platinum', blurb: 'Reach Platinum tier', icon: 'medal', category: 'milestone' },
  { id: 'skin-profile', name: 'Know Your Skin', blurb: 'Complete your skin profile', icon: 'face', category: 'learning' },
  { id: 'store-visit', name: 'In Person', blurb: 'Visit the Lumiva store', icon: 'store', category: 'community' },
  { id: 'early-bird', name: 'Early Bird', blurb: 'Complete an AM routine before 8am', icon: 'sun', category: 'routine' },
  { id: 'night-owl', name: 'Night Owl', blurb: 'Complete a PM routine 7 nights in a row', icon: 'moon', category: 'routine' },
  { id: 'anniversary', name: 'One Year', blurb: 'Celebrate a year with Glow Club', icon: 'sparkle', category: 'milestone' },
  { id: 'first-spin', name: 'Glow Spinner', blurb: 'Take your first Glow Spin', icon: 'compass', category: 'routine' },
  { id: 'spin-7', name: 'Lucky Week', blurb: 'Spin 7 days in a row', icon: 'crown', category: 'routine' },
]

export interface Lesson { id: string; title: string; minutes: number; tag: string; summary: string; body: string[]; quiz: { q: string; options: string[]; answer: number } }
export const LESSONS: Lesson[] = [
  { id: 'barrier', title: 'Barrier care 101', minutes: 3, tag: 'Barrier', summary: 'What your moisture barrier does and how to keep it calm.',
    body: ['Your skin barrier is the outermost layer of the skin: a wall of cells held together by lipids in a specific ratio of ceramides, cholesterol and fatty acids.', 'When it is healthy, water stays in and irritants stay out. When it is damaged, skin feels tight, stings with products and looks dull.', 'The fastest route to repair: cleanse gently, pause strong actives for a week, and moisturise with a ceramide-rich cream morning and night.'],
    quiz: { q: 'Which lipid family is essential for a healthy barrier?', options: ['Ceramides', 'Silicones', 'Fragrance oils'], answer: 0 } },
  { id: 'layering', title: 'Layering serums', minutes: 2, tag: 'Routine', summary: 'The simple rule for what goes first.',
    body: ['Apply products from thinnest to thickest texture. Water-light serums first, creams last.', 'Give each layer 30 to 60 seconds to absorb before the next one.', 'Sunscreen is always the final morning step, regardless of texture.'],
    quiz: { q: 'What is the final step of a morning routine?', options: ['Serum', 'Sunscreen', 'Cleanser'], answer: 1 } },
  { id: 'spf', title: 'Why SPF every day', minutes: 2, tag: 'Protect', summary: 'UV comes through clouds and windows too.',
    body: ['Up to 80% of visible ageing is linked to UV exposure, and UVA passes through clouds and glass.', 'Two finger-lengths of sunscreen covers the face and neck. Reapply every two hours outdoors.', 'SPF protects the results of every other product you use.'],
    quiz: { q: 'How much sunscreen covers the face and neck?', options: ['A pea', 'Two finger-lengths', 'A teaspoon'], answer: 1 } },
  { id: 'vitc', title: 'Vitamin C, explained', minutes: 3, tag: 'Treat', summary: 'How it brightens, and how to use it well.',
    body: ['Vitamin C is an antioxidant that neutralises free radicals and slows pigment production for a brighter, more even tone.', 'Stabilised forms like 3-O-Ethyl Ascorbic Acid are gentler and last longer than pure L-ascorbic acid.', 'Use it in the morning under sunscreen for the best defence.'],
    quiz: { q: 'When is vitamin C most useful?', options: ['Only at night', 'In the morning under SPF', 'Only after exfoliating'], answer: 1 } },
  { id: 'double-cleanse', title: 'To double cleanse or not', minutes: 2, tag: 'Cleanse', summary: 'When one cleanse is enough.',
    body: ['Double cleansing removes sunscreen and makeup first, then cleans the skin itself.', 'If you wear light SPF and no makeup, one gentle cleanse is enough.', 'Over-cleansing strips the barrier. Lukewarm water and 30 seconds is the sweet spot.'],
    quiz: { q: 'What water temperature is best for cleansing?', options: ['Hot', 'Lukewarm', 'Ice cold'], answer: 1 } },
  { id: 'humidity', title: 'Skincare in humid climates', minutes: 2, tag: 'Routine', summary: 'Light layers for Singapore days.',
    body: ['Humidity does not mean skin is hydrated. Air-conditioning pulls water from the skin all day.', 'Use thinner layers in the morning and a fuller moisturiser at night.', 'A gel-cream or a thin layer of cream is plenty for daytime under SPF.'],
    quiz: { q: 'What dehydrates skin indoors?', options: ['Air-conditioning', 'Humidity', 'Drinking water'], answer: 0 } },
]

export interface SpinPrize { id: string; label: string; sub: string; short: string; kind: 'points' | 'shield' | 'express' | 'mini'; value: number; weight: number; icon: string; rare?: boolean }
export const SPIN_PRIZES: SpinPrize[] = [
  { id: 'p10', label: '+10', sub: 'Glow Points', short: 'POINTS', kind: 'points', value: 10, weight: 28, icon: 'sun' },
  { id: 'p20', label: '+20', sub: 'Glow Points', short: 'POINTS', kind: 'points', value: 20, weight: 24, icon: 'sun' },
  { id: 'shield', label: 'Shield', sub: 'Streak protection', short: 'STREAK SAVER', kind: 'shield', value: 1, weight: 5, icon: 'shield', rare: true },
  { id: 'p30', label: '+30', sub: 'Glow Points', short: 'POINTS', kind: 'points', value: 30, weight: 18, icon: 'sun' },
  { id: 'p50', label: '+50', sub: 'Glow Points', short: 'POINTS', kind: 'points', value: 50, weight: 12, icon: 'sparkle' },
  { id: 'express', label: 'Express', sub: 'Free express delivery', short: 'FREE DELIVERY', kind: 'express', value: 1, weight: 4, icon: 'truck', rare: true },
  { id: 'p80', label: '+80', sub: 'Glow Points', short: 'POINTS', kind: 'points', value: 80, weight: 7, icon: 'sparkle' },
  { id: 'mini', label: 'Mini', sub: 'Mini Cleanser sample', short: 'SAMPLE', kind: 'mini', value: 1, weight: 2, icon: 'gift', rare: true },
]
export const SPIN_RULES = ['One spin per day, after your daily check-in.', 'Odds are shown and identical for every member.', 'Prizes are small by design and never require a purchase.', 'Spin points count toward your daily engagement cap.']
