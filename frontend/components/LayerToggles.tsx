"use client";

export type LayerOptions = {
  atmosphere: boolean;
  graticule: boolean;
  equator: boolean;
  stars: boolean;
  stand: boolean;
};

export default function LayerToggles({
  value,
  onChange,
}: {
  value: LayerOptions;
  onChange: (v: LayerOptions) => void;
}) {
  const set = (k: keyof LayerOptions) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      onChange({ ...value, [k]: e.target.checked });

  const reset = () =>
    onChange({ atmosphere: true, graticule: true, equator: true, stars: true, stand: true });

  return (
    <div className="card p-3">
      <div className="mb-2 font-semibold text-sm">Capas del globo</div>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={value.atmosphere} onChange={set("atmosphere")} />
          Atmósfera
        </label>

        <label className="flex items-center gap-2">
          <input type="checkbox" checked={value.graticule} onChange={set("graticule")} />
          Retícula
        </label>

        <label className="flex items-center gap-2">
          <input type="checkbox" checked={value.equator} onChange={set("equator")} />
          Ecuador
        </label>

        <label className="flex items-center gap-2">
          <input type="checkbox" checked={value.stars} onChange={set("stars")} />
          Estrellas
        </label>

        <label className="flex items-center gap-2">
          <input type="checkbox" checked={value.stand} onChange={set("stand")} />
          Base
        </label>
      </div>

      <div className="mt-3">
        <button className="input px-3 py-2" onClick={reset}>Reset</button>
      </div>
    </div>
  );
}
