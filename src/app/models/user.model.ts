export interface RegisterRequest {
  fullName: string;
  emailAddress: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  success: boolean;
  data?: {
    fullName: string;
    email: string;
    token: string;
  };
}

