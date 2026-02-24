import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

const AdminAboutEditor = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  // 1. Učitaj trenutni tekst iz baze čim otvoriš Admin panel
  useEffect(() => {
    const fetchCurrentText = async () => {
      const { data } = await supabase
        .from('site_settings')
        .select('content')
        .eq('section_name', 'about_me')
        .single();
      if (data) setText(data.content);
    };
    fetchCurrentText();
  }, []);

  // 2. Funkcija za čuvanje (bez pisanja ijedne linije koda kasnije)
  const handleSave = async () => {
    setLoading(true);
    setStatus('Snimanje u toku...');

    const { error } = await supabase
      .from('site_settings')
      .upsert(
        { section_name: 'about_me', content: text }, 
        { onConflict: 'section_name' }
      );

    setLoading(false);
    if (error) {
      setStatus('Greška: ' + error.message);
    } else {
      setStatus('✅ Uspešno sačuvano! Osveži sajt da vidiš promenu.');
      setTimeout(() => setStatus(''), 3000);
    }
  };

  return (
    <div className="bg-slate-900 p-8 rounded-2xl border border-white/10 mt-10">
      <h3 className="text-xl font-bold text-white mb-4">Uredi "O meni" sekciju</h3>
      
      <textarea
        className="w-full h-64 bg-black/50 text-blue-100 p-4 rounded-xl border border-white/20 focus:border-cyan-500 outline-none transition-all"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Unesite vašu biografiju ovde..."
      />

      <div className="flex items-center gap-4 mt-4">
        <button
          onClick={handleSave}
          disabled={loading}
          className="px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl transition-all disabled:opacity-50"
        >
          {loading ? 'ČUVANJE...' : 'SAČUVAJ PROMENE'}
        </button>
        
        <p className="text-sm text-cyan-400 font-mono">{status}</p>
      </div>
    </div>
  );
};

export default AdminAboutEditor;