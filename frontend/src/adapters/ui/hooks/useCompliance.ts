import { useQuery } from '@tanstack/react-query';
import { ComplianceService } from '../../../core/application/complianceService';
import { ComplianceSummary } from '../../../core/domain/compliance';

export function useCB(service: ComplianceService, routeId?: string) {
  return useQuery({
    queryKey: ['cb', routeId],
    queryFn: () => service.getCB(routeId),
  });
}

export function useAdjustedCB(service: ComplianceService) {
  return useQuery({
    queryKey: ['adjustedCB'],
    queryFn: () => service.getAdjustedCB(),
  });
}

