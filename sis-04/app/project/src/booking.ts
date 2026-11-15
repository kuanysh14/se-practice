import type { Room } from './rooms';

export interface BookingSlot {
  start: number;
  end: number;
}

export interface CanBookParams {
  start: number;
  end: number;
  now: number;
  blocked: boolean;
  bookings: BookingSlot[];
}

export const MAX_BOOKING_MINUTES = 120;
export const DAY_MINUTES = 1440;

export function canBook({ start, end, now, blocked, bookings }: {
  start: number;
  end: number;
  now: number;
  blocked: boolean;
  bookings: { start: number; end: number }[];
}): boolean {
  if (!(0 <= start && start < end && end <= 1440)) return false;
  if (!(start > now)) return false;
  if (end - start > 120) return false;
  if (blocked) return false;
  for (const b of bookings) {
    if (start < b.end && end > b.start) return false;
  }
  return true;
}

export function checkRoom(
  rooms: Room[],
  roomId: string,
  { start, end, now }: { start: number; end: number; now: number }
): boolean {
  const room = rooms.find((r) => r.id === roomId);
  if (!room) {
    return false;
  }
  return canBook({
    start,
    end,
    now,
    blocked: room.blocked,
    bookings: room.bookings,
  });
}

export function findOverlappingBooking(
  start: number,
  end: number,
  bookings: BookingSlot[]
): BookingSlot | null {
  for (const b of bookings) {
    if (start < b.end && end > b.start) {
      return b;
    }
  }
  return null;
}

export function getRejectionReasons(
  room: Room,
  { start, end, now }: { start: number; end: number; now: number }
): string[] {
  const reasons: string[] = [];
  if (end <= start) {
    reasons.push('End time must be after the start time.');
  } else if (!(0 <= start && end <= DAY_MINUTES)) {
    reasons.push('Interval must satisfy 0 <= start < end <= 1440 minutes.');
  }
  if (start <= now) {
    reasons.push('Start time must be after the current time.');
  }
  if (end - start > MAX_BOOKING_MINUTES) {
    reasons.push(`A booking cannot be longer than ${MAX_BOOKING_MINUTES} minutes.`);
  }
  if (room.blocked) {
    reasons.push(
      room.blockedReason
        ? `This room is blocked: ${room.blockedReason}.`
        : 'This room is currently blocked.'
    );
  }
  const clash = findOverlappingBooking(start, end, room.bookings);
  if (clash) {
    reasons.push(`Overlaps an existing booking (${clash.start}-${clash.end} min).`);
  }
  return reasons;
}