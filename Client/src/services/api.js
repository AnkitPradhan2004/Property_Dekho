import api from '../api/axios';

export const propertyAPI = {
  // Get properties with filters
  getProperties: (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
            queryParams.append(key, value.join(','));
          } else {
            queryParams.append(key, String(value));
          }
        }
      });
      return api.get(`/properties?${queryParams.toString()}`);
    } catch (error) {
      console.error('Error building query parameters:', error);
      throw error;
    }
  },

  // Get single property
  getProperty: (id) => api.get(`/properties/${id}`),

  // Create property
  createProperty: (propertyData) => {
    return api.post('/properties', propertyData);
  },

  // Update property
  updateProperty: (id, formData) => {
    return api.put(`/properties/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Delete property
  deleteProperty: (id) => api.delete(`/properties/${id}`),

  // Search properties by location
  searchByLocation: (lat, lng, radius = 10) => {
    const sanitizedLat = parseFloat(lat);
    const sanitizedLng = parseFloat(lng);
    const sanitizedRadius = Math.min(Math.max(parseFloat(radius) || 10, 1), 100);
    
    if (isNaN(sanitizedLat) || isNaN(sanitizedLng)) {
      throw new Error('Invalid coordinates');
    }
    
    return api.get(`/properties?lat=${sanitizedLat}&lng=${sanitizedLng}&radius=${sanitizedRadius}`);
  },

  // Get nearby properties
  getNearbyProperties: (propertyId, radius = 5) => {
    return api.get(`/properties/nearby/${propertyId}?radius=${radius}`);
  },

  // Get user's properties
  getUserProperties: (userId) => {
    return api.get(`/properties/user/${userId}`);
  },
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

export const uploadAPI = {
  // Upload single image
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/uploads/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Upload multiple images
  uploadImages: (files) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });
    return api.post('/uploads/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export const authAPI = {
  // Get current user
  getMe: () => api.get('/auth/me'),
  
  // Login
  login: (email, password) => api.post('/auth/login', { email, password }),
  
  // Signup
  signup: (name, email, password) => api.post('/auth/signup', { name, email, password }),
  
  // Forgot password
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  
  // Reset password
  resetPassword: (token, newPassword) => api.post('/auth/reset-password', { token, newPassword }),
};

export const contactAPI = {
  // Send contact message
  sendMessage: (data) => api.post('/contact', data),
};

export const chatAPI = {
  // Get chat rooms
  getChatRooms: () => api.get('/chat/rooms'),

  // Get messages
  getMessages: (roomId) => api.get(`/chat/messages/${roomId}`),

  // Send message
  sendMessage: (data) => api.post('/chat/messages', data),
};

export const messageAPI = {
  // Send message
  sendMessage: (data) => api.post('/messages', data),
  
  // Get property messages
  getPropertyMessages: (propertyId) => api.get(`/messages/property/${propertyId}`),
  
  // Get conversations
  getConversations: () => api.get('/messages/conversations'),
  
  // Mark as read
  markAsRead: (data) => api.put('/messages/read', data),
};

export const inquiryAPI = {
  // Send inquiry
  sendInquiry: (data) => api.post('/inquiries', data),
};

