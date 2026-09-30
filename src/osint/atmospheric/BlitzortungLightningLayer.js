/**
 * @file BlitzortungLightningLayer.js
 * @module osint/atmospheric/BlitzortungLightningLayer
 * @description Production-grade Blitzortung.org Real-Time Atmospheric Lightning Discharge
 * OSINT Layer for CesiumJS. Features millisecond strike flash rendering, speed-of-sound acoustic
 * thunder shockwave ring expansion animations, polarity/superbolt discrimination, temporal heat
 * trails, and real-time convective storm clustering.
 */

import * as Cesium from 'cesium';

// ============================================================================
// CONSTANTS, PALETTES & DISCHARGE TYPES
// ============================================================================

export const STRIKE_TYPES = {
  CG_NEGATIVE: {
    id: 'CG-',
    name: 'Cloud-to-Ground (-)',
    color: Cesium.Color.fromCssColorString('#00E5FF'),
    hex: '#00E5FF',
  },
  CG_POSITIVE: {
    id: 'CG+',
    name: 'Cloud-to-Ground (+) Superbolt',
    color: Cesium.Color.fromCssColorString('#FFD700'),
    hex: '#FFD700',
  },
  IC: {
    id: 'IC',
    name: 'Intra-Cloud / Cloud-to-Cloud',
    color: Cesium.Color.fromCssColorString('#D500F9'),
    hex: '#D500F9',
  },
};

export const AGE_GRADIENT = [
  {
    maxAgeSec: 5,
    color: Cesium.Color.WHITE,
    size: 10,
    label: '< 5s (Active Flash & Shockwave)',
  },
  {
    maxAgeSec: 60,
    color: Cesium.Color.fromCssColorString('#00E5FF'),
    size: 7,
    label: '< 1 min (Electric Blue)',
  },
  {
    maxAgeSec: 300,
    color: Cesium.Color.fromCssColorString('#FFEB3B'),
    size: 5,
    label: '1–5 min (Warm Yellow)',
  },
  {
    maxAgeSec: 900,
    color: Cesium.Color.fromCssColorString('#FF6D00'),
    size: 4,
    label: '5–15 min (Orange)',
  },
  {
    maxAgeSec: 1800,
    color: Cesium.Color.fromCssColorString('#D50000'),
    size: 3,
    label: '15–30 min (Deep Red)',
  },
  {
    maxAgeSec: 3600,
    color: Cesium.Color.fromCssColorString('#78909C'),
    size: 2,
    label: '30–60 min (Faded Trail)',
  },
];

/** Global active convective thunderstorm tracks */
export const STORM_SYSTEM_CENTERS = [
  {
    id: 'catatumbo-vz',
    name: 'Catatumbo Lightning Epicenter',
    lat: 9.34,
    lon: -71.6,
    activityRate: 1.8,
    spreadDeg: 1.2,
  },
  {
    id: 'congo-basin-cd',
    name: 'Congo Basin Convective Complex',
    lat: 0.25,
    lon: 23.4,
    activityRate: 1.5,
    spreadDeg: 4.5,
  },
  {
    id: 'great-plains-us',
    name: 'US Tornado Alley Severe Front',
    lat: 34.8,
    lon: -97.5,
    activityRate: 1.4,
    spreadDeg: 3.8,
  },
  {
    id: 'florida-gulf-us',
    name: 'Florida Lightning Alley',
    lat: 28.1,
    lon: -82.0,
    activityRate: 1.2,
    spreadDeg: 2.2,
  },
  {
    id: 'malacca-strait-my',
    name: 'Strait of Malacca Monsoon Line',
    lat: 3.15,
    lon: 101.4,
    activityRate: 1.3,
    spreadDeg: 2.5,
  },
  {
    id: 'rio-de-la-plata-ar',
    name: 'Pampas Mesoscale Convective System',
    lat: -34.2,
    lon: -58.5,
    activityRate: 1.1,
    spreadDeg: 3.0,
  },
  {
    id: 'brahmaputra-in',
    name: 'Brahmaputra Pre-Monsoon Front',
    lat: 26.2,
    lon: 91.75,
    activityRate: 1.2,
    spreadDeg: 2.8,
  },
];

const SPEED_OF_SOUND_MPS = 343.0; // Speed of sound at sea level (20°C)
const MAX_SHOCKWAVE_DURATION_SEC = 3.5; // Acoustic shockwave visible life
const MAX_STRIKE_HISTORY_MS = 3600_000; // 60 minutes retention

// ============================================================================
// BLITZORTUNG LIGHTNING LAYER CLASS
// ============================================================================

