// Organization related interfaces
export interface Organization {
  id: number;
  name: string;
  description?: string;
  members?: Member[];
  events?: Event[];
}

export interface Member {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Event {
  id?: number;
  title?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
}

// Navigation interfaces
export interface OrganizationDetailParams {
  organizationId: number;
}

// Component Props interfaces
export interface MemberCardProps {
  member: Member;
  onPress: (member: Member) => void;
}

export interface EventCardProps {
  event: Event;
  onPress: (event: Event) => void;
}

export interface OrganizationHeaderProps {
  organization: Organization;
}

export interface StatsContainerProps {
  memberCount: number;
  eventCount: number;
}

export interface InviteModalProps {
  visible: boolean;
  inviteCode: string;
  isCreating: boolean;
  onClose: () => void;
  onCreate: () => void;
  onShare: () => void;
  onCopy: () => void;
}

export interface MembersListProps {
  members: Member[];
  onMemberPress: (member: Member) => void;
}

export interface CalendarViewProps {
  events: Event[];
  onEventPress: (event: Event) => void;
  onDatePress: (date: string) => void;
  onAddEvent: () => void;
}

export interface MembersDrawerProps {
  visible: boolean;
  members: Member[];
  onClose: () => void;
  onMemberPress: (member: Member) => void;
}
