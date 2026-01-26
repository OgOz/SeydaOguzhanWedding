import { useEffect, useMemo, useState, useRef } from 'react';
import { Hero } from './sections/Hero';
import { Details } from './sections/Details';
import { Guestbook } from './sections/Guestbook';
import { Gift } from './components/Gift';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import Lenis from '@studio-freight/lenis';
import { weddingTR, partyTR, weddingEN, partyEN, type Content } from './content';
import { Preloader } from './components/Preloader';
import { AdminLogin } from './components/AdminLogin';
import { AnimatePresence } from 'framer-motion';
import { LanguageSwitcher } from './components/LanguageSwitcher';

// Prevent browser from restoring scroll position on refresh
if (typeof window !== 'undefined') {
  window.history.scrollRestoration = 'manual';
}

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLocked, setIsLocked] = useState(true);
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('wedding_admin_auth') === 'true';
  });
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  // Language State
  const [lang, setLang] = useState<'tr' | 'en'>(() => {
    return (localStorage.getItem('wedding_lang') as 'tr' | 'en') || 'tr';
  });

  const lenisRef = useRef<Lenis | null>(null);

  // After Party Detection
  const isAfterParty = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('after_party') === 'true' || currentPath === '/after';
  }, [currentPath]);

  // Content Selection
  const content: Content = useMemo(() => {
    if (lang === 'tr') {
      return isAfterParty ? partyTR : weddingTR;
    } else {
      return isAfterParty ? partyEN : weddingEN;
    }
  }, [lang, isAfterParty]);

  const handleLangToggle = (newLang: 'tr' | 'en') => {
    setLang(newLang);
    localStorage.setItem('wedding_lang', newLang);
  };

  // SEO & Meta Management
  useEffect(() => {
    // 1. Robots
    let robotsMeta = document.querySelector('meta[name="robots"]');
    if (!robotsMeta) {
      robotsMeta = document.createElement('meta');
      robotsMeta.setAttribute('name', 'robots');
      document.head.appendChild(robotsMeta);
    }
    if (isAfterParty) {
      robotsMeta.setAttribute('content', 'noindex, nofollow');
    } else {
      robotsMeta.setAttribute('content', 'index, follow');
    }

    // 2. Theme Color
    let themeMeta = document.querySelector('meta[name="theme-color"]');
    if (!themeMeta) {
      themeMeta = document.createElement('meta');
      themeMeta.setAttribute('name', 'theme-color');
      document.head.appendChild(themeMeta);
    }
    themeMeta.setAttribute('content', isAfterParty ? '#0a0508' : '#fdf6f8');

    // 3. Document Title & Description
    document.title = content.meta.title;
    let descMeta = document.querySelector('meta[name="description"]');
    if (descMeta) {
      descMeta.setAttribute('content', content.meta.description);
    }
    document.documentElement.lang = content.lang;

  }, [isAfterParty, content]);

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

  }, []);

  // Force scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
    return () => clearTimeout(timer);
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

  const handleAdminLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('wedding_admin_auth');
  };

  const detailsData = {
    date: content.date.full,
    weekday: content.date.weekday,
    time: content.date.time,
    timeLabel: content.date.label,
    locationName: content.location.name,
    locationDistrict: content.location.district,
    locationMapLink: content.location.mapLink,
    calendar: content.date.calendar
  };

  return (
    <main className={`w-full min-h-screen transition-colors duration-700 ${isAfterParty ? 'bg-[#0a0508]' : 'bg-bg-primary'}`}>
      <LanguageSwitcher currentLang={lang} onToggle={handleLangToggle} isAfterParty={isAfterParty} />

      <AnimatePresence mode='wait'>
        {isLoading && <Preloader key="preloader" onComplete={() => setIsLoading(false)} isAfterParty={isAfterParty} content={content} />}
      </AnimatePresence>

      <Hero onUnlock={() => setIsLocked(false)} isAfterParty={isAfterParty} content={content} />
      <Details isAfterParty={isAfterParty} data={detailsData} content={content} />
      <Guestbook isAdmin={isAdmin} onAdminLogout={handleAdminLogout} isAfterParty={isAfterParty} content={content} />
      <FAQ isAfterParty={isAfterParty} content={content} />
      <Gift isAfterParty={isAfterParty} content={content} />
      <Footer isAfterParty={isAfterParty} content={content} />
    </main>
  );
}

export default App;
