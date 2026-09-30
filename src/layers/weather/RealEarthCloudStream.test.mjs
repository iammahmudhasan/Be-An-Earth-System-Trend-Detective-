import test from 'node:test';
import assert from 'node:assert/strict';
import {
  RealEarthCloudStream,
  SATELLITE_CONFIGS,
  getUtcIsoDate,
  probeGibsTileAvailable,
} from './RealEarthCloudStream.js';

class MockCesiumProvider {
  constructor(options) {
    this.options = options;
    this.url = options.url;
    this.layer = options.layer;
    this.tileMatrixSetID = options.tileMatrixSetID;
    this.maximumLevel = options.maximumLevel;
    this.tilingScheme = options.tilingScheme;
    this.errorEvent = {
      addEventListener: (cb) => {
        this.onError = cb;
      },
    };
  }

  requestImage(x, y, level, request) {
    if (this._failTile) {
      return Promise.reject(new Error('Tile 404 Not Found'));
    }
    return Promise.resolve({ width: 256, height: 256 });
  }
}

function createMockViewer() {
  const layers = [];
  return {
    scene: {
      requestRenderCount: 0,
      requestRender() {
        this.requestRenderCount++;
      },
    },
    imageryLayers: {
      layers,
      addImageryProvider(provider) {
        const layer = {
          provider,
          show: true,
          alpha: 1.0,
        };
        layers.push(layer);
        return layer;
      },
      remove(layer) {
        const idx = layers.indexOf(layer);
        if (idx !== -1) layers.splice(idx, 1);
        return true;
      },
    },
  };
}

const mockCesium = {
  WebMapTileServiceImageryProvider: MockCesiumProvider,
  WebMercatorTilingScheme: class MockMercator {},
  TimeIntervalCollection: class MockIntervalCollection {
    constructor(intervals) {
      this.intervals = intervals;
    }
  },
  TimeInterval: class MockInterval {
    constructor(opts) {
      this.opts = opts;
    }
  },
  JulianDate: {
    fromIso8601(str) {
      return str;
    },
  },
  Credit: class MockCredit {
    constructor(html) {
      this.html = html;
    }
  },
  Resource: {
    fetchImage({ url }) {
      return Promise.resolve({ width: 256, height: 256, url });
    },
  },
};

test('SATELLITE_CONFIGS contains all specified platforms', () => {
  assert.ok(SATELLITE_CONFIGS.terra, 'MODIS Terra configuration exists');
  assert.equal(
    SATELLITE_CONFIGS.terra.layer,
    'MODIS_Terra_CorrectedReflectance_TrueColor',
  );
  assert.equal(
    SATELLITE_CONFIGS.terra.matrixSet,
    'GoogleMapsCompatible_Level9',
  );

  assert.ok(SATELLITE_CONFIGS.aqua, 'MODIS Aqua configuration exists');
  assert.equal(
    SATELLITE_CONFIGS.aqua.layer,
    'MODIS_Aqua_CorrectedReflectance_TrueColor',
  );

  assert.ok(SATELLITE_CONFIGS['viirs-snpp'], 'VIIRS SNPP exists');
  assert.equal(
    SATELLITE_CONFIGS['viirs-snpp'].layer,
    'VIIRS_SNPP_CorrectedReflectance_TrueColor',
  );

  assert.ok(SATELLITE_CONFIGS['viirs-noaa20'], 'VIIRS NOAA-20 exists');
  assert.equal(
    SATELLITE_CONFIGS['viirs-noaa20'].layer,
    'VIIRS_NOAA20_CorrectedReflectance_TrueColor',
  );
});

test('getUtcIsoDate returns standard ISO YYYY-MM-DD date strings', () => {
  const today = getUtcIsoDate(0);
  const yesterday = getUtcIsoDate(1);
  const dayBefore = getUtcIsoDate(2);

  assert.match(today, /^\d{4}-\d{2}-\d{2}$/);
  assert.match(yesterday, /^\d{4}-\d{2}-\d{2}$/);
  assert.match(dayBefore, /^\d{4}-\d{2}-\d{2}$/);
  assert.notEqual(today, yesterday);
});

