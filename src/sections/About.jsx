import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const About = () => {
  const [aboutContent, setAboutContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAboutText = async () => {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('content')
          .eq('section_name', 'about_me')
          .single();

        if (error) throw error;
        if (data) setAboutContent(data.content);
      } catch (err) {
        console.error('Error fetching about:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAboutText();
  }, []);

  return (
    <section id="about" className="py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-black text-white mb-12 md:mb-16 uppercase tracking-widest italic">
          <span className="text-cyan-500">//</span> About
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start">
          <div className="space-y-6 text-blue-100/70 text-base md:text-lg leading-relaxed font-light text-left">
            {loading ? (
              <p className="animate-pulse">Synchronizing metadata...</p>
            ) : (
              <p className="whitespace-pre-line border-l-2 border-cyan-500/30 pl-6">
                {aboutContent || "No data fetched from server."}
              </p>
            )}
          </div>

          <div className="bg-white/5 p-8 rounded-3xl border border-white/10 text-left backdrop-blur-md">
            <h3 className="text-cyan-400 font-black mb-6 uppercase tracking-widest text-xs">Clinical & Technical Expertise</h3>
            <div className="flex flex-wrap gap-3">
              {['Cardiology', 'AI/ML', 'Medical Data Science', 'React', 'Python'].map((skill) => (
                <span key={skill} className="px-4 py-2 bg-cyan-500/10 rounded-xl border border-cyan-500/20 text-cyan-300 text-[10px] md:text-xs font-bold uppercase">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;