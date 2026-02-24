import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { motion } from 'framer-motion';
import { FaEdit, FaTrash, FaSpinner, FaPlus, FaSignOutAlt } from 'react-icons/fa';
import AdminAboutEditor from '../components/admin/AdminAboutEditor.jsx';

const AdminPanel = () => {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [projekti, setProjekti] = useState([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    fetchProjects();
    return () => subscription.unsubscribe();
  }, []);

  const fetchProjects = async () => {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setProjekti(data);
  };

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

  if (!session) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6 text-white">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          className="bg-slate-900 p-10 rounded-3xl border border-white/10 w-full max-w-md shadow-2xl"
        >
          <h2 className="text-2xl font-black mb-8 uppercase tracking-widest italic text-center">
            Zed <span className="text-cyan-500 font-bold">Admin</span>
          </h2>
          <div className="space-y-4">
            <input 
              type="email" placeholder="Email" 
              className="w-full p-4 bg-black border border-white/10 rounded-xl text-white focus:border-cyan-500 outline-none transition-all"
              value={email} onChange={(e) => setEmail(e.target.value)}
            />
            <input 
              type="password" placeholder="Lozinka" 
              className="w-full p-4 bg-black border border-white/10 rounded-xl text-white focus:border-cyan-500 outline-none transition-all"
              value={password} onChange={(e) => setPassword(e.target.value)}
            />
            <button 
              onClick={handleLogin} 
              className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-black rounded-xl transition-all uppercase tracking-widest"
            >
              {loading ? <FaSpinner className="animate-spin mx-auto text-xl" /> : 'Enter'}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 text-left">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-16 border-b border-white/10 pb-8">
          <h1 className="text-3xl font-black italic tracking-widest uppercase">
            Admin <span className="text-cyan-500">Dashboard</span>
          </h1>
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-lg transition-all text-xs font-bold uppercase tracking-widest border border-red-500/20">
            <FaSignOutAlt /> Sign Out
          </button>
        </header>

        {/* SEKCIJA ZA PROJEKTE */}
        <section className="mb-24">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-cyan-400 uppercase tracking-widest italic">Projects Inventory</h2>
            <button className="bg-cyan-600 p-3 rounded-full hover:scale-110 transition-all shadow-lg shadow-cyan-500/20 text-white">
              <FaPlus />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projekti.map((proj) => (
              <motion.div 
                key={proj.id} 
                whileHover={{ y: -5 }}
                className="bg-white/5 p-6 rounded-2xl border border-white/10 flex justify-between items-center hover:border-cyan-500/50 transition-all"
              >
                <span className="text-sm font-medium text-slate-300 uppercase truncate pr-4">{proj.naslov}</span>
                <div className="flex gap-4 text-slate-500">
                  <FaEdit className="hover:text-cyan-400 cursor-pointer transition-colors text-lg" />
                  <FaTrash className="hover:text-red-500 cursor-pointer transition-colors text-lg" />
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* SEKCIJA ZA ABOUT TEKST */}
        <section className="mt-20 pt-20 border-t border-white/5">
          <h2 className="text-xl font-bold text-cyan-400 uppercase tracking-widest mb-10 italic">Global Site Content</h2>
          <AdminAboutEditor />
        </section>
      </div>
    </div>
  );
};

export default AdminPanel;