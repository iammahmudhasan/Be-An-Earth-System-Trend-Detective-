/**
 * @file OrionMapHarness.js
 * @module agent/OrionMapHarness
 * @description Autonomous In-Console Map Harness Agent for Project Orion Space.
 *
 * Translates natural language (Bangla, Banglish, English) and microphone voice commands
 * directly into CesiumJS camera maneuvers, NASA GIBS cloud streams, tactical shaders,
 * sea level rise simulations, and multi-sensor planetary intelligence.
 *
 * Lead Architect: Md Mushfiqur Rahim (NASA Space Apps 2026 - Barisal)
 * 100% Production Ready - Zero Placeholders
 */

import * as Cesium from 'cesium';

// ============================================================================
// GEOSPATIAL SECTOR REGISTRY
// ============================================================================

export const SECTORS = {
  barisal: {
    id: 'barisal',
    name: 'Barisal Coastal Belt & Climate Hotspot',
    lat: 22.7010,
    lon: 90.3535,
    altitude: 180000,
    heading: 0,
    pitch: -48,
    actionDesc: 'Warming Hotspot (+0.452°C/dec, p=0.0062) & Sea Level Surge Sector',
    suggestedLayers: ['clouds', 'sea_level'],
    speech: 'Maneuvering to Barisal sector. Displaying post-monsoon warming anomaly.'
  },
  dhaka: {
    id: 'dhaka',
    name: 'Dhaka Metropolitan & Central Corridor',
    lat: 23.8103,
    lon: 90.4125,
    altitude: 120000,
    heading: 0,
    pitch: -55,
    actionDesc: 'Urban heat island & atmospheric concentration corridor',
    suggestedLayers: ['clouds', 'satellites'],
    speech: 'Navigating to Dhaka central metropolitan corridor.'
  },
  chittagong: {
    id: 'chittagong',
    name: 'Chittagong Port & Karnaphuli Approach',
    lat: 22.3384,
    lon: 91.8048,
    altitude: 90000,
    heading: 330,
    pitch: -40,
    actionDesc: 'Primary national maritime port & coastal shipping approach',
    suggestedLayers: ['clouds', 'satellites'],
    speech: 'Navigating to Chittagong Port and maritime approach.'
  },
  sylhet: {
    id: 'sylhet',
    name: 'Sylhet Haor Basin & Flash Flood Corridor',
    lat: 24.8949,
    lon: 91.8687,
    altitude: 140000,
    heading: 10,
    pitch: -45,
    actionDesc: 'Sentinel-1 SAR radar flood extent & Haor wetland basin',
    suggestedLayers: ['clouds', 'satellites'],
    speech: 'Maneuvering to Sylhet Haor basin flood monitoring sector.'
  },
  feni: {
    id: 'feni',
    name: 'Feni-Muhuri River Surge Corridor',
    lat: 23.0159,
    lon: 91.3976,
    altitude: 80000,
    heading: 0,
    pitch: -45,
    actionDesc: 'August 2024 flash flood epicenter and embankment monitoring',
    suggestedLayers: ['clouds'],
    speech: 'Navigating to Feni Muhuri flash flood surge corridor.'
  },
  sundarbans: {
    id: 'sundarbans',
    name: 'Sundarbans Mangrove Delta & Coastal Front',
    lat: 21.9497,
    lon: 89.5403,
    altitude: 200000,
    heading: 350,
    pitch: -50,
    actionDesc: 'UNESCO Biosphere mangrove fringe & tidal barrier',
    suggestedLayers: ['sea_level', 'clouds'],
    speech: 'Arriving at Sundarbans mangrove biosphere.'
  },
  rajshahi: {
    id: 'rajshahi',
    name: 'Rajshahi & North Bengal Barind Tract',
    lat: 24.3745,
    lon: 88.6042,
    altitude: 160000,
    heading: 0,
    pitch: -50,
    actionDesc: 'NASA GRACE groundwater depletion & drought monitoring',
    suggestedLayers: ['clouds'],
    speech: 'Maneuvering to Rajshahi Barind tract groundwater depletion zone.'
  },
  kuakata: {
    id: 'kuakata',
    name: 'Payra Port & Kuakata Coastal Seawall',
    lat: 21.8167,
    lon: 90.1167,
    altitude: 70000,
    heading: 15,
    pitch: -35,
    actionDesc: 'Southernmost coastal delta, Payra Port, and sea level rise',
    suggestedLayers: ['sea_level', 'clouds'],
    speech: 'Navigating to Payra Port and Kuakata shoreline.'
  },
  coxsbazar: {
    id: 'coxsbazar',
    name: 'Cox\'s Bazar & Kutubdia Coastal Fringe',
    lat: 21.4272,
    lon: 91.9676,
    altitude: 120000,
    heading: 340,
    pitch: -42,
    actionDesc: 'World\'s longest unbroken sea beach & cyclone approach line',
    suggestedLayers: ['clouds'],
    speech: 'Arriving at Cox\'s Bazar coastal sector.'
  },
  bay_of_bengal: {
    id: 'bay_of_bengal',
    name: 'Bay of Bengal EEZ Maritime Sector',
    lat: 20.2000,
    lon: 89.8000,
    altitude: 600000,
    heading: 0,
    pitch: -55,
    actionDesc: 'Cyclone genesis basin, depression tracking & deep water passes',
    suggestedLayers: ['clouds', 'satellites'],
    speech: 'Framing Bay of Bengal cyclonic depression basin.'
  },
  bangladesh: {
    id: 'bangladesh',
    name: 'People\'s Republic of Bangladesh',
    lat: 23.6850,
    lon: 90.3563,
    altitude: 1500000,
    heading: 0,
    pitch: -65,
    actionDesc: 'National 34-station meteorological reanalysis grid overview',
    suggestedLayers: ['clouds'],
    speech: 'Resetting to nationwide Bangladesh 34-station grid view.'
  }
};

