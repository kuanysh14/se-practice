import { useState } from 'react';
import { AVAILABLE_EQUIPMENT, ROOMS } from './rooms';
import { filterRooms } from './filter';
import { checkRoom } from './booking';
import { checkAvailability } from './lib/availability';

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
  const [attendeesInput, setAttendeesInput] = useState('4');
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState(ROOMS[0].id);
  const [nowStr, setNowStr] = useState('09:00');
  const [startStr, setStartStr] = useState('11:00');
  const [endStr, setEndStr] = useState('12:00');

  const attendees = attendeesInput.trim() === '' ? 0 : Number(attendeesInput);
  const matchingRooms = filterRooms(ROOMS, {
    attendees,
    equipment: selectedEquipment,
  });

  const activeRoom =
    matchingRooms.find((r) => r.id === selectedRoomId) ?? matchingRooms[0] ?? null;

  const nowMinutes = toMinutes(nowStr);
  const startMinutes = toMinutes(startStr);
  const endMinutes = toMinutes(endStr);
  const hasBlankTime = !nowStr || !startStr || !endStr;

  const isAvailable =
    activeRoom && !hasBlankTime
      ? checkRoom(ROOMS, activeRoom.id, {
          start: startMinutes,
          end: endMinutes,
          now: nowMinutes,
        })
      : false;

  const decision =
    activeRoom && !hasBlankTime
      ? checkAvailability(ROOMS, activeRoom.id, {
          start: startMinutes,
          end: endMinutes,
          nowMinutes,
        })
      : null;

  function toggleEquipment(item: string) {
    setSelectedEquipment((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <header className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <h1 className="text-2xl font-bold text-slate-900">
            Smart Campus Study Room Availability Checker
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Filter study rooms by attendee count and equipment, then check time slot availability.
          </p>
        </header>

        <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-4">
          <h2 className="text-lg font-semibold text-slate-800">1. Filter Room Catalog (F1, F2)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Minimum Attendees
              </label>
              <input
                type="number"
                min={1}
                value={attendeesInput}
                onChange={(e) => setAttendeesInput(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <span className="block text-sm font-medium text-slate-700 mb-1">
                Required Equipment (must have all selected)
              </span>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_EQUIPMENT.map((item) => {
                  const active = selectedEquipment.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleEquipment(item)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                        active
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-3">
            <h2 className="text-lg font-semibold text-slate-800">
              2. Matching Rooms ({matchingRooms.length})
            </h2>
            {matchingRooms.length === 0 ? (
              <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
                <p className="font-semibold">No rooms match your filter criteria (F4).</p>
                <p className="mt-1">
                  Try lowering the requested attendee count or unchecking one or more equipment tags.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {matchingRooms.map((room) => {
                  const isSelected = activeRoom?.id === room.id;
                  return (
                    <button
                      key={room.id}
                      type="button"
                      onClick={() => setSelectedRoomId(room.id)}
                      className={`w-full text-left rounded-lg border p-3.5 transition ${
                        isSelected
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
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {room.equipment.map((eq) => (
                          <span
                            key={eq}
                            className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded"
                          >
                            {eq}
                          </span>
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </section>

          <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-4">
            <h2 className="text-lg font-semibold text-slate-800">3. Check Time Slot (AC1–AC6, F5)</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Current Time (now)
                </label>
                <input
                  type="time"
                  value={nowStr}
                  onChange={(e) => setNowStr(e.target.value)}
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
                  onChange={(e) => setStartStr(e.target.value)}
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
                  onChange={(e) => setEndStr(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm"
                />
              </div>
            </div>

            {!activeRoom ? (
              <p className="text-sm text-slate-500">
                Select or match a room on the left to inspect its availability and bookings.
              </p>
            ) : hasBlankTime ? (
              <div className="rounded-lg border border-amber-300 bg-amber-50 p-3.5 text-sm text-amber-900">
                Please enter valid current, start, and end times to evaluate availability.
              </div>
            ) : (
              <div
                className={`rounded-lg border p-4 ${
                  isAvailable
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-950'
                    : 'border-rose-300 bg-rose-50 text-rose-950'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{activeRoom.name}</span>
                  <span className="text-base font-bold">
                    {isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                </div>
                {decision?.status === 'unavailable' && decision.reasons.length > 0 && (
                  <ul className="list-disc list-inside text-xs mt-2 space-y-1">
                    {decision.reasons.map((reason, idx) => (
                      <li key={idx}>{reason}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {activeRoom && (
              <div className="pt-2 border-t border-slate-200">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                  Existing Bookings for {activeRoom.name}
                </h3>
                {activeRoom.bookings.length === 0 ? (
                  <p className="text-xs text-slate-500">No existing bookings today.</p>
                ) : (
                  <ul className="space-y-1.5 text-xs">
                    {activeRoom.bookings.map((b) => (
                      <li
                        key={b.id}
                        className="flex items-center justify-between rounded bg-slate-100 px-3 py-1.5"
                      >
                        <span className="font-medium text-slate-800">{b.title}</span>
                        <span className="text-slate-600">
                          {formatMinutes(b.start)}–{formatMinutes(b.end)} ({b.start}–{b.end} min)
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}