import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
  Alert,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useRoute, useNavigation } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import Icon from '@react-native-vector-icons/fontawesome6';
import { useTheme } from '../utils/useTheme';
import { RootState, AppDispatch } from '../store';
import { fetchOrganizationById } from '../store/slices/organizationSlice';
import apiService from '../utils/apiService';
import { Organization, Member, Event } from '../interfaces/organization';
import CalendarView from '../components/CalendarView';
import InviteModal from '../components/InviteModal';
import MembersDrawer from '../components/MembersDrawer';

type OrganizationDetailRouteProp = RouteProp<RootStackParamList, 'OrganizationDetail'>;
type OrganizationDetailNavigationProp = NativeStackNavigationProp<RootStackParamList, 'OrganizationDetail'>;

const OrganizationDetailScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<OrganizationDetailNavigationProp>();
  const route = useRoute<OrganizationDetailRouteProp>();
  const { colors } = useTheme();
  
  const { organizationId } = route.params;
  const { currentOrganization, isLoading, error } = useSelector((state: RootState) => state.organization);
  
  const [refreshing, setRefreshing] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showMembersDrawer, setShowMembersDrawer] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [isCreatingInvite, setIsCreatingInvite] = useState(false);

  useEffect(() => {
    loadOrganizationDetail();
  }, [organizationId]);

  const loadOrganizationDetail = async () => {
    try {
      await dispatch(fetchOrganizationById(organizationId)).unwrap();
    } catch (err) {
      console.error('Load organization detail error:', err);
      Alert.alert('Hata', 'Organizasyon detayları yüklenemedi');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOrganizationDetail();
    setRefreshing(false);
  };

  const createInviteCode = async () => {
    setIsCreatingInvite(true);
    try {
      const response = await apiService.post('/api/organization-invites', {
        organizationId: organizationId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 gün
        maxUsage: 10 // 10 kişi kullanabilir
      });

      if (response.success) {
        setInviteCode(response.data.inviteCode);
        Alert.alert('Başarılı', 'Davet kodu oluşturuldu!');
      } else {
        Alert.alert('Hata', response.error || 'Davet kodu oluşturulamadı');
      }
    } catch (error) {
      console.error('Create invite error:', error);
      Alert.alert('Hata', 'Davet kodu oluşturulamadı');
    } finally {
      setIsCreatingInvite(false);
    }
  };

  const shareInviteCode = async () => {
    // InviteModal bileşeninde handle edilecek
    console.log('Share invite code:', inviteCode);
  };

  const copyInviteCode = async () => {
    // InviteModal bileşeninde handle edilecek
    console.log('Copy invite code:', inviteCode);
  };

  const styles = React.useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    backButton: {
      padding: 8,
      marginRight: 12,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      flex: 1,
    },
    headerActions: {
      flexDirection: 'row',
      gap: 8,
    },
    actionButton: {
      padding: 8,
      borderRadius: 8,
      backgroundColor: colors.primary + '20',
    },
    content: {
      flex: 1,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyStateText: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
    },
  }), [colors]);

  if (isLoading && !currentOrganization) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-left" iconStyle="solid" size={20} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Organizasyon Detayları</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.emptyStateText, { marginTop: 16 }]}>
            Yükleniyor...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!currentOrganization) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-left" iconStyle="solid" size={20} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Organizasyon Detayları</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.emptyStateText}>
            Organizasyon bulunamadı
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" iconStyle="solid" size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{currentOrganization.name}</Text>
        
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => setShowMembersDrawer(true)}
          >
            <Icon name="users" iconStyle="solid" size={16} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => setShowInviteModal(true)}
          >
            <Icon name="user-plus" iconStyle="solid" size={16} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        <CalendarView
          events={currentOrganization.events || []}
          onEventPress={(event: Event) => {
            console.log('Etkinlik detayı:', event);
          }}
          onDatePress={(date: string) => {
            console.log('Tarih seçildi:', date);
            // Burada seçilen tarihe etkinlik ekleme modalını açabilirsin
          }}
          onAddEvent={() => {
            console.log('Etkinlik ekleme modalı açılacak');
            // Burada etkinlik ekleme modalını aç
          }}
        />
      </View>

      <InviteModal
        visible={showInviteModal}
        inviteCode={inviteCode}
        isCreating={isCreatingInvite}
        onClose={() => {
          setShowInviteModal(false);
          setInviteCode('');
        }}
        onCreate={createInviteCode}
        onShare={shareInviteCode}
        onCopy={copyInviteCode}
      />

      <MembersDrawer
        visible={showMembersDrawer}
        members={currentOrganization?.members || []}
        onClose={() => setShowMembersDrawer(false)}
        onMemberPress={(member: Member) => {
          console.log('Üye takvimi görüntülenecek:', member);
          // Burada üyenin kişisel takvimini göster
        }}
      />

    </SafeAreaView>
  );
};

export default OrganizationDetailScreen;