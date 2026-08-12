import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from 'react-router-dom';
const medicalLogo = '/medical-logo.webp';
import { FaLinkedin, FaXTwitter } from 'react-icons/fa6';
import { FaBars, FaTimes } from 'react-icons/fa';
import { getSocialLinks } from '../config/site';
import { useMobileMenu } from '../context/MobileMenuContext';

// Koristi /#anchor da radi i sa /project/:id (hash-only bi ostao na istoj ruti bez Home sekcije).
const navItems = [
  { href: '/#home', label: 'Home' },
  { href: '/#about', label: 'About' },
  { href: '/#projects', label: 'Projects' },
  { href: '/#contact', label: 'Contact' },
];

function getVisualViewportFrame() {
  const vv = window.visualViewport;
  if (vv) {
    return {
      top: vv.offsetTop,
      left: vv.offsetLeft,
      width: vv.width,
      height: vv.height,
    };
  }

  return {
    top: 0,
    left: 0,
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

const Header = () => {
  const { menuOpen, closeMenu, toggleMenu } = useMobileMenu();
  const headerRef = useRef(null);
  const [headerHeightPx, setHeaderHeightPx] = React.useState(88);
  const location = useLocation();
  const { linkedin, x } = getSocialLinks();

  useEffect(() => {
    closeMenu();
  }, [location.pathname, closeMenu]);

  useEffect(() => {
    const onHashChange = () => closeMenu();
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [closeMenu]);

  useLayoutEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const update = () => {
      setHeaderHeightPx(Math.ceil(el.getBoundingClientRect().height));
    };

    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const [viewportFrame, setViewportFrame] = React.useState(null);

  // Body scroll lock uses position:fixed on body, which stretches fixed overlays on iOS.
  // Pin one shell to visualViewport; keep backdrop + drawer absolute inside it.
  useLayoutEffect(() => {
    if (!menuOpen) {
      setViewportFrame(null);
      return undefined;
    }

    const syncViewportFrame = () => {
      setViewportFrame(getVisualViewportFrame());
    };

    syncViewportFrame();
    const vv = window.visualViewport;
    vv?.addEventListener('resize', syncViewportFrame);
    vv?.addEventListener('scroll', syncViewportFrame);
    window.addEventListener('resize', syncViewportFrame);

    return () => {
      vv?.removeEventListener('resize', syncViewportFrame);
      vv?.removeEventListener('scroll', syncViewportFrame);
      window.removeEventListener('resize', syncViewportFrame);
    };
  }, [menuOpen]);

  const activeViewportFrame = menuOpen
    ? viewportFrame ?? getVisualViewportFrame()
    : null;

  const overlayShellStyle = activeViewportFrame
    ? {
        position: 'fixed',
        top: activeViewportFrame.top,
        left: activeViewportFrame.left,
        width: activeViewportFrame.width,
        height: activeViewportFrame.height,
      }
    : undefined;

  const socialClassDesktop =
    'flex min-h-11 min-w-11 items-center justify-center rounded-xl text-white/40 transition-colors hover:bg-white/5 hover:text-cyan-400';

  const socialClassTouch =
    'flex min-h-12 min-w-12 items-center justify-center rounded-xl text-white/40 transition-colors hover:bg-white/5 hover:text-cyan-400 active:bg-white/10';

  const menuButtonClass =
    'min-h-12 min-w-12 flex items-center justify-center rounded-xl text-white/80 hover:bg-white/10 hover:text-cyan-400 active:bg-white/15 transition-colors';

  return (
    <>
    <header
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-110 bg-[#03040b]/80 backdrop-blur-xl border-b border-white/5 px-4 sm:px-6 md:px-16 flex justify-between items-center shadow-2xl pt-[calc(env(safe-area-inset-top,0px)+1rem)] pb-4 md:pt-[calc(env(safe-area-inset-top,0px)+1.25rem)] md:pb-5 lg:pt-[calc(env(safe-area-inset-top,0px)+1.5rem)]"
    >
      <a href="/#home" className="relative z-110 flex min-h-12 md:min-h-11 items-center gap-3 hover:opacity-80 transition-all font-sans shrink-0 touch-manipulation" onClick={closeMenu}>
        <div className="w-10 h-10 rounded-full border border-cyan-500/30 overflow-hidden shadow-[0_0_15px_rgba(6,182,212,0.2)]">
          <img src={medicalLogo} alt="Portfolio logo" className="w-full h-full object-cover" width={40} height={40} decoding="async" fetchPriority="low" />
        </div>
        <span className="text-lg sm:text-xl font-black text-white tracking-tighter uppercase">
          Zed <span className="text-cyan-400 font-light text-sm">AI-Portfolio</span>
        </span>
      </a>

      <div className="relative z-110 flex items-center gap-2 sm:gap-4 touch-manipulation">
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
              className={socialClassDesktop}
              aria-label="LinkedIn profile"
            >
              <FaLinkedin className="text-xl" aria-hidden />
            </a>
            <a
              href={x}
              target="_blank"
              rel="noopener noreferrer"
              className={socialClassDesktop}
              aria-label="X (Twitter) profile"
            >
              <FaXTwitter className="text-xl" aria-hidden />
            </a>
          </div>
        </nav>

        <div className="flex md:hidden items-center gap-2">
          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className={socialClassTouch}
            aria-label="LinkedIn profile"
          >
            <FaLinkedin className="text-xl" aria-hidden />
          </a>
          <a
            href={x}
            target="_blank"
            rel="noopener noreferrer"
            className={socialClassTouch}
            aria-label="X (Twitter) profile"
          >
            <FaXTwitter className="text-xl" aria-hidden />
          </a>
          <button
            type="button"
            className={menuButtonClass}
            onClick={toggleMenu}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav-panel"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
          </button>
        </div>
      </div>
    </header>

      {menuOpen
        ? createPortal(
            <div
              className="z-90 overscroll-none md:hidden"
              style={overlayShellStyle}
              role="presentation"
              aria-hidden={!menuOpen}
            >
              <button
                type="button"
                className="absolute inset-0 bg-black/40 touch-manipulation"
                onClick={closeMenu}
                aria-label="Close menu overlay"
              />
              <div
                id="mobile-nav-panel"
                style={{ paddingTop: `${headerHeightPx}px` }}
                className="absolute top-0 right-0 bottom-0 z-10 w-72 max-w-[80vw] overflow-y-auto overscroll-contain bg-[#0f172a]/95 border-l border-white/10 flex flex-col pl-3 pr-[max(1rem,env(safe-area-inset-right))] pb-[max(1rem,env(safe-area-inset-bottom))] touch-manipulation"
                role="dialog"
                aria-modal="true"
                aria-label="Site navigation"
              >
                <nav className="flex flex-col items-end gap-0 text-right" aria-label="Mobile main">
                  {navItems.map(({ href, label }) => (
                    <a
                      key={href}
                      href={href}
                      className="w-full py-3.5 pl-2 text-lg font-black uppercase tracking-widest text-white border-b border-white/15 hover:text-cyan-300 transition-colors [text-shadow:0_1px_3px_rgba(0,0,0,0.85)]"
                      onClick={closeMenu}
                    >
                      {label}
                    </a>
                  ))}
                </nav>
                <p className="mt-auto pt-8 text-right text-[10px] text-white/30 uppercase tracking-widest">
                  Z. Mijailović · Portfolio
                </p>
              </div>
            </div>,
            document.documentElement
          )
        : null}
    </>
  );
};

export default Header;
