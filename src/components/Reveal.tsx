import { useEffect } from 'react'

// Scroll reveal for the website: anything matching SEL fades in once it enters the viewport.
// Siblings (product cards, routine tiles, pillars) stagger left to right via --i.
const SEL = [
  '.t-hero-copy', '.t-statement h2', '.t-statement .eyebrow', '.t-title', '.t-center',
  '.pcard', '.rcard', '.t-routine', '.t-feature img', '.t-feature .copy', '.t-banner .copy',
  '.t-club > *', '.t-reviews', '.t-testi-col', '.t-philo > div', '.t-pillars > div',
  '.section-head', '.story-hero > *', '.values > div', '.dark-band', '.card', '.panel', '.tier-card', '.milestone-strip .ms',
].join(',')

export function useScrollReveal() {
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) }
    }), { threshold: 0.08, rootMargin: '0px 0px -6% 0px' })
    const seen = new WeakSet<Element>()
    const scan = () => {
      const root = document.querySelector('.site-main'); if (!root) return
      root.querySelectorAll<HTMLElement>(SEL).forEach(el => {
        if (seen.has(el) || el.classList.contains('in')) return
        seen.add(el)
        el.dataset.reveal = '1'
        const sibs = el.parentElement ? Array.from(el.parentElement.children).filter(c => c.matches(SEL)) : []
        el.style.setProperty('--i', String(Math.max(0, sibs.indexOf(el))))
        io.observe(el)
      })
    }
    const mo = new MutationObserver(() => scan())
    // Wait for the intro to open before revealing anything, so the hero animates in view.
    const start = () => { scan(); mo.observe(document.body, { childList: true, subtree: true }) }
    if (document.documentElement.classList.contains('preloading')) window.addEventListener('kessora:ready', start, { once: true })
    else start()
    return () => { window.removeEventListener('kessora:ready', start); io.disconnect(); mo.disconnect(); document.querySelectorAll<HTMLElement>('.site-main [data-reveal]:not(.in)').forEach(el => { delete el.dataset.reveal }) }
  }, [])
}
