// Navigation types for React Navigation
export type RootStackParamList = {
  Main: undefined;
  OrganizationDetail: {
    organizationId: number;
  };
  Login: undefined;
  Register: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
