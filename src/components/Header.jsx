import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import medicalLogo from '../assets/medical-logo.jpg';
import { FaLinkedin, FaXTwitter } from 'react-icons/fa6';
import { FaBars, FaTimes } from 'react-icons/fa';
import { getSocialLinks } from '../config/site';

// Koristi /#anchor da radi i sa /project/:id (hash-only bi ostao na istoj ruti bez Home sekcije).
const navItems = [
  { href: '/#home', label: 'Home' },
  { href: '/#about', label: 'About' },
  { href: '/#projects', label: 'Projects' },
  { href: '/#contact', label: 'Contact' },
];

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { linkedin, x } = getSocialLinks();

  useEffect(() => {
    // Zatvori mobilni meni pri promeni rute (npr. /project/:id).
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sinhronizacija UI sa lokacijom nakon navigacije
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const socialClass =
    'flex min-h-11 min-w-11 items-center justify-center rounded-xl text-white/40 transition-colors hover:bg-white/5 hover:text-cyan-400';

  return (
    <header className="fixed top-0 left-0 w-full z-100 bg-[#03040b]/80 backdrop-blur-xl border-b border-white/5 py-4 px-4 sm:px-6 md:px-16 flex justify-between items-center shadow-2xl">
      <a href="/#home" className="flex min-h-11 items-center gap-3 hover:opacity-80 transition-all font-sans shrink-0">
        <div className="w-10 h-10 rounded-full border border-cyan-500/30 overflow-hidden shadow-[0_0_15px_rgba(6,182,212,0.2)]">
          <img src={medicalLogo} alt="Portfolio logo" className="w-full h-full object-cover" width={40} height={40} />
        </div>
        <span className="text-lg sm:text-xl font-black text-white tracking-tighter uppercase">
          Zed <span className="text-cyan-400 font-light text-sm">AI-Portfolio</span>
        </span>
      </a>

      <div className="flex items-center gap-2 sm:gap-4">
        <nav className="hidden md:flex items-center gap-8" aria-label="Main">
          <ul className="flex items-center gap-6 text-[11px] font-black uppercase tracking-widest">
            {navItems.map(({ href, label }) => (
              <li key={href}>
                <a href={href} className="text-white/60 hover:text-cyan-400 transition-all">
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <div className="w-px h-4 bg-white/10 mx-2" aria-hidden />
          <div className="flex items-center gap-2 text-lg">
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={socialClass}
              aria-label="LinkedIn profile"
            >
              <FaLinkedin className="text-xl" aria-hidden />
            </a>
            <a
              href={x}
              target="_blank"
              rel="noopener noreferrer"
              className={socialClass}
              aria-label="X (Twitter) profile"
            >
              <FaXTwitter className="text-xl" aria-hidden />
            </a>
          </div>
        </nav>

        {/* Mobilni: ikone društvenih mreža u traci + hamburger (nevidljiv na md+) */}
        <div className="flex md:hidden items-center gap-1">
          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className={socialClass}
            aria-label="LinkedIn profile"
          >
            <FaLinkedin className="text-xl" aria-hidden />
          </a>
          <a
            href={x}
            target="_blank"
            rel="noopener noreferrer"
            className={socialClass}
            aria-label="X (Twitter) profile"
          >
            <FaXTwitter className="text-xl" aria-hidden />
          </a>
          <button
            type="button"
            className="min-h-11 min-w-11 flex items-center justify-center rounded-xl text-white/80 hover:bg-white/10 hover:text-cyan-400 transition-colors"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav-panel"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
          </button>
        </div>
      </div>

      {/* Mobilni meni: drawer sa desne strane — levo zatamnjenje, linkovi uz desnu ivicu (ne preko centra slike). */}
      {menuOpen ? (
        <div
          // NAMERNO (odstupanje od “full-screen” overlay standarda):
          // Header (logo + status bar prostor) ostaje iznad menija, pa overlay počinje ispod headera.
          // Ovo sprečava da se logo/status linija “potpuno zasene” kada se meni otvori.
          className="fixed inset-0 z-[90] md:hidden"
          role="presentation"
        >
          {/* Klik van panela zatvara meni */}
          <button
            type="button"
            className="absolute left-0 right-0 bottom-0 top-[max(4.5rem,env(safe-area-inset-top))] bg-black/65 backdrop-blur-[2px]"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu overlay"
          />
          <div
            id="mobile-nav-panel"
            className="absolute right-0 top-[max(4.5rem,env(safe-area-inset-top))] flex h-[calc(100%-max(4.5rem,env(safe-area-inset-top)))] w-[min(88vw,19rem)] flex-col border-l border-cyan-500/20 bg-[#03040b]/98 shadow-[-12px_0_40px_rgba(0,0,0,0.45)] backdrop-blur-xl pt-10 pl-3 pr-[max(1rem,env(safe-area-inset-right))] pb-[max(1rem,env(safe-area-inset-bottom))]"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
          >
            <nav className="flex flex-col items-end gap-0 text-right" aria-label="Mobile main">
              {navItems.map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  className="w-full py-3.5 pl-2 text-lg font-black uppercase tracking-widest text-white/90 border-b border-white/10 hover:text-cyan-400 transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </a>
              ))}
            </nav>
            <p className="mt-auto pt-8 text-right text-[10px] text-white/30 uppercase tracking-widest">
              Z. Mijailović · Portfolio
            </p>
          </div>
        </div>
      ) : null}
    </header>
  );
};

export default Header;
