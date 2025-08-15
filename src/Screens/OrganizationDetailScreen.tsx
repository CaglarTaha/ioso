import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, RefreshControl, Alert, ActivityIndicator, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useRoute, useNavigation } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import Icon from '@react-native-vector-icons/fontawesome6';
import { useTheme } from '../Hooks/useTheme';
import AppHeader from '../Components/ui/AppHeader';
import IconButton from '../Components/ui/IconButton';
import LoadingView from '../Components/ui/LoadingView';
import { RootState, AppDispatch } from '../store';
import { fetchOrganizationById } from '../Store/slices/organization.slice';
import { IocoApi } from '../Api';
import { Organization, Member, Event } from '../../interfaces/organization';
import CalendarView from '../Components/CalendarView';
import MonthDayListView from '../Components/MonthDayListView';
import InviteModal from '../Components/InviteModal';
import MembersDrawer from '../BottomSheets/MembersDrawer';
import Accordion from './Accordion';
import AddMeetingModal from '../Components/modals/AddMeetingModal';

type OrganizationDetailRouteProp = RouteProp<RootStackParamList, 'OrganizationDetail'>;
type OrganizationDetailNavigationProp = NativeStackNavigationProp<RootStackParamList, 'OrganizationDetail'>;

const OrganizationDetailScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<OrganizationDetailNavigationProp>();
  const route = useRoute<OrganizationDetailRouteProp>();
  const { colors } = useTheme();
  
  const { organizationId } = route.params;
  const { currentOrganization, isLoading, error } = useSelector((state: RootState) => state.organization);
  const [showAddMeetingModal, setShowAddMeetingModal] = useState(false);

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
      const response = await IocoApi.post('/invites', {
        organizationId: organizationId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 gün
        maxUsage: 10 // 10 kişi kullanabilir
      });

      if (response.data.success) {
        setInviteCode(response.data.data.inviteCode);
        Alert.alert('Başarılı', 'Davet kodu oluşturuldu!');
      } else {
        Alert.alert('Hata', response.data.error || 'Davet kodu oluşturulamadı');
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
        <AppHeader title="Organizasyon Detayları" left={<IconButton name="arrow-left" color={colors.text} onPress={() => navigation.goBack()} />} />
        <LoadingView />
      </SafeAreaView>
    );
  }

  if (!currentOrganization) {
    return (
      <SafeAreaView style={styles.container}>
      <AppHeader title="Organizasyon Detayları" left={<IconButton name="arrow-left" color={colors.text} onPress={() => navigation.goBack()} />} />
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
      <AppHeader
        title={currentOrganization.name}
        left={<IconButton name="arrow-left" color={colors.text} onPress={() => navigation.goBack()} />}
        right={(
          <View style={styles.headerActions}>
            <IconButton name="users" onPress={() => setShowMembersDrawer(true)} />
            <IconButton name="user-plus" onPress={() => setShowInviteModal(true)} />
            <IconButton name="calendar-plus" onPress={() => setShowAddMeetingModal(true)} />
            <IconButton name="list" onPress={() => navigation.navigate('OrganizationCalendarList', { organizationId })} />
          </View>
        )}
      />

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <Accordion categorizedEvents={(currentOrganization as any)?.categorizedEvents || []} />
      </ScrollView>

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
      <AddMeetingModal
        visible={showAddMeetingModal}
        organizationId={organizationId.toString()}
        onClose={() => setShowAddMeetingModal(false)}
      />

      <MembersDrawer
        visible={showMembersDrawer}
        members={(currentOrganization?.members || []).map(user => ({
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        }))}
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