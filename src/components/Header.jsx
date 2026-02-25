import React from 'react';
import medicalLogo from '../assets/medical-logo.jpg';
import { FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-blue-600/20 backdrop-blur-2xl border-b border-white/10 py-4 px-4 md:px-16 flex justify-between items-center shadow-2xl">
      
      {/* LOGO I IME */}
      <a href="#home" className="flex items-center gap-2 md:gap-3 hover:opacity-80 transition-all cursor-pointer">
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-white/20 overflow-hidden shadow-[0_0_15px_rgba(255,255,255,0.2)]">
          <img src={medicalLogo} alt="Logo" className="w-full h-full object-cover" />
        </div>
        <span className="text-lg md:text-xl font-black text-white tracking-tighter uppercase whitespace-nowrap">
          Zed <span className="text-cyan-400 font-light hidden sm:inline">AI-Portfolio</span>
        </span>
      </a>

      <nav className="flex items-center gap-4 md:gap-8">
        {/* NAVIGACIJA - Vidljiva samo na tabletima i desktopu */}
        <ul className="hidden md:flex items-center gap-3 text-[15px] font-black uppercase tracking-[0.2em]">
          <li>
            <a href="#home" className="text-white bg-white/15 border border-white/30 px-6 py-2 rounded-full hover:bg-white/30 transition-all">
              Home
            </a>
          </li>
          {['About', 'Projects', 'Contact'].map((item) => (
            <li key={item}>
              <a href={`#${item.toLowerCase()}`} className="text-white/50 px-5 py-2 rounded-full hover:text-white hover:bg-white/10 transition-all">
                {item}
              </a>
            </li>
          ))}
        </ul>

        {/* VERTIKALNA LINIJA - Skriva se na mobilnom */}
        <div className="hidden md:block w-px h-6 bg-white/10 mx-2"></div>
        
        {/* SOCIJALNE IKONICE - Manji gap na mobilnom */}
        <div className="flex items-center gap-4 md:gap-5 text-lg">
          <a href="#" className="text-white/30 hover:text-white transition-all"><FaLinkedin /></a>
          <a href="#" className="text-white/30 hover:text-white transition-all"><FaGithub /></a>
          <a href="#" className="text-white/30 hover:text-white transition-all"><FaEnvelope /></a>
        </div>
      </nav>
    </header>
  );
};

export default Header;