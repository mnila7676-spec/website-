import { asset } from '@/lib/asset'
export type TierKey = 'glow' | 'radiant' | 'luminous' | 'ambassador'
export interface Tier { key: TierKey; name: string; short: string; min: number; multiplier: number; benefits: string[]; color: string; icon: string; tagline: string; how: string }
/* Four tiers, per the Glow Club V1 framework. Ambassador is earned through successful referrals, not spend. */
export const TIERS: Tier[] = [
  { key: 'glow', name: 'Glow', short: 'Glow', min: 0, multiplier: 1, color: '#c9a55e', icon: 'leaf', tagline: 'Entry', how: 'Everyone starts here',
    benefits: ['Welcome reward and 1-for-1', '10 Glow Points per S$1', 'Member-only offers', 'Birthday reward', 'Challenges and the reward catalogue', 'Refer & Glow programme'] },
  { key: 'radiant', name: 'Radiant', short: 'Radiant', min: 5000, multiplier: 1.25, color: '#b8734a', icon: 'sparkle', tagline: 'Engagement', how: '5,000 lifetime points from spend and engagement',
    benefits: ['1.25x points on every spend', 'Early access to selected products', 'Better birthday reward', 'Exclusive challenges', 'Member-only rewards', 'Bonus-point events'] },
  { key: 'luminous', name: 'Luminous', short: 'Luminous', min: 15000, multiplier: 1.5, color: '#8d8a86', icon: 'medal', tagline: 'Loyalty', how: '15,000 lifetime points',
    benefits: ['1.5x points on every spend', 'Premium rewards', 'Early product access', 'Priority support', 'Exclusive experiences', 'Special referral bonuses'] },
  { key: 'ambassador', name: 'Glow Ambassador', short: 'Ambassador', min: Infinity, multiplier: 1.5, color: '#6b1f3f', icon: 'crown', tagline: 'Advocacy', how: '10 successful referrals. Glow. Share. Inspire.',
    benefits: ['Highest referral rewards', 'Ambassador-only products', 'VIP experiences and events', 'Priority customer service', 'Early launches', 'Ambassador badge and leaderboard'] },
]
export const AMBASSADOR_REFERRALS = 10
export const DEFAULT_THRESHOLDS = { radiant: 5000, luminous: 15000, ambassador: AMBASSADOR_REFERRALS }
export const tierFor = (lifetime: number, referrals = 0, t = DEFAULT_THRESHOLDS): Tier => {
  if (referrals >= t.ambassador) return TIERS[3]
  if (lifetime >= t.luminous) return TIERS[2]
  if (lifetime >= t.radiant) return TIERS[1]
  return TIERS[0]
}
export const nextTier = (lifetime: number, referrals = 0, t = DEFAULT_THRESHOLDS): { tier: Tier; need: number; unit: 'points' | 'referrals' } | null => {
  if (referrals >= t.ambassador) return null
  if (lifetime < t.radiant) return { tier: TIERS[1], need: t.radiant - lifetime, unit: 'points' }
  if (lifetime < t.luminous) return { tier: TIERS[2], need: t.luminous - lifetime, unit: 'points' }
  return { tier: TIERS[3], need: t.ambassador - referrals, unit: 'referrals' }
}
export const PILLARS = [
  { key: 'shop', label: 'Shop', icon: 'bag', objective: 'Discover products and build your ritual' },
  { key: 'glow', label: 'Glow', icon: 'sun', objective: 'Earn for engagement and healthy skincare habits' },
  { key: 'share', label: 'Share', icon: 'users', objective: 'Give the glow to friends and be rewarded' },
  { key: 'belong', label: 'Belong', icon: 'crown', objective: 'Recognition, status and community' },
]
export const TAGLINES = { club: 'Your skincare journey, rewarded.', refer: 'Give the glow. Get rewarded.', ambassador: 'Glow. Share. Inspire.' }
export const POINT_VALUE_SGD = 0.01 // 1,000 Glow Points = S$10
export const FIRST_PURCHASE_BONUS = 1000
export const REFERRAL_REWARD = 1500
export const FRIEND_DISCOUNT = 15
export const QUALIFICATION_DAYS = 14
export interface ReferralMilestone { count: number; label: string; reward: string; bonus: number; badge?: string; tier?: boolean }
export const REFERRAL_MILESTONES: ReferralMilestone[] = [
  { count: 1, label: 'First friend', reward: '1,500 Glow Points', bonus: 0, badge: 'referral-circle' },
  { count: 3, label: 'Glow Circle', reward: '+2,500 bonus points', bonus: 2500, badge: 'referral-3' },
  { count: 5, label: 'Glow Giver', reward: '+5,000 bonus points and a Glow gift', bonus: 5000, badge: 'referral-5' },
  { count: 10, label: 'Glow Ambassador', reward: 'Ambassador status', bonus: 0, badge: 'ambassador', tier: true },
  { count: 25, label: 'Glow Icon', reward: 'Premium Glow experience', bonus: 0, badge: 'referral-25' },
  { count: 50, label: 'Signature', reward: 'Signature Ambassador reward', bonus: 0, badge: 'referral-50' },
]
export type ReferralStatus = 'invited' | 'clicked' | 'registered' | 'purchased' | 'pending' | 'qualified' | 'rewarded'
export const REFERRAL_STATES: { key: ReferralStatus; label: string; blurb: string }[] = [
  { key: 'invited', label: 'Invited', blurb: 'Your invitation was sent' },
  { key: 'clicked', label: 'Clicked', blurb: 'Your friend opened the link' },
  { key: 'registered', label: 'Registered', blurb: 'They joined Glow Club' },
  { key: 'purchased', label: 'Purchased', blurb: 'First order placed with 15% off' },
  { key: 'pending', label: 'Pending', blurb: 'Waiting for the qualification period' },
  { key: 'qualified', label: 'Qualified', blurb: 'Order kept, checks passed' },
  { key: 'rewarded', label: 'Rewarded', blurb: '1,500 Glow Points added' },
]
export const RULEBOOK = [
  ['Point monetary value', '1,000 Glow Points = S$10'], ['Purchase earning rate', '10 points per S$1, before tier multiplier'], ['Welcome points', '500 on joining'], ['Review points', '250 per verified review'],
  ['Challenge points', 'Daily 25 to 100 · weekly 300 to 500 · monthly 1,000'], ['Referral reward', '1,500 points per successful referral'], ['Friend discount', '15% off a friend\u2019s first qualifying order'], ['Referral qualification period', '14 days after the friend\u2019s order, no return'],
  ['Tier thresholds', 'Radiant 5,000 · Luminous 15,000 lifetime points · Ambassador 10 referrals'], ['Tier benefits', '1x · 1.25x · 1.5x points plus access and experiences'], ['Point expiry', '12 months from earning'], ['Reward expiry', 'Shown on each reward, 30 days to 2 years'],
  ['Refund treatment', 'Points reversed on refund with a ledger record'], ['Fraud rules', 'Duplicate-account checks, daily caps, self-referral blocked, reversals audited'], ['Ambassador qualification', '10 successful referrals and an account in good standing'],
]
export interface Milestone { points: number; name: string; blurb: string; reward: string; rewardId?: string; image: string }
export const MILESTONES: Milestone[] = [
  { points: 2500, name: 'First Glow', blurb: 'Your first checkpoint.', reward: 'Coffee or Matcha + First Glow badge', rewardId: 'coffee', image: asset('/images/rewards/coffee-cup.jpg') },
  { points: 5000, name: 'Glow Getter', blurb: 'Radiant unlocked.', reward: 'S$20 voucher + Radiant tier', rewardId: 'voucher-20', image: asset('/images/rewards/voucher.jpg') },
  { points: 10000, name: 'Spa Retreat', blurb: 'Time to recharge.', reward: 'Signature Facial', rewardId: 'facial', image: asset('/images/rewards/spa-retreat.jpg') },
  { points: 20000, name: 'Weekend Escape', blurb: 'Keep going.', reward: 'Staycation for Two', rewardId: 'staycation', image: asset('/images/rewards/staycation.jpg') },
  { points: 50000, name: 'Japan for Two', blurb: 'The ultimate escape.', reward: 'Return flights to Japan for two', rewardId: 'japan', image: asset('/images/rewards/japan-pagoda.jpg') },
]

