import { describe, expect, test } from 'vitest';
import { canBook, type CanBookParams } from './booking';

// Default fixture, rebuilt for every test so no test can affect another.
// Time is fixed by construction: canBook takes `now` as a parameter (minutes since midnight).
function makeParams(overrides: Partial<CanBookParams> = {}): CanBookParams {
  return {
    start: 0,
    end: 0,
    now: 540,
    blocked: false,
    bookings: [{ start: 600, end: 660 }],
    ...overrides,
  };
}

describe('canBook', () => {
  test('T01 AC4: touching after existing booking is accepted (660-720)', () => {
    expect(canBook(makeParams({ start: 660, end: 720 }))).toBe(true);
  });

  test('T02 AC1: starting exactly at now is rejected (540-570)', () => {
    expect(canBook(makeParams({ start: 540, end: 570 }))).toBe(false);
  });

  test('T03 AC1: zero-duration interval is rejected (720-720)', () => {
    expect(canBook(makeParams({ start: 720, end: 720 }))).toBe(false);
  });

  test('T04 AC1: reversed interval is rejected (750-720)', () => {
    expect(canBook(makeParams({ start: 750, end: 720 }))).toBe(false);
  });

  test('T05 AC1: interval ending past day end is rejected (1380-1441)', () => {
    expect(canBook(makeParams({ start: 1380, end: 1441 }))).toBe(false);
  });

  test('T06 AC2: exactly 120 minutes is accepted (720-840)', () => {
    expect(canBook(makeParams({ start: 720, end: 840 }))).toBe(true);
  });

  test('T07 AC2: 121 minutes is rejected (720-841)', () => {
    expect(canBook(makeParams({ start: 720, end: 841 }))).toBe(false);
  });

  test('T08 AC4: touching before existing booking is accepted (570-600)', () => {
    expect(canBook(makeParams({ start: 570, end: 600 }))).toBe(true);
  });

  test('T09 AC4: partial overlap is rejected (630-690)', () => {
    expect(canBook(makeParams({ start: 630, end: 690 }))).toBe(false);
  });

  test('T10 AC4: interval containing existing booking is rejected (570-690)', () => {
    expect(canBook(makeParams({ start: 570, end: 690 }))).toBe(false);
  });

  test('T11 AC4: interval inside existing booking is rejected (615-645)', () => {
    expect(canBook(makeParams({ start: 615, end: 645 }))).toBe(false);
  });

  test('T12 AC4: identical interval is rejected (600-660)', () => {
    expect(canBook(makeParams({ start: 600, end: 660 }))).toBe(false);
  });

  test('T13 AC3: blocked room is rejected (660-720, blocked)', () => {
    expect(canBook(makeParams({ start: 660, end: 720, blocked: true }))).toBe(false);
  });

  test('T14 AC4: empty bookings list has no overlaps (630-690)', () => {
    expect(canBook(makeParams({ start: 630, end: 690, bookings: [] }))).toBe(true);
  });

  test('T15 AC5: available request returns true and leaves bookings unchanged (660-720)', () => {
    const params = makeParams({ start: 660, end: 720 });
    const originalRef = params.bookings;
    const snapshot = structuredClone(params.bookings);

    expect(canBook(params)).toBe(true);

    expect(params.bookings).toBe(originalRef);
    expect(params.bookings).toEqual(snapshot);
    expect(params.bookings).toHaveLength(1);
  });
});