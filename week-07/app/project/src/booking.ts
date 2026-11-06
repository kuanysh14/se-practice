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

export function canBook({ start, end, now, blocked, bookings }: CanBookParams): boolean {
  if (!(0 <= start && start < end && end <= 1440)) {
    return false;
  }
  if (start <= now) {
    return false;
  }
  if (end - start > 120) {
    return false;
  }
  if (blocked) {
    return false;
  }
  for (const b of bookings) {
    if (start < b.end && b.start < end) {
      return false;
    }
  }
  return true;
}