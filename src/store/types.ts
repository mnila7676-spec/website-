import type { TierKey } from '@/data/club'

export interface Address { id: string; label: string; line1: string; line2?: string; postal: string; isDefault: boolean }
export interface Member {
  id: string; memberId: string; firstName: string; lastName: string; nickname?: string; email: string; mobile: string
  joinedAt: string; birthday?: string; skinProfile?: { type: string; concerns: string[]; goal: string }
  consent: { marketing: boolean; publicActivity: boolean; push: boolean }
  addresses: Address[]; referralCode: string
  oneForOneUsed: boolean; welcomeSeen: boolean; storeVisited: boolean
  streakProtectionMonth?: string
}
export type LedgerType = 'earn' | 'spend' | 'pending' | 'reversal' | 'expire' | 'adjust' | 'release'
export interface LedgerEntry { id: string; ts: string; type: LedgerType; source: string; points: number; note: string; leaderboardEligible: boolean }
export interface CartItem { productId: string; qty: number; gift?: boolean }
export interface OrderItem { productId: string; qty: number; price: number; gift?: boolean }
export interface Order { id: string; ts: string; items: OrderItem[]; subtotal: number; discount: number; shipping: number; total: number; status: 'processing' | 'shipped' | 'delivered' | 'refunded'; pointsEarned: number; voucherUsed?: string; express?: boolean; address: string; pointsAt: number }
export interface Redemption { id: string; rewardId: string; ts: string; points: number; status: 'pending' | 'approved' | 'fulfilled' | 'rejected' | 'used'; code: string; note?: string }
export interface Review { id: string; productId: string; rating: number; text: string; ts: string; verified: boolean; orderId?: string }
export interface Referral { id: string; name: string; email: string; ts: string; status: 'invited' | 'joined' | 'ordered' }
export interface AuditEntry { id: string; ts: string; actor: string; action: string; detail: string }
export interface UserActivity { id: string; type: string; text: string; ts: string; icon: string }
export interface AdminSettings {
  tickerEnabled: boolean; scrollModalEnabled: boolean; giftDrawerEnabled: boolean; modalScrollPercent: number; modalDelaySeconds: number
  missionPoints: Record<string, number>; rewardStock: Record<string, number | null>; hiddenActivity: string[]; approvedActivity: string[]
  activityTypes: Record<string, boolean>; announcement: string
}
export interface State {
  version: number
  member: Member | null
  ledger: LedgerEntry[]
  cart: CartItem[]
  wishlist: string[]
  orders: Order[]
  routine: { am: string[]; pm: string[]; savedAt?: string }
  routineLog: Record<string, { am?: string; pm?: string }>
  checkins: string[]
  missionsDone: Record<string, string[]>
  lessonsDone: string[]
  reviews: Review[]
  referrals: Referral[]
  redemptions: Redemption[]
  savedRewards: string[]
  achievements: Record<string, string>
  weeklyBonusClaimed: string[]
  spins: Record<string, string>
  streakShields: number
  seenAchievements: string[]
  userActivity: UserActivity[]
  audit: AuditEntry[]
  admin: AdminSettings
  prompts: { barDismissed: boolean; rewardReveal: boolean; giftDrawerSeenFor: string[] }
  demoSeeded?: boolean
  lastVisit?: string
}
export type TierRef = TierKey
