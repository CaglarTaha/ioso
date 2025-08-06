import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  Share,
  Clipboard,
  Alert,
} from 'react-native';
import { useTheme } from '../utils/useTheme';
import { InviteModalProps } from '../interfaces/organization';

const InviteModal: React.FC<InviteModalProps> = ({
  visible,
  inviteCode,
  isCreating,
  onClose,
  onCreate,
  onShare,
  onCopy,
}) => {
  const { colors } = useTheme();

  const handleShare = async () => {
    if (!inviteCode) return;

    try {
      await Share.share({
        message: `IOCO Organizasyonuna katılın! 
        
Davet Kodu: ${inviteCode}

Bu kod ile organizasyona katılabilirsiniz.`,
        title: 'Organizasyon Daveti'
      });
      if (onShare) onShare();
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const handleCopy = async () => {
    if (!inviteCode) return;
    
    try {
      await Clipboard.setString(inviteCode);
      Alert.alert('Kopyalandı', 'Davet kodu panoya kopyalandı');
      if (onCopy) onCopy();
    } catch (error) {
      console.error('Copy error:', error);
    }
  };

  const styles = React.useMemo(() => StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContainer: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 24,
      margin: 20,
      width: '90%',
      maxWidth: 400,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
      textAlign: 'center',
      marginBottom: 20,
    },
    modalText: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: 20,
    },
    inviteCodeDisplay: {
      backgroundColor: colors.background,
      borderRadius: 8,
      padding: 16,
      marginBottom: 20,
      alignItems: 'center',
    },
    inviteCodeText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.primary,
      letterSpacing: 4,
      marginBottom: 8,
    },
    inviteCodeLabel: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    modalActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 12,
    },
    modalButton: {
      flex: 1,
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
    },
    primaryButton: {
      backgroundColor: colors.primary,
    },
    secondaryButton: {
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.surface,
    },
    secondaryButtonText: {
      color: colors.text,
    },
    inviteActions: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 20,
    },
  }), [colors]);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Davet Kodu Oluştur</Text>
          
          {!inviteCode ? (
            <>
              <Text style={styles.modalText}>
                Organizasyonunuza yeni üyeler eklemek için davet kodu oluşturun.
              </Text>
              <View style={styles.modalActions}>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.secondaryButton]}
                  onPress={onClose}
                >
                  <Text style={[styles.buttonText, styles.secondaryButtonText]}>İptal</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.primaryButton]}
                  onPress={onCreate}
                  disabled={isCreating}
                >
                  {isCreating ? (
                    <ActivityIndicator size="small" color={colors.surface} />
                  ) : (
                    <Text style={styles.buttonText}>Oluştur</Text>
                  )}
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <View style={styles.inviteCodeDisplay}>
                <Text style={styles.inviteCodeText}>{inviteCode}</Text>
                <Text style={styles.inviteCodeLabel}>Davet Kodu</Text>
              </View>
              
              <View style={styles.inviteActions}>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.primaryButton]}
                  onPress={handleCopy}
                >
                  <Text style={styles.buttonText}>Kopyala</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.primaryButton]}
                  onPress={handleShare}
                >
                  <Text style={styles.buttonText}>Paylaş</Text>
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.secondaryButton]}
                onPress={onClose}
              >
                <Text style={[styles.buttonText, styles.secondaryButtonText]}>Kapat</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default InviteModal;
