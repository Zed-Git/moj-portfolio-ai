import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion'; // motion je ovde!
import { FaEdit, FaTrash, FaPlus, FaSignOutAlt, FaTimes } from 'react-icons/fa';
import AdminAboutEditor from '../components/admin/AdminAboutEditor';

const AdminPanel = () => {
  const [projekti, setProjekti] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  const [newProject, setNewProject] = useState({
    naslov: '',
    opis: '',
    tehnologija: '',
    slika_url: ''
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    // motion.div se sada koristi ovde da bi VS Code bio srećan!
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#020617] text-white p-6 md:p-10 pt-32 font-sans relative z-10"
    >
      <header className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
        <div>
          <h1 className="text-3xl font-black bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent tracking-tighter">
            ZED ADMIN <span className="text-white/20">|</span> CONTROL
          </h1>
          <p className="text-slate-500 text-[10px] font-mono mt-1 uppercase tracking-widest">Surgical Precision Management</p>
        </div>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 bg-slate-900 border border-slate-800 hover:border-red-500/50 hover:text-red-400 text-slate-400 px-6 py-2 rounded-full transition-all text-sm"
        >
          <FaSignOutAlt size={14} /> Odjavi se
        </button>
      </header>

      <main className="max-w-6xl mx-auto space-y-24">
        
        {/* SECTION: ABOUT EDITOR */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px grow bg-slate-800"></div> {/* Koristimo h-px i grow po savetu VSC-a */}
            <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-500">About Management</h2>
            <div className="h-px grow bg-slate-800"></div>
          </div>
          <div className="bg-slate-900/20 border border-slate-800/50 p-8 rounded-4xl backdrop-blur-sm"> {/* rounded-4xl umesto [2rem] */}
             <AdminAboutEditor />
          </div>
        </section>

        {/* SECTION: PROJECTS */}
        <section>
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-blue-500">Project Lab</h2>
            <button 
              onClick={() => setIsFormOpen(!isFormOpen)}
              className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold text-sm transition-all ${isFormOpen ? 'bg-red-500/20 text-red-500 border border-red-500/50' : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-900/20'}`}
            >
              {isFormOpen ? <><FaTimes /> Close</> : <><FaPlus /> New Project</>}
            </button>
          </div>

          <AnimatePresence>
            {isFormOpen && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="mb-16 bg-slate-900/40 border border-cyan-500/20 p-8 rounded-3xl"
              >
                <form onSubmit={handleAddProject} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-5">
                    <input 
                      type="text" placeholder="Project Title" required
                      className="w-full bg-slate-950/50 border border-slate-800 p-4 rounded-xl focus:border-cyan-500 outline-none text-sm transition-all"
                      value={newProject.naslov}
                      onChange={(e) => setNewProject({...newProject, naslov: e.target.value})}
                    />
                    <textarea 
                      placeholder="Project Description..." required rows="5"
                      className="w-full bg-slate-950/50 border border-slate-800 p-4 rounded-xl focus:border-cyan-500 outline-none text-sm transition-all"
                      value={newProject.opis}
                      onChange={(e) => setNewProject({...newProject, opis: e.target.value})}
                    />
                  </div>
                  <div className="space-y-5 flex flex-col">
                    <input 
                      type="text" placeholder="Technologies"
                      className="w-full bg-slate-950/50 border border-slate-800 p-4 rounded-xl focus:border-cyan-500 outline-none text-sm transition-all"
                      value={newProject.tehnologija}
                      onChange={(e) => setNewProject({...newProject, tehnologija: e.target.value})}
                    />
                    <input 
                      type="text" placeholder="Image URL"
                      className="w-full bg-slate-950/50 border border-slate-800 p-4 rounded-xl focus:border-cyan-500 outline-none text-sm transition-all"
                      value={newProject.slika_url}
                      onChange={(e) => setNewProject({...newProject, slika_url: e.target.value})}
                    />
                    <button type="submit" className="mt-auto w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded-xl transition-all shadow-xl uppercase tracking-widest text-xs">
                      Save to Database
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* PROJECT LIST */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projekti.map((proj) => (
              <div key={proj.id} className="bg-slate-900/30 border border-slate-800/50 rounded-2xl overflow-hidden group">
                <div className="h-40 bg-slate-800 relative">
                  {proj.slika_url && <img src={proj.slika_url} alt="" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700" />}
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-white text-sm uppercase mb-2">{proj.naslov}</h3>
                  <p className="text-slate-500 text-[11px] line-clamp-2 min-h-12 mb-4 leading-relaxed">{proj.opis}</p> {/* min-h-12 umesto [48px] */}
                  <div className="flex justify-between items-center pt-4 border-t border-slate-800/50">
                     <span className="text-[9px] text-slate-600 font-mono italic">{proj.tehnologija}</span>
                     <div className="flex gap-4">
                        <button className="text-slate-500 hover:text-cyan-400 cursor-pointer"><FaEdit size={14} /></button>
                        <button onClick={() => handleDelete(proj.id)} className="text-slate-500 hover:text-red-500 cursor-pointer"><FaTrash size={14} /></button>
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