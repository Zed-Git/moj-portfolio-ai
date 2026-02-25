import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; 
import { motion, AnimatePresence } from 'framer-motion'; 
import { FaTrash, FaSignOutAlt, FaCloudUploadAlt, FaLock, FaInfoCircle, FaEdit } from 'react-icons/fa';
import AdminAboutEditor from '../components/admin/AdminAboutEditor';

const AdminPanel = () => {
  const [session, setSession] = useState(null);
  const [projekti, setProjekti] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [newProject, setNewProject] = useState({
    naslov: '', opis: '', tehnologija: '', slika_url: '', media_type: 'Slika'
  });

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
    if (error) alert("Greška: " + error.message);
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
      alert("Asset uploaded successfully!");
    } catch (error) {
      alert("Upload failed: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    try {
      const { media_type, ...dataToInsert } = newProject;
      const { error } = await supabase.from('projects').insert([dataToInsert]);
      if (error) throw error;
      setNewProject({ naslov: '', opis: '', tehnologija: '', slika_url: '', media_type: 'Slika' });
      fetchProjekti();
      alert("Project published!");
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
        <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-[#020617] flex items-center justify-center p-6">
          <div className="bg-[#0f172a] border border-slate-800 p-10 rounded-4xl w-full max-w-md text-center shadow-2xl">
            <FaLock size={40} className="mx-auto text-cyan-500 mb-6" />
            <h2 className="text-2xl font-black text-white uppercase mb-8 tracking-tighter italic">Medical Auth</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <input type="email" placeholder="Email" className="w-full bg-[#1e293b] text-white p-4 rounded-xl outline-none" value={email} onChange={(e) => setEmail(e.target.value)} />
              <input type="password" placeholder="Lozinka" className="w-full bg-[#1e293b] text-white p-4 rounded-xl outline-none" value={password} onChange={(e) => setPassword(e.target.value)} />
              <button className="w-full bg-cyan-500 py-4 rounded-xl font-black uppercase text-black">Login</button>
            </form>
          </div>
        </motion.div>
      ) : (
        <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-[#020617] text-white p-4 md:p-10 pt-28">
          <div className="max-w-5xl mx-auto">
            
            <header className="flex justify-between items-center mb-10">
              <h1 className="text-3xl font-black text-cyan-500 uppercase italic">Admin Dashboard</h1>
              <button onClick={() => supabase.auth.signOut()} className="bg-red-500/10 text-red-500 border border-red-500/20 px-4 py-2 rounded-lg text-[10px] font-black uppercase">Logout</button>
            </header>

            {/* FORMA ZA DODAVANJE */}
            <div className="bg-[#0f172a] border border-slate-800 p-6 md:p-10 rounded-[2.5rem] shadow-2xl mb-20">
              <form onSubmit={handleAddProject} className="space-y-6">
                <input type="text" required placeholder="Naslov projekta" className="w-full bg-white text-black p-4 rounded-xl font-bold" value={newProject.naslov} onChange={(e) => setNewProject({...newProject, naslov: e.target.value})} />
                <input type="text" placeholder="Tehnologije" className="w-full bg-white text-black p-4 rounded-xl font-bold" value={newProject.tehnologija} onChange={(e) => setNewProject({...newProject, tehnologija: e.target.value})} />
                <textarea required rows="5" placeholder="Stručni tekst / Opis" className="w-full bg-white text-black p-4 rounded-xl font-bold" value={newProject.opis} onChange={(e) => setNewProject({...newProject, opis: e.target.value})} />

                {/* VRAĆEN UPLOAD BOX */}
                <label className="block border-2 border-dashed border-cyan-500/30 rounded-xl p-10 text-center bg-cyan-500/5 hover:bg-cyan-500/10 transition-all cursor-pointer">
                  <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*,video/*" />
                  <div className="flex flex-col items-center gap-3">
                    <FaCloudUploadAlt size={40} className={uploading ? "animate-bounce text-cyan-400" : "text-cyan-500"} />
                    <span className="text-cyan-500 font-black uppercase text-xs">
                      {uploading ? "Uploading..." : "Izaberi fajl sa Mac-a"}
                    </span>
                  </div>
                </label>

                {/* VRAĆENI NOTES */}
                <div className="flex items-start gap-3 bg-blue-500/10 border border-blue-500/20 p-5 rounded-xl">
                  <FaInfoCircle className="text-blue-400 mt-1" />
                  <p className="text-[11px] text-blue-300 leading-relaxed font-bold uppercase tracking-tighter">
                    NOTE: Dozvoljeni formati su JPG, PNG i MP4. Maksimalna veličina fajla je 50MB. Za video zapise koristite optimizovane formate.
                  </p>
                </div>

                <input type="text" placeholder="URL Slike (Popunjava se automatski)" className="w-full bg-slate-900 text-cyan-500 p-4 rounded-xl font-mono text-[10px]" value={newProject.slika_url} readOnly />
                <button type="submit" className="w-full bg-cyan-500 text-black font-black py-5 rounded-2xl uppercase tracking-widest">Objavi novi rad</button>
              </form>
            </div>

            <AdminAboutEditor />

            {/* LISTA PROJEKATA */}
            <div className="mt-20 space-y-4 pb-20">
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-6 pl-4">Lista radova</h2>
              {projekti.map(proj => (
                <div key={proj.id} className="bg-[#0f172a] border border-slate-800 p-6 rounded-2xl flex justify-between items-center group">
                  <h3 className="font-bold uppercase text-sm group-hover:text-cyan-400 transition-colors">{proj.naslov}</h3>
                  <div className="flex gap-4">
                    <button className="bg-slate-800 p-2 rounded text-slate-500"><FaEdit /></button>
                    <button onClick={() => handleDelete(proj.id)} className="bg-slate-800 p-2 rounded text-slate-500 hover:text-red-500"><FaTrash /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AdminPanel;