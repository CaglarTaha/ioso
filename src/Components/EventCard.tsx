import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icon from '@react-native-vector-icons/fontawesome6';
import { useTheme } from '../Hooks/useTheme';
import { EventCardProps } from '../interfaces/organization';

const EventCard: React.FC<EventCardProps> = ({ event, onPress }) => {
  const { colors } = useTheme();

  const styles = React.useMemo(() => StyleSheet.create({
    eventCard: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      flexDirection: 'row',
      alignItems: 'center',
    },
    eventIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primary + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    eventInfo: {
      flex: 1,
    },
    eventTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 2,
    },
    eventDescription: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    eventDate: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 2,
    },
  }), [colors]);

  return (
    <TouchableOpacity style={styles.eventCard} onPress={() => onPress(event)}>
      <View style={styles.eventIcon}>
        <Icon name="calendar-days" iconStyle="solid" size={18} color={colors.primary} />
      </View>
      <View style={styles.eventInfo}>
        <Text style={styles.eventTitle}>
          {event.title || `Etkinlik #${event.id}`}
        </Text>
        <Text style={styles.eventDescription}>
          {event.description || 'Açıklama bulunmuyor'}
        </Text>
        {event.startDate && (
          <Text style={styles.eventDate}>
            {new Date(event.startDate).toLocaleDateString('tr-TR')}
          </Text>
        )}
      </View>
      <Icon name="chevron-right" iconStyle="solid" size={14} color={colors.textSecondary} />
    </TouchableOpacity>
  );
};

export default EventCard;
