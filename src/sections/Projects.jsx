import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const Projects = () => {
  const [projektiIzBaze, setProjektiIzBaze] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Definišemo funkciju PRVO, pre useEffect-a (Medical Protocol)
  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('id', { ascending: true });
      
      if (error) throw error;
      if (data) setProjektiIzBaze(data);
    } catch (err) {
      console.error("Greška:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  if (loading) return <div className="py-24 text-center text-cyan-500 animate-pulse uppercase tracking-widest text-xs">Učitavanje kardioloških studija...</div>;

  return (
    <section id="projects" className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-black text-white mb-16 text-center uppercase tracking-[0.2em] italic">
          AI <span className="text-cyan-500">Projects</span>
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
          {projektiIzBaze.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-white/5 rounded-3xl overflow-hidden border border-white/10 hover:border-cyan-500/50 transition-all duration-500"
            >
              <Link to={`/project/${project.id}`}>
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={project.slika_url} 
                    alt={project.naslov}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-bold text-white mb-3 uppercase tracking-tight">{project.naslov}</h3>
                  <p className="text-slate-400 text-sm font-light leading-relaxed line-clamp-3">{project.opis}</p>
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