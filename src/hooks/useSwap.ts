import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { 
  CoinSwapRequest, 
  Transaction, 
  RateCalculatorRequest, 
  RateCalculatorResponse,
  SwapSortRequest,
  UpdateTransactionRequest,
  UsdRateResponse
} from '@/types/api';
import { toast } from '@/hooks/use-toast';

// Swap API functions
const swapApi = {
  createCoinSwap: async (swapData: CoinSwapRequest): Promise<Transaction> => {
    const response = await api.post('/swap/coin-swap', swapData);
    return response.data;
  },

  calculateRate: async (rateData: RateCalculatorRequest): Promise<RateCalculatorResponse> => {
    const response = await api.post('/swap/rate-calculator', rateData);
    return response.data;
  },

  getTransactions: async (params?: {
    asset?: string;
    status?: string;
    date?: string;
    start?: string;
    end?: string;
  }): Promise<Transaction[]> => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) searchParams.append(key, value);
      });
    }
    const response = await api.get(`/swap/transactions?${searchParams.toString()}`);
    return response.data;
  },

  getTransactionByRef: async (ref: string): Promise<Transaction> => {
    const response = await api.get(`/swap/transactions/${ref}`);
    return response.data;
  },

  sortTransactions: async (sortData: SwapSortRequest): Promise<Transaction[]> => {
    const response = await api.post('/swap/swap-sort', sortData);
    return response.data;
  },

  updateTransaction: async ({ id, ...updateData }: UpdateTransactionRequest & { id: number }): Promise<UpdateTransactionRequest> => {
    const response = await api.put(`/swap/update-swap/${id}`, updateData);
    return response.data;
  },

  getUsdRate: async (): Promise<UsdRateResponse> => {
    const response = await api.get('/swap/usd-rate');
    return response.data;
  },
};

// Create coin swap hook
export const useCreateCoinSwap = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: swapApi.createCoinSwap,
    onSuccess: (newSwap) => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast({
        title: "Swap created",
        description: `Your ${newSwap.coin_name} swap has been initiated`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Swap failed",
        description: error.response?.data?.message || "Unable to create swap",
        variant: "destructive",
      });
    },
  });
};

// Calculate rate hook
export const useCalculateRate = () => {
  return useMutation({
    mutationFn: swapApi.calculateRate,
    onError: (error: any) => {
      toast({
        title: "Rate calculation failed",
        description: error.response?.data?.message || "Unable to calculate rate",
        variant: "destructive",
      });
    },
  });
};

// Get transactions hook
export const useTransactions = (params?: {
  asset?: string;
  status?: string;
  date?: string;
  start?: string;
  end?: string;
}) => {
  return useQuery({
    queryKey: ['transactions', params],
    queryFn: () => swapApi.getTransactions(params),
    staleTime: 30 * 1000, // 30 seconds
  });
};

// Get single transaction hook
export const useTransaction = (ref: string) => {
  return useQuery({
    queryKey: ['transaction', ref],
    queryFn: () => swapApi.getTransactionByRef(ref),
    enabled: !!ref,
  });
};

// Sort transactions hook
export const useSortTransactions = () => {
  return useMutation({
    mutationFn: swapApi.sortTransactions,
    onError: (error: any) => {
      toast({
        title: "Sort failed",
        description: error.response?.data?.message || "Unable to sort transactions",
        variant: "destructive",
      });
    },
  });
};

// Update transaction hook
export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: swapApi.updateTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast({
        title: "Transaction updated",
        description: "Transaction status has been updated",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update failed",
        description: error.response?.data?.message || "Unable to update transaction",
        variant: "destructive",
      });
    },
  });
};

// Get USD rate hook
export const useUsdRate = () => {
  return useQuery({
    queryKey: ['usd-rate'],
    queryFn: swapApi.getUsdRate,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
};