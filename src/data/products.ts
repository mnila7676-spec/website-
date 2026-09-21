import { asset } from '@/lib/asset'
export type Step = 'cleanse' | 'treat' | 'hydrate' | 'protect'
export type Category = 'cleansers' | 'serums' | 'moisturisers' | 'spf' | 'sets' | 'minis'
export type Concern = 'dullness' | 'dehydration' | 'sensitivity' | 'barrier' | 'uneven-tone' | 'fine-lines' | 'sun-damage'

export interface Product {
  id: string
  slug: string
  name: string
  tagline: string
  category: Category
  step: Step | 'all'
  price: number
  compareAt?: number
  size: string
  rating: number
  reviews: number
  image: string
  imageDark: string
  description: string
  benefits: string[]
  ingredients: { name: string; role: string }[]
  howToUse: string[]
  concerns: Concern[]
  skinTypes: string[]
  routine: 'AM' | 'PM' | 'AM / PM'
  giftEligible: boolean
  stock: number
  badge?: string
  includes?: string[]
  faqs: { q: string; a: string }[]
  usageDays: number
}

export const PRODUCTS: Product[] = [
  {
    id: 'serum', slug: 'glow-renewal-serum', name: 'Glow Renewal Serum', tagline: 'Brightens & hydrates',
    category: 'serums', step: 'treat', price: 68, size: '30 ml', rating: 4.8, reviews: 128,
    image: asset('/images/products/serum.jpg'), imageDark: asset('/images/products/serum-dark.jpg'),
    description: 'A lightweight, fast-absorbing serum that brightens dull skin, deeply hydrates and supports a healthy skin barrier. Formulated with stabilised vitamin C, niacinamide and three weights of hyaluronic acid for visible radiance in 14 days.',
    benefits: ['Brightens dull skin', 'Deep hydration boost', 'Lightweight & fast-absorbing', 'Supports an even tone'],
    ingredients: [
      { name: 'Vitamin C (3-O-Ethyl Ascorbic Acid)', role: 'Brightens and defends against daily oxidative stress' },
      { name: 'Niacinamide 5%', role: 'Evens tone and refines the look of pores' },
      { name: 'Triple Hyaluronic Acid', role: 'Hydrates at three depths for a plumped feel' },
      { name: 'Panthenol', role: 'Soothes and supports barrier recovery' },
    ],
    howToUse: ['Apply 3–4 drops to clean, dry skin.', 'Press gently into face and neck, avoiding the eye area.', 'Follow with Barrier Repair Cream. Use morning and evening.'],
    concerns: ['dullness', 'dehydration', 'uneven-tone'], skinTypes: ['All skin types'], routine: 'AM / PM',
    giftEligible: true, stock: 120, badge: 'Best seller',
    faqs: [
      { q: 'Can I use it with retinol?', a: 'Yes. Use the serum in the morning and retinol in the evening, or alternate nights if your skin is new to actives.' },
      { q: 'Is it suitable for sensitive skin?', a: 'The formula is fragrance-free and pH-balanced. Patch test on the inner arm for 24 hours if your skin is reactive.' },
    ],
    usageDays: 45,
  },
  {
    id: 'cream', slug: 'barrier-repair-cream', name: 'Barrier Repair Cream', tagline: 'Strengthens barrier',
    category: 'moisturisers', step: 'hydrate', price: 72, size: '50 ml', rating: 4.8, reviews: 96,
    image: asset('/images/products/cream.jpg'), imageDark: asset('/images/products/cream-dark.jpg'),
    description: 'A rich yet breathable moisturiser built around a ceramide-cholesterol-fatty-acid complex in the skin’s own ratio. It seals in hydration, calms tightness and leaves skin comfortable for 24 hours.',
    benefits: ['Rebuilds the moisture barrier', '24-hour comfort', 'Calms tightness and redness', 'Non-greasy finish'],
    ingredients: [
      { name: 'Ceramide Complex (NP, AP, EOP)', role: 'Replenishes the lipids that keep moisture in' },
      { name: 'Squalane', role: 'Lightweight nourishment that mirrors skin’s own oils' },
      { name: 'Centella Asiatica', role: 'Soothes and supports recovery' },
      { name: 'Shea Butter', role: 'Softens and protects' },
    ],
    howToUse: ['Warm a pea-sized amount between fingertips.', 'Smooth over face and neck after serum.', 'Use morning and evening. Layer a second thin coat on very dry nights.'],
    concerns: ['barrier', 'dehydration', 'sensitivity'], skinTypes: ['Dry', 'Normal', 'Sensitive'], routine: 'AM / PM',
    giftEligible: true, stock: 84,
    faqs: [
      { q: 'Will it feel heavy in humid weather?', a: 'It is designed for Singapore’s climate. Use a thin layer in the morning and a fuller layer at night.' },
    ],
    usageDays: 60,
  },
  {
    id: 'cleanser', slug: 'gentle-cloud-cleanser', name: 'Gentle Cloud Cleanser', tagline: 'Gently purifies',
    category: 'cleansers', step: 'cleanse', price: 48, size: '120 ml', rating: 4.7, reviews: 82,
    image: asset('/images/products/cleanser.jpg'), imageDark: asset('/images/products/cleanser-dark.jpg'),
    description: 'A cloud-soft cream-to-foam cleanser that lifts away sunscreen, sebum and the day without stripping. Amino-acid surfactants and oat extract leave skin clean, calm and never tight.',
    benefits: ['Removes SPF and impurities', 'pH-balanced, no tightness', 'Soft cloud lather', 'Fragrance-free'],
    ingredients: [
      { name: 'Amino Acid Surfactants', role: 'Gentle, effective cleansing' },
      { name: 'Colloidal Oat', role: 'Calms and comforts' },
      { name: 'Glycerin', role: 'Keeps skin hydrated while cleansing' },
    ],
    howToUse: ['Massage a small amount onto damp skin for 30 seconds.', 'Rinse with lukewarm water and pat dry.', 'Use morning and evening as step one of your ritual.'],
    concerns: ['sensitivity', 'barrier', 'dullness'], skinTypes: ['All skin types'], routine: 'AM / PM',
    giftEligible: true, stock: 150,
    faqs: [{ q: 'Does it remove makeup?', a: 'It removes light makeup and sunscreen. For heavy makeup, use it as a second cleanse.' }],
    usageDays: 50,
  },
  {
    id: 'spf', slug: 'daily-defence-spf', name: 'Daily Defence SPF', tagline: 'Broad spectrum SPF 50',
    category: 'spf', step: 'protect', price: 58, size: '50 ml', rating: 4.7, reviews: 74,
    image: asset('/images/products/spf.jpg'), imageDark: asset('/images/products/spf-dark.jpg'),
    description: 'An invisible, weightless SPF 50 PA++++ with blue-light defence. It layers beautifully under makeup with no white cast, no pilling and no greasy feel.',
    benefits: ['SPF 50 PA++++', 'No white cast', 'Blue-light defence', 'Makeup-friendly finish'],
    ingredients: [
      { name: 'Modern UV Filters', role: 'Broad-spectrum UVA/UVB protection' },
      { name: 'Ectoin', role: 'Shields against environmental stress' },
      { name: 'Vitamin E', role: 'Antioxidant support' },
    ],
    howToUse: ['Apply two finger-lengths as the final morning step.', 'Reapply every two hours in direct sun.', 'Remove with Gentle Cloud Cleanser in the evening.'],
    concerns: ['sun-damage', 'uneven-tone', 'fine-lines'], skinTypes: ['All skin types'], routine: 'AM',
    giftEligible: false, stock: 96, badge: 'New',
    faqs: [{ q: 'Is it reef-safe?', a: 'Yes, the formula is free from oxybenzone and octinoxate.' }],
    usageDays: 40,
  },
  {
    id: 'ritual-set', slug: 'the-lumiva-ritual-set', name: 'The Lumiva Ritual Set', tagline: 'Cleanse, treat, hydrate',
    category: 'sets', step: 'all', price: 188, size: '3 full sizes', rating: 4.9, reviews: 54,
    image: asset('/images/hero-group.jpg'), imageDark: asset('/images/hero-group.jpg'),
    description: 'The complete three-step ritual: Gentle Cloud Cleanser, Glow Renewal Serum and Barrier Repair Cream. Everything your skin needs, morning and evening.',
    benefits: ['Three full-size products', 'A complete AM/PM routine', 'Ready to gift', 'Earn 1,880 Glow Points'],
    ingredients: [], howToUse: ['Cleanse, treat, hydrate. Morning and evening.'],
    concerns: ['dullness', 'dehydration', 'barrier'], skinTypes: ['All skin types'], routine: 'AM / PM',
    giftEligible: false, stock: 40, includes: ['cleanser', 'serum', 'cream'],
    faqs: [], usageDays: 50,
  },
  {
    id: 'complete-set', slug: 'the-complete-ritual', name: 'The Complete Ritual', tagline: 'All four steps, save 15%',
    category: 'sets', step: 'all', price: 210, compareAt: 246, size: '4 full sizes', rating: 4.9, reviews: 31,
    image: asset('/images/hero-group.jpg'), imageDark: asset('/images/hero-group.jpg'),
    description: 'All four steps: cleanse, treat, hydrate and protect. Save 15% when you build the whole ritual.',
    benefits: ['Four full-size products', 'Save S$36', 'Complete AM and PM routine', 'Earn 2,100 Glow Points'],
    ingredients: [], howToUse: ['Cleanse, treat, hydrate, protect in the morning. Cleanse, treat, hydrate at night.'],
    concerns: ['dullness', 'dehydration', 'barrier', 'sun-damage'], skinTypes: ['All skin types'], routine: 'AM / PM',
    giftEligible: false, stock: 25, includes: ['cleanser', 'serum', 'cream', 'spf'], badge: 'Save 15%',
    faqs: [], usageDays: 45,
  },
  {
    id: 'mini-cleanser', slug: 'mini-gentle-cloud-cleanser', name: 'Mini Cleanser', tagline: 'Gentle Cloud Cleanser, 30 ml',
    category: 'minis', step: 'cleanse', price: 16, size: '30 ml', rating: 4.7, reviews: 40,
    image: asset('/images/products/cleanser.jpg'), imageDark: asset('/images/products/cleanser-dark.jpg'),
    description: 'Travel-size Gentle Cloud Cleanser. Perfect for weekends away or your gym bag.',
    benefits: ['Travel-friendly', 'Same gentle formula'], ingredients: [], howToUse: ['Massage onto damp skin, rinse.'],
    concerns: ['sensitivity'], skinTypes: ['All skin types'], routine: 'AM / PM', giftEligible: true, stock: 200,
    faqs: [], usageDays: 12,
  },
  {
    id: 'mini-serum', slug: 'travel-glow-renewal-serum', name: 'Travel Serum', tagline: 'Glow Renewal Serum, 10 ml',
    category: 'minis', step: 'treat', price: 26, size: '10 ml', rating: 4.8, reviews: 36,
    image: asset('/images/products/serum.jpg'), imageDark: asset('/images/products/serum-dark.jpg'),
    description: 'Ten millilitres of Glow Renewal Serum for travel or a first try.',
    benefits: ['Two weeks of glow', 'Cabin-bag ready'], ingredients: [], howToUse: ['Apply 3–4 drops to clean skin.'],
    concerns: ['dullness'], skinTypes: ['All skin types'], routine: 'AM / PM', giftEligible: true, stock: 180,
    faqs: [], usageDays: 14,
  },
  {
    id: 'mini-cream', slug: 'mini-barrier-repair-cream', name: 'Mini Barrier Cream', tagline: 'Barrier Repair Cream, 15 ml',
    category: 'minis', step: 'hydrate', price: 24, size: '15 ml', rating: 4.8, reviews: 29,
    image: asset('/images/products/cream.jpg'), imageDark: asset('/images/products/cream-dark.jpg'),
    description: 'A fifteen-millilitre Barrier Repair Cream for travel, flights and desk drawers.',
    benefits: ['Flight-friendly', 'Instant comfort'], ingredients: [], howToUse: ['Smooth a pea-sized amount over face and neck.'],
    concerns: ['barrier'], skinTypes: ['All skin types'], routine: 'AM / PM', giftEligible: true, stock: 160,
    faqs: [], usageDays: 18,
  },
]

