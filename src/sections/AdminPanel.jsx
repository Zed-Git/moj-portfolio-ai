import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion'; 
import { 
  FaTrash, FaSignOutAlt, FaCloudUploadAlt, FaLock, 
  FaInfoCircle, FaEdit, FaTimes, FaFingerprint 
} from 'react-icons/fa';

import AdminAboutEditor from '../components/admin/AdminAboutEditor';

const AdminPanel = () => {
  // --- STANJA (States) ---
  const [session, setSession] = useState(null);
  const [projekti, setProjekti] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [uploading] = useState(false); // Ovde smo uklonili setUploading jer ga nismo koristili u ovoj verziji
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

  // --- LOGIKA ZA PODATKE (Mora biti gore zbog Hoisting-a) ---
  const fetchProjects = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setProjekti(data || []);
    } catch (error) {
      console.error("Greška:", error.message);
    }
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchProjects();
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchProjects();
    });

    return () => subscription.unsubscribe();
  }, [fetchProjects]);

  // --- FUNKCIJE ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert('Greška: ' + error.message);
    setLoading(false);
  };

  const handleEdit = (rad) => {
    setEditingId(rad.id);
    setNewProject({
      title: rad.title,
      technologies: rad.technologies || '',
      description: rad.description || '',
      image_url: rad.image_url || '',
      link: rad.link || ''
    });
    // Skrolujemo do forme, ali ostavljamo prostor za navigaciju
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  const theme = {
    bg: '#0a0b14',
    card: '#161b2b',
    accent: '#00d1ff',
    inputBg: '#1f2537'
  };

  if (loading) return <div style={{background: theme.bg, color: 'white', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>Učitavanje...</div>;

  // 1. LOGIN PRIKAZ
  if (!session) {
    return (
      <div style={{ background: theme.bg, minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        <div style={{ background: theme.card, padding: '40px', borderRadius: '24px', width: '380px', border: '1px solid #2d3446' }}>
          <FaFingerprint style={{ fontSize: '50px', color: theme.accent, marginBottom: '20px' }} />
          <h2 style={{ color: 'white', letterSpacing: '3px' }}>SECURE ACCESS</h2>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ padding: '15px', borderRadius: '12px', border: '1px solid #2d3446', background: theme.inputBg, color: 'white' }} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ padding: '15px', borderRadius: '12px', border: '1px solid #2d3446', background: theme.inputBg, color: 'white' }} />
            <button type="submit" style={{ padding: '15px', borderRadius: '12px', border: 'none', background: theme.accent, color: 'black', fontWeight: 'bold', cursor: 'pointer' }}>AUTHORIZE</button>
          </form>
        </div>
      </div>
    );
  }

  // 2. ADMIN PANEL PRIKAZ
  return (
    <div style={{ 
      background: theme.bg, 
      minHeight: '100vh', 
      color: 'white', 
      padding: '120px 20px 40px 20px', // DODALI SMO 120px PADDINGA NA VRHU DA IZBEGNEMO HEADER
      textAlign: 'left' 
    }}>
      
      {/* FIKSIRANO DUGME ZA ODJAVU - Uvek vidljivo u uglu */}
      <div style={{
        position: 'fixed',
        top: '100px', // Ispod Vaše navigacije
        right: '20px',
        zIndex: 9999, // Najviši prioritet
        display: 'flex',
        gap: '10px'
      }}>
        <button 
          onClick={() => supabase.auth.signOut()} 
          style={{ background: '#ff4b4b', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 5px 15px rgba(255,75,75,0.3)' }}
        >
          <FaSignOutAlt /> END SESSION
        </button>
      </div>

      <main style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* NASLOV PANELA */}
        <div style={{ marginBottom: '40px', borderLeft: `4px solid ${theme.accent}`, paddingLeft: '20px' }}>
          <h1 style={{ fontSize: '24px', letterSpacing: '2px', margin: 0 }}>CONTROL PANEL</h1>
          <p style={{ color: '#555', margin: '5px 0 0 0' }}>Dobrodošli nazad, dr Zdravko</p>
        </div>

        {/* FORMA ZA UNOS / IZMENU */}
        <section style={{ background: theme.card, padding: '30px', borderRadius: '20px', border: '1px solid #2d3446', marginBottom: '40px' }}>
          <h4 style={{ color: theme.accent, marginBottom: '25px' }}>
            {editingId ? "// EDIT SCIENTIFIC ENTRY" : "// ADD NEW SCIENTIFIC ENTRY"}
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <input type="text" placeholder="Project Title" value={newProject.title} onChange={(e) => setNewProject({...newProject, title: e.target.value})} style={{ padding: '15px', borderRadius: '10px', border: '1px solid #2d3446', background: theme.inputBg, color: 'white' }} />
            <input type="text" placeholder="Technologies / Stack" value={newProject.technologies} onChange={(e) => setNewProject({...newProject, technologies: e.target.value})} style={{ padding: '15px', borderRadius: '10px', border: '1px solid #2d3446', background: theme.inputBg, color: 'white' }} />
            <textarea placeholder="Scientific Abstract" value={newProject.description} onChange={(e) => setNewProject({...newProject, description: e.target.value})} style={{ padding: '15px', borderRadius: '10px', border: '1px solid #2d3446', background: theme.inputBg, color: 'white', minHeight: '120px' }} />
            
            <button style={{ background: theme.accent, padding: '18px', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', color: 'black' }}>
              {editingId ? "UPDATE RESEARCH" : "PUBLISH RESEARCH"}
            </button>
            {editingId && <button onClick={() => setEditingId(null)} style={{ background: 'none', color: '#555', border: 'none', cursor: 'pointer' }}>Cancel Edit</button>}
          </div>
        </section>

        {/* O MENI EDITOR */}
        <section style={{ background: theme.card, padding: '30px', borderRadius: '20px', border: '1px solid #2d3446', marginBottom: '40px' }}>
          <h4 style={{ color: theme.accent, marginBottom: '25px' }}>UREDI "O MENI" SEKCIJU</h4>
          <AdminAboutEditor />
        </section>

        {/* ACTIVE RECORDS LISTA */}
        <section style={{ background: theme.card, padding: '30px', borderRadius: '20px', border: '1px solid #2d3446' }}>
          <h4 style={{ color: '#555', fontSize: '11px', letterSpacing: '2px', marginBottom: '20px' }}>ACTIVE DATABASE RECORDS</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {projekti.map(p => (
              <div key={p.id} style={{ background: '#1f2537', padding: '15px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 'bold', fontSize: '14px' }}>{p.title}</span>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => handleEdit(p)} style={{ background: '#2d3446', color: 'white', border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer' }}><FaEdit /></button>
                  <button style={{ background: '#2d3446', color: '#ff4b4b', border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer' }}><FaTrash /></button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PROMENA LOZINKE */}
        <div style={{ marginTop: '50px', textAlign: 'center' }}>
          <button onClick={() => setIsResettingPassword(!isResettingPassword)} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer' }}>
            <FaLock /> {isResettingPassword ? "ZATVORI" : "PROMENI LOZINKU"}
          </button>
          {isResettingPassword && (
            <div style={{ marginTop: '10px' }}>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Nova lozinka" style={{ padding: '10px', borderRadius: '8px', border: '1px solid #2d3446', background: theme.inputBg, color: 'white' }} />
            </div>
          )}
        </div>

      </main>
    </div>
  );
};

export default AdminPanel;