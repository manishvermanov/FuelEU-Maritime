export interface ComplianceSummary {
  routeId: string;
  code: string;
  cbBefore: number;
  cbAfter: number;
  adjustedCb: number;
  year: number;
}

export interface ComparisonResult {
  routeId: string;
  code: string;
  baselineIntensity: number;
  candidateIntensity: number;
  percentDiff: number;
  compliant: boolean;
}

