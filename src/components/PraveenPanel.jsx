import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaSignOutAlt, FaFolderOpen, FaCertificate, FaArrowLeft, FaEye } from 'react-icons/fa';

const PraveenPanel = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('praveen_admin_token'));
  const [token, setToken] = useState(() => localStorage.getItem('praveen_admin_token') || '');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  // App State
  const [activeTab, setActiveTab] = useState('projects'); // 'projects' | 'certificates'
  const [projects, setProjects] = useState([]);
  const [certificates, setCertificates] = useState([]);
  
  // Loading & Action states
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ text: '', type: '' });
  
  // Form states - Projects
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    tech: '',
    videoPlaceholder: '',
    link: '',
    color: 'from-blue-600 to-indigo-600'
  });

  // Form states - Certificates
  const [editingCertId, setEditingCertId] = useState(null);
  const [certForm, setCertForm] = useState({
    title: '',
    pdfUrl: ''
  });

  const showStatus = (text, type = 'success') => {
    setStatusMessage({ text, type });
    setTimeout(() => setStatusMessage({ text: '', type: '' }), 5000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        localStorage.setItem('praveen_admin_token', data.token);
        setToken(data.token);
        setIsLoggedIn(true);
        setUsername('');
        setPassword('');
      } else {
        setLoginError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      console.error(err);
      setLoginError('Server error, failed to login');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('praveen_admin_token');
    setToken('');
    setIsLoggedIn(false);
  };

  // --- PROJECTS CRUD ---
  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/projects');
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    if (!projectForm.title) return;
    
    setIsLoading(true);
    const method = editingProjectId ? 'PUT' : 'POST';
    const body = editingProjectId 
      ? { id: editingProjectId, ...projectForm }
      : projectForm;

    try {
      const response = await fetch('/api/projects', {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });
      const data = await response.json();
      if (response.ok && data.success) {
        showStatus(editingProjectId ? 'Project updated successfully' : 'Project added successfully');
        setProjectForm({
          title: '',
          description: '',
          tech: '',
          videoPlaceholder: '',
          link: '',
          color: 'from-blue-600 to-indigo-600'
        });
        setEditingProjectId(null);
        fetchProjects();
      } else {
        showStatus(data.error ? `${data.message}: ${data.error}` : (data.message || 'Action failed'), 'error');
      }
    } catch (err) {
      console.error(err);
      showStatus('Network error', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const startEditProject = (p) => {
    setEditingProjectId(p._id);
    setProjectForm({
      title: p.title,
      description: p.description || '',
      tech: Array.isArray(p.tech) ? p.tech.join(', ') : p.tech || '',
      videoPlaceholder: p.videoPlaceholder || '',
      link: p.link || '',
      color: p.color || 'from-blue-600 to-indigo-600'
    });
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    setIsLoading(true);
    try {
      const response = await fetch(`/api/projects?id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok && data.success) {
        showStatus('Project deleted successfully');
        fetchProjects();
      } else {
        showStatus(data.error ? `${data.message}: ${data.error}` : (data.message || 'Delete failed'), 'error');
      }
    } catch (err) {
      console.error(err);
      showStatus('Network error', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // --- CERTIFICATES CRUD ---
  const fetchCertificates = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/certificates');
      if (response.ok) {
        const data = await response.json();
        setCertificates(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCertSubmit = async (e) => {
    e.preventDefault();
    if (!certForm.title) return;

    setIsLoading(true);
    const method = editingCertId ? 'PUT' : 'POST';
    const body = editingCertId 
      ? { id: editingCertId, ...certForm }
      : certForm;

    try {
      const response = await fetch('/api/certificates', {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });
      const data = await response.json();
      if (response.ok && data.success) {
        showStatus(editingCertId ? 'Certificate updated successfully' : 'Certificate added successfully');
        setCertForm({ title: '', pdfUrl: '' });
        setEditingCertId(null);
        fetchCertificates();
      } else {
        showStatus(data.error ? `${data.message}: ${data.error}` : (data.message || 'Action failed'), 'error');
      }
    } catch (err) {
      console.error(err);
      showStatus('Network error', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file only.');
      return;
    }
    if (file.size > 15 * 1024 * 1024) { // 15MB limit
      alert('File size exceeds 15MB limit.');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = () => {
      setCertForm(prev => ({
        ...prev,
        pdfUrl: reader.result // Base64 Data URL
      }));
      showStatus('Local PDF file loaded successfully. Ready to save.');
    };
    reader.onerror = (err) => {
      console.error(err);
      showStatus('Failed to read file', 'error');
    };
    reader.readAsDataURL(file);
  };

  const startEditCert = (c) => {
    setEditingCertId(c._id);
    setCertForm({
      title: c.title,
      pdfUrl: c.pdfUrl || ''
    });
  };

  const handleDeleteCert = async (id) => {
    if (!window.confirm('Are you sure you want to delete this certificate?')) return;
    setIsLoading(true);
    try {
      const response = await fetch(`/api/certificates?id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok && data.success) {
        showStatus('Certificate deleted successfully');
        fetchCertificates();
      } else {
        showStatus(data.error ? `${data.message}: ${data.error}` : (data.message || 'Delete failed'), 'error');
      }
    } catch (err) {
      console.error(err);
      showStatus('Network error', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch Data when logged in
  useEffect(() => {
    if (isLoggedIn) {
      const timer = setTimeout(() => {
        fetchProjects();
        fetchCertificates();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <div className="bg-[#050505] text-white min-h-screen flex items-center justify-center p-6 relative overflow-hidden font-sans">
        {/* Decorative background glows */}
        <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-brand-red/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-brand-red/10 rounded-full blur-[120px] pointer-events-none"></div>

        <motion.div 
          className="glassmorphism w-full max-w-md p-8 rounded-3xl border border-white/10 shadow-2xl relative"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-display font-black text-white">
              ADMIN <span className="text-brand-red">PANEL</span>
            </h2>
            <a href="/" className="flex items-center gap-2 text-xs uppercase tracking-widest text-gray-400 hover:text-white transition-colors">
              <FaArrowLeft /> Portfolio
            </a>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="flex flex-col space-y-2">
              <label className="text-xs uppercase tracking-widest text-gray-400 font-bold ml-1">Username</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Durga Praveen" 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-brand-red focus:bg-white/10 transition-all"
                required
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="text-xs uppercase tracking-widest text-gray-400 font-bold ml-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-brand-red focus:bg-white/10 transition-all"
                required
              />
            </div>

            {loginError && (
              <p className="text-brand-red text-sm font-semibold text-center">{loginError}</p>
            )}

            <button 
              type="submit" 
              className="w-full bg-brand-red text-white font-bold uppercase tracking-widest py-5 rounded-xl hover:bg-white hover:text-brand-red transition-all duration-300 shadow-[0_0_20px_rgba(255,42,42,0.2)]"
            >
              Sign In
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-[#050505] text-white min-h-screen p-6 md:p-12 font-sans relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-red/5 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12 border-b border-white/10 pb-8">
          <div>
            <h1 className="text-4xl font-display font-black text-white">
              PRAVEEN'S <span className="text-brand-red">DASHBOARD</span>
            </h1>
            <p className="text-gray-400 text-sm mt-1">Manage your dynamic portfolio items here.</p>
          </div>
          
          <div className="flex gap-4">
            <a href="/" className="flex items-center gap-2 px-5 py-3 rounded-full border border-white/10 hover:border-white transition-all text-xs uppercase tracking-wider font-bold glassmorphism">
              <FaArrowLeft /> View Portfolio
            </a>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-5 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-brand-red hover:border-brand-red transition-all text-xs uppercase tracking-wider font-bold cursor-pointer"
            >
              <FaSignOutAlt /> Log Out
            </button>
          </div>
        </header>

        {/* Status Message */}
        {statusMessage.text && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-xl mb-6 text-center font-bold text-sm ${statusMessage.type === 'error' ? 'bg-red-900/30 text-red-500 border border-red-500/20' : 'bg-green-900/30 text-green-500 border border-green-500/20'}`}
          >
            {statusMessage.text}
          </motion.div>
        )}

        {/* Tab Controls */}
        <div className="flex border-b border-white/10 mb-8">
          <button 
            onClick={() => setActiveTab('projects')}
            className={`flex items-center gap-2 px-6 py-4 font-bold uppercase tracking-wider border-b-2 text-sm transition-all cursor-pointer ${activeTab === 'projects' ? 'border-brand-red text-white' : 'border-transparent text-gray-400 hover:text-white'}`}
          >
            <FaFolderOpen /> Projects
          </button>
          <button 
            onClick={() => setActiveTab('certificates')}
            className={`flex items-center gap-2 px-6 py-4 font-bold uppercase tracking-wider border-b-2 text-sm transition-all cursor-pointer ${activeTab === 'certificates' ? 'border-brand-red text-white' : 'border-transparent text-gray-400 hover:text-white'}`}
          >
            <FaCertificate /> Certifications
          </button>
        </div>

        {/* --- PROJECTS TAB --- */}
        {activeTab === 'projects' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left side: Project Form */}
            <div className="lg:col-span-1">
              <div className="glassmorphism p-6 md:p-8 rounded-2xl border border-white/10 sticky top-6">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  {editingProjectId ? <FaEdit className="text-brand-red" /> : <FaPlus className="text-brand-red" />}
                  {editingProjectId ? 'Edit Project' : 'Add New Project'}
                </h3>
                
                <form onSubmit={handleProjectSubmit} className="space-y-4">
                  <div className="flex flex-col space-y-1">
                    <label className="text-xs text-gray-400 font-bold uppercase">Heading / Title *</label>
                    <input 
                      type="text" 
                      value={projectForm.title}
                      onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                      placeholder="e.g. Robo Face Emotion Detection" 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-brand-red text-sm"
                      required
                    />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="text-xs text-gray-400 font-bold uppercase">Description</label>
                    <textarea 
                      rows="3"
                      value={projectForm.description}
                      onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                      placeholder="Enter a brief project description..." 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-brand-red text-sm resize-none"
                    />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="text-xs text-gray-400 font-bold uppercase">Technologies (comma-separated)</label>
                    <input 
                      type="text" 
                      value={projectForm.tech}
                      onChange={(e) => setProjectForm({ ...projectForm, tech: e.target.value })}
                      placeholder="e.g. React, Node.js, MongoDB" 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-brand-red text-sm"
                    />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="text-xs text-gray-400 font-bold uppercase">Project URL (Link)</label>
                    <input 
                      type="text" 
                      value={projectForm.link}
                      onChange={(e) => setProjectForm({ ...projectForm, link: e.target.value })}
                      placeholder="e.g. https://github.com/..." 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-brand-red text-sm"
                    />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="text-xs text-gray-400 font-bold uppercase">Video URL (Background mp4)</label>
                    <input 
                      type="text" 
                      value={projectForm.videoPlaceholder}
                      onChange={(e) => setProjectForm({ ...projectForm, videoPlaceholder: e.target.value })}
                      placeholder="e.g. https://cdn.pixabay.com/video/..." 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-brand-red text-sm"
                    />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="text-xs text-gray-400 font-bold uppercase">Theme Gradient</label>
                    <select 
                      value={projectForm.color}
                      onChange={(e) => setProjectForm({ ...projectForm, color: e.target.value })}
                      className="w-full bg-[#0d0d0d] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-red text-sm"
                    >
                      <option value="from-blue-600 to-indigo-600">Blue-Indigo</option>
                      <option value="from-emerald-600 to-teal-600">Emerald-Teal</option>
                      <option value="from-orange-600 to-red-600">Orange-Red</option>
                      <option value="from-purple-600 to-pink-600">Purple-Pink</option>
                      <option value="from-red-600 to-rose-900">Crimson-Rose</option>
                    </select>
                  </div>
                  
                  <div className="flex gap-3 pt-2">
                    <button 
                      type="submit" 
                      disabled={isLoading}
                      className="flex-1 bg-brand-red text-white text-xs font-bold uppercase tracking-wider py-4 rounded-xl hover:bg-white hover:text-brand-red transition-all cursor-pointer"
                    >
                      {editingProjectId ? 'Save Changes' : 'Add Project'}
                    </button>
                    {editingProjectId && (
                      <button 
                        type="button" 
                        onClick={() => {
                          setEditingProjectId(null);
                          setProjectForm({ title: '', description: '', tech: '', videoPlaceholder: '', link: '', color: 'from-blue-600 to-indigo-600' });
                        }}
                        className="bg-white/10 text-white text-xs font-bold uppercase tracking-wider py-4 px-4 rounded-xl hover:bg-white/20 transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>

            {/* Right side: Projects List */}
            <div className="lg:col-span-2">
              <div className="glassmorphism p-6 md:p-8 rounded-2xl border border-white/10 h-full">
                <h3 className="text-xl font-bold mb-6">Current Projects ({projects.length})</h3>
                {isLoading && projects.length === 0 ? (
                  <p className="text-gray-400">Loading projects...</p>
                ) : projects.length === 0 ? (
                  <p className="text-gray-400">No projects found. Add one on the left!</p>
                ) : (
                  <div className="space-y-4">
                    {projects.map((p) => (
                      <div key={p._id || p.title} className="p-5 border border-white/10 rounded-xl bg-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-white/20 transition-all">
                        <div>
                          <h4 className="text-lg font-bold text-white flex items-center gap-2">
                            <span className={`w-3 h-3 rounded-full bg-gradient-to-r ${p.color}`}></span>
                            {p.title}
                          </h4>
                          <p className="text-xs text-gray-400 mt-1 max-w-lg line-clamp-2">{p.description || 'No description provided.'}</p>
                          <div className="flex gap-2 flex-wrap mt-2">
                            {(Array.isArray(p.tech) ? p.tech : []).map((t, i) => (
                              <span key={i} className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-gray-300">{t}</span>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          {p.link && p.link !== '#' && (
                            <a 
                              href={p.link} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all text-xs"
                              title="View Live"
                            >
                              <FaEye />
                            </a>
                          )}
                          <button 
                            onClick={() => startEditProject(p)}
                            className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 hover:text-green-500 flex items-center justify-center text-white transition-all text-xs cursor-pointer"
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button 
                            onClick={() => handleDeleteProject(p._id)}
                            className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 hover:text-brand-red flex items-center justify-center text-white transition-all text-xs cursor-pointer"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* --- CERTIFICATES TAB --- */}
        {activeTab === 'certificates' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left side: Certificate Form */}
            <div className="lg:col-span-1">
              <div className="glassmorphism p-6 md:p-8 rounded-2xl border border-white/10 sticky top-6">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  {editingCertId ? <FaEdit className="text-brand-red" /> : <FaPlus className="text-brand-red" />}
                  {editingCertId ? 'Edit Certificate' : 'Add Certificate'}
                </h3>
                
                <form onSubmit={handleCertSubmit} className="space-y-4">
                  <div className="flex flex-col space-y-1">
                    <label className="text-xs text-gray-400 font-bold uppercase">Certificate Title *</label>
                    <input 
                      type="text" 
                      value={certForm.title}
                      onChange={(e) => setCertForm({ ...certForm, title: e.target.value })}
                      placeholder="e.g. Frontend Web Development" 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-brand-red text-sm"
                      required
                    />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="text-xs text-gray-400 font-bold uppercase">Downloadable PDF URL or Google Drive Link</label>
                    <input 
                      type="text" 
                      value={certForm.pdfUrl.startsWith('data:') ? '' : certForm.pdfUrl}
                      onChange={(e) => setCertForm({ ...certForm, pdfUrl: e.target.value })}
                      placeholder="Paste PDF link / Google Drive link" 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-brand-red text-sm"
                    />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="text-xs text-gray-400 font-bold uppercase">Or Upload Local PDF</label>
                    <input 
                      type="file" 
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-red text-sm file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20"
                    />
                    {certForm.pdfUrl.startsWith('data:') && (
                      <p className="text-[10px] text-green-500 font-semibold mt-1">✓ Local PDF Loaded ({Math.round(certForm.pdfUrl.length / 1024)} KB)</p>
                    )}
                  </div>
                  
                  <div className="flex gap-3 pt-2">
                    <button 
                      type="submit" 
                      disabled={isLoading}
                      className="flex-1 bg-brand-red text-white text-xs font-bold uppercase tracking-wider py-4 rounded-xl hover:bg-white hover:text-brand-red transition-all cursor-pointer"
                    >
                      {editingCertId ? 'Save Changes' : 'Add Certificate'}
                    </button>
                    {editingCertId && (
                      <button 
                        type="button" 
                        onClick={() => {
                          setEditingCertId(null);
                          setCertForm({ title: '', pdfUrl: '' });
                        }}
                        className="bg-white/10 text-white text-xs font-bold uppercase tracking-wider py-4 px-4 rounded-xl hover:bg-white/20 transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>

            {/* Right side: Certificates List */}
            <div className="lg:col-span-2">
              <div className="glassmorphism p-6 md:p-8 rounded-2xl border border-white/10 h-full">
                <h3 className="text-xl font-bold mb-6">Current Certificates ({certificates.length})</h3>
                {isLoading && certificates.length === 0 ? (
                  <p className="text-gray-400">Loading certificates...</p>
                ) : certificates.length === 0 ? (
                  <p className="text-gray-400">No certificates found. Add one on the left!</p>
                ) : (
                  <div className="space-y-4">
                    {certificates.map((c) => (
                      <div key={c._id || c.title} className="p-5 border border-white/10 rounded-xl bg-white/5 flex justify-between items-center gap-4 hover:border-white/20 transition-all">
                        <div>
                          <h4 className="text-lg font-bold text-white">{c.title}</h4>
                          <p className="text-xs text-gray-400 mt-1 max-w-lg truncate">
                            {c.pdfUrl ? (c.pdfUrl.startsWith('data:') ? 'Uploaded PDF File (Base64)' : c.pdfUrl) : 'No PDF link attached.'}
                          </p>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          {c.pdfUrl && (
                            <button 
                              onClick={() => {
                                const pdfUrl = c.pdfUrl;
                                if (pdfUrl.startsWith('data:application/pdf')) {
                                  try {
                                    const base64Parts = pdfUrl.split(',');
                                    const base64Data = base64Parts[1];
                                    const decoded = atob(base64Data);
                                    const array = new Uint8Array(decoded.length);
                                    for (let i = 0; i < decoded.length; i++) {
                                      array[i] = decoded.charCodeAt(i);
                                    }
                                    const blob = new Blob([array], { type: 'application/pdf' });
                                    const blobUrl = URL.createObjectURL(blob);
                                    window.open(blobUrl, '_blank');
                                  } catch (err) {
                                    console.error('Failed to open PDF blob:', err);
                                    window.open(pdfUrl, '_blank');
                                  }
                                } else {
                                  window.open(pdfUrl, '_blank', 'noopener,noreferrer');
                                }
                              }}
                              className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all text-xs cursor-pointer"
                              title="View PDF"
                            >
                              <FaEye />
                            </button>
                          )}
                          <button 
                            onClick={() => startEditCert(c)}
                            className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 hover:text-green-500 flex items-center justify-center text-white transition-all text-xs cursor-pointer"
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button 
                            onClick={() => handleDeleteCert(c._id)}
                            className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 hover:text-brand-red flex items-center justify-center text-white transition-all text-xs cursor-pointer"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default PraveenPanel;
