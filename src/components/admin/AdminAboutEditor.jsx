import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { FaSave } from 'react-icons/fa';

const AdminAboutEditor = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const fetchCurrentText = async () => {
      try {
        const { data } = await supabase.from('site_settings').select('content').eq('section_name', 'about_me').single();
        if (data) setText(data.content);
      } catch (error) {
        console.log("Inicijalizacija baze...");
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
    <div className="bg-white/5 p-8 rounded-3xl border border-white/10 text-left">
      <h3 className="text-lg font-bold text-cyan-400 mb-6 italic uppercase tracking-widest text-left">Uredi "O meni" sekciju</h3>
      <textarea 
        className="w-full h-56 bg-black/50 text-blue-100 p-6 rounded-2xl border border-white/10 focus:border-cyan-400 outline-none transition-all mb-6 font-light leading-relaxed text-sm text-left shadow-inner" 
        value={text} 
        onChange={(e) => setText(e.target.value)} 
      />
      <div className="flex items-center gap-6 text-left">
        <button onClick={handleSave} disabled={loading} className="flex items-center gap-3 px-10 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-black rounded-xl transition-all text-xs uppercase tracking-widest shadow-lg shadow-cyan-900/30">
           <FaSave /> {loading ? 'Saving...' : 'Update Biography'}
        </button>
        {status && <span className="text-xs font-mono text-cyan-400 animate-pulse">{status}</span>}
      </div>
    </div>
  );
};

export default AdminAboutEditor;