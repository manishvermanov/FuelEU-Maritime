import { Pool, PoolCreationInput } from '../domain/pool';
import { ApiClient } from '../ports/apiClient';

export class PoolService {
  constructor(private apiClient: ApiClient) {}

  async createPool(input: PoolCreationInput): Promise<Pool> {
    return this.apiClient.createPool(input);
  }
}

