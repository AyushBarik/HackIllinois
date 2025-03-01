import axios from 'axios';

// Base URL of the API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Create an axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for error handling
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error
      console.error('Response error:', error.response.data);
    } else if (error.request) {
      // Request was made but no response
      console.error('Network error:', error.request);
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// API endpoints for properties
export const propertyAPI = {
  // Get all properties
  getAllProperties: async () => {
    const response = await api.get('/properties');
    return response.data;
  },
  
  // Get a specific property by ID
  getPropertyById: async (id: number) => {
    const response = await api.get(`/properties/${id}`);
    return response.data;
  },
  
  // Create a new property listing
  createProperty: async (propertyData: any) => {
    const response = await api.post('/properties', propertyData);
    return response.data;
  },
  
  // Book a property
  bookProperty: async (propertyId: number, bookingData: any) => {
    const response = await api.post(`/properties/${propertyId}/book`, bookingData);
    return response.data;
  },
  
  // Generate access key for a property
  generateAccessKey: async (propertyId: number, tenantData: any) => {
    const response = await api.post(`/properties/${propertyId}/access`, tenantData);
    return response.data;
  },
  
  // Complete a rental
  completeRental: async (propertyId: number) => {
    const response = await api.post(`/properties/${propertyId}/complete`);
    return response.data;
  },
};

// API endpoints for smart locks
export const smartLockAPI = {
  // Get all smart locks
  getAllLocks: async () => {
    const response = await api.get('/locks');
    return response.data;
  },
  
  // Get a specific smart lock
  getLockById: async (lockId: string) => {
    const response = await api.get(`/locks/${lockId}`);
    return response.data;
  },
  
  // Register a new smart lock
  registerLock: async (lockData: any) => {
    const response = await api.post('/locks', lockData);
    return response.data;
  },
  
  // Grant access to a smart lock
  grantAccess: async (lockId: string, accessData: any) => {
    const response = await api.post(`/locks/${lockId}/access`, accessData);
    return response.data;
  },
  
  // Validate access to a smart lock
  validateAccess: async (lockId: string, accessToken: string) => {
    const response = await api.post(`/locks/${lockId}/validate`, { accessToken });
    return response.data;
  },
  
  // Unlock a door
  unlockDoor: async (lockId: string, accessToken: string) => {
    const response = await api.post(`/locks/${lockId}/unlock`, { accessToken });
    return response.data;
  },
  
  // Lock a door
  lockDoor: async (lockId: string, accessToken: string) => {
    const response = await api.post(`/locks/${lockId}/lock`, { accessToken });
    return response.data;
  },
  
  // Get access history for a lock
  getAccessHistory: async (lockId: string) => {
    const response = await api.get(`/locks/${lockId}/history`);
    return response.data;
  },
  
  // Analyze access patterns
  analyzeAccessPatterns: async (lockId: string) => {
    const response = await api.get(`/locks/${lockId}/analyze`);
    return response.data;
  },
  
  // Check for unauthorized access
  checkUnauthorizedAccess: async () => {
    const response = await api.post('/locks/check-unauthorized');
    return response.data;
  },
  
  // Start AI monitoring
  startMonitoring: async (interval?: number) => {
    const response = await api.post('/locks/monitoring/start', { interval });
    return response.data;
  },
  
  // Stop AI monitoring
  stopMonitoring: async () => {
    const response = await api.post('/locks/monitoring/stop');
    return response.data;
  },
};

export default api;