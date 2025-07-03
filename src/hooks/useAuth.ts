import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/auth';
import { LoginRequest, LoginResponse, RegisterRequest, User } from '@/types/api';
import { toast } from '@/hooks/use-toast';

// Auth API functions
const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (userData: RegisterRequest): Promise<LoginResponse> => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  refreshToken: async (refreshToken: string): Promise<{ token: string }> => {
    const response = await api.post('/auth/refresh', { refreshToken });
    return response.data;
  },
};

// Login hook
export const useLogin = () => {
  const { setAuth } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setAuth(data.user, data.token, data.refreshToken);
      queryClient.invalidateQueries({ queryKey: ['user'] });
      toast({
        title: "Welcome back!",
        description: `Logged in as ${data.user.name}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Login failed",
        description: error.response?.data?.message || "Invalid credentials",
        variant: "destructive",
      });
    },
  });
};

// Register hook
export const useRegister = () => {
  const { setAuth } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      setAuth(data.user, data.token, data.refreshToken);
      queryClient.invalidateQueries({ queryKey: ['user'] });
      toast({
        title: "Welcome!",
        description: "Account created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Registration failed",
        description: error.response?.data?.message || "Unable to create account",
        variant: "destructive",
      });
    },
  });
};

// Get current user hook
export const useCurrentUser = () => {
  const { isAuthenticated, user } = useAuthStore();

  return useQuery({
    queryKey: ['user'],
    queryFn: authApi.getCurrentUser,
    enabled: isAuthenticated,
    initialData: user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Logout hook
export const useLogout = () => {
  const { clearAuth } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
      toast({
        title: "Logged out",
        description: "Come back soon!",
      });
    },
    onError: () => {
      // Even if logout fails on server, clear local state
      clearAuth();
      queryClient.clear();
    },
  });
};