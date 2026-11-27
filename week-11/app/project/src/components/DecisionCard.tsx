import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import type { Decision } from '@/lib/availability';
import { minutesToLabel, durationLabel } from '@/lib/time';

interface Props {
  decision: Decision | null;
  start: number | null;
  end: number | null;
  roomName?: string;
}

export function DecisionCard({ decision, start, end, roomName }: Props) {
  if (!decision || start == null || end == null) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-dashed border-slate-200 bg-white p-4 text-sm text-slate-400">
        <AlertCircle size={18} />
        Select a room and enter a start and end time to see availability.
      </div>
    );
  }

  if (decision.status === 'available') {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="text-emerald-600" size={22} />
          <div>
            <p className="font-semibold text-emerald-800">Available</p>
            <p className="text-sm text-emerald-700">
              {roomName} is free for {durationLabel(end - start)} (
              {minutesToLabel(start)}–{minutesToLabel(end)}).
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-4">
      <div className="flex items-start gap-3">
        <XCircle className="mt-0.5 shrink-0 text-red-600" size={22} />
        <div className="min-w-0">
          <p className="font-semibold text-red-800">Unavailable</p>
          <ul className="mt-1 list-disc space-y-0.5 pl-5 text-sm text-red-700">
            {decision.reasons.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
