/**
 * Centralni podaci sajta (SEO + društvene mreže).
 *
 * LinkedIn: podrazumevano MedExNews profil (javno povezan sa radom Prof. Mijailovića kao urednika portala).
 * Zameni sa VITE_LINKEDIN_URL ako želiš lični /in/... profil (lokalno .env i Vercel → Environment Variables).
 *
 * X (Twitter): podrazumevano MedExNews (@medexnews); zameni sa VITE_X_URL za lični nalog.
 */
export const SITE_URL = 'https://www.mdzdravko.com'

/** Profesionalni kontakt mejl (Zoho) — prijem forme, mailto, SEO */
export const CONTACT_EMAIL = 'hello@mdzdravko.com'

/** Podrazumevani LinkedIn (MedExNews — evidence-based cardiology); override preko VITE_LINKEDIN_URL */
const DEFAULT_LINKEDIN =
  'https://www.linkedin.com/in/medexnews-evidence-based-personalized-cardiology-7063b079'

/** Podrazumevani X (isti brend kao portal); override preko VITE_X_URL */
const DEFAULT_X = 'https://x.com/medexnews'

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
