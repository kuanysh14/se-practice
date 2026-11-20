import { CalendarDays } from 'lucide-react';
import type { Room } from '@/lib/availability';
import { minutesToLabel } from '@/lib/time';

interface Props {
  room: Room;
}

export function BookingTimeline({ room }: Props) {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="mb-3 flex items-center gap-2">
        <CalendarDays size={16} className="text-slate-400" />
        <h3 className="text-sm font-semibold text-slate-700">
          {room.name} — today's bookings
        </h3>
      </div>

      <div className="space-y-1.5">
        {room.bookings.length === 0 ? (
          <p className="text-sm text-slate-400">
            {room.blocked ? 'Room is blocked — no active bookings.' : 'No bookings today.'}
          </p>
        ) : (
          room.bookings
            .slice()
            .sort((a, b) => a.start - b.start)
            .map((b) => (
              <div
                key={b.id}
                className="flex flex-col gap-1 border-l-2 border-blue-400 bg-blue-50/50 px-3 py-2 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-slate-800">{b.title}</p>
                  <p className="text-xs text-slate-500">{b.organizer}</p>
                </div>
                <span className="shrink-0 rounded-md bg-white px-2 py-0.5 font-mono text-xs text-slate-600 ring-1 ring-slate-200">
                  {minutesToLabel(b.start)}–{minutesToLabel(b.end)}
                </span>
              </div>
            ))
        )}
      </div>

      <div className="mt-4 overflow-x-auto">
        <div className="relative h-12 min-w-[320px] rounded-lg bg-slate-100">
          {hours.map((h) => (
            <div
              key={h}
              className="absolute top-0 h-full border-l border-slate-200"
              style={{ left: `${(h / 24) * 100}%` }}
            >
              {h % 3 === 0 && (
                <span className="absolute -top-0 left-1 text-[10px] text-slate-400">
                  {String(h).padStart(2, '0')}
                </span>
              )}
            </div>
          ))}
          {room.bookings.map((b) => (
            <div
              key={b.id}
              title={`${b.title} ${minutesToLabel(b.start)}–${minutesToLabel(b.end)}`}
              className="absolute top-1.5 bottom-1.5 rounded bg-blue-500/80"
              style={{
                left: `${(b.start / 1440) * 100}%`,
                width: `${((b.end - b.start) / 1440) * 100}%`,
              }}
            />
          ))}
          {room.blocked && (
            <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-red-100/60 text-xs font-medium text-red-700">
              Blocked
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
