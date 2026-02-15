import React from 'react';

const About = () => {
  return (
    <section id="about" className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-black text-white mb-12 uppercase tracking-widest">O meni</h2>
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6 text-blue-100/70 text-lg leading-relaxed font-light text-left">
            <p>I am a cardiologist and scientist who advocates that medicine must evolve from being merely an "individual craft or skill" (techne) into a rigorous science (logos).
To achieve this transition, we must apply abstraction and advanced modeling to derive solutions that strictly follow the scientific method. 
<p>These solutions are then validated through practical verification in real-world systems or specific experiments, ensuring full alignment with the principles of Evidence-Based Medicine.</p>
<p>Our approach focuses on Personalized Medicine for every patient, integrating the latest scientific breakthroughs and the transformative capabilities of Artificial Intelligence.</p>
</p>
            
            
          </div>
          <div className="bg-white/5 p-8 rounded-3xl border border-white/10 text-left">
            <h3 className="text-cyan-400 font-bold mb-6 uppercase tracking-widest text-sm">Ekspertiza</h3>
            <div className="flex flex-wrap gap-3">
              {['Medicina', 'AI', 'React', 'Python', 'Tailwind'].map((skill) => (
                <span key={skill} className="px-4 py-2 bg-white/5 rounded-xl border border-white/10 text-white/80 text-sm font-medium">
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