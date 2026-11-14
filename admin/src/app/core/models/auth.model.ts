export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  id?: number; // Backend optional
  email: string;
  fullName: string;
  password: string;
  phone?: string;
  profileImage?: string;
  role?: string;
  lastLogin?: string; // LocalDateTime from backend
}

export interface AuthResponse {
  jwt: string;
  title: string;
  message: string;
  user: UserDTO;
}

export interface UserDTO {
  id: number;
  email: string;
  fullName: string;
  password?: string; // Only in signup request, not in response
  phone?: string;
  profileImage?: string;
  role?: string;
  lastLogin?: string; // LocalDateTime from backend
  createdAt?: string; // LocalDateTime from backend
  updatedAt?: string; // LocalDateTime from backend
}

export interface ForgetPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface ApiResponse {
  message: string;
  success: boolean;
}

export interface AuthState {
  user: UserDTO | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}
