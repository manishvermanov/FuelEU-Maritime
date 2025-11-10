import { BankingSummary } from '../domain/banking';
import { ApiClient } from '../ports/apiClient';

export class BankingService {
  constructor(private apiClient: ApiClient) {}

  async bankSurplus(): Promise<BankingSummary> {
    return this.apiClient.bankSurplus();
  }

  async applyBank(): Promise<{ applied: number; cbAfter: number; bankRemaining: number }> {
    return this.apiClient.applyBank();
  }
}

