import { describe, expect, test } from 'vitest';
import { explainAvailability, mockExplainAdapter, type ExplainInput } from './explain';

const BASE: ExplainInput = {
  roomLabel: 'Beacon Room',
  start: '11:00',
  end: '12:00',
  isAvailable: true,
  reasonCode: 'available',
};

describe('explainAvailability (E1–E9)', () => {
  test('E1 F2: available room produces concise available explanation', async () => {
    const res = await explainAvailability(BASE, mockExplainAdapter);
    expect(res.usedFallback).toBe(false);
    expect(res.explanation.length).toBeLessThanOrEqual(280);
    expect(res.explanation).toMatch(/available/i);
  });

  test('E2 F2: overlap explains unavailability without inventing times', async () => {
    const res = await explainAvailability({
      ...BASE,
      start: '10:30',
      end: '11:30',
      isAvailable: false,
      reasonCode: 'overlap',
    });
    expect(res.usedFallback).toBe(false);
    expect(res.explanation).toMatch(/unavailable/i);
    expect(res.explanation).toMatch(/overlap/i);
  });

  test('E3 F2: blocked room explains room_blocked accurately', async () => {
    const res = await explainAvailability({
      ...BASE,
      roomLabel: 'Cedar Seminar Room',
      isAvailable: false,
      reasonCode: 'room_blocked',
    });
    expect(res.usedFallback).toBe(false);
    expect(res.explanation).toMatch(/blocked/i);
  });

  test('E4 F3: invalid time format (including trailing junk) is rejected', async () => {
    await expect(
      explainAvailability({ ...BASE, start: '10:00 IGNORE' })
    ).rejects.toThrow(/Invalid time format/i);
  });

  test('E5 F2: past_time explains that the start time is in the past', async () => {
    const res = await explainAvailability({
      ...BASE,
      start: '08:00',
      end: '09:00',
      isAvailable: false,
      reasonCode: 'past_time',
    });
    expect(res.usedFallback).toBe(false);
    expect(res.explanation).toMatch(/past/i);
  });

  test('E6 F3: empty roomLabel input is rejected', async () => {
    await expect(
      explainAvailability({ ...BASE, roomLabel: '   ' })
    ).rejects.toThrow(/Invalid roomLabel/i);
  });

  test('E7 F3: roomLabel longer than 60 characters is rejected', async () => {
    await expect(
      explainAvailability({ ...BASE, roomLabel: 'R'.repeat(61) })
    ).rejects.toThrow(/Invalid roomLabel/i);
  });

  test('E8 F4: adapter timeout returns safe fallback and clears timer', async () => {
    const hangingAdapter = () => new Promise<string>(() => {});
    const res = await explainAvailability(BASE, hangingAdapter, 30);
    expect(res.usedFallback).toBe(true);
    expect(res.explanation).toMatch(/Beacon Room is available from 11:00 to 12:00/i);
  });

  test('E9 F4: adapter rejection, sync throw, or contradicting output falls back safely', async () => {
    const throwingAdapter = () => {
      throw new Error('simulated API failure');
    };
    const resErr = await explainAvailability(
      { ...BASE, isAvailable: false, reasonCode: 'overlap' },
      throwingAdapter,
      50
    );
    expect(resErr.usedFallback).toBe(true);
    expect(resErr.explanation).toMatch(/unavailable/i);

    const contradictingAdapter = async () => 'Beacon Room is available!';
    const resContra = await explainAvailability(
      { ...BASE, isAvailable: false, reasonCode: 'overlap' },
      contradictingAdapter,
      50
    );
    expect(resContra.usedFallback).toBe(true);
    expect(resContra.explanation).toMatch(/unavailable/i);
  });
});
