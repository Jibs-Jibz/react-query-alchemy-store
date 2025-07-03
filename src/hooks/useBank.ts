import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { 
  BankDetails, 
  CreateBankDetailsRequest, 
  VerifyAccountRequest, 
  VerifyAccountResponse,
  SupportRequest
} from '@/types/api';
import { toast } from '@/hooks/use-toast';

// Bank API functions
const bankApi = {
  getBankDetails: async (): Promise<BankDetails> => {
    const response = await api.get('/swap/bank-details');
    return response.data;
  },

  createBankDetails: async (bankData: CreateBankDetailsRequest): Promise<CreateBankDetailsRequest> => {
    const response = await api.post('/swap/bank-details', bankData);
    return response.data;
  },

  verifyAccount: async (verifyData: VerifyAccountRequest): Promise<VerifyAccountResponse> => {
    const response = await api.post('/swap/verify-account', verifyData);
    return response.data;
  },

  submitSupport: async (supportData: SupportRequest): Promise<SupportRequest> => {
    const response = await api.post('/swap/support', supportData);
    return response.data;
  },
};

// Get bank details hook
export const useBankDetails = () => {
  return useQuery({
    queryKey: ['bank-details'],
    queryFn: bankApi.getBankDetails,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Create bank details hook
export const useCreateBankDetails = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bankApi.createBankDetails,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bank-details'] });
      toast({
        title: "Bank details saved",
        description: "Your bank information has been saved successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Save failed",
        description: error.response?.data?.message || "Unable to save bank details",
        variant: "destructive",
      });
    },
  });
};

// Verify account hook
export const useVerifyAccount = () => {
  return useMutation({
    mutationFn: bankApi.verifyAccount,
    onSuccess: (data) => {
      if (data.status === 'success') {
        toast({
          title: "Account verified",
          description: `Account belongs to ${data.account_name}`,
        });
      } else {
        toast({
          title: "Verification failed",
          description: "Unable to verify account details",
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Verification failed",
        description: error.response?.data?.message || "Unable to verify account",
        variant: "destructive",
      });
    },
  });
};

// Submit support hook
export const useSubmitSupport = () => {
  return useMutation({
    mutationFn: bankApi.submitSupport,
    onSuccess: () => {
      toast({
        title: "Support ticket submitted",
        description: "We'll get back to you as soon as possible",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Submission failed",
        description: error.response?.data?.message || "Unable to submit support ticket",
        variant: "destructive",
      });
    },
  });
};