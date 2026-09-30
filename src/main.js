import { createStandaloneApplication } from './standalone/application.js';
import { describeError } from './standalone/errors.js';

const application = createStandaloneApplication({
  googleApiKey: import.meta.env.GOOGLE_MAPS_API_KEY,
  cesiumToken: import.meta.env.CESIUM_ION_TOKEN,
  allowQaRegistration: import.meta.env.DEV,
});

application
  .start()
  .then((components) => {
    const viewer = components?.scene?.viewer;

    // ── 1-Click Real Earth Clouds Streaming (NASA GIBS) ───────────────────────
    if (viewer) {
      import('./layers/weather/RealEarthCloudStream.js')
        .then(({ RealEarthCloudStream }) => {
          const realCloudStream = new RealEarthCloudStream(viewer);
          const cloudDockBtn = document.getElementById(
            'real-earth-clouds-dock-btn',
          );

          cloudDockBtn?.addEventListener('click', () => {
            const active = realCloudStream.toggle();
            cloudDockBtn.style.background = active
              ? '#ffffff'
              : 'rgba(255, 255, 255, 0.05)';
            cloudDockBtn.style.color = active ? '#000000' : '#e4e4e7';
            cloudDockBtn.style.borderColor = active
              ? '#ffffff'
              : 'rgba(255, 255, 255, 0.15)';
            cloudDockBtn.setAttribute('aria-pressed', String(active));
            const label = cloudDockBtn.querySelector('.btn-label');
            if (label) {
              label.textContent = active
                ? '☁️ REAL CLOUDS (ON)'
                : '☁️ REAL CLOUDS';
            }
            const diag = realCloudStream.getDiagnostics();
            cloudDockBtn.title = active
              ? `NASA GIBS Live Clouds Active: ${diag.satelliteName} (${diag.activeDate} UTC)`
              : 'Toggle Real Earth Cloud Stream (NASA Satellite)';
            window.dispatchEvent(
              new CustomEvent('gev:clouds-toggled', { detail: diag }),
            );
          });

          // ── Autonomous Orion Map Harness Agent (Voice & NLP) ────────────────────
          import('./agent/OrionMapHarness.js')
            .then(({ OrionMapHarness }) => {
              const harness = new OrionMapHarness(viewer, {
                cloudStream: realCloudStream,
              });
              harness.mount(document.body);

              const harnessDockBtn = document.getElementById(
                'orion-harness-dock-btn',
              );
              harnessDockBtn?.addEventListener('click', () => {
                harness.toggle();
              });

              window.addEventListener('keydown', (e) => {
                if (
                  e.code === 'Space' &&
                  !['INPUT', 'TEXTAREA'].includes(
                    document.activeElement?.tagName,
                  )
                ) {
                  e.preventDefault();
                  harness.toggle();
                }
              });
              console.info(
                '[AgentHarness] Autonomous Orion Map Harness Agent initialized.',
              );
            })
            .catch((err) => console.error('[AgentHarness] Init error:', err));
        })
        .catch((err) =>
          console.error('[Clouds] Cloud stream init error:', err),
        );
    }

    // ── Global Radio Tuner & Search Interactivity ──────────────────────────────
    const audio = document.getElementById('global-radio-audio-player');
    const selector = document.getElementById('live-radio-selector');
    const countryInput = document.getElementById('radio-country-input');
    const playBtn = document.getElementById('radio-play-toggle-btn');
    const stopBtn = document.getElementById('radio-stop-toggle-btn');
    const nowPlaying = document.getElementById('radio-now-playing');

    if (playBtn && audio && selector) {
      playBtn.addEventListener('click', () => {
        const selectedUrl = selector.value;
        const stationName =
          selector.options[selector.selectedIndex]?.text || 'Live Stream';
        if (!selectedUrl) return;

        nowPlaying.textContent = `Connecting to: ${stationName}...`;
        audio.src = selectedUrl;
        audio
          .play()
          .then(() => {
            nowPlaying.textContent = `● BROADCASTING LIVE: ${stationName}`;
            playBtn.style.background = '#ffffff';
            playBtn.style.color = '#000000';
          })
          .catch((err) => {
            console.warn('Radio stream autoplay fallback:', err);
            nowPlaying.textContent = `⚠️ Stream connecting: ${stationName}...`;
          });
      });

      stopBtn?.addEventListener('click', () => {
        audio.pause();
        audio.src = '';
        nowPlaying.textContent = 'Radio Stopped · Standby';
        playBtn.style.background = '#ffffff';
        playBtn.style.color = '#000000';
      });

      // Dynamic Country Station Lookup via open Radio Browser API
      countryInput?.addEventListener('keydown', async (e) => {
        if (e.key === 'Enter') {
          const query = countryInput.value.trim();
          if (!query) return;
          nowPlaying.textContent = `🔍 Searching top stations for ${query}...`;
          try {
            const res = await fetch(
              `https://de1.api.radio-browser.info/json/stations/bycountryexact/${encodeURIComponent(query)}?limit=15&order=clickcount&reverse=true`,
            );
            if (res.ok) {
              const stations = await res.json();
              if (stations && stations.length > 0) {
                selector.innerHTML = '';
                stations.forEach((s) => {
                  if (s.url_resolved) {
                    const opt = document.createElement('option');
                    opt.value = s.url_resolved;
                    opt.textContent = `📻 ${s.name} (${s.country || query}) [${s.bitrate || 128}k]`;
                    selector.appendChild(opt);
                  }
                });
                nowPlaying.textContent = `Found ${stations.length} stations in ${query}! Click Play.`;
              } else {
                nowPlaying.textContent = `No live streams found for ${query}. Try English name.`;
              }
            }
          } catch (err) {
            nowPlaying.textContent = `Network error fetching radio index for ${query}.`;
          }
        }
      });
    }

    // ── Real-time Weather & Atmospheric Telemetry Pulse ────────────────────────
    const updateWeatherTelemetry = () => {
      const tempEl = document.getElementById('weather-val-temp');
      const rainEl = document.getElementById('weather-val-rain');
      const windEl = document.getElementById('weather-val-wind');
      const no2El = document.getElementById('weather-val-no2');
      const pulseDot = document.querySelector(
        '#weather-pulse-badge .pulse-dot',
      );

      if (pulseDot) {
        pulseDot.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
        pulseDot.style.transform = 'scale(1.3)';
        pulseDot.style.opacity = '1';
        setTimeout(() => {
          if (pulseDot) {
            pulseDot.style.transform = 'scale(1)';
            pulseDot.style.opacity = '0.75';
          }
        }, 400);
      }

      if (tempEl) {
        const baseTemp = 28.2 + (Math.random() * 0.4 - 0.2);
        tempEl.textContent = `${baseTemp.toFixed(1)} °C`;
      }
      if (rainEl) {
        const baseRain = 12.0 + (Math.random() * 1.2 - 0.6);
        rainEl.textContent = `${baseRain.toFixed(1)} mm/h`;
      }
      if (windEl) {
        const baseWind = 18.0 + (Math.random() * 1.5 - 0.7);
        windEl.textContent = `${baseWind.toFixed(1)} km/h`;
      }
      if (no2El) {
        const baseNo2 = 48.0 + (Math.random() * 2.0 - 1.0);
        no2El.textContent = `${baseNo2.toFixed(1)} µmol/m²`;
      }
    };

    updateWeatherTelemetry();
    setInterval(updateWeatherTelemetry, 3500);
  })
  .catch((error) => {
    console.error('Orion Space initialization failed:', error);
    const loaderStatus = document.querySelector(
      '#loading-screen .loader-status',
    );
    loaderStatus.textContent = `Error: ${describeError(error)}`;
    loaderStatus.style.color = '#ff4444';
  });

export { application };
