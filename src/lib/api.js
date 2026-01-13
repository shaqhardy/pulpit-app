// Xano API Configuration
const API_BASE = 'https://x8ki-letl-twmt.n7.xano.io/api:EoXk01e5';

// Helper to get auth token
const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
};

// Helper for API calls
const apiCall = async (endpoint, options = {}) => {
  const token = getToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || 'Request failed');
  }

  return response.json();
};

// Auth API
export const auth = {
  signup: (data) => apiCall('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  login: (data) => apiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  me: () => apiCall('/auth/me'),
};

// Users API
export const users = {
  getAll: () => apiCall('/user'),
  getById: (id) => apiCall(`/user/${id}`),
  update: (id, data) => apiCall(`/user/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
};

// Booking Requests API
export const bookingRequests = {
  getAll: () => apiCall('/booking_request'),
  getById: (id) => apiCall(`/booking_request/${id}`),
  create: (data) => apiCall('/booking_request', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiCall(`/booking_request/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiCall(`/booking_request/${id}`, {
    method: 'DELETE',
  }),
};

// Messages API
export const messages = {
  getAll: () => apiCall('/message'),
  getById: (id) => apiCall(`/message/${id}`),
  create: (data) => apiCall('/message', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiCall(`/message/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiCall(`/message/${id}`, {
    method: 'DELETE',
  }),
};

// Documents API
export const documents = {
  getAll: () => apiCall('/document'),
  getById: (id) => apiCall(`/document/${id}`),
  create: (data) => apiCall('/document', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiCall(`/document/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiCall(`/document/${id}`, {
    method: 'DELETE',
  }),
};

// Itinerary Items API
export const itineraryItems = {
  getAll: () => apiCall('/itinerary_item'),
  getById: (id) => apiCall(`/itinerary_item/${id}`),
  create: (data) => apiCall('/itinerary_item', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiCall(`/itinerary_item/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiCall(`/itinerary_item/${id}`, {
    method: 'DELETE',
  }),
};

// Follow API
export const follows = {
  getAll: () => apiCall('/follow'),
  create: (data) => apiCall('/follow', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiCall(`/follow/${id}`, {
    method: 'DELETE',
  }),
};

// Notifications API
export const notifications = {
  getAll: () => apiCall('/notification'),
  getById: (id) => apiCall(`/notification/${id}`),
  update: (id, data) => apiCall(`/notification/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  markAsRead: (id) => apiCall(`/notification/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ read: true }),
  }),
};

// Resources API
export const resources = {
  getAll: () => apiCall('/resource'),
  getById: (id) => apiCall(`/resource/${id}`),
  create: (data) => apiCall('/resource', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiCall(`/resource/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiCall(`/resource/${id}`, {
    method: 'DELETE',
  }),
};

// Media Requests API
export const mediaRequests = {
  getAll: () => apiCall('/media_request'),
  getById: (id) => apiCall(`/media_request/${id}`),
  create: (data) => apiCall('/media_request', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiCall(`/media_request/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
};

// Team Members API
export const teamMembers = {
  getAll: () => apiCall('/team_member'),
  getById: (id) => apiCall(`/team_member/${id}`),
  create: (data) => apiCall('/team_member', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiCall(`/team_member/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiCall(`/team_member/${id}`, {
    method: 'DELETE',
  }),
};

// Speaker Availability API
export const availability = {
  getAll: () => apiCall('/speaker_availability'),
  create: (data) => apiCall('/speaker_availability', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiCall(`/speaker_availability/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiCall(`/speaker_availability/${id}`, {
    method: 'DELETE',
  }),
};

export default {
  auth,
  users,
  bookingRequests,
  messages,
  documents,
  itineraryItems,
  follows,
  notifications,
  resources,
  mediaRequests,
  teamMembers,
  availability,
};
