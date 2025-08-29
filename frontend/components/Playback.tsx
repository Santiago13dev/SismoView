// frontend/components/Playback.tsx
"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  value: number;                 // minutos actuales
  onChange: (t: number) => void; // callback al mover/animar
  min?: number;
  max?: number;                  // tope del timeline (min)
  step?: number;
  disabled?: boolean;
};

export default function Playback({
  value,
  onChange,
  min = 0,
  max = 60,
  step = 0.1,
  disabled,
}: Props) {
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1); // 1x, 2x
  const raf = useRef<number | null>(null);
  const last = useRef<number | null>(null);

  useEffect(() => {
    if (!playing || disabled) return;

    const tick = (ts: number) => {
      if (last.current == null) last.current = ts;
      const dt = (ts - last.current) / 1000; // seg
      last.current = ts;

      const tNext = value + dt * speed; // minutos por segundo = 1
      onChange(Math.min(max, tNext));

      if (tNext >= max) {
        setPlaying(false);
        last.current = null;
        raf.current && cancelAnimationFrame(raf.current);
        return;
      }
      raf.current = requestAnimationFrame(tick);
    };

    raf.current = requestAnimationFrame(tick);
    return () => {
      last.current = null;
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [playing, speed, disabled, value, max, onChange]);

  return (
    <div className="card p-3 flex flex-wrap items-center gap-3">
      <button
        className="btn-primary"
        onClick={() => setPlaying((p) => !p)}
        disabled={disabled}
      >
        {playing ? "Pausar" : "Play"}
      </button>

      <div className="flex items-center gap-2">
        <label className="text-xs text-slate-300">Vel</label>
        <select
          className="input w-20"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          disabled={disabled}
        >
          <option value={0.5}>0.5×</option>
          <option value={1}>1×</option>
          <option value={2}>2×</option>
          <option value={4}>4×</option>
        </select>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1"
        disabled={disabled}
      />
      <span className="tabular-nums text-sm text-slate-300">
        {value.toFixed(1)} min
      </span>

      <button
        className="input px-3 py-2"
        onClick={() => onChange(min)}
        disabled={disabled}
      >
        Reset
      </button>
    </div>
  );
}
