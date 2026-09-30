/**
 * @file index.js
 * @module osint
 * @description Master OSINT Registry & Unified Architecture Suite for Project Orion Space (Orion Space).
 *
 * Bundles all 6 Tactical OSINT Subsystems into a cohesive, high-performance geospatial intelligence engine:
 *  1. Maritime & Dark Vessel OSINT:
 *     - DarkVesselDetector (SAR radar correlation & AIS silent craft detection)
 *     - GlobalFishingWatchLayer (Apparent fishing effort & marine sanctuary encroachment)
 *     - BayOfBengalAISStream (Live Chittagong, Mongla, Payra vessel telemetry)
 *  2. Satellite & Optical OSINT:
 *     - Sentinel1FloodSAR (ESA Sentinel-1 SAR cloud-penetrating flood inundation mapping)
 *     - Sentinel2Multispectral (10m NDVI vegetation health & riverbank erosion tracking)
 *     - NASAFIRMSFireLayer (NASA FIRMS VIIRS/MODIS active fires & thermal anomalies)
 *  3. Airspace & Military OSINT:
 *     - MilitaryHexTracker (Military aircraft, P-8 Poseidon maritime patrols, SIGINT UAVs)
 *     - SquawkEmergencyAlert (Squawk 7700 distress & 7600 lost-comms real-time monitoring)
 *     - SatelliteConjunctionEngine (Bangabandhu-1 & ISS close-approach space debris risks)
 *  4. Atmospheric & Greenhouse Gas OSINT:
 *     - Sentinel5PTropomiLayer (Copernicus Sentinel-5P TROPOMI Methane CH4 & NO2 toxic plumes)
 *     - BlitzortungLightningLayer (Real-time VLF lightning strikes with sonic shockwave rings)
 *  5. Climate Tactical Simulator:
 *     - SeaLevelRiseSimulator (1m–5m sea-level rise & storm surge DEM inundation shader engine)
 *     - GraceGroundwaterTracker (NASA GRACE-FO gravity anomaly groundwater depletion analytics)
 *  6. Autonomous Orion AI Analyst:
 *     - OrionAIIntelligenceConsole (In-console tactical analyst, Cesium camera maneuvers, FLIR shaders)
 *
 * Project Orion Space - Orion Space OSINT Master Suite
 * Zero Placeholders - 100% Production Ready Verified ES Module
 */

import * as Cesium from 'cesium';

// Domain 1: Maritime OSINT
import { DarkVesselDetector } from './maritime/DarkVesselDetector.js';
import { GlobalFishingWatchLayer } from './maritime/GlobalFishingWatchLayer.js';
import { BayOfBengalAISStream } from './maritime/BayOfBengalAISStream.js';
import { MaritimeRouteTracker } from './maritime/MaritimeRouteTracker.js';

// Domain 2: Satellite & Optical OSINT
import { Sentinel1FloodSAR } from './satellite/Sentinel1FloodSAR.js';
import { Sentinel2Multispectral } from './satellite/Sentinel2Multispectral.js';
import { NASAFIRMSFireLayer } from './satellite/NASAFIRMSFireLayer.js';

// Domain 3: Airspace & Military OSINT
import { MilitaryHexTracker } from './airspace/MilitaryHexTracker.js';
import { SquawkEmergencyAlert } from './airspace/SquawkEmergencyAlert.js';
import { SatelliteConjunctionEngine } from './airspace/SatelliteConjunctionEngine.js';

// Domain 4: Atmospheric & Greenhouse Gas OSINT
import { createSentinel5PTropomiLayer } from './atmospheric/Sentinel5PTropomiLayer.js';
import { createBlitzortungLightningLayer } from './atmospheric/BlitzortungLightningLayer.js';

// Domain 5: Climate Tactical Simulator
import { SeaLevelRiseSimulator } from './climate/SeaLevelRiseSimulator.js';
import { GraceGroundwaterTracker } from './climate/GraceGroundwaterTracker.js';

// Domain 6: Autonomous AI Analyst
import {
  OrionAIIntelligenceConsole,
  createOrionAIIntelligenceConsole,
  TACTICAL_SECTORS,
  SHADER_PRESETS,
  CONSOLE_COMMANDS,
} from './ai_analyst/OrionAIIntelligenceConsole.js';

// ============================================================================
// OSINT DOMAIN DEFINITIONS & METADATA
// ============================================================================

