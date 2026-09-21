import React from 'react'
import { Route } from 'react-router-dom'
import { AppHome } from './pages/Home'
import { AppShop, AppProduct } from './pages/Shop'
import { AppRoutine } from './pages/Routine'
import { AppRewards, AppCatalogue } from './pages/Rewards'
import { AppRewardDetail } from './pages/RewardDetailApp'
import { AppSpin } from './pages/Spin'
import { AppSaved, AppAddresses, AppNotifications } from './pages/More'
import { AppDaily } from './pages/Daily'
import { AppJourney, AppAchievements, AppLeaderboard, AppActivity } from './pages/Progress'
import { AppProfile, AppHistory, AppReferrals, AppOrders, AppSettings, AppSkinProfile, AppJoin, AppSignIn } from './pages/Profile'
import { AppBag, AppCheckout, AppOrder, AppLesson, AppLearn } from './pages/Misc'

export const appRoutes = <>
  <Route index element={<AppHome />} />
  <Route path="shop" element={<AppShop />} />
  <Route path="product/:slug" element={<AppProduct />} />
  <Route path="routine" element={<AppRoutine />} />
  <Route path="rewards" element={<AppRewards />} />
  <Route path="rewards/catalogue" element={<AppCatalogue />} />
  <Route path="rewards/:id" element={<AppRewardDetail />} />
  <Route path="daily" element={<AppDaily />} />
  <Route path="spin" element={<AppSpin />} />
  <Route path="notifications" element={<AppNotifications />} />
  <Route path="profile/saved" element={<AppSaved />} />
  <Route path="profile/addresses" element={<AppAddresses />} />
  <Route path="journey" element={<AppJourney />} />
  <Route path="achievements" element={<AppAchievements />} />
  <Route path="leaderboard" element={<AppLeaderboard />} />
  <Route path="activity" element={<AppActivity />} />
  <Route path="profile" element={<AppProfile />} />
  <Route path="profile/history" element={<AppHistory />} />
  <Route path="profile/referrals" element={<AppReferrals />} />
  <Route path="profile/orders" element={<AppOrders />} />
  <Route path="profile/settings" element={<AppSettings />} />
  <Route path="profile/skin" element={<AppSkinProfile />} />
  <Route path="join" element={<AppJoin />} />
  <Route path="sign-in" element={<AppSignIn />} />
  <Route path="bag" element={<AppBag />} />
  <Route path="checkout" element={<AppCheckout />} />
  <Route path="order/:id" element={<AppOrder />} />
  <Route path="learn" element={<AppLearn />} />
  <Route path="learn/:id" element={<AppLesson />} />
</>
