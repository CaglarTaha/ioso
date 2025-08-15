import { IocoApi } from './index';
import { IResponse, OrganizationType, CreateOrganizationRequest } from './types';

export const ApiOrganization = {
  GetAll: async (): Promise<IResponse<OrganizationType[]>> => {
    return await IocoApi.get('/organizations').then((response) => response.data);
  },

  GetById: async (id: number): Promise<IResponse<any>> => {
    return await IocoApi.get(`/organizations/detail/${id}`).then((response) => response.data);
  },

  Create: async (data: CreateOrganizationRequest): Promise<IResponse<OrganizationType>> => {
    return await IocoApi.post('/organizations', data).then((response) => response.data);
  },

  Update: async (id: number, data: Partial<CreateOrganizationRequest>): Promise<IResponse<OrganizationType>> => {
    return await IocoApi.put(`/organizations/${id}`, data).then((response) => response.data);
  },

  Delete: async (id: number): Promise<IResponse<any>> => {
    return await IocoApi.delete(`/organizations/${id}`).then((response) => response.data);
  },

  GetUserOrganizations: async (): Promise<IResponse<OrganizationType[]>> => {
    return await IocoApi.get('/organizations/my').then((response) => response.data);
  },

  AddMember: async (organizationId: number, userId: number): Promise<IResponse<OrganizationType>> => {
    return await IocoApi.post(`/organizations/${organizationId}/members`, { userId }).then((response) => response.data);
  },

  RemoveMember: async (organizationId: number, userId: number): Promise<IResponse<any>> => {
    return await IocoApi.delete(`/organizations/${organizationId}/members/${userId}`).then((response) => response.data);
  },
};