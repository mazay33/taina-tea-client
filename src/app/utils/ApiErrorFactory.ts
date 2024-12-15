/* eslint-disable @typescript-eslint/no-explicit-any */
import { isAxiosError } from 'axios';

export enum API_ERROR_CODE {
  METHOD_IS_NOT_FOUND = 1000,
  ARGUMENT_COUNT_ERROR = 1001,
  INTERNAL_ERROR = 1002,
  SQL_ERROR = 1003,
  ROWS_NOT_FOUND = 1004,
  VALIDATION_ERROR = 1005,
  USER_NOT_AUTHORIZED = 1006,
  DATABASE_UNIQUE_ERROR = 1007,
  LOGOUT_AUTH_ERROR = 1008,
  REDIS_CONNECTION_ERROR = 1009,
  MODEL_IS_EMPTY = 1010,
  ACCESS_FORBIDDEN = 1011,
  CONFLICT_ERROR = 1012,
  DATABASE_CONNECTION_ERROR = 1017,
  CREDENTIALS_INCORRECT = 1013,
  AUTHORIZATION_TIMEOUT_ERROR = 1014,
  GUZZLE_CONNECTION_ERROR = 1015,
  UNEXPECTED_VALUE_EXCEPTION = 1016,
  INVALID_MATCH_EXCEPTION = 1018,
  FILE_ALREADY_UPLOADED = 1019,
  CREATE_FOLDER_ERROR = 1020,
  REPORT_GENERATION_ERROR = 1021,
  AC_FACT_VALUE_ERROR = 1022,
  QUEUE_ERROR = 1023,
  HTTP_CONNECTION_ERROR = 1024,
  RATE_LIMITER_ERROR = 1025,
  SQL_UNIQUE_KEY_ERROR = 1026,
  ACTION_UNAUTHORIZED = 1027,
  MAIL_SENDING_ERROR = 1028,
  MINIO_STORE_ERROR = 2001,
  BITRIX_RESULT_ERROR = 3001
}

const DEFAULT_ERROR_CODE = -1;
const DEFAULT_ERROR_MESSAGE = 'Произошла неизвестная ошибка';

