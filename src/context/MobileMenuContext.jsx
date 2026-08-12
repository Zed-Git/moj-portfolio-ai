import { createContext, useCallback, useContext, useEffect, useState } from 'react';

const MobileMenuContext = createContext(null);

export function MobileMenuProvider({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    document.body.style.overflow = '';
  }, []);

  const toggleMenu = useCallback(() => {
    setMenuOpen((open) => !open);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
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
