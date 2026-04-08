import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../supabaseClient';
import ProjectDetails from './ProjectDetails';

const Projects = () => {
  const [projekti, setProjekti] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    const fetchProjekti = async () => {
      const { data, error } = await supabase.from('projects').select('*').order('id', { ascending: false });
      if (!error) setProjekti(data);
    };
    fetchProjekti();
  }, []);

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      id="projects" 
      className="pt-20 pb-32 bg-[#020617] text-white rounded-t-[60px] md:rounded-t-[100px] -mt-15 relative z-10"
    >
      <div className="max-w-7xl mx-auto px-10">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          className="mb-16"
        >
          <h2 className="text-4xl font-black tracking-tighter uppercase italic">
            AI <span className="text-cyan-500">Projects</span>
          </h2>
          <div className="h-1 w-20 bg-cyan-500 mt-2"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {projekti.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="group cursor-pointer bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:border-cyan-500/50 transition-all"
              onClick={() => setSelectedProject(project)}
            >
              <div className="h-64 overflow-hidden">
                <img
                  src={project.slika_url}
                  alt=""
                  className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-all duration-700"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="p-6 text-left">
                <h3 className="text-lg font-bold uppercase mb-2">{project.naslov}</h3>
                <span className="text-[10px] font-mono text-cyan-500 uppercase tracking-widest font-black">View Research +</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      {selectedProject && <ProjectDetails project={selectedProject} onClose={() => setSelectedProject(null)} />}
    </motion.section>
  );
};

export default Projects;