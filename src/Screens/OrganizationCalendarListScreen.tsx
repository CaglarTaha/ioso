import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, RefreshControl, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AppHeader from '../Components/ui/AppHeader';
import IconButton from '../Components/ui/IconButton';
import EmptyState from '../Components/ui/EmptyState';
import LoadingView from '../Components/ui/LoadingView';
import { useTheme } from '../Hooks/useTheme';
import { ApiCalendarEvent, CalendarEventType } from '../Api';
import EventCard from '../Components/EventCard';
import { RootStackParamList } from '../types/navigation';

type RouteProps = RouteProp<RootStackParamList, 'OrganizationCalendarList'>;
type NavProps = NativeStackNavigationProp<RootStackParamList, 'OrganizationCalendarList'>;

const OrganizationCalendarListScreen: React.FC = () => {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavProps>();
  const { colors } = useTheme();
  const { organizationId } = route.params;

  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [events, setEvents] = useState<CalendarEventType[]>([]);

  const styles = useMemo(() => StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { flex: 1 },
    toolbar: { flexDirection: 'row', gap: 8 },
  }), [colors]);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await ApiCalendarEvent.GetByOrganization(organizationId);
      setEvents(res.data || []);
    } catch (e) {
      // noop basic
    } finally {
      setIsLoading(false);
    }
  }, [organizationId]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  useEffect(() => { loadData(); }, [loadData]);

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader
        title="Organizasyon Etkinlikleri"
        left={<IconButton name="arrow-left" color={colors.text} onPress={() => navigation.goBack()} />}
        right={<View style={styles.toolbar} />}
      />

      {isLoading && events.length === 0 ? (
        <LoadingView />
      ) : (
        <ScrollView
          style={styles.content}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
          showsVerticalScrollIndicator={false}
        >
          {events.length === 0 ? (
            <EmptyState icon="calendar" title="Etkinlik bulunmuyor" />
          ) : (
            events
              .slice()
              .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
              .map(ev => (
                <EventCard
                  key={ev.id}
                  event={{ id: ev.id, title: ev.title, description: ev.description, startDate: ev.startDate, endDate: ev.endDate }}
                  onPress={() => navigation.navigate('CalendarDateDetail', { organizationId, date: ev.startDate.split('T')[0] })}
                />
              ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default OrganizationCalendarListScreen;


