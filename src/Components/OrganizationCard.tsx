import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icon from '@react-native-vector-icons/fontawesome6';
import { useTheme } from '../Hooks/useTheme';

interface Organization {
  id: number;
  name: string;
  description?: string;
  memberCount?: number;
  eventCount?: number;
  createdAt?: string;
}

interface OrganizationCardProps {
  organization: Organization;
  onPress: (organization: Organization) => void;
}

const OrganizationCard: React.FC<OrganizationCardProps> = ({ organization, onPress }) => {
  const { colors } = useTheme();

  const styles = React.useMemo(() => StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      shadowColor: colors.shadowColor,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    orgIcon: {
      width: 48,
      height: 48,
      borderRadius: 8,
      backgroundColor: colors.primary + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    orgInfo: {
      flex: 1,
    },
    orgName: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 4,
    },
    orgDescription: {
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 20,
    },
    cardStats: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    statItem: {
      alignItems: 'center',
    },
    statNumber: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.primary,
      marginBottom: 2,
    },
    statLabel: {
      fontSize: 12,
      color: colors.textSecondary,
      fontWeight: '500',
    },
    chevron: {
      marginLeft: 8,
    },
  }), [colors]);

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(organization)}>
      <View style={styles.cardHeader}>
        <View style={styles.orgIcon}>
          <Icon name="building" iconStyle="solid" size={24} color={colors.primary} />
        </View>
        <View style={styles.orgInfo}>
          <Text style={styles.orgName}>{organization.name}</Text>
          {organization.description && (
            <Text style={styles.orgDescription} numberOfLines={2}>
              {organization.description}
            </Text>
          )}
        </View>
        <View style={styles.chevron}>
          <Icon name="chevron-right" iconStyle="solid" size={14} color={colors.textSecondary} />
        </View>
      </View>
      
      <View style={styles.cardStats}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {organization.memberCount || 0}
          </Text>
          <Text style={styles.statLabel}>Üye</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {organization.eventCount || 0}
          </Text>
          <Text style={styles.statLabel}>Etkinlik</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {organization.createdAt ? new Date(organization.createdAt).getFullYear() : 'Yeni'}
          </Text>
          <Text style={styles.statLabel}>Kuruluş</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default OrganizationCard;
