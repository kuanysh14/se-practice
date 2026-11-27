import type { ReasonCode } from './booking';

export interface ExplainInput {
  roomLabel: string;
  start: string;
  end: string;
  isAvailable: boolean;
  reasonCode: ReasonCode;
}

export interface ExplainResult {
  explanation: string;
  usedFallback: boolean;
}

export type ExplainAdapter = (input: ExplainInput, instruction: string) => Promise<string>;

export const SYSTEM_INSTRUCTION =
  'You explain Smart Campus room availability decisions strictly from the provided JSON fields ' +
  '(roomLabel, start, end, isAvailable, reasonCode). Write at most 2 short sentences and at most ' +
  '280 characters. Never contradict isAvailable, never invent alternative times, people, or ' +
  'reasons not present in the JSON, and state clearly whether the room is available or unavailable.';

const VALID_REASONS: ReadonlySet<ReasonCode> = new Set([
  'available',
  'invalid_time',
  'past_time',
  'too_long',
  'room_blocked',
  'overlap',
]);

const TIME_RE = /^(?:(?:[01]\d|2[0-3]):[0-5]\d|24:00)$/;

const REASON_PHRASES: Record<ReasonCode, string> = {
  available: 'is available',
  invalid_time: 'has an invalid time range',
  past_time: 'starts in the past',
  too_long: 'exceeds the 120-minute maximum duration',
  room_blocked: 'is blocked',
  overlap: 'overlaps an existing booking',
};

export function fallbackExplanation(input: ExplainInput): string {
  const label = input.roomLabel.trim().slice(0, 60);
  if (input.isAvailable) {
    return `${label} is available from ${input.start} to ${input.end}.`;
  }
  const phrase = REASON_PHRASES[input.reasonCode] ?? 'is unavailable';
  return `${label} is unavailable from ${input.start} to ${input.end} because it ${phrase}.`;
}

function agreesWithDecision(text: string, isAvailable: boolean): boolean {
  const hasUnavailable = /\b(?:unavailable|not available|isn't available|cannot be booked)\b/i.test(text);
  const hasAvailable = /\bavailable\b/i.test(text) && !hasUnavailable;
  return isAvailable ? hasAvailable : hasUnavailable;
}

function sentenceCount(text: string): number {
  return text
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter(Boolean).length;
}

export async function mockExplainAdapter(input: ExplainInput): Promise<string> {
  return fallbackExplanation(input);
}

export async function explainAvailability(
  input: ExplainInput,
  adapter: ExplainAdapter = mockExplainAdapter,
  timeoutMs = 1500
): Promise<ExplainResult> {
  const label = typeof input.roomLabel === 'string' ? input.roomLabel.trim() : '';
  if (!label || label.length > 60) {
    throw new Error('Invalid roomLabel: must be 1 to 60 characters.');
  }
  if (!TIME_RE.test(input.start) || !TIME_RE.test(input.end)) {
    throw new Error('Invalid time format: expected HH:MM.');
  }
  if (typeof input.isAvailable !== 'boolean' || !VALID_REASONS.has(input.reasonCode)) {
    throw new Error('Invalid availability flag or reasonCode.');
  }
  if (input.isAvailable !== (input.reasonCode === 'available')) {
    throw new Error('Inconsistent input: isAvailable must match reasonCode.');
  }

  const cleanInput: ExplainInput = { ...input, roomLabel: label };
  let timerId: ReturnType<typeof setTimeout> | undefined;

  try {
    const timer = new Promise<never>((_, reject) => {
      timerId = setTimeout(() => reject(new Error('timeout')), timeoutMs);
    });
    const raw = await Promise.race([
      Promise.resolve().then(() => adapter(cleanInput, SYSTEM_INSTRUCTION)),
      timer,
    ]);
    const text = typeof raw === 'string' ? raw.trim() : '';
    if (
      !text ||
      text.length > 280 ||
      sentenceCount(text) > 2 ||
      !agreesWithDecision(text, cleanInput.isAvailable)
    ) {
      return { explanation: fallbackExplanation(cleanInput), usedFallback: true };
    }
    return { explanation: text, usedFallback: false };
  } catch {
    return { explanation: fallbackExplanation(cleanInput), usedFallback: true };
  } finally {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
  }
}
