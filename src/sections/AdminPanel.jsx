import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; 
import { motion } from 'framer-motion'; // Uklanjamo gresku upotrebom dole
import { FaLock, FaSignOutAlt, FaEdit, FaSpinner } from 'react-icons/fa';

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
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  const fetchProjects = async () => {
    const { data, error } = await supabase.from('projects').select('*').order('id', { ascending: false });
    if (error) console.error("Greška pri čitanju:", error.message);
    if (data) setProjekti(data);
  };

  useEffect(() => {
    if (session) fetchProjects();
  }, [session]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert("Greška: " + error.message);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
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
      alert("Fajl je u magacinu!");
    } catch (error) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await supabase.from('projects').update(formData).eq('id', editingId);
      alert("Ažurirano!");
    } else {
      await supabase.from('projects').insert([formData]);
      alert("Uspešno objavljeno!");
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
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-black text-cyan-400 uppercase tracking-widest">Dashboard</h1>
          <button onClick={handleLogout} className="bg-red-500/20 text-red-500 px-6 py-2 rounded-full font-bold hover:bg-red-500 hover:text-white transition-all text-xs uppercase border border-red-500/20">
            <FaSignOutAlt className="inline mr-2" /> Odjavi se
          </button>
        </div>

        <div className="bg-white/5 backdrop-blur-3xl p-8 md:p-12 rounded-[50px] border border-white/10 shadow-2xl mb-16">
          <h2 className="text-white/40 text-xs font-black uppercase tracking-[0.3em] mb-8">
            {editingId ? "Izmena postojećeg rada" : "Unos novog naučnog rada"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="text-[10px] text-cyan-400 font-black uppercase ml-2">Naslov Projekta</label>
              <input type="text" className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-cyan-500" value={formData.naslov} onChange={(e) => setFormData({...formData, naslov: e.target.value})} required />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-cyan-400 font-black uppercase ml-2">Kratak opis</label>
              <input type="text" className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-cyan-500" value={formData.opis} onChange={(e) => setFormData({...formData, opis: e.target.value})} required />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-cyan-400 font-black uppercase ml-2">Stručni tekst (Dokumentacija)</label>
              <textarea className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white h-40 outline-none focus:border-cyan-500" value={formData.detaljan_tekst} onChange={(e) => setFormData({...formData, detaljan_tekst: e.target.value})} required />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] text-cyan-400 font-black uppercase ml-2">Tehnologije (odvojene zarezom)</label>
                <input type="text" className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-cyan-500" value={formData.tehnologija} onChange={(e) => setFormData({...formData, tehnologija: e.target.value})} required />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-cyan-400 font-black uppercase ml-2">Tip medija</label>
                <select className="w-full p-4 bg-[#03040b] border border-white/10 rounded-2xl text-white outline-none" value={formData.tip_medija} onChange={(e) => setFormData({...formData, tip_medija: e.target.value})}>
                  <option value="slika">Slika</option>
                  <option value="video">Video</option>
                </select>
              </div>
            </div>

            <div className="bg-cyan-500/5 border-2 border-dashed border-cyan-500/20 p-8 rounded-3xl text-center group hover:border-cyan-500/50 transition-all">
               <input type="file" onChange={handleFileUpload} disabled={uploading} className="text-xs text-white cursor-pointer" />
               {uploading && <p className="text-cyan-400 text-[10px] mt-4 animate-pulse"><FaSpinner className="animate-spin inline mr-2" /> TRANSFER U TOKU...</p>}
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-white/20 font-black uppercase ml-2">Generisani URL (Samo za čitanje)</label>
              <input type="text" className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white/40 cursor-not-allowed" value={formData.izvor_medija} readOnly />
            </div>

            <button type="submit" className="w-full bg-cyan-500 p-5 rounded-2xl font-black text-black uppercase tracking-widest hover:bg-cyan-400 shadow-xl shadow-cyan-500/10">
              {editingId ? 'Sačuvaj izmene u bazi' : 'Objavi rad na sajt'}
            </button>
          </form>
        </div>

        <div className="space-y-4">
          <h3 className="text-white/30 uppercase text-[10px] font-black tracking-[0.3em] ml-4 mb-6">Upravljanje arhivom</h3>
          {projekti.map(p => (
            <motion.div whileHover={{ x: 10 }} key={p.id} className="bg-white/5 p-6 rounded-3xl border border-white/5 flex justify-between items-center hover:bg-white/10 transition-all group">
              <span className="font-bold text-white group-hover:text-cyan-400 transition-colors">{p.naslov}</span>
              <button onClick={() => {setEditingId(p.id); setFormData(p); window.scrollTo(0,0)}} className="text-cyan-400 p-3 bg-white/5 rounded-2xl hover:bg-cyan-500 hover:text-black transition-all">
                <FaEdit />
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminPanel;