import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icon from '@react-native-vector-icons/fontawesome6';
import { useTheme } from '../utils/useTheme';
import { Event } from '../interfaces/organization';

interface CalendarViewProps {
  events: Event[];
  onEventPress: (event: Event) => void;
  onDatePress: (date: string) => void;
  onAddEvent: () => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ 
  events, 
  onEventPress, 
  onDatePress,
  onAddEvent 
}) => {
  const { colors } = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Basit takvim görünümü için gerekli hesaplamalar
  const today = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();
  
  const monthNames = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];
  
  const dayNames = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(month - 1);
    } else {
      newDate.setMonth(month + 1);
    }
    setCurrentDate(newDate);
  };

  const getEventsForDate = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(event => {
      if (!event.startDate) return false;
      const eventDate = new Date(event.startDate).toISOString().split('T')[0];
      return eventDate === dateStr;
    });
  };

  const renderDays = () => {
    const days = [];
    
    // Boş günler (önceki aydan)
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(
        <View key={`empty-${i}`} style={styles.dayCell} />
      );
    }
    
    // Ayın günleri
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = today.getDate() === day && 
                     today.getMonth() === month && 
                     today.getFullYear() === year;
      
      const dayEvents = getEventsForDate(day);
      const hasEvents = dayEvents.length > 0;
      
      days.push(
        <TouchableOpacity
          key={day}
          style={[
            styles.dayCell,
            isToday && styles.todayCell,
            hasEvents && styles.eventDayCell
          ]}
          onPress={() => {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            onDatePress(dateStr);
          }}
        >
          <Text style={[
            styles.dayText,
            isToday && styles.todayText,
            hasEvents && styles.eventDayText
          ]}>
            {day}
          </Text>
          {hasEvents && (
            <View style={styles.eventIndicator}>
              <Text style={styles.eventCount}>{dayEvents.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      );
    }
    
    return days;
  };

  const styles = React.useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 16,
    },
    calendarContainer: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 20,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    monthTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
    },
    navButton: {
      padding: 8,
      borderRadius: 8,
      backgroundColor: colors.primary + '20',
    },
    addEventButton: {
      backgroundColor: colors.primary,
      borderRadius: 8,
      padding: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      marginBottom: 16,
    },
    addEventButtonText: {
      color: colors.surface,
      fontSize: 16,
      fontWeight: '600',
    },
    dayNamesRow: {
      flexDirection: 'row',
      marginBottom: 10,
    },
    dayNameCell: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: 8,
    },
    dayNameText: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.textSecondary,
    },
    calendar: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    dayCell: {
      width: '14.28%', // 7 gün için
      aspectRatio: 1,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 8,
      marginBottom: 4,
      position: 'relative',
    },
    todayCell: {
      backgroundColor: colors.primary + '20',
    },
    eventDayCell: {
      backgroundColor: colors.primary + '10',
    },
    dayText: {
      fontSize: 16,
      color: colors.text,
    },
    todayText: {
      color: colors.primary,
      fontWeight: 'bold',
    },
    eventDayText: {
      fontWeight: '600',
    },
    eventIndicator: {
      position: 'absolute',
      top: 2,
      right: 2,
      backgroundColor: colors.primary,
      borderRadius: 8,
      minWidth: 16,
      height: 16,
      justifyContent: 'center',
      alignItems: 'center',
    },
    eventCount: {
      color: colors.surface,
      fontSize: 10,
      fontWeight: 'bold',
    },
    eventsSection: {
      marginTop: 20,
    },
    eventsSectionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 12,
    },
    eventItem: {
      backgroundColor: colors.background,
      borderRadius: 8,
      padding: 12,
      marginBottom: 8,
      flexDirection: 'row',
      alignItems: 'center',
    },
    eventIcon: {
      marginRight: 12,
    },
    eventInfo: {
      flex: 1,
    },
    eventTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 2,
    },
    eventTime: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    emptyEvents: {
      alignItems: 'center',
      paddingVertical: 20,
    },
    emptyEventsText: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
    },
  }), [colors]);

  const todayEvents = events.filter(event => {
    if (!event.startDate) return false;
    const eventDate = new Date(event.startDate).toDateString();
    return eventDate === today.toDateString();
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addEventButton} onPress={onAddEvent}>
        <Icon name="plus" iconStyle="solid" size={16} color={colors.surface} />
        <Text style={styles.addEventButtonText}>Yeni Etkinlik Ekle</Text>
      </TouchableOpacity>

      <View style={styles.calendarContainer}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.navButton}
            onPress={() => navigateMonth('prev')}
          >
            <Icon name="chevron-left" iconStyle="solid" size={16} color={colors.primary} />
          </TouchableOpacity>
          
          <Text style={styles.monthTitle}>
            {monthNames[month]} {year}
          </Text>
          
          <TouchableOpacity 
            style={styles.navButton}
            onPress={() => navigateMonth('next')}
          >
            <Icon name="chevron-right" iconStyle="solid" size={16} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.dayNamesRow}>
          {dayNames.map((dayName) => (
            <View key={dayName} style={styles.dayNameCell}>
              <Text style={styles.dayNameText}>{dayName}</Text>
            </View>
          ))}
        </View>

        <View style={styles.calendar}>
          {renderDays()}
        </View>
      </View>

      <View style={styles.eventsSection}>
        <Text style={styles.eventsSectionTitle}>
          Bugünün Etkinlikleri ({todayEvents.length})
        </Text>
        
        {todayEvents.length > 0 ? (
          todayEvents.map((event, index) => (
            <TouchableOpacity
              key={event.id || index}
              style={styles.eventItem}
              onPress={() => onEventPress(event)}
            >
              <View style={styles.eventIcon}>
                <Icon name="calendar-days" iconStyle="solid" size={16} color={colors.primary} />
              </View>
              <View style={styles.eventInfo}>
                <Text style={styles.eventTitle}>
                  {event.title || 'Başlıksız Etkinlik'}
                </Text>
                <Text style={styles.eventTime}>
                  {event.startDate ? new Date(event.startDate).toLocaleTimeString('tr-TR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  }) : 'Saat belirtilmemiş'}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyEvents}>
            <Text style={styles.emptyEventsText}>
              Bugün için etkinlik bulunmuyor
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default CalendarView;
