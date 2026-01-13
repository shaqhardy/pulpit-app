'use client';

import { useState, useEffect } from 'react';
import { Calendar, MessageSquare, User, FileText, Settings, Bell, Plus, Home, Briefcase, LogOut, FolderOpen, Users, CheckCircle, X, Check, Clock, MapPin, DollarSign, Users as UsersIcon, Mail, Phone, Building, ChevronLeft, ChevronRight, Menu, Edit, Save, Upload, Send, Plane, Car, Coffee, Bed, Trash2, Mic, Music, AlertCircle, Image, Video, FileCheck, Link, Share2, Download, Eye, EyeOff, Lock, Globe, Smartphone, UserPlus, Shield, Crown, UserMinus } from 'lucide-react';

// TWO different API bases in Xano
const AUTH_API = 'https://x8ki-letl-twmt.n7.xano.io/api:fwui2Env';
const DATA_API = 'https://x8ki-letl-twmt.n7.xano.io/api:EoXk01e5';

// Mobile breakpoint
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  return isMobile;
};

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
  const [detailTab, setDetailTab] = useState('details');
  
  // Calendar state
  const [calendarDate, setCalendarDate] = useState(new Date());
  
  // Mobile state
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Profile editing state
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: '',
    tagline: '',
    bio: '',
    location: '',
    year_started: '',
  });
  const [savingProfile, setSavingProfile] = useState(false);
  
  // Messaging state
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  
  // Document upload state
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [selectedRequestForDoc, setSelectedRequestForDoc] = useState(null);
  
  // Itinerary state
  const [selectedRequestForItinerary, setSelectedRequestForItinerary] = useState(null);
  const [itineraryItems, setItineraryItems] = useState([]);
  const [newItineraryItem, setNewItineraryItem] = useState({ item_type: '', title: '', details: '', location: '', date_time: '' });
  const [editingItineraryItem, setEditingItineraryItem] = useState(null);
  const [editItineraryForm, setEditItineraryForm] = useState({ item_type: '', title: '', details: '', location: '', date_time: '' });
  
  // Notification dropdown state
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  
  // Resources state
  const [resourceCategory, setResourceCategory] = useState('all');
  const [uploadingResource, setUploadingResource] = useState(false);
  const [newResourceForm, setNewResourceForm] = useState({ name: '', category: 'media_kit', description: '', link: '' });
  const [showAddResource, setShowAddResource] = useState(false);
  
  // Team state
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteForm, setInviteForm] = useState({ email: '', name: '', role: 'viewer' });
  const [invitingMember, setInvitingMember] = useState(false);
  
  // Settings state
  const [settingsTab, setSettingsTab] = useState('notifications');
  const [notificationSettings, setNotificationSettings] = useState({
    new_requests: true,
    messages: true,
    document_signed: true,
    event_reminders: true,
    email_notifications: true,
    push_notifications: false,
  });
  const [savingSettings, setSavingSettings] = useState(false);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  
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

  // PWA Install prompt listener
  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallApp = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowInstallPrompt(false);
    }
    setDeferredPrompt(null);
  };

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
      // Load settings from localStorage
      const savedSettings = localStorage.getItem('notificationSettings');
      if (savedSettings) {
        setNotificationSettings(JSON.parse(savedSettings));
      }
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

  // Sync profile form with current user
  useEffect(() => {
    if (currentUser) {
      setProfileForm({
        name: currentUser.name || '',
        tagline: currentUser.tagline || '',
        bio: currentUser.bio || '',
        location: currentUser.location || '',
        year_started: currentUser.year_started || '',
      });
    }
  }, [currentUser]);

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      const response = await apiCall(DATA_API, `/user/${currentUser.id}`, {
        method: 'PATCH',
        body: JSON.stringify(profileForm),
      });
      setCurrentUser(prev => ({ ...prev, ...profileForm }));
      setEditingProfile(false);
    } catch (error) {
      console.error('Failed to save profile:', error);
      alert('Failed to save profile. Please try again.');
    }
    setSavingProfile(false);
  };

  // Messaging functions
  const getConversationsForRequest = (requestId) => {
    return messages.filter(m => m.booking_request_id === requestId);
  };

  const handleSendMessage = async (requestId, receiverId) => {
    if (!messageText.trim()) return;
    setSendingMessage(true);
    try {
      await apiCall(DATA_API, '/message', {
        method: 'POST',
        body: JSON.stringify({
          sender_user_id: currentUser.id,
          receiver_user_id: receiverId,
          booking_request_id: requestId,
          content: messageText,
          read: false,
        }),
      });
      setMessageText('');
      // Reload messages
      const messagesData = await apiCall(DATA_API, '/message').catch(() => []);
      setMessages(Array.isArray(messagesData) ? messagesData : []);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
    setSendingMessage(false);
  };

  // Document functions
  const handleDocumentUpload = async (requestId, docType, file, isUniversal = false) => {
    setUploadingDoc(true);
    try {
      // For now, we'll store document metadata - actual file upload would need cloud storage
      await apiCall(DATA_API, '/document', {
        method: 'POST',
        body: JSON.stringify({
          name: file.name || docType,
          document_type: docType,
          booking_request_id: isUniversal ? null : requestId,
          uploaded_by_user_id: currentUser.id,
          status: 'uploaded',
          file: file.name,
          is_universal: isUniversal,
        }),
      });
      // Reload documents
      const documentsData = await apiCall(DATA_API, '/document').catch(() => []);
      setDocuments(Array.isArray(documentsData) ? documentsData : []);
    } catch (error) {
      console.error('Failed to upload document:', error);
    }
    setUploadingDoc(false);
  };

  // Itinerary functions
  const loadItineraryForRequest = async (requestId) => {
    try {
      const items = await apiCall(DATA_API, '/itinerary_item').catch(() => []);
      const filtered = items.filter(i => i.booking_request_id === requestId);
      setItineraryItems(filtered);
    } catch (error) {
      console.error('Failed to load itinerary:', error);
      setItineraryItems([]);
    }
  };

  const handleAddItineraryItem = async (requestId) => {
    if (!newItineraryItem.title) return;
    try {
      await apiCall(DATA_API, '/itinerary_item', {
        method: 'POST',
        body: JSON.stringify({
          booking_request_id: requestId,
          item_type: newItineraryItem.item_type || 'other',
          title: newItineraryItem.title,
          details: newItineraryItem.details,
          location: newItineraryItem.location,
          date_time: newItineraryItem.date_time,
          status: 'pending',
          added_by_user_id: currentUser.id,
        }),
      });
      setNewItineraryItem({ item_type: '', title: '', details: '', location: '', date_time: '' });
      loadItineraryForRequest(requestId);
    } catch (error) {
      console.error('Failed to add itinerary item:', error);
    }
  };

  const handleEditItineraryItem = (item) => {
    setEditingItineraryItem(item.id);
    setEditItineraryForm({
      item_type: item.item_type || '',
      title: item.title || '',
      details: item.details || '',
      location: item.location || '',
      date_time: item.date_time || '',
    });
  };

  const handleSaveItineraryItem = async (itemId, requestId) => {
    try {
      await apiCall(DATA_API, `/itinerary_item/${itemId}`, {
        method: 'PATCH',
        body: JSON.stringify(editItineraryForm),
      });
      setEditingItineraryItem(null);
      setEditItineraryForm({ item_type: '', title: '', details: '', location: '', date_time: '' });
      loadItineraryForRequest(requestId);
    } catch (error) {
      console.error('Failed to update itinerary item:', error);
    }
  };

  const handleCancelEditItinerary = () => {
    setEditingItineraryItem(null);
    setEditItineraryForm({ item_type: '', title: '', details: '', location: '', date_time: '' });
  };

  const handleDeleteItineraryItem = async (itemId, requestId) => {
    try {
      await apiCall(DATA_API, `/itinerary_item/${itemId}`, { method: 'DELETE' });
      loadItineraryForRequest(requestId);
    } catch (error) {
      console.error('Failed to delete itinerary item:', error);
    }
  };

  // Resource functions
  const handleAddResource = async () => {
    if (!newResourceForm.name) return;
    setUploadingResource(true);
    try {
      await apiCall(DATA_API, '/resource', {
        method: 'POST',
        body: JSON.stringify({
          name: newResourceForm.name,
          category: newResourceForm.category,
          description: newResourceForm.description,
          link: newResourceForm.link,
          user_id: currentUser.id,
          created_at: new Date().toISOString(),
        }),
      });
      setNewResourceForm({ name: '', category: 'media_kit', description: '', link: '' });
      setShowAddResource(false);
      const resourcesData = await apiCall(DATA_API, '/resource').catch(() => []);
      setResources(Array.isArray(resourcesData) ? resourcesData : []);
    } catch (error) {
      console.error('Failed to add resource:', error);
    }
    setUploadingResource(false);
  };

  const handleDeleteResource = async (resourceId) => {
    try {
      await apiCall(DATA_API, `/resource/${resourceId}`, { method: 'DELETE' });
      const resourcesData = await apiCall(DATA_API, '/resource').catch(() => []);
      setResources(Array.isArray(resourcesData) ? resourcesData : []);
    } catch (error) {
      console.error('Failed to delete resource:', error);
    }
  };

  // Team functions
  const handleInviteTeamMember = async () => {
    if (!inviteForm.email || !inviteForm.name) return;
    setInvitingMember(true);
    try {
      await apiCall(DATA_API, '/team_member', {
        method: 'POST',
        body: JSON.stringify({
          email: inviteForm.email,
          name: inviteForm.name,
          role: inviteForm.role,
          user_id: currentUser.id,
          status: 'pending',
          invited_at: new Date().toISOString(),
        }),
      });
      setInviteForm({ email: '', name: '', role: 'viewer' });
      setShowInviteModal(false);
      const teamData = await apiCall(DATA_API, '/team_member').catch(() => []);
      setTeamMembers(Array.isArray(teamData) ? teamData : []);
    } catch (error) {
      console.error('Failed to invite team member:', error);
    }
    setInvitingMember(false);
  };

  const handleRemoveTeamMember = async (memberId) => {
    try {
      await apiCall(DATA_API, `/team_member/${memberId}`, { method: 'DELETE' });
      const teamData = await apiCall(DATA_API, '/team_member').catch(() => []);
      setTeamMembers(Array.isArray(teamData) ? teamData : []);
    } catch (error) {
      console.error('Failed to remove team member:', error);
    }
  };

  const handleUpdateTeamRole = async (memberId, newRole) => {
    try {
      await apiCall(DATA_API, `/team_member/${memberId}`, {
        method: 'PATCH',
        body: JSON.stringify({ role: newRole }),
      });
      const teamData = await apiCall(DATA_API, '/team_member').catch(() => []);
      setTeamMembers(Array.isArray(teamData) ? teamData : []);
    } catch (error) {
      console.error('Failed to update team member role:', error);
    }
  };

  // Notification functions
  const handleMarkNotificationRead = async (notificationId) => {
    try {
      await apiCall(DATA_API, `/notification/${notificationId}`, {
        method: 'PATCH',
        body: JSON.stringify({ read: true }),
      });
      setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, read: true } : n));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleMarkAllNotificationsRead = async () => {
    try {
      await Promise.all(
        notifications.filter(n => !n.read).map(n =>
          apiCall(DATA_API, `/notification/${n.id}`, {
            method: 'PATCH',
            body: JSON.stringify({ read: true }),
          })
        )
      );
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  // Settings functions
  const handleSaveNotificationSettings = async () => {
    setSavingSettings(true);
    try {
      localStorage.setItem('notificationSettings', JSON.stringify(notificationSettings));
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
    setSavingSettings(false);
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
        speaker_user_id: 2,
        event_name: bookingForm.churchName,
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

  // Itinerary item type options with icons
  const itineraryTypeOptions = [
    { value: 'flight', label: 'Flight', icon: Plane },
    { value: 'hotel', label: 'Hotel', icon: Bed },
    { value: 'transport', label: 'Ground Transport', icon: Car },
    { value: 'meal', label: 'Meal', icon: Coffee },
    { value: 'session', label: 'Session', icon: Calendar },
    { value: 'rehearsal', label: 'Rehearsal', icon: Music },
    { value: 'mic_check', label: 'Mic Check', icon: Mic },
    { value: 'call_time', label: 'Call Time', icon: AlertCircle },
    { value: 'other', label: 'Other', icon: Clock },
  ];

  const getItineraryIcon = (itemType) => {
    const found = itineraryTypeOptions.find(t => t.value === itemType);
    return found ? found.icon : Clock;
  };

  // Resource categories
  const resourceCategories = [
    { value: 'media_kit', label: 'Media Kit', icon: FolderOpen },
    { value: 'one_sheet', label: 'One-Sheet', icon: FileCheck },
    { value: 'promo_photos', label: 'Promo Photos', icon: Image },
    { value: 'videos', label: 'Videos', icon: Video },
    { value: 'bio', label: 'Bio', icon: FileText },
    { value: 'other', label: 'Other', icon: Link },
  ];

  // Team roles
  const teamRoles = [
    { value: 'admin', label: 'Admin', icon: Crown, description: 'Full access to all features' },
    { value: 'manager', label: 'Manager', icon: Shield, description: 'Can manage bookings and messages' },
    { value: 'viewer', label: 'Viewer', icon: Eye, description: 'Can only view information' },
  ];

  const getResourceIcon = (category) => {
    const found = resourceCategories.find(c => c.value === category);
    return found ? found.icon : FileText;
  };

  const getRoleIcon = (role) => {
    const found = teamRoles.find(r => r.value === role);
    return found ? found.icon : Eye;
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'booking_request': return Briefcase;
      case 'message': return MessageSquare;
      case 'document': return FileText;
      case 'reminder': return Clock;
      default: return Bell;
    }
  };

  // Filter resources by category
  const filteredResources = resourceCategory === 'all' 
    ? resources 
    : resources.filter(r => r.category === resourceCategory);

  const getStatusBadge = (status) => {
    const statusStyles = {
      pending: { background: 'rgba(255,180,0,0.15)', color: '#FFB400' },
      confirmed: { background: 'rgba(76,175,80,0.15)', color: '#4CAF50' },
      declined: { background: 'rgba(239,68,68,0.15)', color: '#EF4444' },
      completed: { background: 'rgba(107,138,229,0.15)', color: '#6B8AE5' },
    };
    return statusStyles[status] || { background: 'rgba(247,243,233,0.1)', color: 'rgba(247,243,233,0.5)' };
  };

  // Get universal documents (no booking_request_id or is_universal = true)
  const universalDocs = documents.filter(d => !d.booking_request_id || d.is_universal);
  
  // Get event-specific documents grouped by request
  const getEventDocs = () => {
    const eventDocs = documents.filter(d => d.booking_request_id && !d.is_universal);
    const grouped = {};
    eventDocs.forEach(doc => {
      const request = bookingRequests.find(r => r.id === doc.booking_request_id);
      const eventName = request?.event_name || request?.church_name || `Event #${doc.booking_request_id}`;
      if (!grouped[doc.booking_request_id]) {
        grouped[doc.booking_request_id] = { eventName, docs: [] };
      }
      grouped[doc.booking_request_id].docs.push(doc);
    });
    return grouped;
  };

  // REQUEST DETAIL VIEW
  const renderRequestDetail = () => {
    if (!selectedRequest) return null;
    
    const notes = parseNotes(selectedRequest.notes);
    const contact = notes.contact || {};
    const churchAddress = notes.churchAddress || {};
    const eventAddress = notes.eventAddress || {};
    const requestMessages = messages.filter(m => m.booking_request_id === selectedRequest.id);
    const requestDocs = documents.filter(d => d.booking_request_id === selectedRequest.id);
    
    return (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, overflow: 'auto' }}>
        <div style={{ maxWidth: '900px', margin: '40px auto', padding: '0 20px' }}>
          <div style={{ ...styles.card, background: '#0A0A0A' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '24px' }}>
              <div>
                <button onClick={() => { setSelectedRequest(null); setDetailTab('details'); }} style={{ background: 'transparent', border: 'none', color: 'rgba(247,243,233,0.5)', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <ChevronLeft size={18} /> Back to Requests
                </button>
                <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: isMobile ? '22px' : '28px', letterSpacing: '2px', color: '#F7F3E9', marginBottom: '8px' }}>
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

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '1px solid rgba(247,243,233,0.1)', paddingBottom: '16px', overflowX: 'auto' }}>
              {[
                { id: 'details', label: 'Details', icon: FileText },
                { id: 'messages', label: 'Messages', icon: MessageSquare, count: requestMessages.length },
                { id: 'documents', label: 'Documents', icon: FolderOpen, count: requestDocs.length },
                { id: 'itinerary', label: 'Itinerary', icon: Plane },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => { setDetailTab(tab.id); if (tab.id === 'itinerary') loadItineraryForRequest(selectedRequest.id); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 16px',
                    background: detailTab === tab.id ? 'rgba(83,94,74,0.3)' : 'transparent',
                    border: detailTab === tab.id ? '1px solid rgba(83,94,74,0.5)' : '1px solid transparent',
                    borderRadius: '8px',
                    color: detailTab === tab.id ? '#F7F3E9' : 'rgba(247,243,233,0.5)',
                    cursor: 'pointer',
                    fontSize: '13px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <tab.icon size={16} />
                  {tab.label}
                  {tab.count > 0 && (
                    <span style={{ background: 'rgba(83,94,74,0.5)', padding: '2px 6px', borderRadius: '10px', fontSize: '11px' }}>{tab.count}</span>
                  )}
                </button>
              ))}
            </div>

            {/* Details Tab */}
            {detailTab === 'details' && (
              <>
                {/* Action Buttons */}
                {selectedRequest.status === 'pending' && (
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', padding: '20px', background: 'rgba(247,243,233,0.03)', borderRadius: '12px', flexWrap: 'wrap' }}>
                    <button onClick={() => handleStatusUpdate(selectedRequest.id, 'confirmed')} disabled={updatingStatus} style={{ ...styles.buttonSuccess, display: 'flex', alignItems: 'center', gap: '8px', opacity: updatingStatus ? 0.6 : 1 }}>
                      <Check size={16} /> ACCEPT REQUEST
                    </button>
                    <button onClick={() => handleStatusUpdate(selectedRequest.id, 'declined')} disabled={updatingStatus} style={{ ...styles.buttonDanger, display: 'flex', alignItems: 'center', gap: '8px', opacity: updatingStatus ? 0.6 : 1 }}>
                      <X size={16} /> DECLINE
                    </button>
                  </div>
                )}

                {selectedRequest.status === 'confirmed' && (
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', padding: '20px', background: 'rgba(76,175,80,0.1)', borderRadius: '12px', border: '1px solid rgba(76,175,80,0.2)', flexWrap: 'wrap', alignItems: 'center' }}>
                    <CheckCircle size={20} color="#4CAF50" />
                    <div style={{ flex: 1 }}>
                      <p style={{ color: '#4CAF50', fontWeight: '600', marginBottom: '4px' }}>Request Confirmed</p>
                      <p style={{ color: 'rgba(247,243,233,0.5)', fontSize: '13px' }}>You've accepted this speaking engagement</p>
                    </div>
                    <button onClick={() => handleStatusUpdate(selectedRequest.id, 'completed')} disabled={updatingStatus} style={styles.buttonSecondary}>Mark Complete</button>
                  </div>
                )}

                {/* Contact Information */}
                <div style={{ marginBottom: '32px' }}>
                  <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '16px', letterSpacing: '1px', color: '#F7F3E9', marginBottom: '16px' }}>CONTACT INFORMATION</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px' }}>
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
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: 'rgba(247,243,233,0.03)', borderRadius: '10px' }}>
                      <Calendar size={18} color="rgba(247,243,233,0.5)" />
                      <div>
                        <p style={{ fontSize: '12px', color: 'rgba(247,243,233,0.4)' }}>Date</p>
                        <p style={{ color: '#F7F3E9' }}>{selectedRequest.event_date ? new Date(selectedRequest.event_date).toLocaleDateString() : 'TBD'}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: 'rgba(247,243,233,0.03)', borderRadius: '10px' }}>
                      <MapPin size={18} color="rgba(247,243,233,0.5)" />
                      <div>
                        <p style={{ fontSize: '12px', color: 'rgba(247,243,233,0.4)' }}>Location</p>
                        <p style={{ color: '#F7F3E9' }}>{selectedRequest.location || 'Not specified'}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: 'rgba(247,243,233,0.03)', borderRadius: '10px' }}>
                      <UsersIcon size={18} color="rgba(247,243,233,0.5)" />
                      <div>
                        <p style={{ fontSize: '12px', color: 'rgba(247,243,233,0.4)' }}>Attendance</p>
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

                {/* Logistics */}
                <div style={{ marginBottom: '32px' }}>
                  <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '16px', letterSpacing: '1px', color: '#F7F3E9', marginBottom: '16px' }}>LOGISTICS</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap: '16px' }}>
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
                  </div>
                )}

                {/* Additional Comments */}
                {notes.additionalComments && (
                  <div style={{ marginBottom: '32px' }}>
                    <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '16px', letterSpacing: '1px', color: '#F7F3E9', marginBottom: '16px' }}>ADDITIONAL COMMENTS</h3>
                    <p style={{ color: 'rgba(247,243,233,0.7)', lineHeight: '1.6', padding: '16px', background: 'rgba(247,243,233,0.03)', borderRadius: '10px' }}>{notes.additionalComments}</p>
                  </div>
                )}
              </>
            )}

            {/* Messages Tab */}
            {detailTab === 'messages' && (
              <div>
                <div style={{ background: 'rgba(247,243,233,0.03)', borderRadius: '12px', padding: '16px', marginBottom: '16px', maxHeight: '400px', overflowY: 'auto' }}>
                  {requestMessages.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '48px' }}>
                      <MessageSquare size={32} color="rgba(247,243,233,0.2)" style={{ marginBottom: '12px' }} />
                      <p style={{ color: 'rgba(247,243,233,0.5)' }}>No messages yet</p>
                      <p style={{ color: 'rgba(247,243,233,0.3)', fontSize: '13px', marginTop: '8px' }}>Start a conversation with the event host</p>
                    </div>
                  ) : (
                    requestMessages.map((msg, i) => (
                      <div key={msg.id || i} style={{ marginBottom: '16px', display: 'flex', flexDirection: msg.sender_user_id === currentUser?.id ? 'row-reverse' : 'row', gap: '12px' }}>
                        <div style={{ width: '36px', height: '36px', background: msg.sender_user_id === currentUser?.id ? '#535E4A' : 'rgba(247,243,233,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', color: '#F7F3E9', flexShrink: 0 }}>
                          {msg.sender_user_id === currentUser?.id ? 'Y' : 'H'}
                        </div>
                        <div style={{ maxWidth: '70%', padding: '12px 16px', background: msg.sender_user_id === currentUser?.id ? 'rgba(83,94,74,0.3)' : 'rgba(247,243,233,0.08)', borderRadius: '12px' }}>
                          <p style={{ color: '#F7F3E9', fontSize: '14px', lineHeight: '1.5' }}>{msg.content}</p>
                          <p style={{ color: 'rgba(247,243,233,0.3)', fontSize: '11px', marginTop: '6px' }}>{new Date(msg.created_at).toLocaleString()}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                {/* Message Input */}
                <div style={{ display: 'flex', gap: '12px' }}>
                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type a message..."
                    style={{ ...styles.input, flex: 1 }}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(selectedRequest.id, selectedRequest.host_user_id || 1)}
                  />
                  <button
                    onClick={() => handleSendMessage(selectedRequest.id, selectedRequest.host_user_id || 1)}
                    disabled={sendingMessage || !messageText.trim()}
                    style={{ ...styles.button, padding: '14px 20px', opacity: sendingMessage || !messageText.trim() ? 0.5 : 1 }}
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* Documents Tab */}
            {detailTab === 'documents' && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                  {['Contract', 'W9', 'Rider', 'Other'].map((docType) => {
                    const existingDoc = requestDocs.find(d => d.document_type === docType.toLowerCase());
                    return (
                      <div key={docType} style={{ padding: '20px', background: 'rgba(247,243,233,0.03)', borderRadius: '12px', border: existingDoc ? '1px solid rgba(76,175,80,0.3)' : '1px solid rgba(247,243,233,0.08)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                          <h4 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '14px', letterSpacing: '1px', color: '#F7F3E9' }}>{docType}</h4>
                          {existingDoc && <CheckCircle size={16} color="#4CAF50" />}
                        </div>
                        {existingDoc ? (
                          <div>
                            <p style={{ color: 'rgba(247,243,233,0.7)', fontSize: '13px', marginBottom: '8px' }}>{existingDoc.name}</p>
                            <p style={{ color: 'rgba(247,243,233,0.4)', fontSize: '11px' }}>Uploaded {new Date(existingDoc.created_at).toLocaleDateString()}</p>
                          </div>
                        ) : (
                          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: 'rgba(247,243,233,0.05)', borderRadius: '8px', cursor: 'pointer', color: 'rgba(247,243,233,0.5)', fontSize: '13px' }}>
                            <Upload size={16} />
                            Upload {docType}
                            <input
                              type="file"
                              style={{ display: 'none' }}
                              onChange={(e) => {
                                if (e.target.files[0]) {
                                  handleDocumentUpload(selectedRequest.id, docType.toLowerCase(), e.target.files[0]);
                                }
                              }}
                            />
                          </label>
                        )}
                      </div>
                    );
                  })}
                </div>

                {requestDocs.length > 0 && (
                  <div>
                    <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '16px', letterSpacing: '1px', color: '#F7F3E9', marginBottom: '16px' }}>ALL DOCUMENTS</h3>
                    {requestDocs.map((doc, i) => (
                      <div key={doc.id || i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'rgba(247,243,233,0.03)', borderRadius: '8px', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <FileText size={18} color="rgba(247,243,233,0.5)" />
                          <div>
                            <p style={{ color: '#F7F3E9', fontSize: '14px' }}>{doc.name}</p>
                            <p style={{ color: 'rgba(247,243,233,0.4)', fontSize: '11px', textTransform: 'capitalize' }}>{doc.document_type}</p>
                          </div>
                        </div>
                        <span style={{ ...styles.badge, background: doc.status === 'signed' ? 'rgba(76,175,80,0.15)' : 'rgba(255,180,0,0.15)', color: doc.status === 'signed' ? '#4CAF50' : '#FFB400' }}>
                          {doc.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Itinerary Tab */}
            {detailTab === 'itinerary' && (
              <div>
                {/* Add Itinerary Item */}
                <div style={{ background: 'rgba(247,243,233,0.03)', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
                  <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '14px', letterSpacing: '1px', color: '#F7F3E9', marginBottom: '16px' }}>ADD ITINERARY ITEM</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                    <select value={newItineraryItem.item_type} onChange={(e) => setNewItineraryItem(prev => ({ ...prev, item_type: e.target.value }))} style={styles.input}>
                      <option value="">Type</option>
                      {itineraryTypeOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    <input type="text" placeholder="Title" value={newItineraryItem.title} onChange={(e) => setNewItineraryItem(prev => ({ ...prev, title: e.target.value }))} style={styles.input} />
                    <input type="datetime-local" value={newItineraryItem.date_time} onChange={(e) => setNewItineraryItem(prev => ({ ...prev, date_time: e.target.value }))} style={styles.input} />
                    <input type="text" placeholder="Location" value={newItineraryItem.location} onChange={(e) => setNewItineraryItem(prev => ({ ...prev, location: e.target.value }))} style={styles.input} />
                  </div>
                  <input type="text" placeholder="Details (optional)" value={newItineraryItem.details} onChange={(e) => setNewItineraryItem(prev => ({ ...prev, details: e.target.value }))} style={{ ...styles.input, marginBottom: '12px' }} />
                  <button onClick={() => handleAddItineraryItem(selectedRequest.id)} disabled={!newItineraryItem.title} style={{ ...styles.button, opacity: newItineraryItem.title ? 1 : 0.5 }}>
                    <Plus size={16} style={{ marginRight: '8px' }} /> ADD ITEM
                  </button>
                </div>

                {/* Itinerary List */}
                {itineraryItems.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '48px', background: 'rgba(247,243,233,0.03)', borderRadius: '12px' }}>
                    <Plane size={32} color="rgba(247,243,233,0.2)" style={{ marginBottom: '12px' }} />
                    <p style={{ color: 'rgba(247,243,233,0.5)' }}>No itinerary items yet</p>
                    <p style={{ color: 'rgba(247,243,233,0.3)', fontSize: '13px', marginTop: '8px' }}>Add flights, hotels, sessions, and more</p>
                  </div>
                ) : (
                  <div>
                    {itineraryItems.sort((a, b) => new Date(a.date_time) - new Date(b.date_time)).map((item, i) => {
                      const ItemIcon = getItineraryIcon(item.item_type);
                      const isEditing = editingItineraryItem === item.id;
                      
                      if (isEditing) {
                        return (
                          <div key={item.id || i} style={{ padding: '16px', background: 'rgba(83,94,74,0.1)', borderRadius: '10px', marginBottom: '8px', border: '1px solid rgba(83,94,74,0.3)' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                              <select value={editItineraryForm.item_type} onChange={(e) => setEditItineraryForm(prev => ({ ...prev, item_type: e.target.value }))} style={styles.input}>
                                <option value="">Type</option>
                                {itineraryTypeOptions.map(opt => (
                                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                              </select>
                              <input type="text" placeholder="Title" value={editItineraryForm.title} onChange={(e) => setEditItineraryForm(prev => ({ ...prev, title: e.target.value }))} style={styles.input} />
                              <input type="datetime-local" value={editItineraryForm.date_time} onChange={(e) => setEditItineraryForm(prev => ({ ...prev, date_time: e.target.value }))} style={styles.input} />
                              <input type="text" placeholder="Location" value={editItineraryForm.location} onChange={(e) => setEditItineraryForm(prev => ({ ...prev, location: e.target.value }))} style={styles.input} />
                            </div>
                            <input type="text" placeholder="Details (optional)" value={editItineraryForm.details} onChange={(e) => setEditItineraryForm(prev => ({ ...prev, details: e.target.value }))} style={{ ...styles.input, marginBottom: '12px' }} />
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button onClick={() => handleSaveItineraryItem(item.id, selectedRequest.id)} style={{ ...styles.button, padding: '10px 16px' }}>
                                <Save size={14} style={{ marginRight: '6px' }} /> Save
                              </button>
                              <button onClick={handleCancelEditItinerary} style={{ ...styles.buttonSecondary, padding: '10px 16px' }}>
                                Cancel
                              </button>
                            </div>
                          </div>
                        );
                      }
                      
                      return (
                        <div key={item.id || i} style={{ display: 'flex', gap: '16px', padding: '16px', background: 'rgba(247,243,233,0.03)', borderRadius: '10px', marginBottom: '8px', alignItems: 'flex-start' }}>
                          <div style={{ width: '40px', height: '40px', background: 'rgba(83,94,74,0.2)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <ItemIcon size={18} color="#535E4A" />
                          </div>
                          <div style={{ flex: 1 }}>
                            <p style={{ color: '#F7F3E9', fontWeight: '500', marginBottom: '4px' }}>{item.title}</p>
                            {item.date_time && <p style={{ color: 'rgba(247,243,233,0.5)', fontSize: '13px', marginBottom: '4px' }}>{new Date(item.date_time).toLocaleString()}</p>}
                            {item.location && <p style={{ color: 'rgba(247,243,233,0.4)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={12} /> {item.location}</p>}
                            {item.details && <p style={{ color: 'rgba(247,243,233,0.4)', fontSize: '13px', marginTop: '8px' }}>{item.details}</p>}
                          </div>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button onClick={() => handleEditItineraryItem(item)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'rgba(247,243,233,0.4)', padding: '4px' }}>
                              <Edit size={16} />
                            </button>
                            <button onClick={() => handleDeleteItineraryItem(item.id, selectedRequest.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'rgba(247,243,233,0.3)', padding: '4px' }}>
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Close Button */}
            <button onClick={() => { setSelectedRequest(null); setDetailTab('details'); }} style={{ ...styles.buttonSecondary, width: '100%', marginTop: '24px' }}>
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
    const yearsPreaching = currentUser?.year_started ? new Date().getFullYear() - parseInt(currentUser.year_started) : null;
    const displayLocation = currentUser?.location?.split(',')[0] || 'US';
    
    return (
      <div style={{ minHeight: '100vh', background: '#0A0A0A' }}>
        {/* Header */}
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: isMobile ? '16px 20px' : '24px 48px', borderBottom: '1px solid rgba(247,243,233,0.08)' }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: isMobile ? '24px' : '28px', letterSpacing: '2px', color: '#F7F3E9' }}>PULPIT</div>
          <button onClick={() => setCurrentView('booking')} style={{ ...styles.button, padding: isMobile ? '10px 20px' : '14px 28px', fontSize: isMobile ? '12px' : '13px' }}>
            BOOK NOW
          </button>
        </nav>

        {/* Hero Section */}
        <section style={{ padding: isMobile ? '48px 20px' : '80px 48px', textAlign: 'center', maxWidth: '900px', margin: '0 auto' }}>
          {/* Profile Photo */}
          <div style={{ 
            width: isMobile ? '140px' : '180px', 
            height: isMobile ? '140px' : '180px', 
            background: 'linear-gradient(135deg, #535E4A, #3d4638)', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            margin: '0 auto 32px',
            fontSize: isMobile ? '48px' : '64px',
            fontWeight: '600',
            color: '#F7F3E9',
          }}>
            {currentUser?.name?.charAt(0) || 'S'}
          </div>

          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: isMobile ? '32px' : '48px', letterSpacing: '3px', marginBottom: '16px', color: '#F7F3E9' }}>
            {currentUser?.name || 'Speaker Name'}
          </h1>
          
          {currentUser?.tagline && (
            <p style={{ fontSize: isMobile ? '16px' : '20px', color: 'rgba(247,243,233,0.7)', marginBottom: '24px', fontStyle: 'italic' }}>
              {currentUser.tagline}
            </p>
          )}
          
          {currentUser?.bio && (
            <p style={{ fontSize: isMobile ? '14px' : '16px', color: 'rgba(247,243,233,0.6)', maxWidth: '700px', margin: '0 auto 48px', lineHeight: '1.8' }}>
              {currentUser.bio}
            </p>
          )}

          {/* Stats */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: isMobile ? '32px' : '64px', flexWrap: 'wrap' }}>
            {yearsPreaching && (
              <div>
                <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: isMobile ? '32px' : '48px', color: '#535E4A', marginBottom: '8px' }}>
                  {yearsPreaching}+
                </p>
                <p style={{ fontSize: isMobile ? '11px' : '14px', color: 'rgba(247,243,233,0.5)', textTransform: 'uppercase', letterSpacing: '1px' }}>Years Speaking</p>
              </div>
            )}
            <div>
              <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: isMobile ? '32px' : '48px', color: '#535E4A', marginBottom: '8px' }}>
                {confirmedEvents.length}
              </p>
              <p style={{ fontSize: isMobile ? '11px' : '14px', color: 'rgba(247,243,233,0.5)', textTransform: 'uppercase', letterSpacing: '1px' }}>Events</p>
            </div>
            <div>
              <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: isMobile ? '32px' : '48px', color: '#535E4A', marginBottom: '8px' }}>
                {displayLocation}
              </p>
              <p style={{ fontSize: isMobile ? '11px' : '14px', color: 'rgba(247,243,233,0.5)', textTransform: 'uppercase', letterSpacing: '1px' }}>Based In</p>
            </div>
          </div>
        </section>

        {/* Speaking Topics */}
        <section style={{ padding: isMobile ? '48px 20px' : '80px 48px' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: isMobile ? '24px' : '32px', letterSpacing: '2px', textAlign: 'center', marginBottom: isMobile ? '32px' : '48px', color: '#F7F3E9' }}>
              SPEAKING TOPICS
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(250px, 1fr))', gap: isMobile ? '16px' : '24px' }}>
              {[
                { title: 'Identity in Christ', desc: 'Understanding who you are in Jesus and living from that foundation' },
                { title: 'Anxiety & Peace', desc: 'Finding rest and trust in God amid life\'s storms' },
                { title: 'Freedom from Sin', desc: 'Breaking chains and walking in the liberty Christ offers' },
                { title: 'Foster Care & Orphan Advocacy', desc: 'The church\'s call to care for the vulnerable and fatherless' },
                { title: 'Youth Discipleship', desc: 'Equipping the next generation to follow Jesus faithfully' },
                { title: 'Biblical Manhood', desc: 'What it means to be a man after God\'s own heart' },
              ].map((topic, i) => (
                <div key={i} style={{ ...styles.card, padding: isMobile ? '20px' : '24px' }}>
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
        <section style={{ padding: isMobile ? '48px 20px' : '80px 48px', background: 'rgba(247,243,233,0.02)' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: isMobile ? '24px' : '32px', letterSpacing: '2px', textAlign: 'center', marginBottom: isMobile ? '32px' : '48px', color: '#F7F3E9' }}>
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
                  padding: isMobile ? '10px 18px' : '12px 24px', 
                  background: 'rgba(83,94,74,0.15)', 
                  border: '1px solid rgba(83,94,74,0.3)',
                  borderRadius: '30px', 
                  fontSize: isMobile ? '12px' : '14px', 
                  color: '#F7F3E9' 
                }}>
                  {type}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section style={{ padding: isMobile ? '60px 20px' : '100px 48px', textAlign: 'center' }}>
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: isMobile ? '28px' : '40px', letterSpacing: '2px', marginBottom: '16px', color: '#F7F3E9' }}>
              READY TO BOOK?
            </h2>
            <p style={{ fontSize: isMobile ? '14px' : '16px', color: 'rgba(247,243,233,0.6)', marginBottom: '32px', lineHeight: '1.7' }}>
              Submit a speaking request and let's discuss how I can serve your church or organization.
            </p>
            <button onClick={() => setCurrentView('booking')} style={{ ...styles.button, padding: isMobile ? '16px 32px' : '18px 48px', fontSize: isMobile ? '13px' : '15px' }}>
              SUBMIT A REQUEST
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ padding: isMobile ? '24px 20px' : '32px 48px', borderTop: '1px solid rgba(247,243,233,0.08)', textAlign: 'center' }}>
          <p style={{ fontSize: '13px', color: 'rgba(247,243,233,0.4)' }}>
            © {new Date().getFullYear()} {currentUser?.name || 'Speaker'} • Powered by Pulpit
          </p>
        </footer>
      </div>
    );
  }

  // BOOKING FORM PAGE
  if (currentView === 'booking') {
    if (bookingSuccess) {
      return (
        <div style={{ minHeight: '100vh', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: isMobile ? '24px' : '48px' }}>
          <div style={{ ...styles.card, maxWidth: '500px', textAlign: 'center' }}>
            <CheckCircle size={isMobile ? 48 : 64} color="#535E4A" style={{ marginBottom: '24px' }} />
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: isMobile ? '24px' : '32px', letterSpacing: '2px', marginBottom: '16px', color: '#F7F3E9' }}>
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
      <div style={{ minHeight: '100vh', background: '#0A0A0A', padding: isMobile ? '24px 16px' : '48px 24px' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: isMobile ? '32px' : '48px' }}>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: isMobile ? '24px' : '28px', letterSpacing: '2px', marginBottom: '8px', color: '#F7F3E9' }}>PULPIT</div>
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: isMobile ? '24px' : '36px', letterSpacing: '2px', color: '#F7F3E9' }}>
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
            <div style={{ ...styles.card, marginBottom: '24px', padding: isMobile ? '20px' : '24px' }}>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '18px', letterSpacing: '1px', marginBottom: '24px', color: '#F7F3E9' }}>CONTACT INFORMATION</h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
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
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr 1fr', gap: '16px' }}>
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
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr 1fr', gap: '16px', marginBottom: '24px' }}>
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

              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
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
                <label style={styles.label}>Will you allow merchandise (books, etc.) to be sold? *</label>
                <select value={bookingForm.merchAllowed} onChange={(e) => handleBookingChange('merchAllowed', e.target.value)} style={styles.input} required>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={styles.label}>Attire *</label>
                <select value={bookingForm.attire} onChange={(e) => handleBookingChange('attire', e.target.value)} style={styles.input} required>
                  <option value="">Select attire</option>
                  {attireOptions.map((option) => (
                    <option key={option} value={option.toLowerCase()}>{option}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Compensation */}
            <div style={{ ...styles.card, marginBottom: '24px' }}>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '18px', letterSpacing: '1px', marginBottom: '24px', color: '#F7F3E9' }}>COMPENSATION</h2>

              <div style={{ marginBottom: '16px' }}>
                <label style={styles.label}>Honorarium Amount *</label>
                <p style={{ fontSize: '12px', color: 'rgba(247,243,233,0.4)', marginBottom: '8px' }}>What is the total honorarium you are offering?</p>
                <input type="number" value={bookingForm.honorarium} onChange={(e) => handleBookingChange('honorarium', e.target.value)} style={styles.input} placeholder="$" required />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={styles.label}>Will you cover any of the following expenses?</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                  {expenseOptions.map((option) => (
                    <label key={option} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '8px', background: bookingForm.expensesCovered.includes(option) ? 'rgba(83,94,74,0.2)' : 'transparent', borderRadius: '8px' }}>
                      <input type="checkbox" checked={bookingForm.expensesCovered.includes(option)} onChange={() => handleExpenseChange(option)} style={{ accentColor: '#535E4A' }} />
                      <span style={{ fontSize: '14px', color: '#F7F3E9' }}>{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {bookingForm.expensesCovered.length > 0 && (
                <div style={{ marginBottom: '16px' }}>
                  <label style={styles.label}>Email for expense receipts</label>
                  <input type="email" value={bookingForm.expensesEmail} onChange={(e) => handleBookingChange('expensesEmail', e.target.value)} style={styles.input} placeholder="accounting@church.org" />
                </div>
              )}
            </div>

            {/* Additional Comments */}
            <div style={{ ...styles.card, marginBottom: '24px' }}>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '18px', letterSpacing: '1px', marginBottom: '24px', color: '#F7F3E9' }}>ADDITIONAL COMMENTS</h2>
              <textarea value={bookingForm.additionalComments} onChange={(e) => handleBookingChange('additionalComments', e.target.value)} style={{ ...styles.input, minHeight: '120px', resize: 'vertical' }} placeholder="Anything else you'd like us to know..." />
            </div>

            <button type="submit" disabled={bookingSubmitting} style={{ ...styles.button, width: '100%', padding: '18px', opacity: bookingSubmitting ? 0.6 : 1 }}>
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
        {/* Header */}
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: isMobile ? '16px 20px' : '24px 48px' }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: isMobile ? '24px' : '28px', letterSpacing: '2px', color: '#F7F3E9' }}>PULPIT</div>
          <button onClick={() => setCurrentView('auth')} style={styles.button}>
            LOG IN
          </button>
        </nav>

        {/* Hero */}
        <section style={{ padding: isMobile ? '60px 20px' : '120px 48px', textAlign: 'center' }}>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: isMobile ? '36px' : '64px', letterSpacing: '3px', marginBottom: '24px', color: '#F7F3E9', lineHeight: '1.1' }}>
            MANAGE YOUR<br />SPEAKING MINISTRY
          </h1>
          <p style={{ fontSize: isMobile ? '16px' : '20px', color: 'rgba(247,243,233,0.6)', maxWidth: '600px', margin: '0 auto 48px', lineHeight: '1.7' }}>
            The all-in-one platform for speakers, preachers, and worship leaders to manage bookings, documents, and communications.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => setCurrentView('auth')} style={{ ...styles.button, padding: isMobile ? '16px 32px' : '18px 48px', fontSize: isMobile ? '14px' : '15px' }}>
              GET STARTED
            </button>
            <button onClick={() => setCurrentView('publicProfile')} style={{ ...styles.buttonSecondary, padding: isMobile ? '16px 32px' : '18px 48px', fontSize: isMobile ? '14px' : '15px' }}>
              VIEW DEMO PROFILE
            </button>
          </div>
        </section>

        {/* Features */}
        <section style={{ padding: isMobile ? '48px 20px' : '80px 48px', background: 'rgba(247,243,233,0.02)' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: isMobile ? '24px' : '36px', letterSpacing: '2px', textAlign: 'center', marginBottom: isMobile ? '40px' : '64px', color: '#F7F3E9' }}>
              EVERYTHING YOU NEED
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: isMobile ? '24px' : '32px' }}>
              {[
                { icon: Calendar, title: 'Booking Management', desc: 'Accept, decline, and track speaking requests with ease' },
                { icon: FolderOpen, title: 'Document Hub', desc: 'Store contracts, W9s, riders, and more in one place' },
                { icon: MessageSquare, title: 'Messaging', desc: 'Communicate directly with event hosts' },
                { icon: Plane, title: 'Itinerary Builder', desc: 'Build and share detailed travel itineraries' },
                { icon: Users, title: 'Team Management', desc: 'Collaborate with your team on bookings' },
                { icon: User, title: 'Public Profile', desc: 'Showcase your ministry with a custom booking page' },
              ].map((feature, i) => (
                <div key={i} style={{ ...styles.card, textAlign: 'center', padding: isMobile ? '24px' : '32px' }}>
                  <feature.icon size={isMobile ? 32 : 40} color="#535E4A" style={{ marginBottom: '16px' }} />
                  <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '18px', letterSpacing: '1px', marginBottom: '8px', color: '#F7F3E9' }}>
                    {feature.title}
                  </h3>
                  <p style={{ fontSize: '14px', color: 'rgba(247,243,233,0.6)', lineHeight: '1.6' }}>
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ padding: isMobile ? '24px 20px' : '32px 48px', borderTop: '1px solid rgba(247,243,233,0.08)', textAlign: 'center' }}>
          <p style={{ fontSize: '13px', color: 'rgba(247,243,233,0.4)' }}>
            © {new Date().getFullYear()} Pulpit • Built for speakers, by speakers
          </p>
        </footer>
      </div>
    );
  }

  // AUTH PAGE
  if (currentView === 'auth') {
    return (
      <div style={{ minHeight: '100vh', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: isMobile ? '24px' : '48px' }}>
        <div style={{ ...styles.card, width: '100%', maxWidth: '400px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '28px', letterSpacing: '2px', marginBottom: '8px', color: '#F7F3E9' }}>PULPIT</div>
            <p style={{ color: 'rgba(247,243,233,0.5)', fontSize: '14px' }}>
              {authMode === 'login' ? 'Welcome back' : 'Create your account'}
            </p>
          </div>

          {authError && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', padding: '12px', marginBottom: '24px', fontSize: '13px', color: '#EF4444' }}>
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

      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)} 
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 998 }} 
        />
      )}

      {/* Sidebar */}
      <div style={{ 
        width: '240px', 
        background: 'rgba(247,243,233,0.02)', 
        borderRight: '1px solid rgba(247,243,233,0.08)', 
        padding: '24px 16px', 
        display: 'flex', 
        flexDirection: 'column',
        ...(isMobile && {
          position: 'fixed',
          top: 0,
          left: sidebarOpen ? 0 : '-240px',
          bottom: 0,
          zIndex: 999,
          transition: 'left 0.3s ease',
          background: '#0A0A0A',
        })
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', paddingLeft: '12px' }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '24px', letterSpacing: '2px', color: '#F7F3E9' }}>PULPIT</div>
          {isMobile && (
            <button onClick={() => setSidebarOpen(false)} style={{ background: 'transparent', border: 'none', color: '#F7F3E9', cursor: 'pointer' }}>
              <X size={24} />
            </button>
          )}
        </div>
        
        <nav style={{ flex: 1 }}>
          {navItems.map((item) => (
            <button key={item.id} onClick={() => { setActiveTab(item.id); if (isMobile) setSidebarOpen(false); }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: activeTab === item.id ? 'rgba(83,94,74,0.2)' : 'transparent', border: 'none', borderRadius: '10px', color: activeTab === item.id ? '#F7F3E9' : 'rgba(247,243,233,0.6)', cursor: 'pointer', fontSize: '14px', marginBottom: '4px', textAlign: 'left' }}>
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
      <div style={{ flex: 1, padding: isMobile ? '16px' : '32px', overflowY: 'auto', marginLeft: isMobile ? 0 : undefined }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', gap: '16px' }}>
          {isMobile && (
            <button onClick={() => setSidebarOpen(true)} style={{ background: 'transparent', border: 'none', color: '#F7F3E9', cursor: 'pointer', padding: '8px' }}>
              <Menu size={24} />
            </button>
          )}
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: isMobile ? '20px' : '32px', letterSpacing: '2px', color: '#F7F3E9', flex: 1 }}>
            {activeTab === 'dashboard' && `Welcome${isMobile ? '' : ', ' + (currentUser?.name || 'User')}`}
            {activeTab === 'requests' && 'Booking Requests'}
            {activeTab === 'calendar' && 'Calendar'}
            {activeTab === 'messages' && 'Messages'}
            {activeTab === 'profile' && 'Profile'}
            {activeTab === 'resources' && 'Resources'}
            {activeTab === 'documents' && 'Documents'}
            {activeTab === 'team' && 'Team'}
            {activeTab === 'settings' && 'Settings'}
          </h1>
          
          {/* Notification Bell with Dropdown */}
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setNotificationDropdownOpen(!notificationDropdownOpen)}
              style={{ position: 'relative', background: 'transparent', border: 'none', cursor: 'pointer', padding: '8px' }}
            >
              <Bell size={20} color="rgba(247,243,233,0.6)" />
              {unreadNotifications > 0 && (
                <span style={{ position: 'absolute', top: '2px', right: '2px', width: '8px', height: '8px', background: '#EF4444', borderRadius: '50%' }} />
              )}
            </button>
            
            {/* Notification Dropdown */}
            {notificationDropdownOpen && (
              <div style={{ 
                position: 'absolute', 
                top: '100%', 
                right: 0, 
                width: isMobile ? '300px' : '360px', 
                maxHeight: '400px',
                background: '#0A0A0A', 
                border: '1px solid rgba(247,243,233,0.1)', 
                borderRadius: '12px', 
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                zIndex: 1000,
                overflow: 'hidden',
              }}>
                <div style={{ padding: '16px', borderBottom: '1px solid rgba(247,243,233,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '16px', letterSpacing: '1px', color: '#F7F3E9' }}>NOTIFICATIONS</h3>
                  {unreadNotifications > 0 && (
                    <button 
                      onClick={handleMarkAllNotificationsRead}
                      style={{ background: 'transparent', border: 'none', color: '#535E4A', cursor: 'pointer', fontSize: '12px' }}
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {notifications.length === 0 ? (
                    <div style={{ padding: '32px', textAlign: 'center' }}>
                      <Bell size={24} color="rgba(247,243,233,0.2)" style={{ marginBottom: '8px' }} />
                      <p style={{ color: 'rgba(247,243,233,0.5)', fontSize: '13px' }}>No notifications yet</p>
                    </div>
                  ) : (
                    notifications.slice(0, 10).map((notification, i) => {
                      const NotifIcon = getNotificationIcon(notification.type);
                      return (
                        <div 
                          key={notification.id || i}
                          onClick={() => handleMarkNotificationRead(notification.id)}
                          style={{ 
                            padding: '12px 16px', 
                            borderBottom: '1px solid rgba(247,243,233,0.05)',
                            background: notification.read ? 'transparent' : 'rgba(83,94,74,0.1)',
                            cursor: 'pointer',
                            display: 'flex',
                            gap: '12px',
                            alignItems: 'flex-start',
                          }}
                        >
                          <div style={{ width: '32px', height: '32px', background: 'rgba(247,243,233,0.05)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <NotifIcon size={16} color="rgba(247,243,233,0.5)" />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ color: '#F7F3E9', fontSize: '13px', marginBottom: '4px', lineHeight: '1.4' }}>{notification.message || notification.title || 'New notification'}</p>
                            <p style={{ color: 'rgba(247,243,233,0.4)', fontSize: '11px' }}>{notification.created_at ? new Date(notification.created_at).toLocaleString() : 'Just now'}</p>
                          </div>
                          {!notification.read && (
                            <div style={{ width: '8px', height: '8px', background: '#535E4A', borderRadius: '50%', flexShrink: 0, marginTop: '4px' }} />
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
                
                {/* Install App Banner */}
                {showInstallPrompt && (
                  <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(247,243,233,0.08)', background: 'rgba(83,94,74,0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Smartphone size={20} color="#535E4A" />
                      <div style={{ flex: 1 }}>
                        <p style={{ color: '#F7F3E9', fontSize: '13px', fontWeight: '500' }}>Add to Home Screen</p>
                        <p style={{ color: 'rgba(247,243,233,0.5)', fontSize: '11px' }}>Quick access to Pulpit</p>
                      </div>
                      <button onClick={handleInstallApp} style={{ ...styles.button, padding: '8px 12px', fontSize: '11px' }}>
                        Install
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Notification Dropdown Overlay */}
        {notificationDropdownOpen && (
          <div 
            onClick={() => setNotificationDropdownOpen(false)} 
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999 }} 
          />
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '64px' }}>
            <p style={{ color: 'rgba(247,243,233,0.5)' }}>Loading...</p>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <div>
                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: isMobile ? '12px' : '16px', marginBottom: '32px' }}>
                  {[
                    { label: 'Pending', value: pendingRequests, color: '#FFB400' },
                    { label: 'Confirmed', value: bookingRequests.filter(r => r.status === 'confirmed').length, color: '#4CAF50' },
                    { label: 'Completed', value: bookingRequests.filter(r => r.status === 'completed').length, color: '#6B8AE5' },
                    { label: 'Messages', value: unreadMessages, color: '#535E4A' },
                  ].map((stat, i) => (
                    <div key={i} style={styles.card}>
                      <p style={{ fontSize: '12px', color: 'rgba(247,243,233,0.5)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>{stat.label}</p>
                      <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: isMobile ? '28px' : '36px', color: stat.color }}>{stat.value}</p>
                    </div>
                  ))}
                </div>

                {/* Recent Requests */}
                <div style={styles.card}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '18px', letterSpacing: '1px', color: '#F7F3E9' }}>RECENT REQUESTS</h3>
                    <button onClick={() => setActiveTab('requests')} style={{ background: 'transparent', border: 'none', color: '#535E4A', cursor: 'pointer', fontSize: '13px' }}>View All →</button>
                  </div>
                  {bookingRequests.length === 0 ? (
                    <p style={{ color: 'rgba(247,243,233,0.5)', textAlign: 'center', padding: '32px' }}>No booking requests yet</p>
                  ) : (
                    bookingRequests.slice(0, 5).map((request, i) => (
                      <div key={request.id || i} onClick={() => { setSelectedRequest(request); setDetailTab('details'); }} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'rgba(247,243,233,0.03)', borderRadius: '10px', marginBottom: '8px', cursor: 'pointer', transition: 'background 0.2s' }}>
                        <div style={{ flex: 1 }}>
                          <p style={{ color: '#F7F3E9', fontWeight: '500', marginBottom: '4px' }}>{request.event_name || request.church_name}</p>
                          <p style={{ color: 'rgba(247,243,233,0.5)', fontSize: '13px' }}>{request.location} • {request.event_date ? new Date(request.event_date).toLocaleDateString() : 'Date TBD'}</p>
                        </div>
                        <span style={{ ...styles.badge, ...getStatusBadge(request.status) }}>{request.status}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === 'requests' && (
              <div>
                {bookingRequests.length === 0 ? (
                  <div style={{ ...styles.card, textAlign: 'center', padding: '64px' }}>
                    <Briefcase size={48} color="rgba(247,243,233,0.2)" style={{ marginBottom: '16px' }} />
                    <p style={{ color: 'rgba(247,243,233,0.5)' }}>No booking requests yet</p>
                  </div>
                ) : (
                  bookingRequests.map((request, i) => (
                    <div key={request.id || i} onClick={() => { setSelectedRequest(request); setDetailTab('details'); }} style={{ ...styles.card, marginBottom: '12px', cursor: 'pointer', transition: 'border-color 0.2s' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '16px', flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
                        <div style={{ flex: 1, minWidth: isMobile ? '100%' : 'auto' }}>
                          <h3 style={{ color: '#F7F3E9', fontWeight: '600', marginBottom: '8px', fontSize: '16px' }}>{request.event_name || request.church_name}</h3>
                          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '13px', color: 'rgba(247,243,233,0.5)' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={14} /> {request.location}</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={14} /> {request.event_date ? new Date(request.event_date).toLocaleDateString() : 'Date TBD'}</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><DollarSign size={14} /> ${request.honorarium || 0}</span>
                          </div>
                        </div>
                        <span style={{ ...styles.badge, ...getStatusBadge(request.status) }}>{request.status}</span>
                      </div>
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '18px', letterSpacing: '1px', color: '#F7F3E9' }}>YOUR PROFILE</h3>
                  {!editingProfile ? (
                    <button onClick={() => setEditingProfile(true)} style={{ ...styles.buttonSecondary, display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px' }}>
                      <Edit size={14} /> Edit
                    </button>
                  ) : (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={handleSaveProfile} disabled={savingProfile} style={{ ...styles.button, display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', opacity: savingProfile ? 0.6 : 1 }}>
                        <Save size={14} /> {savingProfile ? 'Saving...' : 'Save'}
                      </button>
                      <button onClick={() => { setEditingProfile(false); setProfileForm({ name: currentUser?.name || '', tagline: currentUser?.tagline || '', bio: currentUser?.bio || '', location: currentUser?.location || '', year_started: currentUser?.year_started || '' }); }} style={{ ...styles.buttonSecondary, padding: '10px 16px' }}>
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
                
                <div style={{ display: 'flex', gap: '24px', marginBottom: '32px', alignItems: 'center', flexDirection: isMobile ? 'column' : 'row' }}>
                  <div style={{ width: isMobile ? '100px' : '120px', height: isMobile ? '100px' : '120px', background: 'linear-gradient(135deg, #535E4A, #3d4638)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: isMobile ? '36px' : '48px', fontWeight: '600', color: '#F7F3E9', flexShrink: 0 }}>
                    {currentUser?.name?.charAt(0) || 'U'}
                  </div>
                  <div style={{ flex: 1, textAlign: isMobile ? 'center' : 'left' }}>
                    {editingProfile ? (
                      <input type="text" value={profileForm.name} onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))} style={{ ...styles.input, fontSize: '24px', fontWeight: '600', marginBottom: '8px' }} placeholder="Your name" />
                    ) : (
                      <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#F7F3E9', marginBottom: '8px' }}>{currentUser?.name || 'Your Name'}</h2>
                    )}
                    {editingProfile ? (
                      <input type="text" value={profileForm.tagline} onChange={(e) => setProfileForm(prev => ({ ...prev, tagline: e.target.value }))} style={{ ...styles.input, fontStyle: 'italic' }} placeholder="Your tagline" />
                    ) : (
                      <p style={{ color: 'rgba(247,243,233,0.6)', fontStyle: 'italic' }}>{currentUser?.tagline || 'Add a tagline'}</p>
                    )}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '24px' }}>
                  <div>
                    <label style={styles.label}>Bio</label>
                    {editingProfile ? (
                      <textarea value={profileForm.bio} onChange={(e) => setProfileForm(prev => ({ ...prev, bio: e.target.value }))} style={{ ...styles.input, minHeight: '120px', resize: 'vertical' }} placeholder="Tell people about yourself..." />
                    ) : (
                      <p style={{ color: 'rgba(247,243,233,0.7)', lineHeight: '1.6', padding: '16px', background: 'rgba(247,243,233,0.03)', borderRadius: '10px', minHeight: '120px' }}>{currentUser?.bio || 'No bio added yet'}</p>
                    )}
                  </div>
                  <div>
                    <div style={{ marginBottom: '16px' }}>
                      <label style={styles.label}>Location</label>
                      {editingProfile ? (
                        <input type="text" value={profileForm.location} onChange={(e) => setProfileForm(prev => ({ ...prev, location: e.target.value }))} style={styles.input} placeholder="City, State" />
                      ) : (
                        <p style={{ color: 'rgba(247,243,233,0.7)', padding: '14px 16px', background: 'rgba(247,243,233,0.03)', borderRadius: '10px' }}>{currentUser?.location || 'Not specified'}</p>
                      )}
                    </div>
                    <div>
                      <label style={styles.label}>Year Started Preaching</label>
                      {editingProfile ? (
                        <input type="number" value={profileForm.year_started} onChange={(e) => setProfileForm(prev => ({ ...prev, year_started: e.target.value }))} style={styles.input} placeholder="2015" min="1900" max={new Date().getFullYear()} />
                      ) : (
                        <p style={{ color: 'rgba(247,243,233,0.7)', padding: '14px 16px', background: 'rgba(247,243,233,0.03)', borderRadius: '10px' }}>
                          {currentUser?.year_started ? `${currentUser.year_started} (${new Date().getFullYear() - parseInt(currentUser.year_started)}+ years)` : 'Not specified'}
                        </p>
                      )}
                    </div>
                  </div>
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
              <div>
                {/* Universal Documents Section */}
                <div style={{ ...styles.card, marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div>
                      <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '18px', letterSpacing: '1px', color: '#F7F3E9', marginBottom: '4px' }}>UNIVERSAL DOCUMENTS</h3>
                      <p style={{ fontSize: '13px', color: 'rgba(247,243,233,0.5)' }}>These documents can be sent to any host</p>
                    </div>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap: '16px' }}>
                    {['W9', 'Contract Template', 'Rider'].map((docType) => {
                      const existingDoc = universalDocs.find(d => d.document_type === docType.toLowerCase().replace(' ', '_'));
                      return (
                        <div key={docType} style={{ padding: '20px', background: 'rgba(247,243,233,0.03)', borderRadius: '12px', border: existingDoc ? '1px solid rgba(76,175,80,0.3)' : '1px solid rgba(247,243,233,0.08)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <h4 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '14px', letterSpacing: '1px', color: '#F7F3E9' }}>{docType}</h4>
                            {existingDoc && <CheckCircle size={16} color="#4CAF50" />}
                          </div>
                          {existingDoc ? (
                            <div>
                              <p style={{ color: 'rgba(247,243,233,0.7)', fontSize: '13px', marginBottom: '8px' }}>{existingDoc.name}</p>
                              <p style={{ color: 'rgba(247,243,233,0.4)', fontSize: '11px' }}>Uploaded {new Date(existingDoc.created_at).toLocaleDateString()}</p>
                            </div>
                          ) : (
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: 'rgba(247,243,233,0.05)', borderRadius: '8px', cursor: 'pointer', color: 'rgba(247,243,233,0.5)', fontSize: '13px' }}>
                              <Upload size={16} />
                              Upload {docType}
                              <input
                                type="file"
                                style={{ display: 'none' }}
                                onChange={(e) => {
                                  if (e.target.files[0]) {
                                    handleDocumentUpload(null, docType.toLowerCase().replace(' ', '_'), e.target.files[0], true);
                                  }
                                }}
                              />
                            </label>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Event Documents Section */}
                <div style={styles.card}>
                  <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '18px', letterSpacing: '1px', color: '#F7F3E9', marginBottom: '4px' }}>EVENT DOCUMENTS</h3>
                  <p style={{ fontSize: '13px', color: 'rgba(247,243,233,0.5)', marginBottom: '24px' }}>Documents organized by event</p>
                  
                  {Object.keys(getEventDocs()).length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '48px', background: 'rgba(247,243,233,0.02)', borderRadius: '12px' }}>
                      <FolderOpen size={40} color="rgba(247,243,233,0.2)" style={{ marginBottom: '12px' }} />
                      <p style={{ color: 'rgba(247,243,233,0.5)' }}>No event documents yet</p>
                      <p style={{ color: 'rgba(247,243,233,0.3)', fontSize: '13px', marginTop: '8px' }}>Documents uploaded in event requests will appear here</p>
                    </div>
                  ) : (
                    Object.entries(getEventDocs()).map(([requestId, { eventName, docs }]) => (
                      <div key={requestId} style={{ marginBottom: '20px', padding: '20px', background: 'rgba(247,243,233,0.02)', borderRadius: '12px' }}>
                        <h4 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '14px', letterSpacing: '1px', color: '#F7F3E9', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Calendar size={14} />
                          {eventName}
                        </h4>
                        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '8px' }}>
                          {docs.map((doc, i) => (
                            <div key={doc.id || i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'rgba(247,243,233,0.03)', borderRadius: '8px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <FileText size={16} color="rgba(247,243,233,0.5)" />
                                <div>
                                  <p style={{ color: '#F7F3E9', fontSize: '13px' }}>{doc.name}</p>
                                  <p style={{ color: 'rgba(247,243,233,0.4)', fontSize: '11px', textTransform: 'capitalize' }}>{doc.document_type}</p>
                                </div>
                              </div>
                              <span style={{ ...styles.badge, fontSize: '10px', padding: '4px 8px', background: doc.status === 'signed' ? 'rgba(76,175,80,0.15)' : 'rgba(255,180,0,0.15)', color: doc.status === 'signed' ? '#4CAF50' : '#FFB400' }}>
                                {doc.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === 'resources' && (
              <div>
                {/* Category Filter + Add Button */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', gap: '16px', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => setResourceCategory('all')}
                      style={{
                        padding: '8px 16px',
                        background: resourceCategory === 'all' ? 'rgba(83,94,74,0.3)' : 'rgba(247,243,233,0.05)',
                        border: resourceCategory === 'all' ? '1px solid rgba(83,94,74,0.5)' : '1px solid rgba(247,243,233,0.1)',
                        borderRadius: '20px',
                        color: '#F7F3E9',
                        cursor: 'pointer',
                        fontSize: '13px',
                      }}
                    >
                      All
                    </button>
                    {resourceCategories.map((cat) => (
                      <button
                        key={cat.value}
                        onClick={() => setResourceCategory(cat.value)}
                        style={{
                          padding: '8px 16px',
                          background: resourceCategory === cat.value ? 'rgba(83,94,74,0.3)' : 'rgba(247,243,233,0.05)',
                          border: resourceCategory === cat.value ? '1px solid rgba(83,94,74,0.5)' : '1px solid rgba(247,243,233,0.1)',
                          borderRadius: '20px',
                          color: '#F7F3E9',
                          cursor: 'pointer',
                          fontSize: '13px',
                        }}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                  <button onClick={() => setShowAddResource(true)} style={{ ...styles.button, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Plus size={16} /> ADD RESOURCE
                  </button>
                </div>

                {/* Resources Grid */}
                {filteredResources.length === 0 ? (
                  <div style={{ ...styles.card, textAlign: 'center', padding: '64px' }}>
                    <FolderOpen size={48} color="rgba(247,243,233,0.2)" style={{ marginBottom: '16px' }} />
                    <p style={{ color: 'rgba(247,243,233,0.5)', marginBottom: '8px' }}>No resources yet</p>
                    <p style={{ color: 'rgba(247,243,233,0.3)', fontSize: '13px', marginBottom: '24px' }}>Add your media kit, promo photos, bios, and more</p>
                    <button onClick={() => setShowAddResource(true)} style={{ ...styles.buttonSecondary, display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      <Plus size={16} /> Add Your First Resource
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                    {filteredResources.map((resource, i) => {
                      const ResourceIcon = getResourceIcon(resource.category);
                      return (
                        <div key={resource.id || i} style={{ ...styles.card, padding: '20px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <div style={{ width: '40px', height: '40px', background: 'rgba(83,94,74,0.2)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <ResourceIcon size={18} color="#535E4A" />
                              </div>
                              <div>
                                <h4 style={{ color: '#F7F3E9', fontWeight: '500', marginBottom: '4px' }}>{resource.name}</h4>
                                <span style={{ fontSize: '11px', color: 'rgba(247,243,233,0.5)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                  {resourceCategories.find(c => c.value === resource.category)?.label || 'Other'}
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() => handleDeleteResource(resource.id)}
                              style={{ background: 'transparent', border: 'none', color: 'rgba(247,243,233,0.3)', cursor: 'pointer', padding: '4px' }}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          {resource.description && (
                            <p style={{ color: 'rgba(247,243,233,0.6)', fontSize: '13px', marginBottom: '12px', lineHeight: '1.5' }}>{resource.description}</p>
                          )}
                          {resource.link && (
                            <a
                              href={resource.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#535E4A', fontSize: '13px', textDecoration: 'none' }}
                            >
                              <Link size={14} /> View Resource
                            </a>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Add Resource Modal */}
                {showAddResource && (
                  <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div style={{ ...styles.card, background: '#0A0A0A', maxWidth: '450px', width: '100%' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '20px', letterSpacing: '1px', color: '#F7F3E9' }}>ADD RESOURCE</h2>
                        <button onClick={() => setShowAddResource(false)} style={{ background: 'transparent', border: 'none', color: 'rgba(247,243,233,0.5)', cursor: 'pointer' }}>
                          <X size={20} />
                        </button>
                      </div>
                      
                      <div style={{ marginBottom: '16px' }}>
                        <label style={styles.label}>Name *</label>
                        <input type="text" value={newResourceForm.name} onChange={(e) => setNewResourceForm(prev => ({ ...prev, name: e.target.value }))} style={styles.input} placeholder="Resource name" />
                      </div>
                      
                      <div style={{ marginBottom: '16px' }}>
                        <label style={styles.label}>Category *</label>
                        <select value={newResourceForm.category} onChange={(e) => setNewResourceForm(prev => ({ ...prev, category: e.target.value }))} style={styles.input}>
                          {resourceCategories.map(cat => (
                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div style={{ marginBottom: '16px' }}>
                        <label style={styles.label}>Link / URL</label>
                        <input type="url" value={newResourceForm.link} onChange={(e) => setNewResourceForm(prev => ({ ...prev, link: e.target.value }))} style={styles.input} placeholder="https://..." />
                      </div>
                      
                      <div style={{ marginBottom: '24px' }}>
                        <label style={styles.label}>Description</label>
                        <textarea value={newResourceForm.description} onChange={(e) => setNewResourceForm(prev => ({ ...prev, description: e.target.value }))} style={{ ...styles.input, minHeight: '80px', resize: 'vertical' }} placeholder="Brief description..." />
                      </div>
                      
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <button onClick={() => setShowAddResource(false)} style={{ ...styles.buttonSecondary, flex: 1 }}>Cancel</button>
                        <button onClick={handleAddResource} disabled={uploadingResource || !newResourceForm.name} style={{ ...styles.button, flex: 1, opacity: uploadingResource || !newResourceForm.name ? 0.5 : 1 }}>
                          {uploadingResource ? 'ADDING...' : 'ADD RESOURCE'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'team' && (
              <div>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <div>
                    <p style={{ color: 'rgba(247,243,233,0.5)', fontSize: '14px' }}>Collaborate with your team on managing bookings</p>
                  </div>
                  <button onClick={() => setShowInviteModal(true)} style={{ ...styles.button, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <UserPlus size={16} /> INVITE MEMBER
                  </button>
                </div>

                {/* Team Members */}
                {teamMembers.length === 0 ? (
                  <div style={{ ...styles.card, textAlign: 'center', padding: '64px' }}>
                    <Users size={48} color="rgba(247,243,233,0.2)" style={{ marginBottom: '16px' }} />
                    <p style={{ color: 'rgba(247,243,233,0.5)', marginBottom: '8px' }}>No team members yet</p>
                    <p style={{ color: 'rgba(247,243,233,0.3)', fontSize: '13px', marginBottom: '24px' }}>Invite assistants, managers, or collaborators to help manage your bookings</p>
                    <button onClick={() => setShowInviteModal(true)} style={{ ...styles.buttonSecondary, display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      <UserPlus size={16} /> Invite Your First Team Member
                    </button>
                  </div>
                ) : (
                  <div style={styles.card}>
                    {/* Owner Card */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: 'rgba(83,94,74,0.1)', borderRadius: '12px', marginBottom: '16px' }}>
                      <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #535E4A, #3d4638)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: '600', color: '#F7F3E9' }}>
                        {currentUser?.name?.charAt(0) || 'U'}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ color: '#F7F3E9', fontWeight: '500', marginBottom: '2px' }}>{currentUser?.name || 'You'}</p>
                        <p style={{ color: 'rgba(247,243,233,0.5)', fontSize: '13px' }}>{currentUser?.email}</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', background: 'rgba(83,94,74,0.3)', borderRadius: '20px' }}>
                        <Crown size={14} color="#535E4A" />
                        <span style={{ fontSize: '12px', color: '#F7F3E9', fontWeight: '500' }}>Owner</span>
                      </div>
                    </div>

                    {/* Team Member Cards */}
                    {teamMembers.map((member, i) => {
                      const RoleIcon = getRoleIcon(member.role);
                      return (
                        <div key={member.id || i} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: 'rgba(247,243,233,0.03)', borderRadius: '12px', marginBottom: '8px', flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
                          <div style={{ width: '48px', height: '48px', background: 'rgba(247,243,233,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: '600', color: '#F7F3E9' }}>
                            {member.name?.charAt(0) || 'T'}
                          </div>
                          <div style={{ flex: 1, minWidth: isMobile ? '100%' : 'auto' }}>
                            <p style={{ color: '#F7F3E9', fontWeight: '500', marginBottom: '2px' }}>{member.name}</p>
                            <p style={{ color: 'rgba(247,243,233,0.5)', fontSize: '13px' }}>{member.email}</p>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: isMobile ? '100%' : 'auto', justifyContent: isMobile ? 'space-between' : 'flex-end', marginTop: isMobile ? '12px' : 0 }}>
                            {member.status === 'pending' && (
                              <span style={{ fontSize: '11px', color: '#FFB400', background: 'rgba(255,180,0,0.15)', padding: '4px 8px', borderRadius: '10px' }}>Pending</span>
                            )}
                            <select value={member.role} onChange={(e) => handleUpdateTeamRole(member.id, e.target.value)} style={{ ...styles.input, width: 'auto', padding: '8px 12px', fontSize: '12px' }}>
                              {teamRoles.map((role) => (
                                <option key={role.value} value={role.value}>{role.label}</option>
                              ))}
                            </select>
                            <button onClick={() => handleRemoveTeamMember(member.id)} style={{ background: 'transparent', border: 'none', color: 'rgba(247,243,233,0.3)', cursor: 'pointer', padding: '8px' }}>
                              <UserMinus size={18} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Permissions Info */}
                <div style={{ ...styles.card, marginTop: '24px' }}>
                  <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '16px', letterSpacing: '1px', color: '#F7F3E9', marginBottom: '16px' }}>ROLE PERMISSIONS</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '16px' }}>
                    {teamRoles.map((role) => {
                      const RoleIcon = role.icon;
                      return (
                        <div key={role.value} style={{ padding: '16px', background: 'rgba(247,243,233,0.03)', borderRadius: '10px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                            <RoleIcon size={18} color="#535E4A" />
                            <h4 style={{ color: '#F7F3E9', fontWeight: '500' }}>{role.label}</h4>
                          </div>
                          <p style={{ color: 'rgba(247,243,233,0.5)', fontSize: '13px', lineHeight: '1.5' }}>{role.description}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Invite Modal */}
                {showInviteModal && (
                  <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div style={{ ...styles.card, background: '#0A0A0A', maxWidth: '450px', width: '100%' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '20px', letterSpacing: '1px', color: '#F7F3E9' }}>INVITE TEAM MEMBER</h2>
                        <button onClick={() => setShowInviteModal(false)} style={{ background: 'transparent', border: 'none', color: 'rgba(247,243,233,0.5)', cursor: 'pointer' }}>
                          <X size={20} />
                        </button>
                      </div>
                      
                      <div style={{ marginBottom: '16px' }}>
                        <label style={styles.label}>Name *</label>
                        <input type="text" value={inviteForm.name} onChange={(e) => setInviteForm(prev => ({ ...prev, name: e.target.value }))} style={styles.input} placeholder="Team member's name" />
                      </div>
                      
                      <div style={{ marginBottom: '16px' }}>
                        <label style={styles.label}>Email *</label>
                        <input type="email" value={inviteForm.email} onChange={(e) => setInviteForm(prev => ({ ...prev, email: e.target.value }))} style={styles.input} placeholder="team@example.com" />
                      </div>
                      
                      <div style={{ marginBottom: '24px' }}>
                        <label style={styles.label}>Role *</label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {teamRoles.map((role) => {
                            const RoleIcon = role.icon;
                            return (
                              <div key={role.value} onClick={() => setInviteForm(prev => ({ ...prev, role: role.value }))} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: inviteForm.role === role.value ? 'rgba(83,94,74,0.2)' : 'rgba(247,243,233,0.03)', border: inviteForm.role === role.value ? '1px solid rgba(83,94,74,0.5)' : '1px solid rgba(247,243,233,0.08)', borderRadius: '10px', cursor: 'pointer' }}>
                                <RoleIcon size={18} color={inviteForm.role === role.value ? '#535E4A' : 'rgba(247,243,233,0.5)'} />
                                <div style={{ flex: 1 }}>
                                  <p style={{ color: '#F7F3E9', fontWeight: '500', fontSize: '14px' }}>{role.label}</p>
                                  <p style={{ color: 'rgba(247,243,233,0.5)', fontSize: '12px' }}>{role.description}</p>
                                </div>
                                {inviteForm.role === role.value && <Check size={16} color="#535E4A" />}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <button onClick={() => setShowInviteModal(false)} style={{ ...styles.buttonSecondary, flex: 1 }}>Cancel</button>
                        <button onClick={handleInviteTeamMember} disabled={invitingMember || !inviteForm.email || !inviteForm.name} style={{ ...styles.button, flex: 1, opacity: invitingMember || !inviteForm.email || !inviteForm.name ? 0.5 : 1 }}>
                          {invitingMember ? 'INVITING...' : 'SEND INVITE'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <div>
                {/* Settings Tabs */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '1px solid rgba(247,243,233,0.1)', paddingBottom: '16px', overflowX: 'auto' }}>
                  {[
                    { id: 'notifications', label: 'Notifications', icon: Bell },
                    { id: 'profile', label: 'Profile & Privacy', icon: Lock },
                    { id: 'app', label: 'App Settings', icon: Smartphone },
                  ].map((tab) => (
                    <button key={tab.id} onClick={() => setSettingsTab(tab.id)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: settingsTab === tab.id ? 'rgba(83,94,74,0.3)' : 'transparent', border: settingsTab === tab.id ? '1px solid rgba(83,94,74,0.5)' : '1px solid transparent', borderRadius: '8px', color: settingsTab === tab.id ? '#F7F3E9' : 'rgba(247,243,233,0.5)', cursor: 'pointer', fontSize: '13px', whiteSpace: 'nowrap' }}>
                      <tab.icon size={16} />
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Notifications Settings */}
                {settingsTab === 'notifications' && (
                  <div style={styles.card}>
                    <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '18px', marginBottom: '24px', letterSpacing: '1px', color: '#F7F3E9' }}>NOTIFICATION PREFERENCES</h3>
                    
                    <div style={{ marginBottom: '32px' }}>
                      <h4 style={{ color: 'rgba(247,243,233,0.7)', fontSize: '14px', marginBottom: '16px', fontWeight: '500' }}>Activity Notifications</h4>
                      {[
                        { key: 'new_requests', label: 'New booking requests', desc: 'Get notified when someone submits a booking request' },
                        { key: 'messages', label: 'Messages', desc: 'Get notified when you receive a new message' },
                        { key: 'document_signed', label: 'Document signed', desc: 'Get notified when a document is signed' },
                        { key: 'event_reminders', label: 'Event reminders', desc: 'Get reminders about upcoming events' },
                      ].map((setting) => (
                        <div key={setting.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid rgba(247,243,233,0.08)' }}>
                          <div>
                            <p style={{ fontSize: '14px', color: '#F7F3E9', marginBottom: '4px' }}>{setting.label}</p>
                            <p style={{ fontSize: '12px', color: 'rgba(247,243,233,0.5)' }}>{setting.desc}</p>
                          </div>
                          <button onClick={() => setNotificationSettings(prev => ({ ...prev, [setting.key]: !prev[setting.key] }))} style={{ width: '48px', height: '28px', background: notificationSettings[setting.key] ? '#535E4A' : 'rgba(247,243,233,0.1)', borderRadius: '14px', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s' }}>
                            <div style={{ width: '22px', height: '22px', background: '#F7F3E9', borderRadius: '50%', position: 'absolute', top: '3px', left: notificationSettings[setting.key] ? '23px' : '3px', transition: 'left 0.2s' }} />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                      <h4 style={{ color: 'rgba(247,243,233,0.7)', fontSize: '14px', marginBottom: '16px', fontWeight: '500' }}>Delivery Methods</h4>
                      {[
                        { key: 'email_notifications', label: 'Email notifications', desc: 'Receive notifications via email' },
                        { key: 'push_notifications', label: 'Push notifications', desc: 'Receive push notifications on your device' },
                      ].map((setting) => (
                        <div key={setting.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid rgba(247,243,233,0.08)' }}>
                          <div>
                            <p style={{ fontSize: '14px', color: '#F7F3E9', marginBottom: '4px' }}>{setting.label}</p>
                            <p style={{ fontSize: '12px', color: 'rgba(247,243,233,0.5)' }}>{setting.desc}</p>
                          </div>
                          <button onClick={() => setNotificationSettings(prev => ({ ...prev, [setting.key]: !prev[setting.key] }))} style={{ width: '48px', height: '28px', background: notificationSettings[setting.key] ? '#535E4A' : 'rgba(247,243,233,0.1)', borderRadius: '14px', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s' }}>
                            <div style={{ width: '22px', height: '22px', background: '#F7F3E9', borderRadius: '50%', position: 'absolute', top: '3px', left: notificationSettings[setting.key] ? '23px' : '3px', transition: 'left 0.2s' }} />
                          </button>
                        </div>
                      ))}
                    </div>

                    <button onClick={handleSaveNotificationSettings} disabled={savingSettings} style={{ ...styles.button, opacity: savingSettings ? 0.6 : 1 }}>
                      {savingSettings ? 'SAVING...' : 'SAVE PREFERENCES'}
                    </button>
                  </div>
                )}

                {/* Profile & Privacy Settings */}
                {settingsTab === 'profile' && (
                  <div style={styles.card}>
                    <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '18px', marginBottom: '24px', letterSpacing: '1px', color: '#F7F3E9' }}>PROFILE & PRIVACY</h3>
                    
                    <div style={{ marginBottom: '24px' }}>
                      <h4 style={{ color: 'rgba(247,243,233,0.7)', fontSize: '14px', marginBottom: '16px', fontWeight: '500' }}>Profile Visibility</h4>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'rgba(247,243,233,0.03)', borderRadius: '10px', marginBottom: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <Globe size={18} color="rgba(247,243,233,0.5)" />
                          <div>
                            <p style={{ fontSize: '14px', color: '#F7F3E9', marginBottom: '4px' }}>Public Profile</p>
                            <p style={{ fontSize: '12px', color: 'rgba(247,243,233,0.5)' }}>Allow anyone to view your speaker profile</p>
                          </div>
                        </div>
                        <button style={{ width: '48px', height: '28px', background: '#535E4A', borderRadius: '14px', border: 'none', cursor: 'pointer', position: 'relative' }}>
                          <div style={{ width: '22px', height: '22px', background: '#F7F3E9', borderRadius: '50%', position: 'absolute', top: '3px', left: '23px' }} />
                        </button>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'rgba(247,243,233,0.03)', borderRadius: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <Eye size={18} color="rgba(247,243,233,0.5)" />
                          <div>
                            <p style={{ fontSize: '14px', color: '#F7F3E9', marginBottom: '4px' }}>Show Contact Info</p>
                            <p style={{ fontSize: '12px', color: 'rgba(247,243,233,0.5)' }}>Display your email on public profile</p>
                          </div>
                        </div>
                        <button style={{ width: '48px', height: '28px', background: 'rgba(247,243,233,0.1)', borderRadius: '14px', border: 'none', cursor: 'pointer', position: 'relative' }}>
                          <div style={{ width: '22px', height: '22px', background: '#F7F3E9', borderRadius: '50%', position: 'absolute', top: '3px', left: '3px' }} />
                        </button>
                      </div>
                    </div>

                    <div>
                      <h4 style={{ color: 'rgba(247,243,233,0.7)', fontSize: '14px', marginBottom: '16px', fontWeight: '500' }}>Your Public Profile URL</h4>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <input type="text" value={`getpulpit.app/${currentUser?.name?.toLowerCase().replace(/\s+/g, '-') || 'your-name'}`} readOnly style={{ ...styles.input, flex: 1 }} />
                        <button style={{ ...styles.buttonSecondary, display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 16px' }}>
                          <Share2 size={16} /> Copy
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* App Settings */}
                {settingsTab === 'app' && (
                  <div>
                    <div style={{ ...styles.card, marginBottom: '24px' }}>
                      <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '18px', marginBottom: '24px', letterSpacing: '1px', color: '#F7F3E9' }}>APP INSTALLATION</h3>
                      
                      <div style={{ padding: '24px', background: 'rgba(83,94,74,0.1)', borderRadius: '12px', border: '1px solid rgba(83,94,74,0.2)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                          <div style={{ width: '56px', height: '56px', background: '#535E4A', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Smartphone size={28} color="#F7F3E9" />
                          </div>
                          <div style={{ flex: 1 }}>
                            <h4 style={{ color: '#F7F3E9', fontWeight: '500', marginBottom: '4px' }}>Add Pulpit to Home Screen</h4>
                            <p style={{ color: 'rgba(247,243,233,0.6)', fontSize: '13px' }}>Get quick access to Pulpit from your device's home screen</p>
                          </div>
                        </div>
                        
                        {showInstallPrompt && deferredPrompt ? (
                          <button onClick={handleInstallApp} style={{ ...styles.button, width: '100%' }}>
                            INSTALL APP
                          </button>
                        ) : (
                          <div>
                            <p style={{ color: 'rgba(247,243,233,0.5)', fontSize: '13px', marginBottom: '16px' }}>
                              To install Pulpit on your device:
                            </p>
                            <ol style={{ color: 'rgba(247,243,233,0.6)', fontSize: '13px', lineHeight: '1.8', paddingLeft: '20px' }}>
                              <li><strong>iOS Safari:</strong> Tap the Share button, then "Add to Home Screen"</li>
                              <li><strong>Android Chrome:</strong> Tap the menu (⋮), then "Add to Home screen"</li>
                              <li><strong>Desktop Chrome:</strong> Click the install icon in the address bar</li>
                            </ol>
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={styles.card}>
                      <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '18px', marginBottom: '24px', letterSpacing: '1px', color: '#F7F3E9' }}>DATA & STORAGE</h3>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid rgba(247,243,233,0.08)' }}>
                        <div>
                          <p style={{ fontSize: '14px', color: '#F7F3E9', marginBottom: '4px' }}>Clear Local Cache</p>
                          <p style={{ fontSize: '12px', color: 'rgba(247,243,233,0.5)' }}>Remove temporary files and cached data</p>
                        </div>
                        <button style={styles.buttonSecondary}>Clear</button>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0' }}>
                        <div>
                          <p style={{ fontSize: '14px', color: '#F7F3E9', marginBottom: '4px' }}>Export Your Data</p>
                          <p style={{ fontSize: '12px', color: 'rgba(247,243,233,0.5)' }}>Download all your booking data</p>
                        </div>
                        <button style={{ ...styles.buttonSecondary, display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Download size={14} /> Export
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
