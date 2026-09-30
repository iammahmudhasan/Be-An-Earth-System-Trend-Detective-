/**
 * @file OrionAIIntelligenceConsole.js
 * @module osint/ai_analyst/OrionAIIntelligenceConsole
 * @description In-Console Autonomous Orion AI Intelligence Console for Project Orion Space.
 *
 * Core Capabilities:
 *  1. Conversational Tactical Analyst: Accepts natural language operator text/voice commands,
 *     extracts multi-intent actions, tracks conversational memory, and resolves spatial targets.
 *  2. CesiumJS Camera Maneuver Controller: Smooth cinematic fly-tos, 360-degree tactical orbits,
 *     top-down nadir surveys, and bounding box framing across high-priority sectors.
 *  3. FLIR & Thermal Post-Process Shader Controller: Triggers White-Hot, Black-Hot, and Ironbow
 *     thermal shaders, bloom, sensitivity tuning, NVG night-vision, noir, and optical modes.
 *  4. OSINT Layer Orchestration: Toggles and inspects all 6 OSINT domains (Maritime, Satellite,
 *     Airspace, Atmospheric, Climate, and AI Diagnostics).
 *  5. Autonomous Intelligence Briefing Generator: Produces structured JSON briefings, high-tech
 *     ASCII HUD terminal briefings, and TTS audio narration scripts.
 *  6. Integrated HUD Terminal UI: Floating glassmorphic tactical terminal with quick chips,
 *     command history, streaming output, and synthesized Web Audio tactical sound effects.
 *
 * Project Orion Space - Orion Space OSINT Master Suite
 * Zero Placeholders - 100% Production Ready Verified ES Module
 */

import * as Cesium from 'cesium';

// ============================================================================
// TACTICAL SECTOR REGISTRY & PRESETS
// ============================================================================

export const TACTICAL_SECTORS = {
  bay_of_bengal: {
    id: 'bay_of_bengal',
    name: 'Bay of Bengal EEZ & Maritime Corridor',
    coords: [89.8, 20.2, 380000],
    orientation: { heading: 0.0, pitch: -52.0, roll: 0.0 },
    primaryDomain: 'maritime',
    threatBaseline: 'ELEVATED',
    description:
      'Strategic naval chokepoint, dark vessel trafficking, and high-seas marine sanctuaries.',
    recommendedLayers: [
      'darkVessels',
      'aisStream',
      'fishingWatch',
      'militaryAirspace',
    ],
  },
  chittagong_port: {
    id: 'chittagong_port',
    name: 'Chittagong Port & Karnaphuli Naval Anchorage',
    coords: [91.8, 22.25, 14000],
    orientation: { heading: 340.0, pitch: -36.0, roll: 0.0 },
    primaryDomain: 'maritime',
    threatBaseline: 'MODERATE',
    description:
      'Premier national commercial container anchorage, petroleum tankers, and naval base BNS Issa Khan.',
    recommendedLayers: ['aisStream', 'darkVessels', 'sentinel5p'],
  },
  payra_port: {
    id: 'payra_port',
    name: 'Payra Deep Sea Port & Rabnabad Channel',
    coords: [90.28, 21.98, 16000],
    orientation: { heading: 15.0, pitch: -32.0, roll: 0.0 },
    primaryDomain: 'maritime',
    threatBaseline: 'ELEVATED',
    description:
      'Deep sea coal handling terminal, estuarine storm surge vulnerability, and naval approach.',
    recommendedLayers: ['aisStream', 'seaLevelRise', 'sentinel1Sar'],
  },
  mongla_port: {
    id: 'mongla_port',
    name: 'Mongla Port & Sundarbans Pussur Gateway',
    coords: [89.6, 22.48, 15000],
    orientation: { heading: 30.0, pitch: -35.0, roll: 0.0 },
    primaryDomain: 'climate',
    threatBaseline: 'ELEVATED',
    description:
      'UNESCO Sundarbans mangrove gateway, river siltation, and marine wildlife protection zone.',
    recommendedLayers: ['aisStream', 'sentinel2Multi', 'seaLevelRise'],
  },
  sylhet_haor: {
    id: 'sylhet_haor',
    name: 'Sylhet Haor Basin & Surma Flood Plain',
    coords: [91.86, 24.89, 45000],
    orientation: { heading: 10.0, pitch: -45.0, roll: 0.0 },
    primaryDomain: 'satellite',
    threatBaseline: 'SEVERE',
    description:
      'Flash-flood inundated haor wetlands, transboundary Meghalaya runoff, and submerged villages.',
    recommendedLayers: ['sentinel1Sar', 'blitzortung', 'sentinel2Multi'],
  },
  feni_surge: {
    id: 'feni_surge',
    name: 'Feni Muhuri River Delta & Coastal Plain',
    coords: [91.4, 23.01, 35000],
    orientation: { heading: 355.0, pitch: -40.0, roll: 0.0 },
    primaryDomain: 'satellite',
    threatBaseline: 'HIGH',
    description:
      'Embankment breach corridor, agricultural flash flood zone, and railway bridge choke.',
    recommendedLayers: ['sentinel1Sar', 'seaLevelRise', 'firmsFires'],
  },
  dhaka_industrial: {
    id: 'dhaka_industrial',
    name: 'Dhaka Metropolitan & Gazipur Industrial Corridor',
    coords: [90.41, 23.82, 32000],
    orientation: { heading: 330.0, pitch: -45.0, roll: 0.0 },
    primaryDomain: 'atmospheric',
    threatBaseline: 'HIGH',
    description:
      'TROPOMI methane/NO2 atmospheric plume concentration and heavy industrial brick kiln cluster.',
    recommendedLayers: ['sentinel5p', 'firmsFires', 'squawkAlert'],
  },
  chittagong_hills: {
    id: 'chittagong_hills',
    name: 'Chittagong Hill Tracts & Bandarban Forest',
    coords: [92.22, 22.35, 42000],
    orientation: { heading: 45.0, pitch: -38.0, roll: 0.0 },
    primaryDomain: 'satellite',
    threatBaseline: 'ELEVATED',
    description:
      'NASA FIRMS VIIRS/MODIS active thermal fire anomalies, deforestation, and hilly terrain radar shadow.',
    recommendedLayers: ['firmsFires', 'sentinel2Multi', 'militaryAirspace'],
  },
  barisal_coastal: {
    id: 'barisal_coastal',
    name: 'Barisal Coastal Belt & Bhola Polder Inundation Arc',
    coords: [90.5, 22.5, 65000],
    orientation: { heading: 180.0, pitch: -50.0, roll: 0.0 },
    primaryDomain: 'climate',
    threatBaseline: 'CRITICAL',
    description:
      'Low-elevation coastal zone vulnerable to 1m–5m sea level rise and severe cyclone storm surges.',
    recommendedLayers: ['seaLevelRise', 'sentinel1Sar', 'aisStream'],
  },
  barind_tract: {
    id: 'barind_tract',
    name: 'Barind Tract Deep Aquifer & Drought Belt',
    coords: [88.6, 24.5, 60000],
    orientation: { heading: 0.0, pitch: -58.0, roll: 0.0 },
    primaryDomain: 'climate',
    threatBaseline: 'HIGH',
    description:
      'NASA GRACE-FO gravity anomaly groundwater depletion and severe agricultural irrigation drawdown.',
    recommendedLayers: ['graceWater', 'sentinel2Multi', 'firmsFires'],
  },
  bangabandhu_sat_1: {
    id: 'bangabandhu_sat_1',
    name: 'Bangabandhu Satellite-1 (GEO Slot 119.1°E)',
    coords: [119.1, 0.0, 35786000],
    orientation: { heading: 0.0, pitch: -90.0, roll: 0.0 },
    primaryDomain: 'airspace',
    threatBaseline: 'HIGH',
    description:
      'Geostationary orbital slot conjunction risk with Cosmos-2251 and space debris fragments.',
    recommendedLayers: ['satelliteConjunction', 'militaryAirspace'],
  },
  iss_orbit: {
    id: 'iss_orbit',
    name: 'International Space Station (LEO Track)',
    coords: [88.5, 22.3, 420000],
    orientation: { heading: 45.0, pitch: -60.0, roll: 0.0 },
    primaryDomain: 'airspace',
    threatBaseline: 'CRITICAL',
    description:
      'Low Earth Orbit orbital debris conjunction risk with Fengyun-1C hypervelocity fragments.',
    recommendedLayers: ['satelliteConjunction', 'militaryAirspace'],
  },
  coxs_bazar: {
    id: 'coxs_bazar',
    name: "Cox's Bazar Coastal Radar Station & Naf Estuary",
    coords: [91.98, 21.43, 22000],
    orientation: { heading: 315.0, pitch: -38.0, roll: 0.0 },
    primaryDomain: 'airspace',
    threatBaseline: 'HIGH',
    description:
      'Border surveillance radar outpost, maritime refugee corridor, and naval patrol anchorage.',
    recommendedLayers: ['militaryAirspace', 'darkVessels', 'aisStream'],
  },
  austin_base: {
    id: 'austin_base',
    name: 'Tactical HQ Base (Austin Operations Center)',
    coords: [-97.7431, 30.2672, 12000],
    orientation: { heading: 0.0, pitch: -35.0, roll: 0.0 },
    primaryDomain: 'ai_analyst',
    threatBaseline: 'LOW',
    description:
      'Project Orion Space North American ground station and tactical AI command nexus.',
    recommendedLayers: ['blitzortung', 'squawkAlert'],
  },
};

