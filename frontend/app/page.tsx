"use client";

import { useState, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import Playback from "../components/Playback"; // timeline play/pause/slider
import LayerToggles, { LayerOptions } from "../components/LayerToggles";

// Carga en cliente
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

  // Timeline (minutos)
  const [liveT, setLiveT] = useState(0);
  const [layers, setLayers] = useState<LayerOptions>({
    atmosphere: true,
    graticule: true,
    equator: true,
    stars: true,
    stand: true,
  });

  // Chequeo de texturas para evitar crash del loader
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

  // Adaptar formato para el globo (solo radios)
  const ringsForGlobe = useMemo(() => {
    const p = resp?.rings?.P?.map((r) => r.radiusKm) ?? [];
    const s = resp?.rings?.S?.map((r) => r.radiusKm) ?? [];
    if (p.length === 0 && s.length === 0) return null;
    return { p, s };
  }, [resp]);

  // Estimar velocidades P/S a partir de los anillos (si existen)
  const vp = useMemo(() => {
    const arr = resp?.rings?.P;
    if (!arr || arr.length === 0) return undefined;
    const best = [...arr].sort((a, b) => a.minutes - b.minutes)[0];
    if (!best || best.minutes <= 0) return undefined;
    return best.radiusKm / (best.minutes * 60); // km/s
  }, [resp]);

  const vs = useMemo(() => {
    const arr = resp?.rings?.S;
    if (!arr || arr.length === 0) return undefined;
    const best = [...arr].sort((a, b) => a.minutes - b.minutes)[0];
    if (!best || best.minutes <= 0) return undefined;
    return best.radiusKm / (best.minutes * 60); // km/s
  }, [resp]);

  // Tope del timeline (min) según data (fallback 60)
  const maxTimeline = useMemo(() => {
    const pMax = Math.max(0, ...(resp?.rings?.P?.map((r) => r.minutes) ?? [0]));
    const sMax = Math.max(0, ...(resp?.rings?.S?.map((r) => r.minutes) ?? [0]));
    const m = Math.max(pMax, sMax);
    return m > 0 ? Math.ceil(m * 1.1) : 60;
  }, [resp]);

  // Reset del timeline al cambiar simulación
  useEffect(() => {
    setLiveT(0);
  }, [resp?.rings]);

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
            { name: "Tokio",  lat: 35.6762, lon: 139.6503 },
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
    <main className="mx-auto max-w-7xl px-4 py-6">
      {/* Barra superior: ÚNICO botón Simular */}
      <div className="card mb-6 p-3 flex flex-wrap items-end gap-3 justify-between">
        <h1 className="text-lg font-semibold tracking-tight">
          SismoView <span className="text-cyan-300">MVP</span>
        </h1>

        <div className="flex flex-wrap items-end gap-2">
          <label className="text-xs text-slate-300">
            Lat
            <input
              className="input mt-1 w-24"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              inputMode="decimal"
            />
          </label>
          <label className="text-xs text-slate-300">
            Lon
            <input
              className="input mt-1 w-24"
              value={lon}
              onChange={(e) => setLon(e.target.value)}
              inputMode="decimal"
            />
          </label>
          <label className="text-xs text-slate-300">
            M
            <input
              className="input mt-1 w-20"
              value={mag}
              onChange={(e) => setMag(e.target.value)}
              inputMode="decimal"
            />
          </label>

          <button
            className="btn-primary"
            onClick={simular}
            disabled={loading || !center || texOk === false}
          >
            {loading ? "Simulando..." : "Simular"}
          </button>
        </div>
      </div>

      {/* Grid principal */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* CONTENEDOR DEL GLOBO: transparente (no usar .card aquí) */}
        <section className="rounded-2xl border border-white/10 shadow-xl overflow-hidden lg:col-span-3">
          <div className="relative h-[68vh] bg-transparent">
            {/* Aviso si faltan texturas */}
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
                </div>
              </div>
            )}

            {texOk && (
              <Globe
                key={center ? `${center.lat},${center.lon}` : "no-center"}
                center={center}
                rings={ringsForGlobe}
                liveMinutes={liveT}
                liveVpKmS={vp}
                liveVsKmS={vs}
                showAtmosphere={layers.atmosphere}
                showGraticule={layers.graticule}
                showEquator={layers.equator}
                showStars={layers.stars}
                showStand={layers.stand}
              />
            )}

            {/* Vignette sutil */}
            <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,.55)]" />
          </div>
        </section>

        {/* Panel derecho: aquí SÍ usamos .card */}
        <aside className="card p-4 lg:col-span-2">
          <Stats
            center={center ?? { lat: 0, lon: 0 }}
            rings={resp?.rings ?? null}
            arrivals={resp?.arrivals ?? []}
            intensity={resp?.intensity ?? null}
          />
          {/* Panel de capas */}
        <div className="mt-4">
           <LayerToggles value={layers} onChange={setLayers} />
        </div>

          {!resp && !error && (
            <p className="text-slate-400 text-sm mt-3">
              Pulsa “Simular” para ver anillos P/S e intensidad.
            </p>
          )}
          {error && <p className="text-red-400 text-sm mt-3 break-words">Error: {error}</p>}
        </aside>

        {/* Timeline debajo del globo, ocupando las mismas 3 columnas */}
        <div className="lg:col-span-3">
          <div className="mt-2">
            <Playback
              value={liveT}
              onChange={setLiveT}
              max={maxTimeline}
              disabled={!center || texOk === false}
            />
          </div>
        </div>
      </div>

      {/* Debug JSON */}
      {resp && (
        <details className="mt-6 rounded-xl border border-white/10 p-3 bg-white/5">
          <summary className="cursor-pointer text-slate-300">Ver JSON dev (debug)</summary>
          <pre className="mt-2 text-xs overflow-auto max-h-72">
            {JSON.stringify(resp, null, 2)}
          </pre>
        </details>
      )}
    </main>
  );
}
