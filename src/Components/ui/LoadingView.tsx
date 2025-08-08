import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '../../Hooks/useTheme';

interface LoadingViewProps {
  inline?: boolean;
}

const LoadingView: React.FC<LoadingViewProps> = ({ inline = false }) => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => StyleSheet.create({
    container: {
      flex: inline ? 0 : 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: inline ? 8 : 0,
    },
  }), [inline]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size={inline ? 'small' : 'large'} color={colors.primary} />
    </View>
  );
};

export default LoadingView;


