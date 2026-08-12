import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

const MobileMenuContext = createContext(null);

function lockBodyScroll() {
  const scrollY = window.scrollY;
  const { body, documentElement } = document;

  body.dataset.scrollLockY = String(scrollY);
  body.style.overflow = 'hidden';
  body.style.position = 'fixed';
  body.style.top = `-${scrollY}px`;
  body.style.left = '0';
  body.style.right = '0';
  body.style.width = '100%';
  documentElement.style.overflow = 'hidden';
}

function unlockBodyScroll() {
  const { body, documentElement } = document;
  const scrollY = Number(body.dataset.scrollLockY || '0');

  body.style.overflow = '';
  body.style.position = '';
  body.style.top = '';
  body.style.left = '';
  body.style.right = '';
  body.style.width = '';
  delete body.dataset.scrollLockY;
  documentElement.style.overflow = '';

  window.scrollTo(0, scrollY);
}

export function MobileMenuProvider({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const scrollLockedRef = useRef(false);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
  }, []);

  const toggleMenu = useCallback(() => {
    setMenuOpen((open) => !open);
  }, []);

  useEffect(() => {
    if (!menuOpen) {
      if (scrollLockedRef.current) {
        unlockBodyScroll();
        scrollLockedRef.current = false;
      }
      return undefined;
    }

    lockBodyScroll();
    scrollLockedRef.current = true;

    const preventBackgroundScroll = (event) => {
      const panel = document.getElementById('mobile-nav-panel');
      if (panel?.contains(event.target)) return;
      event.preventDefault();
    };

    document.addEventListener('touchmove', preventBackgroundScroll, { passive: false });

    return () => {
      document.removeEventListener('touchmove', preventBackgroundScroll);
      if (scrollLockedRef.current) {
        unlockBodyScroll();
        scrollLockedRef.current = false;
      }
    };
  }, [menuOpen]);

  // iOS keyboard shrinks visual viewport — close drawer so fixed overlay cannot linger.
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return undefined;

    const onViewportChange = () => {
      if (!menuOpen) return;
      const keyboardLikelyOpen = vv.height < window.innerHeight * 0.82;
      if (keyboardLikelyOpen) {
        closeMenu();
      }
    };

    vv.addEventListener('resize', onViewportChange);
    vv.addEventListener('scroll', onViewportChange);
    return () => {
      vv.removeEventListener('resize', onViewportChange);
      vv.removeEventListener('scroll', onViewportChange);
    };
  }, [menuOpen, closeMenu]);

  return (
    <MobileMenuContext.Provider value={{ menuOpen, setMenuOpen, closeMenu, toggleMenu }}>
      {children}
    </MobileMenuContext.Provider>
  );
}

export function useMobileMenu() {
  const ctx = useContext(MobileMenuContext);
  if (!ctx) {
    throw new Error('useMobileMenu must be used within MobileMenuProvider');
  }
  return ctx;
}
