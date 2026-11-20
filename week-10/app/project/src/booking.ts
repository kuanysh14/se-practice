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

export function canBook({ start, end, now, blocked, bookings }: {
  start: number;
  end: number;
  now: number;
  blocked: boolean;
  bookings: { start: number; end: number }[];
}): boolean {
  if (!hasIntegerMinutes(start, end, now)) return false;
  if (!isValidRange(start, end)) return false;
  if (!startsAfter(start, now)) return false;
  if (!withinMaxDuration(start, end)) return false;
  if (blocked) return false;
  return !bookings.some((b) => overlaps(start, end, b));
}