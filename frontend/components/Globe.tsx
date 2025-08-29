"use client";

import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, useTexture } from "@react-three/drei";
import { useMemo, useRef } from "react";

export type Center = { lat: number; lon: number };
export type RingSet = { p?: number[]; s?: number[] };

type GlobeProps = {
  center?: Center | null;
  rings?: RingSet | null;
  liveMinutes?: number;   // minutos transcurridos para frentes vivos
  liveVpKmS?: number;     // velocidad P (km/s)
  liveVsKmS?: number;     // velocidad S (km/s)
};

/* ------------------- utilidades geo ------------------- */
const d2r = (d: number) => (d * Math.PI) / 180;
const EARTH_R_KM = 6371;

// Ajuste global para alinear textura y conversión lat/lon
const LON_OFFSET_DEG = -90; // si no calza, prueba 90 o 180

/** lat,lon → vec3 (cámara frente a λ=0) con offset para alinear con la textura */
function latLonToVector3(R: number, lat: number, lon: number) {
  const φ = d2r(lat);
  const λ = d2r(lon + LON_OFFSET_DEG);
  const x = R * Math.cos(φ) * Math.sin(λ);
  const y = R * Math.sin(φ);
  const z = R * Math.cos(φ) * Math.cos(λ);
  return new THREE.Vector3(x, y, z);
}

/* ------------------- materiales/atmósfera ------------------- */
function Atmosphere({ radius = 1.04 }: { radius?: number }) {
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
      float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 6.0);
      gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0) * intensity;
    }
  `;
  return (
    <mesh>
      <sphereGeometry args={[radius, 64, 64]} />
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

/* ------------------- graticule ------------------- */
function Graticule({ color = "#2dd4bf", alpha = 0.25 }) {
  const lines = useMemo(() => {
    const group: JSX.Element[] = [];

    // paralelos cada 30°
    for (let lat = -60; lat <= 60; lat += 30) {
      const pts: THREE.Vector3[] = [];
      for (let lon = -180; lon <= 180; lon += 3) pts.push(latLonToVector3(1.001, lat, lon));
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      group.push(
        <line key={`par-${lat}`}>
          <primitive object={geo} attach="geometry" />
          <lineBasicMaterial attach="material" color={color} transparent opacity={alpha} />
        </line>
      );
    }

    // meridianos cada 30°
    for (let lon = -150; lon <= 180; lon += 30) {
      const pts: THREE.Vector3[] = [];
      for (let lat = -90; lat <= 90; lat += 3) pts.push(latLonToVector3(1.001, lat, lon));
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      group.push(
        <line key={`mer-${lon}`}>
          <primitive object={geo} attach="geometry" />
          <lineBasicMaterial attach="material" color={color} transparent opacity={alpha} />
        </line>
      );
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
  const [colorMap, normalMap, specMap] = useTexture(
    [
      "/textures/earth_political_4k.jpg",
      "/textures/earth_normal_2k.jpg",
      "/textures/earth_specular_2k.jpg",
    ],
    (txs) => txs.forEach((t) => (t.anisotropy = 8))
  );

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
  useFrame(() => ref.current?.lookAt(0, 0, 0));
  return (
    <group position={p}>
      <mesh ref={ref}>
        <coneGeometry args={[0.01, 0.04, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
}

/** Círculo geodésico: puntos a distancia angular constante del centro */
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
    const ang = radiusKm / EARTH_R_KM; // ángulo central
    const c = latLonToVector3(1, center.lat, center.lon).normalize();
    const up = Math.abs(c.y) < 0.99 ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(1, 0, 0);
    const u = new THREE.Vector3().crossVectors(c, up).normalize();
    const v = new THREE.Vector3().crossVectors(c, u).normalize();

    const pts: THREE.Vector3[] = [];
    const step = Math.PI / 90; // ~2°
    for (let t = 0; t <= Math.PI * 2 + 1e-6; t += step) {
      const dir = new THREE.Vector3()
        .copy(c)
        .multiplyScalar(Math.cos(ang))
        .addScaledVector(u, Math.cos(t) * Math.sin(ang))
        .addScaledVector(v, Math.sin(t) * Math.sin(ang));
      pts.push(dir.multiplyScalar(1.001)); // un pelín fuera para evitar z-fighting
    }
    return pts;
  }, [center.lat, center.lon, radiusKm]);

  const geo = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);

  return (
    <line>
      <primitive object={geo} attach="geometry" />
      <lineBasicMaterial attach="material" color={color} />
    </line>
  );
}

/* ------------------- World (dentro del Canvas) ------------------- */
function World({
  center,
  rings,
  liveMinutes,
  liveVpKmS,
  liveVsKmS,
}: {
  center: Center;
  rings?: RingSet | null;
  liveMinutes?: number;
  liveVpKmS?: number;
  liveVsKmS?: number;
}) {
  const worldRef = useRef<THREE.Group>(null!);

  useFrame((_, delta) => {
    const g = worldRef.current;
    if (!g) return;
    g.rotation.z = d2r(23.4); // inclinación de la Tierra
    g.rotation.y += delta * 0.05; // rotación suave
  });

  // defaults de velocidad si no llegan por props
  const vp = typeof liveVpKmS === "number" ? liveVpKmS : 6.0;
  const vs = typeof liveVsKmS === "number" ? liveVsKmS : 3.5;

  return (
    <group ref={worldRef}>
      <EarthBall />
      <Atmosphere radius={1.04} />
      <Graticule />
      <EquatorNeon />

      {/* Epicentro */}
      <Pin lat={center.lat} lon={center.lon} />

      {/* Anillos estáticos (respuesta de backend) */}
      {rings?.p?.map((r, i) => (
        <RingCircle key={`p-${i}`} center={center} radiusKm={r} color="#7cf9f1" />
      ))}
      {rings?.s?.map((r, i) => (
        <RingCircle key={`s-${i}`} center={center} radiusKm={r} color="#ff8ec9" />
      ))}

      {/* Frentes vivos P/S (timeline) */}
      {typeof liveMinutes === "number" && (
        <>
          <RingCircle
            center={center}
            radiusKm={liveMinutes * 60 * vp}
            color="#b0fff7"
          />
          <RingCircle
            center={center}
            radiusKm={liveMinutes * 60 * vs}
            color="#ffb3d5"
          />
        </>
      )}
    </group>
  );
}

/* ============================ GLOBE ============================ */
export default function Globe({
  center,
  rings,
  liveMinutes,
  liveVpKmS,
  liveVsKmS,
}: GlobeProps) {
  if (!center) return null;

  return (
    <Canvas
      camera={{ position: [0, 0, 3.1], fov: 42 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}
      style={{ width: "100%", height: "100%" }}
    >
      {/* Luces */}
      <hemisphereLight intensity={0.5} color={"#cde8ff"} groundColor={"#0b1220"} />
      <directionalLight position={[5, 3, 5]} intensity={1.2} />
      <pointLight position={[-4, -3, -4]} intensity={0.5} />

      {/* Estrellas dentro del Canvas */}
      <Stars radius={120} depth={50} count={4000} factor={3} fade speed={0.15} />

      {/* Mundo */}
      <World
        center={center}
        rings={rings}
        liveMinutes={liveMinutes}
        liveVpKmS={liveVpKmS}
        liveVsKmS={liveVsKmS}
      />
      <Stand />

      {/* Controles */}
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
