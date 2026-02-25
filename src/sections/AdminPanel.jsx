import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; 
import { motion } from 'framer-motion';
import { FaEdit, FaUpload, FaSpinner, FaSignOutAlt, FaLock } from 'react-icons/fa';

const AdminPanel = () => {
  const [email, setEmail] = useState(''); // Dodali smo email polje
  const [password, setPassword] = useState('');
  const [session, setSession] = useState(null); // Prati da li si ulogovan
  const [loading, setLoading] = useState(false);
  
  // Drastično poboljšan State za projekte
  const [projekti, setProjekti] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    naslov: '', opis: '', detaljan_tekst: '', tip_medija: 'slika', izvor_medija: '', tehnologija: ''
  });

  // 1. PROVERA: Da li smo već ulogovani? (Vizita pri startu)
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  const fetchProjects = async () => {
    const { data } = await supabase.from('projects').select('*').order('id', { ascending: false });
    if (data) setProjekti(data);
  };

  useEffect(() => {
    if (session) fetchProjects();
  }, [session]);

  // 2. FUNKCIJA ZA PRAVI LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) alert("Greška pri prijavi: " + error.message);
    setLoading(false);
  };

  // 3. FUNKCIJA ZA LOGOUT (Odjava)
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  // --- Funkcije za Upload i Submit ostaju iste kao ranije ---
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
      alert("Fajl uskladišten!");
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
    } else {
      await supabase.from('projects').insert([formData]);
    }
    setEditingId(null);
    setFormData({ naslov: '', opis: '', detaljan_tekst: '', tip_medija: 'slika', izvor_medija: '', tehnologija: '' });
    fetchProjects();
  };

  // --- EKRAN 1: LOGIN FORMA (Pristupna soba) ---
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#03040b] px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-2xl p-10 rounded-[40px] border border-white/20 w-full max-w-md shadow-2xl"
        >
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center border border-cyan-500/30">
              <FaLock className="text-cyan-400 text-2xl" />
            </div>
          </div>
          <h2 className="text-white text-2xl font-black mb-8 text-center uppercase tracking-widest">Medical Auth</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="email" placeholder="Vaš Email" 
              className="w-full p-4 bg-black/50 border border-white/10 rounded-2xl text-white outline-none focus:border-cyan-400"
              onChange={(e) => setEmail(e.target.value)} required
            />
            <input 
              type="password" placeholder="Lozinka" 
              className="w-full p-4 bg-black/50 border border-white/10 rounded-2xl text-white outline-none focus:border-cyan-400"
              onChange={(e) => setPassword(e.target.value)} required
            />
            <button disabled={loading} className="w-full bg-cyan-500 py-4 rounded-2xl font-black text-black hover:bg-cyan-400 transition-all uppercase tracking-widest flex justify-center items-center gap-2">
              {loading ? <FaSpinner className="animate-spin" /> : 'Pristupi Dashboard-u'}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // --- EKRAN 2: DASHBOARD (Glavna ordinacija) ---
  return (
    <div className="min-h-screen pt-40 pb-20 px-6 bg-[#03040b] text-white">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-black text-cyan-400 uppercase tracking-widest">Admin Dashboard</h1>
          <button onClick={handleLogout} className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-all uppercase text-xs font-bold bg-red-500/10 px-4 py-2 rounded-full border border-red-500/20">
            <FaSignOutAlt /> Odjavi se
          </button>
        </div>

        {/* FORMA ZA UNOS/IZMENU (Ona lepa koju smo već napravili) */}
        <div className="bg-white/5 backdrop-blur-3xl p-8 rounded-[40px] border border-white/10 shadow-2xl mb-12">
           <form onSubmit={handleSubmit} className="space-y-4 text-black">
              {/* Ovde idu sva tvoja polja (naslov, opis, upload...) ista kao ranije */}
              <input type="text" placeholder="Naslov" className="w-full p-4 bg-white rounded-2xl" value={formData.naslov} onChange={(e) => setFormData({...formData, naslov: e.target.value})} required />
              <input type="text" placeholder="Kratak opis" className="w-full p-4 bg-white rounded-2xl" value={formData.opis} onChange={(e) => setFormData({...formData, opis: e.target.value})} required />
              <textarea placeholder="Stručni tekst" className="w-full p-4 bg-white rounded-2xl h-32" value={formData.detaljan_tekst} onChange={(e) => setFormData({...formData, detaljan_tekst: e.target.value})} required />
              
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Tehnologije" className="p-4 bg-white rounded-2xl" value={formData.tehnologija} onChange={(e) => setFormData({...formData, tehnologija: e.target.value})} required />
                <select className="p-4 bg-white rounded-2xl" value={formData.tip_medija} onChange={(e) => setFormData({...formData, tip_medija: e.target.value})}>
                  <option value="slika">Slika</option>
                  <option value="video">Video</option>
                </select>
              </div>

              <div className="bg-cyan-500/5 border-2 border-dashed border-cyan-500/20 p-6 rounded-2xl text-center">
                <input type="file" accept="image/*,video/*" onChange={handleFileUpload} disabled={uploading} className="text-xs text-white file:bg-cyan-500 file:border-none file:px-4 file:py-2 file:rounded-full cursor-pointer" />
                {uploading && <p className="text-cyan-400 text-[10px] mt-2 animate-pulse">UČITAVANJE U MAGACIN...</p>}
              </div>

              <input type="text" placeholder="URL" className="w-full p-4 bg-white/10 text-white rounded-2xl" value={formData.izvor_medija} readOnly />
              
              <button type="submit" className="w-full bg-cyan-500 p-5 rounded-2xl font-black text-black hover:bg-cyan-400 transition-all uppercase">
                {editingId ? 'Sačuvaj izmene' : 'Objavi novi rad'}
              </button>
           </form>
        </div>

        {/* LISTA PROJEKATA ZA IZMENU */}
        <div className="space-y-4">
          <h2 className="text-white/40 uppercase text-xs font-black tracking-widest ml-4">Lista tvojih radova</h2>
          {projekti.map((p) => (
            <div key={p.id} className="flex items-center justify-between bg-white/5 p-6 rounded-3xl border border-white/5 hover:border-cyan-500/20 transition-all group">
              <span className="font-bold text-white group-hover:text-cyan-400 transition-colors">{p.naslov}</span>
              <button onClick={() => { setEditingId(p.id); setFormData(p); window.scrollTo(0,0); }} className="p-3 bg-white/5 rounded-xl hover:bg-cyan-500 hover:text-black transition-all">
                <FaEdit />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