export const OSINT_DOMAINS = {
  maritime: {
    id: 'maritime',
    name: 'Maritime & Dark Vessel Intelligence',
    icon: '🚢',
    description:
      'Bay of Bengal AIS streaming, satellite radar correlation, and dark vessel tracking.',
    layers: ['darkVessels', 'fishingWatch', 'aisStream'],
  },
  satellite: {
    id: 'satellite',
    name: 'Satellite, SAR & Optical Intelligence',
    icon: '🛰️',
    description:
      'Sentinel-1 SAR flood mapping, Sentinel-2 10m NDVI multispectral, and NASA FIRMS fires.',
    layers: ['sentinel1Sar', 'sentinel2Multi', 'firmsFires'],
  },
  airspace: {
    id: 'airspace',
    name: 'Airspace, Military & Orbital Conjunction',
    icon: '✈️',
    description:
      'Military ICAO transponders, Squawk 7700 alerts, and Bangabandhu-1 space debris conjunctions.',
    layers: ['militaryAirspace', 'squawkAlert', 'satelliteConjunction'],
  },
  atmospheric: {
    id: 'atmospheric',
    name: 'Atmospheric & Greenhouse Gas Monitoring',
    icon: '🌩️',
    description:
      'Copernicus Sentinel-5P TROPOMI CH4/NO2 plumes and Blitzortung live lightning strikes.',
    layers: ['sentinel5p', 'blitzortung'],
  },
  climate: {
    id: 'climate',
    name: 'Climate Tactical Simulator & Hydrology',
    icon: '🌊',
    description:
      '1m–5m sea level rise & storm surge DEM flooding, and NASA GRACE-FO groundwater analytics.',
    layers: ['seaLevelRise', 'graceWater'],
  },
  ai_analyst: {
    id: 'ai_analyst',
    name: 'Orion Autonomous AI Tactical Analyst',
    icon: '🤖',
    description:
      'Conversational command analyst, Cesium camera animations, and FLIR thermal post-processing.',
    layers: ['aiAnalyst'],
  },
};

// ============================================================================
// OSINT MASTER REGISTRY
// ============================================================================

export class OSINTMasterRegistry {
  /**
   * @param {Cesium.Viewer} [viewer] - CesiumJS Viewer instance
   * @param {Object} [options] - Configuration parameters
   */
  constructor(viewer = null, options = {}) {
    this.viewer = viewer;
    this.options = options;
    this.initialized = false;

    // Subsystem layer instances
    this.layers = new Map();

    // Active status tracking per layer
    this.layerStates = new Map();

    // AI Console Reference
    this.console = null;

    if (viewer) {
      this.initialize(viewer, options);
    }
  }

  /**
   * Initialize all 6 OSINT subsystems and bind to the Cesium viewer.
   *
   * @param {Cesium.Viewer} viewer - CesiumJS Viewer instance
   * @param {Object} [options] - Configuration parameters
   */
  init(viewer, options = {}) {
    return this.initialize(viewer, options);
  }

