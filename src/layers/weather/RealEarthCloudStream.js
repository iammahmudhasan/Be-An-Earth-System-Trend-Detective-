/**
 * @file RealEarthCloudStream.js
 * @module layers/weather/RealEarthCloudStream
 * @description Real-Time Global Earth Cloud Streaming via NASA GIBS WMTS (MODIS Terra/Aqua & VIIRS True Color).
 *
 * Provides photorealistic real-time global cloud imagery overlaid directly on the 3D Cesium globe.
 * Features:
 * - Full multi-satellite support (MODIS Terra 250m, MODIS Aqua 250m, VIIRS Suomi NPP 375m, VIIRS NOAA-20 375m).
 * - Automatic UTC date probing (today vs yesterday) to ensure zero 404s during early day passes.
 * - Dynamic tile fallback: automatically recovers missing today swaths from yesterday's imagery.
 * - Non-disruptive 1x1 transparent fallback ensuring zero broken globe textures.
 * - Proper WebMercatorTilingScheme alignment with GoogleMapsCompatible_Level9 WMTS grid.
 * - 1-Click toggle capability with Cesium scene request rendering.
 */

import * as Cesium from 'cesium';

export const SATELLITE_CONFIGS = Object.freeze({
  terra: {
    id: 'terra',
    name: 'MODIS Terra True Color',
    layer: 'MODIS_Terra_CorrectedReflectance_TrueColor',
    matrixSet: 'GoogleMapsCompatible_Level9',
    maxLevel: 9,
    format: 'image/jpeg',
    resolution: '250m',
    orbitTime: '10:30 AM local solar (Morning)',
  },
  aqua: {
    id: 'aqua',
    name: 'MODIS Aqua True Color',
    layer: 'MODIS_Aqua_CorrectedReflectance_TrueColor',
    matrixSet: 'GoogleMapsCompatible_Level9',
    maxLevel: 9,
    format: 'image/jpeg',
    resolution: '250m',
    orbitTime: '1:30 PM local solar (Afternoon)',
  },
  'viirs-snpp': {
    id: 'viirs-snpp',
    name: 'VIIRS Suomi NPP True Color',
    layer: 'VIIRS_SNPP_CorrectedReflectance_TrueColor',
    matrixSet: 'GoogleMapsCompatible_Level9',
    maxLevel: 9,
    format: 'image/jpeg',
    resolution: '375m',
    orbitTime: '1:30 PM local solar (Day)',
  },
  'viirs-noaa20': {
    id: 'viirs-noaa20',
    name: 'VIIRS NOAA-20 True Color',
    layer: 'VIIRS_NOAA20_CorrectedReflectance_TrueColor',
    matrixSet: 'GoogleMapsCompatible_Level9',
    maxLevel: 9,
    format: 'image/jpeg',
    resolution: '375m',
    orbitTime: '1:20 PM local solar (Day)',
  },
});

/** Return ISO date string (YYYY-MM-DD) for a given UTC day offset. */
export function getUtcIsoDate(offsetDays = 0) {
  const d = new Date(Date.now() - offsetDays * 86400000);
  return d.toISOString().slice(0, 10);
}

/** 1x1 transparent PNG data URI for zero-404 fallback tiles. */
const TRANSPARENT_1X1_PNG =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

let transparentImagePromise = null;
function getTransparentTile(cesium = Cesium) {
  if (!transparentImagePromise) {
    if (typeof cesium?.Resource?.fetchImage === 'function') {
      transparentImagePromise = cesium.Resource.fetchImage({
        url: TRANSPARENT_1X1_PNG,
      }).catch(() => null);
    } else if (typeof Image !== 'undefined') {
      transparentImagePromise = new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = TRANSPARENT_1X1_PNG;
      });
    } else {
      transparentImagePromise = Promise.resolve(null);
    }
  }
  return transparentImagePromise;
}

/** Check if NASA GIBS tiles are publishing for a specific layer and date via fast HEAD probe. */
export async function probeGibsTileAvailable(
  layer,
  date,
  matrixSet = 'GoogleMapsCompatible_Level9',
) {
  if (typeof fetch === 'undefined') return true;
  try {
    const probeUrl = `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/${layer}/default/${date}/${matrixSet}/1/0/0.jpg`;
    const res = await fetch(probeUrl, { method: 'HEAD', cache: 'no-cache' });
    return res.ok;
  } catch {
    return false;
  }
}

