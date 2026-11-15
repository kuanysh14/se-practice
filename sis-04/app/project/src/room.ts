export interface Booking {
  id: string;
  start: number;
  end: number;
  title: string;
  organizer: string;
}

export interface Room {
  id: string;
  name: string;
  location: string;
  capacity: number;
  equipment: string[];
  blocked: boolean;
  blockedReason?: string;
  bookings: Booking[];
}

export const AVAILABLE_EQUIPMENT = [
  'projector',
  'whiteboard',
  'video-conferencing',
  'lab-pcs',
] as const;

export const ROOMS: Room[] = [
  {
    id: 'room-a',
    name: 'Beacon Study Room A',
    location: 'Building 1, Floor 2',
    capacity: 8,
    equipment: ['projector', 'whiteboard'],
    blocked: false,
    bookings: [
      {
        id: 'b-101',
        start: 600,
        end: 660,
        title: 'SE Practice Sync',
        organizer: 'Amina K.',
      },
    ],
  },
  {
    id: 'room-b',
    name: 'Horizon Seminar B',
    location: 'Building 2, Floor 1',
    capacity: 20,
    equipment: ['projector', 'whiteboard', 'video-conferencing'],
    blocked: false,
    bookings: [
      {
        id: 'b-201',
        start: 660,
        end: 720,
        title: 'Algorithms Review',
        organizer: 'Timur N.',
      },
    ],
  },
  {
    id: 'room-c',
    name: 'Cedar Lab C',
    location: 'Building 3, Floor 4',
    capacity: 12,
    equipment: ['projector', 'lab-pcs'],
    blocked: true,
    blockedReason: 'Audio-visual maintenance',
    bookings: [],
  },
  {
    id: 'room-d',
    name: 'Focus Pod D',
    location: 'Library Wing, Floor 3',
    capacity: 4,
    equipment: ['whiteboard'],
    blocked: false,
    bookings: [
      {
        id: 'b-401',
        start: 700,
        end: 760,
        title: 'Thesis Check-in',
        organizer: 'Daniyar M.',
      },
    ],
  },
];