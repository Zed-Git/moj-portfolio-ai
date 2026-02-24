import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEdit, FaTrash, FaSpinner, FaPlus, FaSignOutAlt, FaTimes, FaCloudUploadAlt } from 'react-icons/fa';
import AdminAboutEditor from '../components/admin/AdminAboutEditor.jsx';

const AdminPanel = () => {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [projekti, setProjekti] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);

  const [naslov, setNaslov] = useState('');
  const [opis, setOpis] = useState('');
  const [file, setFile] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
    fetchProjects();
    return () => subscription.unsubscribe();
  }, []);

  const fetchProjects = async () => {
    const { data } = await supabase.from('projects').select('*').order('id', { ascending: false });
    if (data) setProjekti(data);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert("Greška: " + error.message);
    setLoading(false);
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let slikaUrl = '';
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('media').upload(fileName, file);
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from('media').getPublicUrl(fileName);
        slikaUrl = data.publicUrl;
      }
      const { error } = await supabase.from('projects').insert([{ naslov, opis, slika_url: slikaUrl }]);
      if (error) throw error;
      alert("Projekat dodat!");
      setNaslov(''); setOpis(''); setFile(null); setShowAddForm(false);
      fetchProjects();
    } catch (err) { alert(err.message); }
    setLoading(false);
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-900 p-10 rounded-3xl border border-white/10 w-full max-w-md shadow-2xl">
          <h2 className="text-2xl font-black mb-8 uppercase tracking-widest italic text-center text-white">Zed Admin</h2>
          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <input type="email" placeholder="Email" className="w-full p-4 bg-black border border-white/10 rounded-xl text-white outline-none focus:border-cyan-500" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" className="w-full p-4 bg-black border border-white/10 rounded-xl text-white outline-none focus:border-cyan-500" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="submit" className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-black rounded-xl transition-all uppercase tracking-widest">
              {loading ? <FaSpinner className="animate-spin mx-auto text-xl" /> : 'Enter System'}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-black text-white p-6 md:p-12 font-sans text-left">
      <div className="max-w-6xl mx-auto text-left">
        <header className="flex justify-between items-center mb-16 border-b border-white/10 pb-8">
          <h1 className="text-3xl font-black italic tracking-widest uppercase">Admin <span className="text-cyan-500">Panel</span></h1>
          <button onClick={() => supabase.auth.signOut()} className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 rounded-lg font-bold text-xs uppercase tracking-widest border border-red-500/20 hover:bg-red-500 transition-all hover:text-white">
            <FaSignOutAlt /> Sign Out
          </button>
        </header>

        <section className="mb-24 text-left">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-xl font-bold text-cyan-400 uppercase tracking-widest italic">Projects Inventory</h2>
            <button onClick={() => setShowAddForm(!showAddForm)} className="bg-cyan-600 p-3 rounded-full hover:scale-110 transition-all text-white">
              {showAddForm ? <FaTimes /> : <FaPlus />}
            </button>
          </div>

          <AnimatePresence>
            {showAddForm && (
              <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} onSubmit={handleAddProject} className="bg-white/5 p-8 rounded-3xl border border-cyan-500/30 mb-12 overflow-hidden space-y-4 text-left">
                <input type="text" placeholder="Project Title" className="w-full bg-black border border-white/10 p-4 rounded-xl outline-none focus:border-cyan-500" value={naslov} onChange={(e) => setNaslov(e.target.value)} required />
                <textarea placeholder="Scientific Description" className="w-full bg-black border border-white/10 p-4 rounded-xl outline-none focus:border-cyan-500 h-32" value={opis} onChange={(e) => setOpis(e.target.value)} required />
                <div className="flex items-center gap-4 p-4 border border-dashed border-white/20 rounded-xl">
                  <FaCloudUploadAlt className="text-2xl text-cyan-500" />
                  <input type="file" onChange={(e) => setFile(e.target.files[0])} className="text-xs text-slate-400" />
                </div>
                <button type="submit" disabled={loading} className="px-10 py-3 bg-cyan-600 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-cyan-500">
                  {loading ? 'Uploading...' : 'Save Record'}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projekti.map((proj) => (
              <div key={proj.id} className="bg-white/5 p-6 rounded-2xl border border-white/10 flex flex-col justify-between hover:border-cyan-500/30 transition-all min-h-[160px] text-left">
                <div className="text-left">
                  {proj.slika_url && <img src={proj.slika_url} alt="" className="w-full h-24 object-cover rounded-lg mb-4 bg-slate-800" />}
                  <span className="text-[10px] text-cyan-500 font-mono mb-2 block italic uppercase tracking-widest">ID: {proj.id}</span>
                  <p className="font-bold text-sm uppercase tracking-tight text-white mb-2">{proj.naslov}</p>
                  <p className="text-[11px] text-slate-500 line-clamp-2">{proj.opis}</p>
                </div>
                <div className="flex justify-end gap-4 mt-6 text-slate-500 border-t border-white/5 pt-4">
                  <FaEdit className="hover:text-cyan-400 cursor-pointer text-lg transition-colors" />
                  <FaTrash onClick={async () => { if(window.confirm("Obriši?")) { await supabase.from('projects').delete().eq('id', proj.id); fetchProjects(); } }} className="hover:text-red-500 cursor-pointer text-lg transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-20 pt-20 border-t border-white/5">
          <h2 className="text-xl font-bold text-cyan-400 uppercase tracking-widest mb-10 italic">Global Site Content</h2>
          <AdminAboutEditor />
        </section>
      </div>
    </motion.div>
  );
};

export default AdminPanel;