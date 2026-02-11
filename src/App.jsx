import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion'; 
import Header from './components/Header';
import About from './sections/About';
import Projects from './sections/Projects';
import Contact from './sections/Contact';
import ProjectDetails from './sections/ProjectDetails'; // Nova komponenta
import bgFlare from './assets/bg-flare.jpg';

// Pravimo posebnu komponentu za Home sadržaj da bi kod bio pregledniji
const Home = () => (
  <main className="max-w-6xl mx-auto pt-60 pb-32">
    <motion.div 
      initial={{ opacity: 0, y: 100, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1.2, delay: 0.2, ease: [0, 0.71, 0.2, 1.01] }}
      className="bg-[#03040b]/40 backdrop-blur-2xl border border-white/10 p-16 md:p-24 rounded-[80px] shadow-[0_0_50px_rgba(0,0,0,0.5)] text-center relative overflow-hidden"
    >
      <div className="inline-block px-5 py-2 mb-10 text-[11px] font-black tracking-[0.4em] text-cyan-400 uppercase border border-cyan-400/20 rounded-full bg-cyan-400/10">
        AI + Health-Tech Precision
      </div>
      <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.85] mb-10 drop-shadow-2xl">
        Zdravko <br />
        <span className="text-transparent bg-clip-text bg-linear-to-tr from-blue-400 via-white to-cyan-300">
          Mijailović
        </span>
      </h1>
      <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto mb-16 font-light leading-relaxed italic">
        "Lekar koji koristi veštačku inteligenciju da redefiniše budućnost zdravstva."
      </p>
      <div className="flex flex-wrap gap-8 justify-center">
        <a href="#projects" className="bg-white text-black px-12 py-5 rounded-2xl font-black text-sm tracking-widest hover:bg-cyan-400 transition-all uppercase inline-block">Projekti</a>
        <a href="#contact" className="bg-white/5 text-white border border-white/10 px-12 py-5 rounded-2xl font-black text-sm tracking-widest hover:bg-white/20 transition-all uppercase inline-block">Kontakt</a>
      </div>
    </motion.div>
    <About />
    <Projects />
    <Contact />
  </main>
);

function App() {
  return (
    <Router>
      <div className="relative min-h-screen w-full bg-[#03040b] text-white overflow-x-hidden font-sans">
        {/* POZADINA */}
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <img src={bgFlare} alt="Background" className="w-full h-full object-cover scale-110" />
          <div className="absolute inset-0 bg-[#03040b]/40 bg-linear-to-b from-[#03040b]/80 via-[#03040b]/20 to-[#03040b]/90"></div>
        </div>

        <div className="relative z-10 px-4">
          <Header />
          
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/project/:id" element={<ProjectDetails />} />
          </Routes>

          <footer className="py-20 text-center opacity-30 text-[10px] tracking-[0.8em] uppercase">
            Zdravko Mijailović // 2026 // MD-AI
          </footer>
        </div>
      </div>
    </Router>
  );
}

export default App;