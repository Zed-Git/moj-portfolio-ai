import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; 
import { motion, AnimatePresence } from 'framer-motion'; 
import { FaEdit, FaTrash, FaSignOutAlt, FaCloudUploadAlt, FaLock, FaInfoCircle } from 'react-icons/fa';
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
    if (error) alert("Greška pri prijavi: " + error.message);
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
      alert("Fajl uspešno spremljen!");
    } catch (error) {
      alert("Greška pri prenosu: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    try {
      // HIRURŠKI REZ: Izbacujemo media_type pre slanja u bazu
      const { media_type, ...dataToInsert } = newProject; 
      const { error } = await supabase.from('projects').insert([dataToInsert]);
      if (error) throw error;
      setNewProject({ naslov: '', opis: '', tehnologija: '', slika_url: '', media_type: 'Slika' });
      fetchProjekti();
      alert("Projekat uspešno objavljen!");
    } catch (error) {
      alert("Greška pri objavi: " + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Brisanje je trajno?")) {
      await supabase.from('projects').delete().eq('id', id);
      fetchProjekti();
    }
  };

  if (loading) return <div className="min-h-screen bg-[#020617] flex items-center justify-center text-cyan-500 font-mono animate-pulse">Syncing...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <AnimatePresence mode="wait">
        {!session ? (
          <motion.div key="login" className="min-h-screen bg-[#020617] flex items-center justify-center p-6">
             <div className="bg-[#0f172a] border border-slate-800 p-10 rounded-4xl w-full max-w-md text-center">
                <FaLock size={40} className="mx-auto text-cyan-500 mb-6" />
                <form onSubmit={handleLogin} className="space-y-4">
                  <input type="email" placeholder="Email" className="w-full bg-[#1e293b] text-white p-4 rounded-xl" value={email} onChange={(e) => setEmail(e.target.value)} />
                  <input type="password" placeholder="Lozinka" className="w-full bg-[#1e293b] text-white p-4 rounded-xl" value={password} onChange={(e) => setPassword(e.target.value)} />
                  <button className="w-full bg-cyan-500 py-4 rounded-xl font-black uppercase text-sm">Pristupi</button>
                </form>
             </div>
          </motion.div>
        ) : (
          <motion.div key="dashboard" className="min-h-screen bg-[#020617] text-white p-4 md:p-10 pt-28">
            <div className="max-w-5xl mx-auto">
              <section className="mb-20">
                <h1 className="text-3xl font-black text-cyan-500 italic mb-10">Admin Dashboard</h1>
                <div className="bg-[#0f172a] border border-slate-800 p-8 rounded-[2.5rem]">
                  <form onSubmit={handleAddProject} className="space-y-6">
                    <input type="text" required className="w-full bg-white text-black p-4 rounded-xl font-bold" placeholder="Naslov" value={newProject.naslov} onChange={(e) => setNewProject({...newProject, naslov: e.target.value})} />
                    <input type="text" className="w-full bg-white text-black p-4 rounded-xl font-bold" placeholder="Tehnologije" value={newProject.tehnologija} onChange={(e) => setNewProject({...newProject, tehnologija: e.target.value})} />
                    <textarea required rows="6" className="w-full bg-white text-black p-4 rounded-xl font-bold" placeholder="Opis" value={newProject.opis} onChange={(e) => setNewProject({...newProject, opis: e.target.value})} />
                    <label className="block border-2 border-dashed border-cyan-500/30 rounded-xl p-10 text-center cursor-pointer">
                      <input type="file" className="hidden" onChange={handleFileUpload} />
                      <FaCloudUploadAlt size={40} className="mx-auto text-cyan-500" />
                    </label>
                    <button type="submit" className="w-full bg-cyan-500 py-5 rounded-2xl font-black uppercase tracking-widest">Objavi</button>
                  </form>
                </div>
              </section>
              <AdminAboutEditor />
              <div className="mt-20 space-y-4">
                {projekti.map(proj => (
                  <div key={proj.id} className="bg-[#0f172a] p-6 rounded-2xl flex justify-between items-center">
                    <h3 className="font-bold">{proj.naslov}</h3>
                    <button onClick={() => handleDelete(proj.id)} className="text-red-500"><FaTrash /></button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
export default AdminPanel;