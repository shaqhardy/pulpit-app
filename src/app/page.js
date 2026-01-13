'use client';

import { useState, useEffect } from 'react';
import { Calendar, MessageSquare, User, FileText, Image, Settings, Search, Bell, Plus, ChevronRight, Check, X, Clock, MapPin, Users, DollarSign, Mic, Music, CalendarDays, Send, Star, Shield, Eye, UserPlus, Link, Copy, ExternalLink, Home, Briefcase, Mail, Phone, Globe, Edit, Trash2, Download, Share2, Filter, CheckCircle, AlertCircle, LogOut, FolderOpen, PenTool, Upload, File, RefreshCw, Plane, Hotel, Car, Coffee, ClipboardList, Video, Camera, Paperclip } from 'lucide-react';
import api from '../lib/api';

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
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  
  // App state
  const [currentView, setCurrentView] = useState('landing');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  
  // Data state
  const [bookingRequests, setBookingRequests] = useState([]);
  const [messages, setMessages] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [resources, setResources] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  
  // Form state
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    user_type: 'speaker' 
  });

  // Check for existing auth on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      loadUserData();
    }
  }, []);

  const loadUserData = async () => {
    try {
      const user = await api.auth.me();
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
        api.bookingRequests.getAll().catch(() => []),
        api.messages.getAll().catch(() => []),
        api.notifications.getAll().catch(() => []),
        api.documents.getAll().catch(() => []),
        api.resources.getAll().catch(() => []),
        api.teamMembers.getAll().catch(() => []),
      ]);
      
      setBookingRequests(requestsData);
      setMessages(messagesData);
      setNotifications(notificationsData);
      setDocuments(documentsData);
      setResources(resourcesData);
      setTeamMembers(teamData);
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
      const response = await api.auth.login(loginForm);
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
      const response = await api.auth.signup(signupForm);
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

  // Landing Page
  const LandingPage = () => (
    <div style={{ minHeight: '100vh', background: '#0A0A0A' }}>
      {/* Nav */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 48px', borderBottom: '1px solid rgba(247,243,233,0.08)' }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '28px', letterSpacing: '2px' }}>PULPIT</div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button onClick={() => { setCurrentView('auth'); setAuthMode('login'); }} style={styles.buttonSecondary}>Log In</button>
          <button onClick={() => { setCurrentView('auth'); setAuthMode('signup'); }} style={styles.button}>GET STARTED</button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: '120px 48px', textAlign: 'center', maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '72px', letterSpacing: '3px', lineHeight: '1.1', marginBottom: '24px' }}>
          THE BOOKING PLATFORM FOR SPEAKERS & WORSHIP LEADERS
        </h1>
        <p style={{ fontSize: '18px', color: 'rgba(247,243,233,0.7)', marginBottom: '48px', lineHeight: '1.7' }}>
          Manage requests, contracts, itineraries, and communication—all in one place. 100% free.
        </p>
        <button onClick={() => { setCurrentView('auth'); setAuthMode('signup'); }} style={{ ...styles.button, padding: '18px 48px', fontSize: '15px' }}>
          CREATE YOUR FREE ACCOUNT
        </button>
      </section>

      {/* Features */}
      <section style={{ padding: '80px 48px', background: 'rgba(247,243,233,0.02)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '36px', textAlign: 'center', marginBottom: '64px', letterSpacing: '2px' }}>EVERYTHING YOU NEED</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
            {[
              { icon: Briefcase, title: 'Booking Requests', desc: 'Receive and manage speaking requests with all details in one place' },
              { icon: FileText, title: 'Contracts & Documents', desc: 'Send contracts, collect signatures, store W9s and safety docs' },
              { icon: ClipboardList, title: 'Itineraries', desc: 'Collaborate with hosts on travel details and event schedules' },
              { icon: MessageSquare, title: 'Messaging', desc: 'Communicate directly with event hosts without email chains' },
              { icon: Calendar, title: 'Calendar', desc: 'See all your events and manage availability in one view' },
              { icon: Bell, title: 'Notifications', desc: 'Never miss a request or message with real-time alerts' },
            ].map((feature, i) => (
              <div key={i} style={styles.card}>
                <feature.icon size={32} color="#535E4A" style={{ marginBottom: '16px' }} />
                <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '18px', marginBottom: '8px', letterSpacing: '1px' }}>{feature.title}</h3>
                <p style={{ fontSize: '14px', color: 'rgba(247,243,233,0.6)', lineHeight: '1.6' }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '120px 48px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '48px', marginBottom: '24px', letterSpacing: '2px' }}>READY TO SIMPLIFY YOUR BOOKING?</h2>
        <p style={{ fontSize: '16px', color: 'rgba(247,243,233,0.6)', marginBottom: '32px' }}>Join speakers and worship leaders who've streamlined their workflow.</p>
        <button onClick={() => { setCurrentView('auth'); setAuthMode('signup'); }} style={{ ...styles.button, padding: '18px 48px', fontSize: '15px' }}>GET STARTED FREE</button>
      </section>
    </div>
  );

  // Auth Page
  const AuthPage = () => (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px' }}>
      <div style={{ ...styles.card, width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '32px', letterSpacing: '2px', marginBottom: '8px' }}>PULPIT</div>
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
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                style={styles.input} 
                required 
              />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={styles.label}>Password</label>
              <input 
                type="password" 
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
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
                value={signupForm.name}
                onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                style={styles.input} 
                required 
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={styles.label}>Email</label>
              <input 
                type="email" 
                value={signupForm.email}
                onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                style={styles.input} 
                required 
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={styles.label}>Password</label>
              <input 
                type="password" 
                value={signupForm.password}
                onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
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
                    onClick={() => setSignupForm({ ...signupForm, user_type: type })}
                    style={{
                      flex: 1,
                      padding: '12px',
                      background: signupForm.user_type === type ? 'rgba(83,94,74,0.3)' : 'rgba(247,243,233,0.05)',
                      border: signupForm.user_type === type ? '2px solid #535E4A' : '1px solid rgba(247,243,233,0.15)',
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

  // Main App
  const MainApp = () => (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <div style={{ width: '240px', background: 'rgba(247,243,233,0.02)', borderRight: '1px solid rgba(247,243,233,0.08)', padding: '24px 16px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '24px', letterSpacing: '2px', marginBottom: '32px', paddingLeft: '12px' }}>PULPIT</div>
        
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
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '32px', letterSpacing: '2px' }}>
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
                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
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

                {/* Recent Requests */}
                <div style={styles.card}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '18px', letterSpacing: '1px' }}>RECENT REQUESTS</h2>
                    <button onClick={() => setActiveTab('requests')} style={{ background: 'transparent', border: 'none', color: '#535E4A', cursor: 'pointer', fontSize: '13px' }}>View All →</button>
                  </div>
                  
                  {bookingRequests.length === 0 ? (
                    <p style={{ color: 'rgba(247,243,233,0.5)', textAlign: 'center', padding: '32px' }}>No booking requests yet</p>
                  ) : (
                    bookingRequests.slice(0, 5).map((request) => (
                      <div key={request.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'rgba(247,243,233,0.03)', borderRadius: '10px', marginBottom: '8px' }}>
                        <div>
                          <p style={{ fontSize: '15px', fontWeight: '500', marginBottom: '4px' }}>{request.event_name}</p>
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
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(247,243,233,0.1)' }}>
                        <th style={{ textAlign: 'left', padding: '12px', fontSize: '11px', color: 'rgba(247,243,233,0.5)', textTransform: 'uppercase' }}>Event</th>
                        <th style={{ textAlign: 'left', padding: '12px', fontSize: '11px', color: 'rgba(247,243,233,0.5)', textTransform: 'uppercase' }}>Location</th>
                        <th style={{ textAlign: 'left', padding: '12px', fontSize: '11px', color: 'rgba(247,243,233,0.5)', textTransform: 'uppercase' }}>Date</th>
                        <th style={{ textAlign: 'left', padding: '12px', fontSize: '11px', color: 'rgba(247,243,233,0.5)', textTransform: 'uppercase' }}>Status</th>
                        <th style={{ textAlign: 'right', padding: '12px' }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookingRequests.map((request) => (
                        <tr key={request.id} style={{ borderBottom: '1px solid rgba(247,243,233,0.06)' }}>
                          <td style={{ padding: '16px' }}>
                            <p style={{ fontWeight: '500', marginBottom: '2px' }}>{request.event_name}</p>
                            <p style={{ fontSize: '13px', color: 'rgba(247,243,233,0.5)' }}>{request.church_name}</p>
                          </td>
                          <td style={{ padding: '16px', color: 'rgba(247,243,233,0.7)', fontSize: '14px' }}>{request.location}</td>
                          <td style={{ padding: '16px', color: 'rgba(247,243,233,0.7)', fontSize: '14px' }}>{request.event_date ? new Date(request.event_date).toLocaleDateString() : '—'}</td>
                          <td style={{ padding: '16px' }}>
                            <span style={{ 
                              ...styles.badge, 
                              background: request.status === 'pending' ? 'rgba(255,180,0,0.15)' : request.status === 'confirmed' ? 'rgba(76,175,80,0.15)' : 'rgba(247,243,233,0.1)',
                              color: request.status === 'pending' ? '#FFB400' : request.status === 'confirmed' ? '#4CAF50' : 'rgba(247,243,233,0.5)',
                            }}>
                              {request.status}
                            </span>
                          </td>
                          <td style={{ padding: '16px', textAlign: 'right' }}>
                            <button style={styles.buttonSecondary}>View</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {/* Messages */}
            {activeTab === 'messages' && (
              <div style={styles.card}>
                {messages.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '64px' }}>
                    <MessageSquare size={48} color="rgba(247,243,233,0.2)" style={{ marginBottom: '16px' }} />
                    <p style={{ color: 'rgba(247,243,233,0.5)' }}>No messages yet</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div key={message.id} style={{ display: 'flex', gap: '16px', padding: '16px', background: message.read ? 'transparent' : 'rgba(83,94,74,0.1)', borderRadius: '10px', marginBottom: '8px', cursor: 'pointer' }}>
                      <div style={{ width: '44px', height: '44px', background: 'rgba(247,243,233,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <User size={20} color="rgba(247,243,233,0.5)" />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: '500', marginBottom: '4px' }}>Message #{message.id}</p>
                        <p style={{ fontSize: '13px', color: 'rgba(247,243,233,0.6)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{message.content}</p>
                      </div>
                      {!message.read && <div style={{ width: '8px', height: '8px', background: '#535E4A', borderRadius: '50%', alignSelf: 'center' }} />}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Profile */}
            {activeTab === 'profile' && (
              <div style={styles.card}>
                <div style={{ display: 'flex', alignItems: 'start', gap: '24px', marginBottom: '32px' }}>
                  <div style={{ width: '100px', height: '100px', background: 'linear-gradient(135deg, #535E4A, #3d4638)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: '600' }}>
                    {currentUser?.name?.split(' ').map(n => n[0]).join('') || '?'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ marginBottom: '16px' }}>
                      <label style={styles.label}>Name</label>
                      <input type="text" defaultValue={currentUser?.name || ''} style={styles.input} />
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                      <label style={styles.label}>Tagline</label>
                      <input type="text" defaultValue={currentUser?.tagline || ''} placeholder="e.g., Youth Speaker & Author" style={styles.input} />
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={styles.label}>Bio</label>
                  <textarea rows={4} defaultValue={currentUser?.bio || ''} placeholder="Tell event hosts about yourself..." style={{ ...styles.input, resize: 'none' }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                  <div>
                    <label style={styles.label}>Location</label>
                    <input type="text" defaultValue={currentUser?.location || ''} placeholder="City, State" style={styles.input} />
                  </div>
                  <div>
                    <label style={styles.label}>Topics</label>
                    <input type="text" defaultValue={currentUser?.topics || ''} placeholder="e.g., Youth, Identity, Faith" style={styles.input} />
                  </div>
                </div>

                <button style={styles.button}>SAVE CHANGES</button>
              </div>
            )}

            {/* Documents */}
            {activeTab === 'documents' && (
              <div style={styles.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <p style={{ color: 'rgba(247,243,233,0.5)', fontSize: '14px' }}>Store and manage event documents</p>
                  <button style={{ ...styles.button, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Plus size={16} /> UPLOAD
                  </button>
                </div>
                
                {documents.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '64px' }}>
                    <FolderOpen size={48} color="rgba(247,243,233,0.2)" style={{ marginBottom: '16px' }} />
                    <p style={{ color: 'rgba(247,243,233,0.5)' }}>No documents yet</p>
                  </div>
                ) : (
                  documents.map((doc) => (
                    <div key={doc.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'rgba(247,243,233,0.03)', borderRadius: '10px', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <FileText size={20} color="#535E4A" />
                        <div>
                          <p style={{ fontWeight: '500' }}>{doc.name}</p>
                          <p style={{ fontSize: '12px', color: 'rgba(247,243,233,0.5)' }}>{doc.document_type}</p>
                        </div>
                      </div>
                      <button style={styles.buttonSecondary}><Download size={16} /></button>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Resources */}
            {activeTab === 'resources' && (
              <div style={styles.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <p style={{ color: 'rgba(247,243,233,0.5)', fontSize: '14px' }}>Sermon outlines and materials for event hosts</p>
                  <button style={{ ...styles.button, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Plus size={16} /> UPLOAD
                  </button>
                </div>
                
                {resources.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '64px' }}>
                    <FileText size={48} color="rgba(247,243,233,0.2)" style={{ marginBottom: '16px' }} />
                    <p style={{ color: 'rgba(247,243,233,0.5)' }}>No resources yet</p>
                  </div>
                ) : (
                  resources.map((resource) => (
                    <div key={resource.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'rgba(247,243,233,0.03)', borderRadius: '10px', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <File size={20} color="#535E4A" />
                        <div>
                          <p style={{ fontWeight: '500' }}>{resource.name}</p>
                          <p style={{ fontSize: '12px', color: 'rgba(247,243,233,0.5)' }}>{resource.resource_type} • {resource.download_count || 0} downloads</p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button style={styles.buttonSecondary}><Edit size={16} /></button>
                        <button style={styles.buttonSecondary}><Trash2 size={16} /></button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Team */}
            {activeTab === 'team' && (
              <div style={styles.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <p style={{ color: 'rgba(247,243,233,0.5)', fontSize: '14px' }}>Invite booking managers to help manage your requests</p>
                  <button style={{ ...styles.button, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <UserPlus size={16} /> INVITE
                  </button>
                </div>
                
                {teamMembers.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '64px' }}>
                    <Users size={48} color="rgba(247,243,233,0.2)" style={{ marginBottom: '16px' }} />
                    <p style={{ color: 'rgba(247,243,233,0.5)' }}>No team members yet</p>
                  </div>
                ) : (
                  teamMembers.map((member) => (
                    <div key={member.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'rgba(247,243,233,0.03)', borderRadius: '10px', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40px', height: '40px', background: 'rgba(247,243,233,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <User size={18} color="rgba(247,243,233,0.5)" />
                        </div>
                        <div>
                          <p style={{ fontWeight: '500' }}>{member.member_name}</p>
                          <p style={{ fontSize: '12px', color: 'rgba(247,243,233,0.5)' }}>{member.member_email}</p>
                        </div>
                      </div>
                      <span style={{ 
                        ...styles.badge, 
                        background: member.status === 'active' ? 'rgba(76,175,80,0.15)' : 'rgba(255,180,0,0.15)',
                        color: member.status === 'active' ? '#4CAF50' : '#FFB400',
                      }}>
                        {member.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Calendar */}
            {activeTab === 'calendar' && (
              <div style={styles.card}>
                <div style={{ textAlign: 'center', padding: '64px' }}>
                  <Calendar size={48} color="rgba(247,243,233,0.2)" style={{ marginBottom: '16px' }} />
                  <p style={{ color: 'rgba(247,243,233,0.5)', marginBottom: '8px' }}>Calendar view coming soon</p>
                  <p style={{ color: 'rgba(247,243,233,0.4)', fontSize: '13px' }}>Your confirmed events will appear here</p>
                </div>
              </div>
            )}

            {/* Settings */}
            {activeTab === 'settings' && (
              <div style={styles.card}>
                <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '18px', marginBottom: '24px', letterSpacing: '1px' }}>NOTIFICATIONS</h3>
                {[
                  'New booking requests',
                  'Messages',
                  'Document signed',
                  'Event reminders',
                ].map((setting, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid rgba(247,243,233,0.08)' }}>
                    <span style={{ fontSize: '14px' }}>{setting}</span>
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

  // Render based on current view
  if (currentView === 'landing') return <LandingPage />;
  if (currentView === 'auth') return <AuthPage />;
  if (currentView === 'app') return <MainApp />;
  
  return <LandingPage />;
}
