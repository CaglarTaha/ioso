import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../utils/useTheme';
import { StatsContainerProps } from '../interfaces/organization';

const StatsContainer: React.FC<StatsContainerProps> = ({ memberCount, eventCount }) => {
  const { colors } = useTheme();

  const styles = React.useMemo(() => StyleSheet.create({
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 20,
      marginBottom: 24,
    },
    statItem: {
      alignItems: 'center',
    },
    statNumber: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.primary,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: '500',
    },
  }), [colors]);

  return (
    <View style={styles.statsContainer}>
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>
          {memberCount}
        </Text>
        <Text style={styles.statLabel}>Üye</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>
          {eventCount}
        </Text>
        <Text style={styles.statLabel}>Etkinlik</Text>
      </View>
    </View>
  );
};

export default StatsContainer;
