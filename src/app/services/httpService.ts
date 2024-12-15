import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

import axios from 'axios';

import { abortControllerManager } from '../utils/AbortControllerManager';

import { useAuthStore } from '@/modules/auth';

// Интерфейс для конфигурации сервиса
interface HttpServiceConfig {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
  withCredentials?: boolean;
}

interface CustomAxiosInternalRequestConfig extends InternalAxiosRequestConfig {
  _isRetry?: boolean;
  skipAbortSignal?: boolean;
}

export interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  skipAbortSignal?: boolean;
}

// Основной HttpService класс
export class HttpService {
  private axiosInstance: AxiosInstance;
  private defaultConfig: HttpServiceConfig;

  constructor(config: HttpServiceConfig = {}) {
    this.defaultConfig = {
      baseURL: 'http://localhost:3000/api',
      timeout: config.timeout || 20000,
      headers: config.headers || { 'Content-Type': 'application/json' },
      withCredentials: true
    };

    this.axiosInstance = axios.create(this.defaultConfig);

    // Пример interceptor'ов
    this.axiosInstance.interceptors.request.use(this.handleRequest.bind(this), this.handleError.bind(this));
    this.axiosInstance.interceptors.response.use(this.handleResponse.bind(this), this.handleError.bind(this));
  }

  // Метод для обработки запроса перед его отправкой
  private handleRequest(config: CustomAxiosInternalRequestConfig): CustomAxiosInternalRequestConfig | Promise<CustomAxiosInternalRequestConfig> {
    if (!config.skipAbortSignal) {
      const controller = abortControllerManager.createController();
      config.signal = controller.signal;
    }

    const authStore = useAuthStore();

    if (authStore.accessToken) {
      config.headers.Authorization = `${authStore.accessToken}`;
    }
    return config;
  }

  // Метод для обработки ответа
  private handleResponse(response: AxiosResponse): AxiosResponse {
    return response;
  }

  private isRefreshing: boolean = false; // Flag to prevent multiple refresh requests
  private refreshFailed: boolean = false; // Flag to prevent infinite retry loops

  private async handleError(error: AxiosError): Promise<AxiosResponse | void> {
    const originalRequest = error.config as CustomAxiosInternalRequestConfig;

    if (error.config?.url?.includes('/auth/refresh') && error.response?.status === 401) {
      throw error;
    }

    if (!originalRequest) {
      return;
    }

    if (this.refreshFailed) {
      return Promise.reject(error);
    }

    if (error.response && error.response.status === 401 && !originalRequest._isRetry) {
      originalRequest._isRetry = true;

      if (!this.isRefreshing) {
        this.isRefreshing = true;

        try {
          const authStore = useAuthStore();
          await authStore.refreshToken();

          this.isRefreshing = false;

          return this.axiosInstance.request(originalRequest);
        }
        catch (e) {
          this.isRefreshing = false;
          this.refreshFailed = true;
          return Promise.reject(e);
        }
      }
      else {
        return new Promise((resolve): void => {
          const checkIfDone = (): void => {
            if (!this.isRefreshing) {
              resolve(this.axiosInstance.request(originalRequest));
            }
            else {
              setTimeout(checkIfDone, 100);
            }
          };
          checkIfDone();
        });
      }
    }

    return Promise.reject(error);
  }

  // Основные методы для выполнения запросов
  public get<ResData = unknown>(url: string, config?: CustomAxiosRequestConfig): Promise<AxiosResponse<ResData>> {
    return this.axiosInstance.get<ResData>(url, config);
  }

  public post<ResData = unknown, ReqData = unknown>(url: string, data?: ReqData, config?: CustomAxiosRequestConfig): Promise<AxiosResponse<ResData>> {
    return this.axiosInstance.post<ResData, AxiosResponse<ResData>, ReqData>(url, data, config);
  }

  public put<ResData = unknown, ReqData = unknown>(url: string, data?: ReqData, config?: CustomAxiosRequestConfig): Promise<AxiosResponse<ResData>> {
    return this.axiosInstance.put<ResData, AxiosResponse<ResData>, ReqData>(url, data, config);
  }

  public patch<ResData = unknown, ReqData = unknown>(url: string, data?: ReqData, config?: CustomAxiosRequestConfig): Promise<AxiosResponse<ResData>> {
    return this.axiosInstance.patch<ResData, AxiosResponse<ResData>, ReqData>(url, data, config);
  }

  public delete<ResData = unknown>(url: string, config?: CustomAxiosRequestConfig): Promise<AxiosResponse<ResData>> {
    return this.axiosInstance.delete<ResData>(url, config);
  }

  // Метод для обновления конфигурации сервиса
  public updateConfig(config: HttpServiceConfig): void {
    this.defaultConfig = { ...this.defaultConfig, ...config };
    Object.assign(this.axiosInstance.defaults, this.defaultConfig);
  }
}
