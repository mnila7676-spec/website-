import React from 'react'
import { Route } from 'react-router-dom'
import { Dashboard, Commerce, Members, Challenges, RewardsAdmin, Community, Campaigns, Risk, Analytics } from './pages'
export const adminRoutes = <>
  <Route index element={<Dashboard />} /><Route path="commerce" element={<Commerce />} /><Route path="members" element={<Members />} /><Route path="challenges" element={<Challenges />} /><Route path="rewards" element={<RewardsAdmin />} /><Route path="community" element={<Community />} /><Route path="campaigns" element={<Campaigns />} /><Route path="risk" element={<Risk />} /><Route path="analytics" element={<Analytics />} />
</>
