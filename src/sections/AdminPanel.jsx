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

  // UPLOAD LOGIKA
  const handleFileUpload = async (event) => {
    try {
      setUploading(true);
      const file = event.target.files[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`; // Direktno u projects bucket

      const { error: uploadError } = await supabase.storage
        .from('projects')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('projects').getPublicUrl(filePath);
      setNewProject({ ...newProject, slika_url: data.publicUrl });
      alert("Fajl uspešno spremljen!");

    } catch (error) {
      alert("Greška pri prenosu fajla: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    try {
      // HIRURŠKI REZ: Uzimamo sve iz newProject, ali izdvajamo media_type sa strane
      // jer ga baza ne prihvata.
      const { media_type, ...dataToInsert } = newProject;

      const { error } = await supabase
        .from('projects')
        .insert([dataToInsert]); // Šaljemo samo čiste podatke (bez media_type)

      if (error) throw error;

      setNewProject({ naslov: '', opis: '', tehnologija: '', slika_url: '', media_type: 'Slika' });
      fetchProjekti();
      alert("Projekat uspešno objavljen u bazi!");
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

  if (loading) return <div className="min-h-screen bg-[#020617] flex items-center justify-center text-cyan-500 font-mono animate-pulse uppercase tracking-widest">Medical Sync...</div>;

  return (
    <AnimatePresence mode="wait">
      {!session ? (
        <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-[#020617] flex items-center justify-center p-6 text-center">
          <div className="bg-[#0f172a] border border-slate-800 p-10 rounded-4xl w-full max-w-md">
            <FaLock size={40} className="mx-auto text-cyan-500 mb-6" />
            <h2 className="text-2xl font-black text-white uppercase mb-8 tracking-tighter italic">Medical Auth</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <input type="email" placeholder="Email" className="w-full bg-[#1e293b] text-white p-4 rounded-xl outline-none border border-transparent focus:border-cyan-500 transition-all font-bold" value={email} onChange={(e) => setEmail(e.target.value)} />
              <input type="password" placeholder="Lozinka" className="w-full bg-[#1e293b] text-white p-4 rounded-xl outline-none border border-transparent focus:border-cyan-500 transition-all font-bold" value={password} onChange={(e) => setPassword(e.target.value)} />
              <button className="w-full bg-cyan-500 py-4 rounded-xl font-black uppercase tracking-widest text-sm text-black hover:bg-cyan-400 transition-all">Pristupi</button>
            </form>
          </div>
        </motion.div>
      ) : (
        <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-[#020617] text-white p-4 md:p-10 pt-28">
          <div className="max-w-5xl mx-auto">
            
            <section className="mb-20">
              <div className="flex justify-between items-center mb-10">
                <h1 className="text-3xl font-black text-cyan-500 uppercase italic tracking-tighter">Admin Dashboard</h1>
                <button onClick={() => supabase.auth.signOut()} className="bg-red-900/20 text-red-500 border border-red-500/30 px-6 py-2 rounded-lg text-xs font-bold uppercase hover:bg-red-500 hover:text-white transition-all"><FaSignOutAlt /> Odjavi se</button>
              </div>

              <div className="bg-[#0f172a] border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl">
                <form onSubmit={handleAddProject} className="space-y-6">
                  <input type="text" placeholder="Naslov projekta" required className="w-full bg-white text-black p-4 rounded-xl font-bold outline-none focus:ring-4 focus:ring-cyan-500/20" value={newProject.naslov} onChange={(e) => setNewProject({...newProject, naslov: e.target.value})} />
                  
                  <input type="text" placeholder="Tehnologije (npr. React, AI, Python)" className="w-full bg-white text-black p-4 rounded-xl font-bold outline-none" value={newProject.tehnologija} onChange={(e) => setNewProject({...newProject, tehnologija: e.target.value})} />

                  <textarea placeholder="Stručni tekst / Opis rada" required rows="6" className="w-full bg-white text-black p-4 rounded-xl font-bold outline-none" value={newProject.opis} onChange={(e) => setNewProject({...newProject, opis: e.target.value})} />

                  <div className="bg-white text-black p-4 rounded-xl font-bold flex justify-between items-center">
                    <span className="text-slate-400 uppercase text-xs tracking-widest">Tip medija</span>
                    <select 
                      className="bg-transparent outline-none cursor-pointer text-cyan-600 font-black"
                      value={newProject.media_type}
                      onChange={(e) => setNewProject({...newProject, media_type: e.target.value})}
                    >
                      <option value="Slika">Slika</option>
                      <option value="Video">Video</option>
                    </select>
                  </div>

                  <label className="block border-2 border-dashed border-cyan-500/30 rounded-xl p-10 text-center bg-cyan-500/5 hover:bg-cyan-500/10 transition-all cursor-pointer relative group">
                    <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*,video/*" />
                    <div className="flex flex-col items-center gap-3">
                      <FaCloudUploadAlt size={40} className={uploading ? "animate-bounce text-cyan-400" : "text-cyan-500 group-hover:scale-110 transition-transform"} />
                      <span className="text-cyan-500 font-black uppercase text-xs tracking-widest">
                        {uploading ? "Podizanje na server..." : "Izaberi fajl sa Mac-a"}
                      </span>
                    </div>
                  </label>

                  <div className="flex items-start gap-3 bg-blue-500/10 border border-blue-500/20 p-5 rounded-xl">
                    <FaInfoCircle className="text-blue-400 mt-1" />
                    <p className="text-[11px] text-blue-300 leading-relaxed uppercase tracking-tighter">
                      <strong>Note:</strong> Dozvoljeni formati: JPG, PNG, MP4. Max: 50MB. Fajl će biti automatski smešten u Supabase Storage.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] text-slate-500 uppercase ml-2">Public Asset URL</label>
                    <input type="text" placeholder="Automatski generisan URL" className="w-full bg-slate-900 text-cyan-500 p-4 rounded-xl text-[10px] font-mono border border-slate-800" value={newProject.slika_url} readOnly />
                  </div>

                  <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-black font-black py-5 rounded-2xl transition-all uppercase tracking-[0.2em] text-sm shadow-xl shadow-cyan-950/20">
                    Objavi novi rad
                  </button>
                </form>
              </div>
            </section>

            <section className="mb-20">
              <div className="flex items-center gap-4 mb-10">
                <div className="h-px grow bg-slate-800"></div>
                <h2 className="text-xs font-bold uppercase text-cyan-500 italic tracking-widest">About Section Editor</h2>
                <div className="h-px grow bg-slate-800"></div>
              </div>
              <AdminAboutEditor />
            </section>

            <section className="pb-20">
              <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em] mb-8 pl-4">Lista tvojih radova</h2>
              <div className="space-y-4">
                {projekti.map((proj) => (
                  <div key={proj.id} className="bg-[#0f172a] border border-slate-800 p-6 rounded-2xl flex justify-between items-center group hover:border-cyan-500/30 transition-all duration-300">
                    <h3 className="text-white font-bold uppercase text-sm tracking-tight group-hover:text-cyan-400 transition-colors">{proj.naslov}</h3>
                    <div className="flex gap-4">
                      <button className="bg-slate-800 p-3 rounded-xl text-slate-400 hover:text-white transition-all"><FaEdit size={16} /></button>
                      <button onClick={() => handleDelete(proj.id)} className="bg-slate-800 p-3 rounded-xl text-slate-400 hover:text-red-500 transition-all"><FaTrash size={16} /></button>
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
