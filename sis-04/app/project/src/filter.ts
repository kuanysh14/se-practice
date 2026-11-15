import type { Room } from './rooms';

export interface FilterCriteria {
  attendees: number;
  equipment: string[];
}

export function filterRooms(rooms: Room[], { attendees, equipment }: FilterCriteria): Room[] {
  if (!Number.isFinite(attendees) || attendees < 0) {
    return [];
  }
  return rooms.filter((room) => {
    if (room.capacity < attendees) {
      return false;
    }
    return equipment.every((item) => room.equipment.includes(item));
  });
}