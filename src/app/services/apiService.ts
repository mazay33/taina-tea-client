import { HttpService } from './httpService';

import { AuthApi } from '@/modules/auth/services';

let apiServiceInstance: ApiService | undefined;

class ApiService {
  readonly auth: AuthApi;

  private static endpoints = {
    auth: '/auth'
  };

  constructor(private httpService: HttpService) {
    this.auth = this.createApiInstance(AuthApi, ApiService.endpoints.auth);
  }

  private createApiInstance<T>(ApiClass: new (httpService: HttpService, endpoint: string) => T, endpoint: string): T {
    return new ApiClass(this.httpService, endpoint);
  }
}

export function useApiService(): ApiService {
  if (!apiServiceInstance) {
    const httpService = new HttpService();
    apiServiceInstance = new ApiService(httpService);
  }
  return apiServiceInstance;
}
