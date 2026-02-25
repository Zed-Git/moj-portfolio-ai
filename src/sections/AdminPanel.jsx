import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEdit, FaTrash, FaPlus, FaSignOutAlt, FaTimes } from 'react-icons/fa';
import AdminAboutEditor from '../components/admin/AdminAboutEditor';

const AdminPanel = () => {
  const [projekti, setProjekti] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // State za formu
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
    <div className="min-h-screen bg-[#020617] text-white p-4 md:p-10 font-sans">
      
      {/* HEADER - STILIZOVAN */}
      <header className="max-w-6xl mx-auto flex justify-between items-center mb-16">
        <div>
          <h1 className="text-4xl font-black bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent tracking-tighter">
            ZED ADMIN <span className="text-white/20">|</span> CONTROL
          </h1>
          <p className="text-slate-500 text-sm font-mono mt-1 uppercase tracking-widest">Surgical Precision Management</p>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 bg-slate-900 border border-slate-800 hover:border-red-500/50 hover:text-red-400 text-slate-400 px-5 py-2 rounded-xl transition-all shadow-2xl"
        >
          <FaSignOutAlt /> Odjavi se
        </button>
      </header>

      <main className="max-w-6xl mx-auto space-y-20">
        
        {/* SEKCIJA 1: ABOUT EDITOR (Dinamički tekst) */}
        <section className="relative group">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-1 w-12 bg-cyan-500 rounded-full"></div>
            <h2 className="text-xl font-bold uppercase tracking-widest text-cyan-500">About Section</h2>
          </div>
          <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-3xl backdrop-blur-xl">
             <AdminAboutEditor />
          </div>
        </section>

        {/* SEKCIJA 2: PROJEKTI */}
        <section>
          <div className="flex justify-between items-end mb-10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-1 w-12 bg-blue-500 rounded-full"></div>
                <h2 className="text-xl font-bold uppercase tracking-widest text-blue-500">Project Lab</h2>
              </div>
              <p className="text-slate-400 text-sm">Upravljajte svojim naučnim i AI portfoliom</p>
            </div>
            
            <button 
              onClick={() => setIsFormOpen(!isFormOpen)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${isFormOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-cyan-600 hover:bg-cyan-500 shadow-lg shadow-cyan-900/20'}`}
            >
              {isFormOpen ? <><FaTimes /> Odustani</> : <><FaPlus /> Novi Projekat</>}
            </button>
          </div>

          {/* FORMA ZA DODAVANJE (Pojavljuje se glatko) */}
          <AnimatePresence>
            {isFormOpen && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-16 bg-slate-900/60 border border-cyan-500/20 p-8 rounded-3xl"
              >
                <form onSubmit={handleAddProject} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <label className="text-xs uppercase tracking-widest text-slate-500 font-bold">Osnovni podaci</label>
                    <input 
                      type="text" placeholder="Naslov projekta" required
                      className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl focus:border-cyan-500 outline-none transition-all"
                      value={newProject.naslov}
                      onChange={(e) => setNewProject({...newProject, naslov: e.target.value})}
                    />
                    <textarea 
                      placeholder="Detaljan opis naučnog rada..." required rows="5"
                      className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl focus:border-cyan-500 outline-none transition-all"
                      value={newProject.opis}
                      onChange={(e) => setNewProject({...newProject, opis: e.target.value})}
                    />
                  </div>
                  <div className="space-y-4 flex flex-col">
                    <label className="text-xs uppercase tracking-widest text-slate-500 font-bold">Metadata & Slika</label>
                    <input 
                      type="text" placeholder="Tehnologije (npr. React, AI, Python)"
                      className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl focus:border-cyan-500 outline-none transition-all"
                      value={newProject.tehnologija}
                      onChange={(e) => setNewProject({...newProject, tehnologija: e.target.value})}
                    />
                    <input 
                      type="text" placeholder="URL Slike (Paste iz Supabase Storage)"
                      className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl focus:border-cyan-500 outline-none transition-all"
                      value={newProject.slika_url}
                      onChange={(e) => setNewProject({...newProject, slika_url: e.target.value})}
                    />
                    <div className="mt-auto pt-4">
                      <button type="submit" className="w-full bg-linear-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black py-4 rounded-xl transition-all tracking-widest">
                        SAČUVAJ U BAZU PODATAKA
                      </button>
                    </div>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* LISTA PROJEKATA - STARI IZGLED + NOVE FUNKCIJE */}
          {loading ? (
            <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projekti.map((proj) => (
                <motion.div 
                  key={proj.id}
                  layout
                  className="bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden hover:border-cyan-500/50 transition-all group"
                >
                  <div className="h-48 bg-slate-800 overflow-hidden relative">
                    {proj.slika_url ? (
                      <img src={proj.slika_url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100" />
                    ) : (
                      <div className="flex items-center justify-center h-full text-slate-600 font-mono text-xs uppercase tracking-widest">No Image Asset</div>
                    )}
                    <div className="absolute top-4 left-4 bg-slate-950/90 border border-cyan-500/30 px-3 py-1 rounded-full text-[10px] font-mono text-cyan-400">
                      ID: {proj.id}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="font-bold text-white uppercase tracking-tight mb-2 group-hover:text-cyan-400 transition-colors">{proj.naslov}</h3>
                    <p className="text-slate-400 text-xs line-clamp-3 min-h-[48px] leading-relaxed mb-6">{proj.opis}</p>
                    
                    <div className="flex justify-between items-center pt-4 border-t border-slate-800/50">
                       <span className="text-[10px] text-slate-600 font-mono uppercase italic">{proj.tehnologija || 'No Tech Stack'}</span>
                       <div className="flex gap-4">
                          <button className="text-slate-500 hover:text-cyan-400 transition-colors text-lg cursor-pointer"><FaEdit /></button>
                          <button onClick={() => handleDelete(proj.id)} className="text-slate-500 hover:text-red-500 transition-colors text-lg cursor-pointer"><FaTrash /></button>
                       </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default AdminPanel;