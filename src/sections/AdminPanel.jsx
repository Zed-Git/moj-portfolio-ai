import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion'; 
import { 
  FaTrash, FaSignOutAlt, FaCloudUploadAlt, FaLock, 
  FaInfoCircle, FaEdit, FaTimes, FaFingerprint 
} from 'react-icons/fa';

// Uvozimo Vaš editor za biografiju
import AdminAboutEditor from '../components/admin/AdminAboutEditor';

const AdminPanel = () => {
  // --- STANJA (States) ---
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

  // --- LOGIKA ZA PODATKE (Mora biti definisana pre useEffect-a) ---

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

  useEffect(() => {
    // Provera sesije pri učitavanju
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

  // --- FUNKCIJE ZA DUGMAD ---

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert('Greška pri prijavi: ' + error.message);
    setLoading(false);
  };

  const handleEdit = (rad) => {
    // Kada kliknete na olovku, podaci tog rada se popunjavaju u gornju formu za izmenu
    setEditingId(rad.id);
    setNewProject({
      title: rad.title,
      technologies: rad.technologies || '',
      description: rad.description || '',
      image_url: rad.image_url || '',
      link: rad.link || ''
    });
    // Automatski skroluje na vrh do forme
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Da li ste sigurni da želite da obrišete ovaj naučni rad?")) {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) alert("Greška pri brisanju: " + error.message);
      else fetchProjects(); // Osveži listu nakon brisanja
    }
  };

  const handlePasswordReset = async () => {
    if (!newPassword) return alert("Unesite novu lozinku.");
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) alert("Greška: " + error.message);
    else {
      alert("Lozinka je uspešno promenjena!");
      setIsResettingPassword(false);
      setNewPassword('');
    }
  };

  // --- STILOVI TEMA (ZED AI-PORTFOLIO) ---
  const theme = {
    bg: '#0a0b14',
    card: '#161b2b',
    accent: '#00d1ff',
    inputBg: '#1f2537'
  };

  if (loading) return <div style={{background: theme.bg, color: 'white', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>Inicijalizacija...</div>;

  // 1. PRIKAZ LOGIN FORME (Ako nema sesije)
  if (!session) {
    return (
      <div style={{ background: theme.bg, minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif' }}>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ background: theme.card, padding: '40px', borderRadius: '24px', width: '400px', textAlign: 'center', border: '1px solid #2d3446' }}>
          <FaFingerprint style={{ fontSize: '60px', color: theme.accent, marginBottom: '20px' }} />
          <h2 style={{ color: 'white', letterSpacing: '3px', marginBottom: '30px' }}>SECURE ACCESS</h2>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input type="email" placeholder="mdzdravko@Gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} style={{ padding: '15px', borderRadius: '12px', border: '1px solid #2d3446', background: theme.inputBg, color: 'white' }} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ padding: '15px', borderRadius: '12px', border: '1px solid #2d3446', background: theme.inputBg, color: 'white' }} />
            <button type="submit" style={{ padding: '15px', borderRadius: '12px', border: 'none', background: theme.accent, color: 'black', fontWeight: 'bold', cursor: 'pointer' }}>AUTHORIZE</button>
          </form>
          <button onClick={() => alert("Kontaktirajte administratora za oporavak ključa.")} style={{ background: 'none', border: 'none', color: '#555', marginTop: '20px', cursor: 'pointer' }}>🔑 FORGOT YOUR KEY PHRASE?</button>
        </motion.div>
      </div>
    );
  }

  // 2. PRIKAZ ADMIN PANELA (Ako je ulogovan)
  return (
    <div style={{ background: theme.bg, minHeight: '100vh', color: 'white', fontFamily: 'sans-serif', padding: '20px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1000px', margin: '0 auto 30px auto', borderBottom: '1px solid #2d3446', paddingBottom: '15px' }}>
        <h2 style={{ color: theme.accent, letterSpacing: '2px', fontSize: '16px' }}>CONTROL PANEL</h2>
        <button onClick={() => supabase.auth.signOut()} style={{ background: 'rgba(255, 75, 75, 0.1)', color: '#ff4b4b', border: '1px solid #ff4b4b', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer' }}>END SESSION</button>
      </header>

      <main style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* FORMA ZA DODAVANJE / IZMENU */}
        <section style={{ background: theme.card, padding: '30px', borderRadius: '20px', border: '1px solid #2d3446', marginBottom: '30px' }}>
          <h4 style={{ color: theme.accent, marginBottom: '20px' }}>{editingId ? "// EDIT SCIENTIFIC ENTRY" : "// ADD NEW SCIENTIFIC ENTRY"}</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input type="text" placeholder="Project Title" value={newProject.title} onChange={(e) => setNewProject({...newProject, title: e.target.value})} style={{ padding: '15px', borderRadius: '10px', border: '1px solid #2d3446', background: theme.inputBg, color: 'white' }} />
            <input type="text" placeholder="Technologies / Stack" value={newProject.technologies} onChange={(e) => setNewProject({...newProject, technologies: e.target.value})} style={{ padding: '15px', borderRadius: '10px', border: '1px solid #2d3446', background: theme.inputBg, color: 'white' }} />
            <textarea placeholder="Scientific Abstract" value={newProject.description} onChange={(e) => setNewProject({...newProject, description: e.target.value})} style={{ padding: '15px', borderRadius: '10px', border: '1px solid #2d3446', background: theme.inputBg, color: 'white', minHeight: '100px' }} />
            
            <div style={{ border: '2px dashed #2d3446', padding: '20px', textAlign: 'center', borderRadius: '10px', color: theme.accent }}>
              <FaCloudUploadAlt style={{ fontSize: '30px' }} />
              <p>{uploading ? "UPLOADING..." : "REPLACE / UPLOAD MEDIA ASSET"}</p>
            </div>
            
            <button style={{ background: theme.accent, padding: '15px', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', color: 'black' }}>
              {editingId ? "UPDATE RESEARCH" : "PUBLISH RESEARCH"}
            </button>
            {editingId && <button onClick={() => {setEditingId(null); setNewProject({title:'', technologies:'', description:'', image_url:'', link:''})}} style={{ background: 'none', color: 'white', border: '1px solid #444', padding: '10px', borderRadius: '10px' }}>CANCEL EDIT</button>}
          </div>
        </section>

        {/* EDITOR BIOGRAFIJE */}
        <section style={{ background: theme.card, padding: '30px', borderRadius: '20px', border: '1px solid #2d3446', marginBottom: '30px' }}>
          <h4 style={{ color: theme.accent, marginBottom: '20px' }}>UREDI "O MENI" SEKCIJU</h4>
          <AdminAboutEditor />
        </section>

        {/* LISTA RADOVA (ACTIVE DATABASE RECORDS) */}
        <section style={{ background: theme.card, padding: '30px', borderRadius: '20px', border: '1px solid #2d3446' }}>
          <h4 style={{ color: '#555', fontSize: '11px', letterSpacing: '2px', marginBottom: '20px' }}>ACTIVE DATABASE RECORDS</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {projekti.map(p => (
              <div key={p.id} style={{ background: '#1f2537', padding: '15px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: editingId === p.id ? `1px solid ${theme.accent}` : '1px solid transparent' }}>
                <span style={{ fontWeight: 'bold', fontSize: '13px', textTransform: 'uppercase' }}>{p.title}</span>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => handleEdit(p)} style={{ background: '#2d3446', color: 'white', border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer' }}><FaEdit /></button>
                  <button onClick={() => handleDelete(p.id)} style={{ background: '#2d3446', color: '#ff4b4b', border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer' }}><FaTrash /></button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PROMENA LOZINKE (Sada sa funkcijom) */}
        <div style={{ marginTop: '40px', textAlign: 'center', paddingBottom: '40px' }}>
          <button onClick={() => setIsResettingPassword(!isResettingPassword)} style={{ background: 'transparent', color: '#555', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 auto' }}>
            <FaLock /> {isResettingPassword ? "ZATVORI" : "PROMENI LOZINKU"}
          </button>
          
          <AnimatePresence>
            {isResettingPassword && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
                <div style={{ marginTop: '15px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
                  <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Nova lozinka" style={{ padding: '12px', borderRadius: '8px', border: '1px solid #2d3446', background: theme.inputBg, color: 'white' }} />
                  <button onClick={handlePasswordReset} style={{ background: theme.accent, padding: '0 20px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>POTVRDI</button>
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