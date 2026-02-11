import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { mojiProjekti } from '../data/projectsData'; // Pravilna putanja

const Projects = () => {
  return (
    <section id="projects" className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl font-black text-white mb-16 uppercase tracking-[0.2em] text-center">Moji AI Projekti</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {mojiProjekti.map((projekat, index) => (
            <motion.div 
              key={projekat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-[#03040b]/40 backdrop-blur-xl border border-white/10 rounded-[40px] overflow-hidden group hover:border-cyan-500/30 transition-all shadow-2xl"
            >
              <div className="h-72 w-full bg-black overflow-hidden relative">
                {projekat.tipMedija === "slika" ? (
                  <img src={projekat.izvorMedija} alt={projekat.naslov} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <video src={projekat.izvorMedija} autoPlay muted loop playsInline onEnded={(e) => e.target.play()} className="w-full h-full object-cover" />
                )}
                <div className="absolute inset-0 bg-linear-to-t from-[#03040b] to-transparent opacity-40"></div>
              </div>
              <div className="p-8">
                <h3 className="text-xl font-bold text-white uppercase mb-4">{projekat.naslov}</h3>
                <p className="text-blue-100/60 leading-relaxed font-light mb-6 text-sm">{projekat.opis}</p>
                <Link to={`/project/${projekat.id}`} className="mt-8 flex items-center text-cyan-400 text-[10px] font-black tracking-[0.2em] uppercase cursor-pointer group-hover:text-white transition-colors">
                  Tehnička dokumentacija <span className="ml-2 group-hover:translate-x-2 transition-transform">→</span>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default Projects;