import React from 'react'
import { Route } from 'react-router-dom'
import { Home } from './pages/Home'
import { Shop } from './pages/Shop'
import { ProductPage } from './pages/Product'
import { SkinSolutions } from './pages/SkinSolutions'
import { Ritual } from './pages/Ritual'
import { GlowClub } from './pages/GlowClub'
import { Rewards, RewardDetail } from './pages/Rewards'
import { Leaderboard, Activity } from './pages/Community'
import { Learn, LessonPage } from './pages/Learn'
import { OurStory, Help, NotFound } from './pages/Static'
import { Cart, Checkout, OrderConfirm } from './pages/Commerce'
import { Account } from './pages/Account'
import { Join, SignIn } from './pages/Auth'

export const siteRoutes = <>
  <Route index element={<Home />} />
  <Route path="shop" element={<Shop />} />
  <Route path="product/:slug" element={<ProductPage />} />
  <Route path="skin-solutions" element={<SkinSolutions />} />
  <Route path="ritual" element={<Ritual />} />
  <Route path="glow-club" element={<GlowClub />} />
  <Route path="rewards" element={<Rewards />} />
  <Route path="rewards/:id" element={<RewardDetail />} />
  <Route path="leaderboard" element={<Leaderboard />} />
  <Route path="activity" element={<Activity />} />
  <Route path="learn" element={<Learn />} />
  <Route path="learn/:id" element={<LessonPage />} />
  <Route path="our-story" element={<OurStory />} />
  <Route path="help" element={<Help />} />
  <Route path="cart" element={<Cart />} />
  <Route path="checkout" element={<Checkout />} />
  <Route path="order/:id" element={<OrderConfirm />} />
  <Route path="account/*" element={<Account />} />
  <Route path="join" element={<Join />} />
  <Route path="sign-in" element={<SignIn />} />
  <Route path="*" element={<NotFound />} />
</>
