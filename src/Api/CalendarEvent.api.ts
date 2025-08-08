import { IocoApi } from './index';
import { IResponse, CalendarEventType, CreateCalendarEventRequest } from './types';

export const ApiCalendarEvent = {
  Create: async (data: CreateCalendarEventRequest): Promise<IResponse<CalendarEventType>> => {
    return await IocoApi.post('/calendar-events', data).then((response) => response.data);
  },

  GetById: async (id: number): Promise<IResponse<CalendarEventType>> => {
    return await IocoApi.get(`/calendar-events/${id}`).then((response) => response.data);
  },

  Update: async (id: number, data: Partial<CreateCalendarEventRequest>): Promise<IResponse<CalendarEventType>> => {
    return await IocoApi.put(`/calendar-events/${id}`, data).then((response) => response.data);
  },

  Delete: async (id: number): Promise<IResponse<any>> => {
    return await IocoApi.delete(`/calendar-events/${id}`).then((response) => response.data);
  },

  GetByOrganization: async (organizationId: number): Promise<IResponse<CalendarEventType[]>> => {
    return await IocoApi.get(`/calendar-events/organization/${organizationId}`).then((response) => response.data);
  },

  GetByDateRange: async (
    organizationId: number, 
    startDate: string, 
    endDate: string
  ): Promise<IResponse<CalendarEventType[]>> => {
    return await IocoApi.get(`/calendar-events/organization/${organizationId}/date-range`, {
      params: { startDate, endDate }
    }).then((response) => response.data);
  },

  GetUserEvents: async (): Promise<IResponse<CalendarEventType[]>> => {
    return await IocoApi.get('/calendar-events/my').then((response) => response.data);
  },

  CheckUserAvailability: async (
    startDate: string, 
    endDate: string
  ): Promise<IResponse<{ 
    userId: number;
    period: { startDate: string; endDate: string };
    busySlots: CalendarEventType[]
  }>> => {
    return await IocoApi.get('/calendar-events/my/availability', {
      params: { startDate, endDate }
    }).then((response) => response.data);
  },

  GetOrganizationCalendarView: async (
    organizationId: number,
    startDate: string,
    endDate: string
  ): Promise<IResponse<CalendarEventType[]>> => {
    return await IocoApi.get(`/calendar-events/organization/${organizationId}/calendar-view`, {
      params: { startDate, endDate }
    }).then((response) => response.data);
  },

  GetAllMembersEvents: async (
    organizationId: number,
    startDate: string,
    endDate: string
  ): Promise<Record<string, CalendarEventType[]>> => {
    return await IocoApi.get(`/calendar-events/organization/${organizationId}/all-members`, {
      params: { startDate, endDate }
    }).then((response) => response.data);
  },

  FindFreeTimeSlots: async (
    organizationId: number,
    duration: number,
    startDate: string,
    endDate: string
  ): Promise<IResponse<{
    organizationId: number;
    duration: string;
    period: { startDate: string; endDate: string };
    freeSlots: Array<{ start: string; end: string }>
  }>> => {
    return await IocoApi.get(`/calendar-events/organization/${organizationId}/free-slots`, {
      params: { duration, startDate, endDate }
    }).then((response) => response.data);
  },
};