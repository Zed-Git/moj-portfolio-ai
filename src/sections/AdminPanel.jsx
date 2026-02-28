import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion'; 
import { 
  FaTrash, FaSignOutAlt, FaCloudUploadAlt, FaLock, 
  FaInfoCircle, FaEdit, FaTimes, FaFingerprint 
} from 'react-icons/fa';

import AdminAboutEditor from '../components/admin/AdminAboutEditor';

const AdminPanel = () => {
  // --- STATES (Kao u Vašem originalnom protokolu) ---
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

  // --- DATABASE LOGIC ---

  const fetchProjects = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setProjekti(data || []);
    } catch (error) {
      console.error("Database Error:", error.message);
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

  // --- ACTION HANDLERS ---

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert('Access Denied: ' + error.message);
    setLoading(false);
  };

  // FIX: Klik na olovku sada puni formu i skroluje na vrh
  const handleEdit = (rad) => {
    setEditingId(rad.id);
    setNewProject({
      title: rad.title || '',
      technologies: rad.technologies || '',
      description: rad.description || '',
      image_url: rad.image_url || '',
      link: rad.link || ''
    });
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  // FIX: Brisanje sada zapravo uklanja rad iz Supabase-a
  const handleDelete = async (id) => {
    if (window.confirm("ARE YOU SURE YOU WANT TO DELETE THIS RECORD?")) {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) alert("Error: " + error.message);
      else fetchProjects(); // Osveži listu
    }
  };

  // --- THEME & STYLES (Zed AI-Portfolio Theme) ---
  const theme = {
    bg: '#0a0b14',
    card: '#161b2b',
    accent: '#00d1ff',
    inputBg: '#252b3d'
  };

  if (loading) return <div style={{background: theme.bg, color: 'white', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>INITIALIZING SYSTEM...</div>;

  // --- 1. LOGIN UI (SECURE ACCESS) ---
  if (!session) {
    return (
      <div style={{ background: theme.bg, minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif' }}>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ background: theme.card, padding: '50px', borderRadius: '24px', width: '420px', textAlign: 'center', border: '1px solid #2d3446', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
          <FaFingerprint style={{ fontSize: '70px', color: theme.accent, marginBottom: '20px' }} />
          <h2 style={{ color: 'white', letterSpacing: '4px', marginBottom: '40px', fontWeight: '300' }}>SECURE ACCESS</h2>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ position: 'relative' }}>
              <input type="email" placeholder="mdzdravko@Gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '16px', borderRadius: '12px', border: 'none', background: theme.inputBg, color: 'white', fontSize: '16px', boxSizing: 'border-box' }} />
            </div>
            <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '16px', borderRadius: '12px', border: 'none', background: theme.inputBg, color: 'white', fontSize: '16px', boxSizing: 'border-box' }} />
            <button type="submit" style={{ padding: '18px', borderRadius: '12px', border: 'none', background: theme.accent, color: 'black', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', letterSpacing: '2px' }}>AUTHORIZE</button>
          </form>
          {/* VRAĆEN "FORGOT KEY PHRASE" */}
          <p style={{ color: '#444', marginTop: '30px', fontSize: '12px', letterSpacing: '1px', cursor: 'pointer' }}>🔑 FORGOT YOUR KEY PHRASE?</p>
        </motion.div>
      </div>
    );
  }

  // --- 2. ADMIN DASHBOARD UI ---
  return (
    <div style={{ background: theme.bg, minHeight: '100vh', color: 'white', padding: '140px 20px 60px 20px', fontFamily: 'sans-serif' }}>
      
      {/* RESTORED HEADER */}
      <div style={{ maxWidth: '1000px', margin: '0 auto 40px auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ color: theme.accent, fontSize: '20px', letterSpacing: '3px' }}>CONTROL PANEL</h2>
        <button onClick={() => supabase.auth.signOut()} style={{ background: '#7e1e1e', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}>END SESSION</button>
      </div>

      <main style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'left' }}>
        
        {/* ADD / EDIT SCIENTIFIC ENTRY SECTION */}
        <section style={{ background: theme.card, padding: '40px', borderRadius: '24px', border: '1px solid #2d3446', marginBottom: '40px' }}>
          <h4 style={{ color: theme.accent, marginBottom: '30px', letterSpacing: '1px' }}>
            {editingId ? "// EDIT SCIENTIFIC ENTRY" : "// ADD NEW SCIENTIFIC ENTRY"}
          </h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            <input type="text" placeholder="Project Title" value={newProject.title} onChange={(e) => setNewProject({...newProject, title: e.target.value})} style={{ padding: '18px', borderRadius: '12px', border: 'none', background: '#0a0b14', color: 'white', fontSize: '16px' }} />
            <input type="text" placeholder="Technologies / Stack" value={newProject.technologies} onChange={(e) => setNewProject({...newProject, technologies: e.target.value})} style={{ padding: '18px', borderRadius: '12px', border: 'none', background: '#0a0b14', color: 'white', fontSize: '16px' }} />
            <textarea placeholder="Scientific Abstract" value={newProject.description} onChange={(e) => setNewProject({...newProject, description: e.target.value})} style={{ padding: '18px', borderRadius: '12px', border: 'none', background: '#0a0b14', color: 'white', fontSize: '16px', minHeight: '150px' }} />
            
            {/* UPLOAD ZONE */}
            <div style={{ border: '2px dashed #2d3446', padding: '40px', textAlign: 'center', borderRadius: '15px', color: theme.accent, cursor: 'pointer' }}>
              <FaCloudUploadAlt style={{ fontSize: '40px', marginBottom: '10px' }} />
              <p style={{ margin: 0, fontWeight: 'bold' }}>REPLACE / UPLOAD MEDIA ASSET</p>
            </div>

            {/* NOTE SECTION (VRAĆENO PREMA SLICI) */}
            <div style={{ background: 'rgba(0, 209, 255, 0.05)', padding: '15px', borderRadius: '10px', borderLeft: `3px solid ${theme.accent}`, display: 'flex', alignItems: 'center', gap: '15px' }}>
               <FaInfoCircle style={{ color: theme.accent }} />
               <p style={{ margin: 0, fontSize: '12px', color: '#888', letterSpacing: '0.5px' }}>
                 NOTE: JPG, PNG AND MP4 ALLOWED. MAX SIZE: 50MB.
               </p>
            </div>
            
            <button style={{ background: theme.accent, padding: '20px', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', color: 'black', fontSize: '16px', letterSpacing: '1px', marginTop: '10px' }}>
              {editingId ? "UPDATE RESEARCH" : "PUBLISH RESEARCH"}
            </button>
            
            {editingId && (
              <button onClick={() => {setEditingId(null); setNewProject({title:'', technologies:'', description:'', image_url:'', link:''})}} style={{ background: 'transparent', color: '#555', border: 'none', cursor: 'pointer' }}>
                CANCEL EDIT
              </button>
            )}
          </div>
        </section>

        {/* UREDI O MENI */}
        <section style={{ background: theme.card, padding: '40px', borderRadius: '24px', border: '1px solid #2d3446', marginBottom: '40px' }}>
          <h4 style={{ color: theme.accent, marginBottom: '25px', letterSpacing: '1px' }}>UREDI "O MENI" SEKCIJU</h4>
          <AdminAboutEditor />
        </section>

        {/* ACTIVE DATABASE RECORDS LIST */}
        <section style={{ background: theme.card, padding: '40px', borderRadius: '24px', border: '1px solid #2d3446' }}>
          <h4 style={{ color: '#555', fontSize: '12px', letterSpacing: '2px', marginBottom: '30px' }}>ACTIVE DATABASE RECORDS</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {projekti.map(p => (
              <div key={p.id} style={{ background: '#0a0b14', padding: '20px', borderRadius: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: editingId === p.id ? `1px solid ${theme.accent}` : '1px solid transparent' }}>
                <span style={{ fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>{p.title}</span>
                <div style={{ display: 'flex', gap: '15px' }}>
                  <button onClick={() => handleEdit(p)} style={{ background: '#252b3d', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer' }}><FaEdit /></button>
                  <button onClick={() => handleDelete(p.id)} style={{ background: '#252b3d', color: '#ff4b4b', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer' }}><FaTrash /></button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* BOTTOM PASSWORD RESET */}
        <div style={{ marginTop: '60px', textAlign: 'center', opacity: 0.5 }}>
           <p onClick={() => setIsResettingPassword(!isResettingPassword)} style={{ cursor: 'pointer', fontSize: '14px' }}>
             <FaLock /> PROMENI LOZINKU
           </p>
           {isResettingPassword && (
             <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New Password" style={{ background: '#161b2b', color: 'white', border: '1px solid #2d3446', padding: '10px', borderRadius: '8px' }} />
           )}
        </div>

      </main>
    </div>
  );
};

export default AdminPanel;