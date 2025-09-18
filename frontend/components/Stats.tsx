/**
 * Componente Stats para mostrar estadísticas sísmicas en tiempo real
 * Muestra información del epicentro, anillos de propagación, arribos y intensidad
 */
"use client";

import React from 'react';

// Tipos mejorados y más específicos
interface SeismicRing {
  minutes: number;
  radiusKm: number;
}

interface Rings {
  P: SeismicRing[];
  S: SeismicRing[];
}

interface SeismicArrival {
  place: string;
  type: "P" | "S";
  minutes: number;
}

interface LegendItem {
  label: string;
  colorHex: string;
}

interface Intensity {
  gridId: string;
  legend: LegendItem[];
}

interface Center {
  lat: number;
  lon: number;
}

interface StatsProps {
  center: Center;
  rings: Rings | null;
  arrivals: SeismicArrival[];
  intensity: Intensity | null;
}

/**
 * Formatea coordenadas geográficas con el formato apropiado
 */
const formatCoordinate = (value: number, type: 'lat' | 'lon'): string => {
  const abs = Math.abs(value);
  const direction = type === 'lat' 
    ? (value >= 0 ? 'N' : 'S')
    : (value >= 0 ? 'E' : 'W');
  return `${abs.toFixed(3)}° ${direction}`;
};

/**
 * Formatea el tiempo en minutos a un formato más legible
 */
const formatTime = (minutes: number): string => {
  if (minutes < 1) {
    return `${Math.round(minutes * 60)}s`;
  }
  if (minutes < 60) {
    return `${minutes.toFixed(1)}min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = Math.round(minutes % 60);
  return `${hours}h ${remainingMinutes}min`;
};

/**
 * Componente para mostrar un anillo sísmico individual
 */
const RingItem: React.FC<{ ring: SeismicRing; type: 'P' | 'S' }> = ({ ring, type }) => (
  <li className="flex justify-between items-center py-1 px-2 rounded hover:bg-slate-700/30 transition-colors">
    <span className="text-slate-300 font-medium">
      {formatTime(ring.minutes)}
    </span>
    <span className={`font-mono text-sm ${type === 'P' ? 'text-sky-400' : 'text-orange-400'}`}>
      {ring.radiusKm.toLocaleString()} km
    </span>
  </li>
);

/**
 * Componente para mostrar un arribo sísmico
 */
const ArrivalItem: React.FC<{ arrival: SeismicArrival }> = ({ arrival }) => (
  <li className="flex justify-between items-center py-2 px-2 rounded hover:bg-slate-700/30 transition-colors">
    <span className="text-slate-300 font-medium truncate max-w-[120px]" title={arrival.place}>
      {arrival.place}
    </span>
    <div className="flex items-center gap-2">
      <span className={`px-2 py-1 rounded text-xs font-bold ${
        arrival.type === "P" ? "bg-sky-500/20 text-sky-400" : "bg-orange-500/20 text-orange-400"
      }`}>
        {arrival.type}
      </span>
      <span className="text-slate-400 font-mono text-sm">
        {formatTime(arrival.minutes)}
      </span>
    </div>
  </li>
);

/**
 * Componente para mostrar leyenda de intensidad
 */
const IntensityLegend: React.FC<{ legend: LegendItem[] }> = ({ legend }) => (
  <div className="grid grid-cols-1 gap-2">
    {legend.map((item, index) => (
      <div key={index} className="flex items-center gap-3 p-2 rounded hover:bg-slate-700/30 transition-colors">
        <div 
          className="w-4 h-4 rounded-sm border border-slate-600 shadow-sm" 
          style={{ backgroundColor: item.colorHex }}
          aria-label={`Color ${item.colorHex}`}
        />
        <span className="text-slate-300 text-sm font-medium">{item.label}</span>
      </div>
    ))}
  </div>
);

/**
 * Componente principal Stats
 */
export default function Stats({ center, rings, arrivals, intensity }: StatsProps): JSX.Element {
  return (
    <div className="space-y-6 text-sm">
      {/* Información del Epicentro */}
      <section>
        <h3 className="font-semibold text-slate-200 mb-2 flex items-center gap-2">
          <span className="w-2 h-2 bg-red-400 rounded-full"></span>
          Epicentro
        </h3>
        <div className="bg-slate-800/40 p-3 rounded-lg border border-slate-700">
          <div className="text-slate-300 font-mono">
            <div>Lat: {formatCoordinate(center.lat, 'lat')}</div>
            <div>Lon: {formatCoordinate(center.lon, 'lon')}</div>
          </div>
        </div>
      </section>

      {/* Anillos de propagación */}
      {rings && (rings.P.length > 0 || rings.S.length > 0) && (
        <section>
          <h3 className="font-semibold text-slate-200 mb-2">Propagación de Ondas</h3>
          <div className="grid grid-cols-2 gap-3">
            {/* Ondas P */}
            <div className="bg-slate-800/40 p-3 rounded-lg border border-slate-700">
              <div className="text-sky-400 font-semibold mb-2 flex items-center gap-2">
                <span className="w-2 h-2 bg-sky-400 rounded-full"></span>
                Ondas P
              </div>
              <ul className="space-y-1 max-h-32 overflow-y-auto">
                {rings.P.slice(0, 8).map((ring, index) => (
                  <RingItem key={`p-${index}`} ring={ring} type="P" />
                ))}
              </ul>
              {rings.P.length > 8 && (
                <div className="text-xs text-slate-500 mt-2 text-center">
                  +{rings.P.length - 8} más...
                </div>
              )}
            </div>

            {/* Ondas S */}
            <div className="bg-slate-800/40 p-3 rounded-lg border border-slate-700">
              <div className="text-orange-400 font-semibold mb-2 flex items-center gap-2">
                <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                Ondas S
              </div>
              <ul className="space-y-1 max-h-32 overflow-y-auto">
                {rings.S.slice(0, 8).map((ring, index) => (
                  <RingItem key={`s-${index}`} ring={ring} type="S" />
                ))}
              </ul>
              {rings.S.length > 8 && (
                <div className="text-xs text-slate-500 mt-2 text-center">
                  +{rings.S.length - 8} más...
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Arribos a ciudades */}
      {arrivals?.length > 0 && (
        <section>
          <h3 className="font-semibold text-slate-200 mb-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full"></span>
            Arribos ({arrivals.length})
          </h3>
          <div className="bg-slate-800/40 p-3 rounded-lg border border-slate-700">
            <ul className="space-y-1 max-h-40 overflow-y-auto">
              {arrivals.map((arrival, index) => (
                <ArrivalItem key={index} arrival={arrival} />
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Leyenda de intensidad */}
      {intensity?.legend && intensity.legend.length > 0 && (
        <section>
          <h3 className="font-semibold text-slate-200 mb-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
            Escala de Intensidad
          </h3>
          <div className="bg-slate-800/40 p-3 rounded-lg border border-slate-700">
            <IntensityLegend legend={intensity.legend} />
          </div>
        </section>
      )}

      {/* Mensaje cuando no hay datos */}
      {!rings && (!arrivals || arrivals.length === 0) && !intensity?.legend && (
        <div className="text-center py-8 text-slate-500">
          <div className="w-12 h-12 mx-auto mb-3 opacity-50">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <p>Configura un punto epicentral para ver las estadísticas sísmicas</p>
        </div>
      )}
    </div>
  );
}
