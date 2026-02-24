import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const Projects = () => {
  const [projektiIzBaze, setProjektiIzBaze] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase.from('projects').select('*').order('id', { ascending: false });
        if (error) throw error;
        setProjektiIzBaze(data || []);
      } catch (err) {
        console.error("Greška:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (loading) return <div className="py-24 text-center text-cyan-500 animate-pulse uppercase tracking-widest text-[10px] font-black">Učitavanje kardiološke baze...</div>;

  return (
    <section id="projects" className="py-24 bg-black font-sans text-left">
      <div className="max-w-7xl mx-auto px-6 text-left">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          className="text-4xl font-black text-white mb-16 text-center uppercase tracking-[0.2em] italic"
        >
          AI <span className="text-cyan-500 italic">Projects</span>
        </motion.h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 text-left text-white">
          {projektiIzBaze.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-white/5 rounded-[40px] overflow-hidden border border-white/10 hover:border-cyan-500/50 transition-all duration-700 text-left"
            >
              <Link to={`/project/${project.id}`}>
                <div className="aspect-video overflow-hidden bg-slate-900 text-left">
                  {project.slika_url ? (
                    <img src={project.slika_url} alt={project.naslov} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110 text-left" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-700 uppercase text-[10px] tracking-widest italic text-left">No image record</div>
                  )}
                </div>
                <div className="p-10 text-left">
                  <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-tight text-left leading-tight">{project.naslov}</h3>
                  <p className="text-slate-400 text-sm font-light leading-relaxed line-clamp-3 text-left">{project.opis}</p>
                  <div className="mt-6 flex items-center text-[10px] font-black text-cyan-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all">
                     View Clinical Case +
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;