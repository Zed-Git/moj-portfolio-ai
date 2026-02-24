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

  // 1. Definišemo funkciju za učitavanje projekata pre useEffect-a
  const fetchProjects = async () => {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .order('id', { ascending: false });
    if (data) setProjekti(data);
  };

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
      <div className="min-h-screen bg-black flex items-center justify-center p-6 text-white font-sans text-left">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-900 p-10 rounded-3xl border border-white/10 w-full max-w-md shadow-2xl">
          <h2 className="text-2xl font-black mb-8 uppercase tracking-widest italic text-center text-white">ZED <span className="text-cyan-500 font-bold">ADMIN</span></h2>
          <div className="space-y-4">
            <input 
              type="email" placeholder="Email" className="w-full p-4 bg-black border border-white/10 rounded-xl text-white outline-none focus:border-cyan-500 transition-all"
              value={email} onChange={(e) => setEmail(e.target.value)}
            />
            <input 
              type="password" placeholder="Password" className="w-full p-4 bg-black border border-white/10 rounded-xl text-white outline-none focus:border-cyan-500 transition-all"
              value={password} onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin} className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-black rounded-xl transition-all uppercase tracking-widest">
              {loading ? <FaSpinner className="animate-spin mx-auto text-xl" /> : 'Enter System'}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 text-left font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-16 border-b border-white/10 pb-8">
          <h1 className="text-3xl font-black italic tracking-widest uppercase">
            Admin <span className="text-cyan-500 italic">Panel</span>
          </h1>
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 rounded-lg font-bold text-xs uppercase tracking-widest border border-red-500/20 transition-all hover:bg-red-500 hover:text-white">
            <FaSignOutAlt /> Sign Out
          </button>
        </header>

        {/* PROJEKTI INVENTORY */}
        <section className="mb-24">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-xl font-bold text-cyan-400 uppercase tracking-widest italic">Projects Inventory</h2>
            <button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-cyan-600 p-3 rounded-full hover:scale-110 transition-all shadow-lg shadow-cyan-500/20 text-white"
            >
              {showAddForm ? <FaTimes /> : <FaPlus />}
            </button>
          </div>

          <AnimatePresence>
            {showAddForm && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mb-12"
              >
                <div className="bg-white/5 p-8 rounded-3xl border border-cyan-500/30 mb-8">
                  <h3 className="text-lg font-bold mb-6 text-white uppercase italic">Add New Medical Project</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input type="text" placeholder="Project Title" className="bg-black border border-white/10 p-4 rounded-xl outline-none focus:border-cyan-500" />
                    <input type="text" placeholder="Description" className="bg-black border border-white/10 p-4 rounded-xl outline-none focus:border-cyan-500" />
                    <div className="md:col-span-2">
                      <button className="px-10 py-3 bg-cyan-600 rounded-xl font-bold uppercase text-xs tracking-widest transition-all hover:bg-cyan-500">Upload & Save</button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            {projekti.map((proj) => (
              <motion.div 
                key={proj.id} 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                whileHover={{ y: -5 }}
                className="bg-white/5 p-6 rounded-2xl border border-white/10 flex flex-col justify-between hover:border-cyan-500/50 transition-all group min-h-[160px]"
              >
                <div>
                   <span className="text-[10px] text-cyan-500 font-mono mb-2 block uppercase tracking-tighter">Record ID: {proj.id}</span>
                   <p className="font-bold text-sm uppercase tracking-tight text-slate-200 group-hover:text-white transition-colors">{proj.naslov}</p>
                   <p className="text-[11px] text-slate-500 mt-2 line-clamp-2 font-light">{proj.opis}</p>
                </div>
                <div className="flex justify-end gap-4 mt-6 text-slate-500 border-t border-white/5 pt-4">
                  <FaEdit className="hover:text-cyan-400 cursor-pointer text-lg transition-colors" />
                  <FaTrash className="hover:text-red-500 cursor-pointer text-lg transition-colors" />
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* DYNAMIC CONTENT EDITOR */}
        <section className="mt-20 pt-20 border-t border-white/5">
          <h2 className="text-xl font-bold text-cyan-400 uppercase tracking-widest mb-10 italic">Global Site Content</h2>
          <AdminAboutEditor />
        </section>
      </div>
    </div>
  );
};

export default AdminPanel;