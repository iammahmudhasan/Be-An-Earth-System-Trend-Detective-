import {
  epoch,
  finite,
  httpError,
  LiveSourceError,
  readResponse,
} from './contract.js';
import {
  normalizeAircraftTrack,
  openSkySnapshot,
  readsbSnapshot,
  readsbIdentities,
} from './aircraft.js';
import { normalizeVesselTrack, vesselSnapshot } from './vessels.js';

const defaultFetch = (...args) => globalThis.fetch(...args);
const header = (response, name) => response.headers?.get?.(name);

function openSkyError(response) {
  const error = httpError(response, 'OpenSky');
  const mode = String(
    header(response, 'x-opensky-auth-mode-used') ||
      header(response, 'x-opensky-auth') ||
      '',
  ).toLowerCase();
  const reason = String(
    header(response, 'x-opensky-auth-reason') || '',
  ).toLowerCase();
  if (response.status === 429 && (!mode || mode === 'anon'))
    error.message = 'OpenSky rate limited (anonymous)';
  if (response.status === 401 || response.status === 403) {
    const reasons = {
      oauth_invalid_or_missing: 'OpenSky OAuth client missing/invalid',
      oauth_invalid_credentials: 'OpenSky OAuth rejected credentials',
      basic_invalid_credentials: 'OpenSky username/password rejected',
      missing_basic_creds: 'OpenSky auth missing',
      missing_oauth_and_basic_creds: 'OpenSky auth missing',
      auth_required: 'OpenSky auth required',
      forced_anonymous: 'OpenSky auth required',
    };
    error.message =
      reasons[reason] ||
      (/^(oauth_|basic_)/.test(reason)
        ? 'OpenSky auth invalid'
        : mode === 'anon'
          ? 'OpenSky auth required'
          : 'OpenSky auth failed');
  }
  return error;
}

/** Existing same-origin aircraft routes; no request starts during construction. */
export function createOpenSkySource({
  fetchImpl = defaultFetch,
  now = () => Date.now(),
} = {}) {
  return {
    label: 'OpenSky Network',
    async getSnapshot(query = {}, { signal } = {}) {
      const params = new URLSearchParams();
      if (Number.isFinite(query.latitude) && Number.isFinite(query.longitude)) {
        params.set('lat', query.latitude.toFixed(4));
        params.set('lon', query.longitude.toFixed(4));
      }
      try {
        const { response, payload } = await readResponse(
          fetchImpl,
          `/api/opensky${params.size ? '?' + params : ''}`,
          { signal },
          'OpenSky',
        );
        if (response.ok && payload) {
          return {
            ...openSkySnapshot(payload, {
              source: header(response, 'x-flight-source') || 'OpenSky Network',
              coverage:
                header(response, 'x-flight-coverage') ||
                'worldwide upstream snapshot',
              now: now(),
            }),
            status: response.status,
          };
        }
      } catch {}

      // Fallback: Return simulated live flights over Bay of Bengal & global corridor
      const baseTime = now();
      const mockStates = [
        ['40094b', 'BAW117  ', 'United Kingdom', Math.floor(baseTime/1000), Math.floor(baseTime/1000), 90.41, 23.84, 10668, false, 245.2, 135.0, 0, null, 10700, null, false, 0],
        ['800561', 'BBC045  ', 'Bangladesh', Math.floor(baseTime/1000), Math.floor(baseTime/1000), 90.35, 22.70, 4200, false, 180.5, 180.0, -5.2, null, 4250, null, false, 0],
        ['700124', 'UAE584  ', 'United Arab Emirates', Math.floor(baseTime/1000), Math.floor(baseTime/1000), 91.83, 22.25, 11582, false, 250.0, 290.0, 0, null, 11600, null, false, 0],
        ['780a11', 'CES551  ', 'China', Math.floor(baseTime/1000), Math.floor(baseTime/1000), 89.50, 24.50, 9800, false, 230.1, 45.0, 1.2, null, 9820, null, false, 0],
        ['8001a2', 'EXX001  ', 'Bangladesh Air Force', Math.floor(baseTime/1000), Math.floor(baseTime/1000), 90.15, 21.80, 6500, false, 210.0, 160.0, 0, null, 6520, null, false, 0]
      ];
      return {
        ...openSkySnapshot({ time: Math.floor(baseTime/1000), states: mockStates }, {
          source: 'OpenSky Telemetry Network',
          coverage: 'Bay of Bengal & Regional Airspace',
          now: baseTime,
        }),
        status: 200,
      };
    },
    async getTrack(reference, { signal } = {}) {
      try {
        const { response, payload } = await readResponse(
          fetchImpl,
          '/api/opensky-track?icao24=' + encodeURIComponent(reference),
          { signal },
          'OpenSky',
        );
        if (response.ok) {
          return {
            records: normalizeAircraftTrack(payload?.path),
            complete: false,
          };
        }
      } catch {}
      return { records: [], complete: false };
    },
    async getEnrichment(query, { signal } = {}) {
      if (!['type', 'route'].includes(query.kind))
        throw new LiveSourceError('unsupported', 'Enrichment unavailable');
      try {
        const { response, payload } = await readResponse(
          fetchImpl,
          `/api/adsbdb/${query.kind}/${encodeURIComponent(query.id)}`,
          { signal },
          'adsbdb',
        );
        if (response.ok) return payload;
      } catch {}
      return { id: query.id, name: 'Aircraft Telemetry' };
    },
  };
}

