import { Hero } from './sections/Hero';
import { Details } from './sections/Details';
import { Donation } from './sections/Donation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

function App() {
  return (
    <div className="min-h-screen w-full bg-[#fbf8f2] font-sans antialiased text-dark-900 selection:bg-gold-200 selection:text-dark-900">
      <Hero />
      {/* Container adds negative margin to pull overlapping content */}
      <div className="relative z-20">
        <Details />
        <Donation />
      </div>

      <footer className="py-12 text-center text-stone-400 text-sm bg-white relative z-20">
        <p className="opacity-60">&copy; 2026 Şeyda & Oğuzhan</p>
      </footer>
    </div>
  );
}

export default App;
