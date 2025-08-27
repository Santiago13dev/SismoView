// src/lib/geo.ts
// Utils pequeñas y testeables para convertir lat/lon a posiciones 3D.
// Mantén toda la matemática aquí para no ensuciar los componentes.

/**
 * Convierte grados a radianes.
 */
export const deg2rad = (deg: number) => (deg * Math.PI) / 180;

/**
 * Convierte (lat, lon) geográficos a un vector 3D sobre una esfera.
 * @param lat Latitud en grados (-90..90)
 * @param lon Longitud en grados (-180..180)
 * @param radius Radio de la esfera
 * @param lonOffset Desfase opcional en longitud (corrección de textura), en grados
 */
export function latLonToVec3(
  lat: number,
  lon: number,
  radius: number,
  lonOffset = 0
) {
  // theta: horizontal (longitud), phi: vertical (colatitud)
  const phi = deg2rad(90 - lat);
  const theta = deg2rad(lon + lonOffset);

  const x = radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  return { x, y, z };
}
