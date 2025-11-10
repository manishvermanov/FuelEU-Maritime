export interface BankEntry {
  id: string;
  routeId: string | null;
  amount: number;
  action: 'SURPLUS' | 'APPLIED';
  description: string | null;
  createdAt: string;
}

export interface BankingSummary {
  totalSurplus: number;
  eligibleRoutes: Array<{
    routeId: string;
    cbBefore: number;
  }>;
}

