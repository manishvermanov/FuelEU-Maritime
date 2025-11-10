export interface Route {
  id: string;
  code: string;
  vesselType: string;
  fuelType: string;
  year: number;
  baseline: boolean;
  targetIntensity: number;
  actualIntensity: number;
  fuelTons: number;
  createdAt: string;
  updatedAt: string;
}

export interface RouteFilters {
  vesselType?: string;
  fuelType?: string;
  year?: number;
}

