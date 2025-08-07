import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import Icon from '@react-native-vector-icons/fontawesome6';
import { useTheme } from '../Hooks/useTheme';
import { OrganizationHeaderProps } from '../interfaces/organization';

const OrganizationHeader: React.FC<OrganizationHeaderProps> = ({ organization }) => {
  const { colors } = useTheme();

  const styles = React.useMemo(() => StyleSheet.create({
    organizationHeader: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 20,
      marginBottom: 24,
    },
    organizationIcon: {
      width: 60,
      height: 60,
      borderRadius: 12,
      backgroundColor: colors.primary + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
      alignSelf: 'center',
    },
    organizationName: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      textAlign: 'center',
      marginBottom: 8,
    },
    organizationDescription: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 24,
    },
  }), [colors]);

  return (
    <View style={styles.organizationHeader}>
      <View style={styles.organizationIcon}>
        <Icon name="building" iconStyle="solid" size={30} color={colors.primary} />
      </View>
      <Text style={styles.organizationName}>
        {organization.name}
      </Text>
      {organization.description && (
        <Text style={styles.organizationDescription}>
          {organization.description}
        </Text>
      )}
    </View>
  );
};

export default OrganizationHeader;
