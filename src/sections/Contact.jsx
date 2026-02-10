import React from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaMapMarkerAlt, FaLinkedin } from 'react-icons/fa';

const Contact = () => {
  return (
    <section id="contact" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* NASLOV SEKCIJE */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-[0.2em] mb-4">
            Kontakt
          </h2>
          <div className="w-20 h-1 bg-cyan-500 mx-auto rounded-full shadow-[0_0_15px_rgba(34,211,238,0.8)]"></div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16">
          
          {/* LEVA STRANA: INFO KARTICE */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            <h3 className="text-2xl font-bold text-white mb-6">Hajde da razgovaramo o budućnosti medicine.</h3>
            <p className="text-blue-100/60 text-lg font-light leading-relaxed">
              Bilo da ste zainteresovani za saradnju na AI projektima ili želite da razmenimo naučna iskustva, slobodno mi pišite.
            </p>

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

              <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-cyan-500/50 transition-all shadow-xl">
                  <FaLinkedin className="text-cyan-400 text-xl" />
                </div>
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-widest">LinkedIn</p>
                  <p className="text-white font-medium">linkedin.com/in/zdravko-mijailovic</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* DESNA STRANA: FORMA */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 p-8 md:p-12 rounded-[40px] shadow-2xl"
          >
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/50 uppercase tracking-widest ml-1">Ime</label>
                  <input type="text" placeholder="Vaše ime" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-cyan-500/50 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/50 uppercase tracking-widest ml-1">Email</label>
                  <input type="email" placeholder="email@primer.com" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-cyan-500/50 transition-all" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/50 uppercase tracking-widest ml-1">Poruka</label>
                <textarea rows="5" placeholder="Kako mogu da Vam pomognem?" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-cyan-500/50 transition-all resize-none"></textarea>
              </div>


              <button className="w-full bg-linear-to-r from-blue-600 to-cyan-500 text-white font-black py-5 rounded-2xl uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_30px_rgba(37,99,235,0.3)] cursor-pointer">
                Pošalji poruku
              </button>
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Contact;
