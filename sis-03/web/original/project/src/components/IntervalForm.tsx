import { Play, Square, Clock as ClockIcon } from 'lucide-react';
import { labelToMinutes, minutesToLabel, durationLabel, MINUTES_PER_DAY } from '@/lib/time';

interface Props {
  startLabel: string;
  endLabel: string;
  onStartChange: (v: string) => void;
  onEndChange: (v: string) => void;
  onStartBlur: () => void;
  onEndBlur: () => void;
  startError?: string;
  endError?: string;
  nowMinutes: number;
}

export function IntervalForm({
  startLabel,
  endLabel,
  onStartChange,
  onEndChange,
  onStartBlur,
  onEndBlur,
  startError,
  endError,
  nowMinutes,
}: Props) {
  const start = labelToMinutes(startLabel);
  const end = labelToMinutes(endLabel);
  const duration = start != null && end != null ? end - start : 0;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <TimeField
          icon={<Play size={14} />}
          label="Start time"
          value={startLabel}
          onChange={onStartChange}
          onBlur={onStartBlur}
          error={startError}
          placeholder="e.g. 14:00"
          min={minutesToLabel(Math.min(nowMinutes + 1, MINUTES_PER_DAY - 1))}
        />
        <TimeField
          icon={<Square size={14} />}
          label="End time"
          value={endLabel}
          onChange={onEndChange}
          onBlur={onEndBlur}
          error={endError}
          placeholder="e.g. 15:00"
        />
      </div>

      <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">
        <ClockIcon size={14} className="text-slate-400" />
        <span>
          Duration:{' '}
          <span className="font-semibold text-slate-800">
            {duration > 0 ? durationLabel(duration) : '—'}
          </span>
          {duration > 120 && (
            <span className="ml-2 font-medium text-red-600">exceeds 120 min limit</span>
          )}
        </span>
      </div>
    </div>
  );
}

interface FieldProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (v: string) => void;
  onBlur: () => void;
  error?: string;
  placeholder?: string;
  min?: string;
}

function TimeField({ icon, label, value, onChange, onBlur, error, placeholder, min }: FieldProps) {
  return (
    <label className="block">
      <span className="mb-1 flex items-center gap-1.5 text-sm font-medium text-slate-700">
        <span className="text-slate-400">{icon}</span>
        {label}
      </span>
      <input
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        min={min}
        placeholder={placeholder}
        className={[
          'w-full rounded-lg border bg-white px-3 py-2 text-slate-800 outline-none transition',
          'focus:ring-2',
          error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
            : 'border-slate-200 focus:border-blue-500 focus:ring-blue-200',
        ].join(' ')}
      />
      {error && <p className="mt-1 text-xs font-medium text-red-600">{error}</p>}
    </label>
  );
}