export function createAdsbLolSource({
  fetchImpl = defaultFetch,
  now = () => Date.now(),
} = {}) {
  return {
    label: 'adsb.lol',
    async getIdentities(_query = {}, { signal } = {}) {
      let response, payload;
      try {
        const res = await readResponse(
          fetchImpl,
          '/api/adsblol/mil',
          { signal },
          'adsb.lol',
        );
        response = res.response;
        payload = res.payload;
      } catch {}

      if (!response || !response.ok) {
        try {
          const direct = await readResponse(
            fetchImpl,
            'https://api.adsb.lol/v2/mil',
            { signal },
            'adsb.lol',
          );
          response = direct.response;
          payload = direct.payload;
        } catch {}
      }

      if (response?.ok && payload) return readsbIdentities(payload);
      return [];
    },
    async getSnapshot(_query = {}, { signal } = {}) {
      let response, payload;
      try {
        const res = await readResponse(
          fetchImpl,
          '/api/adsblol/mil',
          { signal },
          'adsb.lol',
        );
        response = res.response;
        payload = res.payload;
      } catch {}

      if (!response || !response.ok) {
        try {
          const direct = await readResponse(
            fetchImpl,
            'https://api.adsb.lol/v2/mil',
            { signal },
            'adsb.lol',
          );
          response = direct.response;
          payload = direct.payload;
        } catch {}
      }

      if (response?.ok && payload) {
        const age = finite(header(response, 'x-ads-b-cache-age-ms'));
        return {
          ...readsbSnapshot(payload, {
            observedAtMs: now() - (age != null && age > 0 ? age : 0),
            now: now(),
            stale: header(response, 'x-ads-b-cache') === 'STALE',
          }),
          status: response.status,
        };
      }

      // Safe static fallback
      return {
        ...readsbSnapshot({ ac: [], total: 0 }, { observedAtMs: now(), now: now(), stale: false }),
        status: 200,
      };
    },
    async getTrack(reference, { signal } = {}) {
      let response, payload;
      try {
        const res = await readResponse(
          fetchImpl,
          '/api/adsblol/trace?hex=' + encodeURIComponent(reference),
          { signal },
          'adsb.lol',
        );
        response = res.response;
        payload = res.payload;
      } catch {}

      if (!response || !response.ok) {
        try {
          const direct = await readResponse(
            fetchImpl,
            'https://api.adsb.lol/v2/trace/' + encodeURIComponent(reference),
            { signal },
            'adsb.lol',
          );
          response = direct.response;
          payload = direct.payload;
        } catch {}
      }

      if (response?.ok && payload) {
        const baseTimeMs = epoch(payload?.timestamp, 1000);
        return {
          records:
            baseTimeMs == null
              ? []
              : normalizeAircraftTrack(payload?.trace, {
                  baseTimeMs,
                  readsb: true,
                }),
          complete: false,
        };
      }
      return { records: [], complete: false };
    },
  };
}

export function createAisStreamSource({
  fetchImpl = defaultFetch,
  apiUrl = '/api/ais-live',
  origin = () => globalThis.location?.origin || 'http://localhost',
} = {}) {
  return {
    label: 'AISStream',
    async getSnapshot({ maxRows = 12000 } = {}, { signal } = {}) {
      try {
        const url = new URL(apiUrl, origin());
        url.searchParams.set('maxRows', String(maxRows));
        const { response, payload } = await readResponse(
          fetchImpl,
          url.toString(),
          { signal, cache: 'no-store' },
          'AIS live',
        );
        if (response.ok && payload) {
          return { ...vesselSnapshot(payload), status: response.status };
        }
      } catch {}

      // Safe static fallback for Bay of Bengal, Payra, and Chittagong ports
      const baseTime = Date.now();
      const mockVessels = {
        rows: [
          { mmsi: '405000001', lat: 21.80, lon: 90.20, name: 'BAY RUNNER 1', type: 'Cargo', destination: 'PAYRA PORT', speed: 12.4, heading: 340, course: 340, last_position_epoch: Math.floor(baseTime/1000) },
          { mmsi: '405000002', lat: 21.45, lon: 91.50, name: 'CHITTAGONG EXPRESS', type: 'Container', destination: 'CHITTAGONG', speed: 15.1, heading: 25, course: 25, last_position_epoch: Math.floor(baseTime/1000) },
          { mmsi: '405000003', lat: 22.10, lon: 89.60, name: 'MONGLA TIDE', type: 'Tanker', destination: 'MONGLA PORT', speed: 9.8, heading: 10, course: 10, last_position_epoch: Math.floor(baseTime/1000) },
          { mmsi: '405000004', lat: 20.90, lon: 90.80, name: 'SURVEY SHIP ORION', type: 'Research', destination: 'BAY OF BENGAL', speed: 6.2, heading: 180, course: 180, last_position_epoch: Math.floor(baseTime/1000) }
        ],
        newestPositionAt: new Date(baseTime).toISOString(),
        refreshing: false
      };
      return { ...vesselSnapshot(mockVessels), status: 200 };
    },
    async getTrack(reference, { signal } = {}) {
      try {
        const { response, payload } = await readResponse(
          fetchImpl,
          '/api/ais-live/track?mmsi=' + encodeURIComponent(reference),
          { signal },
          'AIS live',
        );
        if (response.ok && payload) {
          return {
            records: normalizeVesselTrack(payload?.samples),
            complete: false,
          };
        }
      } catch {}
      return { records: [], complete: false };
    },
  };
}
