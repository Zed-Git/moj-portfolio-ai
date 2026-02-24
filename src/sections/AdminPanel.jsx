import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEdit, FaTrash, FaSpinner, FaPlus, FaSignOutAlt, FaTimes } from 'react-icons/fa';
import AdminAboutEditor from '../components/admin/AdminAboutEditor.jsx';

const AdminPanel = () => {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [projekti, setProjekti] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);

  // 1. Provera logovanja i učitavanje projekata
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    const fetchProjects = async () => {
      const { data } = await supabase
        .from('projects')
        .select('*')
        .order('id', { ascending: false });
      if (data) setProjekti(data);
    };

    fetchProjects();

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert("Greška: " + error.message);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  // --- EKRAN ZA LOGOVANJE (LOGIN DASHBOARD) ---
  if (!session) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6 text-white font-sans">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-900 p-10 rounded-3xl border border-white/10 w-full max-w-md">
          <h2 className="text-2xl font-black mb-8 uppercase tracking-widest italic text-center">Zed Admin</h2>
          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="text-xs text-slate-400 uppercase ml-1">Email adresa</label>
              <input 
                type="email" className="w-full p-4 bg-black border border-white/10 rounded-xl text-white outline-none focus:border-cyan-500 transition-all"
                value={email} onChange={(e) => setEmail(e.target.value)} required
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 uppercase ml-1">Lozinka</label>
              <input 
                type="password" className="w-full p-4 bg-black border border-white/10 rounded-xl text-white outline-none focus:border-cyan-500 transition-all"
                value={password} onChange={(e) => setPassword(e.target.value)} required
              />
            </div>
            <button type="submit" className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-black rounded-xl transition-all uppercase tracking-widest pt-5">
              {loading ? <FaSpinner className="animate-spin mx-auto text-xl" /> : 'Prijavi se'}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // --- GLAVNI ADMIN DASHBOARD (PUNE FUNKCIJE) ---
  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 text-left font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-16 border-b border-white/10 pb-8">
          <h1 className="text-3xl font-black italic tracking-widest uppercase">
            Admin <span className="text-cyan-500">Dashboard</span>
          </h1>
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 rounded-lg font-bold text-xs uppercase tracking-widest border border-red-500/20 transition-all hover:bg-red-500 hover:text-white">
            <FaSignOutAlt /> Sign Out
          </button>
        </header>

        {/* PROJEKTI INVENTORY */}
        <section className="mb-24 text-left">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-xl font-bold text-cyan-400 uppercase tracking-widest italic text-left">Projects Inventory</h2>
            <button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-cyan-600 p-3 rounded-full hover:scale-110 transition-all text-white"
            >
              {showAddForm ? <FaTimes /> : <FaPlus />}
            </button>
          </div>

          <AnimatePresence>
            {showAddForm && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="bg-white/5 p-8 rounded-3xl border border-cyan-500/30 mb-12 overflow-hidden"
              >
                <h3 className="text-lg font-bold mb-6 uppercase italic">Dodaj novi medicinski projekat</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input type="text" placeholder="Naslov projekta" className="bg-black border border-white/10 p-4 rounded-xl outline-none focus:border-cyan-500" />
                  <input type="text" placeholder="Kratak opis" className="bg-black border border-white/10 p-4 rounded-xl outline-none focus:border-cyan-500" />
                  <div className="md:col-span-2">
                    <button className="px-10 py-3 bg-cyan-600 rounded-xl font-bold uppercase text-xs tracking-widest">Sačuvaj Projekat</button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projekti.map((proj) => (
              <motion.div 
                key={proj.id} 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="bg-white/5 p-6 rounded-2xl border border-white/10 flex flex-col justify-between hover:border-cyan-500/30 transition-all group min-h-[160px]"
              >
                <div>
                  <span className="text-[10px] text-cyan-500 font-mono mb-2 block italic uppercase tracking-widest">Record ID: {proj.id}</span>
                  <p className="font-bold text-sm uppercase tracking-tight text-white mb-2">{proj.naslov}</p>
                  <p className="text-xs text-slate-500 line-clamp-2">{proj.opis}</p>
                </div>
                <div className="flex justify-end gap-4 mt-6 text-slate-500 border-t border-white/5 pt-4">
                  <FaEdit className="hover:text-cyan-400 cursor-pointer text-lg transition-colors" />
                  <FaTrash className="hover:text-red-500 cursor-pointer text-lg transition-colors" />
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* SITE CONTENT EDITOR */}
        <section className="mt-20 pt-20 border-t border-white/5 text-left">
          <h2 className="text-xl font-bold text-cyan-400 uppercase tracking-widest mb-10 italic">Global Site Content</h2>
          <AdminAboutEditor />
        </section>
      </div>
    </div>
  );
};

export default AdminPanel;