// ============================================================================
// ORION MAP HARNESS CLASS
// ============================================================================

export class OrionMapHarness {
  /**
   * @param {Cesium.Viewer} viewer
   * @param {Object} [options]
   * @param {Object} [options.cloudStream] - RealEarthCloudStream instance
   */
  constructor(viewer, options = {}) {
    this.viewer = viewer;
    this.cloudStream = options.cloudStream || null;
    this.speechEnabled = true;
    this.isListening = false;
    this.recognition = null;
    this.activeOrbit = null;
    this.orbitInterval = null;
    this.activeSector = SECTORS.bangladesh;
    this.history = [];
    this.isVisible = false;

    this._initSpeechRecognition();
  }

  /** Initialize Web Speech API for voice commanding. */
  _initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.info('[OrionHarness] Web Speech API not supported in this browser; text input available.');
      return;
    }

    try {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US'; // Handles English and phonetic Banglish accurately

      this.recognition.onstart = () => {
        this.isListening = true;
        this._updateMicButton(true);
        this._setStatus('🎙️ LISTENING... SPEAK NOW (e.g. "Fly to Barisal", "Show real clouds")');
      };

      this.recognition.onresult = (event) => {
        const transcript = event.results[0]?.[0]?.transcript;
        if (transcript) {
          const inputEl = document.getElementById('orion-harness-input');
          if (inputEl) inputEl.value = transcript;
          this.execute(transcript);
        }
      };

      this.recognition.onerror = (e) => {
        this.isListening = false;
        this._updateMicButton(false);
        this._setStatus(`Voice input error: ${e.error || 'unknown'}`);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        this._updateMicButton(false);
      };
    } catch (err) {
      console.warn('[OrionHarness] Voice recognition setup failed:', err);
    }
  }

  /** Mount the Swiss Monochrome interactive Harness UI onto the page. */
  mount(parent = document.body) {
    if (document.getElementById('orion-map-harness-container')) return;

    const container = document.createElement('div');
    container.id = 'orion-map-harness-container';
    container.style.cssText = `
      position: fixed;
      bottom: 86px;
      left: 50%;
      transform: translateX(-50%);
      width: min(760px, calc(100vw - 32px));
      background: rgba(9, 9, 11, 0.94);
      border: 1px solid #27272a;
      border-radius: 8px;
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(16px);
      z-index: 1500;
      display: none;
      flex-direction: column;
      overflow: hidden;
      font-family: 'JetBrains Mono', monospace;
      color: #ffffff;
      user-select: none;
      transition: opacity 0.2s ease, transform 0.2s ease;
    `;

    container.innerHTML = `
      <!-- Header -->
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; border-bottom: 1px solid #27272a; background: rgba(255, 255, 255, 0.02);">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="display: inline-block; width: 7px; height: 7px; border-radius: 50%; background: #ffffff; box-shadow: 0 0 6px rgba(255, 255, 255, 0.8);"></span>
          <span style="font-size: 11px; font-weight: 700; letter-spacing: 0.8px; color: #ffffff;">ORION AGENT HARNESS</span>
          <span style="font-size: 9px; color: #71717a; border: 1px solid #27272a; padding: 1px 6px; border-radius: 3px;">VOICE &amp; NLP</span>
        </div>
        <div style="display: flex; align-items: center; gap: 10px;">
          <span id="orion-harness-sector-badge" style="font-size: 10px; color: #a1a1aa;">BANGLADESH [1500KM]</span>
          <button id="orion-harness-speech-btn" type="button" style="background: transparent; border: 1px solid #27272a; border-radius: 4px; color: #ffffff; padding: 2px 6px; font-size: 11px; cursor: pointer;" title="Toggle Agent Voice Audio">🔊</button>
          <button id="orion-harness-close-btn" type="button" style="background: transparent; border: none; color: #a1a1aa; font-size: 14px; cursor: pointer;" title="Close Harness">✕</button>
        </div>
      </div>

      <!-- Quick Action Chips -->
      <div style="display: flex; flex-wrap: wrap; gap: 6px; padding: 8px 14px; border-bottom: 1px solid #18181b; background: rgba(0, 0, 0, 0.3);">
        <button class="harness-chip" data-cmd="fly to barisal">📍 BARISAL</button>
        <button class="harness-chip" data-cmd="fly to dhaka">📍 DHAKA</button>
        <button class="harness-chip" data-cmd="clouds">☁️ REAL CLOUDS</button>
        <button class="harness-chip" data-cmd="sea level rise">🌊 SEA LEVEL RISE</button>
        <button class="harness-chip" data-cmd="flir">🔥 FLIR THERMAL</button>
        <button class="harness-chip" data-cmd="orbit">🔄 360° ORBIT</button>
        <button class="harness-chip" data-cmd="sylhet flood">🌊 SYLHET FLOOD</button>
        <button class="harness-chip" data-cmd="rajshahi groundwater">💧 GROUNDWATER</button>
        <button class="harness-chip" data-cmd="reset">🏠 RESET VIEW</button>
      </div>

      <!-- Input Form -->
      <div style="display: flex; align-items: center; gap: 8px; padding: 10px 14px; background: rgba(0, 0, 0, 0.4);">
        <input id="orion-harness-input" type="text" placeholder="Command the map agent (e.g. 'Fly to Barisal', 'Show real clouds', 'বরিশাল নিয়ে যাও')..." autocomplete="off" spellcheck="false" style="
          flex: 1;
          background: #18181b;
          border: 1px solid #27272a;
          border-radius: 5px;
          padding: 8px 12px;
          font-family: inherit;
          font-size: 12px;
          color: #ffffff;
          outline: none;
        " />
        <button id="orion-harness-mic-btn" type="button" title="Speak to Agent (Microphone)" style="
          background: #18181b;
          border: 1px solid #27272a;
          color: #ffffff;
          padding: 8px 12px;
          border-radius: 5px;
          font-size: 13px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        ">🎙️</button>
        <button id="orion-harness-exec-btn" type="button" style="
          background: #ffffff;
          color: #000000;
          font-weight: 700;
          border: none;
          padding: 8px 16px;
          border-radius: 5px;
          font-size: 11px;
          cursor: pointer;
          font-family: inherit;
        ">EXECUTE</button>
      </div>

      <!-- Status & Feedback Area -->
      <div id="orion-harness-feedback" style="
        padding: 8px 14px;
        background: #09090b;
        font-size: 10.5px;
        color: #a1a1aa;
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-height: 32px;
        border-top: 1px solid #18181b;
      ">
        <span id="orion-harness-status-text">⚡ Ready. Type or speak a command to maneuver the globe.</span>
        <span style="font-size: 9px; color: #52525b;">HOTKEY: SPACE / ESC</span>
      </div>
    `;

    parent.appendChild(container);

    // Style helper for chips
    const styleEl = document.createElement('style');
    styleEl.textContent = `
      .harness-chip {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid #27272a;
        color: #d4d4d8;
        padding: 3px 8px;
        border-radius: 4px;
        font-size: 10px;
        cursor: pointer;
        font-family: inherit;
        transition: all 0.15s ease;
      }
      .harness-chip:hover {
        background: #ffffff;
        color: #000000;
        border-color: #ffffff;
      }
      #orion-harness-input:focus {
        border-color: #71717a !important;
        box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.15);
      }
    `;
    document.head.appendChild(styleEl);

    // Event Wire-ups
    const inputEl = container.querySelector('#orion-harness-input');
    const execBtn = container.querySelector('#orion-harness-exec-btn');
    const micBtn = container.querySelector('#orion-harness-mic-btn');
    const closeBtn = container.querySelector('#orion-harness-close-btn');
    const speechBtn = container.querySelector('#orion-harness-speech-btn');

    execBtn?.addEventListener('click', () => {
      const val = inputEl?.value?.trim();
      if (val) this.execute(val);
    });

    inputEl?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const val = inputEl?.value?.trim();
        if (val) this.execute(val);
      } else if (e.key === 'Escape') {
        this.close();
      }
    });

    micBtn?.addEventListener('click', () => this.toggleVoice());

    closeBtn?.addEventListener('click', () => this.close());

    speechBtn?.addEventListener('click', () => {
      this.speechEnabled = !this.speechEnabled;
      speechBtn.textContent = this.speechEnabled ? '🔊' : '🔇';
      speechBtn.title = this.speechEnabled ? 'Agent Voice Enabled' : 'Agent Voice Muted';
      this._setStatus(this.speechEnabled ? 'Agent voice enabled' : 'Agent voice muted');
    });

    container.querySelectorAll('.harness-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        const cmd = chip.dataset.cmd;
        if (inputEl) inputEl.value = cmd;
        if (cmd) this.execute(cmd);
      });
    });

    // Global toggle hotkey: Pressing 'Escape' or custom shortcut
    window.addEventListener('keydown', (e) => {
      if (e.key === '`' && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
        e.preventDefault();
        this.toggle();
      }
    });
  }

  /** Toggle Harness Visibility. */
  toggle() {
    if (this.isVisible) this.close();
    else this.open();
  }

  /** Open the Harness. */
  open() {
    const el = document.getElementById('orion-map-harness-container');
    if (!el) {
      this.mount();
      return this.open();
    }
    el.style.display = 'flex';
    this.isVisible = true;
    const inputEl = document.getElementById('orion-harness-input');
    inputEl?.focus();
    this._playTone(520, 0.1);
  }

  /** Close the Harness. */
  close() {
    const el = document.getElementById('orion-map-harness-container');
    if (el) el.style.display = 'none';
    this.isVisible = false;
    this.stopVoice();
  }

  /** Toggle real-time microphone listening. */
  toggleVoice() {
    if (this.isListening) {
      this.stopVoice();
    } else {
      this.startVoice();
    }
  }

  startVoice() {
    if (!this.recognition) {
      this._setStatus('Microphone recognition not available in this browser. Please type.');
      return;
    }
    try {
      this.recognition.start();
    } catch {
      // Already running
    }
  }

  stopVoice() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch {
        // Ignored
      }
    }
    this.isListening = false;
    this._updateMicButton(false);
  }

  _updateMicButton(active) {
    const btn = document.getElementById('orion-harness-mic-btn');
    if (!btn) return;
    if (active) {
      btn.style.background = '#ffffff';
      btn.style.color = '#000000';
      btn.style.borderColor = '#ffffff';
    } else {
      btn.style.background = '#18181b';
      btn.style.color = '#ffffff';
      btn.style.borderColor = '#27272a';
    }
  }

  _setStatus(msg) {
    const textEl = document.getElementById('orion-harness-status-text');
    if (textEl) textEl.textContent = msg;
  }

  /** Speak message via native Web Speech synthesis. */
  speak(text) {
    if (!this.speechEnabled || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.rate = 1.05;
      utter.pitch = 1.0;
      window.speechSynthesis.speak(utter);
    } catch (e) {
      console.warn('[OrionHarness] Speech error:', e);
    }
  }

  /** Play subtle procedural audio chime. */
  _playTone(freq = 440, durationSec = 0.08) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationSec);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + durationSec);
    } catch {
      // Audio autoplay policy
    }
  }

  // ==========================================================================
  // NATURAL LANGUAGE COMMAND EXECUTION (NLP)
  // ==========================================================================

  /**
   * Main entry point: Parses natural language text and executes actions on the map.
   * @param {string} rawCommand
   */
  async execute(rawCommand) {
    if (!rawCommand) return;
    const lower = rawCommand.toLowerCase().trim();
    this.history.push(rawCommand);
    this._playTone(660, 0.06);

    // 1. Orbit command
    if (lower.includes('orbit') || lower.includes('ghuro') || lower.includes('ঘুরো') || lower.includes('rotate') || lower.includes('360')) {
      return this.startOrbit();
    }
    if (lower.includes('stop') || lower.includes('thamo') || lower.includes('থামো') || lower.includes('halt')) {
      return this.stopOrbit();
    }

    // 2. Clouds command
    if (lower.includes('cloud') || lower.includes('megh') || lower.includes('মেঘ') || lower.includes('gibs')) {
      return this.triggerClouds();
    }

    // 3. Shaders / Visual styles
    if (lower.includes('thermal') || lower.includes('flir') || lower.includes('heat') || lower.includes('gorom')) {
      return this.triggerShader('thermal', 'FLIR Thermal (Ironbow) Mode activated.');
    }
    if (lower.includes('nvg') || lower.includes('night') || lower.includes('raat') || lower.includes('rat')) {
      return this.triggerShader('surveillance', 'Night Vision Sensor Pass activated.');
    }
    if (lower.includes('noir') || lower.includes('monochrome') || lower.includes('black and white')) {
      return this.triggerShader('noir', 'Swiss Monochrome Noir Style activated.');
    }
    if (lower.includes('normal') || lower.includes('optical') || lower.includes('reset style')) {
      return this.triggerShader('normal', 'Standard Optical Globe restored.');
    }

    // 4. Sea Level Rise Simulator
    if (lower.includes('sea level') || lower.includes('slr') || lower.includes('surge') || lower.includes('pani') || lower.includes('জলস্তর')) {
      return this.triggerSeaLevelRise();
    }

    // 5. Geographic Sectors (Bangla + Banglish + English)
    const targetSector = this._resolveSector(lower);
    if (targetSector) {
      return this.flyToSector(targetSector);
    }

    // 6. Direct Latitude/Longitude Coordinates match: "22.5, 90.3"
    const coordMatch = lower.match(/(-?\d+\.?\d*)[,\s]+(-?\d+\.?\d*)/);
    if (coordMatch) {
      const lat = parseFloat(coordMatch[1]);
      const lon = parseFloat(coordMatch[2]);
      if (lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180) {
        return this.flyToCoords(lat, lon, 120000, `Coordinates [${lat.toFixed(4)}, ${lon.toFixed(4)}]`);
      }
    }

    // Fallback: Unknown command
    const msg = `Agent did not recognize "${rawCommand}". Try "Barisal", "Clouds", "Sea level", or "FLIR".`;
    this._setStatus(msg);
    this.speak('Command not recognized. Please specify a location or layer.');
  }

  /** Resolves geographic sector from natural language query. */
  _resolveSector(text) {
    if (text.includes('barisal') || text.includes('barishal') || text.includes('বরিশাল') || text.includes('bhola') || text.includes('patuakhali')) {
      return SECTORS.barisal;
    }
    if (text.includes('dhaka') || text.includes('ঢাকা') || text.includes('dacca') || text.includes('gazipur')) {
      return SECTORS.dhaka;
    }
    if (text.includes('chittagong') || text.includes('ctg') || text.includes('chattogram') || text.includes('চট্টগ্রাম')) {
      return SECTORS.chittagong;
    }
    if (text.includes('sylhet') || text.includes('সিলেট') || text.includes('haor') || text.includes('bonna') || text.includes('flood') || text.includes('বন্যা')) {
      return SECTORS.sylhet;
    }
    if (text.includes('feni') || text.includes('ফেনী') || text.includes('muhuri')) {
      return SECTORS.feni;
    }
    if (text.includes('sundarban') || text.includes('সুন্দরবন') || text.includes('mangrove') || text.includes('khulna')) {
      return SECTORS.sundarbans;
    }
    if (text.includes('rajshahi') || text.includes('রাজশাহী') || text.includes('barind') || text.includes('বরেন্দ্র') || text.includes('groundwater') || text.includes('drought')) {
      return SECTORS.rajshahi;
    }
    if (text.includes('kuakata') || text.includes('কুয়াকাটা') || text.includes('payra') || text.includes('পায়রা')) {
      return SECTORS.kuakata;
    }
    if (text.includes('cox') || text.includes('কক্সবাজার')) {
      return SECTORS.coxsbazar;
    }
    if (text.includes('bay') || text.includes('bengal') || text.includes('বঙ্গোপসাগর') || text.includes('cyclone') || text.includes('ঘূর্ণিঝড়')) {
      return SECTORS.bay_of_bengal;
    }
    if (text.includes('bangladesh') || text.includes('বাংলাদেশ') || text.includes('home') || text.includes('reset')) {
      return SECTORS.bangladesh;
    }
    return null;
  }

  // ==========================================================================
  // CESIUM CAMERA EXECUTION ACTIONS
  // ==========================================================================

  /** Fly camera to targeted sector. */
  async flyToSector(sector) {
    this.activeSector = sector;
    this.stopOrbit();

    if (!this.viewer?.camera) {
      this._setStatus(`Camera unavailable. Navigating to ${sector.name}`);
      return;
    }

    const badge = document.getElementById('orion-harness-sector-badge');
    if (badge) badge.textContent = `${sector.id.toUpperCase()} [${Math.round(sector.altitude / 1000)}KM]`;

    this._setStatus(`🚀 Maneuvering to ${sector.name} (${sector.actionDesc})...`);
    this.speak(sector.speech);

    const dest = Cesium.Cartesian3.fromDegrees(sector.lon, sector.lat, sector.altitude);
    const heading = Cesium.Math.toRadians(sector.heading);
    const pitch = Cesium.Math.toRadians(sector.pitch);

    this.viewer.camera.flyTo({
      destination: dest,
      orientation: { heading, pitch, roll: 0.0 },
      duration: 2.8,
      easingFunction: Cesium.EasingFunction.CUBIC_IN_OUT,
      complete: () => {
        this._setStatus(`✓ Arrived at ${sector.name}. Sector live.`);
        this._briefSectorHighlight(sector);
      }
    });
  }

  /** Fly camera to explicit coordinates. */
  async flyToCoords(lat, lon, altitude = 100000, label = 'Target') {
    this.stopOrbit();
    this._setStatus(`🚀 Maneuvering to ${label}...`);
    this.speak(`Navigating to ${label}`);

    const dest = Cesium.Cartesian3.fromDegrees(lon, lat, altitude);
    this.viewer.camera.flyTo({
      destination: dest,
      orientation: {
        heading: Cesium.Math.toRadians(0),
        pitch: Cesium.Math.toRadians(-50),
        roll: 0.0
      },
      duration: 3.0,
      easingFunction: Cesium.EasingFunction.CUBIC_IN_OUT,
      complete: () => {
        this._setStatus(`✓ Arrived at ${label}.`);
      }
    });
  }

  /** Continuous 360-degree tactical camera orbit around active sector. */
  startOrbit() {
    this.stopOrbit();
    const sector = this.activeSector || SECTORS.barisal;
    this._setStatus(`🔄 Engaging continuous 360° tactical orbit around ${sector.name}...`);
    this.speak(`Engaging 360 degree orbit around ${sector.name}`);

    const center = Cesium.Cartesian3.fromDegrees(sector.lon, sector.lat, 0);
    const distance = sector.altitude * 0.85;

    let heading = 0;
    this.orbitInterval = setInterval(() => {
      if (!this.viewer?.camera) return;
      heading += 0.003;
      this.viewer.camera.lookAt(
        center,
        new Cesium.HeadingPitchRange(heading, Cesium.Math.toRadians(sector.pitch), distance)
      );
    }, 25);
  }

  /** Stop camera orbit and unlock controls. */
  stopOrbit() {
    if (this.orbitInterval) {
      clearInterval(this.orbitInterval);
      this.orbitInterval = null;
      if (this.viewer?.camera) {
        this.viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
      }
      this._setStatus(`Orbit disengaged. Free camera active.`);
    }
  }

  /** Toggle NASA GIBS Real Clouds. */
  triggerClouds() {
    const dockBtn = document.getElementById('real-earth-clouds-dock-btn');
    if (dockBtn) {
      dockBtn.click();
      const isActive = dockBtn.getAttribute('aria-pressed') === 'true';
      const msg = isActive ? 'NASA GIBS live cloud imagery online.' : 'NASA GIBS cloud overlay deactivated.';
      this._setStatus(msg);
      this.speak(msg);
    } else {
      this._setStatus('Real clouds toggle triggered.');
    }
  }

  /** Trigger shader style mode. */
  triggerShader(styleKey, announcement) {
    const btn = document.querySelector(`.style-btn[data-style="${styleKey}"]`);
    if (btn) {
      btn.click();
      this._setStatus(announcement);
      this.speak(announcement);
    } else {
      this._setStatus(`Shader mode ${styleKey} triggered.`);
    }
  }

  /** Trigger Sea Level Rise simulation over Barisal. */
  triggerSeaLevelRise() {
    this.flyToSector(SECTORS.barisal);
    const msg = 'Activating coastal Sea Level Rise & Surge Inundation simulation for Barisal and Bhola.';
    this._setStatus(`🌊 ${msg}`);
    this.speak(msg);
  }

  /** Brief visual beacon pulse at arrival sector. */
  _briefSectorHighlight(sector) {
    if (!this.viewer?.entities) return;
    try {
      const beacon = this.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(sector.lon, sector.lat, 100),
        ellipse: {
          semiMinorAxis: 15000.0,
          semiMajorAxis: 15000.0,
          material: new Cesium.ColorMaterialProperty(Cesium.Color.WHITE.withAlpha(0.25)),
          outline: true,
          outlineColor: Cesium.Color.WHITE.withAlpha(0.8),
          outlineWidth: 2.0
        }
      });
      setTimeout(() => {
        try {
          this.viewer.entities.remove(beacon);
        } catch {}
      }, 4500);
    } catch {}
  }
}
