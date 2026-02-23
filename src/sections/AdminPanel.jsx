import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; 
import { motion } from 'framer-motion';
import { FaLock, FaSignOutAlt, FaEdit, FaTrash, FaSpinner, FaInfoCircle } from 'react-icons/fa';

const AdminPanel = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [projekti, setProjekti] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    naslov: '', opis: '', detaljan_tekst: '', tip_medija: 'slika', izvor_medija: '', tehnologija: ''
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => { setSession(session); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => { setSession(session); });
    return () => subscription.unsubscribe();
  }, []);

  const fetchProjects = async () => {
    const { data, error } = await supabase.from('projects').select('*').order('id', { ascending: false });
    if (data) setProjekti(data);
  };

  useEffect(() => { if (session) fetchProjects(); }, [session]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert("Greška: " + error.message);
    setLoading(false);
  };

  const handleLogout = async () => { await supabase.auth.signOut(); };

  const handleDelete = async (id, naslov) => {
    const potvrda = window.confirm(`Da li ste sigurni da želite da obrišete: "${naslov}"?`);
    if (potvrda) {
      await supabase.from('projects').delete().eq('id', id);
      fetchProjects();
    }
  };

  const handleFileUpload = async (event) => {
    try {
      setUploading(true);
      const file = event.target.files[0];
      if (!file) return;

      const maxImageSize = 2 * 1024 * 1024; // 2MB
      const maxVideoSize = 15 * 1024 * 1024; // 15MB

      if (file.type.startsWith('image/') && file.size > maxImageSize) {
        alert("SLIKA PREVELIKA! Max 2MB.");
        setUploading(false);
        return;
      }
      if (file.type.startsWith('video/') && file.size > maxVideoSize) {
        alert("VIDEO PREVELIK! Max 15MB.");
        setUploading(false);
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('media').upload(fileName, file);
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('media').getPublicUrl(fileName);
      setFormData({ ...formData, izvor_medija: data.publicUrl });
      alert("Fajl uskladišten!");
    } catch (error) { alert(error.message); } finally { setUploading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await supabase.from('projects').update(formData).eq('id', editingId);
      alert("Izmene sačuvane!");
    } else {
      await supabase.from('projects').insert([formData]);
      alert("Objavljeno!");
    }
    setEditingId(null);
    setFormData({ naslov: '', opis: '', detaljan_tekst: '', tip_medija: 'slika', izvor_medija: '', tehnologija: '' });
    fetchProjects();
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#03040b] px-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white/10 backdrop-blur-2xl p-10 rounded-[40px] border border-white/20 w-full max-w-md shadow-2xl">
          <h2 className="text-white text-2xl font-black mb-8 text-center uppercase tracking-widest">Admin Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="email" placeholder="Email" className="w-full p-4 bg-black/50 border border-white/10 rounded-2xl text-white outline-none focus:border-cyan-400" onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" placeholder="Šifra" className="w-full p-4 bg-black/50 border border-white/10 rounded-2xl text-white outline-none focus:border-cyan-400" onChange={(e) => setPassword(e.target.value)} required />
            <button disabled={loading} className="w-full bg-cyan-500 py-4 rounded-2xl font-black text-black hover:bg-cyan-400 transition-all uppercase tracking-widest">
              {loading ? "Provera..." : "Pristupi Dashboard-u"}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-40 pb-20 px-6 bg-[#03040b] text-white">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-10 text-left leading-none">
          <h1 className="text-3xl font-black text-cyan-400 uppercase tracking-widest">Dashboard</h1>
          <button onClick={handleLogout} className="bg-red-500/10 text-red-500 px-6 py-2 rounded-full font-bold hover:bg-red-500 hover:text-white transition-all text-xs border border-red-500/20">ODJAVI SE</button>
        </div>

        <div className="bg-white/5 backdrop-blur-3xl p-8 rounded-[40px] border border-white/10 shadow-2xl mb-16 text-left">
          <h2 className="text-white/40 text-[10px] font-black uppercase mb-8 italic">{editingId ? "Izmena" : "Novi unos"}</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <input type="text" placeholder="Naslov" className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-cyan-500" value={formData.naslov} onChange={(e) => setFormData({...formData, naslov: e.target.value})} required />
            <input type="text" placeholder="Kratak opis" className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-cyan-500" value={formData.opis} onChange={(e) => setFormData({...formData, opis: e.target.value})} required />
            <textarea placeholder="Tehnički tekst" className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white h-40 outline-none focus:border-cyan-500" value={formData.detaljan_tekst} onChange={(e) => setFormData({...formData, detaljan_tekst: e.target.value})} required />
            
            <div className="grid md:grid-cols-2 gap-4">
              <input type="text" placeholder="Tehnologije" className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-cyan-500" value={formData.tehnologija} onChange={(e) => setFormData({...formData, tehnologija: e.target.value})} required />
              <select className="w-full p-4 bg-[#03040b] border border-white/10 rounded-2xl text-white outline-none" value={formData.tip_medija} onChange={(e) => setFormData({...formData, tip_medija: e.target.value})}>
                <option value="slika">Slika</option>
                <option value="video">Video</option>
              </select>
            </div>

            <div className="bg-cyan-500/5 border-2 border-dashed border-cyan-500/20 p-8 rounded-3xl text-center group hover:border-cyan-500/50 transition-all">
              <label className="block text-cyan-400 text-[10px] font-black uppercase tracking-widest mb-4">Izaberite materijal (Slika ili Video)</label>
              <input type="file" onChange={handleFileUpload} className="w-full text-xs text-white file:bg-cyan-500 file:text-black file:rounded-full file:border-none file:px-4 file:py-2 cursor-pointer" />
              {uploading && <p className="text-cyan-400 text-[10px] mt-4 animate-pulse uppercase">Transfer...</p>}
            </div>

            <div className="p-5 bg-blue-500/5 border border-blue-500/20 rounded-2xl text-left">
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <FaInfoCircle /> Specifikacija formata
              </p>
              <div className="grid grid-cols-2 gap-6 text-[10px] text-white/50 font-light tracking-wide uppercase">
                <div className="border-l border-blue-500/20 pl-4"><span className="text-white font-bold block mb-1">Slike</span>JPG, PNG, WEBP<br />Max 2MB</div>
                <div className="border-l border-blue-500/20 pl-4"><span className="text-white font-bold block mb-1">Video</span>MP4 (H.264)<br />Max 15MB</div>
              </div>
            </div>

            <input type="text" placeholder="URL" className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white/30" value={formData.izvor_medija} readOnly />
            <button type="submit" className="w-full bg-cyan-500 p-5 rounded-2xl font-black text-black uppercase tracking-widest hover:bg-cyan-400 transition-all shadow-xl shadow-cyan-500/10">Objavi na sajt</button>
          </form>
        </div>

        <div className="space-y-4 text-left">
          <h3 className="text-white/30 uppercase text-[10px] font-black tracking-[0.3em] ml-4 mb-6 italic">Arhiva</h3>
          {projekti.map(p => (
            <motion.div whileHover={{ x: 10 }} key={p.id} className="bg-white/5 p-6 rounded-3xl border border-white/5 flex justify-between items-center group">
              <span className="font-bold text-white group-hover:text-cyan-400 transition-colors uppercase tracking-tight">{p.naslov}</span>
              <div className="flex gap-3 text-black">
                <button onClick={() => {setEditingId(p.id); setFormData(p); window.scrollTo(0,0)}} className="text-cyan-400 p-3 bg-white/5 rounded-2xl hover:bg-cyan-500 transition-all"><FaEdit /></button>
                <button onClick={() => handleDelete(p.id, p.naslov)} className="text-red-400 p-3 bg-white/5 rounded-2xl hover:bg-red-500 transition-all"><FaTrash /></button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;