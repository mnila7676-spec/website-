import { asset } from '@/lib/asset'
export type Step = 'cleanse' | 'prep' | 'treat' | 'hydrate' | 'sculpt'
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
    id: 'cleanser', slug: 'gentle-barrier-cleanser', name: 'Gentle Barrier Cleanser', tagline: 'Clean · Comfort · Prepare',
    category: 'cleansers', step: 'cleanse', time: 'both', price: 48, size: '100 g', rating: 4.8, reviews: 112,
    image: asset('/images/products/cleanser.jpg'), imageDark: asset('/images/products/cleanser-dark.jpg'),
    description: 'A cushioning cream cleanser that lifts away the day without stripping. Ceramides and oat lipids keep the barrier intact, so skin feels clean, soft and ready for the next step of your cycle.',
    benefits: ['Cleans without tightness', 'Ceramide-supported barrier', 'Removes sunscreen and light makeup', 'Day and night'],
    ingredients: [{ name: 'Ceramide NP', role: 'Keeps the barrier intact while cleansing' }, { name: 'Oat Lipids', role: 'Cushion and comfort' }, { name: 'Glycerin', role: 'Holds water in the skin' }],
    howToUse: ['Massage onto damp skin for 30 seconds.', 'Rinse with lukewarm water.', 'Morning and evening as step one.'],
    concerns: ['barrier', 'sensitivity', 'dehydration'], skinTypes: ['All skin types'], routine: 'AM / PM',
    giftEligible: true, stock: 140, badge: 'Best seller',
    faqs: [{ q: 'Is it suitable for sensitive skin?', a: 'Yes. It is fragrance-free, pH-balanced and built around barrier lipids.' }],
    usageDays: 55,
  },
  {
    id: 'essence', slug: 'niacinamide-activating-essence', name: 'Niacinamide Activating Essence', tagline: 'Prep · Activate · Hydrate',
    category: 'essences', step: 'prep', time: 'both', price: 68, size: '120 ml', rating: 4.7, reviews: 86,
    image: asset('/images/products/essence.jpg'), imageDark: asset('/images/products/essence-dark.jpg'),
    description: 'A watery essence that wakes skin up after cleansing. Five percent niacinamide refines pores and tone while a hydrating base primes skin so every following step absorbs better.',
    benefits: ['Primes skin for serums', 'Refines pores and tone', 'Weightless hydration', 'Alcohol-free'],
    ingredients: [{ name: 'Niacinamide 5%', role: 'Refines pores and evens tone' }, { name: 'Beta-Glucan', role: 'Soothes and hydrates' }, { name: 'Sodium PCA', role: 'Skin’s own moisture magnet' }],
    howToUse: ['After cleansing, press a few drops into damp skin.', 'Follow with serum.', 'Morning and evening.'],
    concerns: ['uneven-tone', 'dehydration', 'dullness'], skinTypes: ['All skin types'], routine: 'AM / PM',
    giftEligible: true, stock: 95,
    faqs: [], usageDays: 60,
  },
  {
    id: 'serum', slug: 'vitamin-c-day-serum', name: 'Vitamin C Day Serum', tagline: 'Brighten · Defend · Glow',
    category: 'serums', step: 'treat', time: 'day', price: 88, size: '30 ml', rating: 4.8, reviews: 134,
    image: asset('/images/products/serum.jpg'), imageDark: asset('/images/products/serum-dark.jpg'),
    description: 'A golden daytime serum with stabilised vitamin C and antioxidants. It brightens, defends against daily environmental stress and leaves a soft, lit-from-within glow under sunscreen and makeup.',
    benefits: ['Brightens dull skin', 'Antioxidant defence', 'Even, radiant tone', 'Sits under SPF and makeup'],
    ingredients: [{ name: 'Vitamin C (3-O-Ethyl Ascorbic Acid)', role: 'Brightens and defends' }, { name: 'Ferulic Acid', role: 'Stabilises and boosts vitamin C' }, { name: 'Hyaluronic Acid', role: 'Lightweight hydration' }],
    howToUse: ['Apply 3 to 4 drops to clean skin every morning.', 'Press into face and neck.', 'Follow with emulsion and sunscreen.'],
    concerns: ['dullness', 'uneven-tone', 'sun-damage'], skinTypes: ['All skin types'], routine: 'AM',
    giftEligible: true, stock: 120, badge: 'Day',
    faqs: [{ q: 'Can I use it at night?', a: 'You can, but it is designed for the morning. At night, switch to Sculpt & Renew Serum.' }],
    usageDays: 45,
  },
  {
    id: 'sculpt-serum', slug: 'dual-action-sculpting-serum', name: 'Dual-Action Sculpting Serum', tagline: 'Sculpt · Firm · Renew',
    category: 'serums', step: 'sculpt', time: 'both', price: 128, size: '30 ml', rating: 4.9, reviews: 71,
    image: asset('/images/products/sculpt-serum.jpg'), imageDark: asset('/images/products/sculpt-serum-dark.jpg'),
    description: 'Our signature. A peptide-and-collagen concentrate meets a firming botanical complex for visibly lifted contours along the cheek, jawline and neck. The sculpting step of the Kessora skin cycle.',
    benefits: ['Peptides for firmness', 'Visible lift in 4 weeks', 'Contours cheek, jaw and neck', 'Day and night'],
    ingredients: [{ name: 'Matrixyl Peptide Complex', role: 'Supports collagen and firmness' }, { name: 'Bakuchiol', role: 'Retinol-like renewal, gentle on the barrier' }, { name: 'Centella Asiatica', role: 'Calms and strengthens' }],
    howToUse: ['Press one pump into palms.', 'Smooth upward over cheeks, jawline and neck.', 'Morning and evening after your treatment serum.'],
    concerns: ['firmness', 'fine-lines'], skinTypes: ['All skin types'], routine: 'AM / PM',
    giftEligible: false, stock: 60, badge: 'Signature',
    faqs: [], usageDays: 45,
  },
  {
    id: 'renew-serum', slug: 'sculpt-and-renew-serum', name: 'Sculpt & Renew Serum', tagline: 'Night renewal with 24k gold',
    category: 'serums', step: 'treat', time: 'night', price: 118, size: '30 ml', rating: 4.8, reviews: 58,
    image: asset('/images/products/renew-serum.jpg'), imageDark: asset('/images/products/renew-serum-dark.jpg'),
    description: 'The night treatment. Suspended gold flakes carry a renewing complex of bakuchiol, niacinamide and peptides so skin repairs overnight and wakes smoother and firmer.',
    benefits: ['Overnight renewal', 'Gold-suspended actives', 'Smoother texture by morning', 'Barrier-safe retinol alternative'],
    ingredients: [{ name: 'Bakuchiol', role: 'Gentle renewal' }, { name: 'Colloidal Gold', role: 'Soothing and conditioning' }, { name: 'Peptide Complex', role: 'Firms and smooths' }],
    howToUse: ['Shake gently to disperse the gold.', 'Press 3 to 4 drops into clean skin every evening.', 'Follow with Firming Barrier Moisturizer.'],
    concerns: ['fine-lines', 'dullness', 'firmness'], skinTypes: ['All skin types'], routine: 'PM',
    giftEligible: false, stock: 70, badge: 'Night',
    faqs: [], usageDays: 45,
  },
  {
    id: 'emulsion', slug: 'dual-chamber-fresh-shake-emulsion', name: 'Dual-Chamber Fresh Shake Emulsion', tagline: 'Shake to activate',
    category: 'moisturisers', step: 'hydrate', time: 'day', price: 92, size: '120 ml', rating: 4.7, reviews: 49,
    image: asset('/images/products/emulsion.jpg'), imageDark: asset('/images/products/emulsion-dark.jpg'),
    description: 'Two phases, one shake. A water phase of hydrators and a blue oil phase of soothing azulene combine fresh at every use, for a light daytime moisturiser that never feels heavy in humidity.',
    benefits: ['Fresh-mixed at every use', 'Weightless daytime hydration', 'Soothing azulene', 'No pilling under SPF'],
    ingredients: [{ name: 'Azulene', role: 'Calms redness' }, { name: 'Squalane', role: 'Lightweight nourishment' }, { name: 'Hyaluronic Acid', role: 'Hydrates' }],
    howToUse: ['Shake until the two phases blend.', 'Smooth over face and neck after serum.', 'Mornings, before sunscreen.'],
    concerns: ['dehydration', 'sensitivity'], skinTypes: ['Combination', 'Oily', 'Normal'], routine: 'AM',
    giftEligible: false, stock: 80, badge: 'Day',
    faqs: [], usageDays: 60,
  },
  {
    id: 'cream', slug: 'firming-barrier-moisturizer', name: 'Firming Barrier Moisturizer', tagline: 'Firm · Comfort · Seal',
    category: 'moisturisers', step: 'hydrate', time: 'night', price: 108, size: '50 g', rating: 4.9, reviews: 97,
    image: asset('/images/products/cream.jpg'), imageDark: asset('/images/products/cream-dark.jpg'),
    description: 'A rich night moisturiser that pairs barrier ceramides with firming peptides. It seals in everything you applied before it, so skin repairs overnight and wakes bouncier and more defined.',
    benefits: ['Overnight barrier repair', 'Firming peptides', 'Seals in your routine', 'Fragrance-free'],
    ingredients: [{ name: 'Ceramide Complex', role: 'Rebuilds the moisture barrier overnight' }, { name: 'Acetyl Hexapeptide-8', role: 'Firms and smooths' }, { name: 'Shea Butter', role: 'Comfort and seal' }],
    howToUse: ['Warm a small amount between fingertips.', 'Press over face and neck as the final evening step.'],
    concerns: ['firmness', 'barrier', 'dehydration'], skinTypes: ['Dry', 'Normal', 'Mature'], routine: 'PM',
    giftEligible: false, stock: 75, badge: 'Night',
    faqs: [], usageDays: 60,
  },
  {
    id: 'day-set', slug: 'the-day-cycle-set', name: 'The Day Cycle Set', tagline: 'Cleanse, prep, brighten, hydrate',
    category: 'sets', step: 'all', time: 'day', price: 252, compareAt: 296, size: '4 full sizes', rating: 4.9, reviews: 24,
    image: asset('/images/products/day-set.jpg'), imageDark: asset('/images/products/day-set.jpg'),
    description: 'The complete morning cycle: Gentle Barrier Cleanser, Niacinamide Activating Essence, Vitamin C Day Serum and Dual-Chamber Fresh Shake Emulsion. Save 15%.',
    benefits: ['Four full-size day products', 'Save S$44', 'Bright, protected, hydrated skin', 'Earn 2,520 Glow Points'],
    ingredients: [], howToUse: ['Cleanse, prep, treat, hydrate. Every morning, then sunscreen.'],
    concerns: ['dullness', 'dehydration', 'uneven-tone'], skinTypes: ['All skin types'], routine: 'AM',
    giftEligible: false, stock: 30, includes: ['cleanser', 'essence', 'serum', 'emulsion'], badge: 'Save 15%',
    faqs: [], usageDays: 50,
  },
  {
    id: 'night-set', slug: 'the-night-cycle-set', name: 'The Night Cycle Set', tagline: 'Cleanse, prep, renew, firm',
    category: 'sets', step: 'all', time: 'night', price: 290, compareAt: 342, size: '4 full sizes', rating: 4.9, reviews: 19,
    image: asset('/images/products/night-set.jpg'), imageDark: asset('/images/products/night-set.jpg'),
    description: 'The complete evening cycle: Gentle Barrier Cleanser, Niacinamide Activating Essence, Sculpt & Renew Serum and Firming Barrier Moisturizer. Save 15%.',
    benefits: ['Four full-size night products', 'Save S$52', 'Firmer, smoother skin by morning', 'Earn 2,900 Glow Points'],
    ingredients: [], howToUse: ['Cleanse, prep, renew, firm. Every evening.'],
    concerns: ['firmness', 'barrier', 'fine-lines'], skinTypes: ['All skin types'], routine: 'PM',
    giftEligible: false, stock: 30, includes: ['cleanser', 'essence', 'renew-serum', 'cream'], badge: 'Save 15%',
    faqs: [], usageDays: 50,
  },
  {
    id: 'ritual-set', slug: 'the-complete-skin-cycle', name: 'The Complete Skin Cycle', tagline: 'All six steps, day and night',
    category: 'sets', step: 'all', time: 'both', price: 468, compareAt: 550, size: '6 full sizes', rating: 5, reviews: 15,
    image: asset('/images/products/ritual-set.jpg'), imageDark: asset('/images/products/ritual-set.jpg'),
    description: 'Everything in the Kessora skin cycle: cleanser, essence, both serums, the sculpting serum, emulsion and moisturizer. Save 15% on the full system.',
    benefits: ['Six full-size products', 'Save S$82', 'The whole day and night cycle', 'Earn 4,680 Glow Points'],
    ingredients: [], howToUse: ['Day: cleanse, prep, brighten, sculpt, hydrate. Night: cleanse, prep, renew, sculpt, firm.'],
    concerns: ['dullness', 'dehydration', 'barrier', 'firmness'], skinTypes: ['All skin types'], routine: 'AM / PM',
    giftEligible: false, stock: 20, includes: ['cleanser', 'essence', 'serum', 'sculpt-serum', 'emulsion', 'cream'], badge: 'Save 15%',
    faqs: [], usageDays: 50,
  },
  {
    id: 'mini-cleanser', slug: 'mini-gentle-barrier-cleanser', name: 'Mini Cleanser', tagline: 'Gentle Barrier Cleanser, 30 g',
    category: 'minis', step: 'cleanse', time: 'both', price: 16, size: '30 g', rating: 4.7, reviews: 40,
    image: asset('/images/products/cleanser.jpg'), imageDark: asset('/images/products/cleanser-dark.jpg'),
    description: 'Travel-size Gentle Barrier Cleanser.', benefits: ['Travel-friendly', 'Same gentle formula'], ingredients: [], howToUse: ['Massage onto damp skin, rinse.'],
    concerns: ['sensitivity'], skinTypes: ['All skin types'], routine: 'AM / PM', giftEligible: true, stock: 200, faqs: [], usageDays: 12,
  },
  {
    id: 'mini-serum', slug: 'travel-vitamin-c-day-serum', name: 'Travel Day Serum', tagline: 'Vitamin C Day Serum, 10 ml',
    category: 'minis', step: 'treat', time: 'day', price: 32, size: '10 ml', rating: 4.8, reviews: 36,
    image: asset('/images/products/serum.jpg'), imageDark: asset('/images/products/serum-dark.jpg'),
    description: 'Ten millilitres of Vitamin C Day Serum for travel or a first try.', benefits: ['Two weeks of glow', 'Cabin-bag ready'], ingredients: [], howToUse: ['Apply 3 to 4 drops to clean skin.'],
    concerns: ['dullness'], skinTypes: ['All skin types'], routine: 'AM', giftEligible: true, stock: 180, faqs: [], usageDays: 14,
  },
  {
    id: 'mini-cream', slug: 'mini-firming-barrier-moisturizer', name: 'Mini Firming Moisturizer', tagline: 'Firming Barrier Moisturizer, 15 g',
    category: 'minis', step: 'hydrate', time: 'night', price: 34, size: '15 g', rating: 4.8, reviews: 29,
    image: asset('/images/products/cream.jpg'), imageDark: asset('/images/products/cream-dark.jpg'),
    description: 'A fifteen-gram Firming Barrier Moisturizer for travel and flights.', benefits: ['Flight-friendly', 'Instant comfort'], ingredients: [], howToUse: ['Press a pea-sized amount over face and neck.'],
    concerns: ['barrier'], skinTypes: ['All skin types'], routine: 'PM', giftEligible: true, stock: 160, faqs: [], usageDays: 18,
  },
]

