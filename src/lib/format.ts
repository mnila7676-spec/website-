export const ago = (ts: string | number) => {
  const t = typeof ts === 'number' ? ts : new Date(ts).getTime(); const m = Math.max(0, Math.round((Date.now() - t) / 60000))
  if (m < 1) return 'just now'; if (m < 60) return `${m} min ago`; const h = Math.round(m / 60); if (h < 24) return `${h} hr ago`; const d = Math.round(h / 24); if (d < 30) return `${d} day${d > 1 ? 's' : ''} ago`; return fmtDate(t)
}
export const fmtDate = (ts: string | number) => new Date(ts).toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric' })
export const fmtShort = (ts: string | number) => new Date(ts).toLocaleDateString('en-SG', { day: 'numeric', month: 'short' })
export const cx = (...a: (string | false | null | undefined)[]) => a.filter(Boolean).join(' ')
export const n = (v: number) => v.toLocaleString('en-SG')
export const greeting = () => { const h = new Date().getHours(); return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening' }
export const displayName = (m: { firstName: string; lastName: string; nickname?: string } | null) => m ? (m.nickname || `${m.firstName} ${m.lastName?.[0] ?? ''}.`) : ''
