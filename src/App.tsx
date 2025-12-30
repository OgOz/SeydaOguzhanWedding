import { useEffect } from 'react';
import { Hero } from './sections/Hero';
import { Details } from './sections/Details';
import { Guestbook } from './sections/Guestbook';
import { Gift } from './components/Gift';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import Lenis from '@studio-freight/lenis';

import { Preloader } from './components/Preloader';
import { useState, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLocked, setIsLocked] = useState(true);
  const lenisRef = useRef<Lenis | null>(null);

  // Scroll Lock Logic
  useEffect(() => {
    if (isLoading || isLocked) {
      document.body.style.overflow = 'hidden';
      if (lenisRef.current) lenisRef.current.stop();
    } else {
      document.body.style.overflow = '';
      if (lenisRef.current) lenisRef.current.start();
    }
  }, [isLoading, isLocked]);

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

  return (
    <main className="w-full bg-bg-primary min-h-screen">
      <AnimatePresence mode='wait'>
        {isLoading && <Preloader key="preloader" onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      <Hero onUnlock={() => setIsLocked(false)} />
      <Details />
      <Guestbook />
      <FAQ />
      <Gift />
      <Footer />
    </main>
  );
}

export default App;
