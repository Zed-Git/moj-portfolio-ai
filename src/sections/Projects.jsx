import React, { useEffect, useState } from 'react'; // Dodali smo useState i useEffect
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient'; // Uvozimo vezu sa bazom

const Projects = () => {
  // 1. Pravimo "stanje" (state) u koje ćemo smestiti podatke iz baze
  const [projektiIzBaze, setProjektiIzBaze] = useState([]);
  const [loading, setLoading] = useState(true);

  // 2. Funkcija koja ide u Supabase i uzima podatke
  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects') // Ime tvoje tabele
        .select('*')      // Uzmi sve kolone
        .order('id', { ascending: true });

      if (error) throw error;
      setProjektiIzBaze(data);
    } catch (error) {
      console.error("Greška pri čitanju:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // 3. useEffect pokreće čitanje čim se stranica učita
  useEffect(() => {
    fetchProjects();
  }, []);

  if (loading) return <div className="text-center text-white py-20 uppercase tracking-widest text-xs">Učitavanje medicinske baze...</div>;

  return (
    <section id="projects" className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl font-black text-white mb-16 uppercase tracking-[0.2em] text-center">Moji AI Projekti</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {projektiIzBaze.map((projekat, index) => (
            <motion.div 
              key={projekat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-[#03040b]/40 backdrop-blur-xl border border-white/10 rounded-[40px] overflow-hidden group hover:border-cyan-500/30 transition-all shadow-2xl"
            >
              {/* SLIKA ILI VIDEO */}
              <div className="h-72 w-full bg-black overflow-hidden relative">
                {projekat.tip_medija === "slika" ? (
                  <img src={projekat.izvor_medija} alt={projekat.naslov} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <video src={projekat.izvor_medija} autoPlay muted loop playsInline onEnded={(e) => e.target.play()} className="w-full h-full object-cover" />
                )}
                <div className="absolute inset-0 bg-linear-to-t from-[#03040b] to-transparent opacity-40"></div>
              </div>

              {/* TEKST */}
              <div className="p-8">
                <h3 className="text-xl font-bold text-white uppercase mb-4">{projekat.naslov}</h3>
                <p className="text-blue-100/60 leading-relaxed font-light mb-6 text-sm line-clamp-2">{projekat.opis}</p>
                <Link to={`/project/${projekat.id}`} className="mt-8 flex items-center text-cyan-400 text-[10px] font-black tracking-[0.2em] uppercase cursor-pointer group-hover:text-white transition-colors">
                  Tehnička dokumentacija <span className="ml-2 group-hover:translate-x-2 transition-transform">→</span>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default Projects;