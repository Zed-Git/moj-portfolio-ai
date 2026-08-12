import React, { useState, useRef, useLayoutEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEnvelope, FaCloudUploadAlt, FaCheckCircle, FaInfoCircle } from 'react-icons/fa';
import { Turnstile } from '@marsidev/react-turnstile';
import { CONTACT_EMAIL } from '../config/site';

const Contact = () => {
  // mailto: i dalje koristi pravi mejl (korisnik otvara klijenta); to nije isto što i FormSubmit endpoint.
  const myEmail = CONTACT_EMAIL;

  // Turnstile — javni site key; secret verifikacija ide preko /api/contact.
  const siteKey = import.meta.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  // FormSubmit — email ili hash iz aktivacionog mejla; šalje se iz browsera.
  const formSubmitId =
    import.meta.env.VITE_FORMSUBMIT_ID?.trim() || CONTACT_EMAIL;

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState(null);
  const [turnstileError, setTurnstileError] = useState(false);
  const [turnstileMountKey, setTurnstileMountKey] = useState(0);
  const [panelMinHeight, setPanelMinHeight] = useState(null);
  const turnstileRef = useRef(null);
  const panelRef = useRef(null);

  const closeMobileMenu = useCallback(() => {
    window.dispatchEvent(new CustomEvent('close-mobile-menu'));
    document.body.style.overflow = '';
  }, []);

  // Form → success shrinks content; lock panel height so scroll position stays put.
  useLayoutEffect(() => {
    if (!isSubmitted) return;
    const scrollY = window.scrollY;
    requestAnimationFrame(() => {
      if (window.scrollY !== scrollY) {
        window.scrollTo(0, scrollY);
      }
    });
  }, [isSubmitted]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!turnstileToken) {
      alert('Please complete the security check.');
      return;
    }

    closeMobileMenu();
    setIsSending(true);
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');
    const honey = formData.get('_honey');
    if (honey) {
      setIsSending(false);
      return;
    }

    try {
      // 1) Server proverava Turnstile token (secret key na Vercel-u)
      const verifyRes = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message, turnstileToken }),
      });
      const verifyText = await verifyRes.text();
      let verifyData = null;
      try {
        verifyData = JSON.parse(verifyText);
      } catch {
        /* non-JSON */
      }
      if (!verifyRes.ok) {
        const msg =
          verifyData?.error ||
          verifyText.trim().slice(0, 200) ||
          verifyRes.statusText;
        throw new Error(msg || 'Security verification failed');
      }

      // 2) FormSubmit iz browsera (server-side proxy vraća 403 Forbidden)
      const formRes = await fetch(
        `https://formsubmit.co/ajax/${formSubmitId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            name,
            email,
            message,
            _subject: 'New contact — Z. Mijailović Portfolio (mdzdravko.com)',
            _template: 'table',
            _replyto: email,
            _captcha: 'false',
          }),
        }
      );
      const formText = await formRes.text();
      let formJson = null;
      try {
        formJson = JSON.parse(formText);
      } catch {
        /* non-JSON */
      }
      const formOk =
        formRes.ok &&
        (formJson?.success === true || formJson?.success === 'true');
      if (!formOk) {
        const msg =
          formJson?.message ||
          formJson?.error ||
          formText.trim().slice(0, 200) ||
          formRes.statusText;
        throw new Error(msg || 'Email delivery failed');
      }

      const lockedHeight = panelRef.current?.offsetHeight;
      if (lockedHeight) setPanelMinHeight(lockedHeight);
      closeMobileMenu();
      setIsSubmitted(true);
      setTurnstileToken(null);
      setTurnstileError(false);
      turnstileRef.current?.reset();
    } catch (err) {
      console.error('Submission failed:', err);
      const detail =
        err instanceof Error && err.message && err.message !== 'Request failed'
          ? `\n\n${err.message}`
          : '';
      alert(
        `Error transmitting message. Please try again or use Open Email Client.${detail}`
      );
      setTurnstileToken(null);
      setTurnstileError(false);
      turnstileRef.current?.reset();
    } finally {
      setIsSending(false);
    }
  };

  const handleTurnstileRetry = () => {
    setTurnstileError(false);
    setTurnstileToken(null);
    setTurnstileMountKey((k) => k + 1);
  };

  const handleSendAnother = () => {
    setIsSubmitted(false);
    setPanelMinHeight(null);
    setTurnstileToken(null);
    setTurnstileError(false);
    turnstileRef.current?.reset();
  };

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      id="contact"
      className="scroll-mt-28 pt-24 pb-20 bg-black text-white rounded-b-[60px] md:rounded-b-[100px] mb-12 shadow-2xl relative z-10"
    >
      <div className="max-w-4xl mx-auto px-10 text-center">
        <h2 className="text-4xl font-black uppercase italic mb-4 tracking-tighter">
          Get in <span className="text-cyan-500">Touch</span>
        </h2>
        <p className="text-slate-400 mb-16 uppercase text-[10px] tracking-[0.4em]">Scientific collaboration & research</p>

        <div
          ref={panelRef}
          className="flex w-full items-center justify-center"
          style={panelMinHeight != null ? { minHeight: panelMinHeight } : undefined}
        >
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                onFocusCapture={closeMobileMenu}
                className="w-full space-y-6 text-left"
              >
                {/*
                  Honeypot (_honey). Turnstile provera → /api/contact; mejl → FormSubmit iz browsera.
                */}
                <input
                  type="text"
                  name="_honey"
                  tabIndex={-1}
                  autoComplete="off"
                  className="absolute h-px w-px overflow-hidden opacity-0 -z-10 pointer-events-none"
                  aria-hidden="true"
                />

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

                <p className="text-[10px] text-slate-500 leading-relaxed text-center uppercase tracking-tighter">
                  Protected by Cloudflare Turnstile; delivered via FormSubmit (spam filtering).
                </p>

                {/*
                  Lokalno (vite dev): u Cloudflare Turnstile → widget → Hostnames dodaj
                  localhost i 127.0.0.1 pored mdzdravko.com / www.mdzdravko.com.
                  Za lokalni /api/contact koristi `vercel dev`, ne samo `npm run dev`.
                */}
                {siteKey ? (
                  <div className="flex w-full flex-col items-center gap-3">
                    <div className="flex w-full max-w-[304px] justify-center overflow-hidden">
                      <Turnstile
                        key={turnstileMountKey}
                        ref={turnstileRef}
                        siteKey={siteKey}
                        size="flexible"
                        theme="dark"
                        refreshExpired="auto"
                        retry="auto"
                        onSuccess={(token) => {
                          setTurnstileToken(token);
                          setTurnstileError(false);
                        }}
                        onExpire={() => setTurnstileToken(null)}
                        onError={() => {
                          setTurnstileToken(null);
                          setTurnstileError(true);
                        }}
                      />
                    </div>
                    {turnstileError ? (
                      <div className="w-full max-w-md space-y-3 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 text-center">
                        <p className="text-[10px] font-bold uppercase leading-relaxed tracking-tighter text-amber-200">
                          Security check could not connect. On iPhone, try disabling content blockers or iCloud Private Relay for this site, then retry.
                        </p>
                        <button
                          type="button"
                          onClick={handleTurnstileRetry}
                          className="text-[10px] font-black uppercase tracking-widest text-cyan-400 underline"
                        >
                          Retry security check
                        </button>
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <p className="text-[10px] text-amber-400 text-center uppercase tracking-tighter">
                    Security widget unavailable (missing NEXT_PUBLIC_TURNSTILE_SITE_KEY).
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSending || !turnstileToken || !siteKey}
                  className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-black py-5 rounded-2xl transition-all uppercase tracking-widest shadow-xl disabled:opacity-50"
                >
                  {isSending ? "TRANSMITTING..." : "Send Message"}
                </button>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="w-full text-center"
              >
                <FaCheckCircle size={50} className="mx-auto text-cyan-400 mb-6" />
                <h3 className="text-2xl font-black uppercase">Message Received</h3>
                <button onClick={handleSendAnother} className="mt-8 text-[10px] text-cyan-500 font-black uppercase tracking-widest underline">Send another</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.section>
  );
};

export default Contact;
