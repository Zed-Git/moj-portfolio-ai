import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEdit, FaTrash, FaSpinner, FaPlus, FaSignOutAlt, FaTimes, FaCloudUploadAlt } from 'react-icons/fa';
import AdminAboutEditor from '../components/admin/AdminAboutEditor.jsx';

const AdminPanel = () => {
  const [session, setSession] = useState(null);
  const [projekti, setProjekti] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // State za login i formu
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [naslov, setNaslov] = useState('');
  const [opis, setOpis] = useState('');
  const [tehnologija, setTehnologija] = useState('');
  const [file, setFile] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    supabase.auth.onAuthStateChange((_event, session) => setSession(session));
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data, error } = await supabase.from('projects').select('*').order('id', { ascending: false });
    if (!error && data) setProjekti(data);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    setLoading(false);
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let slikaUrl = '';
      if (file) {
        const fileName = `${Date.now()}_${file.name}`;
        const { error: uploadError } = await supabase.storage.from('media').upload(fileName, file);
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from('media').getPublicUrl(fileName);
        slikaUrl = data.publicUrl;
      }

      const { error } = await supabase.from('projects').insert([{ 
        naslov, 
        opis, 
        slika_url: slikaUrl,
        tehnologija: tehnologija || 'React, AI, Medicine' 
      }]);

      if (error) throw error;
      alert("Projekat uspešno sačuvan!");
      setNaslov(''); setOpis(''); setTehnologija(''); setFile(null); setShowAddForm(false);
      fetchProjects();
    } catch (err) { alert(err.message); }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Oprez! Brisanje iz baze je trajno. Nastaviti?")) {
      setLoading(true);
      const { error } = await supabase.from('projects').delete().eq('id', id);
      
      if (error) {
        alert("Greška baze: " + error.message);
      } else {
        // Tek ako baza potvrdi brisanje, sklanjamo sa ekrana
        setProjekti(prev => prev.filter(p => p.id !== id));
      }
      setLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6 font-sans">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-900 p-10 rounded-3xl border border-white/10 w-full max-w-md shadow-2xl">
          <h2 className="text-2xl font-black mb-8 uppercase italic text-white tracking-widest text-center text-left">ZED <span className="text-cyan-500">ADMIN</span></h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="email" placeholder="Email" className="w-full p-4 bg-black border border-white/10 rounded-xl text-white outline-none focus:border-cyan-500 transition-all text-left" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" className="w-full p-4 bg-black border border-white/10 rounded-xl text-white outline-none focus:border-cyan-500 transition-all text-left" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="submit" className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-black rounded-xl transition-all uppercase tracking-widest mt-4">
              {loading ? <FaSpinner className="animate-spin mx-auto" /> : 'Enter System'}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#03040b] text-white p-6 md:p-12 text-left font-sans overflow-x-hidden text-left">
      <div className="max-w-6xl mx-auto text-left">
        <header className="flex justify-between items-center mb-16 border-b border-white/10 pb-8">
          <h1 className="text-3xl font-black italic tracking-widest uppercase text-white">Admin <span className="text-cyan-500">Panel</span></h1>
          <button onClick={() => supabase.auth.signOut()} className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 rounded-lg font-bold text-xs uppercase tracking-widest border border-red-500/20 hover:bg-red-500 hover:text-white transition-all">
            <FaSignOutAlt /> Sign Out
          </button>
        </header>

        {/* PROJEKTI SECTION */}
        <section className="mb-24 text-left">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-xl font-bold text-cyan-400 uppercase tracking-widest italic text-left">Projects Inventory</h2>
            <button onClick={() => setShowAddForm(!showAddForm)} className="bg-cyan-600 p-3 rounded-full hover:scale-110 transition-all text-white shadow-lg">
              {showAddForm ? <FaTimes /> : <FaPlus />}
            </button>
          </div>

          <AnimatePresence>
            {showAddForm && (
              <motion.form 
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                onSubmit={handleAddProject} className="bg-slate-900/50 p-8 rounded-3xl border border-cyan-500/30 mb-16 space-y-6 text-left"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2 text-left">
                      <label className="text-[10px] uppercase text-slate-500 ml-1 font-bold">Research Title</label>
                      <input type="text" className="w-full bg-black border border-white/10 p-4 rounded-xl outline-none focus:border-cyan-500 text-white" value={naslov} onChange={(e) => setNaslov(e.target.value)} required />
                   </div>
                   <div className="space-y-2 text-left">
                      <label className="text-[10px] uppercase text-slate-500 ml-1 font-bold">Tech Stack</label>
                      <input type="text" className="w-full bg-black border border-white/10 p-4 rounded-xl outline-none focus:border-cyan-500 text-white" value={tehnologija} onChange={(e) => setTehnologija(e.target.value)} />
                   </div>
                </div>
                <div className="space-y-2 text-left">
                   <label className="text-[10px] uppercase text-slate-500 ml-1 font-bold">Full Description</label>
                   <textarea className="w-full bg-black border border-white/10 p-4 rounded-xl outline-none focus:border-cyan-500 h-32 text-white" value={opis} onChange={(e) => setOpis(e.target.value)} required />
                </div>
                <div className="flex items-center gap-4 p-5 border border-dashed border-white/20 rounded-2xl">
                  <FaCloudUploadAlt className="text-3xl text-cyan-500" />
                  <input type="file" onChange={(e) => setFile(e.target.files[0])} className="text-xs text-slate-400" />
                </div>
                <button type="submit" disabled={loading} className="px-10 py-4 bg-cyan-600 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-cyan-500 transition-all">
                  {loading ? 'Uploading Data...' : 'Save Scientific Record'}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
            {projekti.map((proj) => (
              <motion.div key={proj.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white/5 p-6 rounded-2xl border border-white/10 flex flex-col justify-between hover:border-cyan-500/30 transition-all text-left">
                <div className="text-left">
                  {proj.slika_url && <img src={proj.slika_url} alt="" className="w-full h-36 object-cover rounded-xl mb-5" />}
                  <span className="text-[10px] text-cyan-500 font-mono italic uppercase mb-2 block text-left">Record ID: {proj.id}</span>
                  <p className="font-bold text-sm uppercase tracking-tight text-white mb-2 text-left">{proj.naslov}</p>
                  <p className="text-[11px] text-slate-500 line-clamp-2 text-left font-light leading-relaxed">{proj.opis}</p>
                </div>
                <div className="flex justify-end gap-5 mt-6 text-slate-500 border-t border-white/5 pt-5">
                  <FaEdit className="hover:text-cyan-400 cursor-pointer text-lg transition-colors" />
                  <FaTrash onClick={() => handleDelete(proj.id)} className="hover:text-red-500 cursor-pointer text-lg transition-colors" />
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* EDITOR SECTION */}
        <section className="mt-32 pt-20 border-t border-white/10 text-left">
          <h2 className="text-xl font-bold text-cyan-400 uppercase tracking-widest mb-10 italic text-left">Global Site Content</h2>
          <AdminAboutEditor />
        </section>
      </div>
    </div>
  );
};

export default AdminPanel;