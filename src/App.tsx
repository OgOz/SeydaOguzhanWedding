import { useEffect } from 'react';
import { Hero } from './components/Hero';
import { Details } from './components/Details';
import { Gift } from './components/Gift';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import Lenis from '@studio-freight/lenis';

function App() {

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

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <main className="w-full bg-bg-primary min-h-screen">
      <Hero />
      <Details />
      <Gift />
      <FAQ />
      <Footer />
    </main>
  );
}

export default App;
