import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEnvelope, FaPaperPlane, FaCloudUploadAlt, FaCheckCircle } from 'react-icons/fa';

const Contact = () => {
  const myEmail = "mdzdravko@gmail.com";
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    const formData = new FormData(e.target);
    try {
      const response = await fetch(`https://formsubmit.co/ajax/${myEmail}`, {
        method: "POST",
        body: formData
      });
      if (response.ok) {
        setIsSubmitted(true);
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Connection error.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section id="contact" className="py-32 bg-black text-white">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-black uppercase italic mb-4 tracking-tighter">
          Get in <span className="text-cyan-500">Touch</span>
        </h2>
        <p className="text-slate-500 mb-16 uppercase text-[10px] tracking-[0.4em]">
          Scientific collaboration & AI research inquiries
        </p>

        <div className="min-h-100 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.form 
                key="contact-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="space-y-6 text-left w-full"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-slate-500 ml-2">Full Name</label>
                    <input type="text" name="name" placeholder="Dr. John Doe" required className="w-full bg-[#0f172a] border border-slate-800 p-5 rounded-2xl outline-none focus:border-cyan-500 transition-all font-bold text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-slate-500 ml-2">Email</label>
                    <input type="email" name="email" placeholder="john.doe@hospital.com" required className="w-full bg-[#0f172a] border border-slate-800 p-5 rounded-2xl outline-none focus:border-cyan-500 transition-all font-bold text-sm" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-slate-500 ml-2">Inquiry</label>
                  <textarea name="message" rows="5" placeholder="Research proposal..." required className="w-full bg-[#0f172a] border border-slate-800 p-5 rounded-2xl outline-none focus:border-cyan-500 transition-all font-bold text-sm"></textarea>
                </div>

                {/* SREĐEN BORDER: Izbačen border-slate-800 da ne bi bilo konflikta sa cyan */}
                <div className="bg-[#0f172a] border border-dashed border-cyan-500/20 p-8 rounded-3xl text-center">
                  <FaCloudUploadAlt size={30} className="mx-auto text-slate-600 mb-4" />
                  <p className="text-[10px] text-blue-300 font-bold uppercase tracking-widest mb-4">
                    NOTE: Large datasets/images should be sent via Email Client.
                  </p>
                  <a href={`mailto:${myEmail}?subject=Scientific Data`} className="bg-white/5 border border-white/10 px-8 py-2 rounded-full text-[10px] font-black uppercase hover:bg-white/10 transition-all inline-flex items-center gap-2">
                    <FaEnvelope /> Open Email Client
                  </a>
                </div>

                <button 
                  type="submit" 
                  disabled={isSending}
                  className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-black py-5 rounded-2xl transition-all uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isSending ? "TRANSMITTING DATA..." : <><FaPaperPlane /> Send Message</>}
                </button>
              </motion.form>
            ) : (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="text-center bg-[#0f172a] border border-cyan-500/30 p-16 rounded-4xl shadow-2xl"
              >
                <FaCheckCircle size={50} className="mx-auto text-cyan-400 mb-6" />
                <h3 className="text-2xl font-black text-white uppercase mb-4">Message Received</h3>
                <p className="text-slate-400 text-sm max-w-xs mx-auto">Your inquiry has been successfully transmitted.</p>
                <button onClick={() => setIsSubmitted(false)} className="mt-10 text-[10px] text-cyan-500 font-black uppercase tracking-widest hover:text-white transition-colors">← Send another</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default Contact;
