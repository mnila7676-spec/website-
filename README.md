# Lumiva · Digital Commerce & Glow Club Ecosystem

Concept build of the BrillianceTech proposal (26 August 2026): a responsive ecommerce website, an installable member web app (Glow Club) and an administration portal, all sharing one member account, points wallet and activity history.

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production build into dist/
npm run preview    # serve the production build
```

## Surfaces

| URL | What it is |
| --- | --- |
| `/` | Responsive storefront: home, shop, product detail, skin solutions, Routine Builder, Glow Club, rewards, leaderboard, live activity, learn, story, cart, checkout, account |
| `/app` | Installable member web app (PWA manifest + service worker). Shown in a phone frame on desktop, full screen on mobile. Includes Today, Glow Spin, Daily Glow, Journey, Achievements, Leaderboard, Notifications, Membership |
| `/admin` | Operations portal: dashboard, commerce, members, challenges, rewards and approvals, community moderation, campaigns, risk controls, analytics |

## How the ecosystem maps to the proposal

- **One connected journey** – a single store (`src/store/store.tsx`) persisted in `localStorage` backs the website, app and admin. Points, orders, routine, missions and redemptions are the same everywhere and sync across open tabs.
- **Commerce** – catalogue, search, filters, wishlist, cart, checkout, orders, account, Routine Builder with "add the complete set to the bag".
- **Glow Club** – points wallet (balance, earned, redeemed, pending/held, expiry), tiers (Silver / Gold 1.25x / Platinum 1.5x), milestone journey (2,500 · 5,000 · 10,000 · 20,000 · 50,000), reward marketplace with eligibility, stock, validity, redemption steps and terms.
- **Daily and weekly engagement** – check-in with controlled streak bonus and monthly streak protection, AM/PM routine check-ins, learn-and-earn with a knowledge check, verified-purchase reviews, referral points released only after the friend's first order, weekly challenges including the 7-Day Barrier Reset (450 pts + badge). Engagement points are capped per day.
- **Game layer (app)** – Today view with week strip and check-in, daily **Glow Spin** wheel with small prizes (10 to 80 points, streak shield, free express delivery, mini sample) at shown odds, once per day; weekly progress dots; badge-unlock celebrations; 32 collectible achievements; streak shields usable as extra streak protection.
- **Leaderboards and community** – weekly, monthly and all-time, "points to Top 10", 30 achievement badges, first name + surname initial with consent.
- **Live member activity** – copper marquee on desktop, single rotating message on mobile, rounded activity card in the app, full feed, admin moderation and type toggles.
- **Promotional prompts** – 30% scroll modal (once per session), floating reminder after dismissal, gift drawer when an eligible product enters the bag, reward reveal after registration.
- **Administration** – every point adjustment and hero reward redemption creates a traceable audit record; hero rewards (Japan flights, staycation) go through an approval queue where points are held, not deducted, until approval.

## Demo

- Sign in with any code, or use **Explore as Amelia (demo member)** to load a rich Radiance Gold account with 12,480 points, streaks, orders and badges.
- Join as a new member to see the welcome flow: 500 points, reward reveal and the 1-for-1 gift drawer.
- Reset everything from the app under Profile → Settings → Reset demo data.

Images come from the proposal and the supplied product renders in `public/images`.