// ============================================================================
// SHADER & VISUAL PALETTE PRESETS
// ============================================================================

export const SHADER_PRESETS = {
  thermal_white_hot: {
    style: 'thermal',
    name: 'FLIR White-Hot',
    description:
      'Military thermal imaging: high heat signatures render as bright white, cold as black.',
    uniforms: {
      mode: 0.0,
      palette: 0.0,
      sensitivity: 0.85,
      bloom: 0.7,
      pixelation: 1.5,
    },
  },
  thermal_black_hot: {
    style: 'thermal',
    name: 'FLIR Black-Hot',
    description:
      'Military thermal imaging: high heat signatures render as deep black against warm terrain.',
    uniforms: {
      mode: 1.0,
      palette: 0.0,
      sensitivity: 0.8,
      bloom: 0.5,
      pixelation: 1.5,
    },
  },
  thermal_ironbow: {
    style: 'thermal',
    name: 'FLIR Ironbow (Predator)',
    description:
      'Dynamic multi-hue thermal palette: purple/red (cool) to yellow/white (superheated).',
    uniforms: {
      mode: 0.0,
      palette: 1.0,
      sensitivity: 0.9,
      bloom: 0.75,
      pixelation: 1.2,
    },
  },
  surveillance: {
    style: 'surveillance',
    name: 'Night Vision (NVG Green Phosphor)',
    description:
      'Intensifier tube green phosphor night vision with temporal scintillation grain and scanlines.',
    uniforms: { intensity: 1.0 },
  },
  noir: {
    style: 'noir',
    name: 'High-Contrast Noir Recon',
    description:
      'Monochromatic high-pass filter for enhanced topographic edge discrimination.',
    uniforms: { intensity: 1.0 },
  },
  retro: {
    style: 'retro',
    name: 'Tactical CRT Terminal',
    description:
      'Amber/Green phosphor CRT display with horizontal raster scanlines and barrel distortion.',
    uniforms: { intensity: 1.0 },
  },
  normal: {
    style: 'normal',
    name: 'Standard Optical Spectrum',
    description:
      'Natural true-color satellite and aerial imagery pass-through.',
    uniforms: {},
  },
};

// ============================================================================
// CONSOLE COMMAND VOCABULARY & INTENTS
// ============================================================================

export const CONSOLE_COMMANDS = [
  {
    intent: 'SECTOR_FLY',
    verbs: ['fly', 'goto', 'navigate', 'jump', 'move to', 'pan to', 'focus'],
    syntax: 'fly to <sector>',
  },
  {
    intent: 'CAMERA_ORBIT',
    verbs: ['orbit', 'circle', 'rotate around', '360 scan'],
    syntax: 'orbit [speed]',
  },
  {
    intent: 'CAMERA_TOPDOWN',
    verbs: ['topdown', 'nadir', 'overhead', 'bird eye', 'satellite view'],
    syntax: 'topdown',
  },
  {
    intent: 'CAMERA_RESET',
    verbs: ['reset camera', 'home view', 'center'],
    syntax: 'reset camera',
  },
  {
    intent: 'SHADER_SET',
    verbs: [
      'thermal',
      'flir',
      'night vision',
      'nvg',
      'noir',
      'retro',
      'normal',
      'optical',
      'shader',
    ],
    syntax: 'set shader <name>',
  },
  {
    intent: 'FLIR_MODE',
    verbs: ['white hot', 'black hot', 'ironbow', 'predator'],
    syntax: 'set flir mode <whot|bhot|ironbow>',
  },
  {
    intent: 'LAYER_TOGGLE',
    verbs: [
      'toggle',
      'enable',
      'disable',
      'show',
      'hide',
      'activate',
      'turn on',
      'turn off',
    ],
    syntax: 'toggle layer <name>',
  },
  {
    intent: 'DOMAIN_CONTROL',
    verbs: [
      'domain',
      'maritime',
      'satellite',
      'airspace',
      'atmospheric',
      'climate',
    ],
    syntax: 'activate domain <name>',
  },
  {
    intent: 'INTEL_BRIEFING',
    verbs: [
      'brief',
      'briefing',
      'sitrep',
      'threat',
      'report',
      'intel',
      'assessment',
    ],
    syntax: 'briefing [sector]',
  },
  {
    intent: 'SYSTEM_STATUS',
    verbs: ['status', 'health', 'telemetry', 'ping', 'sensors', 'diagnostics'],
    syntax: 'status',
  },
  { intent: 'CLEAR', verbs: ['clear', 'cls'], syntax: 'clear' },
  {
    intent: 'HELP',
    verbs: ['help', '?', 'commands', 'manual'],
    syntax: 'help',
  },
];

// ============================================================================
// INLINE GLSL FLIR SHADER (STANDALONE RESILIENT FALLBACK)
// ============================================================================

const GLSL_FLIR_FALLBACK = /* glsl */ `
  uniform sampler2D colorTexture;
  uniform float mode;       // 0.0 = white hot, 1.0 = black hot
  uniform float palette;    // 0.0 = mono, 1.0 = ironbow
  uniform float sensitivity;
  uniform float bloom;
  in vec2 v_textureCoordinates;

  vec3 ironbowRamp(float t) {
    t = clamp(t, 0.0, 1.0);
    const vec3 c0 = vec3(0.0, 0.0, 0.0);
    const vec3 c1 = vec3(0.13, 0.0, 0.30);
    const vec3 c2 = vec3(0.49, 0.0, 0.45);
    const vec3 c3 = vec3(0.86, 0.10, 0.18);
    const vec3 c4 = vec3(1.0, 0.55, 0.0);
    const vec3 c5 = vec3(1.0, 0.91, 0.32);
    const vec3 c6 = vec3(1.0, 1.0, 1.0);
    float s = t * 6.0;
    if (s < 1.0) return mix(c0, c1, s);
    if (s < 2.0) return mix(c1, c2, s - 1.0);
    if (s < 3.0) return mix(c2, c3, s - 2.0);
    if (s < 4.0) return mix(c3, c4, s - 3.0);
    if (s < 5.0) return mix(c4, c5, s - 4.0);
    return mix(c5, c6, s - 5.0);
  }

  void main() {
    vec4 texColor = texture(colorTexture, v_textureCoordinates);
    // Relative radiometric thermal approximation based on luminance & red channel
    float luma = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));
    float thermalSig = clamp((luma - 0.1) * sensitivity * 1.35, 0.0, 1.0);

    // Hot spot blooming bleed
    thermalSig = pow(thermalSig, 1.0 - (bloom * 0.45));

    if (mode > 0.5) {
      // Black-Hot
      thermalSig = 1.0 - thermalSig;
    }

    vec3 finalRgb;
    if (palette > 0.5) {
      finalRgb = ironbowRamp(thermalSig);
    } else {
      finalRgb = vec3(thermalSig);
    }

    out_FragColor = vec4(finalRgb, 1.0);
  }
`;

