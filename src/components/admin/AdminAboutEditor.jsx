import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

const AdminAboutEditor = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const fetchCurrentText = async () => {
      try {
        const { data } = await supabase.from('site_settings').select('content').eq('section_name', 'about_me').single();
        if (data) setText(data.content);
      } catch (err) {
        console.log("Inicijalno učitavanje baze...");
      }
    };
    fetchCurrentText();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    setStatus('Snimanje...');
    const { error } = await supabase.from('site_settings').upsert({ section_name: 'about_me', content: text }, { onConflict: 'section_name' });
    setLoading(false);
    if (error) setStatus('Greška: ' + error.message);
    else {
      setStatus('✅ Uspešno sačuvano!');
      setTimeout(() => setStatus(''), 3000);
    }
  };

  return (
    <div className="bg-white/5 p-6 rounded-2xl border border-white/10 text-left">
      <h3 className="text-lg font-bold text-cyan-400 mb-4 italic uppercase tracking-widest text-left">Uredi "O meni" sekciju</h3>
      <textarea className="w-full h-48 bg-black/50 text-blue-100 p-4 rounded-xl border border-white/10 focus:border-cyan-400 outline-none transition-all mb-4 font-light leading-relaxed text-sm text-left" value={text} onChange={(e) => setText(e.target.value)} />
      <div className="flex items-center gap-4 text-left">
        <button onClick={handleSave} disabled={loading} className="px-8 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition-all text-xs uppercase tracking-widest text-left">{loading ? 'Čuvanje...' : 'Sačuvaj'}</button>
        {status && <span className="text-xs font-mono text-cyan-400 italic text-left">{status}</span>}
      </div>
    </div>
  );
};

export default AdminAboutEditor;