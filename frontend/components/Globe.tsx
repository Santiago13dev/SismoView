"use client";

import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, useTexture } from "@react-three/drei";
import { useMemo, useRef } from "react";

/** Props mínimas que ya usabas */
export type Center = { lat: number; lon: number };
export type RingSet = { p?: number[]; s?: number[] }; // kilómetros (puede venir vacío)

type GlobeProps = { center?: Center | null; rings?: RingSet | null };

/* ------------------------- utilidades geo ------------------------- */
const d2r = (d: number) => (d * Math.PI) / 180;
const r2d = (r: number) => (r * 180) / Math.PI;
const EARTH_R_KM = 6371;

// lat,lon => vec3 en una esfera de radio R
function latLonToVector3(R: number, lat: number, lon: number) {
  const phi = d2r(90 - lat);
  const theta = d2r(lon + 180);
  const x = -R * Math.sin(phi) * Math.cos(theta);
  const z = R * Math.sin(phi) * Math.sin(theta);
  const y = R * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

// punto destino a un azimut y distancia angular (geodesia simple)
function destinationPoint(lat: number, lon: number, bearingDeg: number, angDistRad: number) {
  const φ1 = d2r(lat);
  const λ1 = d2r(lon);
  const θ = d2r(bearingDeg);
  const sinφ1 = Math.sin(φ1);
  const cosφ1 = Math.cos(φ1);
  const sinAd = Math.sin(angDistRad);
  const cosAd = Math.cos(angDistRad);

  const sinφ2 = sinφ1 * cosAd + cosφ1 * sinAd * Math.cos(θ);
  const φ2 = Math.asin(sinφ2);
  const y = Math.sin(θ) * sinAd * cosφ1;
  const x = cosAd - sinφ1 * sinφ2;
  const λ2 = λ1 + Math.atan2(y, x);

  return { lat: r2d(φ2), lon: r2d(λ2) };
}

/* --------------------------- materiales -------------------------- */

function Atmosphere() {
  // shader muy simple de “rim light”
  const vertexShader = /* glsl */ `
    varying vec3 vNormal;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;
  const fragmentShader = /* glsl */ `
    varying vec3 vNormal;
    void main() {
      float intensity = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.5);
      gl_FragColor = vec4(0.35, 0.85, 1.0, 1.0) * intensity; // cian
    }
  `;
  return (
    <mesh scale={1.018}>
      <sphereGeometry args={[1, 64, 64]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        blending={THREE.AdditiveBlending}
        side={THREE.BackSide}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

function Graticule({ color = "#2dd4bf", alpha = 0.25 }) {
  // meridianos y paralelos
  const lines = useMemo(() => {
    const group: JSX.Element[] = [];
    const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: alpha });

    // paralelos cada 30°
    for (let lat = -60; lat <= 60; lat += 30) {
      const pts: THREE.Vector3[] = [];
      for (let lon = -180; lon <= 180; lon += 3) pts.push(latLonToVector3(1.001, lat, lon));
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      group.push(<line key={`par-${lat}`} geometry={geo} material={mat} />);
    }
    // meridianos cada 30°
    for (let lon = -150; lon <= 180; lon += 30) {
      const pts: THREE.Vector3[] = [];
      for (let lat = -90; lat <= 90; lat += 3) pts.push(latLonToVector3(1.001, lat, lon));
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      group.push(<line key={`mer-${lon}`} geometry={geo} material={mat} />);
    }
    return group;
  }, [color, alpha]);

  return <group>{lines}</group>;
}

function EquatorNeon() {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[1.006, 0.006, 16, 256]} />
      <meshBasicMaterial color="#4de6ff" transparent opacity={0.9} />
    </mesh>
  );
}

function Stand() {
  // Soporte sencillo (anillo + poste + base) estilo globo de escritorio
  return (
    <group position={[0, -1.3, 0]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.25, 0.025, 10, 80]} />
        <meshStandardMaterial color="#4a3f2b" roughness={0.6} metalness={0.2} />
      </mesh>
      <mesh position={[0, 0.65, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 1.3, 16]} />
        <meshStandardMaterial color="#4a3f2b" roughness={0.6} metalness={0.2} />
      </mesh>
      <mesh>
        <cylinderGeometry args={[0.55, 0.65, 0.18, 32]} />
        <meshStandardMaterial color="#3a3224" roughness={0.7} metalness={0.15} />
      </mesh>
    </group>
  );
}

/* ----------------------------- Tierra ----------------------------- */

function EarthBall() {
  // Carga de texturas desde /public/textures
  const [colorMap, normalMap, specMap] = useTexture(
    [
      "/textures/earth_political_4k.jpg",
      "/textures/earth_normal_2k.jpg",
      "/textures/earth_specular_2k.jpg",
    ],
    (txs) => txs.forEach((t) => (t.anisotropy = 8))
  );

  // El mapa "specular" es para Phong, no para Standard.
  const hasNormal = (normalMap as any)?.image;
  const hasSpec = (specMap as any)?.image;

  return (
    <mesh>
      <sphereGeometry args={[1, 128, 128]} />
      <meshPhongMaterial
        map={colorMap as THREE.Texture}
        normalMap={hasNormal ? (normalMap as THREE.Texture) : undefined}
        specularMap={hasSpec ? (specMap as THREE.Texture) : undefined}
        shininess={12}
      />
    </mesh>
  );
}

/* ------------------------- pines y anillos ------------------------ */

function Pin({ lat, lon, color = "#8be9fd" }: { lat: number; lon: number; color?: string }) {
  const ref = useRef<THREE.Mesh>(null!);
  const p = useMemo(() => latLonToVector3(1.005, lat, lon), [lat, lon]);
  useFrame(() => {
    if (!ref.current) return;
    ref.current.lookAt(0, 0, 0);
  });
  return (
    <group position={p}>
      <mesh ref={ref}>
        <coneGeometry args={[0.01, 0.04, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
}

function RingCircle({
  center,
  radiusKm,
  color,
}: {
  center: Center;
  radiusKm: number;
  color: string;
}) {
  const points = useMemo(() => {
    const out: THREE.Vector3[] = [];
    const ang = radiusKm / EARTH_R_KM; // distancia angular (rad)
    for (let b = 0; b <= 360; b += 2) {
      const d = destinationPoint(center.lat, center.lon, b, ang);
      out.push(latLonToVector3(1.001, d.lat, d.lon));
    }
    return out;
  }, [center.lat, center.lon, radiusKm]);

  const geo = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);
  return (
    <line geometry={geo}>
      <lineBasicMaterial color={color} />
    </line>
  );
}

/* ------------------- World: vive DENTRO del Canvas ------------------- */

function World({ center, rings }: { center: Center; rings?: RingSet | null }) {
  const worldRef = useRef<THREE.Group>(null!);

  // Animación: tilt + rotación suave
  useFrame((_, delta) => {
    if (!worldRef.current) return;
    worldRef.current.rotation.z = d2r(23.4);
    worldRef.current.rotation.y += delta * 0.05;
  });

  return (
    <group ref={worldRef}>
      <EarthBall />
      <Atmosphere />
      <Graticule />
      <EquatorNeon />
      <Pin lat={center.lat} lon={center.lon} />
      {rings?.p?.map((r, i) => (
        <RingCircle key={`p-${i}`} center={center} radiusKm={r} color="#7cf9f1" />
      ))}
      {rings?.s?.map((r, i) => (
        <RingCircle key={`s-${i}`} center={center} radiusKm={r} color="#ff8ec9" />
      ))}
    </group>
  );
}

/* ============================ GLOBE ============================ */

export default function Globe({ center, rings }: GlobeProps) {
  // 🔒 Si aún no hay center (hidratación/primer render), no dibujes nada
  if (!center) return null;

  return (
    <Canvas
      camera={{ position: [0, 0, 3.1], fov: 42 }}
      dpr={[1, 2]}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
    >
      {/* Fondo y luces */}
      <color attach="background" args={["#0b1220"]} />
      <hemisphereLight intensity={0.5} color={"#cde8ff"} groundColor={"#0b1220"} />
      <directionalLight position={[5, 3, 5]} intensity={1.2} />
      <pointLight position={[-4, -3, -4]} intensity={0.5} />

      {/* Estrellas sutiles */}
      <Stars radius={80} depth={35} count={1600} factor={2} fade speed={0.2} />

      {/* Globo + elementos */}
      <World center={center} rings={rings} />

      {/* Soporte / base (decorativo) */}
      <Stand />

      <OrbitControls
        enableDamping
        dampingFactor={0.08}
        minDistance={1.6}
        maxDistance={6}
        rotateSpeed={0.8}
        zoomSpeed={0.9}
        enablePan={false}
        target={[0, 0, 0]}
      />
    </Canvas>
  );
}
