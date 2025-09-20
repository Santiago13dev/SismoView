export const formatNumber = (num: number, decimals: number = 2): string => {
  return num.toFixed(decimals);
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('es-ES');
};

export const formatCoordinates = (lat: number, lon: number): string => {
  return `${formatNumber(lat)}°, ${formatNumber(lon)}°`;
};