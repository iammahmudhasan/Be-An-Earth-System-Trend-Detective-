/**
 * @file OrionAIIntelligenceConsole.test.mjs
 * @description Comprehensive unit test suite for OrionAIIntelligenceConsole.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import * as Cesium from 'cesium';

import {
  OrionAIIntelligenceConsole,
  createOrionAIIntelligenceConsole,
  TACTICAL_SECTORS,
  SHADER_PRESETS,
  CONSOLE_COMMANDS,
} from './OrionAIIntelligenceConsole.js';

function createMockViewer() {
  const listeners = [];
  return {
    camera: {
      flyTo: (opts) => {
        return opts;
      },
      lookAt: (target, offset) => {
        return { target, offset };
      },
      lookAtTransform: (transform) => {
        return transform;
      },
    },
    clock: {
      onTick: {
        addEventListener: (fn) => {
          listeners.push(fn);
          return () => {
            const idx = listeners.indexOf(fn);
            if (idx >= 0) listeners.splice(idx, 1);
          };
        },
      },
    },
    scene: {
      postProcessStages: {
        add: () => {},
        remove: () => {},
      },
    },
    entities: {
      add: (e) => e,
      remove: () => true,
    },
    _listeners: listeners,
  };
}

test('TACTICAL_SECTORS contains expected critical regions with valid coordinates', () => {
  const sectors = ['bay_of_bengal', 'chittagong_port', 'payra_port', 'sylhet_haor', 'barisal_coastal', 'bangabandhu_sat_1'];
  for (const s of sectors) {
    assert.ok(TACTICAL_SECTORS[s], `Sector ${s} should be defined`);
    assert.equal(typeof TACTICAL_SECTORS[s].id, 'string');
    assert.equal(Array.isArray(TACTICAL_SECTORS[s].coords), true);
    assert.equal(TACTICAL_SECTORS[s].coords.length, 3);
  }
});

test('SHADER_PRESETS defines thermal modes, night vision, and normal optics', () => {
  assert.ok(SHADER_PRESETS.thermal_white_hot);
  assert.ok(SHADER_PRESETS.thermal_black_hot);
  assert.ok(SHADER_PRESETS.thermal_ironbow);
  assert.ok(SHADER_PRESETS.surveillance);
  assert.ok(SHADER_PRESETS.normal);

  assert.equal(SHADER_PRESETS.thermal_white_hot.uniforms.mode, 0.0);
  assert.equal(SHADER_PRESETS.thermal_black_hot.uniforms.mode, 1.0);
  assert.equal(SHADER_PRESETS.thermal_ironbow.uniforms.palette, 1.0);
});

test('OrionAIIntelligenceConsole factory creates valid instance', () => {
  const viewer = createMockViewer();
  const consoleInstance = createOrionAIIntelligenceConsole(viewer, {
    operatorId: 'TEST-OPERATOR-77',
    soundEnabled: false,
  });

  assert.ok(consoleInstance instanceof OrionAIIntelligenceConsole);
  assert.equal(consoleInstance.operatorId, 'TEST-OPERATOR-77');
  assert.equal(consoleInstance.activeShader, 'normal');
  assert.equal(consoleInstance.orbitActive, false);
});

test('Camera maneuvers: flyToSector and tactical orbit execution', () => {
  const viewer = createMockViewer();
  const consoleInstance = createOrionAIIntelligenceConsole(viewer, { soundEnabled: false });

  // Fly to sector
  const flyRes = consoleInstance.flyToSector('sylhet_haor', { duration: 1.5 });
  assert.equal(flyRes.ok, true);
  assert.equal(flyRes.action, 'FLY_TO');
  assert.equal(consoleInstance.activeSector.id, 'sylhet_haor');

  // Start Orbit
  const orbitRes = consoleInstance.startTacticalOrbit();
  assert.equal(orbitRes.ok, true);
  assert.equal(consoleInstance.orbitActive, true);
  assert.equal(viewer._listeners.length, 1);

  // Stop Orbit
  const stopRes = consoleInstance.stopTacticalOrbit();
  assert.equal(stopRes.ok, true);
  assert.equal(consoleInstance.orbitActive, false);
  assert.equal(viewer._listeners.length, 0);

  // Top down
  const topRes = consoleInstance.setTopDownView(50000);
  assert.equal(topRes.ok, true);
  assert.equal(topRes.action, 'TOP_DOWN');
});

test('FLIR & Thermal shader controls update state and uniforms', () => {
  const viewer = createMockViewer();
  let styled = null;
  const mockStyleManager = {
    setStyle: (s) => {
      styled = s;
    },
  };

  const consoleInstance = createOrionAIIntelligenceConsole(viewer, {
    styleManager: mockStyleManager,
    soundEnabled: false,
  });

  const resShader = consoleInstance.setShader('thermal');
  assert.equal(resShader.ok, true);
  assert.equal(consoleInstance.activeShader, 'thermal');
  assert.equal(styled, 'thermal');

  const resWhot = consoleInstance.setFlirMode('white_hot');
  assert.equal(resWhot.ok, true);
  assert.equal(consoleInstance.activeFlirMode, 'white_hot');

  const resIronbow = consoleInstance.setFlirMode('ironbow');
  assert.equal(resIronbow.ok, true);
  assert.equal(consoleInstance.activeFlirMode, 'ironbow');

  consoleInstance.setShader('normal');
  assert.equal(consoleInstance.activeShader, 'normal');
  assert.equal(styled, 'normal');
});

test('Natural language query processing parses commands and returns briefings', async () => {
  const viewer = createMockViewer();
  const consoleInstance = createOrionAIIntelligenceConsole(viewer, { soundEnabled: false });

  // Help command
  const helpRes = await consoleInstance.processCommand('help');
  assert.equal(helpRes.ok, true);
  assert.equal(helpRes.action, 'HELP');

  // Status command
  const statusRes = await consoleInstance.processCommand('status');
  assert.equal(statusRes.ok, true);
  assert.equal(statusRes.action, 'STATUS');
  assert.ok(statusRes.stats);

  // Fly command
  const flyRes = await consoleInstance.processCommand('fly to Bay of Bengal');
  assert.equal(flyRes.ok, true);
  assert.equal(flyRes.action, 'FLY_TO');
  assert.equal(consoleInstance.activeSector.id, 'bay_of_bengal');

  // Shader command
  const flirRes = await consoleInstance.processCommand('activate FLIR white hot');
  assert.equal(flirRes.ok, true);
  assert.equal(consoleInstance.activeShader, 'thermal');
  assert.equal(consoleInstance.activeFlirMode, 'white_hot');

  // Briefing command
  const briefRes = await consoleInstance.processCommand('generate tactical intelligence briefing for Sylhet');
  assert.equal(briefRes.ok, true);
  assert.equal(briefRes.action, 'BRIEFING_GENERATED');
  assert.ok(briefRes.briefing);
  assert.equal(briefRes.briefing.compositeThreatLevel, 'CRITICAL');
  assert.ok(briefRes.briefing.threatMatrix.maritime);
  assert.ok(briefRes.briefing.threatMatrix.satellite);
  assert.ok(briefRes.briefing.threatMatrix.airspace);
  assert.ok(briefRes.briefing.threatMatrix.atmospheric);
  assert.ok(briefRes.briefing.threatMatrix.climate);
  assert.ok(briefRes.briefing.recommendations.length > 0);
  assert.ok(typeof briefRes.asciiText, 'string');
});

test('Event emitter handles subscriptions and dispatches', () => {
  const viewer = createMockViewer();
  const consoleInstance = createOrionAIIntelligenceConsole(viewer, { soundEnabled: false });

  let maneuverReceived = null;
  const cb = (data) => {
    maneuverReceived = data;
  };

  consoleInstance.on('maneuver', cb);
  consoleInstance.flyToSector('chittagong_port');

  assert.ok(maneuverReceived);
  assert.equal(maneuverReceived.type, 'FLY_TO');

  consoleInstance.off('maneuver', cb);
  maneuverReceived = null;
  consoleInstance.flyToSector('payra_port');
  assert.equal(maneuverReceived, null);
});

test('Teardown and destroy cleans up all resources without throwing', () => {
  const viewer = createMockViewer();
  const consoleInstance = createOrionAIIntelligenceConsole(viewer, { soundEnabled: false });

  consoleInstance.startTacticalOrbit();
  assert.doesNotThrow(() => {
    consoleInstance.destroy();
  });
  assert.equal(consoleInstance.orbitActive, false);
  assert.equal(consoleInstance.viewer, null);
});
