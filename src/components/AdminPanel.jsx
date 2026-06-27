import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { 
  User, 
  Briefcase, 
  Database, 
  LogOut, 
  Plus, 
  Edit3, 
  Trash2, 
  RefreshCw, 
  AlertTriangle, 
  Upload, 
  Check, 
  ArrowLeft,
  Settings,
  ShieldAlert
} from 'lucide-react';

export function AdminPanel({ onLogout }) {
  const [activeTab, setActiveTab] = useState('experiences'); // 'experiences' or 'projects'
  
  // Data States
  const [experiences, setExperiences] = useState([]);
  const [projects, setProjects] = useState([]);
  
  // Loading & Alert States
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Experience Form State
  const [expId, setExpId] = useState(null); // Null for Add, ID for Edit
  const [expCompany, setExpCompany] = useState('');
  const [expRole, setExpRole] = useState('');
  const [expDuration, setExpDuration] = useState('');
  const [expHighlightsText, setExpHighlightsText] = useState(''); // Textarea, line-separated
  const [expModelType, setExpModelType] = useState('lens'); // 'lens' or 'prism'
  const [expColor, setExpColor] = useState('#00f0ff'); // '#00f0ff' or '#ffd700'
  const [expRadius, setExpRadius] = useState(4.8);
  const [expSpeed, setExpSpeed] = useState(0.08);

  // Project Form State
  const [projId, setProjId] = useState(null); // Null for Add, ID for Edit
  const [projTitle, setProjTitle] = useState('');
  const [projTagline, setProjTagline] = useState('');
  const [projYear, setProjYear] = useState('2026');
  const [projColor, setProjColor] = useState('#00f0ff');
  const [projDemoUrl, setProjDemoUrl] = useState('');
  const [projImageUrl, setProjImageUrl] = useState('');
  const [projDescription, setProjDescription] = useState('');
  const [projBullet1, setProjBullet1] = useState('');
  const [projBullet2, setProjBullet2] = useState('');
  const [projBullet3, setProjBullet3] = useState('');
  const [projSkills, setProjSkills] = useState('');
  const [projSortOrder, setProjSortOrder] = useState(0);

  // Image Upload State
  const [uploadFile, setUploadFile] = useState(null);
  const [confirmCinematic, setConfirmCinematic] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Fetch initial data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      // 1. Fetch Experiences
      const { data: expData, error: expErr } = await supabase
        .from('experiences')
        .select('*')
        .order('created_at', { ascending: true });
        
      if (expErr) throw expErr;
      setExperiences(expData || []);

      // 2. Fetch Projects
      const { data: projData, error: projErr } = await supabase
        .from('projects')
        .select('*')
        .order('sort_order', { ascending: true });

      if (projErr) throw projErr;
      setProjects(projData || []);

    } catch (err) {
      console.error('Data retrieval core error:', err);
      setError('Failed to synchronize with Supabase tables. Check database link.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    onLogout();
  };

  // ================= EXPERIENCE CRUD CONTROLLERS =================
  const resetExpForm = () => {
    setExpId(null);
    setExpCompany('');
    setExpRole('');
    setExpDuration('');
    setExpHighlightsText('');
    setExpModelType('lens');
    setExpColor('#00f0ff');
    setExpRadius(4.8);
    setExpSpeed(0.08);
  };

  const handleEditExpSelect = (exp) => {
    setExpId(exp.id);
    setExpCompany(exp.company);
    setExpRole(exp.role);
    setExpDuration(exp.duration);
    setExpHighlightsText(exp.highlights ? exp.highlights.join('\n') : '');
    setExpModelType(exp.model_type || 'lens');
    setExpColor(exp.color || '#00f0ff');
    setExpRadius(exp.radius || 4.8);
    setExpSpeed(exp.speed || 0.08);
    
    // Smooth scroll to form
    document.getElementById('exp-form-anchor')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleExpSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    // Format highlights array from textarea lines
    const highlights = expHighlightsText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    const payload = {
      company: expCompany,
      role: expRole,
      duration: expDuration,
      highlights,
      model_type: expModelType,
      color: expColor,
      radius: parseFloat(expRadius),
      speed: parseFloat(expSpeed)
    };

    try {
      if (expId) {
        // Update Action
        const { error: updateErr } = await supabase
          .from('experiences')
          .update(payload)
          .eq('id', expId);
        
        if (updateErr) throw updateErr;
        setSuccess(`Experience node '${expCompany}' updated successfully.`);
      } else {
        // Insert Action
        const { error: insertErr } = await supabase
          .from('experiences')
          .insert([payload]);

        if (insertErr) throw insertErr;
        setSuccess(`New Experience node '${expCompany}' registered in data core.`);
      }

      resetExpForm();
      await fetchData();
    } catch (err) {
      console.error('Experience submit failed:', err);
      setError(err.message || 'Database write rejected.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteExp = async (id, company) => {
    if (!window.confirm(`Calibrate system: Permanently delete experience node '${company}'?`)) return;
    setLoading(true);
    try {
      const { error: delErr } = await supabase
        .from('experiences')
        .delete()
        .eq('id', id);

      if (delErr) throw delErr;
      setSuccess(`Experience node '${company}' removed. 3D timeline ring spacing recalibrated.`);
      await fetchData();
    } catch (err) {
      console.error('Delete experience failed:', err);
      setError(err.message || 'Database delete request rejected.');
    } finally {
      setLoading(false);
    }
  };

  // ================= PROJECT CRUD CONTROLLERS =================
  const resetProjForm = () => {
    setProjId(null);
    setProjTitle('');
    setProjTagline('');
    setProjYear('2026');
    setProjColor('#00f0ff');
    setProjDemoUrl('');
    setProjImageUrl('');
    setProjDescription('');
    setProjBullet1('');
    setProjBullet2('');
    setProjBullet3('');
    setProjSkills('');
    setProjSortOrder(0);
    setUploadFile(null);
    setConfirmCinematic(false);
  };

  const handleEditProjSelect = (proj) => {
    setProjId(proj.id);
    setProjTitle(proj.title);
    setProjTagline(proj.tagline || '');
    setProjYear(proj.year || '2026');
    setProjColor(proj.color || '#00f0ff');
    setProjDemoUrl(proj.demo_url || '');
    setProjImageUrl(proj.image_url || '');
    setProjDescription(proj.description || '');
    setProjBullet1(proj.bullet1 || '');
    setProjBullet2(proj.bullet2 || '');
    setProjBullet3(proj.bullet3 || '');
    setProjSkills(proj.skills || '');
    setProjSortOrder(proj.sort_order || 0);
    setConfirmCinematic(false);
    
    // Smooth scroll to form
    document.getElementById('proj-form-anchor')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleImageFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setUploadFile(e.target.files[0]);
    }
  };

  const uploadArtworkToStorage = async (file) => {
    setUploadingImage(true);
    try {
      // 1. Generate unique file path in bucket
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
      const filePath = `artwork/${fileName}`;

      // 2. Upload file to 'portfolio_assets' public bucket
      const { data, error: uploadErr } = await supabase.storage
        .from('portfolio_assets')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadErr) throw uploadErr;

      // 3. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('portfolio_assets')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (err) {
      console.error('Storage bucket upload failure:', err);
      throw new Error(`Artwork upload failed: ${err.message}`);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleProjSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      let finalImageUrl = projImageUrl;

      // Check if image upload is needed
      if (uploadFile) {
        if (!confirmCinematic) {
          throw new Error('Artwork policy verification required: Check the enforcer box.');
        }
        finalImageUrl = await uploadArtworkToStorage(uploadFile);
      }

      if (!finalImageUrl) {
        throw new Error('Card artwork missing. Please upload a cinematic image file or provide a URL.');
      }

      const payload = {
        title: projTitle,
        tagline: projTagline,
        year: projYear,
        color: projColor,
        demo_url: projDemoUrl,
        image_url: finalImageUrl,
        description: projDescription,
        bullet1: projBullet1,
        bullet2: projBullet2,
        bullet3: projBullet3,
        skills: projSkills,
        sort_order: parseInt(projSortOrder, 10)
      };

      if (projId) {
        // Update Action
        const { error: updateErr } = await supabase
          .from('projects')
          .update(payload)
          .eq('id', projId);

        if (updateErr) throw updateErr;
        setSuccess(`Project card '${projTitle}' synchronized successfully.`);
      } else {
        // Insert Action
        const { error: insertErr } = await supabase
          .from('projects')
          .insert([payload]);

        if (insertErr) throw insertErr;
        setSuccess(`Project card '${projTitle}' registered in vault core.`);
      }

      resetProjForm();
      await fetchData();
    } catch (err) {
      console.error('Project submit failed:', err);
      setError(err.message || 'Database write rejected.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProj = async (id, title) => {
    if (!window.confirm(`Calibrate system: Permanently delete project card '${title}'?`)) return;
    setLoading(true);
    try {
      const { error: delErr } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (delErr) throw delErr;
      setSuccess(`Project card '${title}' removed. WebGL gallery grid updated.`);
      await fetchData();
    } catch (err) {
      console.error('Delete project failed:', err);
      setError(err.message || 'Database delete request rejected.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      style={{
        width: '100vw',
        height: '100vh',
        background: '#030305',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'var(--font-body)',
        color: '#ffffff'
      }}
    >
      {/* Background Subtle Grid Pattern */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(rgba(0, 240, 255, 0.15) 1px, transparent 0)',
          backgroundSize: '24px 24px',
          opacity: 0.25,
          pointerEvents: 'none',
          zIndex: 1
        }}
      />

      {/* ================= HEADER BAR ================= */}
      <header 
        style={{
          padding: '20px 40px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          background: 'rgba(5, 5, 10, 0.65)',
          backdropFilter: 'blur(20px)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 10
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Settings className="text-cyan pulse-text" size={20} />
          <div>
            <h1 style={{ fontSize: '1rem', fontWeight: 800, letterSpacing: '0.12em', fontFamily: 'var(--font-heading)', textTransform: 'uppercase' }}>
              System Command Center
            </h1>
            <p style={{ fontSize: '0.62rem', color: 'var(--accent-cyan)', letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 600 }}>
              ADMIN TERMINAL OVERRIDE ACTIVE // SUPABASE DATA INTEGRATION
            </p>
          </div>
        </div>

        <button
          onClick={handleSignOut}
          className="btn-capsule btn-cyan glow-hover-cyan"
          style={{
            padding: '8px 16px',
            fontSize: '0.72rem',
            letterSpacing: '0.05em',
            textTransform: 'uppercase'
          }}
        >
          <LogOut size={12} />
          <span>Exit System</span>
        </button>
      </header>

      {/* ================= MAIN CONTAINER ================= */}
      <div 
        style={{
          flex: 1,
          display: 'flex',
          overflow: 'hidden',
          zIndex: 10
        }}
      >
        {/* SIDEBAR TABS */}
        <nav 
          style={{
            width: '280px',
            borderRight: '1px solid rgba(255, 255, 255, 0.05)',
            background: 'rgba(5, 5, 10, 0.35)',
            padding: '30px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}
        >
          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.08em', paddingLeft: '12px', textTransform: 'uppercase', marginBottom: '8px' }}>
            Interactive Zones
          </div>

          <button
            onClick={() => { setActiveTab('experiences'); setError(''); setSuccess(''); }}
            className={`nav-item ${activeTab === 'experiences' ? 'active-gold' : ''}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              border: 'none',
              background: 'none',
              width: '100%',
              textAlign: 'left',
              padding: '12px 16px',
              borderRadius: '8px',
              color: activeTab === 'experiences' ? 'var(--accent-gold)' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.8rem',
              cursor: 'pointer'
            }}
          >
            <Briefcase size={15} />
            <span>[02 EXPERIENCE RING]</span>
          </button>

          <button
            onClick={() => { setActiveTab('projects'); setError(''); setSuccess(''); }}
            className={`nav-item ${activeTab === 'projects' ? 'active-cyan' : ''}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              border: 'none',
              background: 'none',
              width: '100%',
              textAlign: 'left',
              padding: '12px 16px',
              borderRadius: '8px',
              color: activeTab === 'projects' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.8rem',
              cursor: 'pointer'
            }}
          >
            <Database size={15} />
            <span>[03 PROJECT VAULT]</span>
          </button>

          <div style={{ marginTop: 'auto', border: '1px dashed rgba(0, 240, 255, 0.15)', background: 'rgba(0, 240, 255, 0.02)', padding: '16px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ffffff' }}>
              <ShieldAlert size={14} className="text-cyan" />
              <strong style={{ fontSize: '0.72rem', letterSpacing: '0.02em', textTransform: 'uppercase' }}>Database Core</strong>
            </div>
            <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              Updates are sent directly to your live database. Space calculations update instantly on the public website.
            </p>
          </div>
        </nav>

        {/* WORKSPACE CONTENT (SCROLLABLE) */}
        <main 
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '40px'
          }}
        >
          {/* Notifications */}
          {error && (
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '16px', borderRadius: '12px', color: '#f87171', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <AlertTriangle size={18} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '16px', borderRadius: '12px', color: '#34d399', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <Check size={18} style={{ flexShrink: 0 }} />
              <span>{success}</span>
            </div>
          )}

          {/* TAB 1: EXPERIENCES MANAGER */}
          {activeTab === 'experiences' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
              
              {/* Timeline Items List */}
              <div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 800, fontFamily: 'var(--font-heading)', textTransform: 'uppercase', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Briefcase className="text-gold" size={18} />
                  <span>Timeline Nodes ({experiences.length})</span>
                </h2>

                {loading ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <RefreshCw className="pulse-text" size={14} style={{ animation: 'spin 1.5s linear infinite' }} />
                    <span>Synchronizing data...</span>
                  </div>
                ) : experiences.length === 0 ? (
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No experience nodes mapped. Use the console below to initialize.</p>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
                    {experiences.map((exp) => (
                      <div 
                        key={exp.id} 
                        className="glass-panel" 
                        style={{ 
                          padding: '20px', 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          borderColor: exp.color === '#ffd700' ? 'rgba(255,215,0,0.15)' : 'rgba(0,240,255,0.15)'
                        }}
                      >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <strong style={{ fontSize: '0.9rem', color: '#ffffff' }}>{exp.company}</strong>
                            <span 
                              style={{ 
                                fontSize: '0.62rem', 
                                border: `1px solid ${exp.color}`, 
                                color: exp.color,
                                padding: '2px 8px',
                                borderRadius: '4px',
                                textTransform: 'uppercase',
                                fontWeight: 700
                              }}
                            >
                              {exp.model_type}
                            </span>
                          </div>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{exp.role}</span>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{exp.duration}</span>
                        </div>

                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => handleEditExpSelect(exp)}
                            className="btn-capsule btn-cyan"
                            style={{ padding: '6px 12px', fontSize: '0.7rem', cursor: 'pointer' }}
                          >
                            <Edit3 size={12} />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteExp(exp.id, exp.company)}
                            className="btn-capsule btn-gold"
                            style={{ padding: '6px 12px', fontSize: '0.7rem', cursor: 'pointer', borderColor: 'rgba(255, 68, 68, 0.4)', color: '#f87171' }}
                          >
                            <Trash2 size={12} />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Form Divider */}
              <div id="exp-form-anchor" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)' }} />

              {/* Form Console */}
              <div className="glass-panel" style={{ padding: '30px', background: 'rgba(10, 10, 15, 0.4)', borderColor: expColor === '#ffd700' ? 'rgba(255,215,0,0.25)' : 'rgba(0,240,255,0.25)' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, fontFamily: 'var(--font-heading)', textTransform: 'uppercase', marginBottom: '24px', color: '#ffffff' }}>
                  {expId ? 'Edit Experience Override' : 'Deploy New Experience Node'}
                </h3>

                <form onSubmit={handleExpSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  
                  {/* Company */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>Company Name</label>
                    <input
                      type="text"
                      required
                      value={expCompany}
                      onChange={(e) => setExpCompany(e.target.value)}
                      placeholder="e.g. VRNN Technologies"
                      style={{ padding: '12px', background: 'rgba(5, 5, 10, 0.6)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#fff', fontSize: '0.8rem', outline: 'none' }}
                    />
                  </div>

                  {/* Role */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>Role Title</label>
                    <input
                      type="text"
                      required
                      value={expRole}
                      onChange={(e) => setExpRole(e.target.value)}
                      placeholder="e.g. Creative Media Executive"
                      style={{ padding: '12px', background: 'rgba(5, 5, 10, 0.6)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#fff', fontSize: '0.8rem', outline: 'none' }}
                    />
                  </div>

                  {/* Duration */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>Duration Period</label>
                    <input
                      type="text"
                      required
                      value={expDuration}
                      onChange={(e) => setExpDuration(e.target.value)}
                      placeholder="e.g. Oct 2025 - Mar 2026"
                      style={{ padding: '12px', background: 'rgba(5, 5, 10, 0.6)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#fff', fontSize: '0.8rem', outline: 'none' }}
                    />
                  </div>

                  {/* Model Type */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>3D Model Representation</label>
                    <select
                      value={expModelType}
                      onChange={(e) => setExpModelType(e.target.value)}
                      style={{ padding: '12px', background: 'rgba(5, 5, 10, 0.6)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#fff', fontSize: '0.8rem', outline: 'none' }}
                    >
                      <option value="lens" style={{ background: '#030305' }}>Camera Lens (Cyan Node)</option>
                      <option value="prism" style={{ background: '#030305' }}>Triangular Data Prism (Gold Node)</option>
                    </select>
                  </div>

                  {/* Accent Color */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>Accent Color Theme</label>
                    <select
                      value={expColor}
                      onChange={(e) => setExpColor(e.target.value)}
                      style={{ padding: '12px', background: 'rgba(5, 5, 10, 0.6)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#fff', fontSize: '0.8rem', outline: 'none' }}
                    >
                      <option value="#00f0ff" style={{ background: '#030305', color: '#00f0ff' }}>Electric Cyan (#00f0ff)</option>
                      <option value="#ffd700" style={{ background: '#030305', color: '#ffd700' }}>Liquid Gold (#ffd700)</option>
                    </select>
                  </div>

                  {/* Spacing coordinates */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>Ring Radius</label>
                      <input
                        type="number"
                        step="0.1"
                        required
                        value={expRadius}
                        onChange={(e) => setExpRadius(e.target.value)}
                        style={{ padding: '12px', background: 'rgba(5, 5, 10, 0.6)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#fff', fontSize: '0.8rem', outline: 'none' }}
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>Orbit Speed</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={expSpeed}
                        onChange={(e) => setExpSpeed(e.target.value)}
                        style={{ padding: '12px', background: 'rgba(5, 5, 10, 0.6)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#fff', fontSize: '0.8rem', outline: 'none' }}
                      />
                    </div>
                  </div>

                  {/* Highlights */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', gridColumn: 'span 2' }}>
                    <label style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>
                      Key Highlights (One point per line)
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={expHighlightsText}
                      onChange={(e) => setExpHighlightsText(e.target.value)}
                      placeholder="• Built sales tracking dashboards using Power BI&#10;• Scripted custom tools in Python for business automation"
                      style={{ padding: '12px', background: 'rgba(5, 5, 10, 0.6)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#fff', fontSize: '0.8rem', outline: 'none', resize: 'vertical' }}
                    />
                  </div>

                  {/* Buttons */}
                  <div style={{ display: 'flex', gap: '12px', gridColumn: 'span 2', marginTop: '10px' }}>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn-capsule btn-cyan"
                      style={{ flex: 1, justifyContent: 'center', opacity: submitting ? 0.7 : 1, cursor: 'pointer' }}
                    >
                      {submitting ? (
                        <>
                          <RefreshCw className="pulse-text" size={14} style={{ animation: 'spin 1.5s linear infinite' }} />
                          <span>Syncing Data Core...</span>
                        </>
                      ) : (
                        <span>{expId ? 'Save Node Configuration' : 'Inject Experience Node'}</span>
                      )}
                    </button>
                    
                    {expId && (
                      <button
                        type="button"
                        onClick={resetExpForm}
                        className="btn-capsule"
                        style={{ background: 'rgba(255,255,255,0.05)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}
                      >
                        Cancel
                      </button>
                    )}
                  </div>

                </form>
              </div>

            </div>
          )}

          {/* TAB 2: PROJECTS MANAGER */}
          {activeTab === 'projects' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
              
              {/* Projects List */}
              <div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 800, fontFamily: 'var(--font-heading)', textTransform: 'uppercase', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Database className="text-cyan" size={18} />
                  <span>Project Cards ({projects.length})</span>
                </h2>

                {loading ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <RefreshCw className="pulse-text" size={14} style={{ animation: 'spin 1.5s linear infinite' }} />
                    <span>Synchronizing vault...</span>
                  </div>
                ) : projects.length === 0 ? (
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No project cards mapped. Use the console below to upload artwork and inject.</p>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    {projects.map((proj) => (
                      <div 
                        key={proj.id} 
                        className="glass-panel" 
                        style={{ 
                          padding: '24px', 
                          display: 'flex', 
                          flexDirection: 'column', 
                          gap: '16px',
                          borderColor: proj.color === '#ffd700' ? 'rgba(255,215,0,0.15)' : 'rgba(0,240,255,0.15)'
                        }}
                      >
                        <div style={{ display: 'flex', gap: '16px' }}>
                          {/* Image preview */}
                          <div 
                            style={{ 
                              width: '80px', 
                              height: '110px', 
                              background: '#0d1520', 
                              border: `1px solid ${proj.color}50`, 
                              borderRadius: '8px', 
                              overflow: 'hidden',
                              flexShrink: 0
                            }}
                          >
                            <img 
                              src={proj.image_url} 
                              alt={proj.title} 
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                            />
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff' }}>{proj.title}</h3>
                              <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', border: '1px solid rgba(255,255,255,0.15)', padding: '1px 6px', borderRadius: '4px' }}>
                                ORDER: {proj.sort_order}
                              </span>
                            </div>
                            <span style={{ fontSize: '0.72rem', color: proj.color, fontWeight: 600 }}>{proj.tagline}</span>
                            <p style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginTop: '4px', display: '-webkit-box', WebboxOrient: 'vertical', WebkitLineClamp: 3, overflow: 'hidden' }}>
                              {proj.description}
                            </p>
                          </div>
                        </div>

                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTo: '12px', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                          <button
                            onClick={() => handleEditProjSelect(proj)}
                            className="btn-capsule btn-cyan"
                            style={{ padding: '6px 12px', fontSize: '0.7rem', cursor: 'pointer' }}
                          >
                            <Edit3 size={12} />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteProj(proj.id, proj.title)}
                            className="btn-capsule btn-gold"
                            style={{ padding: '6px 12px', fontSize: '0.7rem', cursor: 'pointer', borderColor: 'rgba(255, 68, 68, 0.4)', color: '#f87171' }}
                          >
                            <Trash2 size={12} />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Form Divider */}
              <div id="proj-form-anchor" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)' }} />

              {/* Form Console */}
              <div className="glass-panel" style={{ padding: '30px', background: 'rgba(10, 10, 15, 0.4)', borderColor: projColor === '#ffd700' ? 'rgba(255,215,0,0.25)' : 'rgba(0,240,255,0.25)' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, fontFamily: 'var(--font-heading)', textTransform: 'uppercase', marginBottom: '24px', color: '#ffffff' }}>
                  {projId ? 'Edit Project Vault Override' : 'Deploy New Project Trading Card'}
                </h3>

                <form onSubmit={handleProjSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  
                  {/* Title */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>Project Title</label>
                    <input
                      type="text"
                      required
                      value={projTitle}
                      onChange={(e) => setProjTitle(e.target.value)}
                      placeholder="e.g. GrowIQ"
                      style={{ padding: '12px', background: 'rgba(5, 5, 10, 0.6)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#fff', fontSize: '0.8rem', outline: 'none' }}
                    />
                  </div>

                  {/* Tagline */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>Tagline</label>
                    <input
                      type="text"
                      required
                      value={projTagline}
                      onChange={(e) => setProjTagline(e.target.value)}
                      placeholder="e.g. AI-Powered Growth Engine"
                      style={{ padding: '12px', background: 'rgba(5, 5, 10, 0.6)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#fff', fontSize: '0.8rem', outline: 'none' }}
                    />
                  </div>

                  {/* Year */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>Production Year</label>
                    <input
                      type="text"
                      required
                      value={projYear}
                      onChange={(e) => setProjYear(e.target.value)}
                      placeholder="e.g. 2026"
                      style={{ padding: '12px', background: 'rgba(5, 5, 10, 0.6)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#fff', fontSize: '0.8rem', outline: 'none' }}
                    />
                  </div>

                  {/* Color theme */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>Accent Color Theme</label>
                    <select
                      value={projColor}
                      onChange={(e) => setProjColor(e.target.value)}
                      style={{ padding: '12px', background: 'rgba(5, 5, 10, 0.6)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#fff', fontSize: '0.8rem', outline: 'none' }}
                    >
                      <option value="#00f0ff" style={{ background: '#030305', color: '#00f0ff' }}>Electric Cyan (#00f0ff)</option>
                      <option value="#ffd700" style={{ background: '#030305', color: '#ffd700' }}>Liquid Gold (#ffd700)</option>
                    </select>
                  </div>

                  {/* Demo URL */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>Live Demo Link (Visit URL)</label>
                    <input
                      type="url"
                      required
                      value={projDemoUrl}
                      onChange={(e) => setProjDemoUrl(e.target.value)}
                      placeholder="https://growiq-ai.netlify.app"
                      style={{ padding: '12px', background: 'rgba(5, 5, 10, 0.6)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#fff', fontSize: '0.8rem', outline: 'none' }}
                    />
                  </div>

                  {/* Sort order */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>Sort Order</label>
                    <input
                      type="number"
                      required
                      value={projSortOrder}
                      onChange={(e) => setProjSortOrder(e.target.value)}
                      placeholder="0"
                      style={{ padding: '12px', background: 'rgba(5, 5, 10, 0.6)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#fff', fontSize: '0.8rem', outline: 'none' }}
                    />
                  </div>

                  {/* Image input/upload */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', gridColumn: 'span 2' }}>
                    <label style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>Card Artwork</label>
                    
                    {projImageUrl && !uploadFile && (
                      <div style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', background: 'rgba(0,240,255,0.05)', padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(0,240,255,0.15)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span>Current artwork URL: <strong>{projImageUrl.substring(0, 70)}...</strong></span>
                        <img src={projImageUrl} alt="preview" style={{ width: '30px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                      </div>
                    )}

                    <div 
                      style={{ 
                        border: '1px dashed rgba(255, 255, 255, 0.15)', 
                        background: 'rgba(5, 5, 10, 0.4)', 
                        padding: '20px', 
                        borderRadius: '8px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        position: 'relative'
                      }}
                    >
                      <Upload size={20} className="text-cyan" />
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                        {uploadFile ? `Selected: ${uploadFile.name}` : 'Select card artwork file (PNG, JPG)'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileChange}
                        style={{
                          position: 'absolute',
                          inset: 0,
                          opacity: 0,
                          cursor: 'pointer'
                        }}
                      />
                    </div>

                    {/* Cinematic Enforcer Checkbox */}
                    {uploadFile && (
                      <div 
                        style={{ 
                          marginTop: '8px',
                          background: 'rgba(0, 240, 255, 0.03)',
                          border: '1px solid rgba(0, 240, 255, 0.15)',
                          padding: '12px 16px',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '10px'
                        }}
                      >
                        <input
                          type="checkbox"
                          id="cinematic-enforce"
                          checked={confirmCinematic}
                          onChange={(e) => setConfirmCinematic(e.target.checked)}
                          style={{ marginTop: '3px', cursor: 'pointer' }}
                        />
                        <label htmlFor="cinematic-enforce" style={{ fontSize: '0.7rem', color: '#ffffff', lineHeight: 1.4, cursor: 'pointer' }}>
                          <strong>Cinematic Quality Policy Enforced</strong>: I confirm this artwork file is clean, text-free, and logo-free illustration to preserve WebGL focus in the 3D zero-gravity space.
                        </label>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', gridColumn: 'span 2' }}>
                    <label style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>Description</label>
                    <textarea
                      required
                      rows={3}
                      value={projDescription}
                      onChange={(e) => setProjDescription(e.target.value)}
                      placeholder="e.g. Full-stack web application featuring smart inventory and ledger books..."
                      style={{ padding: '12px', background: 'rgba(5, 5, 10, 0.6)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#fff', fontSize: '0.8rem', outline: 'none', resize: 'vertical' }}
                    />
                  </div>

                  {/* Bullet points */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', gridColumn: 'span 2' }}>
                    <label style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>Technical bullet points (For card back layout)</label>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <input
                        type="text"
                        required
                        value={projBullet1}
                        onChange={(e) => setProjBullet1(e.target.value)}
                        placeholder="• e.g. Smart real-time inventory & stock alerts"
                        style={{ padding: '10px', background: 'rgba(5, 5, 10, 0.6)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#fff', fontSize: '0.78rem', outline: 'none' }}
                      />
                      <input
                        type="text"
                        required
                        value={projBullet2}
                        onChange={(e) => setProjBullet2(e.target.value)}
                        placeholder="• e.g. AI-powered local business advisor insights"
                        style={{ padding: '10px', background: 'rgba(5, 5, 10, 0.6)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#fff', fontSize: '0.78rem', outline: 'none' }}
                      />
                      <input
                        type="text"
                        required
                        value={projBullet3}
                        onChange={(e) => setProjBullet3(e.target.value)}
                        placeholder="• e.g. Credit / Udhaar digital ledger book"
                        style={{ padding: '10px', background: 'rgba(5, 5, 10, 0.6)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#fff', fontSize: '0.78rem', outline: 'none' }}
                      />
                    </div>
                  </div>

                  {/* Tech stack / Skills footer */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', gridColumn: 'span 2' }}>
                    <label style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>Tech Stack / Skills Footer</label>
                    <input
                      type="text"
                      required
                      value={projSkills}
                      onChange={(e) => setProjSkills(e.target.value)}
                      placeholder="e.g. Inventory Tracking, AI Advisor, Ledger ERP"
                      style={{ padding: '12px', background: 'rgba(5, 5, 10, 0.6)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#fff', fontSize: '0.8rem', outline: 'none' }}
                    />
                  </div>

                  {/* Form actions */}
                  <div style={{ display: 'flex', gap: '12px', gridColumn: 'span 2', marginTop: '10px' }}>
                    <button
                      type="submit"
                      disabled={submitting || uploadingImage}
                      className="btn-capsule btn-cyan"
                      style={{ flex: 1, justifyContent: 'center', opacity: (submitting || uploadingImage) ? 0.7 : 1, cursor: 'pointer' }}
                    >
                      {submitting || uploadingImage ? (
                        <>
                          <RefreshCw className="pulse-text" size={14} style={{ animation: 'spin 1.5s linear infinite' }} />
                          <span>{uploadingImage ? 'Uploading card artwork...' : 'Syncing Vault Core...'}</span>
                        </>
                      ) : (
                        <span>{projId ? 'Save Project Card Configuration' : 'Inject Project Trading Card'}</span>
                      )}
                    </button>
                    
                    {projId && (
                      <button
                        type="button"
                        onClick={resetProjForm}
                        className="btn-capsule"
                        style={{ background: 'rgba(255,255,255,0.05)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}
                      >
                        Cancel
                      </button>
                    )}
                  </div>

                </form>
              </div>

            </div>
          )}
        </main>
      </div>
    </div>
  );
}
