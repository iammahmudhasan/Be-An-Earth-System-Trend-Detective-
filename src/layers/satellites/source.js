const GROUPS = new Set([
  'stations',
  'visual',
  'gps-ops',
  'glo-ops',
  'galileo',
  'geo',
  'starlink',
]);

const CELESTRAK_DIRECT_URLS = {
  stations: 'https://celestrak.org/NORAD/elements/gp.php?GROUP=stations&FORMAT=tle',
  visual: 'https://celestrak.org/NORAD/elements/gp.php?GROUP=visual&FORMAT=tle',
  'gps-ops': 'https://celestrak.org/NORAD/elements/gp.php?GROUP=gps-ops&FORMAT=tle',
  'glo-ops': 'https://celestrak.org/NORAD/elements/gp.php?GROUP=glo-ops&FORMAT=tle',
  galileo: 'https://celestrak.org/NORAD/elements/gp.php?GROUP=galileo&FORMAT=tle',
  geo: 'https://celestrak.org/NORAD/elements/gp.php?GROUP=geo&FORMAT=tle',
  starlink: 'https://celestrak.org/NORAD/elements/gp.php?GROUP=starlink&FORMAT=tle',
};

/** Read catalog text from the existing group endpoint using a supplied transport. */
export function createSatelliteSource({
  fetchImpl = (...args) => globalThis.fetch(...args),
} = {}) {
  return {
    async readGroup(group, { signal } = {}) {
      if (!GROUPS.has(group)) throw new TypeError('Unknown satellite group');
      signal?.throwIfAborted();
      try {
        const response = await fetchImpl(`/api/celestrak/${group}`, { signal });
        if (response.ok) {
          const text = await response.text();
          signal?.throwIfAborted();
          return { ok: true, status: response.status, text };
        }
      } catch {}

      // Direct fallback to CelesTrak HTTPS API for static hosting (GitHub Pages / Vercel)
      try {
        const fallbackUrl = CELESTRAK_DIRECT_URLS[group] || `https://celestrak.org/NORAD/elements/gp.php?GROUP=${group}&FORMAT=tle`;
        const directRes = await fetchImpl(fallbackUrl, { signal });
        if (directRes.ok) {
          const text = await directRes.text();
          signal?.throwIfAborted();
          return { ok: true, status: directRes.status, text };
        }
      } catch {}

      return { ok: false, status: 404, text: '' };
    },
  };
}
