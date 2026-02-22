import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; 
import { motion } from 'framer-motion';
import { FaLock, FaSignOutAlt, FaPlus, FaEdit, FaSpinner } from 'react-icons/fa';

const AdminPanel = () => {
  // --- STATE (Logika pamćenja podataka) ---
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

  // --- 1. AUTOMATSKA PROVERA (Da li si već ulogovan?) ---
  useEffect(() => {
    // Proveri trenutnu sesiju
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Slušaj promene (npr. ako se odjaviš u drugom tabu)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // --- 2. FUNKCIJA ZA LOGIN (Povezivanje sa bazom) ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Hirurški zahvat: Pitamo Supabase da li su Email i Šifra tačni
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      alert("Greška: " + error.message);
    }
    setLoading(false);
  };

  // --- 3. FUNKCIJA ZA LOGOUT (Odjava) ---
  const handleLogout = async () => {
    await supabase.auth.signOut();
    alert("Odjavljeni ste iz sistema.");
  };

  // --- Ostale funkcije za rad sa projektima (Fetch, Submit, Upload) ostaju iste ---
  const fetchProjects = async () => {
    const { data } = await supabase.from('projects').select('*').order('id', { ascending: false });
    if (data) setProjekti(data);
  };

  useEffect(() => {
    if (session) fetchProjects();
  }, [session]);

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
      alert("Dodato!");
    }
    setEditingId(null);
    setFormData({ naslov: '', opis: '', detaljan_tekst: '', tip_medija: 'slika', izvor_medija: '', tehnologija: '' });
    fetchProjects();
  };

  // --- RENDERING (Šta lekar vidi na ekranu) ---

  // Ako NISI ulogovan, prikaži LOGIN EKRAN
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#03040b] px-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white/10 backdrop-blur-2xl p-10 rounded-[40px] border border-white/20 w-full max-w-md shadow-2xl">
          <h2 className="text-white text-2xl font-black mb-8 text-center uppercase tracking-widest">Admin Login</h2>
          <form onSubmit={handleLogin} className="space-y-4 text-black">
            <input 
              type="email" placeholder="Email" className="w-full p-4 rounded-2xl outline-none" 
              onChange={(e) => setEmail(e.target.value)} required 
            />
            <input 
              type="password" placeholder="Šifra" className="w-full p-4 rounded-2xl outline-none" 
              onChange={(e) => setPassword(e.target.value)} required 
            />
            <button className="w-full bg-cyan-500 py-4 rounded-2xl font-black text-black hover:bg-cyan-400 transition-all uppercase tracking-widest">
              {loading ? "Provera..." : "Pristupi Dashboard-u"}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // Ako JESTE ulogovan, prikaži DASHBOARD
  return (
    <div className="min-h-screen pt-40 pb-20 px-6 bg-[#03040b] text-white">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-black text-cyan-400 uppercase">Dashboard</h1>
          <button onClick={handleLogout} className="bg-red-500/20 text-red-500 px-6 py-2 rounded-full font-bold hover:bg-red-500 hover:text-white transition-all">
            ODJAVI SE
          </button>
        </div>

        {/* FORMA ZA UNOS */}
        <div className="bg-white/5 backdrop-blur-3xl p-8 rounded-[40px] border border-white/10 mb-12">
           <form onSubmit={handleSubmit} className="space-y-4 text-black">
              <input type="text" placeholder="Naslov" className="w-full p-4 rounded-2xl" value={formData.naslov} onChange={(e) => setFormData({...formData, naslov: e.target.value})} required />
              <input type="text" placeholder="Kratak opis" className="w-full p-4 rounded-2xl" value={formData.opis} onChange={(e) => setFormData({...formData, opis: e.target.value})} required />
              <textarea placeholder="Detaljan tekst" className="w-full p-4 rounded-2xl h-32" value={formData.detaljan_tekst} onChange={(e) => setFormData({...formData, detaljan_tekst: e.target.value})} required />
              <input type="text" placeholder="Tehnologije" className="w-full p-4 rounded-2xl" value={formData.tehnologija} onChange={(e) => setFormData({...formData, tehnologija: e.target.value})} required />
              <div className="bg-white/5 p-4 rounded-2xl text-white text-center border-2 border-dashed border-white/10">
                 <input type="file" onChange={handleFileUpload} className="text-xs" />
              </div>
              <input type="text" placeholder="URL medija" className="w-full p-4 rounded-2xl bg-white/10 text-white" value={formData.izvor_medija} readOnly />
              <button type="submit" className="w-full bg-cyan-500 p-5 rounded-2xl font-black text-black uppercase">{editingId ? 'Sačuvaj izmene' : 'Objavi'}</button>
           </form>
        </div>

        {/* LISTA PROJEKATA */}
        <div className="grid gap-4">
          {projekti.map(p => (
            <div key={p.id} className="bg-white/5 p-6 rounded-3xl border border-white/5 flex justify-between items-center">
              <span className="font-bold">{p.naslov}</span>
              <button onClick={() => {setEditingId(p.id); setFormData(p); window.scrollTo(0,0)}} className="text-cyan-400 p-2 hover:bg-cyan-500/20 rounded-lg"><FaEdit /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;