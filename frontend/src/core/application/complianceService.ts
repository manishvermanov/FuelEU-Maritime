import { ComplianceSummary } from '../domain/compliance';
import { ApiClient } from '../ports/apiClient';

export class ComplianceService {
  constructor(private apiClient: ApiClient) {}

  async getCB(routeId?: string): Promise<ComplianceSummary[]> {
    return this.apiClient.getCB(routeId);
  }

  async getAdjustedCB(): Promise<ComplianceSummary[]> {
    return this.apiClient.getAdjustedCB();
  }
}