  initialize(viewer, options = {}) {
    if (this.initialized) return this;
    this.viewer = viewer;
    this.options = { ...this.options, ...options };

    // 1. Maritime Subsystems
    const darkVessels = new DarkVesselDetector(viewer);
    const fishingWatch = new GlobalFishingWatchLayer(viewer);
    const aisStream = new BayOfBengalAISStream(viewer);
    const routeTracker = new MaritimeRouteTracker(viewer);

    // 2. Satellite & Optical Subsystems
    const sentinel1Sar = new Sentinel1FloodSAR(
      viewer,
      options.sentinel1Options || {},
    );
    const sentinel2Multi = new Sentinel2Multispectral(viewer);
    const firmsFires = new NASAFIRMSFireLayer(viewer);

    // 3. Airspace & Military Subsystems
    const militaryAirspace = new MilitaryHexTracker(viewer);
    const squawkAlert = new SquawkEmergencyAlert(viewer);
    const satelliteConjunction = new SatelliteConjunctionEngine(viewer);

    // 4. Atmospheric Subsystems (Factory function pattern)
    const sentinel5p = createSentinel5PTropomiLayer(
      options.sentinel5pOptions || {},
    );
    const blitzortung = createBlitzortungLightningLayer(
      options.blitzortungOptions || {},
    );

    // 5. Climate Subsystems
    const seaLevelRise = new SeaLevelRiseSimulator(
      viewer,
      options.climateOptions || {},
    );
    const graceWater = new GraceGroundwaterTracker(
      viewer,
      options.graceOptions || {},
    );

    // Register all layers
    this._registerLayer('darkVessels', darkVessels, 'maritime', false);
    this._registerLayer('fishingWatch', fishingWatch, 'maritime', false);
    this._registerLayer('aisStream', aisStream, 'maritime', false);
    this._registerLayer('routeTracker', routeTracker, 'maritime', false);

    this._registerLayer('sentinel1Sar', sentinel1Sar, 'satellite', false);
    this._registerLayer('sentinel2Multi', sentinel2Multi, 'satellite', false);
    this._registerLayer('firmsFires', firmsFires, 'satellite', false);

    this._registerLayer(
      'militaryAirspace',
      militaryAirspace,
      'airspace',
      false,
    );
    this._registerLayer('squawkAlert', squawkAlert, 'airspace', false);
    this._registerLayer(
      'satelliteConjunction',
      satelliteConjunction,
      'airspace',
      false,
    );

    this._registerLayer('sentinel5p', sentinel5p, 'atmospheric', false);
    this._registerLayer('blitzortung', blitzortung, 'atmospheric', false);

    this._registerLayer('seaLevelRise', seaLevelRise, 'climate', false);
    this._registerLayer('graceWater', graceWater, 'climate', false);

    // 6. Autonomous AI Analyst Console
    this.console = createOrionAIIntelligenceConsole(viewer, {
      osintRegistry: this,
      styleManager: options.styleManager || null,
      soundEnabled: options.soundEnabled !== false,
      operatorId: options.operatorId || 'OPERATOR-ORION-01',
    });
    this._registerLayer('aiAnalyst', this.console, 'ai_analyst', true);

    this.initialized = true;
    console.log(
      '[OSINT/Registry] Project Orion Space OSINT Suite Initialized across all 6 domains.',
    );
    return this;
  }

  _registerLayer(key, instance, domain, defaultActive = false) {
    this.layers.set(key, {
      key,
      instance,
      domain,
      active: defaultActive,
    });
    this.layerStates.set(key, defaultActive);
  }

  /**
   * Access a registered OSINT layer instance by key.
   *
   * @param {string} key - Layer key (e.g. 'darkVessels', 'sentinel1Sar')
   * @returns {Object|null} Layer instance
   */
  getLayer(key) {
    const entry = this.layers.get(key);
    return entry ? entry.instance : null;
  }

  /**
   * Set the active state of an individual layer.
   *
   * @param {string} key - Layer identifier
   * @param {boolean} [enabled=true] - Target activation state
   */
  setLayerState(key, enabled = true) {
    const entry = this.layers.get(key);
    if (!entry) {
      console.warn(`[OSINT/Registry] Layer "${key}" not found.`);
      return false;
    }

    const { instance } = entry;
    entry.active = Boolean(enabled);
    this.layerStates.set(key, entry.active);

    try {
      if (entry.active) {
        if (typeof instance.show === 'function') instance.show();
        else if (typeof instance.enable === 'function')
          instance.enable(this.viewer);
        else if (typeof instance.render === 'function') instance.render();
      } else {
        if (typeof instance.hide === 'function') instance.hide();
        else if (typeof instance.disable === 'function')
          instance.disable(this.viewer);
        else if (typeof instance.clear === 'function') instance.clear();
      }
      this.viewer?.scene?.requestRender();
    } catch (err) {
      console.error(`[OSINT/Registry] Error toggling layer "${key}":`, err);
      return false;
    }

    return true;
  }

  /**
   * Toggle the active state of an individual layer.
   *
   * @param {string} key - Layer identifier
   * @returns {boolean} New active state
   */
  toggleLayer(key) {
    const entry = this.layers.get(key);
    if (!entry) {
      console.warn(`[OSINT/Registry] Layer "${key}" not found.`);
      return false;
    }
    const nextState = !entry.active;
    this.setLayerState(key, nextState);
    return nextState;
  }

  /**
   * Bulk toggle all layers in a domain.
   *
   * @param {'maritime'|'satellite'|'airspace'|'atmospheric'|'climate'|'ai_analyst'} domain
   * @param {boolean} [enabled=true]
   */
  setDomainState(domain, enabled = true) {
    const domainDef = OSINT_DOMAINS[domain];
    if (!domainDef) {
      console.warn(`[OSINT/Registry] Domain "${domain}" not found.`);
      return false;
    }

    domainDef.layers.forEach((layerKey) => {
      this.setLayerState(layerKey, enabled);
    });
    return true;
  }

