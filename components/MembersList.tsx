import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import Icon from '@react-native-vector-icons/fontawesome6';
import { useTheme } from '../utils/useTheme';
import { Member } from '../interfaces/organization';
import MemberCard from './MemberCard';

interface MembersListProps {
  members: Member[];
  onMemberPress: (member: Member) => void;
}

const MembersList: React.FC<MembersListProps> = ({ members, onMemberPress }) => {
  const { colors } = useTheme();

  const styles = React.useMemo(() => StyleSheet.create({
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
    },
    sectionSubtitle: {
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: '500',
    },
    emptyState: {
      alignItems: 'center',
      paddingVertical: 40,
    },
    emptyStateIcon: {
      marginBottom: 16,
    },
    emptyStateText: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
    },
  }), [colors]);

  return (
    <View>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Üyeler</Text>
        <Text style={styles.sectionSubtitle}>
          {members.length} üye
        </Text>
      </View>
      
      {members.length > 0 ? (
        members.map((member) => (
          <MemberCard
            key={member.id}
            member={member}
            onPress={onMemberPress}
          />
        ))
      ) : (
        <View style={styles.emptyState}>
          <View style={styles.emptyStateIcon}>
            <Icon name="users" iconStyle="solid" size={40} color={colors.textSecondary} />
          </View>
          <Text style={styles.emptyStateText}>
            Henüz üye bulunmuyor
          </Text>
        </View>
      )}
    </View>
  );
};

export default MembersList;
