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

  // LOGIKA ZA UPLOAD FAJLA SA MAC-A
  const handleFileUpload = async (event) => {
    try {
      setUploading(true);
      const file = event.target.files[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `project-media/${fileName}`;

      // Upload u Supabase Storage (Bucket se mora zvati 'projects')
      const { error: uploadError } = await supabase.storage
        .from('projects')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Dobijanje javnog URL-a
      const { data } = supabase.storage.from('projects').getPublicUrl(filePath);
      setNewProject({ ...newProject, slika_url: data.publicUrl });
      alert("Fajl uspešno podignut na server!");

    } catch (error) {
      alert("Greška pri uploadu: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('projects').insert([newProject]);
      if (error) throw error;
      setNewProject({ naslov: '', opis: '', tehnologija: '', slika_url: '', media_type: 'Slika' });
      fetchProjekti();
      alert("Novi rad je uspešno objavljen!");
    } catch (error) {
      alert("Greška: " + error.message);
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
    <AnimatePresence mode="wait">
      {!session ? (
        <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-[#020617] flex items-center justify-center p-6">
          <div className="bg-[#0f172a] border border-slate-800 p-10 rounded-4xl w-full max-w-md text-center">
            <FaLock size={40} className="mx-auto text-cyan-500 mb-6" />
            <h2 className="text-2xl font-black text-white uppercase mb-8 tracking-tighter">Medical Auth</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <input type="email" placeholder="Email" className="w-full bg-[#1e293b] text-white p-4 rounded-xl outline-none" value={email} onChange={(e) => setEmail(e.target.value)} />
              <input type="password" placeholder="Lozinka" className="w-full bg-[#1e293b] text-white p-4 rounded-xl outline-none" value={password} onChange={(e) => setPassword(e.target.value)} />
              <button className="w-full bg-cyan-500 py-4 rounded-xl font-black uppercase tracking-widest text-sm text-black">Pristupi</button>
            </form>
          </div>
        </motion.div>
      ) : (
        <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-[#020617] text-white p-4 md:p-10 pt-28">
          <div className="max-w-5xl mx-auto">
            
            {/* --- FORMA ZA OBJAVU (POTPUNA) --- */}
            <section className="mb-20">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-black text-cyan-500 uppercase italic tracking-tighter">Admin Dashboard</h1>
                <button onClick={() => supabase.auth.signOut()} className="bg-red-900/20 text-red-500 border border-red-500/30 px-4 py-2 rounded-lg text-xs font-bold uppercase"><FaSignOutAlt /> Odjavi se</button>
              </div>

              <div className="bg-[#0f172a] border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl">
                <form onSubmit={handleAddProject} className="space-y-6">
                  <input type="text" placeholder="Naslov" required className="w-full bg-white text-black p-4 rounded-xl font-bold outline-none focus:ring-4 focus:ring-cyan-500/20" value={newProject.naslov} onChange={(e) => setNewProject({...newProject, naslov: e.target.value})} />
                  
                  <input type="text" placeholder="Kratak opis" className="w-full bg-white text-black p-4 rounded-xl font-bold outline-none" value={newProject.tehnologija} onChange={(e) => setNewProject({...newProject, tehnologija: e.target.value})} />

                  <textarea placeholder="Stručni tekst" required rows="6" className="w-full bg-white text-black p-4 rounded-xl font-bold outline-none" value={newProject.opis} onChange={(e) => setNewProject({...newProject, opis: e.target.value})} />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" placeholder="Tehnologije (npr. React, AI)" className="bg-white text-black p-4 rounded-xl font-bold outline-none" />
                    
                    {/* 1. SELEKTOR ZA SLIKU/VIDEO */}
                    <div className="bg-white text-black p-4 rounded-xl font-bold flex justify-between items-center">
                      <span className="text-slate-400">Medij</span>
                      <select 
                        className="bg-transparent outline-none cursor-pointer text-cyan-600"
                        value={newProject.media_type}
                        onChange={(e) => setNewProject({...newProject, media_type: e.target.value})}
                      >
                        <option value="Slika">Slika</option>
                        <option value="Video">Video</option>
                      </select>
                    </div>
                  </div>

                  {/* 2. DUGME ZA UPLOAD (DASHED BOX) */}
                  <label className="block border-2 border-dashed border-cyan-500/30 rounded-xl p-8 text-center bg-cyan-500/5 hover:bg-cyan-500/10 transition-all cursor-pointer relative">
                    <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*,video/*" />
                    <div className="flex flex-col items-center gap-2">
                      <FaCloudUploadAlt size={40} className={uploading ? "animate-bounce text-cyan-400" : "text-cyan-500"} />
                      <span className="text-cyan-500 font-black uppercase text-xs">
                        {uploading ? "Slanje na server..." : "Izaberi fajl sa Mac-a"}
                      </span>
                    </div>
                  </label>

                  {/* 3. NOTE / NAPOMENA */}
                  <div className="flex items-start gap-3 bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl">
                    <FaInfoCircle className="text-blue-400 mt-1" />
                    <p className="text-[11px] text-blue-300 leading-relaxed">
                      <strong>NOTE:</strong> Dozvoljeni formati su JPG, PNG i MP4. 
                      Maksimalna veličina fajla je 50MB. Za video zapise koristite optimizovane formate radi bržeg učitavanja na sajtu.
                    </p>
                  </div>

                  <input type="text" placeholder="URL Fajla (automatski se popunjava nakon uploada)" className="w-full bg-slate-800 text-slate-400 p-4 rounded-xl text-xs font-mono" value={newProject.slika_url} readOnly />

                  <button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-black py-5 rounded-2xl transition-all uppercase tracking-widest text-sm">
                    Objavi novi rad
                  </button>
                </form>
              </div>
            </section>

            {/* SEKCIJA ABOUT - NEPROMOLJENA */}
            <section className="mb-20">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-px grow bg-slate-800"></div>
                <h2 className="text-xs font-bold uppercase text-cyan-500 italic">About Section</h2>
                <div className="h-px grow bg-slate-800"></div>
              </div>
              <AdminAboutEditor />
            </section>

            {/* LISTA RADOVA */}
            <section className="pb-20">
              <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6">Lista radova</h2>
              <div className="space-y-4">
                {projekti.map((proj) => (
                  <div key={proj.id} className="bg-[#0f172a] border border-slate-800 p-6 rounded-2xl flex justify-between items-center group">
                    <h3 className="text-white font-bold uppercase text-sm group-hover:text-cyan-400 transition-colors">{proj.naslov}</h3>
                    <div className="flex gap-4">
                      <button className="bg-slate-800 p-3 rounded-xl text-slate-400 hover:text-white"><FaEdit /></button>
                      <button onClick={() => handleDelete(proj.id)} className="bg-slate-800 p-3 rounded-xl text-slate-400 hover:text-red-500"><FaTrash /></button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AdminPanel;