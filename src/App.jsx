import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Preloader from './components/Preloader';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Process from './components/Process';
import Certifications from './components/Certifications';
import Contact from './components/Contact';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';
import PraveenPanel from './components/PraveenPanel';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [isPanel] = useState(() => {
    const path = window.location.pathname.toLowerCase();
    return path === '/praveen' || path === '/url/praveen' || path === '/praveen/' || path === '/url/praveen/';
  });
  const [isLoading, setIsLoading] = useState(() => {
    const path = window.location.pathname.toLowerCase();
    const isPanelPath = path === '/praveen' || path === '/url/praveen' || path === '/praveen/' || path === '/url/praveen/';
    return !isPanelPath;
  });

  useEffect(() => {
    if (isPanel) return;

    // Lenis Smooth Scroll Setup
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, [isPanel]);

  if (isPanel) {
    return <PraveenPanel />;
  }

  return (
    <>
      <CustomCursor />
      <AnimatePresence mode="wait">
        {isLoading && <Preloader setIsLoading={setIsLoading} />}
      </AnimatePresence>

      <div className="relative">
        <Navbar />
        <main>
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Process />
          <Certifications />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  );
}

export default App;
