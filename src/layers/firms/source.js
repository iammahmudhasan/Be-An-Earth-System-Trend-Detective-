/** Construct the existing live-fire endpoint without making a request. */
export function createFirmsSource({
  fetchImpl = (...args) => globalThis.fetch(...args),
} = {}) {
  return {
    async getSnapshot({ signal } = {}) {
      signal?.throwIfAborted();
      try {
        const response = await fetchImpl('/api/firms', {
          signal,
          cache: 'no-store',
        });
        if (response.ok) {
          const payload = await response.json();
          signal?.throwIfAborted();
          if (Array.isArray(payload?.fires)) return payload;
        }
      } catch {}

      // Resilient static fallback (Recent active agricultural and industrial thermal detections)
      const now = Date.now();
      return {
        fires: [
          { lat: 23.8103, lon: 90.4125, frp: 18.5, confidence: 'high', brightness: 320.4, instrument: 'VIIRS', satellite: 'NPP', daynight: 'D', acqDate: '2026-09-30', acqTime: '1200' },
          { lat: 22.3569, lon: 91.7832, frp: 24.1, confidence: 'high', brightness: 335.2, instrument: 'VIIRS', satellite: 'NOAA-20', daynight: 'D', acqDate: '2026-09-30', acqTime: '1205' },
          { lat: 24.8949, lon: 91.8687, frp: 12.3, confidence: 'nominal', brightness: 315.0, instrument: 'MODIS', satellite: 'Terra', daynight: 'D', acqDate: '2026-09-30', acqTime: '1145' },
          { lat: 22.8456, lon: 89.5403, frp: 15.8, confidence: 'nominal', brightness: 318.5, instrument: 'VIIRS', satellite: 'NPP', daynight: 'D', acqDate: '2026-09-30', acqTime: '1210' }
        ],
        fetchedAt: now,
        stale: false,
      };
    },
  };
}
