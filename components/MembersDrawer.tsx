import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
} from 'react-native';
import Icon from '@react-native-vector-icons/fontawesome6';
import { useTheme } from '../utils/useTheme';
import { Member } from '../interfaces/organization';
import MemberCard from './MemberCard';

interface MembersDrawerProps {
  visible: boolean;
  members: Member[];
  onClose: () => void;
  onMemberPress: (member: Member) => void;
}

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = width * 0.8;

const MembersDrawer: React.FC<MembersDrawerProps> = ({
  visible,
  members,
  onClose,
  onMemberPress,
}) => {
  const { colors } = useTheme();

  const styles = React.useMemo(() => StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      flexDirection: 'row',
    },
    drawer: {
      width: DRAWER_WIDTH,
      backgroundColor: colors.surface,
      height: '100%',
      paddingTop: 60, // SafeArea için
      shadowColor: '#000',
      shadowOffset: {
        width: 2,
        height: 0,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    overlayTouchable: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
    },
    closeButton: {
      padding: 8,
      borderRadius: 8,
      backgroundColor: colors.background,
    },
    content: {
      flex: 1,
      padding: 16,
    },
    memberCount: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 16,
      textAlign: 'center',
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
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
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.drawer}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Üyeler</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Icon name="xmark" iconStyle="solid" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.content}>
            <Text style={styles.memberCount}>
              {members.length} üye
            </Text>
            
            {members.length > 0 ? (
              <ScrollView showsVerticalScrollIndicator={false}>
                {members.map((member) => (
                  <MemberCard
                    key={member.id}
                    member={member}
                    onPress={(member) => {
                      onMemberPress(member);
                      onClose(); // Drawer'ı kapat
                    }}
                  />
                ))}
              </ScrollView>
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
        </View>
        
        <TouchableOpacity 
          style={styles.overlayTouchable} 
          onPress={onClose}
          activeOpacity={1}
        />
      </View>
    </Modal>
  );
};

export default MembersDrawer;
