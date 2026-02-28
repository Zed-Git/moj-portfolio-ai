import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; 
import { motion, AnimatePresence } from 'framer-motion'; 
import { FaTrash, FaSignOutAlt, FaCloudUploadAlt, FaLock, FaInfoCircle, FaEdit, FaTimes, FaKey } from 'react-icons/fa';
import AdminAboutEditor from '../components/admin/AdminAboutEditor';

const AdminPanel = () => {
  const [session, setSession] = useState(null);
  const [projekti, setProjekti] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [newProject, setNewProject] = useState({
    naslov: '', opis: '', tehnologija: '', slika_url: '', media_type: 'Image'
  });

  const [editingId, setEditingId] = useState(null);

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

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert("Auth Error: " + error.message);
  };

  // --- NOVA FUNKCIJA: RESETOVANJE ŠIFRE ---
  const handleForgotPassword = async () => {
    if (!email) {
      alert("Please enter your admin email first.");
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://www.mdzdravko.com/admin',
    });
    if (error) alert("Error: " + error.message);
    else alert("Reset link sent to your email!");
  };

  const handleFileUpload = async (event) => {
    try {
      setUploading(true);
      const file = event.target.files[0];
      if (!file) return;
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('projects').upload(fileName, file);
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('projects').getPublicUrl(fileName);
      setNewProject({ ...newProject, slika_url: data.publicUrl });
      alert("File synchronized!");
    } catch (error) {
      alert("Upload failed: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const startEdit = (proj) => {
    setEditingId(proj.id);
    setNewProject({
      naslov: proj.naslov, opis: proj.opis, tehnologija: proj.tehnologija, slika_url: proj.slika_url, media_type: 'Image'
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setNewProject({ naslov: '', opis: '', tehnologija: '', slika_url: '', media_type: 'Image' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToInsert = {
        naslov: newProject.naslov,
        opis: newProject.opis,
        tehnologija: newProject.tehnologija,
        slika_url: newProject.slika_url
      };
      if (editingId) {
        const { error } = await supabase.from('projects').update(dataToInsert).eq('id', editingId);
        if (error) throw error;
        alert("Record updated!");
      } else {
        const { error } = await supabase.from('projects').insert([dataToInsert]);
        if (error) throw error;
        alert("Published!");
      }
      cancelEdit();
      fetchProjekti();
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete permanently?")) {
      await supabase.from('projects').delete().eq('id', id);
      fetchProjekti();
    }
  };

  if (loading) return <div className="min-h-screen bg-[#020617] flex items-center justify-center text-cyan-500 font-mono animate-pulse">AUTHENTICATING...</div>;

  return (
    <AnimatePresence mode="wait">
      {!session ? (
        <motion.div 
          key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="min-h-screen bg-[#020617] flex items-center justify-center p-6 text-center"
        >
          <div className="bg-[#0f172a] border border-slate-800 p-10 rounded-4xl w-full max-w-md shadow-2xl">
            <FaLock size={40} className="mx-auto text-cyan-500 mb-6" />
            <h2 className="text-2xl font-black text-white uppercase mb-8 tracking-tighter italic">Secure Access</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <input type="email" placeholder="Admin Email" className="w-full bg-[#1e293b] text-white p-4 rounded-xl outline-none border border-transparent focus:border-cyan-500 transition-all font-bold" value={email} onChange={(e) => setEmail(e.target.value)} />
              <input type="password" placeholder="Key Phrase" className="w-full bg-[#1e293b] text-white p-4 rounded-xl outline-none border border-transparent focus:border-cyan-500 transition-all font-bold" value={password} onChange={(e) => setPassword(e.target.value)} />
              <button className="w-full bg-cyan-500 py-4 rounded-xl font-black uppercase text-black hover:bg-cyan-400 transition-all">Authorize</button>
            </form>
            
            {/* NOVI LINK ZA ZABORAVLJENU ŠIFRU */}
            <button 
              onClick={handleForgotPassword}
              className="mt-6 text-slate-500 hover:text-cyan-400 text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 mx-auto"
            >
              <FaKey size={10} /> Forgot your key phrase?
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-[#020617] text-white p-4 md:p-10 pt-40">
          {/* ... Ostatak koda ostaje isti ... */}
          <div className="max-w-5xl mx-auto">
            <header className="flex justify-between items-center mb-10 bg-slate-900/50 p-6 rounded-3xl border border-white/5 shadow-2xl">
              <h1 className="text-2xl font-black text-cyan-500 uppercase italic">Control Panel</h1>
              <button onClick={() => supabase.auth.signOut()} className="bg-red-500/20 text-red-500 border border-red-500/20 px-6 py-2 rounded-xl text-[10px] font-black uppercase">End Session</button>
            </header>

            <div className={`bg-[#0f172a] border transition-all duration-500 p-6 md:p-10 rounded-4xl shadow-2xl mb-20 ${editingId ? 'border-yellow-500/50' : 'border-slate-800'}`}>
              <div className="flex justify-between items-center mb-8">
                <h2 className={`font-bold uppercase text-xs tracking-widest italic ${editingId ? 'text-yellow-500' : 'text-cyan-400'}`}>
                  {editingId ? `// Editing Record ID: ${editingId}` : '// Add New Scientific Entry'}
                </h2>
                {editingId && <button onClick={cancelEdit} className="text-slate-400 hover:text-white text-[10px] uppercase font-black"><FaTimes /> Cancel</button>}
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <input type="text" required placeholder="Project Title" className="w-full bg-white text-black p-4 rounded-xl font-bold outline-none" value={newProject.naslov} onChange={(e) => setNewProject({...newProject, naslov: e.target.value})} />
                <input type="text" placeholder="Technologies" className="w-full bg-white text-black p-4 rounded-xl font-bold outline-none" value={newProject.tehnologija} onChange={(e) => setNewProject({...newProject, tehnologija: e.target.value})} />
                <textarea required rows="5" placeholder="Scientific Abstract" className="w-full bg-white text-black p-4 rounded-xl font-bold outline-none" value={newProject.opis} onChange={(e) => setNewProject({...newProject, opis: e.target.value})} />
                <label className="block border-2 border-dashed border-cyan-500/30 rounded-xl p-10 text-center bg-cyan-500/5 hover:bg-cyan-500/10 transition-all cursor-pointer"><input type="file" className="hidden" onChange={handleFileUpload} accept="image/*,video/*" /><div className="flex flex-col items-center gap-3"><FaCloudUploadAlt size={40} className={uploading ? "animate-bounce text-cyan-400" : "text-cyan-500"} /><span className="text-cyan-500 font-black uppercase text-xs">{uploading ? "Uploading..." : "Replace / Upload Media"}</span></div></label>
                <button type="submit" className={`w-full font-black py-5 rounded-2xl transition-all uppercase tracking-widest text-sm shadow-xl ${editingId ? 'bg-yellow-500 text-black' : 'bg-cyan-500 text-black'}`}>{editingId ? 'Update Research Data' : 'Publish Research'}</button>
              </form>
            </div>
            <AdminAboutEditor />
            <div className="mt-20 space-y-4 pb-20">
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-6 pl-4">Active Database Records</h2>
              {projekti.map(proj => (
                <div key={proj.id} className="bg-[#0f172a] border border-slate-800 p-6 rounded-2xl flex justify-between items-center group hover:border-cyan-500/30 transition-all"><h3 className="text-white font-bold uppercase text-sm">{proj.naslov}</h3><div className="flex gap-4"><button onClick={() => startEdit(proj)} className="bg-slate-800 p-3 rounded-xl text-slate-400 hover:text-cyan-400"><FaEdit size={16} /></button><button onClick={() => handleDelete(proj.id)} className="bg-slate-800 p-3 rounded-xl text-slate-400 hover:text-red-500"><FaTrash size={16} /></button></div></div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AdminPanel;