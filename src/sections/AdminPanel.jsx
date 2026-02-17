import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; 
import { motion } from 'framer-motion';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const AdminPanel = () => {
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [projekti, setProjekti] = useState([]);
  const [editingId, setEditingId] = useState(null); // Prati koji projekat menjamo
  
  const [formData, setFormData] = useState({
    naslov: '', opis: '', detaljan_tekst: '', tip_medija: 'slika', izvor_medija: '', tehnologija: ''
  });

  // 1. Učitaj sve projekte da bismo ih videli u listi
  const fetchProjects = async () => {
    const { data } = await supabase.from('projects').select('*').order('id', { ascending: false });
    if (data) setProjekti(data);
  };

  useEffect(() => {
    if (isAuthorized) fetchProjects();
  }, [isAuthorized]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'zdravko123') setIsAuthorized(true);
    else alert('Pristup odbijen.');
  };

  // 2. Funkcija koja popunjava formu podacima postojećeg projekta
  const startEdit = (projekat) => {
    setEditingId(projekat.id);
    setFormData({
      naslov: projekat.naslov,
      opis: projekat.opis,
      detaljan_tekst: projekat.detaljan_tekst,
      tip_medija: projekat.tip_medija,
      izvor_medija: projekat.izvor_medija,
      tehnologija: projekat.tehnologija
    });
    window.scrollTo(0, 0); // Vrati na vrh gde je forma
  };

  // 3. Glavna funkcija za slanje (Insert ili Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (editingId) {
      // HIRURŠKI ZAHVAT: Update postojećeg reda
      const { error } = await supabase
        .from('projects')
        .update(formData)
        .eq('id', editingId); // "Gde je ID jednak onom koji menjamo"

      if (error) alert("Greška pri ažuriranju: " + error.message);
      else alert("Projekat uspešno ažuriran!");
    } else {
      // Standardni Insert novog projekta
      const { error } = await supabase.from('projects').insert([formData]);
      if (error) alert("Greška pri unosu: " + error.message);
      else alert("Novi projekat dodat!");
    }

    setEditingId(null);
    setFormData({ naslov: '', opis: '', detaljan_tekst: '', tip_medija: 'slika', izvor_medija: '', tehnologija: '' });
    fetchProjects(); // Osveži listu
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#03040b] px-4">
        <form onSubmit={handleLogin} className="bg-white/10 p-10 rounded-[40px] border border-white/20 w-full max-w-md backdrop-blur-2xl">
          <h2 className="text-white text-2xl font-black mb-8 text-center uppercase">Admin Login</h2>
          <input type="password" placeholder="Šifra" className="w-full p-4 bg-black/50 border border-white/10 rounded-2xl text-white mb-6 outline-none" onChange={(e) => setPassword(e.target.value)} />
          <button className="w-full bg-cyan-500 py-4 rounded-2xl font-black text-black hover:bg-cyan-400 transition-all">UĐI</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 bg-[#03040b] text-white">
      <div className="max-w-4xl mx-auto">
        
        {/* FORMA ZA UNOS/IZMENU */}
        <div className="bg-white/5 backdrop-blur-3xl p-8 rounded-[40px] border border-white/10 shadow-2xl mb-12">
          <h1 className="text-2xl font-black mb-8 text-cyan-400 uppercase tracking-widest">
            {editingId ? `MENJAŠ PROJEKAT (ID: ${editingId})` : 'DODAJ NOVI PROJEKAT'}
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-4 text-black font-medium">
            <input type="text" placeholder="Naslov" className="w-full p-4 bg-white rounded-2xl" value={formData.naslov} onChange={(e) => setFormData({...formData, naslov: e.target.value})} required />
            <input type="text" placeholder="Kratak opis" className="w-full p-4 bg-white rounded-2xl" value={formData.opis} onChange={(e) => setFormData({...formData, opis: e.target.value})} required />
            <textarea placeholder="Detaljan tekst" className="w-full p-4 bg-white rounded-2xl h-32" value={formData.detaljan_tekst} onChange={(e) => setFormData({...formData, detaljan_tekst: e.target.value})} required />
            <div className="grid grid-cols-2 gap-4">
              <select className="p-4 bg-white rounded-2xl" value={formData.tip_medija} onChange={(e) => setFormData({...formData, tip_medija: e.target.value})}>
                <option value="slika">Slika</option>
                <option value="video">Video</option>
              </select>
              <input type="text" placeholder="Tehnologije" className="p-4 bg-white rounded-2xl" value={formData.tehnologija} onChange={(e) => setFormData({...formData, tehnologija: e.target.value})} required />
            </div>
            <input type="text" placeholder="URL slike/videa" className="w-full p-4 bg-white rounded-2xl" value={formData.izvor_medija} onChange={(e) => setFormData({...formData, izvor_medija: e.target.value})} required />
            
            <div className="flex gap-4">
              <button type="submit" className="flex-grow bg-cyan-500 p-5 rounded-2xl font-black text-black hover:bg-cyan-400 transition-all uppercase">
                {editingId ? 'Sačuvaj izmene' : 'Objavi projekat'}
              </button>
              {editingId && (
                <button type="button" onClick={() => {setEditingId(null); setFormData({naslov:'', opis:'', detaljan_tekst:'', tip_medija:'slika', izvor_medija:'', tehnologija:''})}} className="bg-red-500/20 text-red-500 px-8 rounded-2xl font-bold uppercase border border-red-500/20 hover:bg-red-500 hover:text-white transition-all">
                  Otkaži
                </button>
              )}
            </div>
          </form>
        </div>

        {/* LISTA POSTOJEĆIH PROJEKATA */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold mb-6 text-white/50 uppercase tracking-widest">Postojeći projekti u bazi:</h2>
          {projekti.map((p) => (
            <div key={p.id} className="flex items-center justify-between bg-white/5 p-6 rounded-3xl border border-white/5 hover:border-white/10 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-black">
                  <img src={p.izvor_medija} className="w-full h-full object-cover opacity-50" />
                </div>
                <div>
                  <h3 className="font-bold text-white">{p.naslov}</h3>
                  <p className="text-xs text-white/40">ID: {p.id}</p>
                </div>
              </div>
              <button onClick={() => startEdit(p)} className="p-4 bg-white/5 rounded-2xl hover:bg-cyan-500 hover:text-black transition-all">
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