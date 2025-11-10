import { Route, RouteFilters } from '../domain/route';
import { ComplianceSummary, ComparisonResult } from '../domain/compliance';
import { BankEntry, BankingSummary } from '../domain/banking';
import { Pool, PoolCreationInput } from '../domain/pool';

export interface ApiClient {
  getRoutes(filters?: RouteFilters): Promise<Route[]>;
  setBaseline(routeId: string): Promise<Route>;
  getComparison(): Promise<ComparisonResult[]>;
  getCB(routeId?: string): Promise<ComplianceSummary[]>;
  getAdjustedCB(): Promise<ComplianceSummary[]>;
  bankSurplus(): Promise<BankingSummary>;
  applyBank(): Promise<{ applied: number; cbAfter: number; bankRemaining: number }>;
  createPool(input: PoolCreationInput): Promise<Pool>;
}

