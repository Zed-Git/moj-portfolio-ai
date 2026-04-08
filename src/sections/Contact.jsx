import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEnvelope, FaCloudUploadAlt, FaCheckCircle, FaInfoCircle } from 'react-icons/fa';

const Contact = () => {
  // mailto: i dalje koristi pravi mejl (korisnik otvara klijenta); to nije isto što i FormSubmit endpoint.
  const myEmail = 'mdzdravko@gmail.com';

  /**
   * FormSubmit — ODLUKA (odstupanje od “zlatnog standarda” sa golim mejlom u URL-u):
   * Ranije je AJAX išao na `https://formsubmit.co/ajax/${myEmail}`. FormSubmit savetuje da se umesto
   * “golog” mejla u action/URL koristi jedinstveni hash iz aktivacionog mejla, da skreperi ne bi
   * pokupili adresu iz koda. Isti endpoint radi: https://formsubmit.co/ajax/<hash>
   * Možeš rotirati ključ preko VITE_FORMSUBMIT_ID u .env / Vercel.
   */
  const formSubmitId =
    (import.meta.env.VITE_FORMSUBMIT_ID || '9ef527932da0d9ce7f458f4a9e74ec93').trim();
  const formSubmitAjaxUrl = `https://formsubmit.co/ajax/${formSubmitId}`;

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    const formData = new FormData(e.target);
    try {
      const response = await fetch(formSubmitAjaxUrl, {
        method: 'POST',
        body: formData,
      });
      if (response.ok) setIsSubmitted(true);
    } catch (err) {
      console.error("Submission failed:", err); // Iskoristili smo 'err' varijablu
      alert("Error transmitting message.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      id="contact" 
      className="pt-24 pb-20 bg-black text-white rounded-b-[60px] md:rounded-b-[100px] mb-12 shadow-2xl relative z-10"
    >
      <div className="max-w-4xl mx-auto px-10 text-center">
        <h2 className="text-4xl font-black uppercase italic mb-4 tracking-tighter">
          Get in <span className="text-cyan-500">Touch</span>
        </h2>
        <p className="text-slate-500 mb-16 uppercase text-[10px] tracking-[0.4em]">Scientific collaboration & research</p>

        <div className="min-h-100 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.form 
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="space-y-6 text-left w-full"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input type="text" name="name" placeholder="Full Name" required className="w-full bg-[#0f172a] border border-slate-800 p-5 rounded-2xl outline-none focus:border-cyan-500 transition-all font-bold text-sm" />
                  <input type="email" name="email" placeholder="Email" required className="w-full bg-[#0f172a] border border-slate-800 p-5 rounded-2xl outline-none focus:border-cyan-500 transition-all font-bold text-sm" />
                </div>
                <textarea name="message" rows="5" placeholder="Research proposal..." required className="w-full bg-[#0f172a] border border-slate-800 p-5 rounded-2xl outline-none focus:border-cyan-500 transition-all font-bold text-sm"></textarea>

                {/* VRAĆENI NOTE I UPLOAD BOX */}
                <div className="bg-[#0f172a] border border-dashed border-cyan-500/20 p-8 rounded-3xl text-center">
                  <FaCloudUploadAlt size={30} className="mx-auto text-slate-600 mb-4" />
                  
                  <div className="flex items-start gap-3 bg-blue-500/5 p-4 rounded-xl border border-blue-500/10 mb-6 text-left">
                    <FaInfoCircle className="text-blue-400 text-xs mt-1 shrink-0" />
                    <p className="text-[10px] text-blue-300 font-bold uppercase tracking-tighter leading-relaxed">
                      NOTE: To ensure medical data integrity, please send large datasets, DICOM images, or research videos directly via email client.
                    </p>
                  </div>

                  <a href={`mailto:${myEmail}`} className="bg-white/5 border border-white/10 px-8 py-2 rounded-full text-[10px] font-black uppercase hover:text-cyan-400 transition-all inline-flex items-center gap-2">
                    <FaEnvelope /> Open Email Client
                  </a>
                </div>

                <button type="submit" disabled={isSending} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-black py-5 rounded-2xl transition-all uppercase tracking-widest shadow-xl disabled:opacity-50">
                  {isSending ? "TRANSMITTING..." : "Send Message"}
                </button>
              </motion.form>
            ) : (
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-center">
                <FaCheckCircle size={50} className="mx-auto text-cyan-400 mb-6" />
                <h3 className="text-2xl font-black uppercase">Message Received</h3>
                <button onClick={() => setIsSubmitted(false)} className="mt-8 text-[10px] text-cyan-500 font-black uppercase tracking-widest underline">Send another</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.section>
  );
};

export default Contact;