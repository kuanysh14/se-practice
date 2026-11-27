import { useState } from 'react';
import { availabilityReason, canBook, type BookingSlot } from './booking';
import {
  explainAvailability,
  mockExplainAdapter,
  type ExplainResult,
} from './explain';

interface Room {
  id: string;
  name: string;
  location: string;
  capacity: number;
  blocked: boolean;
  blockedReason?: string;
  bookings: (BookingSlot & { id: string; title: string })[];
}

const ROOMS: Room[] = [
  {
    id: 'beacon',
    name: 'Beacon Room',
    location: 'Building 1, Floor 2',
    capacity: 8,
    blocked: false,
    bookings: [
      { id: 'b1', start: 600, end: 660, title: 'SE Practice Sync' },
    ],
  },
  {
    id: 'cedar',
    name: 'Cedar Seminar Room',
    location: 'Building 3, Floor 4',
    capacity: 12,
    blocked: true,
    blockedReason: 'Audio-visual maintenance',
    bookings: [],
  },
];

const toMinutes = (hhmm: string): number => {
  if (!hhmm || !hhmm.includes(':')) return NaN;
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

const formatMinutes = (mins: number): string => {
  const h = String(Math.floor(mins / 60)).padStart(2, '0');
  const m = String(mins % 60).padStart(2, '0');
  return `${h}:${m}`;
};

export default function App() {
  const [selectedRoomId, setSelectedRoomId] = useState(ROOMS[0].id);
  const [nowStr, setNowStr] = useState('09:00');
  const [startStr, setStartStr] = useState('11:00');
  const [endStr, setEndStr] = useState('12:00');
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [explainResult, setExplainResult] = useState<ExplainResult | null>(null);
  const [explainError, setExplainError] = useState<string | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);

  const selectedRoom = ROOMS.find((r) => r.id === selectedRoomId) ?? ROOMS[0];
  const nowMinutes = toMinutes(nowStr);
  const startMinutes = toMinutes(startStr);
  const endMinutes = toMinutes(endStr);

  const checkParams = {
    start: startMinutes,
    end: endMinutes,
    now: nowMinutes,
    blocked: selectedRoom.blocked,
    bookings: selectedRoom.bookings,
  };

  const isAvailable = canBook(checkParams);
  const reasonCode = availabilityReason(checkParams);

  function resetExplanation() {
    setExplainResult(null);
    setExplainError(null);
  }

  async function handleExplain() {
    setIsExplaining(true);
    setExplainError(null);
    try {
      const adapter = simulateFailure
        ? () => Promise.reject(new Error('Simulated adapter failure'))
        : mockExplainAdapter;

      const result = await explainAvailability(
        {
          roomLabel: selectedRoom.name,
          start: startStr,
          end: endStr,
          isAvailable,
          reasonCode,
        },
        adapter
      );
      setExplainResult(result);
    } catch (err) {
      setExplainResult(null);
      setExplainError(err instanceof Error ? err.message : 'Unable to generate explanation.');
    } finally {
      setIsExplaining(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <h1 className="text-2xl font-bold text-slate-900">
            Smart Campus Room Availability Checker
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Deterministic availability check with optional generated explanation.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-3">
            <h2 className="text-lg font-semibold text-slate-800">1. Select Room</h2>
            <div className="space-y-2.5">
              {ROOMS.map((room) => {
                const active = room.id === selectedRoom.id;
                return (
                  <button
                    key={room.id}
                    type="button"
                    onClick={() => {
                      setSelectedRoomId(room.id);
                      resetExplanation();
                    }}
                    className={`w-full text-left rounded-lg border p-3.5 transition ${
                      active
                        ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-slate-900">{room.name}</span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          room.blocked
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {room.blocked ? 'Blocked' : `Seats ${room.capacity}`}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{room.location}</p>
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-200">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                Existing Bookings ({selectedRoom.name})
              </h3>
              {selectedRoom.bookings.length === 0 ? (
                <p className="text-xs text-slate-500">No existing bookings today.</p>
              ) : (
                <ul className="space-y-1.5 text-xs">
                  {selectedRoom.bookings.map((b) => (
                    <li
                      key={b.id}
                      className="flex items-center justify-between rounded bg-slate-100 px-3 py-1.5"
                    >
                      <span className="font-medium text-slate-800">{b.title}</span>
                      <span className="text-slate-600">
                        {formatMinutes(b.start)}–{formatMinutes(b.end)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-4">
            <h2 className="text-lg font-semibold text-slate-800">2. Check & Explain</h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Current Time
                </label>
                <input
                  type="time"
                  value={nowStr}
                  onChange={(e) => {
                    setNowStr(e.target.value);
                    resetExplanation();
                  }}
                  className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  value={startStr}
                  onChange={(e) => {
                    setStartStr(e.target.value);
                    resetExplanation();
                  }}
                  className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  End Time
                </label>
                <input
                  type="time"
                  value={endStr}
                  onChange={(e) => {
                    setEndStr(e.target.value);
                    resetExplanation();
                  }}
                  className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm"
                />
              </div>
            </div>

            <div
              className={`rounded-lg border p-4 ${
                isAvailable
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-950'
                  : 'border-rose-300 bg-rose-50 text-rose-950'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{selectedRoom.name}</span>
                <span className="text-base font-bold">
                  {isAvailable ? 'Available' : 'Unavailable'}
                </span>
              </div>
              <p className="text-xs mt-1 opacity-80">
                Deterministic status reason: <code>{reasonCode}</code>
              </p>
            </div>

            <div className="pt-2 border-t border-slate-200 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={handleExplain}
                  disabled={isExplaining}
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
                >
                  {isExplaining ? 'Explaining...' : 'Explain availability'}
                </button>

                <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={simulateFailure}
                    onChange={(e) => setSimulateFailure(e.target.checked)}
                    className="rounded border-slate-300"
                  />
                  Simulate adapter failure (fallback)
                </label>
              </div>

              {explainError && (
                <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
                  {explainError}
                </div>
              )}

              {explainResult && (
                <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-3.5 text-sm text-indigo-950">
                  <span className="font-semibold">
                    {explainResult.usedFallback
                      ? 'Generated explanation (fallback): '
                      : 'Generated explanation: '}
                  </span>
                  {explainResult.explanation}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}