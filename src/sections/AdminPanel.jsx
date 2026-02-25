import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; // Proveri da li je ovo tvoja putanja!
import { motion } from 'framer-motion';
import { FaEdit, FaTrash, FaPlus, FaSignOutAlt } from 'react-icons/fa';
import AdminAboutEditor from '../components/admin/AdminAboutEditor';

const AdminPanel = () => {
  const [projekti, setProjekti] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjekti();
  }, []);

  const fetchProjekti = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('id', { ascending: false });

      if (error) throw error;
      setProjekti(data || []);
    } catch (error) {
      console.error('Greška pri učitavanju:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const potvrda = window.confirm("Da li ste sigurni? Brisanje je trajno.");
    if (potvrda) {
      try {
        const { error } = await supabase
          .from('projects')
          .delete()
          .eq('id', id);

        if (error) throw error;
        setProjekti(projekti.filter(p => p.id !== id));
        alert("Projekat uspešno obrisan.");
      } catch (error) {
        alert("Greška pri brisanju: " + error.message);
      }
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-4 md:p-8">
      {/* HEADER ADMNA */}
      <div className="max-w-7xl mx-auto flex justify-between items-center mb-12 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-slate-400 text-sm mt-1">Dobrodošao nazad, Zdravko</p>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 bg-slate-800 hover:bg-red-900/40 text-slate-300 hover:text-red-400 px-4 py-2 rounded-lg transition-all border border-slate-700"
        >
          <FaSignOutAlt /> Odjavi se
        </button>
      </div>

      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* SEKCIJA 1: ABOUT EDITOR */}
        <section className="bg-slate-900/30 p-6 rounded-2xl border border-slate-800">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
            Uređivanje "O meni" sekcije
          </h2>
          <AdminAboutEditor />
        </section>

        {/* SEKCIJA 2: PROJEKTI */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
              Upravljanje Projektima
            </h2>
            <button className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white px-5 py-2 rounded-full transition-all shadow-lg shadow-cyan-900/20">
              <FaPlus size={14} /> Dodaj novi projekat
            </button>
          </div>

          {loading ? (
            <div className="text-center py-20 text-slate-500">Učitavanje projekata...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projekti.map((proj) => (
                <motion.div 
                  key={proj.id} 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden hover:border-cyan-500/50 transition-all group"
                >
                  {/* Slika */}
                  <div className="h-48 overflow-hidden bg-slate-800 relative">
                    {proj.slika_url ? (
                      <img 
                        src={proj.slika_url} 
                        alt={proj.naslov} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-slate-600">Nema slike</div>
                    )}
                  </div>

                  {/* Sadržaj */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[10px] text-cyan-500 font-mono font-bold tracking-widest uppercase bg-cyan-950/30 px-2 py-1 rounded">
                        ID: {proj.id}
                      </span>
                    </div>
                    
                    <h3 className="font-bold text-lg text-white mb-2 group-hover:text-cyan-400 transition-colors">
                      {proj.naslov}
                    </h3>
                    
                    <p className="text-sm text-slate-400 line-clamp-2 mb-6 h-10">
                      {proj.opis}
                    </p>

                    {/* Akcije */}
                    <div className="flex justify-end gap-4 pt-4 border-t border-slate-800/50">
                      <button 
                        className="p-2 text-slate-400 hover:text-cyan-400 transition-colors"
                        title="Izmeni"
                      >
                        <FaEdit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(proj.id)} 
                        className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                        title="Obriši"
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default AdminPanel;