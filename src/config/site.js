/**
 * Centralni podaci sajta (SEO + društvene mreže).
 *
 * Lični profili (Prof. Z. Mijailović). Override preko VITE_LINKEDIN_URL / VITE_X_URL
 * u .env i Vercel → Environment Variables ako treba drugačiji URL.
 */
export const SITE_URL = 'https://www.mdzdravko.com'

/** Profesionalni kontakt mejl (Zoho) — prijem forme, mailto, SEO */
export const CONTACT_EMAIL = 'hello@mdzdravko.com'

/** Lični LinkedIn (MD, PhD, RDCS, FACC) */
const DEFAULT_LINKEDIN =
  'https://www.linkedin.com/in/zdravko-mijailovic-md-phd-rdcs-facc-41432975'

/** Lični X — brend mdzdravko.com */
const DEFAULT_X = 'https://x.com/mdzdravko'

export const metaDescription =
  'Portfolio of Z. Mijailović, MD, PhD, FACC, ARDMS — cardiologist and AI in health-tech: projects, research collaboration, and evidence-based medicine.'

export function getSocialLinks() {
  const linkedin = (import.meta.env.VITE_LINKEDIN_URL || DEFAULT_LINKEDIN).trim()
  const x = (import.meta.env.VITE_X_URL || DEFAULT_X).trim()
  return {
    linkedin: linkedin || DEFAULT_LINKEDIN,
    x: x || DEFAULT_X,
  }
}
