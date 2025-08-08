import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AppHeader from '../Components/ui/AppHeader';
import IconButton from '../Components/ui/IconButton';
import LoadingView from '../Components/ui/LoadingView';
import EmptyState from '../Components/ui/EmptyState';
import { useTheme } from '../Hooks/useTheme';
import { ApiCalendarEvent, CalendarEventType } from '../Api';
import DaySchedule from '../Components/DaySchedule';
import CreateEventModal from '../Components/modals/CreateEventModal';
import HourlyParticipationModal from '../Components/modals/HourlyParticipationModal';
import { RootStackParamList } from '../types/navigation';

type RouteProps = RouteProp<RootStackParamList, 'CalendarDateDetail'>;
type NavProps = NativeStackNavigationProp<RootStackParamList, 'CalendarDateDetail'>;

const CalendarDateDetailScreen: React.FC = () => {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavProps>();
  const { colors } = useTheme();
  const { organizationId, date } = route.params; // YYYY-MM-DD

  const [isLoading, setIsLoading] = useState(false);
  const [events, setEvents] = useState<CalendarEventType[]>([]);
  const [membersMap, setMembersMap] = useState<Record<string, CalendarEventType[]>>({});
  const [createVisible, setCreateVisible] = useState(false);
  const [prefillHour, setPrefillHour] = useState<number | undefined>(undefined);
  const [whoVisible, setWhoVisible] = useState(false);
  const [whoHour, setWhoHour] = useState<number>(0);

  const styles = useMemo(() => StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { flex: 1, padding: 16 },
    dateBadge: {
      alignSelf: 'flex-start', backgroundColor: colors.primary + '20',
      paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8, marginBottom: 12,
    }
  }), [colors]);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const startDate = `${date}T00:00:00.000Z`;
      const endDate = `${date}T23:59:59.999Z`;
      const res = await ApiCalendarEvent.GetByDateRange(organizationId, startDate, endDate);
      setEvents(res.data || []);
      const grouped = await ApiCalendarEvent.GetAllMembersEvents(organizationId, startDate, endDate);
      setMembersMap(grouped || {});
    } catch (e) {
      // noop basic
    } finally {
      setIsLoading(false);
    }
  }, [organizationId, date]);

  useEffect(() => { loadData(); }, [loadData]);

  const prettyDate = useMemo(() => new Date(date).toLocaleDateString('tr-TR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }), [date]);

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader
        title="Tarih Detayı"
        left={<IconButton name="arrow-left" color={colors.text} onPress={() => navigation.goBack()} />}
      />

      {isLoading ? (
        <LoadingView />
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.dateBadge}>
            <Text style={{ color: colors.primary, fontWeight: '600' }}>{prettyDate}</Text>
          </View>

          <DaySchedule
            date={date}
            events={events}
            onSlotPress={(hour) => {
              setPrefillHour(hour);
              setCreateVisible(true);
            }}
            onEventPress={(ev) => {
              const h = new Date(ev.startDate).getHours();
              setWhoHour(h);
              setWhoVisible(true);
            }}
          />

          {/* Üyelerin aynı gün içindeki görünür etkinlikleri */}
          {Object.keys(membersMap).length > 0 && (
            <View style={{ marginTop: 16 }}>
              <Text style={{ color: colors.text, fontWeight: '700', marginBottom: 8 }}>Üye Etkinlikleri</Text>
              {Object.entries(membersMap).map(([userId, evts]) => (
                <View key={userId} style={{ marginBottom: 12 }}>
                  <Text style={{ color: colors.textSecondary, marginBottom: 6 }}>Kullanıcı #{userId}</Text>
                  {evts.map(evt => (
                    <View key={evt.id} style={{ backgroundColor: colors.surface, borderRadius: 8, padding: 10, marginBottom: 6 }}>
                      <Text style={{ color: colors.text, fontWeight: '600' }}>{evt.title}</Text>
                      <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
                        {new Date(evt.startDate).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                        {!!evt.endDate && ` - ${new Date(evt.endDate).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}`}
                      </Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      )}

      <CreateEventModal
        visible={createVisible}
        organizationId={organizationId}
        date={date}
        hour={prefillHour}
        onClose={() => setCreateVisible(false)}
        onCreated={() => loadData()}
      />

      <HourlyParticipationModal
        visible={whoVisible}
        date={date}
        hour={whoHour}
        membersMap={membersMap}
        onClose={() => setWhoVisible(false)}
      />
    </SafeAreaView>
  );
};

export default CalendarDateDetailScreen;


