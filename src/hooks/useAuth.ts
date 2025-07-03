import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/auth';
import { 
  LoginRequest, 
  LoginResponse, 
  RegisterRequest, 
  User,
  RefreshTokenRequest,
  RefreshTokenResponse,
  ChangePasswordRequest,
  PasswordResetRequest,
  PasswordResetRequestRequest,
  VerifyOtpRequest,
  ResendOtpRequest
} from '@/types/api';
import { toast } from '@/hooks/use-toast';

// Auth API functions
const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post('/users/email-login', credentials);
    return response.data;
  },

  register: async (userData: RegisterRequest): Promise<RegisterRequest> => {
    const response = await api.post('/users/email-register', userData);
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
    const response = await api.post('/users/login/refresh', { refresh: refreshToken });
    return response.data;
  },

  changePassword: async (data: ChangePasswordRequest): Promise<ChangePasswordRequest> => {
    const response = await api.post('/users/change-password', data);
    return response.data;
  },

  passwordResetRequest: async (data: PasswordResetRequestRequest): Promise<PasswordResetRequestRequest> => {
    const response = await api.post('/users/password-reset-request', data);
    return response.data;
  },

  passwordReset: async (data: PasswordResetRequest): Promise<PasswordResetRequest> => {
    const response = await api.post('/users/password-reset', data);
    return response.data;
  },

  verifyOtp: async (data: VerifyOtpRequest): Promise<VerifyOtpRequest> => {
    const response = await api.post('/users/verify-otp', data);
    return response.data;
  },

  resendOtp: async (data: ResendOtpRequest): Promise<ResendOtpRequest> => {
    const response = await api.post('/users/resend-otp', data);
    return response.data;
  },
};

// Login hook
export const useLogin = () => {
  const { setAuth } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: async (data) => {
      // Fetch user profile after successful login
      try {
        const user = await authApi.getCurrentUser();
        setAuth(user, data.access_token, data.refresh_token);
        queryClient.invalidateQueries({ queryKey: ['user'] });
        toast({
          title: "Welcome back!",
          description: `Logged in as ${user.fullname}`,
        });
      } catch (error) {
        toast({
          title: "Login failed",
          description: "Unable to fetch user profile",
          variant: "destructive",
        });
      }
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      toast({
        title: "Registration successful!",
        description: "Please verify your email to continue",
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
    mutationFn: async () => {
      // No server logout endpoint, just clear local state
      clearAuth();
      queryClient.clear();
    },
    onSuccess: () => {
      toast({
        title: "Logged out",
        description: "Come back soon!",
      });
    },
  });
};

// Change password hook
export const useChangePassword = () => {
  return useMutation({
    mutationFn: authApi.changePassword,
    onSuccess: () => {
      toast({
        title: "Password changed",
        description: "Your password has been updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Password change failed",
        description: error.response?.data?.message || "Unable to change password",
        variant: "destructive",
      });
    },
  });
};

// Password reset request hook
export const usePasswordResetRequest = () => {
  return useMutation({
    mutationFn: authApi.passwordResetRequest,
    onSuccess: () => {
      toast({
        title: "Reset code sent",
        description: "Check your email for the reset code",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Reset request failed",
        description: error.response?.data?.message || "Unable to send reset code",
        variant: "destructive",
      });
    },
  });
};

// Password reset hook
export const usePasswordReset = () => {
  return useMutation({
    mutationFn: authApi.passwordReset,
    onSuccess: () => {
      toast({
        title: "Password reset successful",
        description: "You can now login with your new password",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Password reset failed",
        description: error.response?.data?.message || "Invalid reset code",
        variant: "destructive",
      });
    },
  });
};

// Verify OTP hook
export const useVerifyOtp = () => {
  return useMutation({
    mutationFn: authApi.verifyOtp,
    onSuccess: () => {
      toast({
        title: "Email verified",
        description: "Your account has been verified successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Verification failed",
        description: error.response?.data?.message || "Invalid OTP code",
        variant: "destructive",
      });
    },
  });
};

// Resend OTP hook
export const useResendOtp = () => {
  return useMutation({
    mutationFn: authApi.resendOtp,
    onSuccess: () => {
      toast({
        title: "OTP resent",
        description: "Check your email for the new verification code",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Resend failed",
        description: error.response?.data?.message || "Unable to resend OTP",
        variant: "destructive",
      });
    },
  });
};