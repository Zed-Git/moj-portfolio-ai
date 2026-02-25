import React from 'react';
import { motion } from 'framer-motion'; 

const ProjectDetails = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-slate-900 border border-slate-800 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl"
      >
        {/* Slika u detaljima */}
        <div className="h-64 md:h-96 w-full">
          <img 
            src={project.slika_url} 
            alt={project.naslov} 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Tekstualni sadržaj - FIKSIRAN text-left */}
        <div className="p-8 md:p-12 text-left"> 
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">
            {project.naslov}
          </h2>
          
          <div className="flex gap-2 mb-8">
            <span className="bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 px-3 py-1 rounded-full text-xs font-mono">
              {project.tehnologija || 'AI Research'}
            </span>
          </div>

          <p className="text-slate-400 leading-relaxed mb-10 whitespace-pre-wrap">
            {project.opis}
          </p>

          <button 
            onClick={onClose}
            className="bg-white text-black font-bold px-8 py-3 rounded-full hover:bg-cyan-500 hover:text-white transition-all uppercase text-sm"
          >
            Zatvori detalje
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProjectDetails;