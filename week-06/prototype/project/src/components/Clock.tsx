import { Clock as ClockIcon } from 'lucide-react';
import { minutesToLabel, labelToMinutes } from '@/lib/time';

interface Props {
  nowMinutes: number;
  onChange: (minutes: number) => void;
}

export function Clock({ nowMinutes, onChange }: Props) {
  return (
    <label className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 shadow-sm">
      <ClockIcon size={14} className="text-slate-400" />
      <span className="text-slate-500">Current time</span>
      <input
        type="time"
        value={minutesToLabel(nowMinutes)}
        onChange={(e) => {
          const mins = labelToMinutes(e.target.value);
          if (mins != null) onChange(mins);
        }}
        className="bg-transparent text-sm font-semibold text-slate-800 outline-none"
        title="Edit the current campus time used to validate the candidate interval"
      />
    </label>
  );
}