test('RealEarthCloudStream constructor sets default parameters', () => {
  const viewer = createMockViewer();
  const stream = new RealEarthCloudStream(viewer, { cesium: mockCesium });

  assert.equal(stream.active, false);
  assert.equal(stream.satelliteKey, 'terra');
  assert.equal(stream.alpha, 0.85);
  assert.equal(stream.dateOffset, 'auto');
  assert.equal(stream.cloudLayer, null);

  const diag = stream.getDiagnostics();
  assert.equal(diag.active, false);
  assert.equal(diag.satellite, 'terra');
  assert.equal(diag.layer, 'MODIS_Terra_CorrectedReflectance_TrueColor');
});

test('RealEarthCloudStream show() and toggle() activate layer and request scene render', async () => {
  const viewer = createMockViewer();
  const stream = new RealEarthCloudStream(viewer, {
    cesium: mockCesium,
    dateOffset: 1, // explicit yesterday offset
  });

  const ok = await stream.show();
  assert.equal(ok, true);
  assert.equal(stream.active, true);
  assert.ok(stream.cloudLayer);
  assert.equal(stream.cloudLayer.show, true);
  assert.equal(stream.cloudLayer.alpha, 0.85);
  assert.ok(viewer.scene.requestRenderCount > 0);

  // Toggle off
  const activeAfterToggle = stream.toggle();
  assert.equal(activeAfterToggle, false);
  assert.equal(stream.cloudLayer.show, false);

  // Toggle back on
  const activeBackOn = stream.toggle();
  assert.equal(activeBackOn, true);
  assert.equal(stream.cloudLayer.show, true);
});

test('RealEarthCloudStream setSatellite() switches platform dynamically', async () => {
  const viewer = createMockViewer();
  const stream = new RealEarthCloudStream(viewer, {
    cesium: mockCesium,
    dateOffset: 1,
  });

  await stream.show();
  assert.equal(stream.satelliteKey, 'terra');

  await stream.setSatellite('viirs-noaa20');
  assert.equal(stream.satelliteKey, 'viirs-noaa20');
  assert.equal(
    stream.config.layer,
    'VIIRS_NOAA20_CorrectedReflectance_TrueColor',
  );
  assert.equal(
    stream.cloudLayer.provider.layer,
    'VIIRS_NOAA20_CorrectedReflectance_TrueColor',
  );

  await stream.setSatellite('aqua');
  assert.equal(stream.satelliteKey, 'aqua');
  assert.equal(
    stream.config.layer,
    'MODIS_Aqua_CorrectedReflectance_TrueColor',
  );
});

test('RealEarthCloudStream tile request catches failure and executes yesterday fallback', async () => {
  const viewer = createMockViewer();
  const stream = new RealEarthCloudStream(viewer, {
    cesium: mockCesium,
    dateOffset: 0,
  });

  await stream.show();
  const provider = stream.provider;
  assert.ok(provider);

  // Simulate primary tile rejection (e.g. today's swath is 404)
  provider._failTile = true;

  const fallbackResult = await provider.requestImage(1, 1, 2);
  assert.ok(
    fallbackResult,
    'Fallback returned a valid tile image or transparent substitute',
  );
  assert.ok(fallbackResult.width > 0, 'Image has width');
});

test('probeGibsTileAvailable probes live GIBS tile endpoint', async () => {
  const isAvailable = await probeGibsTileAvailable(
    'MODIS_Terra_CorrectedReflectance_TrueColor',
    getUtcIsoDate(1),
  );
  assert.equal(typeof isAvailable, 'boolean');
});

test('RealEarthCloudStream destroy() cleans up layer from viewer', async () => {
  const viewer = createMockViewer();
  const stream = new RealEarthCloudStream(viewer, {
    cesium: mockCesium,
    dateOffset: 1,
  });

  await stream.show();
  assert.equal(viewer.imageryLayers.layers.length, 1);

  stream.destroy();
  assert.equal(viewer.imageryLayers.layers.length, 0);
  assert.equal(stream.cloudLayer, null);
  assert.equal(stream.active, false);
});
