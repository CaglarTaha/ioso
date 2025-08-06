import apiService from './apiService';

export interface Organization {
  id: number;
  name: string;
  description?: string;
  members: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  }[];
  events: any[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrganizationDto {
  name: string;
  description?: string;
}

export interface UpdateOrganizationDto {
  name?: string;
  description?: string;
}

export class OrganizationService {
  // Kullanıcının organizasyonlarını getir
  static async getUserOrganizations(): Promise<Organization[]> {
    try {
      console.log('🏢 Fetching user organizations...');
      const response = await apiService.get<Organization[]>('/api/organizations/my');
      console.log('✅ Organizations fetched:', response.length);
      return response;
    } catch (error: any) {
      console.error('❌ Get user organizations failed:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch organizations');
    }
  }

  // Tüm organizasyonları getir (public)
  static async getAllOrganizations(): Promise<Organization[]> {
    try {
      console.log('🏢 Fetching all organizations...');
      const response = await apiService.get<Organization[]>('/api/organizations');
      console.log('✅ All organizations fetched:', response.length);
      return response;
    } catch (error: any) {
      console.error('❌ Get all organizations failed:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch organizations');
    }
  }

  // Yeni organizasyon oluştur
  static async createOrganization(data: CreateOrganizationDto): Promise<Organization> {
    try {
      console.log('🏢 Creating organization:', data.name);
      const response = await apiService.post<Organization>('/api/organizations', data);
      console.log('✅ Organization created:', response.id);
      return response;
    } catch (error: any) {
      console.error('❌ Create organization failed:', error);
      throw new Error(error.response?.data?.error || 'Failed to create organization');
    }
  }

  // Organizasyon detayını getir
  static async getOrganizationById(id: number): Promise<Organization> {
    try {
      console.log('🏢 Fetching organization:', id);
      const response = await apiService.get<Organization>(`/api/organizations/${id}`);
      console.log('✅ Organization fetched:', response.name);
      return response;
    } catch (error: any) {
      console.error('❌ Get organization failed:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch organization');
    }
  }

  // Organizasyonu güncelle
  static async updateOrganization(id: number, data: UpdateOrganizationDto): Promise<Organization> {
    try {
      console.log('🏢 Updating organization:', id);
      const response = await apiService.put<Organization>(`/api/organizations/${id}`, data);
      console.log('✅ Organization updated:', response.name);
      return response;
    } catch (error: any) {
      console.error('❌ Update organization failed:', error);
      throw new Error(error.response?.data?.error || 'Failed to update organization');
    }
  }

  // Organizasyonu sil
  static async deleteOrganization(id: number): Promise<void> {
    try {
      console.log('🏢 Deleting organization:', id);
      await apiService.delete(`/api/organizations/${id}`);
      console.log('✅ Organization deleted');
    } catch (error: any) {
      console.error('❌ Delete organization failed:', error);
      throw new Error(error.response?.data?.error || 'Failed to delete organization');
    }
  }

  // Organizasyona üye ekle
  static async addMember(organizationId: number, userId: number): Promise<Organization> {
    try {
      console.log('🏢 Adding member to organization:', { organizationId, userId });
      const response = await apiService.post<Organization>(`/api/organizations/${organizationId}/members`, { userId });
      console.log('✅ Member added to organization');
      return response;
    } catch (error: any) {
      console.error('❌ Add member failed:', error);
      throw new Error(error.response?.data?.error || 'Failed to add member');
    }
  }

  // Organizasyondan üye çıkar
  static async removeMember(organizationId: number, userId: number): Promise<Organization> {
    try {
      console.log('🏢 Removing member from organization:', { organizationId, userId });
      const response = await apiService.delete<Organization>(`/api/organizations/${organizationId}/members/${userId}`);
      console.log('✅ Member removed from organization');
      return response;
    } catch (error: any) {
      console.error('❌ Remove member failed:', error);
      throw new Error(error.response?.data?.error || 'Failed to remove member');
    }
  }
}

export default OrganizationService;