export interface Mission { id: string; title: string; blurb: string; points: number; cadence: 'daily' | 'once' | 'weekly' | 'per-purchase'; icon: string; limitPerDay?: number }
export const MISSIONS: Mission[] = [
  { id: 'checkin', title: 'Daily Check-In', blurb: 'Keep your streak alive. Earn points every day.', points: 80, cadence: 'daily', icon: 'calendar' },
  { id: 'am', title: 'Complete AM routine', blurb: 'Confirm your morning ritual.', points: 25, cadence: 'daily', icon: 'sun' },
  { id: 'pm', title: 'Complete PM routine', blurb: 'Confirm your evening ritual.', points: 25, cadence: 'daily', icon: 'moon' },
  { id: 'learn', title: 'Learn & Earn', blurb: 'Read today\u2019s skincare tip and pass the quiz.', points: 100, cadence: 'daily', icon: 'book', limitPerDay: 1 },
  { id: 'review', title: 'Review a verified purchase', blurb: 'Share a useful review for a product you bought.', points: 250, cadence: 'per-purchase', icon: 'star' },
  { id: 'skin-profile', title: 'Complete your skin profile', blurb: 'Tell us about your skin for better recommendations.', points: 500, cadence: 'once', icon: 'face' },
  { id: 'refer', title: 'Refer a friend', blurb: 'Points arrive after your friend’s first order.', points: 500, cadence: 'per-purchase', icon: 'users' },
  { id: 'visit', title: 'Visit Lumiva', blurb: 'Scan the store code at the counter.', points: 50, cadence: 'once', icon: 'store' },
]
export const STREAK_BONUS = [0, 0, 10, 20, 30, 40, 50, 80] // extra points by streak day (index = day, capped at 7)
export const DAILY_ENGAGEMENT_CAP = 600
export const LEADERBOARD_PURCHASE_CAP = 1000 // purchase points counted per week
export const WELCOME_POINTS = 500

