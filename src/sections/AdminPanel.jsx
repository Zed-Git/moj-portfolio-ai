import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; 
// Uklonili smo 'motion' jer ga ovde nismo koristili
import { FaLock, FaSignOutAlt, FaEdit, FaTrash, FaSpinner, FaInfoCircle } from 'react-icons/fa';

const AdminPanel = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [projekti, setProjekti] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false); // Ovu varijablu sada koristimo dole kod spinera
  
  const [formData, setFormData] = useState({
    naslov: '', opis: '', detaljan_tekst: '', tip_medija: 'slika', izvor_medija: '', tehnologija: ''
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => { setSession(session); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => { setSession(session); });
    return () => subscription.unsubscribe();
  }, []);

  const fetchProjects = async () => {
    const { data } = await supabase.from('projects').select('*').order('id', { ascending: false });
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
    } else {
      await supabase.from('projects').insert([formData]);
    }
    setEditingId(null);
    setFormData({ naslov: '', opis: '', detaljan_tekst: '', tip_medija: 'slika', izvor_medija: '', tehnologija: '' });
    fetchProjects();
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#03040b] px-4">
        <div className="bg-white/10 backdrop-blur-2xl p-10 rounded-[40px] border border-white/20 w-full max-w-md shadow-2xl">
          <h2 className="text-white text-2xl font-black mb-8 text-center uppercase tracking-widest">Admin Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="email" placeholder="Email" className="w-full p-4 bg-black/50 border border-white/10 rounded-2xl text-white outline-none" onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" placeholder="Šifra" className="w-full p-4 bg-black/50 border border-white/10 rounded-2xl text-white outline-none" onChange={(e) => setPassword(e.target.value)} required />
            <button className="w-full bg-cyan-500 py-4 rounded-2xl font-black text-black uppercase">{loading ? "Učitavanje..." : "Pristupi"}</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-40 pb-20 px-6 bg-[#03040b] text-white">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-black text-cyan-400 uppercase tracking-widest">Dashboard</h1>
          <button onClick={handleLogout} className="bg-red-500/10 text-red-500 px-6 py-2 rounded-full font-bold text-xs border border-red-500/20 hover:bg-red-500 hover:text-white transition-all">ODJAVI SE</button>
        </div>

        <div className="bg-white/5 backdrop-blur-3xl p-8 rounded-[40px] border border-white/10 shadow-2xl mb-16 text-black font-medium">
          <form onSubmit={handleSubmit} className="space-y-5">
            <input type="text" placeholder="Naslov" className="w-full p-4 bg-white border-none rounded-2xl" value={formData.naslov} onChange={(e) => setFormData({...formData, naslov: e.target.value})} required />
            <input type="text" placeholder="Kratak opis" className="w-full p-4 bg-white border-none rounded-2xl" value={formData.opis} onChange={(e) => setFormData({...formData, opis: e.target.value})} required />
            <textarea placeholder="Tehnički tekst" className="w-full p-4 bg-white border-none rounded-2xl h-40" value={formData.detaljan_tekst} onChange={(e) => setFormData({...formData, detaljan_tekst: e.target.value})} required />
            <input type="text" placeholder="Tehnologije" className="w-full p-4 bg-white border-none rounded-2xl" value={formData.tehnologija} onChange={(e) => setFormData({...formData, tehnologija: e.target.value})} required />
            
            <div className="bg-cyan-500/5 border-2 border-dashed border-cyan-500/20 p-8 rounded-3xl text-center">
              <input type="file" onChange={handleFileUpload} className="text-xs text-white" />
              {uploading && <p className="text-cyan-400 text-[10px] mt-4 animate-pulse uppercase flex items-center justify-center gap-2"><FaSpinner className="animate-spin" /> Transfer u toku...</p>}
            </div>

            <input type="text" placeholder="URL" className="w-full p-4 bg-white/10 text-white rounded-2xl border border-white/10" value={formData.izvor_medija} readOnly />
            
            <button type="submit" className="w-full bg-cyan-500 p-5 rounded-2xl font-black text-black uppercase tracking-widest hover:bg-cyan-400 shadow-xl shadow-cyan-500/10">
              {editingId ? 'Sačuvaj izmene' : 'Objavi rad'}
            </button>
          </form>
        </div>

        <div className="space-y-4">
          {projekti.map(p => (
            <div key={p.id} className="bg-white/5 p-6 rounded-3xl border border-white/5 flex justify-between items-center group">
              <span className="font-bold text-white group-hover:text-cyan-400 transition-colors uppercase tracking-tight">{p.naslov}</span>
              <div className="flex gap-3">
                <button onClick={() => {setEditingId(p.id); setFormData(p); window.scrollTo(0,0)}} className="text-cyan-400 p-3 bg-white/5 rounded-2xl hover:bg-cyan-500 hover:text-black transition-all"><FaEdit /></button>
                <button onClick={() => handleDelete(p.id, p.naslov)} className="text-red-400 p-3 bg-white/5 rounded-2xl hover:bg-red-500 hover:text-white transition-all"><FaTrash /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;