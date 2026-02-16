import React, { useState } from 'react';
import { supabase } from '../supabaseClient'; 
import { motion } from 'framer-motion';

const AdminPanel = () => {
  // SVI HOOKS MORAJU BITI OVDE - UNUTAR FUNKCIJE
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [formData, setFormData] = useState({
    naslov: '', opis: '', detaljan_tekst: '', tip_medija: 'slika', izvor_medija: '', tehnologija: ''
  });

  // Funkcija za provere šifre
  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'zdravko123') { // Ovde je tvoja šifra
      setIsAuthorized(true);
    } else {
      alert('Pristup odbijen. Pogrešna licenca.');
    }
  };

  // Funkcija za slanje u bazu
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('projects').insert([formData]);
    if (error) alert("Greška: " + error.message);
    else {
      alert("Projekat dodat u bazu!");
      setFormData({ naslov: '', opis: '', detaljan_tekst: '', tip_medija: 'slika', izvor_medija: '', tehnologija: '' });
    }
  };

  // 1. Ako nije autorizovan, prikaži LOGIN FORMU
  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#03040b] px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/10 backdrop-blur-2xl p-10 rounded-[40px] border border-white/20 w-full max-w-md shadow-2xl"
        >
          <h2 className="text-white text-2xl font-black mb-8 text-center uppercase tracking-widest">Admin Login</h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <input 
              type="password" 
              placeholder="Unesite tajni ključ"
              className="w-full p-4 bg-black/50 border border-white/10 rounded-2xl text-white outline-none focus:border-cyan-400 transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="w-full bg-cyan-500 py-4 rounded-2xl font-black text-black hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/20 uppercase tracking-widest">
              Uđi u sistem
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // 2. Ako JESTE autorizovan, prikaži DASHBOARD
  return (
    <div className="min-h-screen pt-40 px-6 bg-[#03040b] text-white">
      <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-3xl p-10 rounded-[40px] border border-white/20 shadow-2xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-black text-cyan-400 uppercase tracking-widest">Admin Panel</h1>
          <button onClick={() => setIsAuthorized(false)} className="text-white/40 text-xs hover:text-white uppercase">Odjavi se</button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4 text-black">
          <input type="text" placeholder="Naslov" className="w-full p-4 bg-white border-none rounded-2xl" value={formData.naslov} onChange={(e) => setFormData({...formData, naslov: e.target.value})} required />
          <input type="text" placeholder="Kratak opis" className="w-full p-4 bg-white border-none rounded-2xl" value={formData.opis} onChange={(e) => setFormData({...formData, opis: e.target.value})} required />
          <textarea placeholder="Detaljan tekst" className="w-full p-4 bg-white border-none rounded-2xl h-32" value={formData.detaljan_tekst} onChange={(e) => setFormData({...formData, detaljan_tekst: e.target.value})} required />
          
          <div className="grid grid-cols-2 gap-4">
            <select className="p-4 bg-white border-none rounded-2xl" value={formData.tip_medija} onChange={(e) => setFormData({...formData, tip_medija: e.target.value})}>
              <option value="slika">Slika</option>
              <option value="video">Video</option>
            </select>
            <input type="text" placeholder="Tehnologije" className="p-4 bg-white border-none rounded-2xl" value={formData.tehnologija} onChange={(e) => setFormData({...formData, tehnologija: e.target.value})} required />
          </div>
          
          <input type="text" placeholder="URL slike/videa" className="w-full p-4 bg-white border-none rounded-2xl" value={formData.izvor_medija} onChange={(e) => setFormData({...formData, izvor_medija: e.target.value})} required />
          
          <button type="submit" className="w-full bg-cyan-500 p-5 rounded-2xl font-black text-black hover:bg-cyan-400 transition-all uppercase shadow-xl shadow-cyan-500/10">
            Sačuvaj u bazu
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminPanel;