import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../supabaseClient';
import ProjectDetails from './ProjectDetails';

const Projects = () => {
  const [projekti, setProjekti] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    const fetchProjekti = async () => {
      const { data } = await supabase.from('projects').select('*').order('id', { ascending: false });
      if (data) setProjekti(data);
    };
    fetchProjekti();
  }, []);

  return (
    <section id="projects" className="py-32 bg-[#020617] text-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-4xl font-black uppercase mb-16">
          AI <span className="text-cyan-500">Projects</span>
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {projekti.map((project) => (
            <motion.div key={project.id} whileHover={{ y: -10 }} className="cursor-pointer" onClick={() => setSelectedProject(project)}>
              <img src={project.slika_url} className="h-64 w-full object-cover rounded-2xl" alt="" />
              <h3 className="font-bold mt-4">{project.naslov}</h3>
            </motion.div>
          ))}
        </div>
      </div>
      {selectedProject && <ProjectDetails project={selectedProject} onClose={() => setSelectedProject(null)} />}
    </section>
  );
};
export default Projects;