export const productById = (id: string) => PRODUCTS.find(p => p.id === id)
export const productBySlug = (slug: string) => PRODUCTS.find(p => p.slug === slug)
export const BEST_SELLERS = ['sculpt-serum', 'serum', 'cream', 'cleanser']
export const STEPS: { key: Step; label: string; blurb: string; num: string; icon: string }[] = [
  { key: 'cleanse', num: '01', label: 'Cleanse', blurb: 'Clean, comfort, prepare.', icon: 'droplet' },
  { key: 'prep', num: '02', label: 'Prep', blurb: 'Essence to activate and hydrate.', icon: 'sparkle' },
  { key: 'treat', num: '03', label: 'Treat', blurb: 'Brighten by day, renew by night.', icon: 'bottle' },
  { key: 'sculpt', num: '04', label: 'Sculpt', blurb: 'Firm and lift the contours.', icon: 'layers' },
  { key: 'hydrate', num: '05', label: 'Hydrate', blurb: 'Seal the cycle in.', icon: 'jar' },
]
export const RITUALS: { key: 'day' | 'night'; label: string; title: string; blurb: string; icon: string; ids: string[] }[] = [
  { key: 'day', label: 'Day', title: 'The Day Cycle', blurb: 'Brighten, sculpt and hydrate. Light layers that sit under sunscreen and makeup.', icon: 'sun', ids: ['cleanser', 'essence', 'serum', 'sculpt-serum', 'emulsion'] },
  { key: 'night', label: 'Night', title: 'The Night Cycle', blurb: 'Renew, sculpt and firm while you sleep. Gold-suspended actives and a barrier seal.', icon: 'moon', ids: ['cleanser', 'essence', 'renew-serum', 'sculpt-serum', 'cream'] },
]
/* Lifestyle photography per product: light finish, dark finish */
export const LIFESTYLE: Record<string, string[]> = {
  cleanser: [asset('/images/editorial/cleanser-stone.jpg'), asset('/images/lifestyle/satin-16.jpg'), asset('/images/lifestyle/satin-11.jpg')],
  essence: [asset('/images/lifestyle/satin-17.jpg'), asset('/images/lifestyle/satin-10.jpg')],
  serum: [asset('/images/editorial/serum-stone.jpg'), asset('/images/editorial/drop-hand.jpg'), asset('/images/lifestyle/satin-19.jpg'), asset('/images/lifestyle/satin-09.jpg')],
  'sculpt-serum': [asset('/images/lifestyle/satin-15.jpg'), asset('/images/lifestyle/satin-07.jpg')],
  'renew-serum': [asset('/images/lifestyle/satin-14.jpg'), asset('/images/lifestyle/satin-08.jpg')],
  emulsion: [asset('/images/lifestyle/satin-13.jpg'), asset('/images/lifestyle/satin-12.jpg')],
  cream: [asset('/images/editorial/cream-hands.jpg'), asset('/images/editorial/portrait-cream.jpg'), asset('/images/lifestyle/satin-18.jpg'), asset('/images/lifestyle/satin-06.jpg')],
}
export const galleryFor = (p: Product) => { const base = p.id.replace('mini-', ''); const l = LIFESTYLE[base]; return l ? [p.image, p.imageDark, ...l] : [p.image, p.imageDark] }
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
