/** Prefix a public asset path with the deploy base (GitHub Pages serves the site under /<repo>/). */
export const asset = (p: string) => import.meta.env.BASE_URL.replace(/\/$/, '') + p