export const productById = (id: string) => PRODUCTS.find(p => p.id === id)
export const productBySlug = (slug: string) => PRODUCTS.find(p => p.slug === slug)
export const BEST_SELLERS = ['serum', 'cream', 'cleanser', 'spf']
export const STEPS: { key: Step; label: string; blurb: string; num: string }[] = [
  { key: 'cleanse', num: '01', label: 'Cleanse', blurb: 'Purify and refresh without stripping.' },
  { key: 'treat', num: '02', label: 'Treat', blurb: 'Target concerns and boost glow.' },
  { key: 'hydrate', num: '03', label: 'Hydrate', blurb: 'Nourish and strengthen barrier.' },
  { key: 'protect', num: '04', label: 'Protect', blurb: 'Shield and defend all day long.' },
]
export const CONCERNS: { key: Concern; label: string; blurb: string }[] = [
  { key: 'dullness', label: 'Dullness', blurb: 'Skin that looks tired and lacks radiance.' },
  { key: 'dehydration', label: 'Dehydration', blurb: 'Tightness, fine dehydration lines and a papery feel.' },
  { key: 'barrier', label: 'Damaged barrier', blurb: 'Stinging, flaking and sensitivity after actives.' },
  { key: 'sensitivity', label: 'Sensitivity', blurb: 'Redness and reactivity to new products.' },
  { key: 'uneven-tone', label: 'Uneven tone', blurb: 'Post-blemish marks and patchy pigmentation.' },
  { key: 'fine-lines', label: 'Fine lines', blurb: 'Early lines around the eyes and mouth.' },
  { key: 'sun-damage', label: 'Sun damage', blurb: 'Freckling, spots and loss of firmness from UV.' },
]
export const POINTS_PER_DOLLAR = 10
export const FREE_SHIPPING_THRESHOLD = 80
export const SHIPPING_FEE = 6
export const money = (n: number) => `S$${n % 1 === 0 ? n : n.toFixed(2)}`
export const pts = (n: number) => n.toLocaleString('en-SG')
