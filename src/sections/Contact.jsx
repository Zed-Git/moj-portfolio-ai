import React from 'react';
import { FaEnvelope, FaPaperPlane, FaCloudUploadAlt, FaInfoCircle } from 'react-icons/fa';

const Contact = () => {
  // Tvoj profesionalni email
  const myEmail = "zdravkomijailovic@gmail.com"; 

  return (
    <section id="contact" className="py-32 bg-black text-white">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-black uppercase italic mb-4 tracking-tighter">
          Get in <span className="text-cyan-500">Touch</span>
        </h2>
        <p className="text-slate-500 mb-16 uppercase text-[10px] tracking-[0.4em]">
          Scientific collaboration & AI research inquiries
        </p>

        {/* FORMA: Povezana sa FormSubmit servisom */}
        <form 
          action={`https://formsubmit.co/${myEmail}`} 
          method="POST"
          className="space-y-6 text-left"
        >
          {/* Honeypot - Sprečava spam robote da ti šalju lažne poruke */}
          <input type="text" name="_honey" style={{display: 'none'}} />
          
          {/* Disable Captcha - Da korisnik ne mora da rešava slike pre slanja */}
          <input type="hidden" name="_captcha" value="false" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-slate-500 ml-2 tracking-widest">Full Name</label>
              <input 
                type="text" 
                name="name" 
                placeholder="Dr. John Doe" 
                required
                className="w-full bg-[#0f172a] border border-slate-800 p-5 rounded-2xl outline-none focus:border-cyan-500 transition-all font-bold text-sm" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-slate-500 ml-2 tracking-widest">Medical / Org Email</label>
              <input 
                type="email" 
                name="email" 
                placeholder="john.doe@hospital.com" 
                required
                className="w-full bg-[#0f172a] border border-slate-800 p-5 rounded-2xl outline-none focus:border-cyan-500 transition-all font-bold text-sm" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-slate-500 ml-2 tracking-widest">Your Inquiry</label>
            <textarea 
              name="message"
              rows="6" 
              placeholder="Describe your research proposal or inquiry..." 
              required
              className="w-full bg-[#0f172a] border border-slate-800 p-5 rounded-2xl outline-none focus:border-cyan-500 transition-all font-bold text-sm"
            ></textarea>
          </div>

          {/* VIZUELNI UPLOAD BOX */}
          <div className="bg-[#0f172a] border border-slate-800 p-8 rounded-3xl border-dashed border-cyan-500/20">
            <div className="flex flex-col items-center gap-4">
              <FaCloudUploadAlt size={35} className="text-slate-600" />
              <div className="text-center">
                <p className="text-sm font-bold text-white mb-2 uppercase tracking-widest">Scientific Attachments</p>
                <div className="flex items-start gap-3 bg-blue-500/5 p-4 rounded-xl border border-blue-500/10 mb-5">
                  <FaInfoCircle className="text-blue-400 text-xs mt-0.5" />
                  <p className="text-[10px] text-blue-300 font-bold uppercase tracking-tighter leading-relaxed">
                    NOTE: To ensure medical data integrity, please send large datasets, DICOM images, or research videos directly via email client.
                  </p>
                </div>
              </div>
              
              {/* ISPRAVLJENO DUGME ZA EMAIL KLIJENT */}
              <a 
                href={`mailto:${myEmail}?subject=Scientific Attachment from Portfolio`}
                className="bg-white/5 border border-white/10 px-8 py-3 rounded-full text-[10px] font-black uppercase hover:bg-white/10 hover:text-cyan-400 transition-all flex items-center gap-2"
              >
                <FaEnvelope /> Open Email Client
              </a>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-black py-5 rounded-2xl transition-all uppercase tracking-widest shadow-xl shadow-cyan-900/20 flex items-center justify-center gap-3 group"
          >
            <FaPaperPlane className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /> 
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;