export const validateLatitude = (lat: number): boolean => {
  return lat >= -90 && lat <= 90;
};

export const validateLongitude = (lon: number): boolean => {
  return lon >= -180 && lon <= 180;
};

export const validateMagnitude = (mag: number): boolean => {
  return mag >= 0 && mag <= 10;
};

export const validateDepth = (depth: number): boolean => {
  return depth >= 0 && depth <= 1000;
};