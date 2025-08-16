'use client';
import React, { useState } from 'react';

export function SimulationControls({ onStart }:{ onStart:(lat:number, lon:number, magnitude:number)=>void }){
  const [lat,setLat] = useState('-10.9');
  const [lon,setLon] = useState('166.3');
  const [mag,setMag] = useState('6.3');
  return (
    <div className="flex gap-2 items-end">
      <div className="flex flex-col">
        <label>Lat</label>
        <input className="px-2 py-1 rounded bg-slate-900 border border-slate-700" value={lat} onChange={e=>setLat(e.target.value)} />
      </div>
      <div className="flex flex-col">
        <label>Lon</label>
        <input className="px-2 py-1 rounded bg-slate-900 border border-slate-700" value={lon} onChange={e=>setLon(e.target.value)} />
      </div>
      <div className="flex flex-col">
        <label>M</label>
        <input className="px-2 py-1 rounded bg-slate-900 border border-slate-700" value={mag} onChange={e=>setMag(e.target.value)} />
      </div>
      <button onClick={()=>onStart(parseFloat(lat), parseFloat(lon), parseFloat(mag))} className="px-3 py-2 rounded bg-teal-600 hover:bg-teal-500">Simular</button>
    </div>
  );
}
