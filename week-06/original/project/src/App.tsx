import { useCallback, useMemo, useState } from 'react';
import { Building2, Search } from 'lucide-react';
import { sampleRooms } from '@/data/sampleData';
import type { Decision } from '@/lib/availability';
import { checkAvailability } from '@/lib/availability';
import { labelToMinutes } from '@/lib/time';
import { Clock } from '@/components/Clock';
import { RoomList } from '@/components/RoomList';
import { IntervalForm } from '@/components/IntervalForm';
import { DecisionCard } from '@/components/DecisionCard';
import { BookingTimeline } from '@/components/BookingTimeline';

function nowToMinutes(): number {
  const d = new Date();
  return d.getHours() * 60 + d.getMinutes();
}

function App() {
  const [rooms] = useState(sampleRooms);
  const [nowMinutes, setNowMinutes] = useState<number>(nowToMinutes());
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(
    sampleRooms.find((r) => !r.blocked)?.id ?? null
  );
  const [startLabel, setStartLabel] = useState('');
  const [endLabel, setEndLabel] = useState('');
  const [startTouched, setStartTouched] = useState(false);
  const [endTouched, setEndTouched] = useState(false);

  const handleNowChange = useCallback((m: number) => setNowMinutes(m), []);

  const selectedRoom = useMemo(
    () => rooms.find((r) => r.id === selectedRoomId) ?? null,
    [rooms, selectedRoomId]
  );

  const start = labelToMinutes(startLabel);
  const end = labelToMinutes(endLabel);

  const decision: Decision | null = useMemo(() => {
    if (!selectedRoom || start == null || end == null) return null;
    return checkAvailability({ room: selectedRoom, start, end, nowMinutes });
  }, [selectedRoom, start, end, nowMinutes]);

  const startError =
    startTouched && start == null ? 'Enter a valid time, e.g. 14:00' : undefined;
  const endError = endTouched && end == null ? 'Enter a valid time, e.g. 15:00' : undefined;

  function resetForm() {
    setStartLabel('');
    setEndLabel('');
    setStartTouched(false);
    setEndTouched(false);
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Building2 size={18} />
            </span>
            <div>
              <h1 className="text-lg font-bold leading-tight">Smart Campus</h1>
              <p className="text-xs text-slate-500">Room Availability Checker</p>
            </div>
          </div>
          <Clock nowMinutes={nowMinutes} onChange={handleNowChange} />
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-6 px-4 py-6">
        <section>
          <div className="mb-3 flex items-center gap-2">
            <Search size={16} className="text-slate-400" />
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Choose a room
            </h2>
          </div>
          <RoomList rooms={rooms} selectedId={selectedRoomId} onSelect={setSelectedRoomId} />
        </section>

        <section className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3 space-y-4 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
            <h2 className="text-base font-semibold text-slate-800">Check an interval</h2>
            <IntervalForm
              startLabel={startLabel}
              endLabel={endLabel}
              onStartChange={setStartLabel}
              onEndChange={setEndLabel}
              onStartBlur={() => setStartTouched(true)}
              onEndBlur={() => setEndTouched(true)}
              startError={startError}
              endError={endError}
              nowMinutes={nowMinutes}
            />
            <DecisionCard
              decision={decision}
              start={start}
              end={end}
              roomName={selectedRoom?.name}
            />
            <div className="flex justify-end">
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
              >
                Reset
              </button>
            </div>
          </div>

          <div className="lg:col-span-2">
            {selectedRoom ? (
              <BookingTimeline room={selectedRoom} />
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 bg-white p-4 text-sm text-slate-400">
                Select a room to view its bookings.
              </div>
            )}
          </div>
        </section>

        <footer className="pb-6 text-center text-xs text-slate-400">
          Sample data only · Intervals include the start minute and exclude the end minute ·
          No booking data is changed.
        </footer>
      </main>
    </div>
  );
}

export default App;
