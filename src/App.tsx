import { useEffect } from 'react';
import { Hero } from './sections/Hero';
import { Details } from './sections/Details';
import { Guestbook } from './sections/Guestbook';
import { Gift } from './components/Gift';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import Lenis from '@studio-freight/lenis';

import { Preloader } from './components/Preloader';
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLocked, setIsLocked] = useState(true);

  // Scroll Lock Logic
  useEffect(() => {
    if (isLoading || isLocked) {
      document.body.style.overflow = 'hidden';
      // Also stop lenis if possible, but overflow hidden usually works check interaction
    } else {
      document.body.style.overflow = '';
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

    // Optional: Stop lenis when locked just to be safe (though overflow hidden usually catches touches)
    // But since lenis instance is local, we rely on overflow hidden.

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []); // Re-running this might re-create lenis, better keep it empty dep.

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
