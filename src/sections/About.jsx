import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const About = () => {
  const [aboutContent, setAboutContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAboutText = async () => {
      const { data } = await supabase.from('site_settings').select('content').eq('section_name', 'about_me').single();
      if (data) setAboutContent(data.content);
      setLoading(false);
    };
    fetchAboutText();
  }, []);

  return (
    <section id="about" className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-black text-white mb-12 uppercase tracking-widest">ABOUT</h2>
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6 text-blue-100/70 text-lg leading-relaxed font-light text-left">
            {loading ? <p>Učitavanje...</p> : <p className="whitespace-pre-line">{aboutContent}</p>}
          </div>
        </div>
      </div>
    </section>
  );
};
export default About;