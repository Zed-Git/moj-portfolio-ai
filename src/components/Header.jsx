import React from 'react';
import medicalLogo from '../assets/medical-logo.jpg';
import { FaLinkedin, FaGithub, FaTwitter, FaEnvelope } from 'react-icons/fa';

const Header = () => {
  return (
    <header className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50 bg-[#03040b]/60 backdrop-blur-xl border border-white/10 py-2 px-8 rounded-full flex justify-between items-center shadow-[0_0_30px_rgba(34,211,238,0.2)]">
      
      {/* 1. LOGO SEKCIJA - Sada je cela u <a> tagu koji vodi na #home */}
      <a href="#home" className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer">
        <div className="w-10 h-10 rounded-full border-2 border-cyan-400/50 overflow-hidden shadow-[0_0_15px_rgba(34,211,238,0.4)]">
          <img src={medicalLogo} alt="Logo" className="w-full h-full object-cover" />
        </div>
        <div className="text-sm font-black text-white tracking-widest uppercase hidden lg:block">
          Zdravko <span className="text-cyan-400">Mijailović</span>
        </div>
      </a>

      {/* NAVIGACIJA */}
      <nav className="flex items-center gap-8">
        <ul className="hidden md:flex space-x-2 items-center text-[10px] font-bold uppercase tracking-widest">
          {/* 2. HOME DUGME - Vodi na #home */}
          <li>
            <a href="#home" className="bg-white/10 text-white border border-white/20 px-4 py-2 rounded-full hover:bg-white/20 transition-all">
              Home
            </a>
          </li>
          <li><a href="#about" className="text-white/60 hover:text-white px-3 py-2 transition-all">About</a></li>
          <li><a href="#projects" className="text-white/60 hover:text-white px-3 py-2 transition-all">Projects</a></li>
        </ul>

        <div className="hidden md:block w-px h-6 bg-white/10"></div>

        {/* IKONICE SOCIJALNIH MREŽA ostaju iste... */}



        {/* IKONICE SOCIJALNIH MREŽA */}
        <div className="flex items-center gap-5 text-lg">
          <a href="https://linkedin.com/in/tvoj-profil" target="_blank" rel="noreferrer" 
             className="text-white/50 hover:text-cyan-400 hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] transition-all">
            <FaLinkedin />
          </a>
          <a href="https://github.com/tvoj-nalog" target="_blank" rel="noreferrer"
             className="text-white/50 hover:text-cyan-400 hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] transition-all">
            <FaGithub />
          </a>
          {/* SADA DODAJEMO TWITTER KOJI JE FALIO: */}
          <a href="https://twitter.com/tvoj-nalog" target="_blank" rel="noreferrer"
             className="text-white/50 hover:text-cyan-400 hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] transition-all">
            <FaTwitter />
          </a>
          <a href="mailto:tvoj.email@gmail.com"
             className="text-white/50 hover:text-cyan-400 hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] transition-all">
            <FaEnvelope />
          </a>
        </div>
      </nav>
    </header>
  );
};

export default Header;