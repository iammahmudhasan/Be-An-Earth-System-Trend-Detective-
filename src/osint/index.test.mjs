/**
 * @file index.test.mjs
 * @description Master OSINT Suite unit test verifying integration across all 6 domains.
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import {
  OSINTMasterRegistry,
  createOSINTSuite,
  OSINT_DOMAINS,
  TACTICAL_SECTORS,
  // Re-exports from all 6 domains
  DarkVesselDetector,
  GlobalFishingWatchLayer,
  BayOfBengalAISStream,
  Sentinel1FloodSAR,
  Sentinel2Multispectral,
  NASAFIRMSFireLayer,
  MilitaryHexTracker,
  SquawkEmergencyAlert,
  SatelliteConjunctionEngine,
  createSentinel5PTropomiLayer,
  createBlitzortungLightningLayer,
  SeaLevelRiseSimulator,
  GraceGroundwaterTracker,
  OrionAIIntelligenceConsole,
} from './index.js';

function createMockViewer() {
  const entities = [];
  const entityCollection = {
    add: (e) => {
      entities.push(e);
      return e;
    },
    remove: (e) => {
      const idx = entities.indexOf(e);
      if (idx >= 0) entities.splice(idx, 1);
      return true;
    },
    removeAll: () => {
      entities.length = 0;
    },
  };

  return {
    entities: entityCollection,
    scene: {
      primitives: {
        add: (p) => p,
        remove: () => true,
      },
      postProcessStages: {
        add: () => {},
        remove: () => {},
      },
    },
    dataSources: {
      add: (d) => Promise.resolve(d),
      remove: () => true,
    },
    camera: {
      flyTo: () => {},
      lookAt: () => {},
      lookAtTransform: () => {},
    },
    clock: {
      onTick: {
        addEventListener: () => () => {},
      },
    },
  };
}

test('All 6 OSINT domains and layers are registered and exported', () => {
  const domains = ['maritime', 'satellite', 'airspace', 'atmospheric', 'climate', 'ai_analyst'];
  for (const d of domains) {
    assert.ok(OSINT_DOMAINS[d], `Domain ${d} must exist in OSINT_DOMAINS`);
    assert.ok(OSINT_DOMAINS[d].layers.length > 0);
  }

  // Check exported constructors/functions
  assert.equal(typeof DarkVesselDetector, 'function');
  assert.equal(typeof GlobalFishingWatchLayer, 'function');
  assert.equal(typeof BayOfBengalAISStream, 'function');
  assert.equal(typeof Sentinel1FloodSAR, 'function');
  assert.equal(typeof Sentinel2Multispectral, 'function');
  assert.equal(typeof NASAFIRMSFireLayer, 'function');
  assert.equal(typeof MilitaryHexTracker, 'function');
  assert.equal(typeof SquawkEmergencyAlert, 'function');
  assert.equal(typeof SatelliteConjunctionEngine, 'function');
  assert.equal(typeof createSentinel5PTropomiLayer, 'function');
  assert.equal(typeof createBlitzortungLightningLayer, 'function');
  assert.equal(typeof SeaLevelRiseSimulator, 'function');
  assert.equal(typeof GraceGroundwaterTracker, 'function');
  assert.equal(typeof OrionAIIntelligenceConsole, 'function');
});

test('OSINTMasterRegistry instantiates and orchestrates all 6 subsystems', () => {
  const viewer = createMockViewer();
  const suite = createOSINTSuite(viewer, { soundEnabled: false });

  assert.ok(suite instanceof OSINTMasterRegistry);
  assert.equal(suite.initialized, true);
  assert.ok(suite.console instanceof OrionAIIntelligenceConsole);

  // Check layer retrieval
  const dv = suite.getLayer('darkVessels');
  assert.ok(dv instanceof DarkVesselDetector);

  const mil = suite.getLayer('militaryAirspace');
  assert.ok(mil instanceof MilitaryHexTracker);

  const sar = suite.getLayer('sentinel1Sar');
  assert.ok(sar instanceof Sentinel1FloodSAR);

  const slr = suite.getLayer('seaLevelRise');
  assert.ok(slr instanceof SeaLevelRiseSimulator);
});

test('Domain lifecycle: bulk activation and deactivation', () => {
  const viewer = createMockViewer();
  const suite = createOSINTSuite(viewer, { soundEnabled: false });

  // Activate Maritime Domain
  const mRes = suite.setDomainState('maritime', true);
  assert.equal(mRes, true);
  const mStatus = suite.getDomainStatus('maritime');
  assert.equal(mStatus.activeLayersCount, 3);

  // Deactivate Maritime Domain
  suite.setDomainState('maritime', false);
  const mStatusOff = suite.getDomainStatus('maritime');
  assert.equal(mStatusOff.activeLayersCount, 0);

  // Bulk startAll & stopAll
  suite.startAll();
  const allStats = suite.getStats();
  assert.ok(allStats.activeLayers > 0);

  suite.stopAll();
  const stoppedStats = suite.getStats();
  assert.equal(stoppedStats.activeLayers, 1); // Only ai_analyst stays online
});

test('Composite intelligence threat briefing synthesis via master registry', async () => {
  const viewer = createMockViewer();
  const suite = createOSINTSuite(viewer, { soundEnabled: false });

  const result = await suite.generateCompositeThreatBriefing('bay_of_bengal');
  assert.equal(result.ok, true);
  assert.equal(result.action, 'BRIEFING_GENERATED');
  assert.ok(result.briefing);
  assert.equal(result.briefing.sector.id, 'bay_of_bengal');
  assert.equal(result.briefing.compositeThreatLevel, 'CRITICAL');
});

test('Graceful teardown and destroy cleans up all 6 domains', () => {
  const viewer = createMockViewer();
  const suite = createOSINTSuite(viewer, { soundEnabled: false });

  assert.doesNotThrow(() => {
    suite.destroy();
  });
  assert.equal(suite.initialized, false);
  assert.equal(suite.layers.size, 0);
});
