import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from '@react-native-vector-icons/fontawesome6';
import { useTheme } from '../utils/useTheme';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { RootState, AppDispatch } from '../store';
import { 
  fetchUserOrganizations, 
  createOrganization, 
  clearError 
} from '../store/slices/organizationSlice';
import { CreateOrganizationDto } from '../utils/organizationService';
import apiService from '../utils/apiService';
import OrganizationCard from '../components/OrganizationCard';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const OrganizationsScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<NavigationProp>();
  const { colors } = useTheme();
  const { organizations, isLoading, error } = useSelector((state: RootState) => state.organization);
  const { user } = useSelector((state: RootState) => state.auth);

  const [refreshing, setRefreshing] = useState(false);
  const [showChoiceModal, setShowChoiceModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [createForm, setCreateForm] = useState<CreateOrganizationDto>({
    name: '',
    description: '',
  });

  const handleNameChange = React.useCallback((text: string) => {
    setCreateForm(prev => ({ ...prev, name: text }));
  }, []);

  const handleDescriptionChange = React.useCallback((text: string) => {
    setCreateForm(prev => ({ ...prev, description: text }));
  }, []);

  useEffect(() => {
    loadOrganizations();
  }, []);

  useEffect(() => {
    if (error) {
      Alert.alert('Hata', error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const loadOrganizations = async () => {
    try {
      await dispatch(fetchUserOrganizations()).unwrap();
    } catch (err) {
      console.error('Load organizations error:', err);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOrganizations();
    setRefreshing(false);
  };

  const handleCreateOrganization = React.useCallback(async () => {
    if (!createForm.name.trim()) {
      Alert.alert('Hata', 'Organizasyon adı gereklidir');
      return;
    }

    try {
      await dispatch(createOrganization(createForm)).unwrap();
      setShowCreateModal(false);
      setCreateForm({ name: '', description: '' });
      Alert.alert('Başarılı', 'Organizasyon oluşturuldu!');
    } catch (err: any) {
      Alert.alert('Hata', err || 'Organizasyon oluşturulamadı');
    }
  }, [dispatch, createForm]);

  const handleCloseModal = React.useCallback(() => {
    setShowCreateModal(false);
    setCreateForm({ name: '', description: '' });
  }, []);

  const handleJoinWithCode = React.useCallback(async () => {
    if (!joinCode.trim()) {
      Alert.alert('Hata', 'Lütfen davet kodunu girin');
      return;
    }

    setIsJoining(true);
    try {
      const response = await apiService.post('/api/organization-invites/join', {
        inviteCode: joinCode.trim().toUpperCase()
      });
      
      if (response.success) {
        Alert.alert('Başarılı', response.message || 'Organizasyona başarıyla katıldınız!');
        setShowJoinModal(false);
        setJoinCode('');
        // Organizasyon listesini yenile
        loadOrganizations();
      } else {
        Alert.alert('Hata', response.error || 'Katılım başarısız');
      }
    } catch (error) {
      console.error('Join with code error:', error);
      Alert.alert('Hata', 'Katılım sırasında bir hata oluştu');
    } finally {
      setIsJoining(false);
    }
  }, [joinCode]);

  const handleCloseJoinModal = React.useCallback(() => {
    setShowJoinModal(false);
    setJoinCode('');
  }, []);

  const styles = React.useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flex: 1,
      padding: 16,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 24,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.text,
    },
    createButton: {
      backgroundColor: colors.primary,
      padding: 12,
      borderRadius: 8,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    createButtonText: {
      color: '#fff',
      fontSize: 14,
      fontWeight: '600',
    },
    welcomeCard: {
      backgroundColor: colors.primary + '15',
      borderRadius: 12,
      padding: 20,
      marginBottom: 24,
      borderLeftWidth: 4,
      borderLeftColor: colors.primary,
    },
    welcomeText: {
      fontSize: 16,
      color: colors.text,
      fontWeight: '500',
      marginBottom: 4,
    },
    welcomeSubtext: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 40,
    },
    emptyStateIcon: {
      marginBottom: 16,
    },
    emptyStateTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: colors.text,
      textAlign: 'center',
      marginBottom: 8,
    },
    emptyStateText: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 24,
      marginBottom: 24,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContainer: {
      flex: 1,
      backgroundColor: colors.background,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
    },
    modalBody: {
      padding: 20,
    },
    inputContainer: {
      marginBottom: 16,
    },
    label: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 8,
      color: colors.text,
    },
    input: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      backgroundColor: colors.background,
      color: colors.text,
    },
    textArea: {
      height: 80,
      textAlignVertical: 'top',
    },
    modalFooter: {
      flexDirection: 'row',
      padding: 20,
      gap: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    button: {
      flex: 1,
      padding: 14,
      borderRadius: 8,
      alignItems: 'center',
    },
    submitButton: {
      backgroundColor: colors.primary,
    },
    submitButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#fff',
    },
    // Yeni stil tanımlamaları
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    // Choice Modal Styles
    choiceModalContainer: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 24,
      margin: 20,
      width: '90%',
      maxWidth: 400,
    },
    choiceModalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
      textAlign: 'center',
      marginBottom: 8,
    },
    choiceModalSubtitle: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: 24,
    },
    choiceButton: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderRadius: 8,
      backgroundColor: colors.background,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    choiceButtonText: {
      flex: 1,
      marginLeft: 12,
    },
    choiceButtonTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    choiceButtonSubtitle: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    cancelButton: {
      padding: 16,
      borderRadius: 8,
      backgroundColor: colors.background,
      marginTop: 8,
      alignItems: 'center',
    },
    cancelButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.textSecondary,
    },
    // Join Modal Styles
    joinModalContainer: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 24,
      margin: 20,
      width: '90%',
      maxWidth: 400,
    },
    joinModalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
      textAlign: 'center',
      marginBottom: 8,
    },
    joinModalText: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: 20,
    },
    joinInput: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      color: colors.text,
      marginBottom: 20,
      textAlign: 'center',
      fontWeight: 'bold',
      letterSpacing: 2,
    },
    joinModalActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 12,
    },
    joinModalButton: {
      flex: 1,
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
    },
    joinPrimaryButton: {
      backgroundColor: colors.primary,
    },
    joinSecondaryButton: {
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
    },
    joinButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#fff',
    },
    joinSecondaryButtonText: {
      color: colors.textSecondary,
    },
  }), [colors]);

  if (isLoading && organizations.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.emptyStateText, { marginTop: 16 }]}>
            Organizasyonlar yükleniyor...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Organizasyonlarım</Text>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => setShowChoiceModal(true)}
          >
            <Icon name="plus" iconStyle="solid" size={14} color="#fff" />
            <Text style={styles.createButtonText}>Yeni</Text>
          </TouchableOpacity>
        </View>

        {user && (
          <View style={styles.welcomeCard}>
            <Text style={styles.welcomeText}>
              Hoş geldin, {user.firstName}! 👋
            </Text>
            <Text style={styles.welcomeSubtext}>
              Organizasyonlarını yönet ve yeni etkinlikler oluştur
            </Text>
          </View>
        )}

        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
        >
          {organizations.length > 0 ? (
            organizations.map((org) => (
              <OrganizationCard 
                key={org.id} 
                organization={org} 
                onPress={(organization) => navigation.navigate('OrganizationDetail', { organizationId: organization.id })}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <View style={styles.emptyStateIcon}>
                <Icon name="building" iconStyle="regular" size={60} color={colors.textSecondary} />
              </View>
              <Text style={styles.emptyStateTitle}>
                Henüz organizasyon yok
              </Text>
              <Text style={styles.emptyStateText}>
                İlk organizasyonunu oluştur ve ekibinle birlikte etkinlikler düzenlemeye başla!
              </Text>
              <TouchableOpacity
                style={[styles.createButton, { paddingHorizontal: 24, paddingVertical: 12 }]}
                onPress={() => setShowChoiceModal(true)}
              >
                <Icon name="plus" iconStyle="solid" size={16} color="#fff" />
                <Text style={[styles.createButtonText, { fontSize: 16 }]}>
                  İlk Organizasyonunu Oluştur
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>

      {/* Modal her zaman render edilir, sadece visible prop'u değişir */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        transparent={false}
        onRequestClose={handleCloseModal}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Yeni Organizasyon</Text>
            <TouchableOpacity onPress={handleCloseModal}>
              <Icon name="xmark" iconStyle="solid" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView 
            style={styles.modalBody}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                Organizasyon Adı *
              </Text>
              <TextInput
                style={styles.input}
                value={createForm.name}
                onChangeText={handleNameChange}
                placeholder="Organizasyon adını girin"
                placeholderTextColor={colors.textSecondary}
                autoCapitalize="sentences"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                Açıklama
              </Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={createForm.description}
                onChangeText={handleDescriptionChange}
                placeholder="Organizasyon açıklamasını girin (opsiyonel)"
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={3}
                autoCapitalize="sentences"
              />
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleCloseModal}
            >
              <Text style={styles.cancelButtonText}>İptal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.submitButton]}
              onPress={handleCreateOrganization}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.submitButtonText}>Oluştur</Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Seçim Modal */}
      <Modal
        visible={showChoiceModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowChoiceModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.choiceModalContainer}>
            <Text style={styles.choiceModalTitle}>Organizasyon</Text>
            <Text style={styles.choiceModalSubtitle}>
              Nasıl devam etmek istiyorsunuz?
            </Text>
            
            <TouchableOpacity 
              style={styles.choiceButton}
              onPress={() => {
                setShowChoiceModal(false);
                setShowJoinModal(true);
              }}
            >
              <Icon name="key" iconStyle="solid" size={20} color={colors.primary} />
              <View style={styles.choiceButtonText}>
                <Text style={styles.choiceButtonTitle}>Davet Kodu ile Katıl</Text>
                <Text style={styles.choiceButtonSubtitle}>Mevcut bir organizasyona katıl</Text>
              </View>
              <Icon name="chevron-right" iconStyle="solid" size={14} color={colors.textSecondary} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.choiceButton}
              onPress={() => {
                setShowChoiceModal(false);
                setShowCreateModal(true);
              }}
            >
              <Icon name="plus" iconStyle="solid" size={20} color={colors.primary} />
              <View style={styles.choiceButtonText}>
                <Text style={styles.choiceButtonTitle}>Yeni Organizasyon Oluştur</Text>
                <Text style={styles.choiceButtonSubtitle}>Kendi organizasyonunu kur</Text>
              </View>
              <Icon name="chevron-right" iconStyle="solid" size={14} color={colors.textSecondary} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => setShowChoiceModal(false)}
            >
              <Text style={styles.cancelButtonText}>İptal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Davet Kodu ile Katılma Modal */}
      <Modal
        visible={showJoinModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseJoinModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.joinModalContainer}>
            <Text style={styles.joinModalTitle}>Davet Kodu ile Katıl</Text>
            <Text style={styles.joinModalText}>
              Organizasyona katılmak için davet kodunu girin.
            </Text>
            
            <TextInput
              style={styles.joinInput}
              value={joinCode}
              onChangeText={setJoinCode}
              placeholder="XXXXXXXX"
              placeholderTextColor={colors.textSecondary}
              maxLength={8}
              autoCapitalize="characters"
              autoCorrect={false}
            />
            
            <View style={styles.joinModalActions}>
              <TouchableOpacity 
                style={[styles.joinModalButton, styles.joinSecondaryButton]}
                onPress={handleCloseJoinModal}
              >
                <Text style={[styles.joinButtonText, styles.joinSecondaryButtonText]}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.joinModalButton, styles.joinPrimaryButton]}
                onPress={handleJoinWithCode}
                disabled={isJoining || !joinCode.trim()}
              >
                {isJoining ? (
                  <ActivityIndicator size="small" color={colors.surface} />
                ) : (
                  <Text style={styles.joinButtonText}>Katıl</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default OrganizationsScreen;