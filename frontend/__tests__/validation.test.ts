import { validateLatitude, validateLongitude, validateMagnitude } from '../utils/validation';

describe('Validation Utils', () => {
  describe('validateLatitude', () => {
    it('should accept valid latitudes', () => {
      expect(validateLatitude(0)).toBe(true);
      expect(validateLatitude(45)).toBe(true);
      expect(validateLatitude(-90)).toBe(true);
      expect(validateLatitude(90)).toBe(true);
    });

    it('should reject invalid latitudes', () => {
      expect(validateLatitude(91)).toBe(false);
      expect(validateLatitude(-91)).toBe(false);
      expect(validateLatitude(180)).toBe(false);
    });
  });

  describe('validateLongitude', () => {
    it('should accept valid longitudes', () => {
      expect(validateLongitude(0)).toBe(true);
      expect(validateLongitude(180)).toBe(true);
      expect(validateLongitude(-180)).toBe(true);
    });

    it('should reject invalid longitudes', () => {
      expect(validateLongitude(181)).toBe(false);
      expect(validateLongitude(-181)).toBe(false);
    });
  });
});