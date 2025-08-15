import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";

interface Attendee {
  userId: number;
  firstName: string;
  lastName: string;
  status: string;
}

interface Event {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  eventType: string;
  availability: string;
  isVisible: boolean;
  attendees: Attendee[];
}

interface EventsByTime {
  [time: string]: Event[];
}

interface CategorizedEvents {
  [date: string]: EventsByTime;
}

interface Props {
  categorizedEvents: CategorizedEvents;
}

// Android animasyon desteği
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const formatTime = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const Accordion: React.FC<Props> = ({ categorizedEvents }) => {
  const [openDates, setOpenDates] = useState<{ [date: string]: boolean }>({});
  const [openTimes, setOpenTimes] = useState<{ [key: string]: boolean }>({});

  const toggleDate = (date: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenDates(prev => ({ ...prev, [date]: !prev[date] }));
  };

  const toggleTime = (date: string, time: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const key = `${date}-${time}`;
    setOpenTimes(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 8 }}>
      {Object.entries(categorizedEvents).map(([date, times]) => (
        <View key={date} style={{ marginBottom: 8 }}>
          {/* Tarih Başlığı */}
          <TouchableOpacity style={styles.dateContainer} onPress={() => toggleDate(date)}>
            <Text style={styles.dateText}>{date}</Text>
            <Text style={styles.icon}>{openDates[date] ? "▲" : "▼"}</Text>
          </TouchableOpacity>

          {openDates[date] &&
            Object.entries(times).map(([time, events]) => {
              const key = `${date}-${time}`;
              return (
                <View key={time} style={{ marginLeft: 4, marginTop: 4 }}>
                  {/* Saat Başlığı */}
                  <TouchableOpacity style={styles.timeContainer} onPress={() => toggleTime(date, time)}>
                    <Text style={styles.timeText}>{time}</Text>
                    <Text style={styles.icon}>{openTimes[key] ? "▲" : "▼"}</Text>
                  </TouchableOpacity>

                  {/* Event Kartları */}
                  {openTimes[key] &&
                    events.map(event => (
                      <View key={event.id} style={styles.eventCard}>
                        {/* Üst satır: Başlık + Açıklama */}
                        <Text style={styles.eventTitle}>
                          {event.title}{event.description ? ` • ${event.description}` : ""}
                        </Text>
                        {/* Alt satır: Katılımcılar solda, saat sağda */}
                        <View style={styles.line2Container}>
                          <Text style={styles.eventAttendees}>
                            {event.attendees.map(a => `${a.firstName} ${a.lastName}`).join(", ")}
                          </Text>
                          <Text style={styles.eventTime}>{formatTime(event.startDate)} - {formatTime(event.endDate)}</Text>
                        </View>
                      </View>
                    ))}
                </View>
              );
            })}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  dateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#B3E5FC", // Pastel mavi
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  dateText: { fontWeight: "600", fontSize: 16, color: "#01579B" },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#E1F5FE", // Açık mavi
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginBottom: 2,
  },
  timeText: { fontSize: 14, fontWeight: "500", color: "#0277BD" },
  icon: { fontSize: 12, color: "#0277BD" },
  eventCard: {
    backgroundColor: "#fff",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginTop: 2,
    marginBottom: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 1,
    elevation: 1,
  },
  eventTitle: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 2,
    color: "#222",
  },
  line2Container: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  eventAttendees: {
    fontSize: 12,
    color: "#555",
    flexShrink: 1,
  },
  eventTime: {
    fontSize: 12,
    color: "#555",
    fontWeight: "600",
  },
});

export default Accordion;
