import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, Platform, SafeAreaView, ScrollView, KeyboardAvoidingView } from 'react-native';
import { useTheme } from '../../Hooks/useTheme';
import { ApiCalendarEvent, CreateCalendarEventRequest } from '../../Api';
import LoadingView from '../ui/LoadingView';

interface CreateEventModalProps {
  visible: boolean;
  organizationId: number;
  date: string; // YYYY-MM-DD
  hour?: number; // optional prefilled hour
  onClose: () => void;
  onCreated: () => void;
}

const CreateEventModal: React.FC<CreateEventModalProps> = ({ visible, organizationId, date, hour, onClose, onCreated }) => {
  const { colors } = useTheme();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState(() => (hour !== undefined ? `${String(hour).padStart(2, '0')}:00` : '09:00'));
  const [endTime, setEndTime] = useState(() => (hour !== undefined ? (hour < 23 ? `${String(hour + 1).padStart(2, '0')}:00` : '23:59') : '10:00'));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const styles = useMemo(() => StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
    title: { color: colors.text, fontSize: 18, fontWeight: '700' },
    body: { padding: 16, gap: 12 },
    label: { color: colors.textSecondary, fontSize: 12, fontWeight: '600' },
    input: { borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 12, color: colors.text },
    row: { flexDirection: 'row', gap: 12 },
    buttonRow: { flexDirection: 'row', gap: 12, padding: 16, borderTopWidth: 1, borderTopColor: colors.border },
    btn: { flex: 1, padding: 14, borderRadius: 8, alignItems: 'center' },
    btnPrimary: { backgroundColor: colors.primary },
    btnSecondary: { backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border },
    btnTextPrimary: { color: colors.surface, fontWeight: '700' },
    btnTextSecondary: { color: colors.text },
    errorText: { color: 'crimson' },
  }), [colors]);

  // Reset prefilled times when modal opens or hour changes
  useEffect(() => {
    if (visible) {
      const s = hour !== undefined ? `${String(hour).padStart(2, '0')}:00` : '09:00';
      const e = hour !== undefined ? (hour < 23 ? `${String(hour + 1).padStart(2, '0')}:00` : '23:59') : '10:00';
      setStartTime(s);
      setEndTime(e);
    }
  }, [visible, hour]);

  const handleCreate = async () => {
    setError(null);
    if (!title.trim()) {
      setError('Başlık gerekli');
      return;
    }
    try {
      setSubmitting(true);
      const startDate = new Date(`${date}T${startTime}:00`).toISOString();;
      const endDate = new Date(`${date}T${endTime}:00`).toISOString();;
      if (new Date(endDate) <= new Date(startDate)) {
        setError('Bitiş başlangıçtan sonra olmalı');
        setSubmitting(false);
        return;
      }
      const payload: CreateCalendarEventRequest = {
        title: title.trim(),
        description: description.trim() || undefined,
        startDate,
        endDate,
        organizationId,
        eventType: 'meeting',
        availability: 'busy',
        isVisible: true,
      };
      const res = await ApiCalendarEvent.Create(payload);
      // Debug logging to verify backend response
      console.log('CreateEvent response:', res);
      if (res && (res as any).data) {
        onCreated();
        onClose();
        // reset fields
        setTitle('');
        setDescription('');
      } else {
        const maybeMsg = (res as any)?.message || res?.error?.message;
        setError(maybeMsg || 'Oluşturulamadı');
        console.log(res)
      }
    } catch (e: any) {
      setError(e?.message || 'Oluşturulamadı');
      console.log(res)
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} transparent={false} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
          <View style={styles.header}>
            <Text style={styles.title}>Etkinlik Oluştur</Text>
            {submitting && <LoadingView inline />}
          </View>
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 16 }} keyboardShouldPersistTaps="handled">
            <View style={styles.body}>
              {!!error && <Text style={styles.errorText}>{error}</Text>}
              <View>
                <Text style={styles.label}>Başlık</Text>
                <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Toplantı" placeholderTextColor={colors.textSecondary} />
              </View>
              <View>
                <Text style={styles.label}>Açıklama</Text>
                <TextInput style={styles.input} value={description} onChangeText={setDescription} placeholder="Detaylar" placeholderTextColor={colors.textSecondary} />
              </View>
              <View style={styles.row}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Başlangıç</Text>
                  <TextInput style={styles.input} value={startTime} onChangeText={setStartTime} placeholder="09:00" placeholderTextColor={colors.textSecondary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Bitiş</Text>
                  <TextInput style={styles.input} value={endTime} onChangeText={setEndTime} placeholder="10:00" placeholderTextColor={colors.textSecondary} />
                </View>
              </View>
            </View>
          </ScrollView>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.btn, styles.btnSecondary]} onPress={onClose}>
              <Text style={styles.btnTextSecondary}>İptal</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={handleCreate} disabled={submitting}>
              <Text style={styles.btnTextPrimary}>Oluştur</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

export default CreateEventModal;