/** Helper to load a tile image across Cesium and browser fetch environments. */
async function loadFallbackImage(url, cesium) {
  if (typeof cesium?.Resource?.fetchImage === 'function') {
    return cesium.Resource.fetchImage({ url });
  }
  if (typeof fetch === 'function' && typeof createImageBitmap === 'function') {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const blob = await res.blob();
    return createImageBitmap(blob);
  }
  if (typeof Image !== 'undefined') {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
  }
  return null;
}

export class RealEarthCloudStream {
  constructor(viewer, options = {}) {
    this.viewer = viewer;
    this.cesium = options.cesium || Cesium;
    this.cloudLayer = null;
    this.provider = null;
    this.active = false;
    this.satelliteKey = options.satellite || 'terra';
    this.dateOffset = options.dateOffset ?? 'auto';
    this.alpha = options.alpha ?? 0.85;
    this.activeDate = getUtcIsoDate(1);
    this.fallbackDate = getUtcIsoDate(2);
    this._initialized = false;
    this._initPromise = null;
  }

  get config() {
    return SATELLITE_CONFIGS[this.satelliteKey] || SATELLITE_CONFIGS.terra;
  }

  /** Resolve the optimal date (today vs yesterday) based on availability. */
  async resolveOptimalDates() {
    if (typeof this.dateOffset === 'number') {
      this.activeDate = getUtcIsoDate(this.dateOffset);
      this.fallbackDate = getUtcIsoDate(this.dateOffset + 1);
      return;
    }

    if (this.dateOffset !== 'auto') {
      this.activeDate = String(this.dateOffset);
      this.fallbackDate = getUtcIsoDate(1);
      return;
    }

    // Auto mode: probe today's date first
    const today = getUtcIsoDate(0);
    const yesterday = getUtcIsoDate(1);
    const dayBefore = getUtcIsoDate(2);

    const isTodayReady = await probeGibsTileAvailable(
      this.config.layer,
      today,
      this.config.matrixSet,
    );

    if (isTodayReady) {
      this.activeDate = today;
      this.fallbackDate = yesterday;
    } else {
      this.activeDate = yesterday;
      this.fallbackDate = dayBefore;
    }
  }

  /** Create and mount the WMTS imagery provider. */
  _createImageryProvider() {
    const { layer, matrixSet, maxLevel, format } = this.config;
    const activeDate = this.activeDate;
    const fallbackDate = this.fallbackDate;
    const cesium = this.cesium;

    const wmtsUrl = `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/${layer}/default/{Time}/${matrixSet}/{TileMatrix}/{TileRow}/{TileCol}.jpg`;

    const provider = new cesium.WebMapTileServiceImageryProvider({
      url: wmtsUrl,
      layer,
      style: 'default',
      format,
      tileMatrixSetID: matrixSet,
      maximumLevel: maxLevel,
      tilingScheme: new cesium.WebMercatorTilingScheme(),
      times: new cesium.TimeIntervalCollection([
        new cesium.TimeInterval({
          start: cesium.JulianDate.fromIso8601('2000-01-01'),
          stop: cesium.JulianDate.fromIso8601('2099-12-31'),
          data: activeDate,
        }),
      ]),
      credit: new cesium.Credit(
        `NASA GIBS (${this.config.name}) · ${activeDate} UTC`,
      ),
    });

    // Wrap requestImage for automatic yesterday fallback and transparent 1x1 suppression of 404s
    const originalRequestImage = provider.requestImage.bind(provider);
    provider.requestImage = (x, y, level, request) => {
      const nativePromise = originalRequestImage(x, y, level, request);
      if (!nativePromise) return nativePromise;

      return Promise.resolve(nativePromise).catch(async () => {
        // Step 1 fallback: attempt the yesterday/fallback date tile
        try {
          const fallbackUrl = `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/${layer}/default/${fallbackDate}/${matrixSet}/${level}/${y}/${x}.jpg`;
          const fallbackImg = await loadFallbackImage(fallbackUrl, cesium);
          if (fallbackImg) return fallbackImg;
        } catch {
          // Fallback also failed or unavailable
        }

        // Step 2 fallback: return transparent 1x1 tile to guarantee 0 unhandled errors & 0 404 glitches
        return getTransparentTile(cesium);
      });
    };

    // Silence internal Cesium error alerts on missing tiles
    if (provider.errorEvent?.addEventListener) {
      provider.errorEvent.addEventListener((e) => {
        if (e) e.retry = false;
      });
    }

    return provider;
  }

