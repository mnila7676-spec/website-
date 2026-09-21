import { asset } from '@/lib/asset'
export type RewardCategory = 'everyday' | 'beauty' | 'experiences' | 'travel'
export interface Reward {
  id: string
  name: string
  blurb: string
  category: RewardCategory
  points: number
  image: string
  description: string
  eligibility: string
  validity: string
  availability: string
  stock: number | null
  redemptionSteps: string[]
  terms: string[]
  hero?: boolean
  requiresApproval?: boolean
  minTier?: 'silver' | 'gold' | 'platinum'
}

export const REWARDS: Reward[] = [
  { id: 'coffee', name: 'Coffee or Matcha', blurb: 'A little glow, on us.', category: 'everyday', points: 600, image: asset('/images/rewards/coffee.jpg'),
    description: 'One handcrafted coffee or ceremonial matcha at any Lumiva partner café. Treat yourself, daily.',
    eligibility: 'All Glow Club members', validity: '30 days from redemption', availability: 'Always available', stock: null,
    redemptionSteps: ['Redeem in your wallet to receive a QR code.', 'Show the code at any partner café.', 'Enjoy. Points are deducted on redemption.'],
    terms: ['One drink up to S$8 in value.', 'Not exchangeable for cash.', 'Partner list shown in the app.'] },
  { id: 'voucher-20', name: 'S$20 Lumiva Voucher', blurb: 'Treat yourself beautifully.', category: 'everyday', points: 2000, image: asset('/images/rewards/voucher.jpg'),
    description: 'S$20 off your next Lumiva order, online or in store.',
    eligibility: 'All Glow Club members', validity: '90 days from redemption', availability: 'Always available', stock: null,
    redemptionSteps: ['Redeem to add the voucher to your wallet.', 'Apply it at checkout with one tap.', 'Combine with your tier discount.'],
    terms: ['Minimum spend S$60.', 'One voucher per order.', 'Cannot be applied to previous orders.'] },
  { id: 'express-delivery', name: 'Express Delivery', blurb: 'Same-day, complimentary.', category: 'everyday', points: 400, image: asset('/images/rewards/gift-box.jpg'),
    description: 'Complimentary same-day express delivery on your next order, anywhere in Singapore.',
    eligibility: 'All Glow Club members', validity: '60 days from redemption', availability: 'Always available', stock: null,
    redemptionSteps: ['Redeem to save it to your wallet.', 'Select express delivery at checkout at no charge.'],
    terms: ['Orders placed before 2pm.', 'Singapore addresses only.'] },
  { id: 'birthday-gift', name: 'Birthday Gift', blurb: 'A deluxe mini, from us.', category: 'everyday', points: 0, image: asset('/images/rewards/gift-box.jpg'),
    description: 'A complimentary deluxe miniature during your birthday month. A Radiance Gold and Platinum tier benefit.',
    eligibility: 'Radiance Gold and above', validity: 'Your birthday month', availability: 'Once a year', stock: null, minTier: 'gold',
    redemptionSteps: ['Add your birthday in your profile.', 'Claim during your birthday month.', 'Added to your next order or collected in store.'],
    terms: ['One gift per member per year.', 'Birthday must be added at least 30 days before.'] },
  { id: 'mini-cleanser', name: 'Mini Cleanser', blurb: 'Gentle Cloud Cleanser, 30 ml.', category: 'beauty', points: 900, image: asset('/images/products/cleanser.jpg'),
    description: 'A travel-size Gentle Cloud Cleanser delivered with your next order or collected in store.',
    eligibility: 'All Glow Club members', validity: '90 days from redemption', availability: 'In stock', stock: 120,
    redemptionSteps: ['Redeem to reserve your mini.', 'Add it to your next order or collect in store.'],
    terms: ['While stocks last.', 'One per redemption.'] },
  { id: 'ritual-set', name: 'Lumiva Ritual Discovery Set', blurb: 'Elevate your glow.', category: 'beauty', points: 3800, image: asset('/images/rewards/ritual-set.jpg'),
    description: 'A trio of deluxe minis: cleanser, serum and cream. Two weeks of the full ritual.',
    eligibility: 'All Glow Club members', validity: '90 days from redemption', availability: 'Limited', stock: 48,
    redemptionSteps: ['Redeem to reserve the set.', 'Shipped with your next order or collected in store.'],
    terms: ['While stocks last.', 'One set per member per quarter.'] },
  { id: 'serum-full', name: 'Glow Renewal Serum', blurb: 'Full size, 30 ml.', category: 'beauty', points: 6800, image: asset('/images/products/serum.jpg'),
    description: 'A full-size Glow Renewal Serum, our best seller, on the house.',
    eligibility: 'All Glow Club members', validity: '90 days from redemption', availability: 'In stock', stock: 60,
    redemptionSteps: ['Redeem to reserve.', 'Shipped free or collected in store.'],
    terms: ['While stocks last.'] },
  { id: 'facial', name: 'Signature Facial', blurb: 'Recharge and restore.', category: 'experiences', points: 10000, image: asset('/images/rewards/facial.jpg'),
    description: 'A 75-minute Lumiva Signature Facial at our partner studio. Barrier-first, results-led.',
    eligibility: 'All Glow Club members', validity: '6 months from redemption', availability: '12 slots this month', stock: 12,
    redemptionSteps: ['Redeem to receive a booking code.', 'Book your slot in the app or by WhatsApp.', 'Show your code at the studio.'],
    terms: ['Subject to studio availability.', '24-hour cancellation policy.'] },
  { id: 'dinner', name: 'Dinner for Two', blurb: 'A night to remember.', category: 'experiences', points: 8500, image: asset('/images/rewards/dinner.jpg'),
    description: 'A three-course dinner for two at a partner restaurant.',
    eligibility: 'All Glow Club members', validity: '3 months from redemption', availability: 'Limited', stock: 20,
    redemptionSteps: ['Redeem to receive a voucher code.', 'Reserve directly with the restaurant.'],
    terms: ['Beverages not included.', 'Excludes public holidays.'] },
  { id: 'wellness', name: 'Wellness Session', blurb: 'Breathe, stretch, reset.', category: 'experiences', points: 12000, image: asset('/images/rewards/spa-retreat.jpg'),
    description: 'A 90-minute private wellness session: guided breathwork, stretch and a mini facial massage.',
    eligibility: 'Radiance Gold and above', validity: '6 months', availability: 'Limited', stock: 8, minTier: 'gold',
    redemptionSteps: ['Redeem to receive a booking code.', 'Book with the partner studio.'],
    terms: ['Subject to availability.'] },
  { id: 'staycation', name: 'Staycation for Two', blurb: 'Relax and unwind together.', category: 'travel', points: 25000, image: asset('/images/rewards/staycation.jpg'),
    description: 'One night for two at a partner boutique hotel, breakfast included.',
    eligibility: 'Radiance Gold and above', validity: '12 months from redemption', availability: '4 available', stock: 4, minTier: 'gold', requiresApproval: true,
    redemptionSteps: ['Redeem to submit a request.', 'Our team confirms within 3 working days.', 'Receive your booking voucher by email.'],
    terms: ['Blackout dates apply.', 'Subject to hotel availability.', 'Non-transferable.'] },
  { id: 'japan', name: 'Japan Flight for Two', blurb: 'Your next unforgettable escape.', category: 'travel', points: 50000, image: asset('/images/rewards/japan-hero.jpg'), hero: true, requiresApproval: true,
    description: 'Two-way economy flights to Japan for two. The Glow Club hero reward, earned through long-term loyalty.',
    eligibility: 'Radiance Silver tier and above, account in good standing, member for 6+ months', validity: '2 years from redemption', availability: '2 per quarter', stock: 2,
    redemptionSteps: ['Redeem to submit your request. Points are held, not deducted.', 'Lumiva verifies eligibility and approves within 5 working days.', 'Choose your dates with our travel partner.'],
    terms: ['Blackout dates may apply during peak holidays.', 'Taxes and surcharges included up to S$180 per person.', 'Non-transferable and not exchangeable for cash.', 'Public announcement only with your consent.'] },
]
export const rewardById = (id: string) => REWARDS.find(r => r.id === id)
export const REWARD_TABS: { key: RewardCategory; label: string }[] = [
  { key: 'everyday', label: 'Everyday' }, { key: 'beauty', label: 'Beauty' }, { key: 'experiences', label: 'Experiences' }, { key: 'travel', label: 'Travel' },
]
