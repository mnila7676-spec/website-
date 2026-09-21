import { useLocation } from 'react-router-dom'
export function useLinks() {
  const { pathname } = useLocation(); const app = pathname.startsWith('/app')
  const b = app ? '/app' : ''
  return {
    app, base: b, home: app ? '/app' : '/', shop: `${b}/shop`, product: (slug: string) => `${b}/product/${slug}`, cart: app ? '/app/bag' : '/cart', checkout: `${b}/checkout`,
    rewards: `${b}/rewards`, reward: (id: string) => `${b}/rewards/${id}`, join: `${b}/join`, signin: `${b}/sign-in`, learn: (id: string) => `${b}/learn/${id}`, ritual: app ? '/app/routine' : '/ritual',
    leaderboard: `${b}/leaderboard`, activity: `${b}/activity`, account: app ? '/app/profile' : '/account', glow: app ? '/app/rewards' : '/glow-club', daily: app ? '/app/daily' : '/glow-club#missions',
  }
}
