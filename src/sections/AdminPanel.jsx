import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; 
import { motion } from 'framer-motion';
import { FaEdit, FaUpload, FaSpinner } from 'react-icons/fa';

const AdminPanel = () => {
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [projekti, setProjekti] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false); // Indikator da je upload u toku
  
  const [formData, setFormData] = useState({
    naslov: '', opis: '', detaljan_tekst: '', tip_medija: 'slika', izvor_medija: '', tehnologija: ''
  });

  const fetchProjects = async () => {
    const { data } = await supabase.from('projects').select('*').order('id', { ascending: false });
    if (data) setProjekti(data);
  };

  useEffect(() => {
    if (isAuthorized) fetchProjects();
  }, [isAuthorized]);

  // --- NOVA FUNKCIJA ZA AUTOMATSKI UPLOAD FAJLA ---
  const handleFileUpload = async (event) => {
    try {
      setUploading(true);
      const file = event.target.files[0];
      if (!file) return;

      // Pravimo unikatno ime fajla (vreme + ime) da ne bismo pregazili stare
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      // 1. Šaljemo fajl u Supabase Storage "media" bucket
      let { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Uzimamo JAVNI URL tog fajla
      const { data } = supabase.storage.from('media').getPublicUrl(filePath);

      // 3. Automatski upisujemo taj URL u formu
      setFormData({ ...formData, izvor_medija: data.publicUrl });
      alert("Fajl je uspešno uskladišten u bazu!");

    } catch (error) {
      alert("Greška pri uploadu: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'zdravko123') setIsAuthorized(true);
    else alert('Pristup odbijen.');
  };

  const startEdit = (projekat) => {
    setEditingId(projekat.id);
    setFormData({
      naslov: projekat.naslov, opis: projekat.opis, detaljan_tekst: projekat.detaljan_tekst,
      tip_medija: projekat.tip_medija, izvor_medija: projekat.izvor_medija, tehnologija: projekat.tehnologija
    });
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      const { error } = await supabase.from('projects').update(formData).eq('id', editingId);
      if (!error) alert("Projekat ažuriran!");
    } else {
      const { error } = await supabase.from('projects').insert([formData]);
      if (!error) alert("Novi projekat dodat!");
    }
    setEditingId(null);
    setFormData({ naslov: '', opis: '', detaljan_tekst: '', tip_medija: 'slika', izvor_medija: '', tehnologija: '' });
    fetchProjects();
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#03040b] px-4">
        <form onSubmit={handleLogin} className="bg-white/10 p-10 rounded-[40px] border border-white/20 w-full max-w-md backdrop-blur-2xl">
          <h2 className="text-white text-2xl font-black mb-8 text-center uppercase">Admin Login</h2>
          <input type="password" placeholder="Šifra" className="w-full p-4 bg-black/50 border border-white/10 rounded-2xl text-white mb-6 outline-none" onChange={(e) => setPassword(e.target.value)} />
          <button className="w-full bg-cyan-500 py-4 rounded-2xl font-black text-black hover:bg-cyan-400 transition-all uppercase">Uđi</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 bg-[#03040b] text-white">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/5 backdrop-blur-3xl p-8 rounded-[40px] border border-white/10 shadow-2xl mb-12">
          <h1 className="text-2xl font-black mb-8 text-cyan-400 uppercase">{editingId ? 'Izmena projekta' : 'Novi projekat'}</h1>
          
          <form onSubmit={handleSubmit} className="space-y-4 text-black font-medium">
            {/* ... Polja za naslov, opis, detaljan tekst ostaju ista ... */}
            <input type="text" placeholder="Naslov" className="w-full p-4 bg-white rounded-2xl" value={formData.naslov} onChange={(e) => setFormData({...formData, naslov: e.target.value})} required />
            <input type="text" placeholder="Kratak opis" className="w-full p-4 bg-white rounded-2xl" value={formData.opis} onChange={(e) => setFormData({...formData, opis: e.target.value})} required />
            <textarea placeholder="Stručni tekst" className="w-full p-4 bg-white rounded-2xl h-32" value={formData.detaljan_tekst} onChange={(e) => setFormData({...formData, detaljan_tekst: e.target.value})} required />
            
            <div className="grid grid-cols-2 gap-4">
              <select className="p-4 bg-white rounded-2xl" value={formData.tip_medija} onChange={(e) => setFormData({...formData, tip_medija: e.target.value})}>
                <option value="slika">Slika</option>
                <option value="video">Video</option>
              </select>
              <input type="text" placeholder="Tehnologije" className="p-4 bg-white rounded-2xl" value={formData.tehnologija} onChange={(e) => setFormData({...formData, tehnologija: e.target.value})} required />
            </div>

            {/* --- NOVO: SEKCIJA ZA UPLOAD FAJLA --- */}
            <div className="bg-cyan-500/5 border-2 border-dashed border-cyan-500/20 p-6 rounded-2xl">
              <label className="block text-cyan-400 text-xs font-black mb-4 uppercase tracking-widest text-center">
                Otpremi fajl direktno u bazu
              </label>
              <div className="flex flex-col items-center gap-4">
                <input 
                  type="file" 
                  accept="image/*,video/*" 
                  onChange={handleFileUpload} 
                  disabled={uploading}
                  className="text-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-cyan-500 file:text-black hover:file:bg-cyan-400 cursor-pointer"
                />
                {uploading && <p className="text-cyan-400 animate-pulse text-xs uppercase flex items-center gap-2"><FaSpinner className="animate-spin" /> Slanje u digitalni magacin...</p>}
              </div>
            </div>

            <input type="text" placeholder="URL će se ovde sam upisati..." className="w-full p-4 bg-white/10 text-white rounded-2xl border border-white/10" value={formData.izvor_medija} readOnly />
            
            <div className="flex gap-4">
              <button type="submit" className="flex-grow bg-cyan-500 p-5 rounded-2xl font-black text-black hover:bg-cyan-400 transition-all uppercase">Sačuvaj</button>
            </div>
          </form>
        </div>

        {/* LISTA PROJEKATA ostaje ista... */}
        <div className="space-y-4">
          {projekti.map((p) => (
            <div key={p.id} className="flex items-center justify-between bg-white/5 p-6 rounded-3xl border border-white/5">
              <div className="flex items-center gap-4">
                <h3 className="font-bold text-white">{p.naslov}</h3>
              </div>
              <button onClick={() => startEdit(p)} className="p-4 bg-white/5 rounded-2xl hover:bg-cyan-500 transition-all"><FaEdit /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;