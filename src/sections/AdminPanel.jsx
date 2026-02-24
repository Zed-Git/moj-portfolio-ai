import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; 
import { motion } from 'framer-motion';
import { FaEdit, FaTrash, FaSpinner, FaInfoCircle, FaSignOutAlt } from 'react-icons/fa';

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

  // 1. PROVERA SESIJE (DA LI JE KORISNIK ULOGOVAN)
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => { setSession(session); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => { setSession(session); });
    return () => subscription.unsubscribe();
  }, []);

  // 2. DOBAVLJANJE PROJEKATA IZ BAZE
  const fetchProjects = async () => {
    const { data, error } = await supabase.from('projects').select('*').order('id', { ascending: false });
    if (error) console.error("Greška:", error.message);
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
    if (window.confirm(`Da li ste sigurni da želite da obrišete: "${naslov}"?`)) {
      await supabase.from('projects').delete().eq('id', id);
      fetchProjects();
    }
  };

  const handleFileUpload = async (event) => {
    try {
      setUploading(true);
      const file = event.target.files[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('media').upload(fileName, file);
      
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('media').getPublicUrl(fileName);
      setFormData({ ...formData, izvor_medija: data.publicUrl });
      alert("Fajl uspešno dodat!");
    } catch (error) {
      alert("Greška: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await supabase.from('projects').update(formData).eq('id', editingId);
      alert("Projekat ažuriran!");
    } else {
      await supabase.from('projects').insert([formData]);
      alert("Projekat objavljen!");
    }
    setEditingId(null);
    setFormData({ naslov: '', opis: '', detaljan_tekst: '', tip_medija: 'slika', izvor_medija: '', tehnologija: '' });
    fetchProjects();
  };

  // --- PRIKAZ 1: LOGIN EKRAN ---
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#03040b] px-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white/10 backdrop-blur-2xl p-10 rounded-[40px] border border-white/20 w-full max-w-md text-center">
          <h2 className="text-white text-2xl font-black mb-8 uppercase tracking-widest">Admin Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="email" placeholder="Email" className="w-full p-4 bg-black/50 border border-white/10 rounded-2xl text-white outline-none" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" placeholder="Šifra" className="w-full p-4 bg-black/50 border border-white/10 rounded-2xl text-white outline-none" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button className="w-full bg-cyan-500 py-4 rounded-2xl font-black text-black uppercase">{loading ? "Provera..." : "Pristupi"}</button>
          </form>
        </motion.div>
      </div>
    );
  }

  // --- PRIKAZ 2: DASHBOARD ---
  return (
    <div className="min-h-screen pt-40 pb-20 px-6 bg-[#03040b] text-white">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-black text-cyan-400 uppercase tracking-widest leading-none">Dashboard</h1>
          <button onClick={handleLogout} className="bg-red-500/10 text-red-500 px-6 py-2 rounded-full font-bold hover:bg-red-500 hover:text-white transition-all text-xs border border-red-500/20">
            <FaSignOutAlt className="inline mr-2" /> Odjavi se
          </button>
        </div>

        <div className="bg-white/5 backdrop-blur-3xl p-8 rounded-[40px] border border-white/10 shadow-2xl mb-16 text-left">
          <form onSubmit={handleSubmit} className="space-y-5">
            <input type="text" placeholder="Naslov" className="w-full p-4 bg-white border-none rounded-2xl text-black font-bold" value={formData.naslov} onChange={(e) => setFormData({...formData, naslov: e.target.value})} required />
            <input type="text" placeholder="Kratak opis" className="w-full p-4 bg-white border-none rounded-2xl text-black font-bold" value={formData.opis} onChange={(e) => setFormData({...formData, opis: e.target.value})} required />
            <textarea placeholder="Detaljan tekst" className="w-full p-4 bg-white border-none rounded-2xl text-black font-bold h-40" value={formData.detaljan_tekst} onChange={(e) => setFormData({...formData, detaljan_tekst: e.target.value})} required />
            <input type="text" placeholder="Tehnologije (npr. React, AI)" className="w-full p-4 bg-white border-none rounded-2xl text-black font-bold" value={formData.tehnologija} onChange={(e) => setFormData({...formData, tehnologija: e.target.value})} required />
            
            <div className="bg-cyan-500/5 border-2 border-dashed border-cyan-500/20 p-8 rounded-3xl text-center">
              <label className="block text-cyan-400 text-xs font-black uppercase mb-4 tracking-widest">Izaberi materijal</label>
              <input type="file" onChange={handleFileUpload} className="w-full text-xs text-slate-300 file:bg-cyan-500 file:text-black file:rounded-full file:border-none file:px-4 file:py-2 file:font-black cursor-pointer" />
              {uploading && <p className="text-cyan-400 text-[10px] mt-4 animate-pulse uppercase"><FaSpinner className="animate-spin inline mr-2" /> Slanje...</p>}
            </div>

            {/* --- NOTE SEKCIJA JE OVDE --- */}
            <div className="p-5 bg-blue-500/5 border border-blue-500/20 rounded-2xl">
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-3 flex items-center gap-2"><FaInfoCircle /> Specifikacija formata</p>
              <div className="grid grid-cols-2 gap-4 text-[9px] text-white/50 uppercase tracking-wider font-bold">
                <div className="border-l border-blue-500/20 pl-4">SLIKE: JPG, PNG, WEBP<br />MAX 2MB</div>
                <div className="border-l border-blue-500/20 pl-4">VIDEO: MP4 (H.264)<br />MAX 15MB</div>
              </div>
            </div>

            <input type="text" placeholder="URL" className="w-full p-4 bg-white/10 text-white rounded-2xl border border-white/10" value={formData.izvor_medija} readOnly />
            <button type="submit" className="w-full bg-cyan-500 p-5 rounded-2xl font-black text-black uppercase tracking-widest hover:bg-cyan-400 transition-all">
              {editingId ? 'Sačuvaj izmene' : 'Objavi rad'}
            </button>
          </form>
        </div>

        {/* LISTA PROJEKATA */}
        <div className="space-y-4 text-left">
          <h3 className="text-white/30 uppercase text-[10px] font-black tracking-[0.3em] ml-4 mb-6 italic">Arhiva</h3>
          {projekti.map(p => (
            <motion.div key={p.id} whileHover={{ x: 10 }} className="bg-white/5 p-6 rounded-3xl border border-white/5 flex justify-between items-center group">
              <span className="font-bold text-white group-hover:text-cyan-400 transition-colors uppercase tracking-tight">{p.naslov}</span>
              <div className="flex gap-3">
                <button onClick={() => {setEditingId(p.id); setFormData(p); window.scrollTo(0,0)}} className="text-cyan-400 p-3 bg-white/5 rounded-2xl hover:bg-cyan-500 hover:text-black transition-all shadow-xl"><FaEdit /></button>
                <button onClick={() => handleDelete(p.id, p.naslov)} className="text-red-400 p-3 bg-white/5 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-xl"><FaTrash /></button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;