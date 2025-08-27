"use client";

import { useState, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";

const Globe = dynamic(() => import("../components/Globe"), { ssr: false });
const Stats = dynamic(() => import("../components/Stats"), { ssr: false });

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8080";

type SimResponse = {
  rings?: {
    P: { minutes: number; radiusKm: number }[];
    S: { minutes: number; radiusKm: number }[];
  };
  arrivals?: { place: string; type: "P" | "S"; minutes: number }[];
  intensity?: { gridId: string; legend: { label: string; colorHex: string }[] };
};

export default function Home() {
  const [lat, setLat] = useState("10.5");
  const [lon, setLon] = useState("166.3");
  const [mag, setMag] = useState("6.3");
  const [loading, setLoading] = useState(false);
  const [resp, setResp] = useState<SimResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ✅ Chequeo de existencia de texturas para evitar crash del loader
  const [texOk, setTexOk] = useState<boolean | null>(null);
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const urls = [
          "/textures/earth_political_4k.jpg",
          "/textures/earth_normal_2k.jpg",
          "/textures/earth_specular_2k.jpg",
        ];
        const resps = await Promise.all(
          urls.map((u) => fetch(u, { method: "HEAD", cache: "no-store" }))
        );
        if (!alive) return;
        setTexOk(resps.every((r) => r.ok));
      } catch {
        if (!alive) return;
        setTexOk(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // Centro del sismo
  const center = useMemo(() => {
    const la = Number(lat);
    const lo = Number(lon);
    if (Number.isFinite(la) && Number.isFinite(lo)) return { lat: la, lon: lo };
    return null;
  }, [lat, lon]);

  // Adaptar formato para el globo
  const ringsForGlobe = useMemo(() => {
    const p = resp?.rings?.P?.map((r) => r.radiusKm) ?? [];
    const s = resp?.rings?.S?.map((r) => r.radiusKm) ?? [];
    if (p.length === 0 && s.length === 0) return null;
    return { p, s };
  }, [resp]);

  async function simular() {
    setLoading(true);
    setError(null);

    const la = Number(lat);
    const lo = Number(lon);
    const m = Number(mag);

    if (!Number.isFinite(la) || !Number.isFinite(lo) || !Number.isFinite(m)) {
      setLoading(false);
      setError("Lat/Lon/M deben ser números válidos.");
      return;
    }

    try {
      const r = await fetch(`${API_BASE}/api/simulate/seismic`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lat: la,
          lon: lo,
          depthKm: 10,
          magnitude: m,
          cities: [
            { name: "Bogotá", lat: 4.711, lon: -74.0721 },
            { name: "Tokio", lat: 35.6762, lon: 139.6503 },
          ],
        }),
      });

      if (!r.ok) {
        const txt = await r.text().catch(() => "");
        throw new Error(`HTTP ${r.status} ${txt}`);
      }

      const data: SimResponse = await r.json();
      setResp(data);
      console.log("Simulación OK:", data);
    } catch (e: any) {
      console.error("Error al simular:", e);
      setError(e?.message ?? "Error inesperado");
      setResp(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100">
      <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur border-b border-slate-800">
        <div className="max-w-6xl mx-auto p-4 flex flex-wrap gap-3 items-end">
          <h1 className="text-xl font-semibold mr-auto">SismoView – MVP</h1>

          <label className="text-sm">
            Lat
            <input
              className="mt-1 block bg-slate-800 px-3 py-2 rounded w-28"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              inputMode="decimal"
            />
          </label>

          <label className="text-sm">
            Lon
            <input
              className="mt-1 block bg-slate-800 px-3 py-2 rounded w-28"
              value={lon}
              onChange={(e) => setLon(e.target.value)}
              inputMode="decimal"
            />
          </label>

          <label className="text-sm">
            M
            <input
              className="mt-1 block bg-slate-800 px-3 py-2 rounded w-24"
              value={mag}
              onChange={(e) => setMag(e.target.value)}
              inputMode="decimal"
            />
          </label>

          <button
            type="button"
            onClick={simular}
            disabled={loading}
            className="bg-teal-500 hover:bg-teal-400 disabled:opacity-60 text-black font-semibold px-4 py-2 rounded"
          >
            {loading ? "Simulando..." : "Simular"}
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <section className="lg:col-span-2">
          <div className="relative h-[60vh] rounded-xl border border-slate-800 overflow-hidden bg-black">
            {/* Si faltan texturas, aviso de cómo resolver */}
            {texOk === false && (
              <div className="absolute inset-0 grid place-items-center text-center p-6">
                <div>
                  <p className="text-red-300 font-semibold">Faltan texturas del globo</p>
                  <p className="text-slate-300 text-sm mt-2">
                    Copia estos archivos en <code>/public/textures</code>:
                  </p>
                  <pre className="text-xs mt-2 bg-slate-800/70 p-3 rounded">
{`/public/textures/earth_political_4k.jpg
/public/textures/earth_normal_2k.jpg
/public/textures/earth_specular_2k.jpg`}
                  </pre>
                  <p className="text-slate-400 text-xs mt-2">
                    Luego abre en el navegador:
                    <br />
                    <code>/textures/earth_political_4k.jpg</code>
                  </p>
                </div>
              </div>
            )}

            {/* se  monta el globo solo si las texturas existen */}
            {texOk && (
              <Globe
                key={center ? `${center.lat},${center.lon}` : "no-center"}
                center={center}
                rings={ringsForGlobe}
              />
            )}
          </div>

          {error && <p className="mt-3 text-red-400 break-words">Error: {error}</p>}
        </section>

        <aside className="lg:col-span-1">
          <div className="rounded-xl border border-slate-800 p-3 bg-slate-950/50">
            <Stats
              center={center ?? { lat: 0, lon: 0 }}
              rings={resp?.rings ?? null}
              arrivals={resp?.arrivals ?? []}
              intensity={resp?.intensity ?? null}
            />
          </div>

          {!resp && !error && (
            <p className="text-slate-400 text-sm mt-3">
              Pulsa “Simular” para ver anillos P/S e intensidad.
            </p>
          )}
        </aside>

        {resp && (
          <details className="lg:col-span-3 rounded-xl border border-slate-800 p-3 bg-slate-950/30">
            <summary className="cursor-pointer text-slate-300">
              Ver JSON dev (debug)
            </summary>
            <pre className="mt-2 text-xs overflow-auto max-h-72">
              {JSON.stringify(resp, null, 2)}
            </pre>
          </details>
        )}
      </div>
    </main>
  );
}
