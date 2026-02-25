import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; 
import { motion, AnimatePresence } from 'framer-motion'; 
import { FaEdit, FaTrash, FaSignOutAlt, FaCloudUploadAlt, FaLock } from 'react-icons/fa';
import AdminAboutEditor from '../components/admin/AdminAboutEditor';

const AdminPanel = () => {
  const [session, setSession] = useState(null);
  const [projekti, setProjekti] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [newProject, setNewProject] = useState({
    naslov: '', opis: '', tehnologija: '', slika_url: ''
  });

  // 1. PROVERA SESIJE (DA LI JE KORISNIK LOGOVAN)
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchProjekti();
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchProjekti();
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProjekti = async () => {
    const { data, error } = await supabase.from('projects').select('*').order('id', { ascending: false });
    if (!error) setProjekti(data || []);
  };

  // 2. LOGIKA ZA LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert("Greška pri prijavi: " + error.message);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
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
    if (window.confirm("Brisanje je trajno?")) {
      await supabase.from('projects').delete().eq('id', id);
      fetchProjekti();
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center font-mono text-cyan-500 animate-pulse text-xs uppercase">
      Checking Authorization...
    </div>
  );

  return (
    <AnimatePresence mode="wait">
      {!session ? (
        // --- EKRAN 1: MEDICAL AUTH (LOGIN) ---
        <motion.div 
          key="login"
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="min-h-screen bg-[#020617] flex items-center justify-center p-6"
        >
          <div className="bg-[#0f172a] border border-slate-800 p-10 rounded-4xl w-full max-w-md shadow-2xl text-center">
            <div className="inline-flex p-4 bg-cyan-500/10 rounded-full mb-6 text-cyan-500">
              <FaLock size={30} />
            </div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-8">Medical Auth</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <input 
                type="email" placeholder="Vaš Email" required
                className="w-full bg-[#1e293b] text-white p-4 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500 transition-all font-bold"
                value={email} onChange={(e) => setEmail(e.target.value)}
              />
              <input 
                type="password" placeholder="Lozinka" required
                className="w-full bg-[#1e293b] text-white p-4 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500 transition-all font-bold"
                value={password} onChange={(e) => setPassword(e.target.value)}
              />
              <button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-black py-4 rounded-xl transition-all uppercase tracking-widest text-sm shadow-lg shadow-cyan-500/20">
                Pristupi Dashboard-u
              </button>
            </form>
          </div>
        </motion.div>
      ) : (
        // --- EKRAN 2: ADMIN DASHBOARD (PUNA FORMA) ---
        <motion.div 
          key="dashboard"
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          className="min-h-screen bg-[#020617] text-white p-4 md:p-10 pt-28"
        >
          <div className="max-w-5xl mx-auto">
            {/* Header sa Logout-om */}
            <div className="flex justify-between items-center mb-10">
              <h1 className="text-3xl font-black text-cyan-500 uppercase italic">Admin Panel</h1>
              <button onClick={handleLogout} className="bg-red-900/20 text-red-500 border border-red-500/30 px-4 py-2 rounded-lg text-xs font-bold uppercase"><FaSignOutAlt /> Odjavi se</button>
            </div>

            {/* Forma za projekat */}
            <section className="mb-20 bg-[#0f172a] border border-slate-800 p-8 rounded-4xl">
               <form onSubmit={handleAddProject} className="space-y-6">
                  <input type="text" placeholder="Naslov" required className="w-full bg-white text-black p-4 rounded-xl font-bold" value={newProject.naslov} onChange={(e) => setNewProject({...newProject, naslov: e.target.value})} />
                  <input type="text" placeholder="Kratak opis" className="w-full bg-white text-black p-4 rounded-xl font-bold" value={newProject.tehnologija} onChange={(e) => setNewProject({...newProject, tehnologija: e.target.value})} />
                  <textarea placeholder="Stručni tekst" required rows="6" className="w-full bg-white text-black p-4 rounded-xl font-bold" value={newProject.opis} onChange={(e) => setNewProject({...newProject, opis: e.target.value})} />
                  <input type="text" placeholder="URL Slike" className="w-full bg-slate-800 p-4 rounded-xl" value={newProject.slika_url} onChange={(e) => setNewProject({...newProject, slika_url: e.target.value})} />
                  <button type="submit" className="w-full bg-cyan-500 text-black font-black py-5 rounded-2xl uppercase tracking-widest">Objavi novi rad</button>
               </form>
            </section>

            {/* About Editor */}
            <section className="mb-20">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-px grow bg-slate-800"></div>
                <h2 className="text-xs font-bold uppercase text-cyan-500 italic">About Section</h2>
                <div className="h-px grow bg-slate-800"></div>
              </div>
              <AdminAboutEditor />
            </section>

            {/* Lista radova */}
            <section className="pb-20">
              <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6">Lista radova</h2>
              <div className="space-y-4">
                {projekti.map((proj) => (
                  <div key={proj.id} className="bg-[#0f172a] border border-slate-800 p-6 rounded-2xl flex justify-between items-center">
                    <h3 className="text-white font-bold uppercase text-sm">{proj.naslov}</h3>
                    <div className="flex gap-4">
                      <button className="bg-slate-800 p-3 rounded-xl text-slate-400"><FaEdit /></button>
                      <button onClick={() => handleDelete(proj.id)} className="bg-slate-800 p-3 rounded-xl text-slate-400 hover:text-red-500"><FaTrash /></button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AdminPanel;