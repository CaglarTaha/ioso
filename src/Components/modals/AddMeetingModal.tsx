import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import DatePicker from 'react-native-date-picker';
import Icon from '@react-native-vector-icons/fontawesome6';
import IocoApi from '../../Api';
import { useTheme } from '../../Hooks/useTheme';

interface AddMeetingModalProps {
  visible: boolean;
  onClose: () => void;
  organizationId: string;
}

const AddMeetingModal: React.FC<AddMeetingModalProps> = ({ visible, onClose, organizationId }) => {
  const { colors } = useTheme();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStart, setShowStart] = useState(false);
  const [showEnd, setShowEnd] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCreateMeeting = async () => {
    if (!title || !startDate || !endDate) {
      Alert.alert('Hata', 'Başlık ve tarih bilgilerini doldurun.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title: title.trim(),
        description: description.trim() || undefined,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        organizationId,
        eventType: 'meeting',
        availability: 'busy',
        isVisible: true,
      };

      const res = await IocoApi.post('/calendar-events', payload);

      if (res.status === 201) {
        Alert.alert('Başarılı', 'Etkinlik oluşturuldu!');
        onClose();
        setTitle('');
        setDescription('');
        setStartDate(new Date());
        setEndDate(new Date());
      } else {
        Alert.alert('Hata', res.data.error || 'Etkinlik oluşturulamadı');
      }
    } catch (error) {
      console.error('Create meeting error:', error);
      Alert.alert('Hata', 'Etkinlik oluşturulamadı');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.modal, { backgroundColor: colors.card }]}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Icon name="x" size={24} color={colors.text} iconStyle="solid" />
          </TouchableOpacity>

          <Text style={[styles.title, { color: colors.text }]}>Yeni Etkinlik</Text>

          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Başlık"
            placeholderTextColor={colors.textSecondary}
            style={styles.input}
          />

          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Açıklama (isteğe bağlı)"
            placeholderTextColor={colors.textSecondary}
            style={styles.input}
          />

          <TouchableOpacity onPress={() => setShowStart(true)} style={styles.dateButton}>
            <Text>{startDate.toLocaleString()}</Text>
          </TouchableOpacity>
          <DatePicker
            modal
            open={showStart}
            date={startDate}
            onConfirm={(date) => {
              setShowStart(false);
              setStartDate(date);
            }}
            onCancel={() => setShowStart(false)}
            mode="datetime"
          />

          <TouchableOpacity onPress={() => setShowEnd(true)} style={styles.dateButton}>
            <Text>{endDate.toLocaleString()}</Text>
          </TouchableOpacity>
          <DatePicker
            modal
            open={showEnd}
            date={endDate}
            onConfirm={(date) => {
              setShowEnd(false);
              setEndDate(date);
            }}
            onCancel={() => setShowEnd(false)}
            mode="datetime"
          />

          <TouchableOpacity
            style={[styles.createButton, { backgroundColor: colors.primary }]}
            onPress={handleCreateMeeting}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.createButtonText}>Oluştur</Text>}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: 320,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 8,
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  createButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default AddMeetingModal;
