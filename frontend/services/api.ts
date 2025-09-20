import { simulationCache } from '../utils/cache';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8080';

export const apiClient = {
  async post(endpoint: string, data: any) {
    const cacheKey = `${endpoint}-${JSON.stringify(data)}`;
    const cached = simulationCache.get(cacheKey);
    
    if (cached) {
      console.log('Returning cached data');
      return cached;
    }
    
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    const result = await response.json();
    simulationCache.set(cacheKey, result);
    
    return result;
  }
};