export const errorApiMapRu: Record<API_ERROR_CODE, { message: string; userFriendly: boolean }> = {
  [API_ERROR_CODE.METHOD_IS_NOT_FOUND]: { message: 'Метод не найден', userFriendly: false },
  [API_ERROR_CODE.ARGUMENT_COUNT_ERROR]: { message: 'Ошибка количества аргументов', userFriendly: false },
  [API_ERROR_CODE.INTERNAL_ERROR]: { message: 'Внутренняя ошибка', userFriendly: false },
  [API_ERROR_CODE.SQL_ERROR]: { message: 'Ошибка SQL', userFriendly: false },
  [API_ERROR_CODE.ROWS_NOT_FOUND]: { message: 'Строки не найдены', userFriendly: true },
  [API_ERROR_CODE.VALIDATION_ERROR]: { message: 'Ошибка валидации', userFriendly: true },
  [API_ERROR_CODE.USER_NOT_AUTHORIZED]: { message: 'Пользователь не авторизован', userFriendly: true },
  [API_ERROR_CODE.DATABASE_UNIQUE_ERROR]: { message: 'Ошибка уникальности базы данных', userFriendly: true },
  [API_ERROR_CODE.LOGOUT_AUTH_ERROR]: { message: 'Ошибка выхода из системы', userFriendly: false },
  [API_ERROR_CODE.REDIS_CONNECTION_ERROR]: { message: 'Ошибка подключения к Redis', userFriendly: false },
  [API_ERROR_CODE.MODEL_IS_EMPTY]: { message: 'Модель пуста', userFriendly: true },
  [API_ERROR_CODE.ACCESS_FORBIDDEN]: { message: 'Доступ запрещен', userFriendly: false },
  [API_ERROR_CODE.CONFLICT_ERROR]: { message: 'Конфликт ошибки', userFriendly: true },
  [API_ERROR_CODE.DATABASE_CONNECTION_ERROR]: { message: 'Ошибка подключения к базе данных', userFriendly: false },
  [API_ERROR_CODE.CREDENTIALS_INCORRECT]: { message: 'Предоставленные учетные данные неверны', userFriendly: true },
  [API_ERROR_CODE.AUTHORIZATION_TIMEOUT_ERROR]: { message: 'Тайм-аут авторизации', userFriendly: false },
  [API_ERROR_CODE.GUZZLE_CONNECTION_ERROR]: { message: 'Ошибка подключения Guzzle', userFriendly: false },
  [API_ERROR_CODE.UNEXPECTED_VALUE_EXCEPTION]: { message: 'Неожиданное значение', userFriendly: false },
  [API_ERROR_CODE.INVALID_MATCH_EXCEPTION]: { message: 'Ошибка несоответствия', userFriendly: true },
  [API_ERROR_CODE.FILE_ALREADY_UPLOADED]: { message: 'Файл уже был загружен', userFriendly: true },
  [API_ERROR_CODE.CREATE_FOLDER_ERROR]: { message: 'Ошибка создания папки', userFriendly: false },
  [API_ERROR_CODE.REPORT_GENERATION_ERROR]: { message: 'Ошибка генерации отчета', userFriendly: false },
  [API_ERROR_CODE.AC_FACT_VALUE_ERROR]: { message: 'Ошибка значения AC_FACT', userFriendly: false },
  [API_ERROR_CODE.QUEUE_ERROR]: { message: 'Ошибка очереди', userFriendly: false },
  [API_ERROR_CODE.HTTP_CONNECTION_ERROR]: { message: 'Ошибка HTTP подключения', userFriendly: false },
  [API_ERROR_CODE.RATE_LIMITER_ERROR]: { message: 'Слишком много запросов. Повторите попытку позже', userFriendly: true },
  [API_ERROR_CODE.SQL_UNIQUE_KEY_ERROR]: { message: 'Ошибка уникального ключа SQL', userFriendly: true },
  [API_ERROR_CODE.ACTION_UNAUTHORIZED]: { message: 'Это действие не разрешено', userFriendly: true },
  [API_ERROR_CODE.MAIL_SENDING_ERROR]: { message: 'Ошибка при отправке почты', userFriendly: false },
  [API_ERROR_CODE.MINIO_STORE_ERROR]: { message: 'Ошибка хранения Minio', userFriendly: false },
  [API_ERROR_CODE.BITRIX_RESULT_ERROR]: { message: 'Ошибка результата Bitrix', userFriendly: false }
};
export interface IApiError {
  code: number;
  message: string;
  userFriendly: boolean;
  customMessage?: string;
  url?: string;
  method?: string;
  status?: number;
  requestData?: any;
}

class ApiError extends Error {
  constructor(
    public code: number,
    public message: string,
    public userFriendly: boolean,
    public customMessage?: string,
    public url?: string,
    public method?: string,
    public status?: number,
    public requestData?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }

  toObject(): IApiError {
    return {
      code: this.code,
      message: this.message,
      userFriendly: this.userFriendly,
      customMessage: this.customMessage,
      url: this.url,
      method: this.method,
      status: this.status,
      requestData: this.requestData
    };
  }

  toJSON(): IApiError {
    return this.toObject();
  }
}

export class ApiErrorFactory {
  static create(error: unknown, requestData?: any, customMessage?: string): IApiError {
    if (isAxiosError(error)) {
      const { response, config } = error;
      const responseData = response?.data;
      const url = config?.url;
      const method = config?.method;
      const status = response?.status;

      if (responseData) {
        const code: number = responseData.code ?? DEFAULT_ERROR_CODE;

        const apiErrorCode = code as API_ERROR_CODE;

        const { message = DEFAULT_ERROR_MESSAGE, userFriendly = false } = errorApiMapRu[apiErrorCode] || {};

        const apiError = new ApiError(
          apiErrorCode,
          message,
          userFriendly,
          customMessage,
          url,
          method,
          status,
          requestData
        );

        console.error('👾👾👾 API_ERROR:', apiError.toJSON());
        return apiError.toJSON();
      }
    }

    console.error('Произошла неизвестная ошибка:', error);
    return {
      code: DEFAULT_ERROR_CODE,
      message: DEFAULT_ERROR_MESSAGE,
      userFriendly: false,
      customMessage,
      requestData
    };
  }
}
