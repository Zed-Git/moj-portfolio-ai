import React from 'react';
import medicalLogo from '../assets/medical-logo.jpg';
import { FaLinkedin, FaXTwitter } from 'react-icons/fa6';

const Header = () => {
  const socialLinks = {
    linkedin: "https://www.linkedin.com/in/your-profile", 
    x: "https://x.com/your-handle"
  };

  return (
    // Promenjeno z-[100] u z-100 po savetu vašeg VS Code-a
    <header className="fixed top-0 left-0 w-full z-100 bg-[#03040b]/80 backdrop-blur-xl border-b border-white/5 py-4 px-6 md:px-16 flex justify-between items-center shadow-2xl">
      <a href="#home" className="flex items-center gap-3 hover:opacity-80 transition-all font-sans">
        <div className="w-10 h-10 rounded-full border border-cyan-500/30 overflow-hidden shadow-[0_0_15px_rgba(6,182,212,0.2)]">
          <img src={medicalLogo} alt="Logo" className="w-full h-full object-cover" />
        </div>
        <span className="text-xl font-black text-white tracking-tighter uppercase">
          Zed <span className="text-cyan-400 font-light text-sm">AI-Portfolio</span>
        </span>
      </a>

      <nav className="flex items-center gap-8">
        <ul className="hidden md:flex items-center gap-6 text-[11px] font-black uppercase tracking-[0.2em]">
          <li><a href="#home" className="text-white hover:text-cyan-400 transition-all">Home</a></li>
          <li><a href="#about" className="text-white/60 hover:text-cyan-400 transition-all">About</a></li>
          <li><a href="#projects" className="text-white/60 hover:text-cyan-400 transition-all">Projects</a></li>
          <li><a href="#contact" className="text-white/60 hover:text-cyan-400 transition-all">Contact</a></li>
        </ul>

        <div className="hidden md:block w-px h-4 bg-white/10 mx-2"></div>
        
        <div className="flex items-center gap-5 text-lg">
          <a href={socialLinks.linkedin} target="_blank" rel="noreferrer" className="text-white/30 hover:text-cyan-400 transition-all"><FaLinkedin /></a>
          <a href={socialLinks.x} target="_blank" rel="noreferrer" className="text-white/30 hover:text-cyan-400 transition-all"><FaXTwitter /></a>
        </div>
      </nav>
    </header>
  );
};

export default Header;