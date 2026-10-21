import { useEffect, useState } from 'react';

interface Props {
  nowMinutes: number;
  onChange: (minutes: number) => void;
}

function nowToMinutes(): number {
  const d = new Date();
  return d.getHours() * 60 + d.getMinutes();
}

export function Clock({ nowMinutes, onChange }: Props) {
  const [label, setLabel] = useState('');

  useEffect(() => {
    const id = setInterval(() => onChange(nowToMinutes()), 30 * 1000);
    return () => clearInterval(id);
  }, [onChange]);

  return (
    <button
      type="button"
      onClick={() => onChange(nowToMinutes())}
      onMouseEnter={() => setLabel('Click to refresh')}
      onMouseLeave={() => setLabel('')}
      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-slate-900"
      title="Current campus time — used to validate the candidate interval"
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
      </span>
      Current time: {String(Math.floor(nowMinutes / 60)).padStart(2, '0')}:
      {String(nowMinutes % 60).padStart(2, '0')}
      {label && <span className="ml-1 text-xs text-slate-400">· {label}</span>}
    </button>
  );
}
