import type { Room } from '@/lib/availability';

export const sampleRooms: Room[] = [
  {
    id: 'room-aurora',
    name: 'Aurora Hall',
    location: 'Library · Floor 2',
    capacity: 40,
    blocked: false,
    bookings: [
      { id: 'b1', start: 540, end: 600, title: 'Intro to Algorithms', organizer: 'Prof. Chen' },
      { id: 'b2', start: 720, end: 780, title: 'Robotics Lab Briefing', organizer: 'Dr. Okafor' },
      { id: 'b3', start: 900, end: 960, title: 'Design Studio Review', organizer: 'M. Rossi' },
    ],
  },
  {
    id: 'room-beacon',
    name: 'Beacon Room',
    location: 'Engineering Block · Floor 1',
    capacity: 18,
    blocked: false,
    bookings: [
      { id: 'b4', start: 600, end: 660, title: 'Faculty Stand-up', organizer: 'Dean Park' },
    ],
  },
  {
    id: 'room-cedar',
    name: 'Cedar Seminar Room',
    location: 'Science Wing · Floor 3',
    capacity: 12,
    blocked: true,
    blockedReason: 'Scheduled maintenance until 18:00',
    bookings: [],
  },
  {
    id: 'room-driftwood',
    name: 'Driftwood Lounge',
    location: 'Student Center · Ground Floor',
    capacity: 8,
    blocked: false,
    bookings: [
      { id: 'b6', start: 780, end: 840, title: 'Study Group — Calculus', organizer: 'Student Council' },
    ],
  },
];
