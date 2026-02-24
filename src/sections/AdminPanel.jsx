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
    // Provera da li postoji sesija
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Slušaj promene u logovanju
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    fetchProjects();
    return () => subscription.unsubscribe();
  }, []);

  const fetchProjects = async () => {
    const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    if (data) setProjekti(data);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert("Greška pri logovanju: " + error.message);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  // 1. EKRAN ZA LOGOVANJE
  if (!session) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-slate-900 p-8 rounded-2xl border border-white/10 w-full max-w-md text-center">
          <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-widest">Admin Pristup</h2>
          <input 
            type="email" placeholder="Email" 
            className="w-full p-3 mb-4 bg-black border border-white/10 rounded-lg text-white outline-none focus:border-cyan-500"
            value={email} onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type="password" placeholder="Lozinka" 
            className="w-full p-3 mb-6 bg-black border border-white/10 rounded-lg text-white outline-none focus:border-cyan-500"
            value={password} onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleLogin} className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition-all uppercase tracking-widest">
            {loading ? <FaSpinner className="animate-spin mx-auto" /> : 'Prijavi se'}
          </button>
        </motion.div>
      </div>
    );
  }

  // 2. GLAVNI DASHBOARD
  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-16">
          <h1 className="text-3xl font-black tracking-tighter italic uppercase text-white">
            Admin <span className="text-cyan-500">Panel</span>
          </h1>
          <button onClick={handleLogout} className="flex items-center gap-2 text-red-400 hover:text-red-500 transition-all font-bold uppercase text-xs tracking-widest">
            <FaSignOutAlt /> Odjavi se
          </button>
        </div>

        {/* PROJEKTI */}
        <section className="mb-20">
          <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
            <h2 className="text-xl font-bold text-cyan-400 uppercase tracking-widest">Moji Projekti</h2>
            <button className="bg-cyan-600 p-2 rounded-full hover:bg-cyan-500 transition-all">
              <FaPlus />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projekti.map((proj) => (
              <div key={proj.id} className="bg-white/5 p-6 rounded-2xl border border-white/10 flex justify-between items-center group hover:border-cyan-500/50 transition-all">
                <span className="font-medium text-slate-200 uppercase tracking-tight text-sm">{proj.naslov}</span>
                <div className="flex gap-4 text-slate-500">
                  <FaEdit className="hover:text-cyan-400 cursor-pointer transition-colors" />
                  <FaTrash className="hover:text-red-500 cursor-pointer transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SADRŽAJ SAJTA (ABOUT) */}
        <section className="mt-20">
          <h2 className="text-xl font-bold text-cyan-400 uppercase tracking-widest mb-8 border-b border-white/5 pb-4">
            Upravljanje Sadržajem Sajta
          </h2>
          <AdminAboutEditor />
        </section>
      </div>
    </div>
  );
};

export default AdminPanel;