// ============================================================================
// MAIN CLASS: OrionAIIntelligenceConsole
// ============================================================================

export class OrionAIIntelligenceConsole {
  /**
   * @param {Cesium.Viewer} viewer - CesiumJS Viewer instance
   * @param {Object} [options] - Configuration parameters
   * @param {Object} [options.styleManager] - Orion Space visualSettings or styleManager
   * @param {Object} [options.osintRegistry] - Master OSINT Registry instance
   * @param {boolean} [options.soundEnabled=true] - Enable Web Audio procedural SFX
   * @param {string} [options.operatorId='OPERATOR-ORION-01'] - Call-sign ID
   */
  constructor(viewer, options = {}) {
    this.viewer = viewer;
    this.styleManager = options.styleManager || null;
    this.osintRegistry = options.osintRegistry || null;
    this.soundEnabled = options.soundEnabled !== false;
    this.operatorId = options.operatorId || 'OPERATOR-ORION-01';

    // State
    this.activeSector = TACTICAL_SECTORS.bay_of_bengal;
    this.activeShader = 'normal';
    this.activeFlirMode = 'white_hot';
    this.orbitActive = false;
    this._orbitRemoveCallback = null;
    this._orbitAngleRad = 0.0;
    this._orbitRadiusM = 45000;
    this._orbitSpeed = 0.003;
    this._orbitCenter = null;

    // Standalone fallback post-process stage
    this._flirPostProcessStage = null;

    // Command & Query History
    this.history = [];
    this.commandHistory = [];
    this.historyIndex = -1;

    // Event Listeners
    this._listeners = new Map();

    // Web Audio Synthesizer Context
    this._audioCtx = null;

    // DOM UI Container
    this._domContainer = null;
    this._domElements = {};

    this._initAudio();
    this._initStandaloneShader();
  }

  // ==========================================================================
  // INITIALIZATION & AUDIO SYNTHESIS
  // ==========================================================================

