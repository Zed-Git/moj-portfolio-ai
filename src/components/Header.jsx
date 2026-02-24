import React from 'react';
import { Link } from 'react-router-dom';
import medicalLogo from '../assets/medical-logo.jpg';
import { FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa';

const Header = () => {
  return (
    // bg-white/5 ILI, ako hocemo bg-blue-600/20 i backdrop-blur-2xl prave "SVETLEĆE STAKLO"
    <header className="fixed top-0 left-0 w-full z-50 bg-blue-600/20 backdrop-blur-2xl border-b border-white/10 py-5 px-8 md:px-16 flex justify-between items-center shadow-2xl">
      
      {/* LOGO I IME - Klikom na ovo se vraćaš na #home */}
      <a href="#home" className="flex items-center gap-3 hover:opacity-80 transition-all cursor-pointer">
        <div className="w-10 h-10 rounded-full border border-white/20 overflow-hidden shadow-[0_0_15px_rgba(255,255,255,0.2)]">
          <img src={medicalLogo} alt="Logo" className="w-full h-full object-cover" />
        </div>
        <span className="text-xl font-black text-white tracking-tighter uppercase">
          Zed <span className="text-cyan-400 font-light">AI-Portfolio</span>
        </span>
      </a>

{/* VELICINU SLOVA u Header-u menjamo na..text-[15px]... */}
      <nav className="flex items-center gap-8">
        <ul className="hidden md:flex items-center gap-3 text-[15px] font-black uppercase tracking-[0.2em]">
          <li>
            {/* AKTIVNO HOME DUGME */}
            <a href="#home" className="text-white bg-white/15 border border-white/30 px-6 py-2 rounded-full hover:bg-white/30 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all">
              Home
            </a>
          </li>
          
          {/* OSTALI LINKOVI SA "AURA" EFEKTOM */}
          {['About', 'Projects', 'Contact'].map((item) => (
            <li key={item}>
              <a 
                href={`#${item.toLowerCase()}`} 
                className="text-white/50 px-5 py-2 rounded-full hover:text-white hover:bg-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-all"
              >
                {item}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:block w-px h-6 bg-white/10 mx-2"></div>
        
        <div className="flex items-center gap-5 text-lg">
          <a href="#" className="text-white/30 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all"><FaLinkedin /></a>
          <a href="#" className="text-white/30 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all"><FaGithub /></a>
          <a href="#" className="text-white/30 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all"><FaEnvelope /></a>
        </div>
      </nav>
    </header>
  );
};

export default Header;