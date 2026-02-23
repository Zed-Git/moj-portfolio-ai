import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // VRATILI SMO 'motion'
import { FaEnvelope, FaCheckCircle, FaSpinner } from 'react-icons/fa';

const Contact = () => {
  const [status, setStatus] = useState("IDLE");
  
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setStatus("SENDING");
    const formData = new FormData(e.target);
    const response = await fetch("https://formspree.io/f/mojnpqje", {
      method: "POST",
      body: formData,
      headers: { 'Accept': 'application/json' }
    });
    if (response.ok) { setStatus("SUCCESS"); e.target.reset(); } 
    else { setStatus("ERROR"); }
  };

  return (
    <section id="contact" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-[0.2em] mb-4 text-center">Contact</h2>
          <div className="w-20 h-1 bg-cyan-500 mx-auto rounded-full"></div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16">
          <div className="space-y-8 text-left text-white font-light">
            <h3 className="text-2xl font-bold">Let's explore the future of healthcare together</h3>
            <p className="text-blue-100/60 leading-relaxed italic">"Whether you're looking to collaborate on AI initiatives or exchange scientific expertise, feel free to get in touch."</p>
          </div>

          <div className="bg-white/3 backdrop-blur-3xl border border-white/10 p-8 md:p-12 rounded-[40px] shadow-2xl relative overflow-hidden">
            <AnimatePresence mode="wait">
              {status === "SUCCESS" ? (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-20 text-center space-y-6 text-white">
                  <FaCheckCircle className="text-cyan-400 text-6xl mx-auto animate-bounce" />
                  <h3 className="text-2xl font-black uppercase">Poruka primljena!</h3>
                </motion.div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-6 text-left">
                  <input name="name" type="text" placeholder="Name" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none" required />
                  <input name="email" type="email" placeholder="Email" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none" required />
                  <textarea name="message" rows="5" placeholder="Message..." className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none resize-none" required></textarea>
                  <button type="submit" disabled={status === "SENDING"} className="w-full bg-cyan-500 text-black font-black py-5 rounded-2xl uppercase tracking-widest hover:bg-cyan-400 transition-all flex justify-center items-center gap-3">
                    {status === "SENDING" ? <FaSpinner className="animate-spin" /> : "Send Message"}
                  </button>
                </form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;