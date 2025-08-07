import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import Icon from '@react-native-vector-icons/fontawesome6';
import { useTheme } from '../Hooks/useTheme';

interface AddEventButtonProps {
  onPress: () => void;
}

const AddEventButton: React.FC<AddEventButtonProps> = ({ onPress }) => {
  const { colors } = useTheme();

  const styles = React.useMemo(() => StyleSheet.create({
    addEventButton: {
      backgroundColor: colors.primary,
      borderRadius: 8,
      padding: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      marginBottom: 16,
    },
    addEventButtonText: {
      color: colors.surface,
      fontSize: 16,
      fontWeight: '600',
    },
  }), [colors]);

  return (
    <TouchableOpacity style={styles.addEventButton} onPress={onPress}>
      <Icon name="plus" iconStyle="solid" size={16} color={colors.surface} />
      <Text style={styles.addEventButtonText}>Yeni Etkinlik Ekle</Text>
    </TouchableOpacity>
  );
};

export default AddEventButton;
