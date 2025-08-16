'use client';
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const EARTH_RADIUS = 1;

export function GlobeScene({ epicenter, simStart, running }:{ epicenter?: {lat:number, lon:number}, simStart?: number, running: boolean }){
  const mountRef = useRef<HTMLDivElement>(null);
  const state = useRef<{scene?:THREE.Scene, cam?:THREE.PerspectiveCamera, renderer?:THREE.WebGLRenderer, group?:THREE.Group}>({});

  useEffect(()=>{
    const mount = mountRef.current!;
    const renderer = new THREE.WebGLRenderer({ antialias:true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x001018);
    const cam = new THREE.PerspectiveCamera(28, mount.clientWidth/mount.clientHeight, 0.1, 100);
    cam.position.set(0,0,3.2);
    const light = new THREE.PointLight(0xffffff, 2.0); light.position.set(3,2,4); scene.add(light);
    scene.add(new THREE.AmbientLight(0x506070, 0.5));

    const group = new THREE.Group(); scene.add(group);
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(EARTH_RADIUS, 64, 64), new THREE.MeshStandardMaterial({ color:0x0b0b0b, roughness:.95, metalness:.05, emissive:0x111111, emissiveIntensity:.6 }));
    group.add(mesh);

    state.current = {scene, cam, renderer, group};

    let dragging=false, px=0, py=0;
    const onDown=(e:MouseEvent)=>{ dragging=true; px=e.clientX; py=e.clientY; };
    const onUp=()=>{ dragging=false; };
    const onMove=(e:MouseEvent)=>{
      if(!dragging) return;
      const dx=e.clientX-px, dy=e.clientY-py; px=e.clientX; py=e.clientY;
      group.rotation.y += dx*0.005; group.rotation.x += dy*0.005;
    };
    renderer.domElement.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('mousemove', onMove);

    let raf = 0;
    const tick = ()=>{
      raf = requestAnimationFrame(tick);
      renderer.render(scene, cam);
    };
    tick();

    const onResize=()=>{
      const w=mount.clientWidth, h=mount.clientHeight;
      cam.aspect=w/h; cam.updateProjectionMatrix(); renderer.setSize(w,h);
    };
    window.addEventListener('resize', onResize);

    return ()=>{
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('mousemove', onMove);
      renderer.domElement.removeEventListener('mousedown', onDown);
      mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="w-full h-[70vh] rounded-xl border border-slate-800" />;
}
