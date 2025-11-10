export interface PoolMember {
  routeId: string;
  code: string;
  cbBefore: number;
  cbAfter: number;
  allocated: number;
}

export interface Pool {
  id: string;
  name: string;
  totalBefore: number;
  totalAfter: number;
  members: PoolMember[];
  createdAt: string;
}

export interface PoolCreationInput {
  name: string;
  memberRouteIds: string[];
}

