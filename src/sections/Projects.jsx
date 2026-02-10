import React from 'react';
import { motion } from 'framer-motion';



// 1. UVOZIMO ASSETSE
// Proveri da li se fajlovi u assets folderu zovu BAŠ OVAKO (pazi na .jpg vs .jpeg)
import slikaRadiologija from '../assets/medical-logo.jpg'; 
import videoDemo from '../assets/moj-video.mp4'; 
import slikaBioStatAnalitičar from '../assets/project4.jpg';
import slikaTelemedicinaApp from '../assets/project3.jpg'; 
import videoDemo2 from '../assets/moj-video2.mp4';
import videoDemo3 from '../assets/moj-video4.mp4';



const mojiProjekti = [
  { 
    id: 1, 
    naslov: "AI Radiologija", 
    opis: "Sistem za ranu detekciju anomalija na rendgenskim snimcima.",
    detaljanTekst: "Ovaj projekat koristi konvolucione neuronske mreže za analizu plućnih snimaka.",
    tipMedija: "slika",
    izvorMedija: slikaRadiologija 
  },
  { 
    id: 2, 
    naslov: "AI Analiza EKG-a", 
    opis: "Video demonstracija prepoznavanja aritmija u realnom vremenu.",
    detaljanTekst: "Model obučen na 100.000 EKG zapisa. Prikazuje detekciju atrijalne fibrilacije.",
    tipMedija: "video",
    izvorMedija: videoDemo
  },
  { 
    id: 3,
    naslov: "Bio-Stat Analitičar", 
    opis: "Alat za statističku obradu kliničkih istraživanja u realnom vremenu.",
    detaljanTekst: "Koristi napredne algoritme za analizu kliničkih podataka i generisanje izveštaja.",
    tipMedija: "slika",
    izvorMedija: slikaBioStatAnalitičar
  },
  { 
    id: 4, 
    naslov: "Telemedicina App", 
    opis: "Platforma za video konsultacije sa integrisanim AI asistentom.",
    detaljanTekst: "Omogućava pacijentima da zakažu preglede i dobiju preliminarne dijagnoze putem AI chatbota.",
    tipMedija: "slika",
    izvorMedija: slikaTelemedicinaApp
  },
    { 
      id: 5, 
      naslov: "Farmako-Bot", 
      opis: "Pametni sistem za proveru interakcije lekova i alergija.",
      detaljanTekst: "AI alat koji pomaže lekarima da izbegnu negativne interakcije lekova prilikom propisivanja terapija.",
      tipMedija: "video",
      izvorMedija: videoDemo2
    },
    { 
      id: 6, 
      naslov: "Genomika AI", 
      opis: "Video prikaz analize genetskih podataka za personalizovanu medicinu.",
      detaljanTekst: "AI model koji analizira genetske sekvence kako bi identifikovao predispozicije za bolesti.",
      tipMedija: "video",
      izvorMedija: videoDemo3
    },
  
];

const Projects = () => {
  return (
    <section id="projects" className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl font-black text-white mb-16 uppercase tracking-[0.2em] text-center">
          Moji AI Projekti
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {mojiProjekti.map((projekat, index) => (
            <motion.div 
              key={projekat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-[#03040b]/40 backdrop-blur-xl border border-white/10 rounded-[40px] overflow-hidden group hover:border-cyan-500/30 transition-all shadow-2xl"
            >
              
              {/* --- MULTIMEDIJA SEKCIJA --- */}
              <div className="h-72 w-full bg-black overflow-hidden relative">
                {projekat.tipMedija === "slika" ? (
                  <img 
                    src={projekat.izvorMedija} 
                    alt={projekat.naslov}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
<video 
  src={projekat.izvorMedija} 
  autoPlay 
  muted 
  loop 
  playsInline 
  disablePictureInPicture
  preload="auto"
  // DODAJEMO OVO: Čim se video završi (Ended), naredi mu da krene ponovo (Play)
  onEnded={(e) => e.target.play()} 
  className="w-full h-full object-cover"
/>
                )}
                {/* Suptilni preliv preko medija da se bolje spoji sa karticom */}
                <div className="absolute inset-0 bg-linear-to-t from-[#03040b] to-transparent opacity-40"></div>
              </div>

              {/* --- TEKSTUALNI SADRŽAJ --- */}
              <div className="p-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-white uppercase tracking-tight">
                    {projekat.naslov}
                  </h3>
                  <span className="bg-cyan-500/10 text-cyan-400 text-[9px] px-3 py-1 rounded-full border border-cyan-500/20 font-black tracking-widest uppercase">
                    {projekat.tipMedija === "video" ? "Demo Video" : "Analiza"}
                  </span>
                </div>
                
                <p className="text-blue-100/60 leading-relaxed font-light mb-6 text-sm">
                  {projekat.opis}
                </p>

                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                   <p className="text-xs text-blue-100/40 italic leading-relaxed">
                    {projekat.detaljanTekst}
                  </p>
                </div>

                <div className="mt-8 flex items-center text-cyan-400 text-[10px] font-black tracking-[0.2em] uppercase cursor-pointer group-hover:text-white transition-colors">
                  Tehnička dokumentacija <span className="ml-2 group-hover:translate-x-2 transition-transform">→</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;