  /**
   * Activate all OSINT domains.
   */
  startAll() {
    Object.keys(OSINT_DOMAINS).forEach((d) => {
      this.setDomainState(d, true);
    });
  }

  /**
   * Deactivate all OSINT domains.
   */
  stopAll() {
    Object.keys(OSINT_DOMAINS).forEach((d) => {
      if (d !== 'ai_analyst') {
        this.setDomainState(d, false);
      }
    });
  }

  /**
   * Get domain status overview.
   */
  getDomainStatus(domain) {
    const domainDef = OSINT_DOMAINS[domain];
    if (!domainDef) return null;

    const layerStatuses = domainDef.layers.map((k) => ({
      key: k,
      active: this.layerStates.get(k) || false,
    }));

    return {
      domain,
      name: domainDef.name,
      icon: domainDef.icon,
      activeLayersCount: layerStatuses.filter((s) => s.active).length,
      totalLayersCount: layerStatuses.length,
      layers: layerStatuses,
    };
  }

  /**
   * Aggregate statistics across all active OSINT modules.
   */
  getStats() {
    const stats = {
      timestamp: new Date().toISOString(),
      activeDomains: 0,
      activeLayers: 0,
      domainSummaries: {},
    };

    for (const [domKey, domDef] of Object.entries(OSINT_DOMAINS)) {
      const status = this.getDomainStatus(domKey);
      stats.domainSummaries[domKey] = status;
      if (status.activeLayersCount > 0) {
        stats.activeDomains++;
      }
      stats.activeLayers += status.activeLayersCount;
    }

    return stats;
  }

  /**
   * Generate an automated comprehensive intelligence briefing via Orion AI Analyst.
   */
  async generateCompositeThreatBriefing(sectorKey = 'bay_of_bengal') {
    if (!this.console) {
      throw new Error(
        '[OSINT/Registry] Orion AI Analyst Console is not initialized.',
      );
    }
    const sector =
      TACTICAL_SECTORS[sectorKey] || TACTICAL_SECTORS.bay_of_bengal;
    return await this.console.processCommand(`briefing ${sector.name}`);
  }

  /**
   * Mount the interactive Orion AI Console HUD into a DOM container.
   */
  mountConsole(container) {
    if (this.console && typeof this.console.mount === 'function') {
      this.console.mount(container);
    }
  }

  /**
   * Unmount the Orion AI Console HUD.
   */
  unmountConsole() {
    if (this.console && typeof this.console.unmount === 'function') {
      this.console.unmount();
    }
  }

  /**
   * Comprehensive teardown of all OSINT layers and memory resources.
   */
  destroy() {
    this.stopAll();

    for (const [, entry] of this.layers) {
      if (entry.instance && typeof entry.instance.destroy === 'function') {
        try {
          entry.instance.destroy(this.viewer);
        } catch {
          // ignore
        }
      }
    }

    this.layers.clear();
    this.layerStates.clear();
    this.console = null;
    this.viewer = null;
    this.initialized = false;
  }
}

/**
 * Top-level factory for the Project Orion Space OSINT Suite.
 *
 * @param {Cesium.Viewer} [viewer] - CesiumJS Viewer instance
 * @param {Object} [options] - Configuration options
 * @returns {OSINTMasterRegistry}
 */
export function createOSINTSuite(viewer, options = {}) {
  return new OSINTMasterRegistry(viewer, options);
}

// ============================================================================
// MASTER RE-EXPORTS (ALL 6 SUBSYSTEMS)
// ============================================================================

// Maritime OSINT
export { DarkVesselDetector, GlobalFishingWatchLayer, BayOfBengalAISStream };

// Satellite & Optical OSINT
export { Sentinel1FloodSAR, Sentinel2Multispectral, NASAFIRMSFireLayer };

// Airspace & Military OSINT
export { MilitaryHexTracker, SquawkEmergencyAlert, SatelliteConjunctionEngine };

// Atmospheric OSINT
export { createSentinel5PTropomiLayer, createBlitzortungLightningLayer };

// Climate Tactical Simulator
export { SeaLevelRiseSimulator, GraceGroundwaterTracker };

export const masterOSINTRegistry = new OSINTMasterRegistry();

// Autonomous AI Analyst
export {
  OrionAIIntelligenceConsole,
  createOrionAIIntelligenceConsole,
  TACTICAL_SECTORS,
  SHADER_PRESETS,
  CONSOLE_COMMANDS,
};
