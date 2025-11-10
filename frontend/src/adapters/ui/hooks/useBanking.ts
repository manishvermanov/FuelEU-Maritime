import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BankingService } from '../../../core/application/bankingService';

export function useBankSurplus(service: BankingService) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => service.bankSurplus(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cb'] });
    },
  });
}

export function useApplyBank(service: BankingService) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => service.applyBank(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cb'] });
    },
  });
}

