import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../Hooks/useTheme';
import Icon from '@react-native-vector-icons/fontawesome6';
import { Event } from '../../interfaces/organization';

interface MonthDayListViewProps {
  monthDate?: Date; // default: today-month
  events: Event[];
  onDayPress: (dateISO: string) => void; // YYYY-MM-DD
}

const MonthDayListView: React.FC<MonthDayListViewProps> = ({ monthDate = new Date(), events, onDayPress }) => {
  const { colors } = useTheme();

  const { days, title } = useMemo(() => {
    const base = new Date(monthDate);
    const year = base.getFullYear();
    const month = base.getMonth();
    const today = new Date();
    const isSameMonth = today.getFullYear() === year && today.getMonth() === month;

    const startDay = isSameMonth ? today.getDate() : 1;
    const lastDay = new Date(year, month + 1, 0).getDate();

    const list: { day: number; dateISO: string }[] = [];
    for (let d = startDay; d <= lastDay; d++) {
      const dateISO = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      list.push({ day: d, dateISO });
    }

    const monthTitle = base.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' });
    return { days: list, title: monthTitle };
  }, [monthDate, events]);

  const styles = useMemo(() => StyleSheet.create({
    container: { backgroundColor: colors.surface, borderRadius: 12, margin: 16, overflow: 'hidden' },
    header: { paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
    headerText: { fontSize: 16, fontWeight: '700', color: colors.text },
    row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.border },
    left: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    dayBadge: { width: 32, height: 32, borderRadius: 8, backgroundColor: colors.primary + '20', alignItems: 'center', justifyContent: 'center' },
    dayText: { color: colors.primary, fontWeight: '700' },
    dateText: { color: colors.text },
  }), [colors]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{title}</Text>
      </View>
      {days.map(({ day, dateISO }) => (
        <TouchableOpacity key={dateISO} style={styles.row} onPress={() => onDayPress(dateISO)}>
          <View style={styles.left}>
            <View style={styles.dayBadge}><Text style={styles.dayText}>{day}</Text></View>
            <Text style={styles.dateText}>{new Date(dateISO).toLocaleDateString('tr-TR', { weekday: 'long' })}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default MonthDayListView;