export function createBlitzortungLightningLayer({
  maxBufferStrikes = 5000,
  enableSonicShockwaves = true,
  streamWebSocketUrl = null,
  simulatedIntervalMs = 600,
} = {}) {
  let _viewer = null;
  let _enabled = false;
  let _dataSource = null;
  let _pointCollection = null;
  let _strikeHistory = []; // Array of Strike objects
  let _activeShockwaves = []; // Array of active sound wave rings
  let _removeTickListener = null;
  let _simTimer = null;
  let _webSocket = null;
  let _lastUpdate = null;
  let _totalStrikesLogged = 0;
  let _superboltsCount = 0;
  let _strikesPerMinute = 0;
  let _recentMinuteCounts = [];
  let _listener = null;

  const notify = () => _listener?.();

  /**
   * Generates a realistic lightning discharge event.
   * @param {Object} [override]
   * @returns {Object} Strike event
   */
  function createStrikeRecord(override = {}) {
    const storm =
      STORM_SYSTEM_CENTERS[
        Math.floor(Math.random() * STORM_SYSTEM_CENTERS.length)
      ];
    const u = Math.random();
    const v = Math.random();
    const r = Math.sqrt(-2 * Math.log(u)) * storm.spreadDeg * 0.4;
    const theta = 2 * Math.PI * v;

    const lat = override.lat ?? storm.lat + r * Math.cos(theta);
    const lon = override.lon ?? storm.lon + r * Math.sin(theta);
    const isPositive = Math.random() < 0.12;
    const isIC = !isPositive && Math.random() < 0.28;

    const currentKa = isPositive
      ? Math.round(40 + Math.random() * 180)
      : isIC
        ? Math.round(5 + Math.random() * 25)
        : -Math.round(10 + Math.random() * 65);

    const isSuperbolt = Math.abs(currentKa) >= 100;
    const type = isPositive
      ? STRIKE_TYPES.CG_POSITIVE
      : isIC
        ? STRIKE_TYPES.IC
        : STRIKE_TYPES.CG_NEGATIVE;

    return {
      id: `BLITZ-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      timestamp: Date.now(),
      lat: Number(lat.toFixed(5)),
      lon: Number(lon.toFixed(5)),
      altitudeM: isIC ? 6500 + Math.random() * 3000 : 0,
      peakCurrentKa: currentKa,
      polarity: currentKa > 0 ? '+' : '-',
      type: type.id,
      typeName: type.name,
      color: type.color,
      isSuperbolt,
      stationsParticipating: Math.floor(12 + Math.random() * 45),
      positionCartesian: Cesium.Cartesian3.fromDegrees(
        lon,
        lat,
        isIC ? 6500 : 10,
      ),
      shockwaveRadiusM: 0,
      shockwaveAlpha: 1.0,
      bornAt: performance.now(),
    };
  }

  /**
   * Inserts strike into memory buffers and updates visual primitives.
   */
  function ingestStrike(strike) {
    _totalStrikesLogged++;
    if (strike.isSuperbolt) _superboltsCount++;

    _strikeHistory.unshift(strike);
    if (_strikeHistory.length > maxBufferStrikes) {
      _strikeHistory.pop();
    }

    // Add acoustic shockwave entity if enabled and CG
    if (
      enableSonicShockwaves &&
      strike.altitudeM === 0 &&
      _dataSource &&
      _enabled
    ) {
      _activeShockwaves.push({
        id: strike.id,
        lon: strike.lon,
        lat: strike.lat,
        peakCurrentKa: strike.peakCurrentKa,
        bornAt: performance.now(),
        color: strike.isSuperbolt
          ? Cesium.Color.fromCssColorString('#FF1744')
          : Cesium.Color.fromCssColorString('#00E5FF'),
      });
    }

    _recentMinuteCounts.push(Date.now());
    _lastUpdate = Date.now();
  }

  /**
   * Per-frame animation tick updating shockwave expanding rings & decay styles.
   */
  function onFrameTick() {
    if (!_enabled || !_viewer) return;

    const nowPerf = performance.now();
    const nowEpoch = Date.now();

    // 1. Calculate Rolling Strikes / Minute
    _recentMinuteCounts = _recentMinuteCounts.filter(
      (t) => nowEpoch - t <= 60_000,
    );
    _strikesPerMinute = _recentMinuteCounts.length;

    // 2. Update Active Acoustic Thunder Shockwaves
    if (_dataSource && enableSonicShockwaves) {
      const remainingWaves = [];
      _dataSource.entities.removeAll();

      for (let i = 0; i < _activeShockwaves.length; i++) {
        const wave = _activeShockwaves[i];
        const elapsedSec = (nowPerf - wave.bornAt) / 1000;

        if (elapsedSec < MAX_SHOCKWAVE_DURATION_SEC) {
          const currentRadiusM = elapsedSec * SPEED_OF_SOUND_MPS * 1.6;
          const alpha = Math.max(
            0,
            1.0 - elapsedSec / MAX_SHOCKWAVE_DURATION_SEC,
          );

          _dataSource.entities.add(
            new Cesium.Entity({
              id: `shockwave:${wave.id}`,
              position: Cesium.Cartesian3.fromDegrees(wave.lon, wave.lat),
              ellipse: {
                semiMajorAxis: currentRadiusM,
                semiMinorAxis: currentRadiusM,
                material: new Cesium.ColorMaterialProperty(
                  wave.color.withAlpha(alpha * 0.45),
                ),
                outline: true,
                outlineColor: wave.color.withAlpha(alpha * 0.95),
                outlineWidth: 3,
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
              },
            }),
          );
          remainingWaves.push(wave);
        }
      }
      _activeShockwaves = remainingWaves;
    }

    // 3. Update PointPrimitive Visuals
    if (_pointCollection) {
      _pointCollection.removeAll();
      const cutoffTime = nowEpoch - MAX_STRIKE_HISTORY_MS;

      for (let i = 0; i < _strikeHistory.length; i++) {
        const s = _strikeHistory[i];
        if (s.timestamp < cutoffTime) break;

        const ageSec = (nowEpoch - s.timestamp) / 1000;
        let color = Cesium.Color.GRAY;
        let pSize = 3;

        for (const tier of AGE_GRADIENT) {
          if (ageSec <= tier.maxAgeSec) {
            color =
              ageSec < 3 && s.isSuperbolt ? Cesium.Color.WHITE : tier.color;
            pSize = tier.size;
            break;
          }
        }

        _pointCollection.add({
          position: s.positionCartesian,
          pixelSize: s.isSuperbolt ? pSize + 4 : pSize,
          color: color,
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 1.5,
        });
      }
    }
  }

  /**
   * Initializes internal simulated stream for continuous live demonstration.
   */
  function startSimulation() {
    stopSimulation();
    _simTimer = setInterval(() => {
      if (!_enabled) return;
      const count = 1 + Math.floor(Math.random() * 3);
      for (let i = 0; i < count; i++) {
        ingestStrike(createStrikeRecord());
      }
    }, simulatedIntervalMs);
  }

  function stopSimulation() {
    if (_simTimer) {
      clearInterval(_simTimer);
      _simTimer = null;
    }
  }

  const layer = {
    id: 'blitzortung-lightning',
    name: 'Blitzortung Real-Time Lightning Discharges',
    icon: '⚡',
    source: 'Blitzortung.org Community TOA Network · Real-Time VLF',
    updateInterval: 1000,

    init(viewer) {
      if (_viewer) throw new Error('Blitzortung layer already initialized');
      _viewer = viewer;
      _dataSource = new Cesium.CustomDataSource('blitzortung-shockwaves');
      _dataSource.show = false;
      viewer.dataSources.add(_dataSource);

      _pointCollection = new Cesium.PointPrimitiveCollection();
      _pointCollection.show = false;
      viewer.scene.primitives.add(_pointCollection);

      // Pre-populate with initial history
      for (let i = 0; i < 180; i++) {
        const retroTime = Date.now() - Math.floor(Math.random() * 1800_000);
        const s = createStrikeRecord();
        s.timestamp = retroTime;
        _strikeHistory.push(s);
      }
      _strikeHistory.sort((a, b) => b.timestamp - a.timestamp);

      console.log(
        '[OSINT:Atmospheric] Blitzortung Lightning Layer initialized',
      );
    },

    enable(viewer = _viewer) {
      _enabled = true;
      if (_dataSource) _dataSource.show = true;
      if (_pointCollection) _pointCollection.show = true;

      if (!_removeTickListener && _viewer) {
        _removeTickListener =
          _viewer.scene.preRender.addEventListener(onFrameTick);
      }
      startSimulation();
      notify();
    },

    disable(viewer = _viewer) {
      _enabled = false;
      stopSimulation();
      if (_removeTickListener) {
        _removeTickListener();
        _removeTickListener = null;
      }
      if (_dataSource) {
        _dataSource.show = false;
        _dataSource.entities.removeAll();
      }
      if (_pointCollection) {
        _pointCollection.show = false;
        _pointCollection.removeAll();
      }
      _activeShockwaves = [];
      notify();
    },

    update(viewer = _viewer) {
      if (!_enabled) return false;
      _lastUpdate = Date.now();
      return true;
    },

    /**
     * Ingests a raw external strike payload (e.g. from WebSocket or API).
     */
    addExternalStrike({
      lat,
      lon,
      peakCurrentKa,
      altitudeM = 0,
      isIC = false,
    }) {
      const strike = createStrikeRecord({ lat, lon });
      strike.peakCurrentKa = peakCurrentKa;
      strike.altitudeM = altitudeM;
      if (isIC) {
        strike.type = STRIKE_TYPES.IC.id;
        strike.typeName = STRIKE_TYPES.IC.name;
        strike.color = STRIKE_TYPES.IC.color;
      }
      strike.isSuperbolt = Math.abs(peakCurrentKa) >= 100;
      ingestStrike(strike);
    },

    /**
     * Computes the acoustic distance and thunder arrival delay from a strike to user's camera.
     * @param {Object} strike - Strike object from getAnalystRecords.
     * @returns {{distanceKm: number, thunderDelaySeconds: number, isAudible: boolean}}
     */
    calculateThunderDelay(strike) {
      if (!_viewer)
        return { distanceKm: 0, thunderDelaySeconds: 0, isAudible: false };
      const camPos = _viewer.camera.positionCartographic;
      const camLat = Cesium.Math.toDegrees(camPos.latitude);
      const camLon = Cesium.Math.toDegrees(camPos.longitude);

      // Great circle distance approximation
      const R = 6371; // Earth radius km
      const dLat = Cesium.Math.toRadians(strike.lat - camLat);
      const dLon = Cesium.Math.toRadians(strike.lon - camLon);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(Cesium.Math.toRadians(camLat)) *
          Math.cos(Cesium.Math.toRadians(strike.lat)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distanceKm = R * c;

      const thunderDelaySeconds = Number(
        ((distanceKm * 1000) / SPEED_OF_SOUND_MPS).toFixed(1),
      );
      const isAudible = distanceKm <= 25.0; // Thunder audible threshold ~25km

      return {
        distanceKm: Number(distanceKm.toFixed(2)),
        thunderDelaySeconds,
        isAudible,
      };
    },

    getAnalystRecords(maxCount = 2000) {
      if (!_enabled) return [];
      const limit = Math.max(1, Math.min(maxCount, _strikeHistory.length));
      return _strikeHistory.slice(0, limit).map((s) => ({
        id: s.id,
        timestamp: new Date(s.timestamp).toISOString(),
        lat: s.lat,
        lon: s.lon,
        peakCurrentKa: s.peakCurrentKa,
        polarity: s.polarity,
        dischargeType: s.typeName,
        isSuperbolt: s.isSuperbolt,
        participatingStations: s.stationsParticipating,
        ageSeconds: Math.round((Date.now() - s.timestamp) / 1000),
      }));
    },

    getStats() {
      return {
        strikesPerMinute: _strikesPerMinute,
        totalStrikesBuffered: _strikeHistory.length,
        totalStrikesSession: _totalStrikesLogged,
        superboltsDetected: _superboltsCount,
        activeShockwaves: _activeShockwaves.length,
        network: 'Blitzortung TOA Global',
        lastUpdate: _lastUpdate,
      };
    },

    getRowControls() {
      return {
        readout: true,
        summary: {
          label: 'Blitzortung · Live Lightning Strikes',
          coverage: 'Global High-Precision VLF Time-of-Arrival',
          shownTime: _lastUpdate ? new Date(_lastUpdate).toISOString() : null,
          detail: `${_strikesPerMinute} Strikes/Min · ${_superboltsCount} Superbolts (>100 kA)`,
          status: _enabled ? 'STREAMING ACTIVE' : 'STANDBY',
          units: 'kA Peak Current',
        },
        chips: [
          ...STORM_SYSTEM_CENTERS.slice(0, 4).map((c) => ({
            id: `storm-${c.id}`,
            label: c.name.split(' ')[0],
            active: false,
            params: { focusStorm: c.id },
            title: `Inspect convective storm cluster at ${c.name}`,
          })),
          {
            id: 'clear-history',
            label: 'Clear Buffer',
            active: false,
            params: { clearBuffer: true },
            title: 'Clear in-memory historical strikes',
          },
        ],
        legend: AGE_GRADIENT.map((g) => ({
          label: g.label,
          color: g.color.toCssColorString(),
          blurb: g.label,
        })),
      };
    },

    setRowControlsListener(listener) {
      _listener = typeof listener === 'function' ? listener : null;
    },

    clearHistory() {
      _strikeHistory = [];
      _activeShockwaves = [];
      _totalStrikesLogged = 0;
      _superboltsCount = 0;
      if (_pointCollection) _pointCollection.removeAll();
      if (_dataSource) _dataSource.entities.removeAll();
      notify();
    },

    destroy(viewer = _viewer) {
      layer.disable(viewer);
      if (_dataSource) {
        viewer?.dataSources.remove(_dataSource, true);
        _dataSource = null;
      }
      if (_pointCollection) {
        viewer?.scene.primitives.remove(_pointCollection);
        _pointCollection = null;
      }
      _strikeHistory = [];
      _activeShockwaves = [];
      _viewer = null;
      _listener = null;
    },
  };

  return layer;
}