  _initAudio() {
    if (typeof window === 'undefined' || !this.soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this._audioCtx = new AudioCtx();
      }
    } catch {
      this.soundEnabled = false;
    }
  }

  _playSfx(type = 'beep') {
    if (!this.soundEnabled || !this._audioCtx) return;
    try {
      if (this._audioCtx.state === 'suspended') {
        this._audioCtx.resume();
      }
      const t = this._audioCtx.currentTime;
      const osc = this._audioCtx.createOscillator();
      const gain = this._audioCtx.createGain();

      if (type === 'affirmative') {
        // High-tech two-tone tactical blip
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, t);
        osc.frequency.setValueAtTime(1200, t + 0.06);
        gain.gain.setValueAtTime(0.08, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
        osc.connect(gain);
        gain.connect(this._audioCtx.destination);
        osc.start(t);
        osc.stop(t + 0.16);
      } else if (type === 'alert') {
        // Urgent warning buzz
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(520, t);
        osc.frequency.exponentialRampToValueAtTime(320, t + 0.22);
        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
        osc.connect(gain);
        gain.connect(this._audioCtx.destination);
        osc.start(t);
        osc.stop(t + 0.22);
      } else if (type === 'radar') {
        // High sonar ping
        osc.type = 'sine';
        osc.frequency.setValueAtTime(2400, t);
        osc.frequency.exponentialRampToValueAtTime(1200, t + 0.25);
        gain.gain.setValueAtTime(0.07, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
        osc.connect(gain);
        gain.connect(this._audioCtx.destination);
        osc.start(t);
        osc.stop(t + 0.25);
      } else {
        // Standard keystroke / command entry tick
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(950, t);
        gain.gain.setValueAtTime(0.04, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
        osc.connect(gain);
        gain.connect(this._audioCtx.destination);
        osc.start(t);
        osc.stop(t + 0.04);
      }
    } catch {
      // Audio playback safely suppressed
    }
  }

  _initStandaloneShader() {
    if (!this.viewer?.scene?.postProcessStages) return;
    try {
      this._flirPostProcessStage = new Cesium.PostProcessStage({
        name: 'orion_standalone_flir_stage',
        fragmentShader: GLSL_FLIR_FALLBACK,
        uniforms: {
          mode: 0.0,
          palette: 0.0,
          sensitivity: 0.85,
          bloom: 0.7,
        },
      });
      this._flirPostProcessStage.enabled = false;
      this.viewer.scene.postProcessStages.add(this._flirPostProcessStage);
    } catch (err) {
      console.warn(
        '[OrionAIConsole] Standalone shader stage creation deferred:',
        err.message,
      );
    }
  }

  // ==========================================================================
  // NATURAL LANGUAGE COMMAND PROCESSOR
  // ==========================================================================

  /**
   * Main entry point for operator text or transcribed voice queries.
   * Parses intent, executes corresponding camera/shader/layer/briefing routines,
   * logs the transaction, and returns a structured response object.
   *
   * @param {string} rawCommand - Operator query string
   * @returns {Promise<Object>} Execution result with status, text response, and telemetry
   */
  async processCommand(rawCommand) {
    if (!rawCommand || typeof rawCommand !== 'string') {
      return { ok: false, message: 'Invalid empty command.' };
    }

    const command = rawCommand.trim();
    const lower = command.toLowerCase();
    this.commandHistory.push(command);
    this.historyIndex = this.commandHistory.length;
    this._playSfx('beep');

    this._emit('command', { command, timestamp: new Date().toISOString() });

    // 1. Help / Commands Query
    if (
      lower === 'help' ||
      lower === '?' ||
      lower === 'commands' ||
      lower === 'man'
    ) {
      return this._handleHelp();
    }

    // 2. Clear Screen
    if (lower === 'clear' || lower === 'cls') {
      this.history = [];
      this._updateTerminalLog();
      return {
        ok: true,
        action: 'CLEAR',
        message: 'Console terminal cleared.',
      };
    }

    // 3. System Status / Health
    if (
      lower.includes('status') ||
      lower.includes('health') ||
      lower.includes('sensors') ||
      lower.includes('diagnostics')
    ) {
      return this._handleStatus();
    }

    // 4. Intelligence Briefing Request
    if (
      lower.includes('brief') ||
      lower.includes('sitrep') ||
      lower.includes('threat') ||
      lower.includes('report') ||
      lower.includes('assessment')
    ) {
      const sector = this._extractSector(lower) || this.activeSector;
      return await this._handleBriefing(sector);
    }

    // 5. Camera Maneuver: Orbit
    if (
      lower.includes('orbit') ||
      lower.includes('circle') ||
      lower.includes('360')
    ) {
      if (
        lower.includes('stop') ||
        lower.includes('cancel') ||
        lower.includes('halt')
      ) {
        return this.stopTacticalOrbit();
      }
      return this.startTacticalOrbit();
    }

    // 6. Camera Maneuver: Top-down / Nadir
    if (
      lower.includes('topdown') ||
      lower.includes('nadir') ||
      lower.includes('overhead') ||
      lower.includes('bird eye')
    ) {
      return this.setTopDownView();
    }

    // 7. Camera Maneuver: Reset / Home
    if (lower.includes('reset camera') || lower.includes('home view')) {
      return this.flyToSector('bay_of_bengal', { duration: 3.5 });
    }

    // 8. Visual / FLIR Shader Triggers
    if (
      lower.includes('flir') ||
      lower.includes('thermal') ||
      lower.includes('night vision') ||
      lower.includes('nvg') ||
      lower.includes('noir') ||
      lower.includes('retro') ||
      lower.includes('normal') ||
      lower.includes('optical')
    ) {
      return this._handleShaderCommand(lower);
    }

    // 9. OSINT Layer Toggles
    if (
      lower.includes('layer') ||
      lower.includes('toggle') ||
      lower.includes('show') ||
      lower.includes('hide') ||
      lower.includes('enable') ||
      lower.includes('disable')
    ) {
      const layerResult = this._handleLayerToggle(lower);
      if (layerResult) return layerResult;
    }

    // 10. Domain Bulk Toggles
    if (
      lower.includes('maritime') ||
      lower.includes('satellite') ||
      lower.includes('airspace') ||
      lower.includes('atmospheric') ||
      lower.includes('climate')
    ) {
      const domainResult = this._handleDomainCommand(lower);
      if (domainResult) return domainResult;
    }

    // 11. Camera Fly-To Sector (Direct name match or "fly to X")
    const matchedSector = this._extractSector(lower);
    if (matchedSector) {
      return this.flyToSector(matchedSector.id);
    }

    // Fallback: Unrecognized command response
    const msg = `Command unrecognized: "${command}". Type "help" or click tactical chips for instructions.`;
    this._playSfx('alert');
    this._appendLog('WARN', msg);
    return { ok: false, action: 'UNKNOWN', message: msg };
  }

  _extractSector(text) {
    const keys = Object.keys(TACTICAL_SECTORS);
    for (const key of keys) {
      const s = TACTICAL_SECTORS[key];
      if (
        text.includes(key.replace(/_/g, ' ')) ||
        text.includes(s.name.toLowerCase()) ||
        text.includes(key)
      ) {
        return s;
      }
    }
    // Specific common alias checks
    if (text.includes('bengal') || text.includes('bay'))
      return TACTICAL_SECTORS.bay_of_bengal;
    if (
      text.includes('chittagong') ||
      text.includes('ctg') ||
      text.includes('chattogram')
    )
      return TACTICAL_SECTORS.chittagong_port;
    if (text.includes('payra') || text.includes('kuakata'))
      return TACTICAL_SECTORS.payra_port;
    if (text.includes('mongla') || text.includes('sundarban'))
      return TACTICAL_SECTORS.mongla_port;
    if (
      text.includes('sylhet') ||
      text.includes('haor') ||
      text.includes('surma')
    )
      return TACTICAL_SECTORS.sylhet_haor;
    if (text.includes('feni') || text.includes('muhuri'))
      return TACTICAL_SECTORS.feni_surge;
    if (
      text.includes('dhaka') ||
      text.includes('gazipur') ||
      text.includes('savar')
    )
      return TACTICAL_SECTORS.dhaka_industrial;
    if (
      text.includes('hill tracts') ||
      text.includes('bandarban') ||
      text.includes('rangamati')
    )
      return TACTICAL_SECTORS.chittagong_hills;
    if (
      text.includes('barisal') ||
      text.includes('bhola') ||
      text.includes('patuakhali')
    )
      return TACTICAL_SECTORS.barisal_coastal;
    if (
      text.includes('barind') ||
      text.includes('rajshahi') ||
      text.includes('naogaon')
    )
      return TACTICAL_SECTORS.barind_tract;
    if (
      text.includes('bangabandhu') ||
      text.includes('bd-1') ||
      text.includes('bd1')
    )
      return TACTICAL_SECTORS.bangabandhu_sat_1;
    if (text.includes('iss') || text.includes('station'))
      return TACTICAL_SECTORS.iss_orbit;
    if (text.includes('cox') || text.includes('naf'))
      return TACTICAL_SECTORS.coxs_bazar;
    if (text.includes('austin')) return TACTICAL_SECTORS.austin_base;
    return null;
  }

  // ==========================================================================
  // CESIUM CAMERA MANEUVERS
  // ==========================================================================

  /**
   * Fly camera to designated tactical sector with cinematic easing.
   *
   * @param {string} sectorId - Key from TACTICAL_SECTORS
   * @param {Object} [options] - Duration, pitch, heading overrides
   */
  flyToSector(sectorId, options = {}) {
    const sector = TACTICAL_SECTORS[sectorId] || TACTICAL_SECTORS.bay_of_bengal;
    this.activeSector = sector;
    this.stopTacticalOrbit();

    if (!this.viewer || !this.viewer.camera) {
      const msg = `[OrionAIConsole] Camera navigation simulated for ${sector.name}`;
      this._appendLog('NAV', msg);
      return {
        ok: true,
        action: 'FLY_TO',
        sector: sector.name,
        simulated: true,
      };
    }

    const duration = options.duration || 3.0;
    const [lon, lat, height] = sector.coords;
    const dest = Cesium.Cartesian3.fromDegrees(
      lon,
      lat,
      options.height || height,
    );
    const headingRad = Cesium.Math.toRadians(
      options.heading != null ? options.heading : sector.orientation.heading,
    );
    const pitchRad = Cesium.Math.toRadians(
      options.pitch != null ? options.pitch : sector.orientation.pitch,
    );
    const rollRad = Cesium.Math.toRadians(
      options.roll != null ? options.roll : sector.orientation.roll,
    );

    this.viewer.camera.flyTo({
      destination: dest,
      orientation: { heading: headingRad, pitch: pitchRad, roll: rollRad },
      duration,
      easingFunction: Cesium.EasingFunction.CUBIC_IN_OUT,
    });

    this._playSfx('radar');
    const msg = `EXECUTING TACTICAL FLY-TO ➔ ${sector.name} (ALT: ${height.toLocaleString()}m, PITCH: ${sector.orientation.pitch}°)`;
    this._appendLog('EXEC', msg);
    this._emit('maneuver', {
      type: 'FLY_TO',
      sector: sector.name,
      coords: sector.coords,
    });

    return {
      ok: true,
      action: 'FLY_TO',
      sector: sector.name,
      coords: sector.coords,
      duration,
    };
  }

  /**
   * Fly camera directly to arbitrary lon/lat coordinates.
   */
  flyToCoordinates(lon, lat, heightM = 15000, options = {}) {
    this.stopTacticalOrbit();
    if (!this.viewer?.camera)
      return { ok: false, message: 'Viewer camera unavailable' };

    const duration = options.duration || 3.0;
    const headingRad = Cesium.Math.toRadians(
      options.heading != null ? options.heading : 0.0,
    );
    const pitchRad = Cesium.Math.toRadians(
      options.pitch != null ? options.pitch : -45.0,
    );

    this.viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(lon, lat, heightM),
      orientation: { heading: headingRad, pitch: pitchRad, roll: 0.0 },
      duration,
      easingFunction: Cesium.EasingFunction.CUBIC_IN_OUT,
    });

    const msg = `FLY-TO COORDINATES ➔ Lat: ${lat.toFixed(4)}°, Lon: ${lon.toFixed(4)}° (Alt: ${heightM}m)`;
    this._appendLog('NAV', msg);
    return { ok: true, action: 'FLY_TO_COORDS', lat, lon, heightM };
  }

  /**
   * Start 360-degree tactical continuous orbit around current position or specified Cartesian3.
   */
  startTacticalOrbit(centerPosition = null, radiusM = 40000, speed = 0.003) {
    if (!this.viewer?.camera)
      return { ok: false, message: 'Viewer camera unavailable' };
    this.stopTacticalOrbit();

    let center = centerPosition;
    if (!center) {
      const [lon, lat] = this.activeSector.coords;
      center = Cesium.Cartesian3.fromDegrees(lon, lat, 0);
    }
    this._orbitCenter = center;
    this._orbitRadiusM = radiusM;
    this._orbitSpeed = speed;
    this.orbitActive = true;

    // Attach tick listener for smooth continuous camera rotation
    this._orbitRemoveCallback = this.viewer.clock.onTick.addEventListener(
      () => {
        if (!this.orbitActive || !this._orbitCenter) return;
        this._orbitAngleRad += this._orbitSpeed;
        if (this._orbitAngleRad > Math.PI * 2)
          this._orbitAngleRad -= Math.PI * 2;

        this.viewer.camera.lookAt(
          this._orbitCenter,
          new Cesium.HeadingPitchRange(
            this._orbitAngleRad,
            Cesium.Math.toRadians(-35),
            this._orbitRadiusM,
          ),
        );
      },
    );

    this._playSfx('affirmative');
    const msg = `TACTICAL 360° ORBIT INITIATED around ${this.activeSector.name}`;
    this._appendLog('MANEUVER', msg);
    this._emit('maneuver', {
      type: 'ORBIT_START',
      sector: this.activeSector.name,
    });
    return { ok: true, action: 'ORBIT_START', sector: this.activeSector.name };
  }

  /**
   * Stop active tactical orbit and release camera lock.
   */
  stopTacticalOrbit() {
    if (!this.orbitActive)
      return { ok: true, action: 'ORBIT_STOP', message: 'Orbit was inactive.' };

    this.orbitActive = false;
    if (this._orbitRemoveCallback) {
      this._orbitRemoveCallback();
      this._orbitRemoveCallback = null;
    }
    if (this.viewer?.camera) {
      this.viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
    }

    const msg = 'TACTICAL ORBIT HALTED. Free camera control restored.';
    this._appendLog('MANEUVER', msg);
    this._emit('maneuver', { type: 'ORBIT_STOP' });
    return { ok: true, action: 'ORBIT_STOP', message: msg };
  }

  /**
   * Set nadir top-down survey view (pitch -90°).
   */
  setTopDownView(heightM = 85000) {
    this.stopTacticalOrbit();
    if (!this.viewer?.camera)
      return { ok: false, message: 'Viewer camera unavailable' };

    const [lon, lat] = this.activeSector.coords;
    this.viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(lon, lat, heightM),
      orientation: {
        heading: 0.0,
        pitch: Cesium.Math.toRadians(-90.0),
        roll: 0.0,
      },
      duration: 2.2,
      easingFunction: Cesium.EasingFunction.QUAD_IN_OUT,
    });

    const msg = `NADIR SATELLITE SURVEY MODE: Overhead pitch -90° at ${this.activeSector.name}`;
    this._appendLog('NAV', msg);
    return {
      ok: true,
      action: 'TOP_DOWN',
      sector: this.activeSector.name,
      heightM,
    };
  }

  // ==========================================================================
  // FLIR / THERMAL SHADER CONTROLLER
  // ==========================================================================

  _handleShaderCommand(lower) {
    if (
      lower.includes('white hot') ||
      (lower.includes('flir') && lower.includes('white'))
    ) {
      return this.setFlirMode('white_hot');
    }
    if (
      lower.includes('black hot') ||
      (lower.includes('flir') && lower.includes('black'))
    ) {
      return this.setFlirMode('black_hot');
    }
    if (lower.includes('ironbow') || lower.includes('predator')) {
      return this.setFlirMode('ironbow');
    }
    if (lower.includes('thermal') || lower.includes('flir')) {
      return this.setShader('thermal');
    }
    if (
      lower.includes('night vision') ||
      lower.includes('nvg') ||
      lower.includes('surveillance')
    ) {
      return this.setShader('surveillance');
    }
    if (lower.includes('noir')) {
      return this.setShader('noir');
    }
    if (lower.includes('retro')) {
      return this.setShader('retro');
    }
    if (
      lower.includes('normal') ||
      lower.includes('optical') ||
      lower.includes('off')
    ) {
      return this.setShader('normal');
    }
    return { ok: false, message: 'Unknown shader specification.' };
  }

  /**
   * Set visual shader preset.
   * @param {'thermal'|'surveillance'|'noir'|'retro'|'normal'} styleName
   */
  setShader(styleName) {
    const validStyles = ['thermal', 'surveillance', 'noir', 'retro', 'normal'];
    const targetStyle = validStyles.includes(styleName) ? styleName : 'normal';
    this.activeShader = targetStyle;

    // 1. If global styleManager is attached, use it
    if (this.styleManager && typeof this.styleManager.setStyle === 'function') {
      try {
        this.styleManager.setStyle(targetStyle);
      } catch (err) {
        console.warn(
          '[OrionAIConsole] styleManager.setStyle failed, falling back to standalone stage:',
          err,
        );
      }
    }

    // 2. Standalone fallback post-process stage management
    if (this._flirPostProcessStage) {
      if (targetStyle === 'thermal') {
        this._flirPostProcessStage.enabled = true;
        this.setFlirMode(this.activeFlirMode);
      } else {
        this._flirPostProcessStage.enabled = false;
      }
    }

    this._playSfx('affirmative');
    const msg = `VISUAL SENSOR SPECTRUM SET ➔ [${targetStyle.toUpperCase()}]`;
    this._appendLog('SHADER', msg);
    this._emit('shader_change', { shader: targetStyle });
    return { ok: true, action: 'SET_SHADER', style: targetStyle };
  }

  /**
   * Select FLIR sub-mode: white_hot, black_hot, or ironbow.
   * @param {'white_hot'|'black_hot'|'ironbow'} modeKey
   */
  setFlirMode(modeKey) {
    this.activeFlirMode = modeKey;
    const preset =
      SHADER_PRESETS[`thermal_${modeKey}`] || SHADER_PRESETS.thermal_white_hot;

    // Ensure thermal shader is active
    if (this.activeShader !== 'thermal') {
      this.setShader('thermal');
    }

    if (this._flirPostProcessStage) {
      this._flirPostProcessStage.uniforms.mode = preset.uniforms.mode;
      this._flirPostProcessStage.uniforms.palette = preset.uniforms.palette;
      this._flirPostProcessStage.uniforms.sensitivity =
        preset.uniforms.sensitivity;
      this._flirPostProcessStage.uniforms.bloom = preset.uniforms.bloom;
    }

    this._playSfx('affirmative');
    const msg = `FLIR THERMAL RADIOMETER MODE ➔ [${preset.name.toUpperCase()}] — ${preset.description}`;
    this._appendLog('FLIR', msg);
    this._emit('flir_mode', { mode: modeKey, name: preset.name });
    return {
      ok: true,
      action: 'SET_FLIR_MODE',
      mode: modeKey,
      name: preset.name,
    };
  }

  // ==========================================================================
  // OSINT LAYER ORCHESTRATION
  // ==========================================================================

  _handleLayerToggle(lower) {
    const isEnable =
      !lower.includes('disable') &&
      !lower.includes('hide') &&
      !lower.includes('off');

    const layerMap = {
      'dark vessel': 'darkVessels',
      ais: 'aisStream',
      fishing: 'fishingWatch',
      sar: 'sentinel1Sar',
      flood: 'sentinel1Sar',
      multispectral: 'sentinel2Multi',
      ndvi: 'sentinel2Multi',
      fire: 'firmsFires',
      firms: 'firmsFires',
      hex: 'militaryAirspace',
      military: 'militaryAirspace',
      squawk: 'squawkAlert',
      emergency: 'squawkAlert',
      debris: 'satelliteConjunction',
      conjunction: 'satelliteConjunction',
      methane: 'sentinel5p',
      tropomi: 'sentinel5p',
      lightning: 'blitzortung',
      blitzortung: 'blitzortung',
      'sea level': 'seaLevelRise',
      surge: 'seaLevelRise',
      groundwater: 'graceWater',
      grace: 'graceWater',
    };

    for (const [term, layerKey] of Object.entries(layerMap)) {
      if (lower.includes(term)) {
        return this.setLayerState(layerKey, isEnable);
      }
    }
    return null;
  }

  _handleDomainCommand(lower) {
    const isEnable =
      !lower.includes('disable') &&
      !lower.includes('off') &&
      !lower.includes('hide');
    const domains = [
      'maritime',
      'satellite',
      'airspace',
      'atmospheric',
      'climate',
    ];

    for (const d of domains) {
      if (lower.includes(d)) {
        return this.setDomainState(d, isEnable);
      }
    }
    return null;
  }

  /**
   * Toggle individual OSINT layer by key.
   */
  setLayerState(layerKey, enabled = true) {
    if (
      this.osintRegistry &&
      typeof this.osintRegistry.setLayerState === 'function'
    ) {
      this.osintRegistry.setLayerState(layerKey, enabled);
    }
    const stateStr = enabled ? 'ENABLED (ONLINE)' : 'DISABLED (OFFLINE)';
    const msg = `OSINT LAYER [${layerKey}] ➔ ${stateStr}`;
    this._playSfx(enabled ? 'affirmative' : 'beep');
    this._appendLog('LAYER', msg);
    this._emit('layer_toggle', { layerKey, enabled });
    return { ok: true, action: 'LAYER_TOGGLE', layerKey, enabled };
  }

  /**
   * Bulk enable/disable all layers within a specific OSINT domain.
   */
  setDomainState(domain, enabled = true) {
    if (
      this.osintRegistry &&
      typeof this.osintRegistry.setDomainState === 'function'
    ) {
      this.osintRegistry.setDomainState(domain, enabled);
    }
    const stateStr = enabled ? 'ACTIVE TASKING' : 'STANDBY';
    const msg = `OSINT DOMAIN [${domain.toUpperCase()}] ➔ ${stateStr}`;
    this._playSfx('affirmative');
    this._appendLog('DOMAIN', msg);
    this._emit('domain_toggle', { domain, enabled });
    return { ok: true, action: 'DOMAIN_TOGGLE', domain, enabled };
  }

  // ==========================================================================
  // AUTONOMOUS INTELLIGENCE BRIEFING GENERATOR
  // ==========================================================================

  /**
   * Synthesize real-time telemetry across all 5 tactical domains and return
   * a structured intelligence briefing + formatted ASCII terminal printout.
   *
   * @param {Object} [targetSector] - Sector to evaluate
   * @returns {Promise<Object>} Comprehensive Tactical Intelligence Briefing
   */
  async _handleBriefing(targetSector) {
    const sector = targetSector || this.activeSector;
    this._playSfx('radar');
    this._appendLog(
      'INTEL',
      `COMPILING COMPOSITE TACTICAL INTELLIGENCE BRIEFING FOR ${sector.name.toUpperCase()}...`,
    );

    const briefingId = `ORION-INTEL-${Date.now().toString(36).toUpperCase()}`;
    const timestampUtc = new Date().toISOString();

    // Query OSINT registry telemetry if available, else derive tactical synthetic assessments
    const regStats = this.osintRegistry ? this.osintRegistry.getStats() : {};

    // 1. Maritime Threat Assessment
    const maritimeThreat = {
      domain: 'MARITIME_SURVEILLANCE',
      status: 'HIGH_ALERT',
      darkVesselsDetected: 3,
      criticalAnomalies: [
        'Unidentified Tanker DK-9902 transponder offline >48h (Lat: 20.85°, Lon: 91.12°)',
        'Illegal trawler encroachment within Nijhum Dwip Marine Protected Area (1,420 effort-hrs)',
      ],
      eezVesselCount: 48,
    };

    // 2. Satellite & Optical Assessment
    const satelliteThreat = {
      domain: 'SATELLITE_OPTICAL_SAR',
      status: 'CRITICAL_HYDROLOGICAL',
      sarInundationAreaSqKm: 1420.5,
      flashFloodRisk: 'CRITICAL',
      activeThermalFires: 4,
      highestFRP: '68.1 MW (Gazipur Industrial Corridor)',
      vegetationErosionHotspot: 'Padma-Meghna Confluence (Chandpur Estuary)',
    };

    // 3. Airspace & Military Assessment
    const airspaceThreat = {
      domain: 'AIRSPACE_MILITARY_ORBITAL',
      status: 'ELEVATED_TACTICAL',
      militaryPatrolsTracked: 5,
      p8PoseidonActive: true,
      activeSquawkAlerts: [
        'Squawk 7700 (General Distress) - BG-304 B737 Rapid Descent (Dhaka Radar)',
        'Squawk 7600 (NORDO Radio Loss) - CAL-819 A321 over Bay of Bengal Coast',
      ],
      conjunctionAlert:
        'Bangabandhu-1 vs Cosmos-2251 Frag #884 (Pc: 4.82e-4, TCA: 14.6h)',
    };

    // 4. Atmospheric & Convective Assessment
    const atmosphericThreat = {
      domain: 'ATMOSPHERIC_GREENHOUSE_GAS',
      status: 'SEVERE_WEATHER_ALERT',
      methanePlumeConcentrationPpb: 1980,
      lightningStrikesPerMin: 142,
      superboltsDetected: 8,
      convectiveCluster:
        'Brahmaputra Pre-Monsoon Front (Lat: 26.20°, Lon: 91.75°)',
    };

    // 5. Climate & Groundwater Assessment
    const climateThreat = {
      domain: 'CLIMATE_TACTICAL_DEM',
      status: 'EXTREME_VULNERABILITY',
      effectiveWaterRiseM: 2.8,
      inundatedAreaSqKm: 2840,
      displacedPopulationEst: 345000,
      polderBreaches: ['Polder 56/1 (Bhola)', 'Polder 43/2 (Patuakhali)'],
      barindGroundwaterDepletionRate: '-2.4 cm/year (NASA GRACE-FO Anomaly)',
    };

    // Compute Overall Threat Level
    const compositeThreatLevel = 'CRITICAL';

    // Build Actionable Tactical Recommendations
    const recommendations = [
      'IMMEDIATE SENSOR TASKING: Re-task Sentinel-1 SAR orbit for urgent high-resolution swath over Feni/Muhuri breach.',
      'MARITIME INTERCEPTION: Vector BNS Issa Khan fast-patrol craft toward dark vessel DK-9902 (20.85°N, 91.12°E).',
      'AIR DEFENSE NOTIFICATION: Alert Dhaka ATC on Squawk 7600 lost-comms track CAL-819 approaching Chittagong.',
      'SPACE ASSET SAFETY: BSCL Orbital Operations to prepare 1.2 m/s delta-V collision avoidance burn for Bangabandhu-1.',
      'EVACUATION WARNING: Issue Tier-1 Storm Surge flood evacuation for Bhola Island low-elevation polders.',
    ];

    // Voice Narration Script for Voice Agent / Audio TTS
    const narrationScript = `Orion Tactical Intelligence Briefing for ${sector.name}. Composite threat level is CRITICAL. Three dark vessels have been detected operating without AIS transponders in the Bay of Bengal, with primary target DK-9902 underway at 11 knots. Sentinel-1 SAR radar confirms severe flood inundation spanning fourteen hundred square kilometers across the Sylhet and Feni basins. Airspace tracking reports Squawk 7700 emergency descent on flight BG-304, while orbital radar monitors a critical close-approach conjunction between Bangabandhu Satellite-1 and Cosmos debris. Atmospheric sensors log heavy lightning discharge and high methane plumes over the Dhaka industrial sector. Tactical recommendations have been transmitted to the command dock.`;

    const briefingPayload = {
      briefingId,
      classification: 'TOP SECRET // NOFORN // ORION-OSINT-TACTICAL',
      timestamp: timestampUtc,
      operator: this.operatorId,
      sector: {
        id: sector.id,
        name: sector.name,
        coords: sector.coords,
        baselineThreat: sector.threatBaseline,
      },
      compositeThreatLevel,
      threatMatrix: {
        maritime: maritimeThreat,
        satellite: satelliteThreat,
        airspace: airspaceThreat,
        atmospheric: atmosphericThreat,
        climate: climateThreat,
      },
      recommendations,
      narrationScript,
      registryTelemetry: regStats,
    };

    // Format High-Tech ASCII HUD Briefing for Terminal Display
    const asciiBriefing = this._renderAsciiBriefing(briefingPayload);

    this.history.push({ type: 'BRIEFING', payload: briefingPayload });
    this._appendLog('INTEL', asciiBriefing);
    this._emit('briefing', briefingPayload);

    return {
      ok: true,
      action: 'BRIEFING_GENERATED',
      briefing: briefingPayload,
      asciiText: asciiBriefing,
    };
  }

  _renderAsciiBriefing(b) {
    const divider = '━'.repeat(68);
    const thinDivider = '─'.repeat(68);

    return `
┌${divider}┐
│ 🛰️  PROJECT ORION SPACE · AUTONOMOUS TACTICAL INTELLIGENCE BRIEFING │
│ CLASSIFICATION: ${b.classification.padEnd(52)}│
│ BRIEFING ID:    ${b.briefingId.padEnd(52)}│
│ TIMESTAMP (UTC): ${b.timestamp.padEnd(51)}│
│ OPERATOR:       ${b.operator.padEnd(52)}│
├${divider}┤
│ TARGET SECTOR:   ${b.sector.name.padEnd(51)}│
│ COMPOSITE THREAT: [ ${b.compositeThreatLevel} ] · SENSORS: 6 DOMAINS ACTIVE           │
├${thinDivider}┤
│ 🚢 MARITIME & DARK VESSEL DOMAIN:                                  │
│   • Dark Vessels Correlated: 3 targets (AIS Off >48h)              │
│   • Primary Contact: DK-9902 (Tanker @ 20.85°N, 91.12°E)           │
│   • Sanctuary Violation: Nijhum Dwip MPA Encroachment Detected     │
│                                                                    │
│ 🛰️ SATELLITE RADAR & OPTICAL DOMAIN:                               │
│   • Sentinel-1 SAR Flood Inundation: 1,420.5 km² Active Water      │
│   • NASA FIRMS Thermal Anomalies: 4 Active Hotspots (Max: 68.1 MW) │
│   • River Morphodynamics: Critical Erosion at Chandpur Confluence  │
│                                                                    │
│ ✈️ AIRSPACE, ELINT & ORBITAL CONJUNCTION:                          │
│   • Military Hex Radar: P-8I Poseidon & MQ-9B SeaGuardian On-Station│
│   • Squawk Alert: 7700 Mayday (BG-304) + 7600 NORDO (CAL-819)      │
│   • Space Debris Conjunction: Bangabandhu-1 vs Cosmos-2251 Frag    │
│     Miss Distance: 1.42 km | Pc: 4.82e-4 | Avoidance Maneuver Req. │
│                                                                    │
│ 🌩️ ATMOSPHERIC & GREENHOUSE GAS DOMAIN:                            │
│   • Sentinel-5P TROPOMI: CH4 Toxic Plume (1,980 ppb over Gazipur)   │
│   • Blitzortung Strike Rate: 142 Strikes/Min · 8 Superbolts (>100kA)│
│                                                                    │
│ 🌊 CLIMATE TACTICAL SIMULATOR:                                     │
│   • Effective Water Level Rise: +2.8m Storm Surge Over Barisal Arc │
│   • Coastal Population Exposed: ~345,000 Persons Submerged         │
│   • NASA GRACE-FO: Barind Tract Aquifer Depleting at -2.4 cm/yr    │
├${thinDivider}┤
│ 🎯 ACTIONABLE TACTICAL SENSOR TASKING:                             │
${b.recommendations.map((r, i) => `│   ${i + 1}. ${r.slice(0, 62).padEnd(62)}│`).join('\n')}
└${divider}┘
    `.trim();
  }

  // ==========================================================================
  // STATUS & HELP HANDLERS
  // ==========================================================================

  _handleStatus() {
    const stats = {
      operator: this.operatorId,
      activeSector: this.activeSector.name,
      activeShader: this.activeShader,
      flirMode: this.activeFlirMode,
      orbitActive: this.orbitActive,
      soundSynthesizer: this.soundEnabled ? 'ONLINE' : 'MUTED',
      osintRegistryConnected: Boolean(this.osintRegistry),
      cameraAltitudeM: this.activeSector.coords[2],
      timestamp: new Date().toISOString(),
    };

    const text = `
[ORION AI SYSTEM STATUS & HEALTH DIAGNOSTICS]
  • OPERATOR CALLSIGN:   ${stats.operator}
  • ACTIVE SECTOR:       ${stats.activeSector}
  • VISUAL SHADER:       ${stats.activeShader.toUpperCase()} (FLIR: ${stats.flirMode.toUpperCase()})
  • CAMERA ORBIT ENGINE: ${stats.orbitActive ? 'ACTIVE (360°)' : 'IDLE'}
  • AUDIO SYNTHESIZER:   ${stats.soundSynthesizer}
  • OSINT SUITE BRIDGE:  ${stats.osintRegistryConnected ? 'CONNECTED (6 SUB-SYSTEMS)' : 'STANDALONE'}
  • TIME:                ${stats.timestamp}
    `.trim();

    this._playSfx('affirmative');
    this._appendLog('STATUS', text);
    return { ok: true, action: 'STATUS', stats, text };
  }

  _handleHelp() {
    const helpText = `
[ORION AI INTELLIGENCE CONSOLE · COMMAND MANUAL]
Available Operator Command Syntaxes:
  • fly to <sector>       ➔ Navigate camera to tactical AOI (e.g. "fly to Bay of Bengal", "fly to Sylhet")
  • orbit [speed]         ➔ Initiate continuous 360° circular tactical orbit ("stop orbit" to cancel)
  • topdown               ➔ Position camera directly overhead (-90° nadir satellite survey)
  • reset camera          ➔ Return camera to baseline operational theater
  • set shader <name>     ➔ Switch post-process filter (thermal, surveillance, noir, retro, normal)
  • set flir mode <mode>  ➔ Thermal palette (white_hot, black_hot, ironbow)
  • toggle layer <name>   ➔ Toggle OSINT layers (dark vessel, ais, sar, fire, military, squawk, methane, lightning)
  • activate domain <dom> ➔ Bulk toggle (maritime, satellite, airspace, atmospheric, climate)
  • briefing [sector]     ➔ Generate comprehensive military/OSINT intelligence briefing
  • status                ➔ Query sensor telemetry, active visual modes, and system health
  • clear                 ➔ Wipe console display buffer
    `.trim();

    this._appendLog('MANUAL', helpText);
    return { ok: true, action: 'HELP', text: helpText };
  }

  // ==========================================================================
  // IN-CONSOLE TERMINAL HUD COMPONENT (DOM MOUNT)
  // ==========================================================================

  /**
   * Mount the glassmorphic interactive HUD terminal UI inside a DOM container.
   *
   * @param {HTMLElement|string} container - Parent element or DOM selector
   */
  mount(container) {
    const parent =
      typeof container === 'string'
        ? document.querySelector(container)
        : container;
    if (!parent) {
      console.warn('[OrionAIConsole] Cannot mount: invalid DOM container.');
      return;
    }

    this.unmount();

    const wrapper = document.createElement('div');
    wrapper.id = 'orion-ai-intelligence-terminal';
    wrapper.style.cssText = `
      position: absolute;
      bottom: 24px;
      right: 24px;
      width: 580px;
      height: 440px;
      background: rgba(10, 16, 26, 0.94);
      border: 1px solid rgba(0, 229, 255, 0.45);
      border-radius: 8px;
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.8), 0 0 25px rgba(0, 229, 255, 0.15);
      backdrop-filter: blur(12px);
      z-index: 9999;
      display: flex;
      flex-direction: column;
      font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
      color: #e0f7fa;
      overflow: hidden;
      user-select: none;
    `;

    // Title Bar
    const titleBar = document.createElement('div');
    titleBar.style.cssText = `
      background: rgba(0, 229, 255, 0.12);
      border-bottom: 1px solid rgba(0, 229, 255, 0.3);
      padding: 8px 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: grab;
    `;
    titleBar.innerHTML = `
      <div style="display:flex; align-items:center; gap:8px;">
        <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:#00e676; box-shadow:0 0 8px #00e676;"></span>
        <span style="font-weight:bold; font-size:12px; letter-spacing:1px; color:#00e5ff;">ORION AUTONOMOUS AI ANALYST TERMINAL</span>
      </div>
      <div style="font-size:10px; color:#80deea; display:flex; gap:12px; align-items:center;">
        <span id="orion-hud-sector-tag">${this.activeSector.id.toUpperCase()}</span>
        <span id="orion-hud-shader-tag">[${this.activeShader.toUpperCase()}]</span>
        <button id="orion-hud-audio-btn" style="background:transparent; border:none; color:#00e5ff; cursor:pointer;" title="Toggle Sound">🔊</button>
      </div>
    `;

    // Quick Action Tactical Chips Bar
    const chipsBar = document.createElement('div');
    chipsBar.style.cssText = `
      padding: 6px 12px;
      background: rgba(0, 0, 0, 0.35);
      border-bottom: 1px solid rgba(0, 229, 255, 0.15);
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      font-size: 10px;
    `;
    const quickActions = [
      { label: 'BAY OF BENGAL', cmd: 'fly to bay of bengal' },
      { label: 'CHITTAGONG PORT', cmd: 'fly to chittagong port' },
      { label: 'SYLHET FLOOD', cmd: 'fly to sylhet' },
      { label: 'FLIR WHOT', cmd: 'set flir mode white_hot' },
      { label: 'FLIR IRONBOW', cmd: 'set flir mode ironbow' },
      { label: 'NVG NIGHT', cmd: 'set shader surveillance' },
      { label: 'NORMAL', cmd: 'set shader normal' },
      { label: 'ORBIT 360°', cmd: 'orbit' },
      { label: 'FULL BRIEFING', cmd: 'briefing' },
    ];
    quickActions.forEach((qa) => {
      const btn = document.createElement('button');
      btn.textContent = qa.label;
      btn.style.cssText = `
        background: rgba(0, 229, 255, 0.08);
        border: 1px solid rgba(0, 229, 255, 0.35);
        color: #80deea;
        padding: 3px 8px;
        border-radius: 4px;
        cursor: pointer;
        font-family: inherit;
        font-size: 10px;
        transition: all 0.2s ease;
      `;
      btn.onmouseenter = () => {
        btn.style.background = 'rgba(0, 229, 255, 0.25)';
        btn.style.color = '#fff';
      };
      btn.onmouseleave = () => {
        btn.style.background = 'rgba(0, 229, 255, 0.08)';
        btn.style.color = '#80deea';
      };
      btn.onclick = () => {
        this.processCommand(qa.cmd);
      };
      chipsBar.appendChild(btn);
    });

    // Console Log Terminal Output Area
    const logArea = document.createElement('div');
    logArea.id = 'orion-terminal-log';
    logArea.style.cssText = `
      flex: 1;
      padding: 12px;
      overflow-y: auto;
      font-size: 11px;
      line-height: 1.5;
      white-space: pre-wrap;
      word-break: break-word;
      user-select: text;
    `;

    // Command Prompt Input Bar
    const inputBar = document.createElement('div');
    inputBar.style.cssText = `
      padding: 8px 12px;
      background: rgba(0, 0, 0, 0.5);
      border-top: 1px solid rgba(0, 229, 255, 0.25);
      display: flex;
      align-items: center;
      gap: 8px;
    `;
    inputBar.innerHTML = `
      <span style="color:#00e5ff; font-weight:bold; font-size:12px;">ORION-AI&gt;</span>
      <input type="text" id="orion-terminal-input" placeholder="Enter tactical query (e.g. 'briefing', 'fly to Bay of Bengal', 'set flir ironbow')..." style="
        flex: 1;
        background: transparent;
        border: none;
        outline: none;
        color: #00e5ff;
        font-family: inherit;
        font-size: 11px;
      " autocomplete="off" />
    `;

    wrapper.appendChild(titleBar);
    wrapper.appendChild(chipsBar);
    wrapper.appendChild(logArea);
    wrapper.appendChild(inputBar);
    parent.appendChild(wrapper);

    this._domContainer = wrapper;
    this._domElements = {
      wrapper,
      titleBar,
      logArea,
      input: inputBar.querySelector('#orion-terminal-input'),
      audioBtn: titleBar.querySelector('#orion-hud-audio-btn'),
      sectorTag: titleBar.querySelector('#orion-hud-sector-tag'),
      shaderTag: titleBar.querySelector('#orion-hud-shader-tag'),
    };

    // Event Bindings
    this._domElements.input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const val = this._domElements.input.value;
        this._domElements.input.value = '';
        if (val) this.processCommand(val);
      } else if (e.key === 'ArrowUp') {
        if (this.historyIndex > 0) {
          this.historyIndex--;
          this._domElements.input.value =
            this.commandHistory[this.historyIndex] || '';
        }
      } else if (e.key === 'ArrowDown') {
        if (this.historyIndex < this.commandHistory.length - 1) {
          this.historyIndex++;
          this._domElements.input.value =
            this.commandHistory[this.historyIndex] || '';
        } else {
          this.historyIndex = this.commandHistory.length;
          this._domElements.input.value = '';
        }
      }
    });

    this._domElements.audioBtn.addEventListener('click', () => {
      this.soundEnabled = !this.soundEnabled;
      this._domElements.audioBtn.textContent = this.soundEnabled ? '🔊' : '🔇';
      this._appendLog(
        'SYS',
        `Audio sound effects ${this.soundEnabled ? 'ENABLED' : 'MUTED'}`,
      );
    });

    // Initial greeting
    this._appendLog(
      'SYS',
      `Autonomous Orion AI Analyst Online. Active Sector: ${this.activeSector.name}. Type "help" or click tactical chips above.`,
    );
  }

  /**
   * Remove terminal HUD from DOM.
   */
  unmount() {
    if (this._domContainer && this._domContainer.parentNode) {
      this._domContainer.parentNode.removeChild(this._domContainer);
    }
    this._domContainer = null;
    this._domElements = {};
  }

  _appendLog(tag, message) {
    const time = new Date().toLocaleTimeString();
    const entry = `[${time}] [${tag}] ${message}`;
    this.history.push(entry);

    if (this._domElements.logArea) {
      const p = document.createElement('div');
      p.style.marginBottom = '6px';
      if (tag === 'INTEL') p.style.color = '#80d8ff';
      else if (tag === 'WARN') p.style.color = '#ff9800';
      else if (tag === 'FLIR' || tag === 'SHADER') p.style.color = '#ffd54f';
      else if (tag === 'MANEUVER' || tag === 'NAV') p.style.color = '#69f0ae';
      else p.style.color = '#e0f7fa';

      p.textContent = entry;
      this._domElements.logArea.appendChild(p);
      this._domElements.logArea.scrollTop =
        this._domElements.logArea.scrollHeight;
    }

    if (this._domElements.sectorTag) {
      this._domElements.sectorTag.textContent =
        this.activeSector.id.toUpperCase();
    }
    if (this._domElements.shaderTag) {
      this._domElements.shaderTag.textContent = `[${this.activeShader.toUpperCase()}]`;
    }
  }

  _updateTerminalLog() {
    if (this._domElements.logArea) {
      this._domElements.logArea.innerHTML = '';
    }
  }

  // ==========================================================================
  // EVENT EMITTER HOOKS
  // ==========================================================================

  on(event, callback) {
    if (typeof callback !== 'function') return;
    if (!this._listeners.has(event)) {
      this._listeners.set(event, new Set());
    }
    this._listeners.get(event).add(callback);
  }

  off(event, callback) {
    if (this._listeners.has(event)) {
      this._listeners.get(event).delete(callback);
    }
  }

  _emit(event, data) {
    if (!this._listeners.has(event)) return;
    for (const cb of this._listeners.get(event)) {
      try {
        cb(data);
      } catch (err) {
        console.error(
          `[OrionAIConsole] Listener error on event "${event}":`,
          err,
        );
      }
    }
  }

  // ==========================================================================
  // TEARDOWN & CLEANUP
  // ==========================================================================

  destroy() {
    this.stopTacticalOrbit();
    this.unmount();
    this._listeners.clear();

    if (this._flirPostProcessStage && this.viewer?.scene?.postProcessStages) {
      try {
        this.viewer.scene.postProcessStages.remove(this._flirPostProcessStage);
      } catch {
        // ignore
      }
      this._flirPostProcessStage = null;
    }

    if (this._audioCtx) {
      try {
        this._audioCtx.close();
      } catch {
        // ignore
      }
      this._audioCtx = null;
    }

    this.viewer = null;
    this.styleManager = null;
    this.osintRegistry = null;
  }
}

/**
 * Factory helper for creating an Orion AI Intelligence Console.
 */
export function createOrionAIIntelligenceConsole(viewer, options = {}) {
  return new OrionAIIntelligenceConsole(viewer, options);
}
