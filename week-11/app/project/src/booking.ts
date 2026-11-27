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

export type ReasonCode =
  | 'available'
  | 'invalid_time'
  | 'past_time'
  | 'too_long'
  | 'room_blocked'
  | 'overlap';

const MINUTES_PER_DAY = 1440;
const MAX_DURATION_MIN = 120;

const hasIntegerMinutes = (start: number, end: number, now: number): boolean =>
  Number.isInteger(start) && Number.isInteger(end) && Number.isInteger(now);

const isValidRange = (start: number, end: number): boolean =>
  0 <= start && start < end && end <= MINUTES_PER_DAY;

const startsAfter = (start: number, now: number): boolean => start > now;

const withinMaxDuration = (start: number, end: number): boolean =>
  end - start <= MAX_DURATION_MIN;

const overlaps = (start: number, end: number, b: BookingSlot): boolean =>
  start < b.end && end > b.start;

export function availabilityReason({ start, end, now, blocked, bookings }: CanBookParams): ReasonCode {
  if (!hasIntegerMinutes(start, end, now) || !isValidRange(start, end)) return 'invalid_time';
  if (!startsAfter(start, now)) return 'past_time';
  if (!withinMaxDuration(start, end)) return 'too_long';
  if (blocked) return 'room_blocked';
  if (bookings.some((b) => overlaps(start, end, b))) return 'overlap';
  return 'available';
}

export function canBook({ start, end, now, blocked, bookings }: {
  start: number;
  end: number;
  now: number;
  blocked: boolean;
  bookings: { start: number; end: number }[];
}): boolean {
  return availabilityReason({ start, end, now, blocked, bookings }) === 'available';
}
