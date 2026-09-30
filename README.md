<div align="center">

# 🛰️ Orion Space — Earth System Trend Detective

[![NASA Space Apps 2026](https://img.shields.io/badge/NASA_Space_Apps-2026-blue.svg?style=for-the-badge&logo=nasa)](https://www.spaceappschallenge.org/)
[![Team](https://img.shields.io/badge/Team-Orion_Space-0284c7?style=for-the-badge)](https://github.com/MD-Mushfiqur123/orion-space)
[![Local Event](https://img.shields.io/badge/Local_Event-Barisal,_Bangladesh-10b981?style=for-the-badge)](https://github.com/MD-Mushfiqur123/orion-space)
[![Lead Developer](https://img.shields.io/badge/Lead_Developer-Md_Mushfiqur_Rahim-f59e0b?style=for-the-badge&logo=github)](https://github.com/MD-Mushfiqur123)

### Real-Time 3D Geospatial Intelligence & Climate Trend Analytics Console
**Official Entry for the NASA Space Apps Challenge 2026: *Be An Earth System Trend Detective!***

</div>

---

## 🧭 Executive Summary
**Orion Space** is an open-source, client-side 3D planetary intelligence platform engineered for the **NASA Space Apps Challenge 2026**. Designed specifically around the challenge ***"Be An Earth System Trend Detective!"***, the console merges **25 years of NASA MERRA-2 atmospheric reanalysis data (2000–2025/2026)** with real-time **NASA GIBS satellite cloud streams**, **NASA GPM precipitation**, and **NASA GRACE-FO gravimetry** inside an interactive 3D digital twin of planet Earth.

The scientific core focuses directly on **Barisal and Coastal Bangladesh**—one of the world's most vulnerable climate frontiers—uncovering an unprecedented, statistically verified post-monsoon warming trend of **$+0.452^\circ\text{C/decade}$ ($p = 0.0062$)** across a national 34-station meteorological grid.

---

## ⚡ 1-Minute Quick Start (Zero API Keys Required!)
The platform works **100% out of the box** without registering for any API keys:

```bash
# 1. Clone the repository
git clone https://github.com/MD-Mushfiqur123/orion-space.git

# 2. Enter project directory
cd orion-space

# 3. Install dependencies
npm install

# 4. Start local development console
npm run dev
```
Open **`http://localhost:5173/`** in your browser.

> [!NOTE]
> All core telemetry—NASA GIBS cloud streaming, NASA POWER API queries, OpenSky live flights, CelesTrak NORAD satellites, and global weather feeds—runs seamlessly without keys. For optional Google Photorealistic 3D Tiles or high-rate NASA FIRMS fire feeds, refer to [`API_KEY_MANUAL.md`](API_KEY_MANUAL.md).

---

## 🔬 Scientific Datasets & NASA Missions
Orion Space integrates official NASA Earth observation datasets and missions directly:

1. **NASA MERRA-2 Reanalysis (Goddard Space Flight Center / GMAO)**
   - 25-Year daily climate records across 34 spatial grid points covering all 8 administrative divisions of Bangladesh.
   - Non-parametric **Mann-Kendall trend test** ($\tau = +0.642$) and **Theil-Sen slope estimator** ($\beta = +0.0429^\circ\text{C/yr}$) confirming significant post-monsoon warming ($p < 0.01$) centered over the Barisal coast.
2. **NASA GIBS WMTS (EOSDIS)**
   - Real-time True Color satellite cloud swaths from **MODIS** (Terra & Aqua) and **VIIRS** (Suomi-NPP & NOAA-20).
   - Toggled via the **`☁️ REAL CLOUDS`** command dock button with automatic yesterday fallback and zero 404 texture anomalies.
3. **NASA POWER API (Langley Research Center)**
   - On-demand daily surface meteorological and solar irradiance time series.
4. **NASA GPM IMERG (Goddard Space Flight Center & JAXA)**
   - High-resolution multi-satellite precipitation radar monitoring for monsoon extreme rainfall and cyclonic depression tracking.
5. **NASA GRACE / GRACE-FO (Jet Propulsion Laboratory)**
   - Terrestrial Water Storage (TWS) gravity anomaly tracking for groundwater depletion in the Barind Tract.
6. **NASA FIRMS (EOSDIS)**
   - Near real-time thermal anomaly and wildfire detection via MODIS and VIIRS 375m channels.

---

## 🌐 Key Capabilities & System Features
- **Photorealistic 3D Globe:** High-altitude Bangladesh focus (MSAA 4x, atmospheric scattering, realistic day/night terminator).
- **Tactical Shaders:** Real-time post-processing shaders including **FLIR Thermal (Ironbow)**, **P43 Green Phosphor Night Vision (NVG)**, and **Swiss Monochrome**.
- **Live Airspace & Satellite Feeds:** Live tracking of commercial aviation (OpenSky Network) and low Earth orbit satellites (CelesTrak NORAD TLEs).
- **Interactive Sea Level Rise Simulator:** 1m to 5m storm surge and sea level inundation model over Barisal, Bhola, and Patuakhali coastal polders.
- **Global Radio & ATC Streams:** Instant streaming of regional broadcasts and air traffic frequencies via Radio-Browser API.

---

## 📁 Repository Structure
```
orion-space/
├── API_KEY_MANUAL.md                   # Complete credentials and zero-key guide
├── NASA_SPACEAPPS_2026_SUBMISSION.md   # Official NASA Space Apps submission dossier
├── package.json                        # Project manifest and scripts
├── vite.config.js                      # Vite bundler configuration
├── index.html                          # Main application entry point
├── src/
│   ├── main.js                         # Application bootstrapper
│   ├── layers/
│   │   ├── weather/                    # NASA GIBS real-time cloud stream
│   │   ├── flights/                    # OpenSky live aircraft telemetry
│   │   └── satellites/                 # CelesTrak NORAD orbit propagation
│   ├── osint/
│   │   ├── climate/                    # GRACE groundwater & Sea Level Rise simulator
│   │   └── satellite/                  # Sentinel-1 SAR & NASA FIRMS thermal layer
│   └── ui/
│       ├── templates/                  # Swiss Monochrome minimalist UI templates
│       └── styles/                     # Pure dark theme CSS stylesheets
```

---

## 🏆 Project Authorship & Credits
- **Lead Developer & System Architect:** **Md Mushfiqur Rahim** ([@MD-Mushfiqur123](https://github.com/MD-Mushfiqur123))
- **Team Name:** **Orion Space**
- **Local Event:** **Barisal, Bangladesh**
- **Challenge:** **Be An Earth System Trend Detective!** — NASA Space Apps Challenge 2026

*Licensed under the [MIT License](LICENSE).*
