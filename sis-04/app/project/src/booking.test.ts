import { describe, expect, test } from 'vitest';
import { canBook, checkRoom, type CanBookParams } from './booking';
import { filterRooms } from './filter';
import type { Room } from './rooms';

const TEST_CATALOG: Room[] = [
  {
    id: 'room-a',
    name: 'Beacon Study Room A',
    location: 'Building 1, Floor 2',
    capacity: 8,
    equipment: ['projector', 'whiteboard'],
    blocked: false,
    bookings: [{ id: 'b1', start: 600, end: 660, title: 'Sync', organizer: 'Amina' }],
  },
  {
    id: 'room-b',
    name: 'Horizon Seminar B',
    location: 'Building 2, Floor 1',
    capacity: 20,
    equipment: ['projector', 'whiteboard', 'video-conferencing'],
    blocked: false,
    bookings: [{ id: 'b2', start: 660, end: 720, title: 'Review', organizer: 'Timur' }],
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
    bookings: [],
  },
];

function makeParams(overrides: Partial<CanBookParams> = {}): CanBookParams {
  return {
    start: 660,
    end: 720,
    now: 540,
    blocked: false,
    bookings: [{ start: 600, end: 660 }],
    ...overrides,
  };
}

describe('canBook — preserved AC1–AC5 and boundaries B1–B4', () => {
  test('AC1: starting at or before now or reversed interval is rejected', () => {
    expect(canBook(makeParams({ start: 540, end: 570 }))).toBe(false);
    expect(canBook(makeParams({ start: 750, end: 720 }))).toBe(false);
    expect(canBook(makeParams({ start: 1380, end: 1441 }))).toBe(false);
  });

  test('AC2 B1: duration of exactly 120 minutes is accepted (720-840)', () => {
    expect(canBook(makeParams({ start: 720, end: 840 }))).toBe(true);
  });

  test('AC2 B2: duration of 121 minutes is rejected (720-841)', () => {
    expect(canBook(makeParams({ start: 720, end: 841 }))).toBe(false);
  });

  test('AC3: blocked room is rejected even for a free slot', () => {
    expect(canBook(makeParams({ start: 660, end: 720, blocked: true }))).toBe(false);
  });

  test('AC4 B3: touching endpoints before and after existing booking are accepted', () => {
    expect(canBook(makeParams({ start: 570, end: 600 }))).toBe(true);
    expect(canBook(makeParams({ start: 660, end: 720 }))).toBe(true);
  });

  test('AC4 B4: overlapping existing booking is rejected (630-690)', () => {
    expect(canBook(makeParams({ start: 630, end: 690 }))).toBe(false);
  });

  test('AC5: available check returns true without mutating bookings', () => {
    const params = makeParams({ start: 720, end: 780 });
    const snapshot = structuredClone(params.bookings);
    expect(canBook(params)).toBe(true);
    expect(params.bookings).toEqual(snapshot);
  });
});

describe('filterRooms — F1, F2, F4, B5, B6', () => {
  test('F1: keeps only rooms with capacity >= requested attendees', () => {
    const res = filterRooms(TEST_CATALOG, { attendees: 10, equipment: [] });
    expect(res.map((r) => r.id)).toEqual(['room-b', 'room-c']);
  });

  test('F2: keeps only rooms that have ALL selected equipment', () => {
    const res = filterRooms(TEST_CATALOG, {
      attendees: 1,
      equipment: ['projector', 'whiteboard'],
    });
    expect(res.map((r) => r.id)).toEqual(['room-a', 'room-b']);
  });

  test('F4: returns empty array when no rooms match criteria', () => {
    const res = filterRooms(TEST_CATALOG, {
      attendees: 50,
      equipment: ['lab-pcs'],
    });
    expect(res).toEqual([]);
  });

  test('B5: boundary capacity equal to attendees keeps the room in', () => {
    const res = filterRooms(TEST_CATALOG, { attendees: 8, equipment: [] });
    expect(res.map((r) => r.id)).toContain('room-a');
  });

  test('B6: boundary capacity one below attendees filters the room out', () => {
    const res = filterRooms(TEST_CATALOG, { attendees: 9, equipment: [] });
    expect(res.map((r) => r.id)).not.toContain('room-a');
  });
});

describe('checkRoom & INT — F3, F5, INT', () => {
  test('F3: blocked room in catalog is never reported available', () => {
    expect(checkRoom(TEST_CATALOG, 'room-c', { start: 660, end: 720, now: 540 })).toBe(false);
  });

  test('F5: switching selected room uses that room own bookings for the same times', () => {
    expect(checkRoom(TEST_CATALOG, 'room-a', { start: 660, end: 720, now: 540 })).toBe(true);
    expect(checkRoom(TEST_CATALOG, 'room-b', { start: 660, end: 720, now: 540 })).toBe(false);
  });

  test('INT: filterRooms output feeds directly into checkRoom without mutating catalog', () => {
    const snapshot = structuredClone(TEST_CATALOG);
    const matches = filterRooms(TEST_CATALOG, {
      attendees: 8,
      equipment: ['projector', 'whiteboard'],
    });
    expect(matches.map((r) => r.id)).toEqual(['room-a', 'room-b']);
    expect(checkRoom(matches, matches[0].id, { start: 660, end: 720, now: 540 })).toBe(true);
    expect(checkRoom(matches, matches[1].id, { start: 660, end: 720, now: 540 })).toBe(false);
    expect(TEST_CATALOG).toEqual(snapshot);
  });
});