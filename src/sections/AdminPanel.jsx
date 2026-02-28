import { useState, useEffect, useCallback } from 'react'; // Dodali smo useCallback radi optimizacije
import { supabase } from '../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion'; 
import { 
  FaTrash, FaSignOutAlt, FaCloudUploadAlt, FaLock, 
  FaInfoCircle, FaEdit, FaTimes, FaFingerprint 
} from 'react-icons/fa';

import AdminAboutEditor from '../components/admin/AdminAboutEditor';

const AdminPanel = () => {
  // --- STANJA ---
  const [session, setSession] = useState(null);
  const [projekti, setProjekti] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [editingId, setEditingId] = useState(null); 
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  const [newProject, setNewProject] = useState({
    title: '',
    technologies: '',
    description: '', 
    image_url: '',
    link: ''
  });

  // --- 1. DEFINICIJA FUNKCIJA (Mora ići PRE useEffect-a) ---
  
  // Funkcija za dovlačenje projekata iz baze
  const fetchProjects = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setProjekti(data || []);
    } catch (error) {
      console.error("Greška pri davanju podataka:", error.message);
    }
  }, []);

  // Funkcija za "Forgot Key Phrase"
  const handleForgotPhrase = () => {
    alert("Sistem zaštite: Molimo Vas da proverite Vaš primarni email za instrukcije o oporavku pristupnog ključa.");
  };

  // --- 2. KONTROLA SESIJE (useEffect) ---
  useEffect(() => {
    // Proveravamo sesiju odmah
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchProjects();
      setLoading(false);
    });

    // Slušamo promene (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchProjects();
    });

    return () => subscription.unsubscribe();
  }, [fetchProjects]);

  // --- 3. LOGIKA ZA FORME ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert('Pristup odbijen: ' + error.message);
    setLoading(false);
  };

  const simulateUpload = () => {
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      alert("Simulacija slanja završena. (Ovde ćemo kasnije povezati pravi upload)");
    }, 2000);
  };

  // --- 4. STILOVI (ZED AI-PORTFOLIO TEMA) ---
  const theme = {
    bg: '#0a0b14',
    card: '#161b2b',
    accent: '#00d1ff',
    inputBg: '#1f2537'
  };

  if (loading) return (
    <div style={{background: theme.bg, color: 'white', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif'}}>
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} style={{ border: `4px solid ${theme.accent}`, borderTop: '4px solid transparent', borderRadius: '50%', width: '40px', height: '40px' }} />
    </div>
  );

  // --- 5. PRIKAZ ZA LOGIN (SECURE ACCESS) ---
  if (!session) {
    return (
      <div style={{ background: theme.bg, minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif' }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          style={{ background: theme.card, padding: '40px', borderRadius: '24px', width: '420px', textAlign: 'center', border: '1px solid #2d3446', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}
        >
          <FaFingerprint style={{ fontSize: '60px', color: theme.accent, marginBottom: '20px' }} />
          <h2 style={{ color: 'white', letterSpacing: '3px', marginBottom: '35px', fontWeight: '300' }}>SECURE ACCESS</h2>
          
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input 
              type="email" 
              placeholder="mdzdravko@Gmail.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              style={{ padding: '16px', borderRadius: '12px', border: '1px solid #2d3446', background: theme.inputBg, color: 'white', fontSize: '16px' }} 
            />
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              style={{ padding: '16px', borderRadius: '12px', border: '1px solid #2d3446', background: theme.inputBg, color: 'white', fontSize: '16px' }} 
            />
            <button type="submit" style={{ padding: '16px', borderRadius: '12px', border: 'none', background: theme.accent, color: '#000', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', marginTop: '10px' }}>AUTHORIZE</button>
          </form>
          
          <button 
            onClick={handleForgotPhrase}
            style={{ background: 'none', border: 'none', color: '#555', marginTop: '25px', cursor: 'pointer', fontSize: '13px', letterSpacing: '1px' }}
          >
            🔑 FORGOT YOUR KEY PHRASE?
          </button>
        </motion.div>
      </div>
    );
  }

  // --- 6. PRIKAZ ZA DASHBOARD (CONTROL PANEL) ---
  return (
    <div style={{ background: theme.bg, minHeight: '100vh', color: 'white', fontFamily: 'sans-serif', padding: '30px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1100px', margin: '0 auto 40px auto', borderBottom: '1px solid #2d3446', paddingBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
           <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: theme.accent }}></div>
           <h2 style={{ color: theme.accent, fontSize: '18px', letterSpacing: '2px', fontWeight: 'bold' }}>CONTROL PANEL</h2>
        </div>
        <button onClick={() => supabase.auth.signOut()} style={{ background: 'rgba(255, 75, 75, 0.1)', color: '#ff4b4b', border: '1px solid #ff4b4b', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>END SESSION</button>
      </header>

      <main style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        {/* DODAVANJE RADAVA */}
        <section style={{ background: theme.card, padding: '35px', borderRadius: '20px', border: '1px solid #2d3446', marginBottom: '40px' }}>
          <h4 style={{ color: theme.accent, marginBottom: '25px', fontSize: '14px', letterSpacing: '1px' }}>// ADD NEW SCIENTIFIC ENTRY</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <input type="text" placeholder="Project Title" value={newProject.title} onChange={(e) => setNewProject({...newProject, title: e.target.value})} style={{ padding: '18px', borderRadius: '12px', border: '1px solid #2d3446', background: theme.inputBg, color: 'white', fontSize: '16px' }} />
            <input type="text" placeholder="Technologies / Stack" value={newProject.technologies} onChange={(e) => setNewProject({...newProject, technologies: e.target.value})} style={{ padding: '18px', borderRadius: '12px', border: '1px solid #2d3446', background: theme.inputBg, color: 'white', fontSize: '16px' }} />
            <textarea placeholder="Scientific Abstract" value={newProject.description} onChange={(e) => setNewProject({...newProject, description: e.target.value})} style={{ padding: '18px', borderRadius: '12px', border: '1px solid #2d3446', background: theme.inputBg, color: 'white', fontSize: '16px', minHeight: '120px' }} />
            
            <div 
              onClick={simulateUpload}
              style={{ border: '2px dashed #2d3446', padding: '40px', textAlign: 'center', borderRadius: '15px', color: theme.accent, cursor: 'pointer', transition: '0.3s' }}
            >
              <FaCloudUploadAlt style={{ fontSize: '35px', marginBottom: '10px' }} />
              <p style={{ fontSize: '14px', fontWeight: 'bold' }}>{uploading ? "UPLOADING ASSET..." : "REPLACE / UPLOAD MEDIA ASSET"}</p>
            </div>
            
            <button style={{ background: theme.accent, padding: '20px', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '16px', color: '#000', cursor: 'pointer' }}>PUBLISH RESEARCH</button>
          </div>
        </section>

        {/* O MENI EDITOR */}
        <section style={{ background: theme.card, padding: '35px', borderRadius: '20px', border: '1px solid #2d3446', marginBottom: '40px' }}>
          <h4 style={{ color: theme.accent, marginBottom: '25px', fontSize: '14px' }}>UREDI "O MENI" SEKCIJU</h4>
          <AdminAboutEditor />
        </section>

        {/* LISTA RADOVA IZ BAZE */}
        <section style={{ background: theme.card, padding: '35px', borderRadius: '20px', border: '1px solid #2d3446' }}>
          <h4 style={{ color: '#555', fontSize: '12px', marginBottom: '25px', letterSpacing: '2px' }}>ACTIVE DATABASE RECORDS</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {projekti.length === 0 ? (
              <p style={{ color: '#444' }}>Trenutno nema zapisa u bazi podataka.</p>
            ) : (
              projekti.map(p => (
                <div key={p.id} style={{ background: theme.inputBg, padding: '20px', borderRadius: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: editingId === p.id ? `1px solid ${theme.accent}` : '1px solid transparent' }}>
                  <span style={{ fontWeight: 'bold', textTransform: 'uppercase', fontSize: '14px', letterSpacing: '1px' }}>{p.title}</span>
                  <div style={{ display: 'flex', gap: '15px' }}>
                    <button onClick={() => setEditingId(p.id)} style={{ background: '#2d3446', color: 'white', border: 'none', padding: '12px', borderRadius: '10px', cursor: 'pointer' }}><FaEdit /></button>
                    <button onClick={() => alert('Brisanje radova će biti omogućeno u sledećoj fazi.')} style={{ background: '#2d3446', color: '#ff4b4b', border: 'none', padding: '12px', borderRadius: '10px', cursor: 'pointer' }}><FaTrash /></button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* RESET LOZINKE */}
        <div style={{ marginTop: '50px', textAlign: 'center', paddingBottom: '50px' }}>
          <button onClick={() => setIsResettingPassword(!isResettingPassword)} style={{ background: 'transparent', color: '#555', border: 'none', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '10px', margin: '0 auto' }}>
            <FaLock /> {isResettingPassword ? "ZATVORI" : "PROMENI LOZINKU"}
          </button>
          <AnimatePresence>
            {isResettingPassword && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
                <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
                  <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Nova lozinka" style={{ padding: '15px', borderRadius: '10px', border: '1px solid #2d3446', background: theme.inputBg, color: 'white' }} />
                  <button style={{ background: theme.accent, padding: '0 20px', borderRadius: '10px', border: 'none', fontWeight: 'bold' }}>POTVRDI</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;