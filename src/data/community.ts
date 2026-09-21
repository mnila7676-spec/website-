export type ActivityType = 'redeem' | 'earn' | 'tier' | 'streak' | 'milestone' | 'order' | 'achievement'
export interface Activity { id: string; type: ActivityType; name: string; text: string; minutesAgo: number; approved: boolean; icon: string; hidden?: boolean }
export const ACTIVITY: Activity[] = [
  { id: 'a1', type: 'redeem', name: 'Sofia T.', text: 'redeemed Japan Flight for Two', minutesAgo: 2, approved: true, icon: 'plane' },
  { id: 'a2', type: 'redeem', name: 'Amelia K.', text: 'claimed a free coffee', minutesAgo: 15, approved: true, icon: 'coffee' },
  { id: 'a3', type: 'earn', name: 'Chloe L.', text: 'earned 680 Glow Points', minutesAgo: 24, approved: true, icon: 'sun' },
  { id: 'a4', type: 'order', name: 'Isabella M.', text: 'checked out Glow Renewal Serum', minutesAgo: 31, approved: true, icon: 'bag' },
  { id: 'a5', type: 'tier', name: 'Aisha R.', text: 'reached Radiance Gold', minutesAgo: 48, approved: true, icon: 'medal' },
  { id: 'a6', type: 'streak', name: 'Nadia S.', text: 'completed a 30-day streak', minutesAgo: 66, approved: true, icon: 'flame' },
  { id: 'a7', type: 'redeem', name: 'Emma R.', text: 'redeemed a S$20 Lumiva Voucher', minutesAgo: 95, approved: true, icon: 'gift' },
  { id: 'a8', type: 'milestone', name: 'Maya L.', text: 'unlocked Japan flights for two', minutesAgo: 140, approved: true, icon: 'torii' },
  { id: 'a9', type: 'redeem', name: 'Chloe D.', text: 'unlocked Signature Facial', minutesAgo: 180, approved: true, icon: 'leaf' },
  { id: 'a10', type: 'achievement', name: 'Hannah K.', text: 'earned the Ritual Regular badge', minutesAgo: 210, approved: true, icon: 'calendar-check' },
  { id: 'a11', type: 'earn', name: 'Olivia W.', text: 'completed the 7-Day Barrier Reset', minutesAgo: 260, approved: true, icon: 'shield' },
  { id: 'a12', type: 'order', name: 'Grace T.', text: 'checked out The Lumiva Ritual Set', minutesAgo: 300, approved: true, icon: 'bag' },
  { id: 'a13', type: 'redeem', name: 'Mia J.', text: 'redeemed Dinner for Two', minutesAgo: 380, approved: true, icon: 'gift' },
  { id: 'a14', type: 'streak', name: 'Ella R.', text: 'completed a 7-day streak', minutesAgo: 420, approved: true, icon: 'flame' },
  { id: 'a15', type: 'tier', name: 'Priya N.', text: 'reached Radiance Platinum', minutesAgo: 600, approved: true, icon: 'medal' },
  { id: 'a16', type: 'redeem', name: 'Jasmine O.', text: 'redeemed a Staycation for Two', minutesAgo: 900, approved: false, icon: 'gift' },
]

export interface LeaderRow { name: string; initials: string; weekly: number; monthly: number; allTime: number }
export const LEADERS: LeaderRow[] = [
  { name: 'Amelia K.', initials: 'AK', weekly: 18920, monthly: 42150, allTime: 168400 },
  { name: 'Chloe L.', initials: 'CL', weekly: 16340, monthly: 39800, allTime: 152300 },
  { name: 'Sofia T.', initials: 'ST', weekly: 15210, monthly: 41020, allTime: 201800 },
  { name: 'Emma R.', initials: 'ER', weekly: 11480, monthly: 28400, allTime: 99200 },
  { name: 'Isabella M.', initials: 'IM', weekly: 9860, monthly: 25100, allTime: 88600 },
  { name: 'Olivia W.', initials: 'OW', weekly: 8420, monthly: 22300, allTime: 76400 },
  { name: 'Grace H.', initials: 'GH', weekly: 7890, monthly: 19850, allTime: 64100 },
  { name: 'Mia J.', initials: 'MJ', weekly: 7120, monthly: 18200, allTime: 58900 },
  { name: 'Hannah K.', initials: 'HK', weekly: 6980, monthly: 17600, allTime: 51200 },
  { name: 'Ella R.', initials: 'ER', weekly: 6900, monthly: 16900, allTime: 47300 },
  { name: 'Nadia S.', initials: 'NS', weekly: 6840, monthly: 16200, allTime: 45800 },
  { name: 'Aisha R.', initials: 'AR', weekly: 6410, monthly: 15100, allTime: 40200 },
  { name: 'Priya N.', initials: 'PN', weekly: 5980, monthly: 14700, allTime: 121000 },
  { name: 'Maya L.', initials: 'ML', weekly: 5420, monthly: 13900, allTime: 188500 },
  { name: 'Jasmine O.', initials: 'JO', weekly: 4980, monthly: 12200, allTime: 33100 },
]

export const REVIEWS: Record<string, { name: string; rating: number; text: string; date: string; verified: boolean }[]> = {
  serum: [
    { name: 'Chloe L.', rating: 5, text: 'Two weeks in and my skin looks lit from within. No stickiness, sits well under SPF.', date: '3 Sep 2026', verified: true },
    { name: 'Isabella M.', rating: 5, text: 'Finally a vitamin C that does not sting. The glow is real.', date: '28 Aug 2026', verified: true },
    { name: 'Grace T.', rating: 4, text: 'Lovely texture. I wish the bottle were bigger.', date: '19 Aug 2026', verified: true },
  ],
  cream: [
    { name: 'Emma R.', rating: 5, text: 'Rescued my barrier after a retinol overdo. Calm within days.', date: '1 Sep 2026', verified: true },
    { name: 'Hannah K.', rating: 5, text: 'Rich but not greasy, even in this humidity.', date: '22 Aug 2026', verified: true },
  ],
  cleanser: [
    { name: 'Mia J.', rating: 5, text: 'Gentle, soft foam and no tightness. My whole family uses it.', date: '30 Aug 2026', verified: true },
    { name: 'Olivia W.', rating: 4, text: 'Removes SPF well. Needs a second pass for heavy makeup.', date: '15 Aug 2026', verified: true },
  ],
  spf: [
    { name: 'Sofia T.', rating: 5, text: 'Zero white cast on my skin tone and no pilling under foundation.', date: '5 Sep 2026', verified: true },
    { name: 'Aisha R.', rating: 4, text: 'Weightless. Slight sheen but I like it.', date: '26 Aug 2026', verified: true },
  ],
}
