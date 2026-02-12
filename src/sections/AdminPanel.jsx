import React, { useState } from 'react';
import { supabase } from '../supabaseClient'; 

const AdminPanel = () => {
  const [formData, setFormData] = useState({
    naslov: '', opis: '', detaljan_tekst: '', tip_medija: 'slika', izvor_medija: '', tehnologija: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('projects').insert([formData]);
    if (error) alert("Greška: " + error.message);
    else {
      alert("Projekat dodat u bazu!");
      setFormData({ naslov: '', opis: '', detaljan_tekst: '', tip_medija: 'slika', izvor_medija: '', tehnologija: '' });
    }
  };

  return (
    <div className="min-h-screen pt-40 px-6 bg-transparent text-white relative z-50">
      <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-3xl p-10 rounded-[40px] border border-white/20 shadow-2xl">
        <h1 className="text-3xl font-black mb-8 text-cyan-400 uppercase tracking-widest text-center">Admin Panel</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Naslov" className="w-full p-4 bg-black/50 border border-white/10 rounded-2xl text-white outline-none" value={formData.naslov} onChange={(e) => setFormData({...formData, naslov: e.target.value})} required />
          <input type="text" placeholder="Kratak opis" className="w-full p-4 bg-black/50 border border-white/10 rounded-2xl text-white outline-none" value={formData.opis} onChange={(e) => setFormData({...formData, opis: e.target.value})} required />
          <textarea placeholder="Detaljan tekst" className="w-full p-4 bg-black/50 border border-white/10 rounded-2xl text-white h-32 outline-none" value={formData.detaljan_tekst} onChange={(e) => setFormData({...formData, detaljan_tekst: e.target.value})} required />
          <input type="text" placeholder="URL slike/videa" className="w-full p-4 bg-black/50 border border-white/10 rounded-2xl text-white outline-none" value={formData.izvor_medija} onChange={(e) => setFormData({...formData, izvor_medija: e.target.value})} required />
          <input type="text" placeholder="Tehnologije" className="w-full p-4 bg-black/50 border border-white/10 rounded-2xl text-white outline-none" value={formData.tehnologija} onChange={(e) => setFormData({...formData, tehnologija: e.target.value})} required />
          <button type="submit" className="w-full bg-cyan-500 p-5 rounded-2xl font-black text-black hover:bg-cyan-400 transition-all uppercase">Sačuvaj u bazu</button>
        </form>
      </div>
    </div>
  );
};

export default AdminPanel;