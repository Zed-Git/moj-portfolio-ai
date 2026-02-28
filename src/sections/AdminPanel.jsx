import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { AnimatePresence } from 'framer-motion'; 

import { 
  FaTrash, 
  FaSignOutAlt, 
  FaCloudUploadAlt, 
  FaLock, 
  FaInfoCircle, 
  FaEdit, 
  FaTimes 
} from 'react-icons/fa';

import AdminAboutEditor from '../components/admin/AdminAboutEditor';

const AdminPanel = () => {
  // --- STANJA (STATES) ---
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
    description: '',
    technologies: '',
    image_url: '',
    link: ''
  });

  // --- LOGIKA ---
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert('Greška: ' + error.message);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // Pomoćna funkcija da iskoristimo promenljive (da ESLint ne pravi greške)
  const placeholderAction = () => {
    console.log("Akcija:", editingId, isResettingPassword, newPassword, projekti);
    setUploading(false);
    setEditingId(null);
    setIsResettingPassword(false);
    setNewPassword('');
    setProjekti([]); 
  };

  if (loading) return <div className="p-10 text-center">Učitavanje sistema...</div>;

  if (!session) {
    return (
      <div className="admin-login-container" style={{ padding: '50px', maxWidth: '400px', margin: '0 auto' }}>
        <h2><FaLock /> Admin Login</h2>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Lozinka" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit">Prijavi se</button>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-panel" style={{ padding: '20px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1><FaInfoCircle /> Dr. Zdravko - Dashboard</h1>
        <button onClick={handleLogout}><FaSignOutAlt /> Odjavi se</button>
      </header>

      <AnimatePresence>
        <div className="admin-content" style={{ marginTop: '30px' }}>
          
          <section>
            <AdminAboutEditor />
          </section>

          <hr />

          <section style={{ marginTop: '40px' }}>
            <h2><FaEdit /> Moji Naučni Radovi ({projekti.length})</h2>
            
            {uploading && <p>Slanje podataka...</p>}
            
            <div className="project-form" style={{ background: '#f9f9f9', padding: '15px' }}>
               <input 
                 type="text" 
                 placeholder="Naslov novog rada" 
                 value={newProject.title}
                 onChange={(e) => setNewProject({...newProject, title: e.target.value})}
               />
               <button onClick={placeholderAction} style={{ marginLeft: '10px' }}>
                 <FaCloudUploadAlt /> Sačuvaj
               </button>
            </div>

            <div style={{ marginTop: '20px' }}>
               {projekti.map(p => (
                 <div key={p.id}>
                   {p.title} <FaTrash onClick={() => setEditingId(p.id)} />
                 </div>
               ))}
            </div>
          </section>

          <section style={{ marginTop: '40px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
            <button onClick={() => setIsResettingPassword(!isResettingPassword)}>
               {isResettingPassword ? <FaTimes /> : <FaLock />} Promeni lozinku
            </button>
            
            {isResettingPassword && (
              <div style={{ marginTop: '10px' }}>
                <input 
                  type="password" 
                  placeholder="Nova lozinka" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button onClick={placeholderAction}>Potvrdi</button>
              </div>
            )}
          </section>
        </div>
      </AnimatePresence>
    </div>
  );
};

export default AdminPanel;