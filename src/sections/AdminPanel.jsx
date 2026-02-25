import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEdit, FaTrash, FaPlus, FaSignOutAlt, FaTimes, FaImage } from 'react-icons/fa';
import AdminAboutEditor from '../components/admin/AdminAboutEditor';

const AdminPanel = () => {
  const [projekti, setProjekti] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  // State za novi projekat
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
      const { error } = await supabase
        .from('projects')
        .insert([newProject]);

      if (error) throw error;
      
      alert("Projekat uspešno dodat!");
      setShowForm(false);
      setNewProject({ naslov: '', opis: '', tehnologija: '', slika_url: '' });
      fetchProjekti();
    } catch (error) {
      alert("Greška pri dodavanju: " + error.message);
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
    <div className="min-h-screen bg-[#020617] text-white p-4 md:p-8">
      {/* HEADER */}
      <div className="max-w-7xl mx-auto flex justify-between items-center mb-12 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-slate-400 text-sm mt-1">Status: Povezano sa Supabase bazom</p>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 bg-slate-800 hover:bg-red-900/40 text-slate-300 px-4 py-2 rounded-lg transition-all border border-slate-700">
          <FaSignOutAlt /> Odjavi se
        </button>
      </div>

      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* SEKCIJA: ABOUT */}
        <section className="bg-slate-900/30 p-6 rounded-2xl border border-slate-800">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-cyan-400">
            <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></span>
            Uređivanje "O meni" sekcije
          </h2>
          <AdminAboutEditor />
        </section>

        {/* SEKCIJA: PROJEKTI */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-semibold flex items-center gap-2 text-cyan-400">
              <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></span>
              Upravljanje Projektima
            </h2>
            <button 
              onClick={() => setShowForm(!showForm)}
              className={`flex items-center gap-2 px-5 py-2 rounded-full transition-all shadow-lg ${showForm ? 'bg-red-500 hover:bg-red-600' : 'bg-cyan-600 hover:bg-cyan-500'}`}
            >
              {showForm ? <><FaTimes /> Zatvori</> : <><FaPlus /> Dodaj projekat</>}
            </button>
          </div>

          {/* FORMA ZA DODAVANJE (POJAVLJUJE SE NA KLIK) */}
          <AnimatePresence>
            {showForm && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mb-12"
              >
                <form onSubmit={handleAddProject} className="bg-slate-900/50 border border-cyan-500/30 p-8 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <input 
                      type="text" placeholder="Naslov projekta" required
                      className="w-full bg-slate-800 border border-slate-700 p-3 rounded-lg focus:outline-none focus:border-cyan-500 transition-colors"
                      value={newProject.naslov}
                      onChange={(e) => setNewProject({...newProject, naslov: e.target.value})}
                    />
                    <textarea 
                      placeholder="Opis projekta" required rows="4"
                      className="w-full bg-slate-800 border border-slate-700 p-3 rounded-lg focus:outline-none focus:border-cyan-500 transition-colors"
                      value={newProject.opis}
                      onChange={(e) => setNewProject({...newProject, opis: e.target.value})}
                    />
                  </div>
                  <div className="space-y-4">
                    <input 
                      type="text" placeholder="Tehnologije (npr. React, AI, Python)"
                      className="w-full bg-slate-800 border border-slate-700 p-3 rounded-lg focus:outline-none focus:border-cyan-500 transition-colors"
                      value={newProject.tehnologija}
                      onChange={(e) => setNewProject({...newProject, tehnologija: e.target.value})}
                    />
                    <div className="relative">
                      <FaImage className="absolute left-3 top-4 text-slate-500" />
                      <input 
                        type="text" placeholder="URL Slike (iz Supabase Storage-a)"
                        className="w-full bg-slate-800 border border-slate-700 p-3 pl-10 rounded-lg focus:outline-none focus:border-cyan-500 transition-colors"
                        value={newProject.slika_url}
                        onChange={(e) => setNewProject({...newProject, slika_url: e.target.value})}
                      />
                    </div>
                    <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-cyan-900/20">
                      SAČUVAJ PROJEKAT
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* LISTA PROJEKATA */}
          {loading ? (
            <div className="text-center py-20 text-slate-500">Učitavanje...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projekti.map((proj) => (
                <motion.div 
                  key={proj.id} 
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden group hover:border-cyan-500/50 transition-all"
                >
                  <div className="h-44 bg-slate-800 relative">
                    {proj.slika_url && <img src={proj.slika_url} alt="" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />}
                    <div className="absolute top-3 left-3 bg-slate-950/80 px-2 py-1 rounded text-[10px] font-mono text-cyan-400 border border-cyan-500/30">
                      ID: {proj.id}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-white mb-2 uppercase tracking-tight">{proj.naslov}</h3>
                    <p className="text-slate-400 text-xs line-clamp-2 mb-6 min-h-[32px]">{proj.opis}</p>
                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-800/50">
                      <button className="text-slate-500 hover:text-cyan-400 transition-colors"><FaEdit /></button>
                      <button onClick={() => handleDelete(proj.id)} className="text-slate-500 hover:text-red-500 transition-colors"><FaTrash /></button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default AdminPanel;