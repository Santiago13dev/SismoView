//Componente para reflejar mis estadisticas al usuario
"use client";

type Rings = { P: { minutes: number; radiusKm: number }[]; S: { minutes: number; radiusKm: number }[] };
type LegendItem = { label: string; colorHex: string };
type Intensity = { gridId: string; legend: LegendItem[] };

export default function Stats({
  center,
  rings,
  arrivals,
  intensity,
}: {
  center: { lat: number; lon: number };
  rings: Rings | null;
  arrivals: { place: string; type: "P" | "S"; minutes: number }[];
  intensity: Intensity | null;
}) {
  return (
    <div className="space-y-4 text-sm">
      <div>
        <h3 className="font-semibold text-slate-200">Centro</h3>
        <div className="mt-1 text-slate-300">
          Lat: {center.lat.toFixed(3)}°, Lon: {center.lon.toFixed(3)}°
        </div>
      </div>

      {rings && (
        <div>
          <h3 className="font-semibold text-slate-200">Anillos (km)</h3>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <div>
              <div className="text-slate-400 mb-1">P</div>
              <ul className="space-y-1">
                {rings.P.slice(0, 6).map((r, i) => (
                  <li key={`p-${i}`} className="flex justify-between">
                    <span className="text-slate-300">{r.minutes} min</span>
                    <span className="text-sky-400">{r.radiusKm.toFixed(0)} km</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-slate-400 mb-1">S</div>
              <ul className="space-y-1">
                {rings.S.slice(0, 6).map((r, i) => (
                  <li key={`s-${i}`} className="flex justify-between">
                    <span className="text-slate-300">{r.minutes} min</span>
                    <span className="text-orange-400">{r.radiusKm.toFixed(0)} km</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {arrivals?.length > 0 && (
        <div>
          <h3 className="font-semibold text-slate-200">Arribos</h3>
          <ul className="mt-2 space-y-1">
            {arrivals.map((a, i) => (
              <li key={i} className="flex justify-between">
                <span className="text-slate-300">{a.place}</span>
                <span className={a.type === "P" ? "text-sky-400" : "text-orange-400"}>
                  {a.type} {a.minutes} min
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {intensity?.legend && (
        <div>
          <h3 className="font-semibold text-slate-200">Intensidad</h3>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {intensity.legend.map((l, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="inline-block w-4 h-4 rounded" style={{ backgroundColor: l.colorHex }} />
                <span className="text-slate-300">{l.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
