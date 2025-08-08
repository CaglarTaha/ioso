// Navigation types for React Navigation
export type RootStackParamList = {
  Main: undefined;
  OrganizationDetail: {
    organizationId: number;
  };
  OrganizationCalendarList: {
    organizationId: number;
  };
  CalendarDateDetail: {
    organizationId: number;
    date: string; // YYYY-MM-DD
  };
  Login: undefined;
  Register: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
