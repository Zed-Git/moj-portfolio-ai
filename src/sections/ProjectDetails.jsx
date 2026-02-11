import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion'; 
import { FaArrowLeft, FaMicroscope, FaCode } from 'react-icons/fa';
import bgFlare from '../assets/bg-flare.jpg';
import { mojiProjekti } from '../data/projectsData';

const ProjectDetails = () => {
  const { id } = useParams();
  const projekat = mojiProjekti.find(p => p.id === parseInt(id));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!projekat) return <div className="text-white text-center pt-40">Projekat nije pronađen.</div>;

  return (
    <div className="relative min-h-screen w-full bg-[#03040b] text-white">
      <div className="fixed inset-0 z-0">
        <img src={bgFlare} alt="BG" className="w-full h-full object-cover opacity-30" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-32 pb-20">
        <Link to="/" className="inline-flex items-center gap-2 text-cyan-400 hover:text-white transition-colors mb-12 uppercase text-xs font-black tracking-widest">
          <FaArrowLeft /> Nazad na Home
        </Link>

        {/* OVDE KORISTIMO motion.div DA SKLONIMO GREŠKU */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/3 backdrop-blur-3xl border border-white/10 p-10 md:p-16 rounded-[60px]"
        >
          <h1 className="text-5xl md:text-7xl font-black mb-8 italic tracking-tighter">{projekat.naslov}</h1>
          <p className="text-blue-100/60 text-lg leading-relaxed">{projekat.detaljanTekst}</p>
        </motion.div>
      </div>
    </div>
  );
};

export default ProjectDetails; // Proveri da li je ovde cela reč export