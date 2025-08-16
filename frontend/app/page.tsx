'use client';
import React, { useState } from 'react';
import { GlobeScene } from '../components/GlobeScene';
import { SimulationControls } from '../components/SimulationControls';

export default function Page(){
  const [ev,setEv] = useState<{lat:number, lon:number, mag:number}|null>(null);
  const [running,setRunning] = useState(false);
  const [start,setStart] = useState<number|undefined>(undefined);

  function onStart(lat:number, lon:number, mag:number){
    setEv({lat,lon,mag}); setStart(performance.now()); setRunning(true);
  }

  return (
    <main className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold mb-3">SismoView – MVP</h1>
      <SimulationControls onStart={onStart} />
      <div className="mt-4">
        <GlobeScene epicenter={ev?{lat:ev.lat,lon:ev.lon}:undefined} simStart={start} running={running} />
      </div>
    </main>
  );
}
