import axios, { InternalAxiosRequestConfig } from 'axios';
import { jwtDecode } from 'jwt-decode';
import { store } from '../Store';
import { logout } from '../Store/slices/auth.slice';

interface RRRequestConfig extends InternalAxiosRequestConfig {
  skipQueue?: boolean;
}

const API_URL = 'http://localhost:8080/api'; // Backend API URL

const Headers: Record<string, string | boolean> = {
  'content-type': 'application/json;charset=utf-8',
  platform: 'React-Native',
};

export const IocoApi= axios.create({
  baseURL: API_URL,
  headers: Headers,
  timeout: 15000,
  validateStatus: (status) => status >= 200,
});

let refreshTokenInProgress = false;
let pendingRequests: Array<(token: string | null) => void> = [];

const getTokenExpirationDate = (token: string): Date | null => {
  try {
    const decodedToken: { exp?: number } = jwtDecode(token);
    if (decodedToken.exp) {
      return new Date(decodedToken.exp * 1000);
    }
    return null;
  } catch (error) {
    return null;
  }
};

const isTokenExpired = (token: string): boolean => {
  if (!token) return true;
  const tokenExpireDate = getTokenExpirationDate(token);
  if (!tokenExpireDate) return true;
  const now = new Date().getTime();
  const fiveMinutes = 5 * 60 * 1000;
  return tokenExpireDate.getTime() - now <= fiveMinutes;
};

const refreshToken = async (rt: string): Promise<{ accessToken: string; refreshToken: string } | null> => {
  try {
    const response = await IocoApi.post('/auth/refresh', 
      { refreshToken: rt }, 
      { 
        skipQueue: true 
      } as RRRequestConfig
    );
    
    if (response.data?.data?.accessToken && response.data?.data?.refreshToken) {
      return {
        accessToken: response.data.data.accessToken,
        refreshToken: response.data.data.refreshToken
      };
    }
    return null;
  } catch (error) {
    console.error('Token refresh failed:', error);
    return null;
  }
};

const handleTokenRefresh = async (refreshTokenValue: string): Promise<void> => {
  if (refreshTokenInProgress) {
    return new Promise<void>((resolve) => {
      pendingRequests.push(() => resolve());
    });
  }

  refreshTokenInProgress = true;
  
  try {
    const tokens = await refreshToken(refreshTokenValue);
    
    if (tokens) {
      // Update tokens in storage
      const { ApiStorage } = await import('./Storage.api');
      await ApiStorage.setAuthToken(tokens.accessToken);
      await ApiStorage.setRefreshToken(tokens.refreshToken);
      
      // Resolve pending requests
      pendingRequests.forEach((resolve) => resolve());
    } else {
      // Refresh failed, logout user
      store.dispatch(logout());
      pendingRequests.forEach((resolve) => resolve());
    }
  } catch (error) {
    store.dispatch(logout());
    pendingRequests.forEach((resolve) => resolve());
  } finally {
    refreshTokenInProgress = false;
    pendingRequests = [];
  }
};

// Request Interceptor
IocoApi.interceptors.request.use(
  async (config: RRRequestConfig) => {
    const state = store.getState();
    const accessToken = state.auth.token;
    const refreshTokenValue = state.auth.refreshToken;

    // Skip queue for certain requests
    if (config.skipQueue) {
      return config;
    }

    // Auto-attach authorization header
    if (accessToken) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    // Token refresh logic
    if (accessToken && isTokenExpired(accessToken) && refreshTokenValue && !refreshTokenInProgress) {
      await handleTokenRefresh(refreshTokenValue);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
IocoApi.interceptors.response.use(
  async (response) => {
    // Handle 401 unauthorized
    if (response.status === 401) {
      store.dispatch(logout());
    }
    
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      store.dispatch(logout());
    }
    return Promise.reject(error);
  }
);

export default IocoApi;

// Export all API modules
export { ApiAuth } from './Auth.api';
export { ApiOrganization } from './Organization.api';
export { ApiCalendarEvent } from './CalendarEvent.api';
export { ApiStorage } from './Storage.api';
export * from './types';