import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../Hooks/useTheme';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
  centerTitle?: boolean;
  gradientColors?: string[];
  showShadow?: boolean;
  safeTop?: boolean; // if parent already uses SafeAreaView, set false
  dense?: boolean;   // smaller vertical paddings
  topPadding?: number; // force top padding (overrides safeTop)
  vPadding?: number;   // force vertical paddings for row
}

const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  subtitle,
  left,
  right,
  centerTitle = false,
  gradientColors,
  showShadow = false,
  safeTop = false,
  dense = false,
  topPadding,
  vPadding,
}) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = React.useMemo(() => StyleSheet.create({
    container: {
      paddingTop: (typeof topPadding === 'number' ? topPadding : (safeTop ? insets.top : 0)),
      backgroundColor: gradientColors ? 'transparent' : colors.background,
      borderBottomWidth: gradientColors ? 0 : StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },
    row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: (typeof vPadding === 'number' ? vPadding : (dense ? 8 : 12)) },
    left: { flexDirection: 'row', alignItems: 'center', marginRight: 10 },
    center: { flex: 1, alignItems: centerTitle ? 'center' : 'flex-start' },
    right: { flexDirection: 'row', alignItems: 'center', marginLeft: 10 },
    title: { fontSize: 20, fontWeight: '700', color: colors.text },
    subtitle: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
    shadow: { shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: 6 }, elevation: 3 },
    gradient: { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 },
  }), [colors, insets.top, centerTitle, gradientColors, safeTop, dense, topPadding, vPadding]);

  const Inner = (
    <View style={[styles.container, showShadow && styles.shadow]}>
      <View style={styles.row}>
        <View style={styles.left}>{left}</View>
        <View style={styles.center}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          {!!subtitle && (<Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>)}
        </View>
        <View style={styles.right}>{right}</View>
      </View>
    </View>
  );

  if (gradientColors && gradientColors.length >= 2) {
    return (
      <LinearGradient colors={gradientColors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.gradient}>
        {Inner}
      </LinearGradient>
    );
  }
  return Inner;
};

export default AppHeader;


