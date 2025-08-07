import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icon from '@react-native-vector-icons/fontawesome6';
import { useTheme } from '../Hooks/useTheme';
import { MemberCardProps } from '../interfaces/organization';

const MemberCard: React.FC<MemberCardProps> = ({ member, onPress }) => {
  const { colors } = useTheme();

  const styles = React.useMemo(() => StyleSheet.create({
    memberCard: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      flexDirection: 'row',
      alignItems: 'center',
    },
    memberAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primary + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    memberInfo: {
      flex: 1,
    },
    memberName: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 2,
    },
    memberEmail: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    memberSubtext: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 2,
    },
  }), [colors]);

  return (
    <TouchableOpacity style={styles.memberCard} onPress={() => onPress(member)}>
      <View style={styles.memberAvatar}>
        <Icon name="user" iconStyle="solid" size={18} color={colors.primary} />
      </View>
      <View style={styles.memberInfo}>
        <Text style={styles.memberName}>
          {member.firstName} {member.lastName}
        </Text>
        <Text style={styles.memberEmail}>
          {member.email}
        </Text>
        <Text style={styles.memberSubtext}>
          Takvimi görüntüle
        </Text>
      </View>
      <Icon name="chevron-right" iconStyle="solid" size={14} color={colors.textSecondary} />
    </TouchableOpacity>
  );
};

export default MemberCard;
