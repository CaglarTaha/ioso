import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useTheme } from '../../Hooks/useTheme';
import Icon from '@react-native-vector-icons/fontawesome6';
import { CalendarEventType } from '../../Api';

interface HourlyParticipationModalProps {
  visible: boolean;
  date: string; // YYYY-MM-DD
  hour: number; // 0..23
  membersMap: Record<string, CalendarEventType[]>; // userId -> events
  onClose: () => void;
}

const HourlyParticipationModal: React.FC<HourlyParticipationModalProps> = ({ visible, date, hour, membersMap, onClose }) => {
  const { colors } = useTheme();

  const { participants, title } = useMemo(() => {
    const start = new Date(`${date}T${String(hour).padStart(2, '0')}:00:00.000Z`);
    const end = new Date(`${date}T${String(hour).padStart(2, '0')}:59:59.999Z`);
    const list: Array<{ userId: string; userName: string; events: CalendarEventType[] }> = [];

    Object.entries(membersMap).forEach(([userId, evts]) => {
      const overlaps = evts.filter((e) => {
        const s = new Date(e.startDate);
        const f = new Date(e.endDate);
        return s < end && f > start; // overlap check
      });
      if (overlaps.length > 0) {
        const name = overlaps[0]?.createdBy ? `${overlaps[0].createdBy.firstName} ${overlaps[0].createdBy.lastName}` : `Kullanıcı #${userId}`;
        list.push({ userId, userName: name, events: overlaps });
      }
    });

    const t = `${new Date(date).toLocaleDateString('tr-TR', { weekday: 'long', day: '2-digit', month: 'long' })} • ${String(hour).padStart(2, '0')}:00`;
    return { participants: list, title: t };
  }, [membersMap, date, hour]);

  const styles = useMemo(() => StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
    title: { color: colors.text, fontWeight: '700', fontSize: 16 },
    closeBtn: { padding: 8 },
    section: { padding: 16 },
    userName: { color: colors.text, fontWeight: '700', marginBottom: 8 },
    chip: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8, marginRight: 8, marginBottom: 8 },
    chipText: { color: colors.text, fontWeight: '600' },
    chipTime: { color: colors.textSecondary, fontSize: 12 },
    row: { flexDirection: 'row', flexWrap: 'wrap' },
    empty: { padding: 16 },
    emptyText: { color: colors.textSecondary },
  }), [colors]);

  return (
    <Modal visible={visible} onRequestClose={onClose} animationType="slide">
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Katılımcılar • {title}</Text>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Icon name="xmark" iconStyle="solid" size={18} color={colors.text} />
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
          {participants.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>Bu saatte kimsenin etkinliği yok</Text>
            </View>
          ) : (
            participants.map((p) => (
              <View key={p.userId} style={styles.section}>
                <Text style={styles.userName}>{p.userName}</Text>
                <View style={styles.row}>
                  {p.events.map((e) => (
                    <View key={e.id} style={styles.chip}>
                      <Text style={styles.chipText} numberOfLines={1}>{e.title}</Text>
                      <Text style={styles.chipTime}>
                        {new Date(e.startDate).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                        {!!e.endDate && ` - ${new Date(e.endDate).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}`}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

export default HourlyParticipationModal;


