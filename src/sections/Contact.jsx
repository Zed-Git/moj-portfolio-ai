import React from 'react';
import { FaEnvelope, FaPaperPlane, FaCloudUploadAlt, FaInfoCircle } from 'react-icons/fa';

const Contact = () => {
  return (
    <section id="contact" className="py-32 bg-black text-white">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-black uppercase italic mb-4 tracking-tighter">Get in <span className="text-cyan-500">Touch</span></h2>
        <p className="text-slate-500 mb-16 uppercase text-xs tracking-[0.3em]">For scientific collaboration and AI inquiries</p>

        <form className="space-y-6 text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="text" placeholder="Full Name" className="w-full bg-[#0f172a] border border-slate-800 p-5 rounded-2xl outline-none focus:border-cyan-500 transition-all font-bold" />
            <input type="email" placeholder="Medical / Org Email" className="w-full bg-[#0f172a] border border-slate-800 p-5 rounded-2xl outline-none focus:border-cyan-500 transition-all font-bold" />
          </div>
          <textarea rows="6" placeholder="Your Inquiry / Collaboration proposal..." className="w-full bg-[#0f172a] border border-slate-800 p-5 rounded-2xl outline-none focus:border-cyan-500 transition-all font-bold"></textarea>

          {/* VIZUELNI UPLOAD ZA KONTAKT */}
          <div className="bg-[#0f172a] border border-slate-800 p-8 rounded-3xl border-dashed border-cyan-500/20">
            <div className="flex flex-col items-center gap-4">
              <FaCloudUploadAlt size={30} className="text-slate-600" />
              <div className="text-center">
                <p className="text-sm font-bold text-white mb-1 uppercase tracking-widest">Scientific Attachments</p>
                <div className="flex items-center gap-2 bg-blue-500/5 p-3 rounded-lg border border-blue-500/10">
                  <FaInfoCircle className="text-blue-400 text-xs" />
                  <p className="text-[10px] text-blue-300 font-bold uppercase tracking-tighter">
                    NOTE: Please send large datasets, images or MP4 videos directly to my email as attachments.
                  </p>
                </div>
              </div>
              <a href="mailto:your-email@medexnews.com" className="bg-white/5 border border-white/10 px-6 py-2 rounded-full text-[10px] font-black uppercase hover:bg-white/10 transition-all">
                Open Email Client
              </a>
            </div>
          </div>

          <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-black py-5 rounded-2xl transition-all uppercase tracking-widest shadow-xl shadow-cyan-900/20 flex items-center justify-center gap-3">
            <FaPaperPlane /> Send Message
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;