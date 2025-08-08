import { Platform, StyleSheet } from 'react-native';

export const buildTabStyles = (colors: any, insets: { bottom: number }) => {
  const bottomInset = insets?.bottom ?? 0;
  const baseHeight = Platform.OS === 'ios' ? 56 : 56;
  const height = baseHeight + (Platform.OS === 'ios' ? bottomInset : 0);
  const paddingBottom = (Platform.OS === 'ios' ? Math.max(8, bottomInset - 2) : 6);
  return {
    tabBarStyle: {
      backgroundColor: colors.tabBarBackground,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      // Home indicator'dan şık bir mesafe bırak
      height,
      paddingBottom,
      paddingTop: 6,
      position: 'relative' as const,
      elevation: 0,
      shadowOpacity: 0,
    },
    tabBarItemStyle: {
      paddingVertical: 4,
    },
    tabBarLabelStyle: {
      fontSize: 12,
    },
    sceneContainerStyle: {
      backgroundColor: colors.background,
    },
  };
};

export const AppSpacing = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
});


