import React, { useState } from 'react'; // Dodali smo useState
import { motion, AnimatePresence } from 'framer-motion';
import { FaEnvelope, FaLinkedin, FaCheckCircle, FaSpinner } from 'react-icons/fa';

const Contact = () => {
  // --- STANJA (Statusi operacije) ---
  const [status, setStatus] = useState("IDLE"); // IDLE, SENDING, SUCCESS, ERROR
  
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setStatus("SENDING");

    const formData = new FormData(e.target);
    
    // HIRURŠKI ZAHVAT: Slanje podataka Formspree kuriru
    // OVDE ZAMENI 'tvoj_link_sa_formspree' PRAVIM LINKOM KOJI SI DOBIO
    const response = await fetch("https://formspree.io/f/tvoj_link_sa_formspree", {
      method: "POST",
      body: formData,
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      setStatus("SUCCESS");
      e.target.reset(); // Čistimo formu
    } else {
      setStatus("ERROR");
    }
  };

  return (
    <section id="contact" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* NASLOV */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-[0.2em] mb-4">Kontakt</h2>
          <div className="w-20 h-1 bg-cyan-500 mx-auto rounded-full shadow-[0_0_15px_rgba(34,211,238,0.8)]"></div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* LEVA STRANA: INFO (Ostaje ista) */}
          <div className="space-y-8 text-left">
            <h3 className="text-2xl font-bold text-white mb-6 tracking-tight">Hajde da razgovaramo o budućnosti medicine.</h3>
            <p className="text-blue-100/60 text-lg font-light leading-relaxed">Pišite mi za saradnju na AI projektima ili naučnu razmenu.</p>
            
            <div className="space-y-6">
              <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-cyan-500/50 transition-all shadow-xl">
                  <FaEnvelope className="text-cyan-400 text-xl" />
                </div>
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-widest">Email</p>
                  <p className="text-white font-medium">zdravko.mijailovic@email.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* DESNA STRANA: FORMA SA PAMETNIM STATUSOM */}
          <motion.div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 p-8 md:p-12 rounded-[40px] shadow-2xl relative overflow-hidden">
            
            <AnimatePresence mode="wait">
              {status === "SUCCESS" ? (
                // EKRAN NAKON USPEŠNOG SLANJA
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-20 text-center space-y-6"
                >
                  <FaCheckCircle className="text-cyan-400 text-6xl mx-auto animate-bounce" />
                  <h3 className="text-2xl font-black text-white uppercase">Poruka primljena!</h3>
                  <p className="text-blue-100/60 font-light">Odgovoriću Vam u najkraćem mogućem roku, doktore.</p>
                  <button onClick={() => setStatus("IDLE")} className="text-cyan-400 text-xs font-black uppercase tracking-widest hover:text-white transition-all cursor-pointer">
                    Pošalji novu poruku
                  </button>
                </motion.div>
              ) : (
                // GLAVNA FORMA
                <motion.form 
                  key="form"
                  onSubmit={handleFormSubmit}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6 text-left"
                >
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Vaše Ime</label>
                    <input name="name" type="text" placeholder="Dr. John Doe" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-cyan-500/50 transition-all" required />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Email adresa</label>
                    <input name="email" type="email" placeholder="john@doe.com" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-cyan-500/50 transition-all" required />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Vaša poruka</label>
                    <textarea name="message" rows="5" placeholder="Poštovani kolega, pišem Vam povodom..." className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-cyan-500/50 transition-all resize-none" required></textarea>
                  </div>

                  <button type="submit" disabled={status === "SENDING"} className="w-full bg-cyan-500 text-black font-black py-5 rounded-2xl uppercase tracking-widest hover:bg-cyan-400 active:scale-95 transition-all shadow-xl shadow-cyan-500/10 flex justify-center items-center gap-3 cursor-pointer disabled:opacity-50">
                    {status === "SENDING" ? (
                      <><FaSpinner className="animate-spin" /> Šaljem...</>
                    ) : "Pošalji poruku"}
                  </button>
                  
                  {status === "ERROR" && <p className="text-red-400 text-xs text-center mt-4 uppercase font-bold tracking-tighter">Greška u sistemu. Pokušajte ponovo.</p>}
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Contact;