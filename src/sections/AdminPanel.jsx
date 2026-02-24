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

  // 1. Provera sesije (da li si ulogovan)
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data } = await supabase.from('projects').select('*');
    if (data) setProjekti(data);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    else window.location.reload();
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  // AKO NISI ULOGOVAN - prikaži Login formu
  if (!session) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <form onSubmit={handleLogin} className="bg-slate-900 p-8 rounded-2xl border border-white/10 w-full max-w-md">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Admin Login</h2>
          <input 
            type="email" placeholder="Email" className="w-full p-3 mb-4 bg-black border border-white/10 rounded-lg text-white"
            value={email} onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type="password" placeholder="Lozinka" className="w-full p-3 mb-6 bg-black border border-white/10 rounded-lg text-white"
            value={password} onChange={(e) => setPassword(e.target.value)}
          />
          <button className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition-all">
            {loading ? 'PRIJAVLJIVANJE...' : 'ULAZ'}
          </button>
        </form>
      </div>
    );
  }

  // AKO SI ULOGOVAN - prikaži Dashboard
  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-black tracking-tighter italic">ADMIN <span className="text-cyan-500">DASHBOARD</span></h1>
          <button onClick={handleLogout} className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors">
            <FaSignOutAlt /> Odjavi se
          </button>
        </div>

        {/* SEKCIJA 1: PROJEKTI (Tvoje staro što se izgubilo) */}
        <section className="mb-20">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold uppercase tracking-widest text-cyan-400">Moji Projekti</h2>
            <button className="p-2 bg-cyan-600 rounded-full hover:scale-110 transition-transform">
              <FaPlus />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projekti.map((proj) => (
              <div key={proj.id} className="bg-white/5 p-4 rounded-xl border border-white/10 flex justify-between items-center">
                <span>{proj.naslov}</span>
                <div className="flex gap-3 text-slate-400">
                  <FaEdit className="hover:text-cyan-400 cursor-pointer" />
                  <FaTrash className="hover:text-red-500 cursor-pointer" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SEKCIJA 2: DINAMIČKI TEKST (Novo što smo dodali) */}
        <section className="border-t border-white/10 pt-16">
          <h2 className="text-xl font-bold uppercase tracking-widest text-cyan-400 mb-6 text-left">
            Upravljanje Sadržajem Sajta
          </h2>
          <AdminAboutEditor />
        </section>
      </div>
    </div>
  );
};

export default AdminPanel;