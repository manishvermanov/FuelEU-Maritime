import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PoolService } from '../../../core/application/poolService';
import { PoolCreationInput } from '../../../core/domain/pool';

export function useCreatePool(service: PoolService) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: PoolCreationInput) => service.createPool(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adjustedCB'] });
    },
  });
}

