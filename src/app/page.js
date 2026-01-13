'use client';

import { useState, useEffect } from 'react';
import { Calendar, MessageSquare, User, FileText, Settings, Bell, Plus, Home, Briefcase, LogOut, FolderOpen, Users, CheckCircle, X, Check, Clock, MapPin, DollarSign, Users as UsersIcon, Mail, Phone, Building, ChevronLeft, ChevronRight } from 'lucide-react';

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
  buttonDanger: {
    background: 'rgba(239,68,68,0.15)',
    color: '#EF4444',
    border: '1px solid rgba(239,68,68,0.3)',
    padding: '12px 24px',
    borderRadius: '10px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: "'Bebas Neue', sans-serif",
    letterSpacing: '1px',
  },
  buttonSuccess: {
    background: '#535E4A',
    color: '#F7F3E9',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '10px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: "'Bebas Neue', sans-serif",
    letterSpacing: '1px',
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
    boxSizing: 'border-box',
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
  
  // Selected request for detail view
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  
  // Calendar state
  const [calendarDate, setCalendarDate] = useState(new Date());
  
  // Form data
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupUserType, setSignupUserType] = useState('speaker');

  // Booking form state
  const [bookingForm, setBookingForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    churchName: '',
    churchAddress: '',
    churchCity: '',
    churchState: '',
    churchZip: '',
    eventAddress: '',
    eventCity: '',
    eventState: '',
    eventZip: '',
    eventStartDate: '',
    eventEndDate: '',
    sundayRequired: '',
    previousEvents: '',
    eventTheme: '',
    audience: [],
    attendance: '',
    merchAllowed: 'yes',
    attire: '',
    honorarium: '',
    expensesCovered: [],
    expensesEmail: '',
    additionalComments: '',
  });
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('book') === '1' || window.location.pathname.includes('/book')) {
      setCurrentView('booking');
    } else if (params.get('profile') === '1' || window.location.pathname.includes('/profile')) {
      setCurrentView('publicProfile');
    } else {
      const token = localStorage.getItem('authToken');
      if (token) {
        loadUserData();
      }
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

  const handleStatusUpdate = async (requestId, newStatus) => {
    setUpdatingStatus(true);
    try {
      await apiCall(DATA_API, `/booking_request/${requestId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      });
      
      // Update local state
      setBookingRequests(prev => prev.map(r => 
        r.id === requestId ? { ...r, status: newStatus } : r
      ));
      
      // Update selected request if viewing
      if (selectedRequest && selectedRequest.id === requestId) {
        setSelectedRequest(prev => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update status. Please try again.');
    }
    setUpdatingStatus(false);
  };

  const handleBookingChange = (field, value) => {
    setBookingForm(prev => ({ ...prev, [field]: value }));
  };

  const handleAudienceChange = (value) => {
    setBookingForm(prev => ({
      ...prev,
      audience: prev.audience.includes(value)
        ? prev.audience.filter(v => v !== value)
        : [...prev.audience, value]
    }));
  };

  const handleExpenseChange = (value) => {
    setBookingForm(prev => ({
      ...prev,
      expensesCovered: prev.expensesCovered.includes(value)
        ? prev.expensesCovered.filter(v => v !== value)
        : [...prev.expensesCovered, value]
    }));
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingSubmitting(true);
    setBookingError('');

    try {
      const payload = {
        event_name: bookingForm.eventTheme || 'Speaking Request',
        church_name: bookingForm.churchName,
        location: `${bookingForm.eventCity}, ${bookingForm.eventState}`,
        event_date: bookingForm.eventStartDate,
        honorarium: parseFloat(bookingForm.honorarium) || 0,
        attendance: parseInt(bookingForm.attendance) || 0,
        request_type: 'speaking',
        attire: bookingForm.attire,
        expenses_covered: bookingForm.expensesCovered.length > 0,
        merch_allowed: bookingForm.merchAllowed === 'yes',
        status: 'pending',
        notes: JSON.stringify({
          contact: {
            firstName: bookingForm.firstName,
            lastName: bookingForm.lastName,
            email: bookingForm.email,
            phone: bookingForm.phone,
          },
          churchAddress: {
            address: bookingForm.churchAddress,
            city: bookingForm.churchCity,
            state: bookingForm.churchState,
            zip: bookingForm.churchZip,
          },
          eventAddress: {
            address: bookingForm.eventAddress,
            city: bookingForm.eventCity,
            state: bookingForm.eventState,
            zip: bookingForm.eventZip,
          },
          eventEndDate: bookingForm.eventEndDate,
          sundayRequired: bookingForm.sundayRequired,
          previousEvents: bookingForm.previousEvents,
          audience: bookingForm.audience,
          expensesCovered: bookingForm.expensesCovered,
          expensesEmail: bookingForm.expensesEmail,
          additionalComments: bookingForm.additionalComments,
        }),
      };

      await apiCall(DATA_API, '/booking_request', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      setBookingSuccess(true);
    } catch (error) {
      setBookingError(error.message || 'Failed to submit request');
    }
    setBookingSubmitting(false);
  };

  // Parse notes JSON safely
  const parseNotes = (notes) => {
    if (!notes) return {};
    try {
      return typeof notes === 'string' ? JSON.parse(notes) : notes;
    } catch {
      return {};
    }
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

  const audienceOptions = [
    'Church Congregation',
    'Adults',
    "Men's Ministry",
    'Young Adults',
    'College Students',
    'High School Students',
    'Middle School Students',
    'Other',
  ];

  const expenseOptions = [
    'Travel (mileage, rental, gas, car, etc.)',
    'Travel for companion (flight)',
    'Food & Coffee',
    'Parking',
    'Hotel',
  ];

  const attireOptions = ['Casual', 'Business Casual', 'Formal', 'Other'];

  const getStatusBadge = (status) => {
    const statusStyles = {
      pending: { background: 'rgba(255,180,0,0.15)', color: '#FFB400' },
      confirmed: { background: 'rgba(76,175,80,0.15)', color: '#4CAF50' },
      declined: { background: 'rgba(239,68,68,0.15)', color: '#EF4444' },
      completed: { background: 'rgba(107,138,229,0.15)', color: '#6B8AE5' },
    };
    return statusStyles[status] || { background: 'rgba(247,243,233,0.1)', color: 'rgba(247,243,233,0.5)' };
  };

  // REQUEST DETAIL VIEW
  const renderRequestDetail = () => {
    if (!selectedRequest) return null;
    
    const notes = parseNotes(selectedRequest.notes);
    const contact = notes.contact || {};
    const churchAddress = notes.churchAddress || {};
    const eventAddress = notes.eventAddress || {};
    
    return (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, overflow: 'auto' }}>
        <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px' }}>
          <div style={{ ...styles.card, background: '#0A0A0A' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '32px' }}>
              <div>
                <button onClick={() => setSelectedRequest(null)} style={{ background: 'transparent', border: 'none', color: 'rgba(247,243,233,0.5)', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <ChevronLeft size={18} /> Back to Requests
                </button>
                <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '28px', letterSpacing: '2px', color: '#F7F3E9', marginBottom: '8px' }}>
                  {selectedRequest.event_name}
                </h1>
                <p style={{ color: 'rgba(247,243,233,0.5)', fontSize: '14px' }}>
                  {selectedRequest.church_name} • {selectedRequest.location}
                </p>
              </div>
              <span style={{ ...styles.badge, ...getStatusBadge(selectedRequest.status) }}>
                {selectedRequest.status}
              </span>
            </div>

            {/* Action Buttons */}
            {selectedRequest.status === 'pending' && (
              <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', padding: '20px', background: 'rgba(247,243,233,0.03)', borderRadius: '12px' }}>
                <button 
                  onClick={() => handleStatusUpdate(selectedRequest.id, 'confirmed')} 
                  disabled={updatingStatus}
                  style={{ ...styles.buttonSuccess, display: 'flex', alignItems: 'center', gap: '8px', opacity: updatingStatus ? 0.6 : 1 }}
                >
                  <Check size={16} /> ACCEPT REQUEST
                </button>
                <button 
                  onClick={() => handleStatusUpdate(selectedRequest.id, 'declined')} 
                  disabled={updatingStatus}
                  style={{ ...styles.buttonDanger, display: 'flex', alignItems: 'center', gap: '8px', opacity: updatingStatus ? 0.6 : 1 }}
                >
                  <X size={16} /> DECLINE
                </button>
              </div>
            )}

            {selectedRequest.status === 'confirmed' && (
              <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', padding: '20px', background: 'rgba(76,175,80,0.1)', borderRadius: '12px', border: '1px solid rgba(76,175,80,0.2)' }}>
                <CheckCircle size={20} color="#4CAF50" />
                <div>
                  <p style={{ color: '#4CAF50', fontWeight: '600', marginBottom: '4px' }}>Request Confirmed</p>
                  <p style={{ color: 'rgba(247,243,233,0.5)', fontSize: '13px' }}>You've accepted this speaking engagement</p>
                </div>
                <button 
                  onClick={() => handleStatusUpdate(selectedRequest.id, 'completed')} 
                  disabled={updatingStatus}
                  style={{ ...styles.buttonSecondary, marginLeft: 'auto' }}
                >
                  Mark Complete
                </button>
              </div>
            )}

            {/* Contact Information */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '16px', letterSpacing: '1px', color: '#F7F3E9', marginBottom: '16px' }}>CONTACT INFORMATION</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: 'rgba(247,243,233,0.03)', borderRadius: '10px' }}>
                  <User size={18} color="rgba(247,243,233,0.5)" />
                  <div>
                    <p style={{ fontSize: '12px', color: 'rgba(247,243,233,0.4)' }}>Name</p>
                    <p style={{ color: '#F7F3E9' }}>{contact.firstName} {contact.lastName}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: 'rgba(247,243,233,0.03)', borderRadius: '10px' }}>
                  <Mail size={18} color="rgba(247,243,233,0.5)" />
                  <div>
                    <p style={{ fontSize: '12px', color: 'rgba(247,243,233,0.4)' }}>Email</p>
                    <p style={{ color: '#F7F3E9' }}>{contact.email || 'Not provided'}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: 'rgba(247,243,233,0.03)', borderRadius: '10px' }}>
                  <Phone size={18} color="rgba(247,243,233,0.5)" />
                  <div>
                    <p style={{ fontSize: '12px', color: 'rgba(247,243,233,0.4)' }}>Phone</p>
                    <p style={{ color: '#F7F3E9' }}>{contact.phone || 'Not provided'}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: 'rgba(247,243,233,0.03)', borderRadius: '10px' }}>
                  <Building size={18} color="rgba(247,243,233,0.5)" />
                  <div>
                    <p style={{ fontSize: '12px', color: 'rgba(247,243,233,0.4)' }}>Organization</p>
                    <p style={{ color: '#F7F3E9' }}>{selectedRequest.church_name}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Event Details */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '16px', letterSpacing: '1px', color: '#F7F3E9', marginBottom: '16px' }}>EVENT DETAILS</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: 'rgba(247,243,233,0.03)', borderRadius: '10px' }}>
                  <Calendar size={18} color="rgba(247,243,233,0.5)" />
                  <div>
                    <p style={{ fontSize: '12px', color: 'rgba(247,243,233,0.4)' }}>Event Date</p>
                    <p style={{ color: '#F7F3E9' }}>{selectedRequest.event_date}{notes.eventEndDate ? ` - ${notes.eventEndDate}` : ''}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: 'rgba(247,243,233,0.03)', borderRadius: '10px' }}>
                  <MapPin size={18} color="rgba(247,243,233,0.5)" />
                  <div>
                    <p style={{ fontSize: '12px', color: 'rgba(247,243,233,0.4)' }}>Location</p>
                    <p style={{ color: '#F7F3E9' }}>{eventAddress.address ? `${eventAddress.address}, ` : ''}{selectedRequest.location}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: 'rgba(247,243,233,0.03)', borderRadius: '10px' }}>
                  <UsersIcon size={18} color="rgba(247,243,233,0.5)" />
                  <div>
                    <p style={{ fontSize: '12px', color: 'rgba(247,243,233,0.4)' }}>Expected Attendance</p>
                    <p style={{ color: '#F7F3E9' }}>{selectedRequest.attendance || 'Not specified'}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: 'rgba(247,243,233,0.03)', borderRadius: '10px' }}>
                  <DollarSign size={18} color="rgba(247,243,233,0.5)" />
                  <div>
                    <p style={{ fontSize: '12px', color: 'rgba(247,243,233,0.4)' }}>Honorarium</p>
                    <p style={{ color: '#F7F3E9' }}>${selectedRequest.honorarium || '0'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Audience */}
            {notes.audience && notes.audience.length > 0 && (
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '16px', letterSpacing: '1px', color: '#F7F3E9', marginBottom: '16px' }}>AUDIENCE</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {notes.audience.map((a, i) => (
                    <span key={i} style={{ padding: '8px 16px', background: 'rgba(83,94,74,0.2)', borderRadius: '20px', fontSize: '13px', color: '#F7F3E9' }}>{a}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Logistics */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '16px', letterSpacing: '1px', color: '#F7F3E9', marginBottom: '16px' }}>LOGISTICS</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <div style={{ padding: '16px', background: 'rgba(247,243,233,0.03)', borderRadius: '10px' }}>
                  <p style={{ fontSize: '12px', color: 'rgba(247,243,233,0.4)', marginBottom: '4px' }}>Attire</p>
                  <p style={{ color: '#F7F3E9', textTransform: 'capitalize' }}>{selectedRequest.attire || 'Not specified'}</p>
                </div>
                <div style={{ padding: '16px', background: 'rgba(247,243,233,0.03)', borderRadius: '10px' }}>
                  <p style={{ fontSize: '12px', color: 'rgba(247,243,233,0.4)', marginBottom: '4px' }}>Merch Allowed</p>
                  <p style={{ color: '#F7F3E9' }}>{selectedRequest.merch_allowed ? 'Yes' : 'No'}</p>
                </div>
                <div style={{ padding: '16px', background: 'rgba(247,243,233,0.03)', borderRadius: '10px' }}>
                  <p style={{ fontSize: '12px', color: 'rgba(247,243,233,0.4)', marginBottom: '4px' }}>Sunday Required</p>
                  <p style={{ color: '#F7F3E9', textTransform: 'capitalize' }}>{notes.sundayRequired || 'Not specified'}</p>
                </div>
              </div>
            </div>

            {/* Expenses */}
            {notes.expensesCovered && notes.expensesCovered.length > 0 && (
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '16px', letterSpacing: '1px', color: '#F7F3E9', marginBottom: '16px' }}>EXPENSES COVERED</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {notes.expensesCovered.map((e, i) => (
                    <span key={i} style={{ padding: '8px 16px', background: 'rgba(76,175,80,0.15)', borderRadius: '20px', fontSize: '13px', color: '#4CAF50' }}>✓ {e}</span>
                  ))}
                </div>
                {notes.expensesEmail && (
                  <p style={{ marginTop: '12px', fontSize: '13px', color: 'rgba(247,243,233,0.5)' }}>Send expenses to: {notes.expensesEmail}</p>
                )}
              </div>
            )}

            {/* Previous Events */}
            {notes.previousEvents && (
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '16px', letterSpacing: '1px', color: '#F7F3E9', marginBottom: '16px' }}>PREVIOUS EVENTS WITH YOU</h3>
                <p style={{ color: 'rgba(247,243,233,0.7)', lineHeight: '1.6', padding: '16px', background: 'rgba(247,243,233,0.03)', borderRadius: '10px' }}>{notes.previousEvents}</p>
              </div>
            )}

            {/* Additional Comments */}
            {notes.additionalComments && (
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '16px', letterSpacing: '1px', color: '#F7F3E9', marginBottom: '16px' }}>ADDITIONAL COMMENTS</h3>
                <p style={{ color: 'rgba(247,243,233,0.7)', lineHeight: '1.6', padding: '16px', background: 'rgba(247,243,233,0.03)', borderRadius: '10px' }}>{notes.additionalComments}</p>
              </div>
            )}

            {/* Close Button */}
            <button onClick={() => setSelectedRequest(null)} style={{ ...styles.buttonSecondary, width: '100%' }}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  // PUBLIC SPEAKER PROFILE PAGE
  if (currentView === 'publicProfile') {
    const confirmedEvents = bookingRequests.filter(r => r.status === 'confirmed' || r.status === 'completed');
    
    return (
      <div style={{ minHeight: '100vh', background: '#0A0A0A' }}>
        {/* Header */}
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 48px', borderBottom: '1px solid rgba(247,243,233,0.08)' }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '28px', letterSpacing: '2px', color: '#F7F3E9' }}>PULPIT</div>
          <button onClick={() => setCurrentView('booking')} style={styles.button}>
            BOOK NOW
          </button>
        </nav>

        {/* Hero Section */}
        <section style={{ padding: '80px 48px', textAlign: 'center', maxWidth: '900px', margin: '0 auto' }}>
          {/* Profile Photo */}
          <div style={{ 
            width: '180px', 
            height: '180px', 
            background: 'linear-gradient(135deg, #535E4A, #3d4638)', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            margin: '0 auto 32px',
            fontSize: '64px',
            fontWeight: '600',
            color: '#F7F3E9',
            border: '4px solid rgba(247,243,233,0.1)'
          }}>
            S
          </div>
          
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '56px', letterSpacing: '3px', marginBottom: '16px', color: '#F7F3E9' }}>
            SHAQ HARDY
          </h1>
          
          <p style={{ fontSize: '18px', color: '#535E4A', marginBottom: '24px', fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '2px' }}>
            SPEAKER • BIBLE TEACHER • YOUTH PASTOR
          </p>
          
          <p style={{ fontSize: '16px', color: 'rgba(247,243,233,0.7)', marginBottom: '48px', lineHeight: '1.8', maxWidth: '700px', margin: '0 auto 48px' }}>
            Preaching the Word. Teaching the truth. Cultivating faithfulness. With a passion for foster care advocacy and youth discipleship, Shaq brings biblical teaching that transforms hearts and minds.
          </p>

          <button onClick={() => setCurrentView('booking')} style={{ ...styles.button, padding: '18px 48px', fontSize: '15px' }}>
            SUBMIT A SPEAKING REQUEST
          </button>
        </section>

        {/* Stats Section */}
        <section style={{ padding: '60px 48px', background: 'rgba(247,243,233,0.02)' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px', textAlign: 'center' }}>
            <div>
              <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '48px', color: '#535E4A', marginBottom: '8px' }}>
                {confirmedEvents.length}+
              </p>
              <p style={{ fontSize: '14px', color: 'rgba(247,243,233,0.5)', textTransform: 'uppercase', letterSpacing: '1px' }}>Events Completed</p>
            </div>
            <div>
              <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '48px', color: '#535E4A', marginBottom: '8px' }}>
                10+
              </p>
              <p style={{ fontSize: '14px', color: 'rgba(247,243,233,0.5)', textTransform: 'uppercase', letterSpacing: '1px' }}>Years Speaking</p>
            </div>
            <div>
              <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '48px', color: '#535E4A', marginBottom: '8px' }}>
                TN
              </p>
              <p style={{ fontSize: '14px', color: 'rgba(247,243,233,0.5)', textTransform: 'uppercase', letterSpacing: '1px' }}>Based In</p>
            </div>
          </div>
        </section>

        {/* Speaking Topics */}
        <section style={{ padding: '80px 48px' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '32px', letterSpacing: '2px', textAlign: 'center', marginBottom: '48px', color: '#F7F3E9' }}>
              SPEAKING TOPICS
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
              {[
                { title: 'Identity in Christ', desc: 'Understanding who you are in Jesus and living from that foundation' },
                { title: 'Anxiety & Peace', desc: 'Finding rest and trust in God amid life\'s storms' },
                { title: 'Freedom from Sin', desc: 'Breaking chains and walking in the liberty Christ offers' },
                { title: 'Foster Care & Orphan Advocacy', desc: 'The church\'s call to care for the vulnerable and fatherless' },
                { title: 'Youth Discipleship', desc: 'Equipping the next generation to follow Jesus faithfully' },
                { title: 'Biblical Manhood', desc: 'What it means to be a man after God\'s own heart' },
              ].map((topic, i) => (
                <div key={i} style={styles.card}>
                  <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '16px', letterSpacing: '1px', marginBottom: '8px', color: '#F7F3E9' }}>
                    {topic.title}
                  </h3>
                  <p style={{ fontSize: '14px', color: 'rgba(247,243,233,0.6)', lineHeight: '1.6' }}>
                    {topic.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Event Types */}
        <section style={{ padding: '80px 48px', background: 'rgba(247,243,233,0.02)' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '32px', letterSpacing: '2px', textAlign: 'center', marginBottom: '48px', color: '#F7F3E9' }}>
              EVENT TYPES
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
              {[
                'Sunday Services',
                'Youth Conferences',
                'Men\'s Retreats',
                'College Ministry',
                'Church Revivals',
                'Leadership Training',
                'Camps',
                'Chapel Services',
                'Workshops',
              ].map((type, i) => (
                <span key={i} style={{ 
                  padding: '12px 24px', 
                  background: 'rgba(83,94,74,0.15)', 
                  border: '1px solid rgba(83,94,74,0.3)',
                  borderRadius: '30px', 
                  fontSize: '14px', 
                  color: '#F7F3E9' 
                }}>
                  {type}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section style={{ padding: '100px 48px', textAlign: 'center' }}>
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '40px', letterSpacing: '2px', marginBottom: '16px', color: '#F7F3E9' }}>
              READY TO BOOK?
            </h2>
            <p style={{ fontSize: '16px', color: 'rgba(247,243,233,0.6)', marginBottom: '32px', lineHeight: '1.7' }}>
              Submit a speaking request and let's discuss how I can serve your church or organization.
            </p>
            <button onClick={() => setCurrentView('booking')} style={{ ...styles.button, padding: '18px 48px', fontSize: '15px' }}>
              SUBMIT A REQUEST
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ padding: '32px 48px', borderTop: '1px solid rgba(247,243,233,0.08)', textAlign: 'center' }}>
          <p style={{ fontSize: '13px', color: 'rgba(247,243,233,0.4)' }}>
            © {new Date().getFullYear()} Shaq Hardy • Powered by Pulpit
          </p>
        </footer>
      </div>
    );
  }

  // BOOKING FORM PAGE
  if (currentView === 'booking') {
    if (bookingSuccess) {
      return (
        <div style={{ minHeight: '100vh', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px' }}>
          <div style={{ ...styles.card, maxWidth: '500px', textAlign: 'center' }}>
            <CheckCircle size={64} color="#535E4A" style={{ marginBottom: '24px' }} />
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '32px', letterSpacing: '2px', marginBottom: '16px', color: '#F7F3E9' }}>
              REQUEST SUBMITTED!
            </h1>
            <p style={{ color: 'rgba(247,243,233,0.7)', marginBottom: '32px', lineHeight: '1.6' }}>
              Thank you for your speaking request. You will receive a response within 3-5 business days.
            </p>
            <button onClick={() => { setBookingSuccess(false); setCurrentView('landing'); }} style={styles.button}>
              BACK TO HOME
            </button>
          </div>
        </div>
      );
    }

    return (
      <div style={{ minHeight: '100vh', background: '#0A0A0A', padding: '48px 24px' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '28px', letterSpacing: '2px', marginBottom: '8px', color: '#F7F3E9' }}>PULPIT</div>
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '36px', letterSpacing: '2px', color: '#F7F3E9' }}>
              SPEAKING REQUEST FORM
            </h1>
          </div>

          {bookingError && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', padding: '12px', marginBottom: '24px', fontSize: '13px', color: '#EF4444' }}>
              {bookingError}
            </div>
          )}

          <form onSubmit={handleBookingSubmit}>
            {/* Contact Information */}
            <div style={{ ...styles.card, marginBottom: '24px' }}>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '18px', letterSpacing: '1px', marginBottom: '24px', color: '#F7F3E9' }}>CONTACT INFORMATION</h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={styles.label}>First Name *</label>
                  <input type="text" value={bookingForm.firstName} onChange={(e) => handleBookingChange('firstName', e.target.value)} style={styles.input} required />
                </div>
                <div>
                  <label style={styles.label}>Last Name *</label>
                  <input type="text" value={bookingForm.lastName} onChange={(e) => handleBookingChange('lastName', e.target.value)} style={styles.input} required />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={styles.label}>Email *</label>
                <input type="email" value={bookingForm.email} onChange={(e) => handleBookingChange('email', e.target.value)} style={styles.input} required />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={styles.label}>Phone</label>
                <input type="tel" value={bookingForm.phone} onChange={(e) => handleBookingChange('phone', e.target.value)} style={styles.input} />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={styles.label}>Church/Organization Name *</label>
                <input type="text" value={bookingForm.churchName} onChange={(e) => handleBookingChange('churchName', e.target.value)} style={styles.input} required />
              </div>

              <label style={{ ...styles.label, marginTop: '24px', marginBottom: '16px', fontSize: '13px' }}>Church/Organization Address</label>
              <div style={{ marginBottom: '16px' }}>
                <label style={styles.label}>Address</label>
                <input type="text" value={bookingForm.churchAddress} onChange={(e) => handleBookingChange('churchAddress', e.target.value)} style={styles.input} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={styles.label}>City *</label>
                  <input type="text" value={bookingForm.churchCity} onChange={(e) => handleBookingChange('churchCity', e.target.value)} style={styles.input} required />
                </div>
                <div>
                  <label style={styles.label}>State *</label>
                  <input type="text" value={bookingForm.churchState} onChange={(e) => handleBookingChange('churchState', e.target.value)} style={styles.input} required />
                </div>
                <div>
                  <label style={styles.label}>ZIP *</label>
                  <input type="text" value={bookingForm.churchZip} onChange={(e) => handleBookingChange('churchZip', e.target.value)} style={styles.input} required />
                </div>
              </div>
            </div>

            {/* Event Details */}
            <div style={{ ...styles.card, marginBottom: '24px' }}>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '18px', letterSpacing: '1px', marginBottom: '24px', color: '#F7F3E9' }}>EVENT DETAILS</h2>
              
              <label style={{ ...styles.label, marginBottom: '16px', fontSize: '13px' }}>Event Address</label>
              <div style={{ marginBottom: '16px' }}>
                <label style={styles.label}>Address</label>
                <input type="text" value={bookingForm.eventAddress} onChange={(e) => handleBookingChange('eventAddress', e.target.value)} style={styles.input} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                <div>
                  <label style={styles.label}>City *</label>
                  <input type="text" value={bookingForm.eventCity} onChange={(e) => handleBookingChange('eventCity', e.target.value)} style={styles.input} required />
                </div>
                <div>
                  <label style={styles.label}>State *</label>
                  <input type="text" value={bookingForm.eventState} onChange={(e) => handleBookingChange('eventState', e.target.value)} style={styles.input} required />
                </div>
                <div>
                  <label style={styles.label}>ZIP *</label>
                  <input type="text" value={bookingForm.eventZip} onChange={(e) => handleBookingChange('eventZip', e.target.value)} style={styles.input} required />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={styles.label}>Event Start Date *</label>
                  <input type="date" value={bookingForm.eventStartDate} onChange={(e) => handleBookingChange('eventStartDate', e.target.value)} style={styles.input} required />
                </div>
                <div>
                  <label style={styles.label}>Event End Date *</label>
                  <input type="date" value={bookingForm.eventEndDate} onChange={(e) => handleBookingChange('eventEndDate', e.target.value)} style={styles.input} required />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={styles.label}>If this event includes a Sunday, is Sunday required? *</label>
                <select value={bookingForm.sundayRequired} onChange={(e) => handleBookingChange('sundayRequired', e.target.value)} style={styles.input} required>
                  <option value="">Select an option</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                  <option value="na">N/A - No Sunday</option>
                </select>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={styles.label}>Have you done an event with Shaq before? If so, what events/when? *</label>
                <textarea value={bookingForm.previousEvents} onChange={(e) => handleBookingChange('previousEvents', e.target.value)} style={{ ...styles.input, minHeight: '80px', resize: 'vertical' }} required />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={styles.label}>Event theme/goal? *</label>
                <p style={{ fontSize: '12px', color: 'rgba(247,243,233,0.4)', marginBottom: '8px' }}>Do you already have a theme and what are you hoping to accomplish?</p>
                <textarea value={bookingForm.eventTheme} onChange={(e) => handleBookingChange('eventTheme', e.target.value)} style={{ ...styles.input, minHeight: '80px', resize: 'vertical' }} required />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={styles.label}>Event Audience *</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '8px' }}>
                  {audienceOptions.map((option) => (
                    <label key={option} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '8px', background: bookingForm.audience.includes(option) ? 'rgba(83,94,74,0.2)' : 'transparent', borderRadius: '8px' }}>
                      <input type="checkbox" checked={bookingForm.audience.includes(option)} onChange={() => handleAudienceChange(option)} style={{ accentColor: '#535E4A' }} />
                      <span style={{ fontSize: '14px', color: '#F7F3E9' }}>{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={styles.label}>Anticipated Attendance *</label>
                <p style={{ fontSize: '12px', color: 'rgba(247,243,233,0.4)', marginBottom: '8px' }}>How many people do you anticipate attending?</p>
                <input type="number" value={bookingForm.attendance} onChange={(e) => handleBookingChange('attendance', e.target.value)} style={styles.input} required />
              </div>
            </div>

            {/* Logistics */}
            <div style={{ ...styles.card, marginBottom: '24px' }}>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '18px', letterSpacing: '1px', marginBottom: '24px', color: '#F7F3E9' }}>LOGISTICS</h2>

              <div style={{ marginBottom: '16px' }}>
                <label style={styles.label}>Is the sale of merch allowed during the event? *</label>
                <select value={bookingForm.merchAllowed} onChange={(e) => handleBookingChange('merchAllowed', e.target.value)} style={styles.input} required>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                  <option value="maybe">Maybe - Let's discuss</option>
                </select>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={styles.label}>Event Attire *</label>
                <select value={bookingForm.attire} onChange={(e) => handleBookingChange('attire', e.target.value)} style={styles.input} required>
                  <option value="">Select an option</option>
                  {attireOptions.map((option) => (
                    <option key={option} value={option.toLowerCase()}>{option}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={styles.label}>Honorarium Amount *</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(247,243,233,0.5)' }}>$</span>
                  <input type="number" value={bookingForm.honorarium} onChange={(e) => handleBookingChange('honorarium', e.target.value)} style={{ ...styles.input, paddingLeft: '32px' }} placeholder="0.00" required />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={styles.label}>Expenses Covered *</label>
                <div style={{ display: 'grid', gap: '8px', marginTop: '8px' }}>
                  {expenseOptions.map((option) => (
                    <label key={option} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '8px', background: bookingForm.expensesCovered.includes(option) ? 'rgba(83,94,74,0.2)' : 'transparent', borderRadius: '8px' }}>
                      <input type="checkbox" checked={bookingForm.expensesCovered.includes(option)} onChange={() => handleExpenseChange(option)} style={{ accentColor: '#535E4A' }} />
                      <span style={{ fontSize: '14px', color: '#F7F3E9' }}>{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={styles.label}>Send expenses to (email)</label>
                <input type="email" value={bookingForm.expensesEmail} onChange={(e) => handleBookingChange('expensesEmail', e.target.value)} style={styles.input} />
              </div>

              <div>
                <label style={styles.label}>Additional Comments</label>
                <textarea value={bookingForm.additionalComments} onChange={(e) => handleBookingChange('additionalComments', e.target.value)} style={{ ...styles.input, minHeight: '100px', resize: 'vertical' }} placeholder="Anything else we should know?" />
              </div>
            </div>

            <button type="submit" disabled={bookingSubmitting} style={{ ...styles.button, width: '100%', padding: '18px', fontSize: '15px', opacity: bookingSubmitting ? 0.6 : 1 }}>
              {bookingSubmitting ? 'SUBMITTING...' : 'SUBMIT REQUEST'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <button onClick={() => setCurrentView('landing')} style={{ background: 'transparent', border: 'none', color: 'rgba(247,243,233,0.5)', cursor: 'pointer', fontSize: '13px' }}>
              ← Back to home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // LANDING PAGE
  if (currentView === 'landing') {
    return (
      <div style={{ minHeight: '100vh', background: '#0A0A0A' }}>
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 48px', borderBottom: '1px solid rgba(247,243,233,0.08)' }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '28px', letterSpacing: '2px', color: '#F7F3E9' }}>PULPIT</div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button onClick={() => setCurrentView('booking')} style={styles.buttonSecondary}>Book a Speaker</button>
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
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => { setCurrentView('auth'); setAuthMode('signup'); }} style={{ ...styles.button, padding: '18px 48px', fontSize: '15px' }}>
              CREATE YOUR FREE ACCOUNT
            </button>
            <button onClick={() => setCurrentView('booking')} style={{ ...styles.buttonSecondary, padding: '18px 48px', fontSize: '15px' }}>
              SUBMIT A REQUEST
            </button>
          </div>
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
                <input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} style={styles.input} required />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={styles.label}>Password</label>
                <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} style={styles.input} required />
              </div>
              <button type="submit" disabled={authLoading} style={{ ...styles.button, width: '100%', opacity: authLoading ? 0.6 : 1 }}>
                {authLoading ? 'LOGGING IN...' : 'LOG IN'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignup}>
              <div style={{ marginBottom: '16px' }}>
                <label style={styles.label}>Name</label>
                <input type="text" value={signupName} onChange={(e) => setSignupName(e.target.value)} style={styles.input} required />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={styles.label}>Email</label>
                <input type="email" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} style={styles.input} required />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={styles.label}>Password</label>
                <input type="password" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} style={styles.input} required />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={styles.label}>I am a...</label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  {['speaker', 'worship_leader', 'event_host'].map((type) => (
                    <button key={type} type="button" onClick={() => setSignupUserType(type)} style={{ flex: 1, padding: '12px', background: signupUserType === type ? 'rgba(83,94,74,0.3)' : 'rgba(247,243,233,0.05)', border: signupUserType === type ? '2px solid #535E4A' : '1px solid rgba(247,243,233,0.15)', borderRadius: '10px', color: '#F7F3E9', cursor: 'pointer', fontSize: '12px', textTransform: 'capitalize' }}>
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
            <button onClick={() => { setAuthMode(authMode === 'login' ? 'signup' : 'login'); setAuthError(''); }} style={{ background: 'transparent', border: 'none', color: '#535E4A', cursor: 'pointer', fontSize: '14px' }}>
              {authMode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Log in'}
            </button>
          </div>

          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <button onClick={() => setCurrentView('landing')} style={{ background: 'transparent', border: 'none', color: 'rgba(247,243,233,0.5)', cursor: 'pointer', fontSize: '13px' }}>
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
      {/* Request Detail Modal */}
      {selectedRequest && renderRequestDetail()}

      {/* Sidebar */}
      <div style={{ width: '240px', background: 'rgba(247,243,233,0.02)', borderRight: '1px solid rgba(247,243,233,0.08)', padding: '24px 16px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '24px', letterSpacing: '2px', marginBottom: '32px', paddingLeft: '12px', color: '#F7F3E9' }}>PULPIT</div>
        
        <nav style={{ flex: 1 }}>
          {navItems.map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: activeTab === item.id ? 'rgba(83,94,74,0.2)' : 'transparent', border: 'none', borderRadius: '10px', color: activeTab === item.id ? '#F7F3E9' : 'rgba(247,243,233,0.6)', cursor: 'pointer', fontSize: '14px', marginBottom: '4px', textAlign: 'left' }}>
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
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
          <button style={{ position: 'relative', background: 'transparent', border: 'none', cursor: 'pointer', padding: '8px' }}>
            <Bell size={22} color="rgba(247,243,233,0.7)" />
            {unreadNotifications > 0 && (
              <span style={{ position: 'absolute', top: '4px', right: '4px', width: '8px', height: '8px', background: '#EF4444', borderRadius: '50%' }} />
            )}
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '64px' }}>
            <p style={{ color: 'rgba(247,243,233,0.5)' }}>Loading...</p>
          </div>
        ) : (
          <>
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

                {/* Booking Link Card */}
                <div style={{ ...styles.card, marginBottom: '24px', background: 'rgba(83,94,74,0.1)', border: '1px solid rgba(83,94,74,0.3)' }}>
                  <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '16px', marginBottom: '12px', color: '#F7F3E9' }}>YOUR BOOKING LINK</h3>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <input type="text" readOnly value={`${typeof window !== 'undefined' ? window.location.origin : ''}?book=1`} style={{ ...styles.input, flex: 1, background: 'rgba(247,243,233,0.08)' }} />
                    <button onClick={() => navigator.clipboard.writeText(`${window.location.origin}?book=1`)} style={styles.button}>COPY</button>
                  </div>
                  <p style={{ fontSize: '12px', color: 'rgba(247,243,233,0.5)', marginTop: '8px' }}>Share this link with event hosts to receive booking requests</p>
                </div>

                {/* Profile Link Card */}
                <div style={{ ...styles.card, marginBottom: '24px' }}>
                  <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '16px', marginBottom: '12px', color: '#F7F3E9' }}>YOUR PUBLIC PROFILE</h3>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <input type="text" readOnly value={`${typeof window !== 'undefined' ? window.location.origin : ''}?profile=1`} style={{ ...styles.input, flex: 1, background: 'rgba(247,243,233,0.08)' }} />
                    <button onClick={() => navigator.clipboard.writeText(`${window.location.origin}?profile=1`)} style={styles.button}>COPY</button>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                    <button onClick={() => window.open(`${window.location.origin}?profile=1`, '_blank')} style={{ ...styles.buttonSecondary, fontSize: '12px', padding: '8px 16px' }}>Preview Profile →</button>
                  </div>
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
                      <div 
                        key={request.id || index} 
                        onClick={() => setSelectedRequest(request)}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'rgba(247,243,233,0.03)', borderRadius: '10px', marginBottom: '8px', cursor: 'pointer', transition: 'background 0.2s' }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(247,243,233,0.06)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(247,243,233,0.03)'}
                      >
                        <div>
                          <p style={{ fontSize: '15px', fontWeight: '500', marginBottom: '4px', color: '#F7F3E9' }}>{request.event_name}</p>
                          <p style={{ fontSize: '13px', color: 'rgba(247,243,233,0.5)' }}>{request.church_name} • {request.location}</p>
                        </div>
                        <span style={{ ...styles.badge, ...getStatusBadge(request.status) }}>
                          {request.status}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

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
                    <div 
                      key={request.id || index} 
                      onClick={() => setSelectedRequest(request)}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'rgba(247,243,233,0.03)', borderRadius: '10px', marginBottom: '8px', cursor: 'pointer', transition: 'background 0.2s' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(247,243,233,0.06)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(247,243,233,0.03)'}
                    >
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '15px', fontWeight: '500', marginBottom: '4px', color: '#F7F3E9' }}>{request.event_name}</p>
                        <p style={{ fontSize: '13px', color: 'rgba(247,243,233,0.5)', marginBottom: '4px' }}>{request.church_name} • {request.location}</p>
                        <p style={{ fontSize: '12px', color: 'rgba(247,243,233,0.4)' }}>
                          {request.event_date} • {request.attendance} expected • ${request.honorarium}
                        </p>
                      </div>
                      <span style={{ ...styles.badge, ...getStatusBadge(request.status) }}>
                        {request.status}
                      </span>
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

            {activeTab === 'calendar' && (() => {
              const year = calendarDate.getFullYear();
              const month = calendarDate.getMonth();
              const firstDay = new Date(year, month, 1).getDay();
              const daysInMonth = new Date(year, month + 1, 0).getDate();
              const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
              const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
              
              // Get events for this month
              const getEventsForDate = (day) => {
                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                return bookingRequests.filter(r => {
                  if (!r.event_date) return false;
                  return r.event_date.startsWith(dateStr);
                });
              };
              
              const days = [];
              // Empty cells for days before first day of month
              for (let i = 0; i < firstDay; i++) {
                days.push(null);
              }
              // Days of the month
              for (let i = 1; i <= daysInMonth; i++) {
                days.push(i);
              }
              
              const today = new Date();
              const isToday = (day) => {
                return day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
              };
              
              return (
                <div>
                  {/* Calendar Header */}
                  <div style={{ ...styles.card, marginBottom: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <button 
                        onClick={() => setCalendarDate(new Date(year, month - 1, 1))}
                        style={{ ...styles.buttonSecondary, padding: '10px 16px' }}
                      >
                        <ChevronLeft size={18} />
                      </button>
                      <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '24px', letterSpacing: '2px', color: '#F7F3E9' }}>
                        {monthNames[month]} {year}
                      </h2>
                      <button 
                        onClick={() => setCalendarDate(new Date(year, month + 1, 1))}
                        style={{ ...styles.buttonSecondary, padding: '10px 16px' }}
                      >
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Calendar Grid */}
                  <div style={styles.card}>
                    {/* Day Names Header */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '8px' }}>
                      {dayNames.map((day) => (
                        <div key={day} style={{ textAlign: 'center', padding: '12px 8px', fontSize: '12px', fontWeight: '600', color: 'rgba(247,243,233,0.4)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                          {day}
                        </div>
                      ))}
                    </div>
                    
                    {/* Calendar Days */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
                      {days.map((day, index) => {
                        if (day === null) {
                          return <div key={`empty-${index}`} style={{ minHeight: '100px' }} />;
                        }
                        
                        const events = getEventsForDate(day);
                        const hasConfirmed = events.some(e => e.status === 'confirmed');
                        const hasPending = events.some(e => e.status === 'pending');
                        
                        return (
                          <div 
                            key={day} 
                            style={{ 
                              minHeight: '100px', 
                              padding: '8px',
                              background: isToday(day) ? 'rgba(83,94,74,0.2)' : 'rgba(247,243,233,0.02)',
                              borderRadius: '8px',
                              border: isToday(day) ? '1px solid rgba(83,94,74,0.5)' : '1px solid rgba(247,243,233,0.05)',
                            }}
                          >
                            <div style={{ 
                              fontSize: '14px', 
                              fontWeight: isToday(day) ? '700' : '500',
                              color: isToday(day) ? '#F7F3E9' : 'rgba(247,243,233,0.6)',
                              marginBottom: '6px'
                            }}>
                              {day}
                            </div>
                            
                            {events.slice(0, 2).map((event, i) => (
                              <div 
                                key={event.id || i}
                                onClick={() => setSelectedRequest(event)}
                                style={{ 
                                  fontSize: '11px',
                                  padding: '4px 6px',
                                  marginBottom: '4px',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                  background: event.status === 'confirmed' ? 'rgba(76,175,80,0.2)' : event.status === 'pending' ? 'rgba(255,180,0,0.2)' : 'rgba(247,243,233,0.1)',
                                  color: event.status === 'confirmed' ? '#4CAF50' : event.status === 'pending' ? '#FFB400' : 'rgba(247,243,233,0.5)',
                                }}
                              >
                                {event.event_name || event.church_name}
                              </div>
                            ))}
                            
                            {events.length > 2 && (
                              <div style={{ fontSize: '10px', color: 'rgba(247,243,233,0.4)' }}>
                                +{events.length - 2} more
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Legend */}
                  <div style={{ display: 'flex', gap: '24px', marginTop: '16px', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'rgba(76,175,80,0.3)' }} />
                      <span style={{ fontSize: '12px', color: 'rgba(247,243,233,0.5)' }}>Confirmed</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'rgba(255,180,0,0.3)' }} />
                      <span style={{ fontSize: '12px', color: 'rgba(247,243,233,0.5)' }}>Pending</span>
                    </div>
                  </div>
                </div>
              );
            })()}

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
