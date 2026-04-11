/**
 * analytics.js — pomoćne funkcije za Google Analytics 4.
 *
 * Zašto zasebni fajl? Da ne mešamo GA logiku sa UI kodom;
 * lako ga je isključiti ili zameniti sa nekim drugim alatom.
 *
 * window.gtag() postoji samo ako je VITE_GA_ID postavljen na Vercelu i build-ovan.
 * Sve funkcije proveravaju da li gtag postoji pre poziva — nema grešaka u dev modu.
 */

/**
 * Pošalje page_view event Google Analytics-u.
 * Pozivamo ga iz App.jsx na svakoj promeni React Router rute.
 *
 * @param {string} path  - npr. "/" ili "/project/3"
 * @param {string} title - naslov stranice (document.title)
 */
export function trackPageView(path, title) {
  if (typeof window.gtag !== 'function') return;
  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: title,
    page_location: window.location.href,
  });
}

/**
 * Pošalje custom event (npr. "klik na LinkedIn", "kontakt forma poslata").
 * Opciono — za buduće praćenje specifičnih interakcija.
 *
 * @param {string} eventName - ime eventa (preporučeno: snake_case)
 * @param {object} params    - slobodni parametri
 */
export function trackEvent(eventName, params = {}) {
  if (typeof window.gtag !== 'function') return;
  window.gtag('event', eventName, params);
}
