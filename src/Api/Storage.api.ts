import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  IS_LOGGED_IN: 'isLoggedIn',
  SHOW_ONBOARDING: 'showOnboarding',
  AUTH_TOKEN: 'authToken',
  REFRESH_TOKEN: 'refreshToken',
  USER_DATA: 'userData',
  THEME_MODE: 'themeMode',
} as const;

export const ApiStorage = {
  setAuthBundle: async (
    params: {
      accessToken: string;
      refreshToken: string;
      userData: any;
      isLoggedIn?: boolean;
    }
  ): Promise<void> => {
    try {
      const pairs: [string, string][] = [
        [STORAGE_KEYS.AUTH_TOKEN, params.accessToken],
        [STORAGE_KEYS.REFRESH_TOKEN, params.refreshToken],
        [STORAGE_KEYS.USER_DATA, JSON.stringify(params.userData)],
      ];
      if (typeof params.isLoggedIn === 'boolean') {
        pairs.push([STORAGE_KEYS.IS_LOGGED_IN, JSON.stringify(params.isLoggedIn)]);
      }
      await AsyncStorage.multiSet(pairs);
    } catch (error) {
      console.warn('Error setting auth bundle:', error);
    }
  },
  getIsLoggedIn: async (): Promise<boolean> => {
    try {
      const value = await AsyncStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN);
      return value ? JSON.parse(value) : false;
    } catch (error) {
      console.error('Error getting login status:', error);
      return false;
    }
  },

  setIsLoggedIn: async (isLoggedIn: boolean): Promise<void> => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, JSON.stringify(isLoggedIn));
    } catch (error) {
      console.warn('Error setting login status:', error);
    }
  },

  getShowOnboarding: async (): Promise<boolean> => {
    try {
      const value = await AsyncStorage.getItem(STORAGE_KEYS.SHOW_ONBOARDING);
      return value ? JSON.parse(value) : true;
    } catch (error) {
      console.error('Error getting onboarding status:', error);
      return true;
    }
  },

  setShowOnboarding: async (showOnboarding: boolean): Promise<void> => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SHOW_ONBOARDING, JSON.stringify(showOnboarding));
    } catch (error) {
      console.error('Error setting onboarding status:', error);
    }
  },

  logout: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.IS_LOGGED_IN);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  },

  setAuthToken: async (token: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    } catch (error) {
      console.warn('Error setting auth token:', error);
    }
  },

  getAuthToken: async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  },

  setRefreshToken: async (token: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
    } catch (error) {
      console.error('Error setting refresh token:', error);
    }
  },

  getRefreshToken: async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    } catch (error) {
      console.error('Error getting refresh token:', error);
      return null;
    }
  },

  setUserData: async (userData: any): Promise<void> => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
    } catch (error) {
      console.warn('Error setting user data:', error);
    }
  },

  getUserData: async (): Promise<any | null> => {
    try {
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  },

  clearAuthData: async (): Promise<void> => {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.AUTH_TOKEN,
        STORAGE_KEYS.REFRESH_TOKEN,
        STORAGE_KEYS.USER_DATA,
      ]);
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  },

  clearAll: async (): Promise<void> => {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing all storage:', error);
    }
  },

  setThemeMode: async (themeMode: 'light' | 'dark' | 'system'): Promise<void> => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.THEME_MODE, themeMode);
    } catch (error) {
      console.error('Error setting theme mode:', error);
    }
  },

  getThemeMode: async (): Promise<'light' | 'dark' | 'system'> => {
    try {
      const themeMode = await AsyncStorage.getItem(STORAGE_KEYS.THEME_MODE);
      return (themeMode as 'light' | 'dark' | 'system') || 'light';
    } catch (error) {
      console.error('Error getting theme mode:', error);
      return 'light';
    }
  },
};