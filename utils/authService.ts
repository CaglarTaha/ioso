import apiService from './apiService';
import { StorageService } from './storage';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  data: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
  };
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roleId: number;
}

export class AuthService {
  // Login işlemi
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      console.log('🔐 Login attempt:', credentials.email);
      const response = await apiService.post<AuthResponse>('/public/user/login', credentials);
      
      // Token ve user data'yı kaydet
      await StorageService.setAuthToken(response.token);
      await StorageService.setUserData(response.data);
      await StorageService.setIsLoggedIn(true);
      
      console.log('✅ Login successful');
      return response;
    } catch (error: any) {
      console.error('❌ Login failed:', error);
      throw new Error(error.response?.data?.error || 'Login failed');
    }
  }

  // Register işlemi
  static async register(registerData: RegisterData): Promise<any> {
    try {
      const response = await apiService.post('/public/create/users', registerData);
      
      console.log('✅ Registration successful');
      return response;
    } catch (error: any) {
      console.error('❌ Registration failed:', error);
      throw new Error(error.response?.data?.error || 'Registration failed');
    }
  }

  // Logout işlemi
  static async logout(): Promise<void> {
    try {
      // Local storage'ı temizle
      await StorageService.clearAuthData();
      await StorageService.setIsLoggedIn(false);
      
      console.log('✅ Logout successful');
    } catch (error) {
      console.error('❌ Logout failed:', error);
      throw error;
    }
  }

  // Kullanıcı profilini getir
  static async getUserProfile(): Promise<any> {
    try {
      const userData = await StorageService.getUserData();
      return userData;
    } catch (error) {
      console.error('❌ Get user profile failed:', error);
      throw error;
    }
  }

  // Token geçerliliğini kontrol et
  static async isAuthenticated(): Promise<boolean> {
    try {
      const token = await StorageService.getAuthToken();
      const isLoggedIn = await StorageService.getIsLoggedIn();
      return !!(token && isLoggedIn);
    } catch (error) {
      console.error('Auth check failed:', error);
      return false;
    }
  }

  // Stored user data'yı al
  static async getStoredUserData(): Promise<any | null> {
    return await StorageService.getUserData();
  }
}

export default AuthService;