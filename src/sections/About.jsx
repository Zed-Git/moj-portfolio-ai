import React, { useState, useEffect } from 'react'; // 1. Dodali smo Hooks
import { supabase } from '../supabaseClient'; // 2. Proveri da li je putanja do klijenta tačna

const About = () => {
  // 3. Stanje za čuvanje teksta iz baze
  const [aboutContent, setAboutContent] = useState('');
  const [loading, setLoading] = useState(true);

  // 4. Funkcija koja ide u bazu po tekst
  useEffect(() => {
    const fetchAboutText = async () => {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('content')
          .eq('section_name', 'about_me')
          .single();

        if (error) throw error;
        if (data) setAboutContent(data.content);
      } catch (err) {
        console.error('Greška pri učitavanju About teksta:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutText();
  }, []);

  return (
    <section id="about" className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-black text-white mb-12 uppercase tracking-widest">ABOUT</h2>
        
        <div className="grid md:grid-cols-2 gap-16 items-center">
          
          {/* 5. Ovde prikazujemo tekst iz baze */}
          <div className="space-y-6 text-blue-100/70 text-lg leading-relaxed font-light text-left">
            {loading ? (
              <p className="animate-pulse">Učitavanje podataka...</p>
            ) : (
              // 'whitespace-pre-line' omogućava da se novi redovi iz baze vide i na sajtu
              <p className="whitespace-pre-line">
                {aboutContent || "Ovde će se pojaviti vaš tekst iz baze."}
              </p>
            )}
          </div>

          <div className="bg-white/5 p-8 rounded-3xl border border-white/10 text-left">
            <h3 className="text-cyan-400 font-bold mb-6 uppercase tracking-widest text-sm">Ekspertiza</h3>
            <div className="flex flex-wrap gap-3">
              {['Medicina', 'AI', 'React', 'Python', 'Tailwind'].map((skill) => (
                <span key={skill} className="px-4 py-2 bg-white/5 rounded-xl border border-white/10 text-white/80 text-sm font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
