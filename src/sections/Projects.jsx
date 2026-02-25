import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../supabaseClient';
import ProjectDetails from './ProjectDetails';

const Projects = () => {
  const [projekti, setProjekti] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    const fetchProjekti = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('id', { ascending: false });
      
      if (!error) setProjekti(data);
    };
    fetchProjekti();
  }, []);

  return (
    <section id="projects" className="py-32 bg-[#020617] text-white">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Animiran naslov - Da VS Code vidi da koristimo motion */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-4xl font-black tracking-tighter uppercase italic">
            AI <span className="text-cyan-500">Projects</span>
          </h2>
          <div className="h-1 w-20 bg-cyan-500 mt-2"></div>
        </motion.div>

        {/* Grid sa projektima */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {projekti.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group cursor-pointer"
              onClick={() => setSelectedProject(project)}
            >
              <div className="relative overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 transition-all group-hover:border-cyan-500/50">
                <div className="h-64 overflow-hidden">
                  <img 
                    src={project.slika_url} 
                    alt="" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                  />
                </div>
                <div className="p-6 text-left">
                  <h3 className="text-lg font-bold uppercase mb-2">{project.naslov}</h3>
                  <p className="text-slate-500 text-xs line-clamp-2 mb-4 leading-relaxed">
                    {project.opis}
                  </p>
                  <span className="text-[10px] font-mono text-cyan-500 uppercase tracking-widest">
                    View Research Detail +
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal za detalje */}
      {selectedProject && (
        <ProjectDetails 
          project={selectedProject} 
          onClose={() => setSelectedProject(null)} 
        />
      )}
    </section>
  );
};

export default Projects;