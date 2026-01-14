import { useEffect } from 'react';
import { Hero } from './sections/Hero';
import { Details } from './sections/Details';
import { Guestbook } from './sections/Guestbook';
import { Gift } from './components/Gift';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import Lenis from '@studio-freight/lenis';

import { Preloader } from './components/Preloader';
import { AdminLogin } from './components/AdminLogin';
import { useState, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLocked, setIsLocked] = useState(true);
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('wedding_admin_auth') === 'true';
  });
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const lenisRef = useRef<Lenis | null>(null);

  // Update path on popstate (back/forward)
  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo(0, 0);
  };

  // Scroll Lock Logic
  useEffect(() => {
    if (isLoading || isLocked || currentPath === '/admin-og') {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none'; // Strict mobile lock
      if (lenisRef.current) lenisRef.current.stop();
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
      if (lenisRef.current) lenisRef.current.start();
    }
  }, [isLoading, isLocked, currentPath]);

  // Smooth Scroll Setup
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    // Initial check in case it mounts locked
    if (isLocked) lenis.stop();

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };

  }, []); // Empty dependency mainly because we want single instantiation

  // Force scroll to top on refresh/load
  useEffect(() => {
    window.history.scrollRestoration = 'manual';
    if (currentPath !== '/admin-og') {
      window.scrollTo(0, 0);
    }
  }, []);

  if (currentPath === '/admin-og') {
    return (
      <AdminLogin
        onLogin={() => {
          setIsAdmin(true);
          localStorage.setItem('wedding_admin_auth', 'true');
          navigate('/');
        }}
        onBack={() => navigate('/')}
      />
    );
  }

  return (
    <main className="w-full bg-bg-primary min-h-screen">
      <AnimatePresence mode='wait'>
        {isLoading && <Preloader key="preloader" onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      <Hero onUnlock={() => setIsLocked(false)} />
      <Details />
      <Guestbook isAdmin={isAdmin} />
      <FAQ />
      <Gift />
      <Footer />
    </main>
  );
}

export default App;
