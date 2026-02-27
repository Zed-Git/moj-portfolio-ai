import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion'; 
import Header from './components/Header';
import About from './sections/About';
import Projects from './sections/Projects';
import Contact from './sections/Contact';
import ProjectDetails from './sections/ProjectDetails';
import AdminPanel from './sections/AdminPanel'; 
import bgFlare from './assets/bg-flare.jpg';
import medicalLogo from './assets/medical-logo.jpg';

const Home = () => (
  <motion.main 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.8 }}
    className="max-w-6xl mx-auto pt-32 md:pt-60 pb-32 px-4 md:px-0"
  >
    <div className="bg-[#03040b]/40 backdrop-blur-2xl border border-white/10 p-8 md:p-24 rounded-[40px] md:rounded-[80px] shadow-2xl text-center relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src={medicalLogo} alt="Medical AI" className="w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-linear-to-b from-[#03040b]/10 via-transparent to-[#03040b]/80"></div>
      </div>

      <div className="relative z-10">
        <div className="inline-block px-4 py-1.5 mb-6 md:mb-10 text-[9px] md:text-[11px] font-black tracking-[0.3em] text-cyan-400 uppercase border border-cyan-400/20 rounded-full bg-cyan-400/10">
          AI + Health-Tech Precision
        </div>

        <h1 className="text-4xl md:text-7xl lg:text-9xl font-black text-white tracking-tighter leading-tight md:leading-[0.85] mb-8 md:mb-10 drop-shadow-2xl">
          Z. Mijailovic <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-linear-to-tr from-blue-400 via-white to-cyan-300">
            MD, PhD - AI
          </span>
        </h1>

        <p className="text-base md:text-xl lg:text-2xl text-white/80 max-w-2xl mx-auto mb-10 md:mb-16 font-light leading-relaxed italic">
          "Medicine must evolve from being merely an individual craft or skill into a rigorous science."
        </p>

        <div className="flex flex-col sm:flex-row gap-4 md:gap-8 justify-center items-center">
          <a href="#projects" className="w-full sm:w-auto bg-white text-black px-10 py-4 rounded-2xl font-black text-xs tracking-widest hover:bg-cyan-400 transition-all uppercase text-center">Projekti</a>
          <a href="#contact" className="w-full sm:w-auto bg-white/5 text-white border border-white/10 px-10 py-4 rounded-2xl font-black text-xs tracking-widest hover:bg-white/20 transition-all uppercase text-center">Kontakt</a>
        </div>
      </div>
    </div>

    <About />
    <Projects />
    <Contact />
  </motion.main>
);

function App() {
  return (
    <Router>
      <div id="home" className="relative min-h-screen w-full bg-[#03040b] text-white overflow-x-hidden font-sans">
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <img src={bgFlare} alt="Background" className="w-full h-full object-cover opacity-50" />
          <div className="absolute inset-0 bg-linear-to-b from-[#03040b]/80 via-transparent to-[#03040b]/90"></div>
        </div>

        <div className="relative z-10">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/project/:id" element={<ProjectDetails />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
          <footer className="py-10 text-center opacity-30 text-[8px] md:text-[10px] tracking-[0.5em] md:tracking-[0.8em] uppercase border-t border-white/5">
            Zdravko Mijailović // 2026 // MD, PhD - AI
          </footer>
        </div>
      </div>
    </Router>
  );
}

export default App;
