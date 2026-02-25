import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; 
import { motion, AnimatePresence } from 'framer-motion'; 
import { FaEdit, FaTrash, FaPlus, FaSignOutAlt, FaTimes } from 'react-icons/fa';
import AdminAboutEditor from '../components/admin/AdminAboutEditor';

const AdminPanel = () => {
  const [projekti, setProjekti] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  const [newProject, setNewProject] = useState({
    naslov: '', opis: '', tehnologija: '', slika_url: ''
  });

  useEffect(() => {
    fetchProjekti();
  }, []);

  const fetchProjekti = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('id', { ascending: false });
      if (error) throw error;
      setProjekti(data || []);
    } catch (error) {
      console.error('Greška:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('projects').insert([newProject]);
      if (error) throw error;
      setNewProject({ naslov: '', opis: '', tehnologija: '', slika_url: '' });
      setIsFormOpen(false);
      fetchProjekti();
      alert("Projekat uspešno dodat!");
    } catch (error) {
      alert("Greška: " + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Da li ste sigurni? Brisanje je trajno.")) {
      try {
        const { error } = await supabase.from('projects').delete().eq('id', id);
        if (error) throw error;
        setProjekti(projekti.filter(p => p.id !== id));
      } catch (error) {
        alert("Greška: " + error.message);
      }
    }
  };

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }}
        className="min-h-screen bg-[#020617] flex items-center justify-center"
      >
        <div className="text-cyan-500 font-mono animate-pulse tracking-widest uppercase text-xs">
          Synchronizing Medical Database...
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-[#020617] text-white p-6 md:p-10 pt-32 font-sans relative z-10"
    >
      <header className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center mb-16 gap-6 border-b border-slate-800/50 pb-8">
        <div>
          <h1 className="text-3xl font-black bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent tracking-tighter uppercase">
            Admin Lab
          </h1>
          <p className="text-slate-500 text-[10px] font-mono mt-1 uppercase tracking-widest">Precision Control Dashboard</p>
        </div>

        <button onClick={() => supabase.auth.signOut().then(() => window.location.reload())}
          className="flex items-center gap-2 bg-slate-900 border border-slate-800 hover:border-red-500/50 hover:text-red-400 text-slate-400 px-6 py-2 rounded-full transition-all text-sm"
        >
          <FaSignOutAlt size={14} /> Odjavi se
        </button>
      </header>

      <main className="max-w-6xl mx-auto space-y-24">
        <section>
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px grow bg-slate-800"></div>
            <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-500">About Management</h2>
            <div className="h-px grow bg-slate-800"></div>
          </div>
          <div className="bg-slate-900/20 border border-slate-800/50 p-8 rounded-4xl backdrop-blur-sm">
             <AdminAboutEditor />
          </div>
        </section>

        <section>
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-500">Project Repository</h2>
            <button 
              onClick={() => setIsFormOpen(!isFormOpen)}
              className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold text-sm transition-all ${isFormOpen ? 'bg-red-500/20 text-red-500 border border-red-500/50' : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg'}`}
            >
              {isFormOpen ? <><FaTimes /> Close</> : <><FaPlus /> New Project</>}
            </button>
          </div>

          <AnimatePresence>
            {isFormOpen && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mb-16 bg-slate-900/40 border border-cyan-500/20 p-8 rounded-3xl"
              >
                <form onSubmit={handleAddProject} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <input type="text" placeholder="Project Title" required className="bg-slate-950 p-4 rounded-xl border border-slate-800 outline-none focus:border-cyan-500 text-sm" value={newProject.naslov} onChange={(e) => setNewProject({...newProject, naslov: e.target.value})} />
                  <input type="text" placeholder="Tech Stack (React, AI...)" className="bg-slate-950 p-4 rounded-xl border border-slate-800 outline-none focus:border-cyan-500 text-sm" value={newProject.tehnologija} onChange={(e) => setNewProject({...newProject, tehnologija: e.target.value})} />
                  <textarea placeholder="Scientific Description" required rows="4" className="md:col-span-2 bg-slate-950 p-4 rounded-xl border border-slate-800 outline-none focus:border-cyan-500 text-sm" value={newProject.opis} onChange={(e) => setNewProject({...newProject, opis: e.target.value})} />
                  <input type="text" placeholder="Image URL from Storage" className="md:col-span-2 bg-slate-950 p-4 rounded-xl border border-slate-800 outline-none focus:border-cyan-500 text-sm" value={newProject.slika_url} onChange={(e) => setNewProject({...newProject, slika_url: e.target.value})} />
                  <button type="submit" className="md:col-span-2 bg-cyan-600 py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-cyan-500 transition-all text-xs">Save to Database</button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
            {projekti.map((proj) => (
              <div key={proj.id} className="bg-slate-900/30 border border-slate-800/50 rounded-3xl overflow-hidden group hover:border-cyan-500/30 transition-all">
                <div className="h-40 bg-slate-800 relative">
                  {proj.slika_url && <img src={proj.slika_url} alt="" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700" />}
                  <div className="absolute top-3 left-3 bg-slate-950/80 px-2 py-1 rounded font-mono text-[9px] text-cyan-500 border border-cyan-500/20">ID: {proj.id}</div>
                </div>
                <div className="p-6 text-left">
                  <h3 className="font-bold text-white text-sm uppercase mb-2 group-hover:text-cyan-400 transition-colors">{proj.naslov}</h3>
                  <p className="text-slate-500 text-[11px] line-clamp-2 min-h-12 leading-relaxed mb-6">{proj.opis}</p>
                  <div className="flex justify-between items-center pt-4 border-t border-slate-800/50">
                    <span className="text-[9px] text-slate-600 font-mono italic">{proj.tehnologija || 'Scientific Data'}</span>
                    <div className="flex gap-4">
                      <FaEdit className="text-slate-500 hover:text-cyan-400 cursor-pointer transition-colors" size={14} />
                      <FaTrash onClick={() => handleDelete(proj.id)} className="text-slate-500 hover:text-red-500 cursor-pointer transition-colors" size={14} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </motion.div>
  );
};

export default AdminPanel;