export interface WeeklyChallenge { id: string; title: string; blurb: string; bonus: number; badge?: string; period: 'weekly' | 'monthly'; tasks: { id: string; label: string; target: number; mission: string }[] }
export const WEEKLY_CHALLENGES: WeeklyChallenge[] = [
  { id: 'routines-5', title: 'Complete 5 routines', blurb: 'Gentle consistency, not perfection.', bonus: 300, period: 'weekly',
    tasks: [{ id: 'r', label: 'Routine check-ins', target: 5, mission: 'routine' }] },
  { id: 'barrier-reset', title: '7-Day Barrier Reset', blurb: 'Four routine check-ins, one lesson, one verified review.', bonus: 500, badge: 'barrier-reset', period: 'weekly',
    tasks: [
      { id: 'r', label: 'Routine check-ins', target: 4, mission: 'routine' },
      { id: 'l', label: 'Complete a lesson', target: 1, mission: 'learn' },
      { id: 'rev', label: 'Review a verified purchase', target: 1, mission: 'review' },
    ] },
  { id: 'glow-together', title: 'Glow Together', blurb: 'The monthly community challenge: invite, complete, learn, review.', bonus: 1000, badge: 'glow-together', period: 'monthly',
    tasks: [
      { id: 'inv', label: 'Invite a friend', target: 1, mission: 'refer-invite' },
      { id: 'r', label: 'Complete a routine', target: 1, mission: 'routine' },
      { id: 'l', label: 'Learn something new', target: 1, mission: 'learn' },
      { id: 'rev', label: 'Review a product', target: 1, mission: 'review' },
    ] },
]
export const CHALLENGES = WEEKLY_CHALLENGES

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
  { id: 'referral-circle', name: 'First Friend', blurb: 'Your first successful referral', icon: 'users', category: 'referral' },
  { id: 'referral-3', name: 'Glow Circle', blurb: '3 successful referrals', icon: 'users', category: 'referral' },
  { id: 'referral-5', name: 'Glow Giver', blurb: '5 successful referrals', icon: 'gift', category: 'referral' },
  { id: 'ambassador', name: 'Glow Ambassador', blurb: '10 successful referrals', icon: 'crown', category: 'referral' },
  { id: 'referral-25', name: 'Glow Icon', blurb: '25 successful referrals', icon: 'sparkle', category: 'referral' },
  { id: 'referral-50', name: 'Signature Ambassador', blurb: '50 successful referrals', icon: 'medal', category: 'referral' },
  { id: 'glow-together', name: 'Glow Together', blurb: 'Complete the monthly community challenge', icon: 'users', category: 'community' },
  { id: 'learner', name: 'Curious Mind', blurb: 'Complete 3 lessons', icon: 'book', category: 'learning' },
  { id: 'scholar', name: 'Skin Scholar', blurb: 'Complete every lesson', icon: 'book', category: 'learning' },
  { id: 'first-order', name: 'First Ritual', blurb: 'Place your first order', icon: 'bag', category: 'milestone' },
  { id: 'complete-ritual', name: 'Complete Ritual', blurb: 'Own all four steps', icon: 'layers', category: 'routine' },
  { id: 'first-redeem', name: 'Well Deserved', blurb: 'Redeem your first reward', icon: 'gift', category: 'milestone' },
  { id: 'coffee-club', name: 'Coffee Club', blurb: 'Redeem 5 coffees', icon: 'coffee', category: 'milestone' },
  { id: 'top-10', name: 'Top Ten', blurb: 'Finish a week in the top 10', icon: 'crown', category: 'community' },
  { id: 'radiant', name: 'Radiant', blurb: 'Reach Radiant tier', icon: 'sparkle', category: 'milestone' },
  { id: 'luminous', name: 'Luminous', blurb: 'Reach Luminous tier', icon: 'medal', category: 'milestone' },
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
