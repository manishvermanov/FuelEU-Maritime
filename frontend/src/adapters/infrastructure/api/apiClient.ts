import axios, { AxiosInstance } from 'axios';
import { ApiClient } from './apiClient';
import { Route, RouteFilters } from '../../../core/domain/route';
import { ComplianceSummary, ComparisonResult } from '../../../core/domain/compliance';
import { BankingSummary } from '../../../core/domain/banking';
import { Pool, PoolCreationInput } from '../../../core/domain/pool';

export class ApiClientAxios implements ApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string = 'http://localhost:3000/api') {
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async getRoutes(filters?: RouteFilters): Promise<Route[]> {
    const response = await this.client.get<{ data: Route[] }>('/routes', { params: filters });
    return response.data.data;
  }

  async setBaseline(routeId: string): Promise<Route> {
    const response = await this.client.post<{ data: Route }>(`/routes/${routeId}/baseline`);
    return response.data.data;
  }

  async getComparison(): Promise<ComparisonResult[]> {
    const response = await this.client.get<{ data: ComparisonResult[] }>('/routes/comparison');
    return response.data.data;
  }

  async getCB(routeId: string): Promise<ComplianceSummary[]> {
    const response = await this.client.get<{ data: ComplianceSummary[] }>('/compliance/cb', {
      params: { routeId },
    });
    return response.data.data;
  }

  async getAdjustedCB(routeId: string): Promise<ComplianceSummary[]> {
    const response = await this.client.get<{ data: ComplianceSummary[] }>('/compliance/adjusted-cb', {
      params: { routeId },
    });
    return response.data.data;
  }

  async bankSurplus(): Promise<BankingSummary> {
    const response = await this.client.post<{ data: BankingSummary }>('/banking/bank');
    return response.data.data;
  }

  async applyBank(): Promise<{ applied: number; cbAfter: number; bankRemaining: number }> {
    const response = await this.client.post<{ data: { applied: number; cbAfter: number; bankRemaining: number } }>(
      '/banking/apply'
    );
    return response.data.data;
  }

  async createPool(input: PoolCreationInput): Promise<Pool> {
    const response = await this.client.post<{ data: Pool }>('/pools', input);
    return response.data.data;
  }
}
