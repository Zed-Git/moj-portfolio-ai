import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { trackPageView } from './analytics';
import Header from './components/Header';
import About from './sections/About';

const Projects = lazy(() => import('./sections/Projects'));
const Contact = lazy(() => import('./sections/Contact'));
const ProjectDetailsRoute = lazy(() =>
  import('./sections/ProjectDetails').then((m) => ({ default: m.ProjectDetailsRoute }))
);
const AdminPanel = lazy(() => import('./sections/AdminPanel'));

const bgFlare = '/bg-flare.webp';
const medicalLogo = '/medical-logo.webp';
const zdravkoImg = '/zdravko1.webp';

const RouteFallback = () => (
  <div className="flex min-h-[50vh] items-center justify-center" role="status" aria-label="Loading">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-500/30 border-t-cyan-400" />
  </div>
);

const Home = () => (
  /* 1. Ovde koristimo 'motion.main' umesto običnog 'main'. 
     Ovim "zapošljavamo" motion alat i rešavamo VS Code warning. */
  <motion.main 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.8 }}
    className="max-w-6xl mx-auto pt-32 md:pt-48 pb-32 px-4 md:px-0"
  >
    <div className="bg-[#03040b]/60 backdrop-blur-3xl border border-white/10 p-8 md:p-20 rounded-[40px] md:rounded-[100px] shadow-2xl text-center relative overflow-hidden">
      
      {/* POZADINSKI SLOJ */}
      <div className="absolute inset-0 z-0">
        <img src={medicalLogo} alt="" width={512} height={512} decoding="async" fetchPriority="low" className="w-full h-full object-cover opacity-10" />
        <div className="absolute inset-0 bg-linear-to-b from-transparent to-[#03040b]"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* TVOJA SLIKA SA ANIMACIJOM */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="relative mb-10"
        >
          <div className="absolute inset-0 bg-cyan-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>
          <img
            src={zdravkoImg}
            alt="Z. Mijailovic"
            width={224}
            height={224}
            fetchPriority="high"
            decoding="async"
            className="w-48 h-48 md:w-56 md:h-56 rounded-full object-cover border-4 border-white/10 shadow-2xl relative z-10"
          />
        </motion.div>

        <div className="inline-block px-4 py-1.5 mb-6 text-[10px] md:text-[11px] font-black tracking-[0.4em] text-cyan-400 uppercase border border-cyan-400/20 rounded-full bg-cyan-400/10">
          AI + Health-Tech Precision
        </div>

        {/* TITULA - Dodao sam FACC i ARDMS prema tvom screenshotu */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter leading-tight mb-8 drop-shadow-2xl">
          Z. Mijailovic <br />
          <span className="text-transparent bg-clip-text bg-linear-to-tr from-blue-400 via-white to-cyan-300">
            MD, PhD, FACC, ARDMS, <br className="hidden md:block" /> Cardiologist - AI
          </span>
        </h1>

        <p className="text-lg md:text-xl text-blue-100/90 max-w-3xl mx-auto mb-12 font-light leading-relaxed italic">
          "I believe that <span className="text-white font-medium italic underline decoration-cyan-500/50 underline-offset-4">Medicine must evolve</span> from being merely an individual craft or skill into a rigorous science."
        </p>

        <div className="flex flex-col sm:flex-row gap-5 md:gap-8 justify-center items-center w-full">
          <a href="#projects" className="w-full sm:w-auto bg-white text-black px-12 py-5 rounded-2xl font-black text-sm tracking-widest hover:bg-cyan-400 transition-all uppercase shadow-xl text-center">
            Projects
          </a>
          <a href="#contact" className="w-full sm:w-auto bg-white/5 text-white border border-white/10 px-12 py-5 rounded-2xl font-black text-sm tracking-widest hover:bg-white/10 transition-all uppercase text-center">
            Contact
          </a>
        </div>
      </div>
    </div>

    {/* Pozivamo ostale sekcije — Projects i Contact ispod fold-a, lazy load */}
    <About />
    <Suspense fallback={null}>
      <Projects />
    </Suspense>
    <Suspense fallback={null}>
      <Contact />
    </Suspense>
  </motion.main>
);

/**
 * RouteTracker — pratimo promene stranica u React Router SPA.
 * GA4 ne vidi history.pushState automatski; ovaj mali komponent
 * šalje page_view event svaki put kad se ruta promeni.
 * Mora biti UNUTAR <Router> da useLocation() radi.
 */
function RouteTracker() {
  const location = useLocation();
  useEffect(() => {
    trackPageView(location.pathname + location.search, document.title);
  }, [location]);
  return null;
}

function App() {
  return (
    <Router>
      <div id="home" className="relative min-h-screen w-full bg-[#03040b] text-white overflow-x-hidden font-sans">
        {/* Pozadinski efekat preko celog ekrana */}
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <img src={bgFlare} alt="" width={1920} height={1180} decoding="async" fetchPriority="low" className="w-full h-full object-cover opacity-60" />
        </div>

        <div className="relative z-10 px-4">
          <RouteTracker />
          <Header />
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/project/:id" element={<ProjectDetailsRoute />} />
              <Route path="/admin" element={<AdminPanel />} />
            </Routes>
          </Suspense>
          <footer className="py-16 text-center opacity-30 text-[9px] tracking-[0.6em] uppercase border-t border-white/5">
            Z. Mijailović // 2026 // MD, PhD, FACC, ARDMS - AI
          </footer>
        </div>
      </div>
    </Router>
  );
}

export default App;
