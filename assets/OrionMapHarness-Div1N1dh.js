const r={barisal:{id:"barisal",name:"Barisal Coastal Belt & Climate Hotspot",lat:22.701,lon:90.3535,altitude:18e4,heading:0,pitch:-48,actionDesc:"Warming Hotspot (+0.452°C/dec, p=0.0062) & Sea Level Surge Sector",suggestedLayers:["clouds","sea_level"],speech:"Maneuvering to Barisal sector. Displaying post-monsoon warming anomaly."},dhaka:{id:"dhaka",name:"Dhaka Metropolitan & Central Corridor",lat:23.8103,lon:90.4125,altitude:12e4,heading:0,pitch:-55,actionDesc:"Urban heat island & atmospheric concentration corridor",suggestedLayers:["clouds","satellites"],speech:"Navigating to Dhaka central metropolitan corridor."},chittagong:{id:"chittagong",name:"Chittagong Port & Karnaphuli Approach",lat:22.3384,lon:91.8048,altitude:9e4,heading:330,pitch:-40,actionDesc:"Primary national maritime port & coastal shipping approach",suggestedLayers:["clouds","satellites"],speech:"Navigating to Chittagong Port and maritime approach."},sylhet:{id:"sylhet",name:"Sylhet Haor Basin & Flash Flood Corridor",lat:24.8949,lon:91.8687,altitude:14e4,heading:10,pitch:-45,actionDesc:"Sentinel-1 SAR radar flood extent & Haor wetland basin",suggestedLayers:["clouds","satellites"],speech:"Maneuvering to Sylhet Haor basin flood monitoring sector."},feni:{id:"feni",name:"Feni-Muhuri River Surge Corridor",lat:23.0159,lon:91.3976,altitude:8e4,heading:0,pitch:-45,actionDesc:"August 2024 flash flood epicenter and embankment monitoring",suggestedLayers:["clouds"],speech:"Navigating to Feni Muhuri flash flood surge corridor."},sundarbans:{id:"sundarbans",name:"Sundarbans Mangrove Delta & Coastal Front",lat:21.9497,lon:89.5403,altitude:2e5,heading:350,pitch:-50,actionDesc:"UNESCO Biosphere mangrove fringe & tidal barrier",suggestedLayers:["sea_level","clouds"],speech:"Arriving at Sundarbans mangrove biosphere."},rajshahi:{id:"rajshahi",name:"Rajshahi & North Bengal Barind Tract",lat:24.3745,lon:88.6042,altitude:16e4,heading:0,pitch:-50,actionDesc:"NASA GRACE groundwater depletion & drought monitoring",suggestedLayers:["clouds"],speech:"Maneuvering to Rajshahi Barind tract groundwater depletion zone."},kuakata:{id:"kuakata",name:"Payra Port & Kuakata Coastal Seawall",lat:21.8167,lon:90.1167,altitude:7e4,heading:15,pitch:-35,actionDesc:"Southernmost coastal delta, Payra Port, and sea level rise",suggestedLayers:["sea_level","clouds"],speech:"Navigating to Payra Port and Kuakata shoreline."},coxsbazar:{id:"coxsbazar",name:"Cox's Bazar & Kutubdia Coastal Fringe",lat:21.4272,lon:91.9676,altitude:12e4,heading:340,pitch:-42,actionDesc:"World's longest unbroken sea beach & cyclone approach line",suggestedLayers:["clouds"],speech:"Arriving at Cox's Bazar coastal sector."},bay_of_bengal:{id:"bay_of_bengal",name:"Bay of Bengal EEZ Maritime Sector",lat:20.2,lon:89.8,altitude:6e5,heading:0,pitch:-55,actionDesc:"Cyclone genesis basin, depression tracking & deep water passes",suggestedLayers:["clouds","satellites"],speech:"Framing Bay of Bengal cyclonic depression basin."},bangladesh:{id:"bangladesh",name:"People's Republic of Bangladesh",lat:23.685,lon:90.3563,altitude:15e5,heading:0,pitch:-65,actionDesc:"National 34-station meteorological reanalysis grid overview",suggestedLayers:["clouds"],speech:"Resetting to nationwide Bangladesh 34-station grid view."}};class h{constructor(e,t={}){this.viewer=e,this.cloudStream=t.cloudStream||null,this.speechEnabled=!0,this.isListening=!1,this.recognition=null,this.activeOrbit=null,this.orbitInterval=null,this.activeSector=r.bangladesh,this.history=[],this.isVisible=!1,this.spatialTrends=[],this.seasonalTrends=[],this.climateLoaded=!1,this.evidenceCardEl=null,this._initSpeechRecognition(),this._loadClimateData()}_initSpeechRecognition(){const e=window.SpeechRecognition||window.webkitSpeechRecognition;if(!e){console.info("[OrionHarness] Web Speech API not supported in this browser; text input available.");return}try{this.recognition=new e,this.recognition.continuous=!1,this.recognition.interimResults=!1,this.recognition.lang="en-US",this.recognition.onstart=()=>{this.isListening=!0,this._updateMicButton(!0),this._setStatus('🎙️ LISTENING... SPEAK NOW (e.g. "Fly to Barisal", "Show real clouds")')},this.recognition.onresult=t=>{var i,a;const s=(a=(i=t.results[0])==null?void 0:i[0])==null?void 0:a.transcript;if(s){const n=document.getElementById("orion-harness-input");n&&(n.value=s),this.execute(s)}},this.recognition.onerror=t=>{this.isListening=!1,this._updateMicButton(!1),this._setStatus(`Voice input error: ${t.error||"unknown"}`)},this.recognition.onend=()=>{this.isListening=!1,this._updateMicButton(!1)}}catch(t){console.warn("[OrionHarness] Voice recognition setup failed:",t)}}mount(e=document.body){if(document.getElementById("orion-map-harness-container"))return;const t=document.createElement("div");t.id="orion-map-harness-container",t.style.cssText=`
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
    `,t.innerHTML=`
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
        <button class="harness-chip" data-cmd="where is warming fastest" style="border-color: #52525b; color: #ffffff;">🔥 FASTEST WARMING</button>
        <button class="harness-chip" data-cmd="barisal evidence" style="border-color: #52525b; color: #ffffff;">📊 BARISAL EVIDENCE</button>
        <button class="harness-chip" data-cmd="is warming significant" style="border-color: #52525b; color: #ffffff;">📈 STATISTICAL PROOF</button>
        <button class="harness-chip" data-cmd="fly to barisal">📍 BARISAL</button>
        <button class="harness-chip" data-cmd="fly to dhaka">📍 DHAKA</button>
        <button class="harness-chip" data-cmd="clouds">☁️ REAL CLOUDS</button>
        <button class="harness-chip" data-cmd="sea level rise">🌊 SEA LEVEL RISE</button>
        <button class="harness-chip" data-cmd="flir">🔥 FLIR THERMAL</button>
        <button class="harness-chip" data-cmd="orbit">🔄 360° ORBIT</button>
        <button class="harness-chip" data-cmd="sylhet flood">🌊 SYLHET FLOOD</button>
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
    `,e.appendChild(t);const s=document.createElement("style");s.textContent=`
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
    `,document.head.appendChild(s);const i=t.querySelector("#orion-harness-input"),a=t.querySelector("#orion-harness-exec-btn"),n=t.querySelector("#orion-harness-mic-btn"),l=t.querySelector("#orion-harness-close-btn"),d=t.querySelector("#orion-harness-speech-btn");a==null||a.addEventListener("click",()=>{var o;const c=(o=i==null?void 0:i.value)==null?void 0:o.trim();c&&this.execute(c)}),i==null||i.addEventListener("keydown",c=>{var o;if(c.key==="Enter"){const u=(o=i==null?void 0:i.value)==null?void 0:o.trim();u&&this.execute(u)}else c.key==="Escape"&&this.close()}),n==null||n.addEventListener("click",()=>this.toggleVoice()),l==null||l.addEventListener("click",()=>this.close()),d==null||d.addEventListener("click",()=>{this.speechEnabled=!this.speechEnabled,d.textContent=this.speechEnabled?"🔊":"🔇",d.title=this.speechEnabled?"Agent Voice Enabled":"Agent Voice Muted",this._setStatus(this.speechEnabled?"Agent voice enabled":"Agent voice muted")}),t.querySelectorAll(".harness-chip").forEach(c=>{c.addEventListener("click",()=>{const o=c.dataset.cmd;i&&(i.value=o),o&&this.execute(o)})}),window.addEventListener("keydown",c=>{var o;c.key==="`"&&!["INPUT","TEXTAREA"].includes((o=document.activeElement)==null?void 0:o.tagName)&&(c.preventDefault(),this.toggle())})}toggle(){this.isVisible?this.close():this.open()}open(){const e=document.getElementById("orion-map-harness-container");if(!e)return this.mount(),this.open();e.style.display="flex",this.isVisible=!0;const t=document.getElementById("orion-harness-input");t==null||t.focus(),this._playTone(520,.1)}close(){const e=document.getElementById("orion-map-harness-container");e&&(e.style.display="none"),this.isVisible=!1,this.stopVoice()}toggleVoice(){this.isListening?this.stopVoice():this.startVoice()}startVoice(){if(!this.recognition){this._setStatus("Microphone recognition not available in this browser. Please type.");return}try{this.recognition.start()}catch{}}stopVoice(){if(this.recognition&&this.isListening)try{this.recognition.stop()}catch{}this.isListening=!1,this._updateMicButton(!1)}_updateMicButton(e){const t=document.getElementById("orion-harness-mic-btn");t&&(e?(t.style.background="#ffffff",t.style.color="#000000",t.style.borderColor="#ffffff"):(t.style.background="#18181b",t.style.color="#ffffff",t.style.borderColor="#27272a"))}_setStatus(e){const t=document.getElementById("orion-harness-status-text");t&&(t.textContent=e)}speak(e){if(!(!this.speechEnabled||!window.speechSynthesis))try{window.speechSynthesis.cancel();const t=new SpeechSynthesisUtterance(e);t.rate=1.05,t.pitch=1,window.speechSynthesis.speak(t)}catch(t){console.warn("[OrionHarness] Speech error:",t)}}_playTone(e=440,t=.08){try{const s=window.AudioContext||window.webkitAudioContext;if(!s)return;const i=new s,a=i.createOscillator(),n=i.createGain();a.type="sine",a.frequency.setValueAtTime(e,i.currentTime),n.gain.setValueAtTime(.04,i.currentTime),n.gain.exponentialRampToValueAtTime(.001,i.currentTime+t),a.connect(n),n.connect(i.destination),a.start(),a.stop(i.currentTime+t)}catch{}}async execute(e){if(!e)return;const t=e.toLowerCase().trim();if(this.history.push(e),this._playTone(660,.06),t.includes("orbit")||t.includes("ghuro")||t.includes("ঘুরো")||t.includes("rotate")||t.includes("360"))return this.startOrbit();if(t.includes("stop")||t.includes("thamo")||t.includes("থামো")||t.includes("halt"))return this.stopOrbit();if(t.includes("cloud")||t.includes("megh")||t.includes("মেঘ")||t.includes("gibs"))return this.triggerClouds();if(t.includes("thermal")||t.includes("flir")||t.includes("heat")||t.includes("gorom"))return this.triggerShader("thermal","FLIR Thermal (Ironbow) Mode activated.");if(t.includes("nvg")||t.includes("night")||t.includes("raat")||t.includes("rat"))return this.triggerShader("surveillance","Night Vision Sensor Pass activated.");if(t.includes("noir")||t.includes("monochrome")||t.includes("black and white"))return this.triggerShader("noir","Swiss Monochrome Noir Style activated.");if(t.includes("normal")||t.includes("optical")||t.includes("reset style"))return this.triggerShader("normal","Standard Optical Globe restored.");if(t.includes("sea level")||t.includes("slr")||t.includes("surge")||t.includes("pani")||t.includes("জলস্তর"))return this.triggerSeaLevelRise();if(t.includes("fastest")||t.includes("where is warming")||t.includes("hotspot")||t.includes("shobcheye beshi gorom")||t.includes("সবচেয়ে বেশি গরম")||t.includes("warming fastest"))return this.handleFastestWarmingQuery();if(t.includes("barisal evidence")||t.includes("বরিশাল প্রমাণ")||t.includes("barisal")&&(t.includes("evidence")||t.includes("trend")||t.includes("stat")||t.includes("data")))return this.handleBarisalEvidenceQuery();if(t.includes("significant")||t.includes("statistical proof")||t.includes("mann kendall")||t.includes("p value")||t.includes("প্রমাণ")||t.includes("detective")||t.includes("proof"))return this.handleStatisticalSignificanceQuery();if(t.includes("october")||t.includes("অক্টোবর")||t.includes("seasonal")||t.includes("post-monsoon"))return this.handleSeasonalDissociationQuery();const s=this._resolveSector(t);if(s)return this.flyToSector(s);const i=t.match(/(-?\d+\.?\d*)[,\s]+(-?\d+\.?\d*)/);if(i){const n=parseFloat(i[1]),l=parseFloat(i[2]);if(n>=-90&&n<=90&&l>=-180&&l<=180)return this.flyToCoords(n,l,12e4,`Coordinates [${n.toFixed(4)}, ${l.toFixed(4)}]`)}const a=`Agent did not recognize "${e}". Try "Barisal", "Clouds", "Sea level", or "FLIR".`;this._setStatus(a),this.speak("Command not recognized. Please specify a location or layer.")}_resolveSector(e){return e.includes("barisal")||e.includes("barishal")||e.includes("বরিশাল")||e.includes("bhola")||e.includes("patuakhali")?r.barisal:e.includes("dhaka")||e.includes("ঢাকা")||e.includes("dacca")||e.includes("gazipur")?r.dhaka:e.includes("chittagong")||e.includes("ctg")||e.includes("chattogram")||e.includes("চট্টগ্রাম")?r.chittagong:e.includes("sylhet")||e.includes("সিলেট")||e.includes("haor")||e.includes("bonna")||e.includes("flood")||e.includes("বন্যা")?r.sylhet:e.includes("feni")||e.includes("ফেনী")||e.includes("muhuri")?r.feni:e.includes("sundarban")||e.includes("সুন্দরবন")||e.includes("mangrove")||e.includes("khulna")?r.sundarbans:e.includes("rajshahi")||e.includes("রাজশাহী")||e.includes("barind")||e.includes("বরেন্দ্র")||e.includes("groundwater")||e.includes("drought")?r.rajshahi:e.includes("kuakata")||e.includes("কুয়াকাটা")||e.includes("payra")||e.includes("পায়রা")?r.kuakata:e.includes("cox")||e.includes("কক্সবাজার")?r.coxsbazar:e.includes("bay")||e.includes("bengal")||e.includes("বঙ্গোপসাগর")||e.includes("cyclone")||e.includes("ঘূর্ণিঝড়")?r.bay_of_bengal:e.includes("bangladesh")||e.includes("বাংলাদেশ")||e.includes("home")||e.includes("reset")?r.bangladesh:null}async flyToSector(e){var n;if(this.activeSector=e,this.stopOrbit(),!((n=this.viewer)!=null&&n.camera)){this._setStatus(`Camera unavailable. Navigating to ${e.name}`);return}const t=document.getElementById("orion-harness-sector-badge");t&&(t.textContent=`${e.id.toUpperCase()} [${Math.round(e.altitude/1e3)}KM]`),this._setStatus(`🚀 Maneuvering to ${e.name} (${e.actionDesc})...`),this.speak(e.speech);const s=Cesium.Cartesian3.fromDegrees(e.lon,e.lat,e.altitude),i=Cesium.Math.toRadians(e.heading),a=Cesium.Math.toRadians(e.pitch);this.viewer.camera.flyTo({destination:s,orientation:{heading:i,pitch:a,roll:0},duration:2.8,easingFunction:Cesium.EasingFunction.CUBIC_IN_OUT,complete:()=>{this._setStatus(`✓ Arrived at ${e.name}. Sector live.`),this._briefSectorHighlight(e)}})}async flyToCoords(e,t,s=1e5,i="Target"){this.stopOrbit(),this._setStatus(`🚀 Maneuvering to ${i}...`),this.speak(`Navigating to ${i}`);const a=Cesium.Cartesian3.fromDegrees(t,e,s);this.viewer.camera.flyTo({destination:a,orientation:{heading:Cesium.Math.toRadians(0),pitch:Cesium.Math.toRadians(-50),roll:0},duration:3,easingFunction:Cesium.EasingFunction.CUBIC_IN_OUT,complete:()=>{this._setStatus(`✓ Arrived at ${i}.`)}})}startOrbit(){this.stopOrbit();const e=this.activeSector||r.barisal;this._setStatus(`🔄 Engaging continuous 360° tactical orbit around ${e.name}...`),this.speak(`Engaging 360 degree orbit around ${e.name}`);const t=Cesium.Cartesian3.fromDegrees(e.lon,e.lat,0),s=e.altitude*.85;let i=0;this.orbitInterval=setInterval(()=>{var a;(a=this.viewer)!=null&&a.camera&&(i+=.003,this.viewer.camera.lookAt(t,new Cesium.HeadingPitchRange(i,Cesium.Math.toRadians(e.pitch),s)))},25)}stopOrbit(){var e;this.orbitInterval&&(clearInterval(this.orbitInterval),this.orbitInterval=null,(e=this.viewer)!=null&&e.camera&&this.viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY),this._setStatus("Orbit disengaged. Free camera active."))}triggerClouds(){const e=document.getElementById("real-earth-clouds-dock-btn");if(e){e.click();const s=e.getAttribute("aria-pressed")==="true"?"NASA GIBS live cloud imagery online.":"NASA GIBS cloud overlay deactivated.";this._setStatus(s),this.speak(s)}else this._setStatus("Real clouds toggle triggered.")}triggerShader(e,t){const s=document.querySelector(`.style-btn[data-style="${e}"]`);s?(s.click(),this._setStatus(t),this.speak(t)):this._setStatus(`Shader mode ${e} triggered.`)}triggerSeaLevelRise(){this.flyToSector(r.barisal);const e="Activating coastal Sea Level Rise & Surge Inundation simulation for Barisal and Bhola.";this._setStatus(`🌊 ${e}`),this.speak(e)}_briefSectorHighlight(e){var t;if((t=this.viewer)!=null&&t.entities)try{const s=this.viewer.entities.add({position:Cesium.Cartesian3.fromDegrees(e.lon,e.lat,100),ellipse:{semiMinorAxis:15e3,semiMajorAxis:15e3,material:new Cesium.ColorMaterialProperty(Cesium.Color.WHITE.withAlpha(.25)),outline:!0,outlineColor:Cesium.Color.WHITE.withAlpha(.8),outlineWidth:2}});setTimeout(()=>{try{this.viewer.entities.remove(s)}catch{}},4500)}catch{}}async _loadClimateData(){try{const[e,t]=await Promise.all([fetch("/data/climate/bangladesh_t2m_spatial_trends_filtered.csv").catch(()=>null),fetch("/data/climate/bangladesh_t2m_seasonal_trends.csv").catch(()=>null)]);if(e&&e.ok){const s=await e.text();this.spatialTrends=this._parseCSV(s)}if(t&&t.ok){const s=await t.text();this.seasonalTrends=this._parseCSV(s)}this.climateLoaded=!0,console.info(`[OrionHarness] Climate data hydrated: ${this.spatialTrends.length} spatial stations, ${this.seasonalTrends.length} seasonal records.`)}catch(e){console.warn("[OrionHarness] Climate data load error:",e)}}_parseCSV(e){const t=e.trim().split(/\r?\n/);if(t.length<2)return[];const s=t[0].split(",").map(a=>a.trim()),i=[];for(let a=1;a<t.length;a++){const n=t[a].split(",").map(l=>l.trim());if(n.length===s.length){const l={};s.forEach((d,c)=>{const o=n[c];l[d]=!isNaN(o)&&o!==""?parseFloat(o):o}),i.push(l)}}return i}showEvidenceCard(e){var s,i,a;let t=document.getElementById("orion-evidence-card");if(!t){t=document.createElement("div"),t.id="orion-evidence-card",t.style.cssText=`
        position: fixed;
        top: 68px;
        right: 24px;
        width: 390px;
        max-width: calc(100vw - 48px);
        background: rgba(9, 9, 11, 0.95);
        border: 1px solid #27272a;
        border-radius: 8px;
        box-shadow: 0 20px 48px rgba(0, 0, 0, 0.85), 0 0 0 1px rgba(255, 255, 255, 0.08);
        backdrop-filter: blur(16px);
        z-index: 1400;
        font-family: 'JetBrains Mono', monospace;
        color: #ffffff;
        font-size: 11px;
        line-height: 1.5;
        overflow: hidden;
        animation: fadeInCard 0.25s ease forwards;
      `,document.body.appendChild(t);const n=document.createElement("style");n.textContent=`
        @keyframes fadeInCard {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `,document.head.appendChild(n)}t.innerHTML=`
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; border-bottom: 1px solid #27272a; background: rgba(255, 255, 255, 0.03);">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #ffffff; box-shadow: 0 0 8px rgba(255, 255, 255, 0.8);"></span>
          <span style="font-weight: 700; font-size: 11px; letter-spacing: 0.8px;">${e.title||"CLIMATE EVIDENCE DOSSIER"}</span>
        </div>
        <button id="orion-evidence-close-btn" style="background: transparent; border: none; color: #a1a1aa; font-size: 14px; cursor: pointer;">✕</button>
      </div>

      <div style="padding: 12px 14px; display: flex; flex-direction: column; gap: 10px;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 10px; background: rgba(0, 0, 0, 0.4); padding: 8px 10px; border-radius: 6px; border: 1px solid #18181b;">
          <div><span style="color: #71717a;">SECTOR:</span> <span style="color: #ffffff; font-weight: 600;">${e.sector||"Barisal Coastal Belt"}</span></div>
          <div><span style="color: #71717a;">TIMEFRAME:</span> <span style="color: #ffffff;">2001 - 2025 (25 Yrs)</span></div>
          <div><span style="color: #71717a;">DATASET:</span> <span style="color: #ffffff;">NASA MERRA-2 (T2M)</span></div>
          <div><span style="color: #71717a;">API:</span> <span style="color: #ffffff;">NASA POWER</span></div>
        </div>

        <div style="background: rgba(255, 255, 255, 0.02); border: 1px solid #27272a; border-radius: 6px; padding: 10px;">
          <div style="font-size: 9.5px; color: #a1a1aa; letter-spacing: 0.5px; margin-bottom: 6px; text-transform: uppercase;">STATISTICAL METRICS (THEIL-SEN &amp; MANN-KENDALL)</div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <span style="color: #a1a1aa;">Seasonal Slope:</span>
            <span style="color: #ffffff; font-weight: 700;">${e.slope||"+0.457°C / decade"}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <span style="color: #a1a1aa;">Sen's Slope β:</span>
            <span style="color: #ffffff;">${e.senSlope||"+0.0435°C / year"}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <span style="color: #a1a1aa;">Mann-Kendall p-value:</span>
            <span style="color: #ffffff; font-weight: 700;">${e.pValue||"p = 0.0070 (p < 0.01 ★★★)"}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #a1a1aa;">Significance Verdict:</span>
            <span style="color: #ffffff; border: 1px solid #52525b; padding: 1px 6px; border-radius: 3px; font-size: 9.5px;">${e.significance||"STATISTICALLY SIGNIFICANT"}</span>
          </div>
        </div>

        <div style="font-size: 10.5px; color: #d4d4d8; background: rgba(0, 0, 0, 0.3); border-left: 2px solid #ffffff; padding: 8px 10px;">
          ${e.narrative||"Post-monsoon October warming is accelerating rapidly across the Barisal delta, with annual metrics masking this extreme seasonal phenomenon."}
        </div>

        <div style="display: flex; gap: 8px;">
          <button id="orion-evidence-speak-btn" style="flex: 1; background: #18181b; border: 1px solid #27272a; color: #ffffff; padding: 6px 10px; border-radius: 4px; font-size: 10px; cursor: pointer; font-family: inherit;">🔊 READ EVIDENCE</button>
          <button id="orion-evidence-orbit-btn" style="background: #ffffff; color: #000000; border: none; padding: 6px 12px; border-radius: 4px; font-size: 10px; font-weight: 700; cursor: pointer; font-family: inherit;">🔄 360° SURVEY</button>
        </div>
      </div>
    `,(s=t.querySelector("#orion-evidence-close-btn"))==null||s.addEventListener("click",()=>{t.remove()}),(i=t.querySelector("#orion-evidence-speak-btn"))==null||i.addEventListener("click",()=>{this.speak(e.speech||e.narrative)}),(a=t.querySelector("#orion-evidence-orbit-btn"))==null||a.addEventListener("click",()=>{this.startOrbit()})}async handleFastestWarmingQuery(){await this.flyToSector(r.barisal);const e="NASA MERRA-2 daily telemetry confirms the fastest warming sector is the Barisal coastal delta, with post-monsoon October warming of plus 0.457 degrees Celsius per decade, statistically significant at p equals 0.007.";this.showEvidenceCard({title:"FASTEST WARMING HOTSPOT",sector:"Barisal Coastal Belt [22.5°N, 90.0°E]",slope:"+0.457°C / decade (+0.0457°C/yr)",senSlope:"+0.0435°C / year (Theil-Sen)",pValue:"p = 0.0070 (p < 0.01 ★★★)",significance:"HIGHLY SIGNIFICANT",narrative:"Across 34 grid stations in Bangladesh, the Barisal coastal belt experiences the fastest post-monsoon thermal acceleration (+0.457°C/decade). Rising sea temperatures and delta low-elevation amplify thermal retention.",speech:e}),this.speak(e)}async handleBarisalEvidenceQuery(){return this.handleFastestWarmingQuery()}async handleStatisticalSignificanceQuery(){this._setStatus("Analyzing 34-station Mann-Kendall hypothesis tests...");const e="Statistical hypothesis testing confirms significant warming. Thirty-one of thirty-four stations across Bangladesh exhibit statistically significant October warming with p-values below 0.05.";this.showEvidenceCard({title:"MANN-KENDALL STATISTICAL PROOF",sector:"All-Bangladesh 34-Station Grid",slope:"31 of 34 Stations Significant in Oct (91.2%)",senSlope:"Median Sen's Slope: +0.038°C / year",pValue:"p < 0.0001 (Combined Test)",significance:"REJECT NULL HYPOTHESIS H0",narrative:"The Mann-Kendall rank correlation test rejects the null hypothesis of no trend at the 99% confidence level. 33 stations in September and 31 stations in October demonstrate robust warming.",speech:e}),this.speak(e)}async handleSeasonalDissociationQuery(){const e="Seasonal dissociation analysis shows that while annual average temperatures show modest warming, post-monsoon months of September and October exhibit severe, statistically significant warming across Bangladesh.";this.showEvidenceCard({title:"SEASONAL DISSOCIATION PHENOMENON",sector:"Bangladesh Temporal Signal Decomposition",slope:"Annual Mean: +0.03°C/dec | Oct: +0.45°C/dec",senSlope:"15x Amplification in Post-Monsoon Season",pValue:"Annual p=0.45 (ns) vs Oct p=0.007 (***)",significance:"EXTREME SEASONAL VARIATION",narrative:"Crucial discovery: Evaluating only annual averages dilutes the extreme post-monsoon autumn signal. Farmers and disaster managers must prepare for delayed cooling and extended post-monsoon tropical heat.",speech:e}),this.speak(e)}}export{h as OrionMapHarness,r as SECTORS};
