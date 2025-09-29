import api from '../api/axios';

export const propertyAPI = {
  // Get properties with filters
  getProperties: (params = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          queryParams.append(key, value.join(','));
        } else {
          queryParams.append(key, value);
        }
      }
    });
    return api.get(`/properties?${queryParams.toString()}`);
  },

  // Get single property
  getProperty: (id) => api.get(`/properties/${id}`),

  // Create property (admin/agent)
  createProperty: (data) => api.post('/properties', data),

  // Update property
  updateProperty: (id, data) => api.put(`/properties/${id}`, data),

  // Delete property
  deleteProperty: (id) => api.delete(`/properties/${id}`),

  // Search properties by location
  searchByLocation: (lat, lng, radius = 10) => 
    api.get(`/properties?lat=${lat}&lng=${lng}&radius=${radius}`),

  // Get AI suggestions
  getSuggestions: (userId) => api.get(`/properties/suggestions/${userId}`),
};

export const userAPI = {
  // Toggle favorite
  toggleFavorite: (propertyId) => 
    api.post('/users/favorites', { propertyId }),

  // Toggle comparison
  toggleComparison: (propertyId) => 
    api.post('/users/comparisons', { propertyId }),

  // Get favorites
  getFavorites: () => api.get('/users/favorites'),

  // Get comparisons
  getComparisons: () => api.get('/users/comparisons'),

  // Get user profile
  getProfile: () => api.get('/users/profile'),

  // Update profile
  updateProfile: (data) => api.put('/users/profile', data),
};

export const inquiryAPI = {
  // Send inquiry
  sendInquiry: (data) => api.post('/inquiries', data),

  // Get user inquiries
  getUserInquiries: () => api.get('/inquiries'),

  // Get property inquiries (agent)
  getPropertyInquiries: (propertyId) => api.get(`/inquiries/property/${propertyId}`),
};

export const chatAPI = {
  // Get chat rooms
  getChatRooms: () => api.get('/chat/rooms'),

  // Get messages
  getMessages: (roomId) => api.get(`/chat/messages/${roomId}`),

  // Send message
  sendMessage: (data) => api.post('/chat/messages', data),
};

