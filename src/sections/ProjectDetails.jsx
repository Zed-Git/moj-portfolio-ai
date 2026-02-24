import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaCode, FaMicroscope } from 'react-icons/fa';
import { supabase } from '../supabaseClient';
import bgFlare from '../assets/bg-flare.jpg';

const ProjectDetails = () => {
  const { id } = useParams();
  const [projekat, setProjekat] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOneProject = async () => {
      setLoading(true);
      const { data } = await supabase.from('projects').select('*').eq('id', id).single();
      if (data) setProjekat(data);
      setLoading(false);
    };
    fetchOneProject();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-[#03040b] flex items-center justify-center">
      <p className="text-cyan-400 uppercase tracking-widest text-xs animate-pulse font-black font-sans">Loading Medical Data...</p>
    </div>
  );

  if (!projekat) return (
    <div className="min-h-screen bg-[#03040b] flex flex-col items-center justify-center font-sans">
      <h2 className="text-white text-xl mb-6">Project not found.</h2>
      <Link to="/" className="text-cyan-400 uppercase text-xs font-black tracking-widest hover:text-white transition-all underline">Back to Home</Link>
    </div>
  );

  return (
    <div className="relative min-h-screen w-full bg-[#03040b] text-white font-sans text-left overflow-x-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img src={bgFlare} alt="BG" className="w-full h-full object-cover opacity-30" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-32 pb-20 text-left">
        <Link to="/" className="inline-flex items-center gap-2 text-cyan-400 hover:text-white transition-colors mb-12 uppercase text-[10px] font-black tracking-[0.2em] font-sans">
          <FaArrowLeft /> Back to Home
        </Link>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="bg-white/3 backdrop-blur-3xl border border-white/10 p-10 md:p-16 rounded-[60px] shadow-3xl text-left">
          <h1 className="text-5xl md:text-7xl font-black mb-8 italic tracking-tighter text-white leading-none text-left">
            {projekat.naslov}
          </h1>
          
          <div className="flex flex-wrap gap-4 mb-10 text-left">
            <span className="bg-cyan-500/10 text-cyan-400 px-4 py-2 rounded-full border border-cyan-500/20 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 font-sans">
              <FaMicroscope /> Medical Research
            </span>
            <span className="bg-blue-500/10 text-blue-400 px-4 py-2 rounded-full border border-blue-500/20 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 font-sans">
              <FaCode /> Scientific AI
            </span>
          </div>

          <div className="prose prose-invert max-w-none text-left">
            <h2 className="text-cyan-400 text-sm font-black uppercase tracking-[0.3em] mb-6 text-left font-sans">Technical Documentation</h2>
            <p className="text-blue-100/60 text-lg leading-relaxed whitespace-pre-line font-light text-left font-sans">
               {projekat.opis}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProjectDetails;