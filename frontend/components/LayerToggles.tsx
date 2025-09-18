/**
 * LayerToggles Component
 * Control de capas visuales para el globo 3D de SismoView
 * Permite activar/desactivar diferentes elementos visuales
 */
"use client";

import React from 'react';

export interface LayerOptions {
  atmosphere: boolean;
  graticule: boolean;
  equator: boolean;
  stars: boolean;
  stand: boolean;
}

interface LayerToggleProps {
  value: LayerOptions;
  onChange: (options: LayerOptions) => void;
}

interface LayerConfig {
  key: keyof LayerOptions;
  label: string;
  description: string;
  icon: string;
}

// Configuración de las capas disponibles
const LAYER_CONFIGS: LayerConfig[] = [
  {
    key: 'atmosphere',
    label: 'Atmósfera',
    description: 'Efecto de atmósfera alrededor del planeta',
    icon: '🌫️'
  },
  {
    key: 'graticule',
    label: 'Retícula',
    description: 'Líneas de latitud y longitud',
    icon: '🗺️'
  },
  {
    key: 'equator',
    label: 'Ecuador',
    description: 'Línea ecuatorial destacada',
    icon: '🌍'
  },
  {
    key: 'stars',
    label: 'Estrellas',
    description: 'Campo de estrellas de fondo',
    icon: '⭐'
  },
  {
    key: 'stand',
    label: 'Base',
    description: 'Soporte del globo terráqueo',
    icon: '🏛️'
  }
];

// Configuraciones predefinidas
const PRESETS = {
  default: { atmosphere: true, graticule: true, equator: true, stars: true, stand: true },
  minimal: { atmosphere: true, graticule: false, equator: false, stars: false, stand: false },
  scientific: { atmosphere: false, graticule: true, equator: true, stars: false, stand: false },
  presentation: { atmosphere: true, graticule: false, equator: true, stars: true, stand: true }
};

/**
 * Componente individual para cada toggle de capa
 */
const LayerToggle: React.FC<{
  config: LayerConfig;
  checked: boolean;
  onChange: (checked: boolean) => void;
}> = ({ config, checked, onChange }) => (
  <div 
    className={`
      relative flex items-center p-3 rounded-lg border transition-all duration-200 cursor-pointer
      ${checked 
        ? 'bg-blue-500/10 border-blue-500/30 shadow-sm' 
        : 'bg-slate-800/40 border-slate-700 hover:border-slate-600'
      }
    `}
    onClick={() => onChange(!checked)}
  >
    <div className="flex items-center gap-3 w-full">
      <span className="text-lg" role="img" aria-label={config.label}>
        {config.icon}
      </span>
      
      <div className="flex-1 min-w-0">
        <div className={`font-medium text-sm ${checked ? 'text-blue-300' : 'text-slate-300'}`}>
          {config.label}
        </div>
        <div className="text-xs text-slate-500 truncate">
          {config.description}
        </div>
      </div>

      {/* Custom Toggle Switch */}
      <div className={`
        relative w-11 h-6 rounded-full transition-colors duration-200
        ${checked ? 'bg-blue-500' : 'bg-slate-600'}
      `}>
        <div className={`
          absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200
          ${checked ? 'translate-x-5' : 'translate-x-0.5'}
        `} />
      </div>
    </div>

    {/* Hidden checkbox for accessibility */}
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="sr-only"
      aria-describedby={`${config.key}-description`}
    />
  </div>
);

/**
 * Componente principal LayerToggles
 */
export default function LayerToggles({ value, onChange }: LayerToggleProps): JSX.Element {
  /**
   * Actualiza una capa específica
   */
  const updateLayer = (key: keyof LayerOptions, checked: boolean) => {
    onChange({ ...value, [key]: checked });
  };

  /**
   * Aplica una configuración predefinida
   */
  const applyPreset = (presetKey: keyof typeof PRESETS) => {
    onChange(PRESETS[presetKey]);
  };

  /**
   * Calcula el número de capas activas
   */
  const activeLayersCount = Object.values(value).filter(Boolean).length;

  return (
    <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700 rounded-xl p-4 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-slate-200 text-sm">Capas del Globo</h3>
          <p className="text-xs text-slate-500">
            {activeLayersCount} de {LAYER_CONFIGS.length} capas activas
          </p>
        </div>
        
        {/* Toggle All Button */}
        <button
          onClick={() => {
            const allActive = activeLayersCount === LAYER_CONFIGS.length;
            const newState = allActive 
              ? { atmosphere: false, graticule: false, equator: false, stars: false, stand: false }
              : { atmosphere: true, graticule: true, equator: true, stars: true, stand: true };
            onChange(newState);
          }}
          className={`
            px-3 py-1.5 rounded-md text-xs font-medium transition-colors
            ${activeLayersCount === LAYER_CONFIGS.length
              ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
              : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
            }
          `}
        >
          {activeLayersCount === LAYER_CONFIGS.length ? 'Ocultar todo' : 'Mostrar todo'}
        </button>
      </div>

      {/* Layer Controls */}
      <div className="space-y-3 mb-4">
        {LAYER_CONFIGS.map((config) => (
          <LayerToggle
            key={config.key}
            config={config}
            checked={value[config.key]}
            onChange={(checked) => updateLayer(config.key, checked)}
          />
        ))}
      </div>

      {/* Presets */}
      <div className="border-t border-slate-700 pt-4">
        <h4 className="text-xs font-medium text-slate-400 mb-3">Configuraciones rápidas</h4>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(PRESETS).map(([key, preset]) => {
            const isActive = JSON.stringify(value) === JSON.stringify(preset);
            
            return (
              <button
                key={key}
                onClick={() => applyPreset(key as keyof typeof PRESETS)}
                className={`
                  px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200
                  ${isActive
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    : 'bg-slate-800/60 text-slate-400 border border-slate-700 hover:bg-slate-700/60 hover:text-slate-300'
                  }
                `}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Performance Indicator */}
      <div className="mt-4 p-2 bg-slate-800/40 rounded-lg border border-slate-700">
        <div className="flex items-center gap-2 text-xs">
          <div className={`w-2 h-2 rounded-full ${
            activeLayersCount <= 3 ? 'bg-green-400' : 
            activeLayersCount <= 4 ? 'bg-yellow-400' : 'bg-red-400'
          }`} />
          <span className="text-slate-400">
            Rendimiento: {activeLayersCount <= 3 ? 'Óptimo' : activeLayersCount <= 4 ? 'Bueno' : 'Intenso'}
          </span>
        </div>
      </div>
    </div>
  );
}