  /** Toggle real clouds overlay on/off. */
  toggle() {
    if (this.active) {
      this.hide();
    } else {
      this.show();
    }
    return this.active;
  }

  /** Display the real cloud imagery layer. */
  async show() {
    if (this.cloudLayer) {
      this.cloudLayer.show = true;
      this.active = true;
      this.viewer?.scene?.requestRender();
      return true;
    }

    try {
      if (!this._initialized) {
        if (!this._initPromise) {
          this._initPromise = this.resolveOptimalDates();
        }
        await this._initPromise;
        this._initialized = true;
      }

      this.provider = this._createImageryProvider();
      this.cloudLayer = this.viewer.imageryLayers.addImageryProvider(
        this.provider,
      );
      this.cloudLayer.alpha = this.alpha;
      this.cloudLayer.show = true;
      this.active = true;
      this.viewer?.scene?.requestRender();

      console.info(
        `[Clouds] NASA GIBS Real Earth Clouds online: ${this.config.name} (${this.activeDate} UTC)`,
      );
      return true;
    } catch (err) {
      console.warn(
        '[Clouds] GIBS imagery provider initialization fallback:',
        err,
      );
      return false;
    }
  }

  /** Hide the real cloud imagery layer. */
  hide() {
    if (this.cloudLayer) {
      this.cloudLayer.show = false;
      this.active = false;
      this.viewer?.scene?.requestRender();
    }
  }

  /** Change active satellite platform dynamically ('terra' | 'aqua' | 'viirs-snpp' | 'viirs-noaa20'). */
  async setSatellite(satelliteKey) {
    if (!SATELLITE_CONFIGS[satelliteKey]) {
      console.warn(`[Clouds] Unknown satellite: ${satelliteKey}`);
      return false;
    }
    this.satelliteKey = satelliteKey;
    this._rebuildLayerIfActive();
    return true;
  }

  /** Set day offset (0 for today, 1 for yesterday, or 'auto'). */
  async setDateOffset(offset) {
    this.dateOffset = offset;
    this._initialized = false;
    this._initPromise = null;
    await this.resolveOptimalDates();
    this._rebuildLayerIfActive();
  }

  /** Set an explicit ISO date string (YYYY-MM-DD). */
  setDate(isoDateStr) {
    this.dateOffset = isoDateStr;
    this.activeDate = isoDateStr;
    this.fallbackDate = getUtcIsoDate(1);
    this._rebuildLayerIfActive();
  }

  /** Adjust layer opacity. */
  setAlpha(alpha) {
    this.alpha = Math.max(0, Math.min(1, Number(alpha) || 0.85));
    if (this.cloudLayer) {
      this.cloudLayer.alpha = this.alpha;
      this.viewer?.scene?.requestRender();
    }
  }

  /** Internal helper to refresh active layer upon configuration change. */
  _rebuildLayerIfActive() {
    if (!this.cloudLayer || !this.active) return;
    try {
      this.viewer.imageryLayers.remove(this.cloudLayer, true);
    } catch {
      // Ignore removal failure
    }
    this.cloudLayer = null;
    this.provider = null;
    void this.show();
  }

  /** Get live status and telemetry diagnostics. */
  getDiagnostics() {
    return {
      active: this.active,
      satellite: this.satelliteKey,
      satelliteName: this.config.name,
      layer: this.config.layer,
      activeDate: this.activeDate,
      fallbackDate: this.fallbackDate,
      alpha: this.alpha,
      resolution: this.config.resolution,
      orbitTime: this.config.orbitTime,
      hasLayer: Boolean(this.cloudLayer),
    };
  }

  /** Cleanup all resources. */
  destroy() {
    this.hide();
    if (this.cloudLayer && this.viewer?.imageryLayers) {
      try {
        this.viewer.imageryLayers.remove(this.cloudLayer, true);
      } catch {
        // Ignore removal failure
      }
    }
    this.cloudLayer = null;
    this.provider = null;
    this.viewer = null;
    this._initialized = false;
  }
}
