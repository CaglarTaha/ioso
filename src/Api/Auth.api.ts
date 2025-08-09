import { IocoApi } from './index';
import { IResponse, LoginRequest, LoginResponse, UserType } from './types';

export const ApiAuth = {
  Login: async (data: LoginRequest): Promise<IResponse<LoginResponse>> => {
    return await IocoApi.post('/auth/login', data).then((response) => response.data);
  },

  Register: async (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    roleId?: number;
  }): Promise<IResponse<UserType>> => {
    const payload = { ...data, roleId: data.roleId ?? 1 };
    return await IocoApi.post('/create/users', payload).then((response) => response.data);
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