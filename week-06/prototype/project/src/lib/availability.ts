import { MINUTES_PER_DAY, minutesToLabel } from './time';

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
  blocked: boolean;
  blockedReason?: string;
  bookings: Booking[];
}

export type Decision =
  | { status: 'available' }
  | { status: 'unavailable'; reasons: string[] };

export interface CheckRequest {
  room: Room;
  start: number;
  end: number;
  nowMinutes: number;
}

function overlapsExisting(start: number, end: number, bookings: Booking[]): Booking | null {
  for (const b of bookings) {
    // Intervals are [start, end). Touching endpoints do NOT overlap.
    if (start < b.end && b.start < end) return b;
  }
  return null;
}

export function checkAvailability(req: CheckRequest): Decision {
  const { room, start, end, nowMinutes } = req;
  const reasons: string[] = [];

  if (end <= start) {
    reasons.push('End time must be after the start time.');
  }
  if (!(0 <= start && start < end && end <= MINUTES_PER_DAY)) {
    reasons.push('Interval must satisfy 0 ≤ start < end ≤ 1440 minutes.');
  }
  if (start <= nowMinutes) {
    reasons.push('Start time must be after the current time.');
  }
  if (end - start > 120) {
    reasons.push('A booking cannot be longer than 120 minutes.');
  }
  if (room.blocked) {
    reasons.push(
      room.blockedReason
        ? `This room is blocked: ${room.blockedReason}.`
        : 'This room is currently blocked.'
    );
  }
  const clash = overlapsExisting(start, end, room.bookings);
  if (clash) {
    reasons.push(
      `Overlaps an existing booking "${clash.title}" (${minutesToLabel(clash.start)}–${minutesToLabel(clash.end)}).`
    );
  }

  return reasons.length === 0
    ? { status: 'available' }
    : { status: 'unavailable', reasons };
}
