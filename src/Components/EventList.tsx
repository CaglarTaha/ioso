import React from 'react';
import { View } from 'react-native';
import EventCard from './EventCard';
import { Event } from '../../interfaces/organization';

interface EventListProps {
  events: Event[];
  onPress: (event: Event) => void;
}

const EventList: React.FC<EventListProps> = ({ events, onPress }) => {
  return (
    <View>
      {events.map((event, idx) => (
        <EventCard key={event.id || idx} event={event} onPress={onPress} />
      ))}
    </View>
  );
};

export default EventList;


