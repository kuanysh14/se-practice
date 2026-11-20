import { DoorOpen, MapPin, Users, Ban } from 'lucide-react';
import type { Room } from '@/lib/availability';
import { minutesToLabel } from '@/lib/time';

interface Props {
  rooms: Room[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function RoomList({ rooms, selectedId, onSelect }: Props) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {rooms.map((room) => {
        const selected = room.id === selectedId;
        return (
          <button
            key={room.id}
            type="button"
            onClick={() => onSelect(room.id)}
            aria-pressed={selected}
            className={[
              'group relative overflow-hidden rounded-xl border p-4 text-left transition',
              room.blocked
                ? selected
                  ? 'border-red-400 bg-red-50 ring-2 ring-red-200'
                  : 'border-slate-200 bg-white hover:border-red-300 hover:shadow-md'
                : selected
                ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                : 'border-slate-200 bg-white hover:border-blue-300 hover:shadow-md',
            ].join(' ')}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <DoorOpen
                  className={selected ? 'text-blue-600' : 'text-slate-400'}
                  size={18}
                />
                <h3 className="font-semibold text-slate-800">{room.name}</h3>
              </div>
              {room.blocked && (
                <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                  <Ban size={12} /> Blocked
                </span>
              )}
            </div>
            <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
              <MapPin size={14} /> {room.location}
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
              <Users size={14} /> {room.capacity} seats
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {room.bookings.length === 0 ? (
                <span className="text-xs text-slate-400">No bookings today</span>
              ) : (
                room.bookings.map((b) => (
                  <span
                    key={b.id}
                    className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600"
                  >
                    {minutesToLabel(b.start)}–{minutesToLabel(b.end)}
                  </span>
                ))
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
