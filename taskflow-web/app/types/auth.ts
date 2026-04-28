export interface AuthUser {
  id: string;
  email: string;
  role: string;
}

export interface TokenPair {
  accessToken: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
}
