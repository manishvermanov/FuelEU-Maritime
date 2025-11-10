import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { RouteService } from '../../../core/application/routeService';
import { Route, RouteFilters } from '../../../core/domain/route';
import { ComparisonResult } from '../../../core/domain/compliance';

export function useRoutes(service: RouteService, filters?: RouteFilters) {
  return useQuery({
    queryKey: ['routes', filters],
    queryFn: () => service.getRoutes(filters),
  });
}

export function useSetBaseline(service: RouteService) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (routeId: string) => service.setBaseline(routeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routes'] });
      queryClient.invalidateQueries({ queryKey: ['comparison'] });
    },
  });
}

export function useComparison(service: RouteService) {
  return useQuery({
    queryKey: ['comparison'],
    queryFn: () => service.getComparison(),
  });
}

