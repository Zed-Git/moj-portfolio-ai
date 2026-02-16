import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const Projects = () => {
  const [projektiIzBaze, setProjektiIzBaze] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('id', { ascending: true });
      if (error) throw error;
      setProjektiIzBaze(data);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  if (loading) return <div className="text-center text-white py-20 uppercase tracking-widest text-xs">Učitavanje medicinske baze...</div>;

  return (
    <section id="projects" className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-black text-white mb-16 uppercase tracking-[0.2em] text-center">Moji AI Projekti</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {projektiIzBaze.map((projekat, index) => (
            <motion.div 
              key={projekat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-[#03040b]/40 backdrop-blur-xl border border-white/10 rounded-[40px] overflow-hidden group hover:border-cyan-500/30 transition-all shadow-2xl flex flex-col h-full"
            >
              {/* MULTIMEDIJA */}
              <div className="h-64 w-full bg-black overflow-hidden relative">
                {projekat.tip_medija === "slika" ? (
                  <img src={projekat.izvor_medija} alt={projekat.naslov} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                ) : (
                  <video src={projekat.izvor_medija} autoPlay muted loop playsInline onEnded={(e) => e.target.play()} className="w-full h-full object-cover" />
                )}
                <div className="absolute inset-0 bg-linear-to-t from-[#03040b] to-transparent opacity-60"></div>
              </div>

              {/* SADRŽAJ KARTICE */}
              <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-white uppercase mb-4 tracking-tight">{projekat.naslov}</h3>
                <p className="text-blue-100/60 leading-relaxed font-light mb-6 text-sm line-clamp-3">{projekat.opis}</p>
                
                {/* DODAJEMO BEDŽEVE ZA TEHNOLOGIJE */}
                <div className="flex flex-wrap gap-2 mt-auto mb-8">
                   {projekat.tehnologija?.split(',').map((tech) => (
                     <span key={tech} className="px-3 py-1 bg-white/5 rounded-full border border-white/10 text-[9px] text-cyan-400 font-bold uppercase tracking-widest">
                       {tech.trim()}
                     </span>
                   ))}
                </div>

                <Link to={`/project/${projekat.id}`} className="flex items-center text-cyan-400 text-[10px] font-black tracking-[0.2em] uppercase cursor-pointer group-hover:text-white transition-colors border-t border-white/5 pt-6">
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