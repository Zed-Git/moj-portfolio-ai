import React from 'react';
import { motion } from 'framer-motion'; 

const ProjectDetails = ({ project, onClose }) => {
  if (!project) return null;
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
        className="bg-slate-900 border border-slate-800 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-4xl shadow-2xl"
      >
        <img src={project.slika_url} alt="" className="w-full h-64 md:h-96 object-cover" />
        <div className="p-8 md:p-12 text-left">
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">{project.naslov}</h2>
          <p className="text-slate-400 leading-relaxed mb-10 whitespace-pre-wrap">{project.opis}</p>
          <button onClick={onClose} className="bg-white text-black font-bold px-10 py-3 rounded-full hover:bg-cyan-500 hover:text-white transition-all uppercase text-xs">Close Records</button>
        </div>
      </motion.div>
    </motion.div>
  );
};
export default ProjectDetails;