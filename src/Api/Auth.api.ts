import { IocoApi } from './index';
import { IResponse, LoginRequest, LoginResponse } from './types';

export const ApiAuth = {
  Login: async (data: LoginRequest): Promise<IResponse<LoginResponse>> => {
    return await IocoApi.post('/auth/login', data).then((response) => response.data);
  },

  Register: async (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }): Promise<IResponse<LoginResponse>> => {
    return await IocoApi.post('/auth/register', { ...data, roleId: 2 }).then((response) => response.data);
  },

  Logout: async (): Promise<IResponse<any>> => {
    return await IocoApi.post('/auth/logout').then((response) => response.data);
  },

  RefreshToken: async (refreshToken: string): Promise<IResponse<{ accessToken: string }>> => {
    return await IocoApi.post('/auth/refresh', { refreshToken }).then((response) => response.data);
  },

  ForgotPassword: async (email: string): Promise<IResponse<{ message: string }>> => {
    return await IocoApi.post('/auth/forgot-password', { email }).then((response) => response.data);
  },

  ResetPassword: async (data: {
    token: string;
    newPassword: string;
  }): Promise<IResponse<{ message: string }>> => {
    return await IocoApi.post('/auth/reset-password', data).then((response) => response.data);
  },
};