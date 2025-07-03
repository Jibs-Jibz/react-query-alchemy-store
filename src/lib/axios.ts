import axios from 'axios';
import { useAuthStore } from '@/store/auth';
import { toast } from '@/hooks/use-toast';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://test-release-4e15b3080353.herokuapp.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const { token } = useAuthStore.getState();
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors and token refresh
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const { clearAuth, token, refreshToken } = useAuthStore.getState();
    
    if (error.response) {
      const { status, data } = error.response;
      
      // Handle unauthorized errors
      if (status === 401) {
        // Try to refresh token if available
        if (refreshToken && token) {
          try {
            const refreshResponse = await axios.post(
              `${import.meta.env.VITE_API_URL}/auth/refresh`,
              { refreshToken }
            );
            
            const { token: newToken } = refreshResponse.data;
            useAuthStore.getState().setToken(newToken);
            
            // Retry the original request with new token
            error.config.headers.Authorization = `Bearer ${newToken}`;
            return api.request(error.config);
          } catch (refreshError) {
            // Refresh failed, clear auth and redirect to login
            clearAuth();
            toast({
              title: "Session expired",
              description: "Please log in again.",
              variant: "destructive",
            });
          }
        } else {
          clearAuth();
          toast({
            title: "Authentication required",
            description: "Please log in to continue.",
            variant: "destructive",
          });
        }
      }
      
      // Handle other HTTP errors
      else if (status >= 400) {
        const errorMessage = data?.message || `HTTP Error ${status}`;
        toast({
          title: "Request failed",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } else if (error.request) {
      // Network error
      toast({
        title: "Network error",
        description: "Please check your internet connection.",
        variant: "destructive",
      });
    }
    
    return Promise.reject(error);
  }
);

export default api;