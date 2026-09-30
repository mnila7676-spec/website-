import { asset } from '@/lib/asset'
export type Step = 'cleanse' | 'prep' | 'treat' | 'hydrate' | 'protect'
export type Time = 'day' | 'night' | 'both'
export type Category = 'cleansers' | 'essences' | 'serums' | 'moisturisers' | 'spf' | 'tools' | 'sets' | 'minis'
export type Concern = 'dullness' | 'dehydration' | 'sensitivity' | 'barrier' | 'uneven-tone' | 'fine-lines' | 'sun-damage' | 'firmness'

export interface Product {
  id: string
  slug: string
  name: string
  tagline: string
  category: Category
  step: Step | 'all'
  time: Time
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
    category: 'serums', step: 'treat', time: 'day', price: 68, size: '30 ml', rating: 4.8, reviews: 128,
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
    category: 'moisturisers', step: 'hydrate', time: 'both', price: 72, size: '50 ml', rating: 4.8, reviews: 96,
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
    category: 'cleansers', step: 'cleanse', time: 'both', price: 48, size: '120 ml', rating: 4.7, reviews: 82,
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
    category: 'spf', step: 'protect', time: 'day', price: 58, size: '50 ml', rating: 4.7, reviews: 74,
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
    category: 'sets', step: 'all', time: 'both', price: 188, size: '3 full sizes', rating: 4.9, reviews: 54,
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
    category: 'sets', step: 'all', time: 'both', price: 210, compareAt: 246, size: '4 full sizes', rating: 4.9, reviews: 31,
    image: asset('/images/hero-group.jpg'), imageDark: asset('/images/hero-group.jpg'),
    description: 'All four steps: cleanse, treat, hydrate and protect. Save 15% when you build the whole ritual.',
    benefits: ['Four full-size products', 'Save S$36', 'Complete AM and PM routine', 'Earn 2,100 Glow Points'],
    ingredients: [], howToUse: ['Cleanse, treat, hydrate, protect in the morning. Cleanse, treat, hydrate at night.'],
    concerns: ['dullness', 'dehydration', 'barrier', 'sun-damage'], skinTypes: ['All skin types'], routine: 'AM / PM',
    giftEligible: false, stock: 25, includes: ['cleanser', 'serum', 'cream', 'spf'], badge: 'Save 15%',
    faqs: [], usageDays: 45,
  },
  {
    id: 'barrier-cleanser', slug: 'gentle-barrier-cleanser', name: 'Gentle Barrier Cleanser', tagline: 'Cream cleanse, day and night',
    category: 'cleansers', step: 'cleanse', time: 'both', price: 52, size: '150 ml', rating: 4.8, reviews: 61,
    image: asset('/images/products/barrier-cleanser.jpg'), imageDark: asset('/images/products/barrier-cleanser.jpg'),
    description: 'A cushioning cream cleanser for skin that wants comfort. Ceramides and oat lipids lift away the day while leaving the barrier intact, so skin feels soft, never squeaky.',
    benefits: ['Cream-to-milk texture', 'Ceramide-supported cleanse', 'Removes SPF and light makeup', 'Ideal for dry and sensitive skin'],
    ingredients: [{ name: 'Ceramide NP', role: 'Keeps the barrier intact while cleansing' }, { name: 'Oat Lipids', role: 'Cushion and comfort' }, { name: 'Glycerin', role: 'Holds water in the skin' }],
    howToUse: ['Massage onto dry or damp skin for 30 seconds.', 'Rinse or remove with a warm cloth.', 'Morning and evening as step one.'],
    concerns: ['barrier', 'sensitivity', 'dehydration'], skinTypes: ['Dry', 'Sensitive', 'Normal'], routine: 'AM / PM',
    giftEligible: true, stock: 110, badge: 'New',
    faqs: [{ q: 'Cloud or Barrier cleanser?', a: 'Choose Gentle Cloud for a light foam and combination skin. Choose Gentle Barrier for a cream texture and dry or reactive skin.' }],
    usageDays: 55,
  },
  {
    id: 'essence', slug: 'niacinamide-activating-essence', name: 'Niacinamide Activating Essence', tagline: 'Preps, refines, hydrates',
    category: 'essences', step: 'prep', time: 'both', price: 64, size: '120 ml', rating: 4.7, reviews: 48,
    image: asset('/images/products/essence.jpg'), imageDark: asset('/images/products/essence.jpg'),
    description: 'A watery essence that wakes skin up after cleansing. Five percent niacinamide refines pores and tone while a hydrating base primes skin so every following step absorbs better.',
    benefits: ['Primes skin for serums', 'Refines pores and tone', 'Weightless hydration', 'Alcohol-free'],
    ingredients: [{ name: 'Niacinamide 5%', role: 'Refines pores and evens tone' }, { name: 'Beta-Glucan', role: 'Soothes and hydrates' }, { name: 'Sodium PCA', role: 'Skin\u2019s own moisture magnet' }],
    howToUse: ['After cleansing, press a few drops into damp skin with palms.', 'Follow with serum.', 'Morning and evening.'],
    concerns: ['uneven-tone', 'dehydration', 'dullness'], skinTypes: ['All skin types'], routine: 'AM / PM',
    giftEligible: true, stock: 95, badge: 'New',
    faqs: [], usageDays: 60,
  },
  {
    id: 'sculpt-serum', slug: 'dual-action-sculpting-serum', name: 'Dual-Action Sculpting Serum', tagline: 'Firms & lifts',
    category: 'serums', step: 'treat', time: 'both', price: 118, size: '30 ml', rating: 4.9, reviews: 37,
    image: asset('/images/products/sculpt-serum.jpg'), imageDark: asset('/images/products/sculpt-serum.jpg'),
    description: 'Two chambers, one press. A peptide-and-collagen concentrate meets a firming botanical complex at the moment of application, for visibly lifted contours along the cheek, jawline and neck.',
    benefits: ['Dual-chamber freshness', 'Peptides for firmness', 'Visible lift in 4 weeks', 'Layers under day or night cream'],
    ingredients: [{ name: 'Matrixyl Peptide Complex', role: 'Supports collagen and firmness' }, { name: 'Bakuchiol', role: 'Retinol-like renewal, gentle on the barrier' }, { name: 'Centella Asiatica', role: 'Calms and strengthens' }],
    howToUse: ['Press once to dispense both chambers.', 'Smooth upward over cheeks, jawline and neck.', 'Morning and evening after essence.'],
    concerns: ['firmness', 'fine-lines'], skinTypes: ['All skin types'], routine: 'AM / PM',
    giftEligible: false, stock: 60, badge: 'New',
    faqs: [{ q: 'Can I use it with Glow Renewal Serum?', a: 'Yes. Use Glow Renewal Serum in the morning for brightness and Sculpting Serum at night, or layer sculpting over glow if your skin tolerates both.' }],
    usageDays: 45,
  },
  {
    id: 'firming-moisturiser', slug: 'firming-barrier-moisturiser', name: 'Firming Barrier Moisturizer', tagline: 'Night repair, firmer by morning',
    category: 'moisturisers', step: 'hydrate', time: 'night', price: 88, size: '50 ml', rating: 4.8, reviews: 44,
    image: asset('/images/products/firming-moisturiser.jpg'), imageDark: asset('/images/products/firming-moisturiser.jpg'),
    description: 'A rich night moisturiser that pairs barrier ceramides with firming peptides. Skin repairs overnight and wakes bouncier, calmer and more defined.',
    benefits: ['Overnight barrier repair', 'Firming peptides', 'Deep, non-greasy nourishment', 'Fragrance-free'],
    ingredients: [{ name: 'Ceramide Complex', role: 'Rebuilds the moisture barrier overnight' }, { name: 'Acetyl Hexapeptide-8', role: 'Firms and smooths' }, { name: 'Squalane', role: 'Skin-identical nourishment' }],
    howToUse: ['Warm a small amount between fingertips.', 'Press over face and neck as the final evening step.', 'For very dry skin, layer over Barrier Repair Cream.'],
    concerns: ['firmness', 'barrier', 'dehydration'], skinTypes: ['Dry', 'Normal', 'Mature'], routine: 'PM',
    giftEligible: false, stock: 70, badge: 'Night',
    faqs: [], usageDays: 60,
  },
  {
    id: 'sculpt-cream', slug: 'sculpting-cream', name: 'Sculpting Cream', tagline: 'Face, jawline, neck',
    category: 'moisturisers', step: 'hydrate', time: 'night', price: 96, size: '50 ml', rating: 4.8, reviews: 29,
    image: asset('/images/products/sculpt-cream.jpg'), imageDark: asset('/images/products/sculpt-cream.jpg'),
    description: 'A cushioned cream designed to be massaged, not just applied. Firming botanicals and a slip-perfect texture make it the partner to the Sculpting Tool for face, jawline and neck.',
    benefits: ['Made for massage', 'Firms and contours', 'Cushion texture, no drag', 'Pairs with the Sculpting Tool'],
    ingredients: [{ name: 'Gotu Kola', role: 'Firms and supports circulation' }, { name: 'Shea Butter', role: 'Cushion and slip' }, { name: 'Peptide Complex', role: 'Supports firmness' }],
    howToUse: ['Apply generously to face, jawline and neck.', 'Massage upward and outward for two minutes, with or without the Sculpting Tool.', 'Evenings, three to five times a week.'],
    concerns: ['firmness', 'fine-lines'], skinTypes: ['All skin types'], routine: 'PM',
    giftEligible: false, stock: 55, badge: 'Night',
    faqs: [], usageDays: 50,
  },
  {
    id: 'sculpt-tool', slug: 'sculpting-tool', name: 'Lumiva Sculpting Tool', tagline: 'Contour, lift, de-puff',
    category: 'tools', step: 'all', time: 'night', price: 148, size: 'One tool', rating: 4.9, reviews: 52,
    image: asset('/images/products/sculpt-tool.jpg'), imageDark: asset('/images/products/sculpt-tool.jpg'),
    description: 'A weighted, gold-tone sculpting tool with dual rollers that hug the jawline and cheekbones. Two minutes with Sculpting Cream lifts, de-puffs and defines.',
    benefits: ['Dual rollers for jaw and cheek', 'Weighted for effortless pressure', 'Cool to the touch, de-puffs', 'A ritual for life'],
    ingredients: [], howToUse: ['Apply Sculpting Cream.', 'Roll from the centre of the face outward and upward, then down the neck.', 'Two minutes, evenings.'],
    concerns: ['firmness'], skinTypes: ['All skin types'], routine: 'PM',
    giftEligible: false, stock: 40, badge: 'Tool',
    faqs: [{ q: 'How do I clean it?', a: 'Wipe with a soft damp cloth after each use. Do not submerge.' }],
    usageDays: 3650,
  },
  {
    id: 'night-set', slug: 'the-night-ritual-set', name: 'The Night Ritual Set', tagline: 'Cleanse, prep, sculpt, repair',
    category: 'sets', step: 'all', time: 'night', price: 274, compareAt: 322, size: '4 full sizes', rating: 4.9, reviews: 18,
    image: asset('/images/products/night-set.jpg'), imageDark: asset('/images/products/night-set.jpg'),
    description: 'The complete evening ritual: Gentle Barrier Cleanser, Niacinamide Activating Essence, Dual-Action Sculpting Serum and Firming Barrier Moisturizer. Save 15%.',
    benefits: ['Four full-size night products', 'Save S$48', 'Firmer, calmer skin by morning', 'Earn 2,740 Glow Points'],
    ingredients: [], howToUse: ['Cleanse, prep, treat, hydrate. Every evening.'],
    concerns: ['firmness', 'barrier', 'dehydration'], skinTypes: ['All skin types'], routine: 'PM',
    giftEligible: false, stock: 30, includes: ['barrier-cleanser', 'essence', 'sculpt-serum', 'firming-moisturiser'], badge: 'Save 15%',
    faqs: [], usageDays: 50,
  },
  {
    id: 'sculpt-duo', slug: 'the-sculpting-duo', name: 'The Sculpting Duo', tagline: 'Cream and tool, together',
    category: 'sets', step: 'all', time: 'night', price: 220, compareAt: 244, size: 'Cream + tool', rating: 4.9, reviews: 22,
    image: asset('/images/products/sculpt-duo.jpg'), imageDark: asset('/images/products/sculpt-duo.jpg'),
    description: 'Sculpting Cream and the Lumiva Sculpting Tool, the two-minute evening ritual for face, jawline and neck.',
    benefits: ['Cream and tool', 'Save S$24', 'Ready to gift', 'Earn 2,200 Glow Points'],
    ingredients: [], howToUse: ['Apply cream, roll for two minutes, evenings.'],
    concerns: ['firmness'], skinTypes: ['All skin types'], routine: 'PM',
    giftEligible: false, stock: 25, includes: ['sculpt-cream', 'sculpt-tool'], badge: 'Save 10%',
    faqs: [], usageDays: 50,
  },
  {
    id: 'mini-cleanser', slug: 'mini-gentle-cloud-cleanser', name: 'Mini Cleanser', tagline: 'Gentle Cloud Cleanser, 30 ml',
    category: 'minis', step: 'cleanse', time: 'both', price: 16, size: '30 ml', rating: 4.7, reviews: 40,
    image: asset('/images/products/cleanser.jpg'), imageDark: asset('/images/products/cleanser-dark.jpg'),
    description: 'Travel-size Gentle Cloud Cleanser. Perfect for weekends away or your gym bag.',
    benefits: ['Travel-friendly', 'Same gentle formula'], ingredients: [], howToUse: ['Massage onto damp skin, rinse.'],
    concerns: ['sensitivity'], skinTypes: ['All skin types'], routine: 'AM / PM', giftEligible: true, stock: 200,
    faqs: [], usageDays: 12,
  },
  {
    id: 'mini-serum', slug: 'travel-glow-renewal-serum', name: 'Travel Serum', tagline: 'Glow Renewal Serum, 10 ml',
    category: 'minis', step: 'treat', time: 'day', price: 26, size: '10 ml', rating: 4.8, reviews: 36,
    image: asset('/images/products/serum.jpg'), imageDark: asset('/images/products/serum-dark.jpg'),
    description: 'Ten millilitres of Glow Renewal Serum for travel or a first try.',
    benefits: ['Two weeks of glow', 'Cabin-bag ready'], ingredients: [], howToUse: ['Apply 3–4 drops to clean skin.'],
    concerns: ['dullness'], skinTypes: ['All skin types'], routine: 'AM / PM', giftEligible: true, stock: 180,
    faqs: [], usageDays: 14,
  },
  {
    id: 'mini-cream', slug: 'mini-barrier-repair-cream', name: 'Mini Barrier Cream', tagline: 'Barrier Repair Cream, 15 ml',
    category: 'minis', step: 'hydrate', time: 'both', price: 24, size: '15 ml', rating: 4.8, reviews: 29,
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
export const STEPS: { key: Step; label: string; blurb: string; num: string; icon: string }[] = [
  { key: 'cleanse', num: '01', label: 'Cleanse', blurb: 'Purify and refresh without stripping.', icon: 'droplet' },
  { key: 'prep', num: '02', label: 'Prep', blurb: 'Essence to prime and refine.', icon: 'sparkle' },
  { key: 'treat', num: '03', label: 'Treat', blurb: 'Target concerns and boost glow.', icon: 'bottle' },
  { key: 'hydrate', num: '04', label: 'Hydrate', blurb: 'Nourish and strengthen barrier.', icon: 'jar' },
  { key: 'protect', num: '05', label: 'Protect', blurb: 'Shield and defend all day long.', icon: 'sun' },
]
export const RITUALS: { key: 'day' | 'night'; label: string; title: string; blurb: string; icon: string; ids: string[] }[] = [
  { key: 'day', label: 'Day', title: 'The Day Ritual', blurb: 'Brighten, hydrate and protect. Light layers that sit under SPF and makeup.', icon: 'sun', ids: ['cleanser', 'essence', 'serum', 'cream', 'spf'] },
  { key: 'night', label: 'Night', title: 'The Night Ritual', blurb: 'Repair, firm and sculpt while you sleep. Richer textures and the two-minute massage.', icon: 'moon', ids: ['barrier-cleanser', 'essence', 'sculpt-serum', 'firming-moisturiser', 'sculpt-cream', 'sculpt-tool'] },
]
export const forTime = (p: Product, t: 'day' | 'night') => p.time === 'both' || p.time === t
export const CONCERNS: { key: Concern; label: string; blurb: string }[] = [
  { key: 'dullness', label: 'Dullness', blurb: 'Skin that looks tired and lacks radiance.' },
  { key: 'dehydration', label: 'Dehydration', blurb: 'Tightness, fine dehydration lines and a papery feel.' },
  { key: 'barrier', label: 'Damaged barrier', blurb: 'Stinging, flaking and sensitivity after actives.' },
  { key: 'sensitivity', label: 'Sensitivity', blurb: 'Redness and reactivity to new products.' },
  { key: 'uneven-tone', label: 'Uneven tone', blurb: 'Post-blemish marks and patchy pigmentation.' },
  { key: 'fine-lines', label: 'Fine lines', blurb: 'Early lines around the eyes and mouth.' },
  { key: 'sun-damage', label: 'Sun damage', blurb: 'Freckling, spots and loss of firmness from UV.' },
  { key: 'firmness', label: 'Loss of firmness', blurb: 'Softening along the jawline, cheeks and neck.' },
]
export const POINTS_PER_DOLLAR = 10
export const FREE_SHIPPING_THRESHOLD = 80
export const SHIPPING_FEE = 6
export const money = (n: number) => `S$${n % 1 === 0 ? n : n.toFixed(2)}`
export const pts = (n: number) => n.toLocaleString('en-SG')
