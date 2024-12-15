export interface IRegisterPayload {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ILoginPaylaod {
  email: string;
  password: string;
}

export interface IToken {
  accessToken: string;
}

export interface IUser {
  id: string;
  email: string;
  roles: string[];
  provider: string | null;
  updatedAt: string;
}
