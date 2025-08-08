import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from '@react-native-vector-icons/fontawesome6';
import { useTheme } from '../../Hooks/useTheme';

interface EmptyStateProps {
  icon?: string;
  title?: string;
  description?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon = 'inbox', title = 'Kayıt bulunamadı', description }) => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => StyleSheet.create({
    container: { alignItems: 'center', padding: 24 },
    title: { fontSize: 16, fontWeight: '600', color: colors.text, marginTop: 8 },
    desc: { fontSize: 14, color: colors.textSecondary, marginTop: 4, textAlign: 'center' },
  }), [colors]);

  return (
    <View style={styles.container}>
      <Icon name={icon} iconStyle="regular" size={24} color={colors.textSecondary} />
      <Text style={styles.title}>{title}</Text>
      {!!description && <Text style={styles.desc}>{description}</Text>}
    </View>
  );
};

export default EmptyState;


