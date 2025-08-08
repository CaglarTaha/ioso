import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../Hooks/useTheme';
import Icon from '@react-native-vector-icons/fontawesome6';
import { CalendarEventType } from '../Api';

interface DayScheduleProps {
  date: string; // YYYY-MM-DD
  events: CalendarEventType[];
  onSlotPress: (hour: number) => void;
  onEventPress: (event: CalendarEventType) => void;
}

const DaySchedule: React.FC<DayScheduleProps> = ({ date, events, onSlotPress, onEventPress }) => {
  const { colors } = useTheme();
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  const toggleHour = useCallback((hour: number) => {
    setExpanded((prev) => ({ ...prev, [hour]: !prev[hour] }));
  }, []);

  const slots = useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);

  const eventsByHour = useMemo(() => {
    const map: Record<number, CalendarEventType[]> = {};
    for (const hour of slots) map[hour] = [];
    const dateStr = date; // already YYYY-MM-DD
    events.forEach((ev) => {
      if (!ev.startDate) return;
      const d = new Date(ev.startDate);
      const dStr = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().split('T')[0];
      if (dStr !== dateStr) return;
      const hour = new Date(ev.startDate).getHours();
      map[hour] = map[hour] || [];
      map[hour].push(ev);
    });
    return map;
  }, [events, date, slots]);

  const styles = useMemo(() => StyleSheet.create({
    container: { backgroundColor: colors.surface, borderRadius: 12 },
    row: { paddingVertical: 10, paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
    rowTop: { flexDirection: 'row', alignItems: 'center' },
    timeCol: { width: 56 },
    timeText: { color: colors.textSecondary, fontSize: 12, fontWeight: '600' },
    contentCol: { flex: 1, flexDirection: 'row', alignItems: 'center' },
    dotsRow: { flexDirection: 'row', alignItems: 'center' },
    dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary, marginRight: 6 },
    moreText: { color: colors.textSecondary, fontSize: 10, marginLeft: 2 },
    arrowBtn: { padding: 8, marginLeft: 8 },
    expandedArea: { marginTop: 8, paddingLeft: 56 },
    eventItem: { backgroundColor: colors.background, borderRadius: 8, padding: 8, marginBottom: 6, flexDirection: 'row', alignItems: 'center' },
    eventIcon: { marginRight: 8 },
    eventTitle: { color: colors.text, fontWeight: '600' },
    eventTime: { color: colors.textSecondary, fontSize: 12, marginTop: 2 },
    emptyHint: { color: colors.textSecondary },
  }), [colors]);

  return (
    <View style={styles.container}>
      {slots.map((hour) => {
        const hourLabel = `${String(hour).padStart(2, '0')}:00`;
        const list = eventsByHour[hour] || [];
        return (
          <View key={hour} style={styles.row}>
            <View style={styles.rowTop}>
              <View style={styles.timeCol}>
                <Text style={styles.timeText}>{hourLabel}</Text>
              </View>
              <View style={styles.contentCol}>
                {list.length === 0 ? (
                  <TouchableOpacity onPress={() => onSlotPress(hour)}>
                    <Text style={styles.emptyHint}>—</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.dotsRow}>
                    {list.slice(0, 5).map((_, idx) => (
                      <View key={idx} style={styles.dot} />
                    ))}
                    {list.length > 5 && (
                      <Text style={styles.moreText}>+{list.length - 5}</Text>
                    )}
                  </View>
                )}
              </View>
              <TouchableOpacity style={styles.arrowBtn} onPress={() => toggleHour(hour)}>
                <Icon name={expanded[hour] ? 'chevron-up' : 'chevron-down'} iconStyle="solid" size={12} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            {expanded[hour] && (
              <View style={styles.expandedArea}>
                {list.length === 0 ? (
                  <TouchableOpacity onPress={() => onSlotPress(hour)}>
                    <Text style={styles.emptyHint}>Bu saate etkinlik ekle</Text>
                  </TouchableOpacity>
                ) : (
                  list.map((ev) => (
                    <TouchableOpacity key={ev.id} style={styles.eventItem} onPress={() => onEventPress(ev)}>
                      <View style={styles.eventIcon}>
                        <Icon name="calendar-days" iconStyle="solid" size={14} color={colors.primary} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.eventTitle} numberOfLines={1}>{ev.title}</Text>
                        <Text style={styles.eventTime}>
                          {new Date(ev.startDate).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                          {!!ev.endDate && ` - ${new Date(ev.endDate).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}`}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))
                )}
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
};

export default DaySchedule;


