import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Obadva upotrebljena!
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
      if (response.ok) setIsSubmitted(true);
    } catch (error) {
      alert("Error transmitting message.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    // Smanjen donji padding pb-16, dodate donje zaobljene ivice rounded-b-[80px]
    <motion.section 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      id="contact" 
      className="pt-24 pb-20 bg-black text-white rounded-b-[60px] md:rounded-b-[100px] mb-12 shadow-2xl"
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

                <div className="bg-[#0f172a] border border-dashed border-cyan-500/20 p-8 rounded-3xl text-center">
                  <FaCloudUploadAlt size={30} className="mx-auto text-slate-600 mb-4" />
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