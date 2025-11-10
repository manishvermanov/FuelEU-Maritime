import { Route, RouteFilters } from '../domain/route';
import { ApiClient } from '../ports/apiClient';

export class RouteService {
  constructor(private apiClient: ApiClient) {}

  async getRoutes(filters?: RouteFilters): Promise<Route[]> {
    return this.apiClient.getRoutes(filters);
  }

  async setBaseline(routeId: string): Promise<Route> {
    return this.apiClient.setBaseline(routeId);
  }

  async getComparison(): Promise<import('../domain/compliance').ComparisonResult[]> {
    return this.apiClient.getComparison();
  }
}

