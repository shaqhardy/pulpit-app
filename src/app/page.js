'use client';

import { useState, useEffect } from 'react';
import { Calendar, MessageSquare, User, FileText, Settings, Bell, Plus, Home, Briefcase, Edit, Trash2, Download, LogOut, FolderOpen, Users, File, UserPlus } from 'lucide-react';

// TWO different API bases in Xano
const AUTH_API = 'https://x8ki-letl-twmt.n7.xano.io/api:fwui2Env';
const DATA_API = 'https://x8ki-letl-twmt.n7.xano.io/api:EoXk01e5';

const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
};

const apiCall = async (baseUrl, endpoint, options = {}) => {
  const token = getToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || 'Request failed');
  }

  return response.json();
};

// Styles
const styles = {
  card: {
    background: 'rgba(247,243,233,0.03)',
    border: '1px solid rgba(247,243,233,0.08)',
    borderRadius: '16px',
    padding: '24px',
  },
  button: {
    background: '#535E4A',
    color: '#F7F3E9',
    border: 'none',
    padding: '14px 28px',
    borderRadius: '10px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: "'Bebas Neue', sans-serif",
    letterSpacing: '1px',
    transition: 'all 0.2s ease',
  },
  buttonSecondary: {
    background: 'rgba(247,243,233,0.08)',
    color: '#F7F3E9',
    border: '1px solid rgba(247,243,233,0.15)',
    padding: '12px 24px',
    borderRadius: '10px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    background: 'rgba(247,243,233,0.05)',
    border: '1px solid rgba(247,243,233,0.12)',
    borderRadius: '10px',
    color: '#F7F3E9',
    fontSize: '14px',
    outline: 'none',
    fontFamily: "'Inter', sans-serif",
  },
  label: {
    display: 'block',
    fontSize: '11px',
    color: 'rgba(247,243,233,0.5)',
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  badge: {
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
};

export default function PulpitApp() {
  const [currentView, setCurrentView] = useState('landing');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [authMode, setAuthMode] = useState('login');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  
  // Data
  const [bookingRequests, setBookingRequests] = useState([]);
  const [messages, setMessages] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [resources, setResources] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  
  // Form data - separate state for each field
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupUserType, setSignupUserType] = useState('speaker');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      loadUserData();
    }
  }, []);

  const loadUserData = async () => {
    try {
      const user = await apiCall(AUTH_API, '/auth/me');
      setCurrentUser(user);
      setIsAuthenticated(true);
      setCurrentView('app');
      loadAllData();
    } catch (error) {
      localStorage.removeItem('authToken');
    }
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [requestsData, messagesData, notificationsData, documentsData, resourcesData, teamData] = await Promise.all([
        apiCall(DATA_API, '/booking_request').catch(() => []),
        apiCall(DATA_API, '/message').catch(() => []),
        apiCall(DATA_API, '/notification').catch(() => []),
        apiCall(DATA_API, '/document').catch(() => []),
        apiCall(DATA_API, '/resource').catch(() => []),
        apiCall(DATA_API, '/team_member').catch(() => []),
      ]);
      
      setBookingRequests(Array.isArray(requestsData) ? requestsData : []);
      setMessages(Array.isArray(messagesData) ? messagesData : []);
      setNotifications(Array.isArray(notificationsData) ? notificationsData : []);
      setDocuments(Array.isArray(documentsData) ? documentsData : []);
      setResources(Array.isArray(resourcesData) ? resourcesData : []);
      setTeamMembers(Array.isArray(teamData) ? teamData : []);
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setLoading(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    
    try {
      const response = await apiCall(AUTH_API, '/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      localStorage.setItem('authToken', response.authToken);
      await loadUserData();
    } catch (error) {
      setAuthError(error.message || 'Login failed');
    }
    setAuthLoading(false);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    
    try {
      const response = await apiCall(AUTH_API, '/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ 
          name: signupName, 
          email: signupEmail, 
          password: signupPassword
        }),
      });
      localStorage.setItem('authToken', response.authToken);
      await loadUserData();
    } catch (error) {
      setAuthError(error.message || 'Signup failed');
    }
    setAuthLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    setCurrentUser(null);
    setCurrentView('landing');
  };

  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'requests', icon: Briefcase, label: 'Requests' },
    { id: 'calendar', icon: Calendar, label: 'Calendar' },
    { id: 'messages', icon: MessageSquare, label: 'Messages' },
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'resources', icon: FileText, label: 'Resources' },
    { id: 'documents', icon: FolderOpen, label: 'Documents' },
    { id: 'team', icon: Users, label: 'Team' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  const unreadNotifications = notifications.filter(n => !n.read).length;
  const unreadMessages = messages.filter(m => !m.read).length;
  const pendingRequests = bookingRequests.filter(r => r.status === 'pending').length;

  // LANDING PAGE
  if (currentView === 'landing') {
    return (
      <div style={{ minHeight: '100vh', background: '#0A0A0A' }}>
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 48px', borderBottom: '1px solid rgba(247,243,233,0.08)' }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '28px', letterSpacing: '2px', color: '#F7F3E9' }}>PULPIT</div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button onClick={() => { setCurrentView('auth'); setAuthMode('login'); }} style={styles.buttonSecondary}>Log In</button>
            <button onClick={() => { setCurrentView('auth'); setAuthMode('signup'); }} style={styles.button}>GET STARTED</button>
          </div>
        </nav>

        <section style={{ padding: '120px 48px', textAlign: 'center', maxWidth: '900px', margin: '0 auto' }}>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '72px', letterSpacing: '3px', lineHeight: '1.1', marginBottom: '24px', color: '#F7F3E9' }}>
            THE BOOKING PLATFORM FOR SPEAKERS & WORSHIP LEADERS
          </h1>
          <p style={{ fontSize: '18px', color: 'rgba(247,243,233,0.7)', marginBottom: '48px', lineHeight: '1.7' }}>
            Manage requests, contracts, itineraries, and communication—all in one place. 100% free.
          </p>
          <button onClick={() => { setCurrentView('auth'); setAuthMode('signup'); }} style={{ ...styles.button, padding: '18px 48px', fontSize: '15px' }}>
            CREATE YOUR FREE ACCOUNT
          </button>
        </section>

        <section style={{ padding: '80px 48px', background: 'rgba(247,243,233,0.02)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '36px', textAlign: 'center', marginBottom: '64px', letterSpacing: '2px', color: '#F7F3E9' }}>EVERYTHING YOU NEED</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
              {[
                { icon: Briefcase, title: 'Booking Requests', desc: 'Receive and manage speaking requests with all details in one place' },
                { icon: FileText, title: 'Contracts & Documents', desc: 'Send contracts, collect signatures, store W9s and safety docs' },
                { icon: Calendar, title: 'Itineraries', desc: 'Collaborate with hosts on travel details and event schedules' },
                { icon: MessageSquare, title: 'Messaging', desc: 'Communicate directly with event hosts without email chains' },
                { icon: Calendar, title: 'Calendar', desc: 'See all your events and manage availability in one view' },
                { icon: Bell, title: 'Notifications', desc: 'Never miss a request or message with real-time alerts' },
              ].map((feature, i) => (
                <div key={i} style={styles.card}>
                  <feature.icon size={32} color="#535E4A" style={{ marginBottom: '16px' }} />
                  <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '18px', marginBottom: '8px', letterSpacing: '1px', color: '#F7F3E9' }}>{feature.title}</h3>
                  <p style={{ fontSize: '14px', color: 'rgba(247,243,233,0.6)', lineHeight: '1.6' }}>{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  // AUTH PAGE
  if (currentView === 'auth') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px', background: '#0A0A0A' }}>
        <div style={{ ...styles.card, width: '100%', maxWidth: '420px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '32px', letterSpacing: '2px', marginBottom: '8px', color: '#F7F3E9' }}>PULPIT</div>
            <p style={{ fontSize: '14px', color: 'rgba(247,243,233,0.6)' }}>
              {authMode === 'login' ? 'Welcome back' : 'Create your account'}
            </p>
          </div>

          {authError && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', padding: '12px', marginBottom: '20px', fontSize: '13px', color: '#EF4444' }}>
              {authError}
            </div>
          )}

          {authMode === 'login' ? (
            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: '16px' }}>
                <label style={styles.label}>Email</label>
                <input 
                  type="email" 
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  style={styles.input} 
                  required 
                />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={styles.label}>Password</label>
                <input 
                  type="password" 
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  style={styles.input} 
                  required 
                />
              </div>
              <button type="submit" disabled={authLoading} style={{ ...styles.button, width: '100%', opacity: authLoading ? 0.6 : 1 }}>
                {authLoading ? 'LOGGING IN...' : 'LOG IN'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignup}>
              <div style={{ marginBottom: '16px' }}>
                <label style={styles.label}>Name</label>
                <input 
                  type="text" 
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  style={styles.input} 
                  required 
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={styles.label}>Email</label>
                <input 
                  type="email" 
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  style={styles.input} 
                  required 
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={styles.label}>Password</label>
                <input 
                  type="password" 
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  style={styles.input} 
                  required 
                />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={styles.label}>I am a...</label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  {['speaker', 'worship_leader', 'event_host'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setSignupUserType(type)}
                      style={{
                        flex: 1,
                        padding: '12px',
                        background: signupUserType === type ? 'rgba(83,94,74,0.3)' : 'rgba(247,243,233,0.05)',
                        border: signupUserType === type ? '2px solid #535E4A' : '1px solid rgba(247,243,233,0.15)',
                        borderRadius: '10px',
                        color: '#F7F3E9',
                        cursor: 'pointer',
                        fontSize: '12px',
                        textTransform: 'capitalize',
                      }}
                    >
                      {type.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
              <button type="submit" disabled={authLoading} style={{ ...styles.button, width: '100%', opacity: authLoading ? 0.6 : 1 }}>
                {authLoading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
              </button>
            </form>
          )}

          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <button 
              onClick={() => { setAuthMode(authMode === 'login' ? 'signup' : 'login'); setAuthError(''); }}
              style={{ background: 'transparent', border: 'none', color: '#535E4A', cursor: 'pointer', fontSize: '14px' }}
            >
              {authMode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Log in'}
            </button>
          </div>

          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <button 
              onClick={() => setCurrentView('landing')}
              style={{ background: 'transparent', border: 'none', color: 'rgba(247,243,233,0.5)', cursor: 'pointer', fontSize: '13px' }}
            >
              ← Back to home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // MAIN APP
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0A0A0A' }}>
      {/* Sidebar */}
      <div style={{ width: '240px', background: 'rgba(247,243,233,0.02)', borderRight: '1px solid rgba(247,243,233,0.08)', padding: '24px 16px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '24px', letterSpacing: '2px', marginBottom: '32px', paddingLeft: '12px', color: '#F7F3E9' }}>PULPIT</div>
        
        <nav style={{ flex: 1 }}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px',
                background: activeTab === item.id ? 'rgba(83,94,74,0.2)' : 'transparent',
                border: 'none',
                borderRadius: '10px',
                color: activeTab === item.id ? '#F7F3E9' : 'rgba(247,243,233,0.6)',
                cursor: 'pointer',
                fontSize: '14px',
                marginBottom: '4px',
                textAlign: 'left',
              }}
            >
              <item.icon size={18} />
              {item.label}
              {item.id === 'messages' && unreadMessages > 0 && (
                <span style={{ marginLeft: 'auto', background: '#535E4A', borderRadius: '10px', padding: '2px 8px', fontSize: '11px' }}>{unreadMessages}</span>
              )}
              {item.id === 'requests' && pendingRequests > 0 && (
                <span style={{ marginLeft: 'auto', background: '#FFB400', borderRadius: '10px', padding: '2px 8px', fontSize: '11px', color: '#0A0A0A' }}>{pendingRequests}</span>
              )}
            </button>
          ))}
        </nav>

        <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'transparent', border: 'none', color: 'rgba(247,243,233,0.5)', cursor: 'pointer', fontSize: '14px' }}>
          <LogOut size={18} /> Log Out
        </button>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '32px', letterSpacing: '2px', color: '#F7F3E9' }}>
              {activeTab === 'dashboard' && `Welcome, ${currentUser?.name || 'User'}`}
              {activeTab === 'requests' && 'BOOKING REQUESTS'}
              {activeTab === 'calendar' && 'CALENDAR'}
              {activeTab === 'messages' && 'MESSAGES'}
              {activeTab === 'profile' && 'YOUR PROFILE'}
              {activeTab === 'resources' && 'RESOURCES'}
              {activeTab === 'documents' && 'DOCUMENTS'}
              {activeTab === 'team' && 'TEAM'}
              {activeTab === 'settings' && 'SETTINGS'}
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button style={{ position: 'relative', background: 'transparent', border: 'none', cursor: 'pointer', padding: '8px' }}>
              <Bell size={22} color="rgba(247,243,233,0.7)" />
              {unreadNotifications > 0 && (
                <span style={{ position: 'absolute', top: '4px', right: '4px', width: '8px', height: '8px', background: '#EF4444', borderRadius: '50%' }} />
              )}
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '64px' }}>
            <p style={{ color: 'rgba(247,243,233,0.5)' }}>Loading...</p>
          </div>
        ) : (
          <>
            {/* Dashboard */}
            {activeTab === 'dashboard' && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                  {[
                    { label: 'Pending Requests', value: pendingRequests, color: '#FFB400' },
                    { label: 'Confirmed Events', value: bookingRequests.filter(r => r.status === 'confirmed').length, color: '#4CAF50' },
                    { label: 'Unread Messages', value: unreadMessages, color: '#6B8AE5' },
                    { label: 'Documents', value: documents.length, color: '#535E4A' },
                  ].map((stat, i) => (
                    <div key={i} style={styles.card}>
                      <p style={{ fontSize: '36px', fontWeight: '600', color: stat.color, marginBottom: '4px' }}>{stat.value}</p>
                      <p style={{ fontSize: '13px', color: 'rgba(247,243,233,0.5)' }}>{stat.label}</p>
                    </div>
                  ))}
                </div>

                <div style={styles.card}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '18px', letterSpacing: '1px', color: '#F7F3E9' }}>RECENT REQUESTS</h2>
                    <button onClick={() => setActiveTab('requests')} style={{ background: 'transparent', border: 'none', color: '#535E4A', cursor: 'pointer', fontSize: '13px' }}>View All →</button>
                  </div>
                  
                  {bookingRequests.length === 0 ? (
                    <p style={{ color: 'rgba(247,243,233,0.5)', textAlign: 'center', padding: '32px' }}>No booking requests yet</p>
                  ) : (
                    bookingRequests.slice(0, 5).map((request, index) => (
                      <div key={request.id || index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'rgba(247,243,233,0.03)', borderRadius: '10px', marginBottom: '8px' }}>
                        <div>
                          <p style={{ fontSize: '15px', fontWeight: '500', marginBottom: '4px', color: '#F7F3E9' }}>{request.event_name}</p>
                          <p style={{ fontSize: '13px', color: 'rgba(247,243,233,0.5)' }}>{request.church_name} • {request.location}</p>
                        </div>
                        <span style={{ 
                          ...styles.badge, 
                          background: request.status === 'pending' ? 'rgba(255,180,0,0.15)' : request.status === 'confirmed' ? 'rgba(76,175,80,0.15)' : 'rgba(247,243,233,0.1)',
                          color: request.status === 'pending' ? '#FFB400' : request.status === 'confirmed' ? '#4CAF50' : 'rgba(247,243,233,0.5)',
                        }}>
                          {request.status}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Requests */}
            {activeTab === 'requests' && (
              <div style={styles.card}>
                {bookingRequests.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '64px' }}>
                    <Briefcase size={48} color="rgba(247,243,233,0.2)" style={{ marginBottom: '16px' }} />
                    <p style={{ color: 'rgba(247,243,233,0.5)', marginBottom: '8px' }}>No booking requests yet</p>
                    <p style={{ color: 'rgba(247,243,233,0.4)', fontSize: '13px' }}>Share your booking link to start receiving requests</p>
                  </div>
                ) : (
                  bookingRequests.map((request, index) => (
                    <div key={request.id || index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'rgba(247,243,233,0.03)', borderRadius: '10px', marginBottom: '8px' }}>
                      <div>
                        <p style={{ fontSize: '15px', fontWeight: '500', marginBottom: '4px', color: '#F7F3E9' }}>{request.event_name}</p>
                        <p style={{ fontSize: '13px', color: 'rgba(247,243,233,0.5)' }}>{request.church_name} • {request.location}</p>
                      </div>
                      <span style={{ ...styles.badge, background: 'rgba(255,180,0,0.15)', color: '#FFB400' }}>{request.status}</span>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'messages' && (
              <div style={styles.card}>
                <div style={{ textAlign: 'center', padding: '64px' }}>
                  <MessageSquare size={48} color="rgba(247,243,233,0.2)" style={{ marginBottom: '16px' }} />
                  <p style={{ color: 'rgba(247,243,233,0.5)' }}>No messages yet</p>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div style={styles.card}>
                <div style={{ textAlign: 'center', padding: '32px' }}>
                  <div style={{ width: '80px', height: '80px', background: 'linear-gradient(135deg, #535E4A, #3d4638)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '28px', fontWeight: '600', color: '#F7F3E9' }}>
                    {currentUser?.name?.charAt(0) || '?'}
                  </div>
                  <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '4px', color: '#F7F3E9' }}>{currentUser?.name || 'User'}</h2>
                  <p style={{ color: 'rgba(247,243,233,0.5)', marginBottom: '24px' }}>{currentUser?.email}</p>
                  <p style={{ color: 'rgba(247,243,233,0.4)', fontSize: '14px' }}>Profile editing coming soon</p>
                </div>
              </div>
            )}

            {activeTab === 'calendar' && (
              <div style={styles.card}>
                <div style={{ textAlign: 'center', padding: '64px' }}>
                  <Calendar size={48} color="rgba(247,243,233,0.2)" style={{ marginBottom: '16px' }} />
                  <p style={{ color: 'rgba(247,243,233,0.5)' }}>Calendar coming soon</p>
                </div>
              </div>
            )}

            {activeTab === 'documents' && (
              <div style={styles.card}>
                <div style={{ textAlign: 'center', padding: '64px' }}>
                  <FolderOpen size={48} color="rgba(247,243,233,0.2)" style={{ marginBottom: '16px' }} />
                  <p style={{ color: 'rgba(247,243,233,0.5)' }}>No documents yet</p>
                </div>
              </div>
            )}

            {activeTab === 'resources' && (
              <div style={styles.card}>
                <div style={{ textAlign: 'center', padding: '64px' }}>
                  <FileText size={48} color="rgba(247,243,233,0.2)" style={{ marginBottom: '16px' }} />
                  <p style={{ color: 'rgba(247,243,233,0.5)' }}>No resources yet</p>
                </div>
              </div>
            )}

            {activeTab === 'team' && (
              <div style={styles.card}>
                <div style={{ textAlign: 'center', padding: '64px' }}>
                  <Users size={48} color="rgba(247,243,233,0.2)" style={{ marginBottom: '16px' }} />
                  <p style={{ color: 'rgba(247,243,233,0.5)' }}>No team members yet</p>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div style={styles.card}>
                <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '18px', marginBottom: '24px', letterSpacing: '1px', color: '#F7F3E9' }}>NOTIFICATIONS</h3>
                {['New booking requests', 'Messages', 'Document signed', 'Event reminders'].map((setting, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid rgba(247,243,233,0.08)' }}>
                    <span style={{ fontSize: '14px', color: '#F7F3E9' }}>{setting}</span>
                    <div style={{ width: '44px', height: '24px', background: '#535E4A', borderRadius: '12px', padding: '2px', cursor: 'pointer' }}>
                      <div style={{ width: '20px', height: '20px', background: '#F7F3E9', borderRadius: '50%', marginLeft: 'auto' }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
