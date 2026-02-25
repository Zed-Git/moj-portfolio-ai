import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; 
import { motion, AnimatePresence } from 'framer-motion'; 
import { FaEdit, FaTrash, FaSignOutAlt, FaPlus, FaCloudUploadAlt } from 'react-icons/fa';
import AdminAboutEditor from '../components/admin/AdminAboutEditor';

const AdminPanel = () => {
  const [projekti, setProjekti] = useState([]);
  const [loading, setLoading] = useState(true);
  
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
      fetchProjekti();
      alert("Novi rad je uspešno objavljen!");
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
      <div className="min-h-screen bg-[#020617] flex items-center justify-center font-mono text-cyan-500 animate-pulse text-xs uppercase tracking-widest">
        Syncing Medical Records...
      </div>
    );
  }

  return (
    // Koristimo 'motion' ovde da očistimo VSC grešku
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#020617] text-white p-4 md:p-10 pt-28 font-sans"
    >
      <div className="max-w-5xl mx-auto">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-black text-cyan-500 tracking-tighter uppercase italic">
            Admin <span className="text-white">Dashboard</span>
          </h1>
          <button 
            onClick={() => supabase.auth.signOut().then(() => window.location.reload())}
            className="flex items-center gap-2 bg-red-900/20 text-red-500 border border-red-500/30 px-4 py-1.5 rounded-lg hover:bg-red-500 hover:text-white transition-all text-xs font-bold uppercase"
          >
            <FaSignOutAlt /> Odjavi se
          </button>
        </div>

        {/* SEKCIJA 1: FORMA ZA NOVI PROJEKAT (STARI DIZAJN - Image 2) */}
        <section className="mb-20">
          <div className="bg-[#0f172a] border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl">
            <form onSubmit={handleAddProject} className="space-y-6">
              <input 
                type="text" placeholder="Naslov" required
                className="w-full bg-white text-black p-4 rounded-xl font-bold placeholder:text-slate-400 outline-none border-4 border-transparent focus:border-cyan-500 transition-all"
                value={newProject.naslov}
                onChange={(e) => setNewProject({...newProject, naslov: e.target.value})}
              />
              
              <input 
                type="text" placeholder="Kratak opis"
                className="w-full bg-white text-black p-4 rounded-xl font-bold placeholder:text-slate-400 outline-none focus:border-cyan-500 transition-all"
                value={newProject.tehnologija} 
                onChange={(e) => setNewProject({...newProject, tehnologija: e.target.value})}
              />

              <textarea 
                placeholder="Stručni tekst" required rows="6"
                className="w-full bg-white text-black p-4 rounded-xl font-bold placeholder:text-slate-400 outline-none focus:border-cyan-500 transition-all"
                value={newProject.opis}
                onChange={(e) => setNewProject({...newProject, opis: e.target.value})}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="Tehnologije" className="bg-white text-black p-4 rounded-xl font-bold" />
                <div className="bg-white text-black p-4 rounded-xl font-bold flex justify-between items-center">
                  <span>Slika</span>
                  <select className="bg-transparent outline-none cursor-pointer"><option>Izaberi...</option></select>
                </div>
              </div>

              <div className="border-2 border-dashed border-cyan-500/30 rounded-xl p-8 text-center bg-cyan-500/5 hover:bg-cyan-500/10 transition-all cursor-pointer">
                <div className="flex flex-col items-center gap-2">
                  <FaCloudUploadAlt size={30} className="text-cyan-500" />
                  <span className="text-cyan-500 font-black uppercase text-xs">Choose File</span>
                  <span className="text-slate-500 text-[10px]">No file selected</span>
                </div>
              </div>

              <input 
                type="text" placeholder="URL Slike"
                className="w-full bg-slate-800 text-white p-4 rounded-xl outline-none focus:border-cyan-500 transition-all"
                value={newProject.slika_url}
                onChange={(e) => setNewProject({...newProject, slika_url: e.target.value})}
              />

              <button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-black py-5 rounded-2xl transition-all uppercase tracking-widest text-sm shadow-lg shadow-cyan-500/20">
                Objavi novi rad
              </button>
            </form>
          </div>
        </section>

        {/* SEKCIJA 2: ABOUT SECTION EDITOR (Image 4) */}
        <section className="mb-20">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px grow bg-slate-800"></div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-500 italic">About Section</h2>
            <div className="h-px grow bg-slate-800"></div>
          </div>
          <div className="bg-[#0f172a]/50 border border-slate-800 p-8 rounded-[2rem] backdrop-blur-xl">
             <AdminAboutEditor />
          </div>
        </section>

        {/* SEKCIJA 3: LISTA RADOVA (Image 3) */}
        <section className="pb-20">
          <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em] mb-6 pl-4">Lista tvojih radova</h2>
          <div className="space-y-4">
            <AnimatePresence>
              {projekti.map((proj) => (
                <motion.div 
                  key={proj.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-[#0f172a] border border-slate-800 p-6 rounded-2xl flex justify-between items-center group hover:border-cyan-500/30 transition-all"
                >
                  <div>
                    <h3 className="text-white font-bold uppercase text-sm tracking-tight group-hover:text-cyan-400 transition-colors">
                      {proj.naslov}
                    </h3>
                  </div>
                  <div className="flex gap-4">
                    <button className="bg-slate-800 p-3 rounded-xl text-slate-400 hover:text-white transition-all"><FaEdit size={16} /></button>
                    <button onClick={() => handleDelete(proj.id)} className="bg-slate-800 p-3 rounded-xl text-slate-400 hover:text-red-500 transition-all"><FaTrash size={16} /></button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>

      </div>
    </motion.div>
  );
};

export default AdminPanel;