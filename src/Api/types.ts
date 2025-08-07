export interface IResponse<T> {
  error?: {
    code: number;
    type: string;
    message: string;
  };
  data?: T;
  paging?: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  } | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: UserType;
}

export interface UserType {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: {
    id: number;
    name: string;
  };
}

export interface OrganizationType {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  members?: UserType[];
}

export interface CreateOrganizationRequest {
  name: string;
  description?: string;
}

export interface CalendarEventType {
  id: number;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  eventType: 'personal' | 'meeting' | 'event';
  availability: 'busy' | 'free' | 'tentative';
  isVisible: boolean;
  organizationId: number;
  createdBy: UserType;
}

export interface CreateCalendarEventRequest {
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  organizationId: number;
  eventType?: 'personal' | 'meeting' | 'event';
  availability?: 'busy' | 'free' | 'tentative';
  isVisible?: boolean;
}