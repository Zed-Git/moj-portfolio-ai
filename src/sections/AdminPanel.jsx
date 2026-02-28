import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion'; 
import { 
  FaTrash, FaSignOutAlt, FaCloudUploadAlt, FaLock, 
  FaInfoCircle, FaEdit, FaTimes, FaFingerprint 
} from 'react-icons/fa';

import AdminAboutEditor from '../components/admin/AdminAboutEditor';

const AdminPanel = () => {
  // --- STATES (Vaš originalni protokol) ---
  const [session, setSession] = useState(null);
  const [projekti, setProjekti] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false); // SADA SE KORISTI (Problem rešen)
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

  // --- 1. FETCH DATA (Dohvatanje podataka iz baze) ---
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

  // --- 2. AUTH HANDLERS (Login & Reset) ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert('Access Denied: ' + error.message);
    setLoading(false);
  };

  const handleForgotPassword = async () => {
    if (!email) return alert("Please enter your email first!");
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) alert("Error: " + error.message);
    else alert("Reset link sent to your email!");
  };

  // --- 3. UPLOAD & SUBMIT LOGIC (Upload i Slanje u bazu) ---
  
  // Funkcija za Upload Media Asset
  const handleFileUpload = async (e) => {
    try {
      setUploading(true);
      const file = e.target.files[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `project-images/${fileName}`;

      let { error: uploadError } = await supabase.storage
        .from('portfolio-assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('portfolio-assets').getPublicUrl(filePath);
      setNewProject({ ...newProject, image_url: data.publicUrl });
      alert("Media Asset Uploaded Successfully!");
    } catch (error) {
      alert("Upload failed: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  // Funkcija za PUBLISH i UPDATE (Rešava tačku 4)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const projectData = { ...newProject, user_id: session.user.id };

    let error;
    if (editingId) {
      // UPDATE Postojeći
      const { error: updateError } = await supabase
        .from('projects')
        .update(projectData)
        .eq('id', editingId);
      error = updateError;
    } else {
      // INSERT Novi
      const { error: insertError } = await supabase
        .from('projects')
        .insert([projectData]);
      error = insertError;
    }

    if (error) alert("Error saving: " + error.message);
    else {
      alert(editingId ? "Research Updated!" : "Research Published!");
      setEditingId(null);
      setNewProject({ title: '', technologies: '', description: '', image_url: '', link: '' });
      fetchProjects();
    }
    setLoading(false);
  };

  // Funkcija za Edit (Olovka - Rešava tačku 5)
  const handleEdit = (rad) => {
    setEditingId(rad.id);
    setNewProject({
      title: rad.title || '',
      technologies: rad.technologies || '',
      description: rad.description || '',
      image_url: rad.image_url || '',
      link: rad.link || ''
    });
    window.scrollTo({ top: 150, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm("DELETE THIS SCIENTIFIC RECORD?")) {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) alert("Error: " + error.message);
      else fetchProjects();
    }
  };

  // --- THEME ---
  const theme = {
    bg: '#0a0b14',
    card: '#161b2b',
    accent: '#00d1ff',
    inputBg: '#252b3d'
  };

  if (loading && !session) return <div style={{background: theme.bg, color: 'white', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>INITIALIZING...</div>;

  // --- LOGIN UI ---
  if (!session) {
    return (
      <div style={{ background: theme.bg, minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif' }}>
        {/* Koristimo 'motion' za animaciju - Rešava Problem u VS Code */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ background: theme.card, padding: '50px', borderRadius: '24px', width: '420px', textAlign: 'center', border: '1px solid #2d3446' }}>
          <FaFingerprint style={{ fontSize: '70px', color: theme.accent, marginBottom: '20px' }} />
          <h2 style={{ color: 'white', letterSpacing: '4px', marginBottom: '40px' }}>SECURE ACCESS</h2>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <input type="email" placeholder="mdzdravko@Gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '16px', borderRadius: '12px', border: 'none', background: theme.inputBg, color: 'white', fontSize: '16px', boxSizing: 'border-box' }} />
            <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '16px', borderRadius: '12px', border: 'none', background: theme.inputBg, color: 'white', fontSize: '16px', boxSizing: 'border-box' }} />
            <button type="submit" style={{ padding: '18px', borderRadius: '12px', border: 'none', background: theme.accent, color: 'black', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' }}>AUTHORIZE</button>
          </form>
          
          <div style={{ marginTop: '30px', fontSize: '12px', color: '#555', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <span onClick={handleForgotPassword} style={{ cursor: 'pointer', textDecoration: 'underline' }}>🔑 FORGOT YOUR KEY PHRASE?</span>
            <span onClick={handleForgotPassword} style={{ cursor: 'pointer', textDecoration: 'underline' }}>❓ FORGOT YOUR PASSWORD?</span>
          </div>
        </motion.div>
      </div>
    );
  }

  // --- DASHBOARD UI ---
  return (
    <div style={{ background: theme.bg, minHeight: '100vh', color: 'white', padding: '140px 20px 60px 20px', fontFamily: 'sans-serif', textAlign: 'left' }}>
      
      {/* END SESSION BUTTON */}
      <div style={{ position: 'fixed', top: '100px', right: '20px', zIndex: 1000 }}>
        <button onClick={() => supabase.auth.signOut()} style={{ background: '#7e1e1e', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
          <FaSignOutAlt /> END SESSION
        </button>
      </div>

      <main style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '40px' }}>
          <div style={{ width: '4px', height: '30px', background: theme.accent }}></div>
          <h2 style={{ color: 'white', fontSize: '24px', letterSpacing: '3px', margin: 0 }}>CONTROL PANEL</h2>
        </div>

        {/* SCIENTIFIC ENTRY FORM */}
        <section style={{ background: theme.card, padding: '40px', borderRadius: '24px', border: '1px solid #2d3446', marginBottom: '40px' }}>
          <h4 style={{ color: theme.accent, marginBottom: '30px', letterSpacing: '1px' }}>
            {editingId ? "// EDIT SCIENTIFIC ENTRY" : "// ADD NEW SCIENTIFIC ENTRY"}
          </h4>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            <input type="text" placeholder="Project Title" value={newProject.title} onChange={(e) => setNewProject({...newProject, title: e.target.value})} style={{ padding: '18px', borderRadius: '12px', border: 'none', background: '#0a0b14', color: 'white', fontSize: '16px' }} required />
            <input type="text" placeholder="Technologies / Stack" value={newProject.technologies} onChange={(e) => setNewProject({...newProject, technologies: e.target.value})} style={{ padding: '18px', borderRadius: '12px', border: 'none', background: '#0a0b14', color: 'white', fontSize: '16px' }} />
            <textarea placeholder="Scientific Abstract" value={newProject.description} onChange={(e) => setNewProject({...newProject, description: e.target.value})} style={{ padding: '18px', borderRadius: '12px', border: 'none', background: '#0a0b14', color: 'white', fontSize: '16px', minHeight: '150px' }} />
            
            {/* UPLOAD MEDIA ASSET (Rešava tačku 3) */}
            <div style={{ position: 'relative' }}>
              <input type="file" id="file-upload" onChange={handleFileUpload} style={{ display: 'none' }} />
              <label htmlFor="file-upload" style={{ border: '2px dashed #2d3446', padding: '40px', textAlign: 'center', borderRadius: '15px', color: theme.accent, cursor: 'pointer', display: 'block' }}>
                <FaCloudUploadAlt style={{ fontSize: '40px', marginBottom: '10px' }} />
                <p style={{ margin: 0, fontWeight: 'bold' }}>{uploading ? "UPLOADING..." : "REPLACE / UPLOAD MEDIA ASSET"}</p>
                {newProject.image_url && <small style={{color: '#555'}}><br/>Current asset: {newProject.image_url.substring(0, 30)}...</small>}
              </label>
            </div>

            <div style={{ background: 'rgba(0, 209, 255, 0.05)', padding: '15px', borderRadius: '10px', borderLeft: `3px solid ${theme.accent}`, display: 'flex', alignItems: 'center', gap: '15px' }}>
               <FaInfoCircle style={{ color: theme.accent }} />
               <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>NOTE: JPG, PNG AND MP4 ALLOWED. MAX SIZE: 50MB.</p>
            </div>
            
            <button type="submit" style={{ background: theme.accent, padding: '20px', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', color: 'black', fontSize: '16px', letterSpacing: '1px' }}>
              {editingId ? "UPDATE RESEARCH" : "PUBLISH RESEARCH"}
            </button>
            
            {editingId && (
              <button type="button" onClick={() => {setEditingId(null); setNewProject({title:'', technologies:'', description:'', image_url:'', link:''})}} style={{ background: 'transparent', color: '#555', border: 'none', cursor: 'pointer' }}>
                CANCEL EDIT
              </button>
            )}
          </form>
        </section>

        {/* BIOGRAPHY EDITOR */}
        <section style={{ background: theme.card, padding: '40px', borderRadius: '24px', border: '1px solid #2d3446', marginBottom: '40px' }}>
          <h4 style={{ color: theme.accent, marginBottom: '25px' }}>UREDI "O MENI" SEKCIJU</h4>
          <AdminAboutEditor />
        </section>

        {/* ACTIVE DATABASE RECORDS */}
        <section style={{ background: theme.card, padding: '40px', borderRadius: '24px', border: '1px solid #2d3446' }}>
          <h4 style={{ color: '#555', fontSize: '12px', letterSpacing: '2px', marginBottom: '30px' }}>ACTIVE DATABASE RECORDS</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {projekti.map(p => (
              <div key={p.id} style={{ background: '#0a0b14', padding: '20px', borderRadius: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: editingId === p.id ? `1px solid ${theme.accent}` : '1px solid transparent' }}>
                <span style={{ fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase' }}>{p.title}</span>
                <div style={{ display: 'flex', gap: '15px' }}>
                  <button onClick={() => handleEdit(p)} style={{ background: '#252b3d', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer' }}><FaEdit /></button>
                  <button onClick={() => handleDelete(p.id)} style={{ background: '#252b3d', color: '#ff4b4b', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer' }}><FaTrash /></button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PASSWORD RESET BUTTONS */}
        <div style={{ marginTop: '60px', textAlign: 'center', opacity: 0.5 }}>
           <p onClick={() => setIsResettingPassword(!isResettingPassword)} style={{ cursor: 'pointer', fontSize: '14px' }}>
             <FaLock /> PROMENI LOZINKU
           </p>
           <AnimatePresence>
             {isResettingPassword && (
               <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} style={{ overflow: 'hidden' }}>
                 <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New Password" style={{ background: '#161b2b', color: 'white', border: '1px solid #2d3446', padding: '10px', borderRadius: '8px', marginTop: '10px' }} />
               </motion.div>
             )}
           </AnimatePresence>
        </div>

      </main>
    </div>
  );
};

export default AdminPanel;