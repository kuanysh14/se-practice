import { checkRoom, getRejectionReasons } from '../booking';
import type { Room } from '../rooms';

export type Decision =
  | { status: 'available' }
  | { status: 'unavailable'; reasons: string[] };

export function checkAvailability(
  rooms: Room[],
  roomId: string,
  { start, end, nowMinutes }: { start: number; end: number; nowMinutes: number }
): Decision {
  const allowed = checkRoom(rooms, roomId, { start, end, now: nowMinutes });
  if (allowed) {
    return { status: 'available' };
  }
  const room = rooms.find((r) => r.id === roomId);
  if (!room) {
    return { status: 'unavailable', reasons: ['Selected room was not found.'] };
  }
  return {
    status: 'unavailable',
    reasons: getRejectionReasons(room, { start, end, now: nowMinutes }),
  };
}