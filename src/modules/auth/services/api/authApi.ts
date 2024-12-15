import type { AxiosResponse } from 'axios';
import type { HttpService } from '@/app/services';
import type { Either } from '@/app/utils';
import type { ILoginPaylaod, IRegisterPayload, IToken, IUser } from '../../types';

import { Left, Right } from '@/app/utils';
import { ApiErrorFactory, type IApiError } from '@/app/utils';

interface IAuthApi {
  register(paylaod: IRegisterPayload): Promise<Either<IApiError, AxiosResponse<IUser>>>;
  login(paylaod: ILoginPaylaod): Promise<Either<IApiError, AxiosResponse<IToken>>>;
  refresh(): Promise<Either<IApiError, AxiosResponse<IToken>>>;
  logout(): Promise<Either<IApiError, AxiosResponse>>;
  me(): Promise<Either<IApiError, AxiosResponse<IUser>>>;
  loginWithYandex(): Promise<Either<IApiError, AxiosResponse<IToken>>>;
}

export class AuthApi implements IAuthApi {
  protected resourceUrl;

  constructor(protected httpService: HttpService, resourceUrl: string) {
    this.resourceUrl = resourceUrl;
  }

  public async register(payload: IRegisterPayload): Promise<Either<IApiError, AxiosResponse<IUser>>> {
    try {
      const response = await this.httpService.post<IUser>(`${this.resourceUrl}/register`, payload);
      return Right.create(response);
    }
    catch (error: unknown) {
      const { email } = payload;
      const apiError = ApiErrorFactory.create(error, { email });
      return Left.create(apiError);
    }
  }

  public async login(payload: ILoginPaylaod): Promise<Either<IApiError, AxiosResponse<IToken>>> {
    try {
      const response = await this.httpService.post<IToken>(`${this.resourceUrl}/login`, payload);
      return Right.create(response);
    }
    catch (error: unknown) {
      const { email } = payload;
      const apiError = ApiErrorFactory.create(error, { email });
      return Left.create(apiError);
    }
  }

  public async refresh(): Promise<Either<IApiError, AxiosResponse<IToken>>> {
    try {
      const response = await this.httpService.get<IToken>(`${this.resourceUrl}/refresh-tokens`);
      return Right.create(response);
    }
    catch (error: unknown) {
      const apiError = ApiErrorFactory.create(error);
      return Left.create(apiError);
    }
  }

  public async logout(): Promise<Either<IApiError, AxiosResponse>> {
    try {
      const response = await this.httpService.get(`${this.resourceUrl}/logout`);
      return Right.create(response);
    }
    catch (error: unknown) {
      const apiError = ApiErrorFactory.create(error);
      return Left.create(apiError);
    }
  }

  public async me(): Promise<Either<IApiError, AxiosResponse<IUser>>> {
    try {
      const response = await this.httpService.get<IUser>(`user/me`);
      return Right.create(response);
    }
    catch (error: unknown) {
      const apiError = ApiErrorFactory.create(error);
      return Left.create(apiError);
    }
  }

  public async loginWithYandex(): Promise<Either<IApiError, AxiosResponse<IToken>>> {
    try {
      const response = await this.httpService.get<IToken>(`${this.resourceUrl}/yandex`);
      return Right.create(response);
    }
    catch (error: unknown) {
      const apiError = ApiErrorFactory.create(error);
      return Left.create(apiError);
    }
  }
}
