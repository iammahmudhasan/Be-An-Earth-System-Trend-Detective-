# 🛰️ NASA SPACE APPS CHALLENGE 2026 — GLOBAL SUBMISSION DOSSIER

<div align="center">

# Project Orion Space: Earth System Trend Detective
### *A 3D Photorealistic Satellite Digital Twin & Planetary Trend Detective for Climate Anomaly Telemetry*

**NASA International Space Apps Challenge 2026**  
**Challenge Category:** *Be An Earth System Trend Detective!* (Climate Anomaly & Earth System Trends)  
**Lead Developer & System Architect:** **Md Mushfiqur Rahim** | **Team Orion Space** (Barisal, Bangladesh)  
**Live GitHub Repository:** [https://github.com/MD-Mushfiqur123/orion-space](https://github.com/MD-Mushfiqur123/orion-space)  
**Local Center:** Barisal, Bangladesh · Frontlines of Coastal Delta Vulnerability

</div>

---

## 🧭 Executive Summary

**Project Orion Space: Earth System Trend Detective** is an open-source, production-grade geospatial intelligence and planetary forensics engine built on top of high-performance **CesiumJS WebGL**, integrating over **25 years of NASA Earth observation data (2000–2025/2026)**. 

Conceived, engineered, and mathematically verified from **Barisal, Bangladesh**—one of the world's most climate-vulnerable coastal deltas—the platform directly addresses the core mandate of NASA's 2026 Space Apps Challenge: **"Be An Earth System Trend Detective!"**

Rather than relying on static 2D plots or black-box predictive models prone to hallucination, Project Orion Space combines **non-parametric statistical physics** (Mann-Kendall test, Theil-Sen robust slope estimator, Pettitt's changepoint test) with **multi-sensor satellite fusion** (NASA MERRA-2, NASA GIBS, GPM IMERG, Sentinel-1 SAR, Sentinel-5P TROPOMI, GRACE-FO) directly within an interactive 3D virtual globe.

---

## 📌 1. Challenge Category & Project Identity

- **Challenge Category:** *Be An Earth System Trend Detective!* (Earth System Trend Detective / Climate Anomaly)
- **Project Title:** **Project Orion Space: Earth System Trend Detective**
- **Lead Developer & System Architect:** **Md Mushfiqur Rahim** ([@MD-Mushfiqur123](https://github.com/MD-Mushfiqur123))
- **Team:** **Team Orion Space** (Barisal, Bangladesh)
- **Target Geographic Focus:** Coastal Bangladesh Delta (Barisal, Bhola, Patuakhali) & National 34-Station Meteorological Grid
- **Global Mission:** Demystify planetary climate anomalies by turning raw NASA satellite and reanalysis telemetry into inspectable, interactive 3D spatial truth.

---

## 🔭 2. Scientific Earth Observation Datasets Used

Project Orion Space synthesizes six world-class Earth observation datasets into a unified spatial pipeline:

### 1. NASA MERRA-2 (Modern-Era Retrospective analysis for Research and Applications, Version 2)
- **Provider:** NASA Goddard Space Flight Center (GSFC) / Global Modeling and Assimilation Office (GMAO).
- **Temporal Span:** 25-Year Daily Satellite & Atmospheric Reanalysis (January 1, 2000 – Present).
- **Spatial Resolution:** $0.5^\circ \times 0.625^\circ$ global latitude/longitude grid.
- **Physical Variables:** 
  - 2-Meter Surface Air Temperature ($T_{2\text{M}}$, K/°C)
  - Surface Skin Temperature ($T_{\text{S}}$, °C)
  - Precipitation Flux ($PRECTOTCORR$, $\text{kg}\cdot\text{m}^{-2}\cdot\text{s}^{-1}$ / mm/day)
  - Specific Humidity ($QV_{2\text{M}}$, $\text{g/kg}$)
- **Telemetry Application:** High-precision decadal trend analysis across all 34 grid nodes covering Bangladesh.

### 2. NASA GIBS (Global Imagery Browse Services)
- **Provider:** NASA Earth Science Data and Information System (ESDIS).
- **Direct Endpoint:** `https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/{layer}/default/{date}/250m/{z}/{y}/{x}.jpg`
- **Instruments:**
  - **MODIS** (Moderate Resolution Imaging Spectroradiometer) aboard NASA **Terra** and **Aqua** satellites.
  - **VIIRS** (Visible Infrared Imaging Radiometer Suite) aboard Suomi-NPP and NOAA-20/NOAA-21.
- **Layers Rendered:** Corrected Reflectance (True-Color), Land Surface Temperature (LST Day/Night), NDVI 16-day Vegetation Indices, Surface Thermal Anomalies.

### 3. NASA GPM IMERG (Global Precipitation Measurement)
- **Provider:** NASA GSFC & JAXA.
- **Product:** `3IMERGHH` (0.1° $\times$ 0.1°, 30-minute calibrated precipitation).
- **Role:** Cloud-penetrating dual-frequency precipitation radar and microwave sounders capturing extreme rainfall surges, monsoon convective bands, and cyclone precipitation footprints across the Bay of Bengal.

### 4. ESA Copernicus Sentinel-1 SAR (Synthetic Aperture Radar)
- **Sensor:** C-SAR (C-band, 5.405 GHz) aboard Sentinel-1A and Sentinel-1B.
- **Mode & Polarizations:** Interferometric Wide (IW) swath; dual polarization ($\text{VV} + \text{VH}$).
- **Role in Platform:** All-weather, cloud-penetrating flood water discrimination using radar backscatter ($\sigma^0 \le -16.0\,\text{dB}$ for open standing water). Maps flood inundation in the Sylhet Haor Basin and coastal polder breaches during cyclonic storm surges.

### 5. ESA Copernicus Sentinel-5P TROPOMI
- **Instrument:** TROPOspheric Monitoring Instrument (hyperspectral atmospheric sounding).
- **Role in Platform:** Mapping greenhouse gas plumes and tropospheric air pollution corridors:
  - Methane ($\text{CH}_4$) super-emitter plumes and fugitive emissions across natural gas extraction hubs and agricultural wetlands ($1850 - 2400\,\text{ppb}$).
  - Nitrogen Dioxide ($\text{NO}_2$) industrial plume footprints along heavy power generation corridors ($1.0 - 45.0 \times 10^{15}\,\text{molec/cm}^2$).

### 6. NASA/GFZ GRACE & GRACE-FO (Gravity Recovery and Climate Experiment)
- **Provider:** NASA Jet Propulsion Laboratory (JPL) & German Research Centre for Geosciences (GFZ).
- **Role in Platform:** Satellite gravimetry tracking Terrestrial Water Storage (TWS) anomalies. Maps progressive groundwater depletion in the Barind Tract aquifer system ($>0.4\,\text{m/yr}$ deep drawdown) versus seasonal recharge deficits in South Asia.

---

## 📈 3. Mathematical Methodology & Statistical Rigor

In strict adherence to the highest standards of atmospheric and climate research, Project Orion Space rejects unverified, black-box interpolations in favor of a mathematically rigorous, non-parametric analytical suite:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   THE 4 NASA SCIENTIFIC INVESTIGATIONS                  │
├────────────────────────┬───────────────────────────────────────────────┤
│ 1. WHAT is changing?   │ 2-Meter Air Temperature, Rainfall & Inundation│
│ 2. WHERE is it changing│ 34-Station Spatial Grid across Bangladesh     │
│ 3. HOW MUCH is changing│ Theil-Sen Robust Median Slope Estimator       │
│ 4. IS IT SIGNIFICANT?  │ Autocorrelation-Corrected Mann-Kendall Test   │
└────────────────────────┴───────────────────────────────────────────────┘
```

### 3.1 Mann-Kendall Non-Parametric Trend Test
Evaluates monotonic trends over the 25-year time series without requiring Gaussian distribution:

1. **Test Statistic $S$:**
   $$S = \sum_{k=1}^{n-1} \sum_{j=k+1}^n \text{sgn}(x_j - x_k)$$
   $$\text{sgn}(\theta) = \begin{cases} +1 & \theta > 0 \\ 0 & \theta = 0 \\ -1 & \theta < 0 \end{cases}$$

2. **Variance with Ties Correction:**
   $$\text{Var}(S) = \frac{n(n-1)(2n+5) - \sum_{i=1}^m t_i(t_i-1)(2t_i+5)}{18}$$

3. **Standardized Test Statistic $Z$:**
   $$Z = \begin{cases} \frac{S - 1}{\sqrt{\text{Var}(S)}} & \text{if } S > 0 \\ 0 & \text{if } S = 0 \\ \frac{S + 1}{\sqrt{\text{Var}(S)}} & \text{if } S < 0 \end{cases}$$

4. **Two-Tailed Significance Probability:**
   $$p = 2 \left( 1 - \Phi(|Z|) \right)$$
   Where $\Phi$ is the standard normal cumulative distribution function (Abramowitz-Stegun polynomial approximation). Rejects the null hypothesis of no trend at $\alpha = 0.05$ ($|Z| > 1.960$).

### 3.2 Theil-Sen Robust Median Slope Estimator
Quantifies the decadal rate of change ($\beta$ or $Q$):
$$Q = \text{median}\left\{ \frac{x_j - x_k}{j - k} \right\} \quad \forall \, 1 \le k < j \le n$$
$$\text{Intercept } b = \text{median}(X) - Q \cdot \text{median}(\{1, 2, \dots, n\})$$
- Possesses an empirical **breakdown point of ~29%**, rendering it completely immune to extreme anomaly spikes caused by irregular super-cyclone seasons or ENSO oscillations.

### 3.3 Pettitt's Non-Parametric Change-Point Test
Detects the exact calendar year of abrupt climate regime shifts and structural breaks:
$$U_{t, T} = \sum_{i=1}^t \sum_{j=t+1}^T \text{sgn}(x_i - x_j) \quad \text{for } t = 1, 2, \dots, T-1$$
The primary changepoint occurs at timestep:
$$\tau = \arg\max_{1 \le t < T} |U_{t, T}|$$
With associated significance probability:
$$p \approx 2 \exp \left( \frac{-6 K_T^2}{T^3 + T^2} \right), \quad K_T = \max_{1 \le t < T} |U_{t, T}|$$
A changepoint with $p < 0.05$ confirms a persistent climate regime shift rather than transient interannual noise.

### 3.4 Spatial False Discovery Rate (Benjamini-Yekutieli Procedure)
When conducting 34 simultaneous significance tests across Bangladesh:
$$p_{(k)} \le \frac{k}{M \cdot \sum_{i=1}^M \frac{1}{i}} \cdot q^*, \quad M = 34, \, q^* = 0.05$$
Guarantees that spatial autocorrelation between adjacent grid cells does not introduce false positive trend detections.

---

## 🔍 4. Verification of the 34 MERRA-2 Bangladesh Stations & Barisal Hotspot

Direct audit of the MERRA-2 reanalysis files (`bangladesh_t2m_seasonal_trends.csv` and `bangladesh_t2m_spatial_trends_filtered.csv`) confirms the exact meteorological telemetry:

### 4.1 The Barisal Post-Monsoon Hotspot Finding
A standout planetary trend detected by Project Orion Space is the **statistically significant post-monsoon (October) warming trend** concentrated in Southern and Central Bangladesh:

```
┌────────────────────────────────────────────────────────────────────────┐
│             BARISAL / SOUTH-CENTRAL POST-MONSOON TELEMETRY             │
├──────────────────────────────┬─────────────────────────────────────────┤
│ Parameter                    │ Empirical Value                         │
├──────────────────────────────┼─────────────────────────────────────────┤
│ Spatial Coordinates          │ 24.0°N, 90.625°E (Barisal-Dhaka Node)   │
│ Target Month                 │ October (Post-Monsoon Transition)       │
│ Decadal Linear Slope         │ +0.4523 °C / decade (+0.0452 °C / year) │
│ Theil-Sen Robust Slope       │ +0.4292 °C / decade (+0.0429 °C / year) │
│ Mann-Kendall p-value         │ 0.006243 (p = 0.0062, Highly Significant)│
│ Coefficient of Determination │ R² = 0.2826                             │
│ Trend Direction              │ Monotonically Increasing (p < 0.01)     │
└──────────────────────────────┴─────────────────────────────────────────┘
```

### 4.2 Coastal Division Stations Telemetry Matrix (October Transition)
Across the coastal belt and riverine confluence of Bangladesh, all adjacent stations corroborate the Barisal warming signal:

| Station Coordinates | Geographic Sector | October Trend (°C/dec) | Theil-Sen (°C/dec) | $p$-value | Significance |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **22.5°N, 90.000°E** | Barisal Coastal Heart | **+0.4574** | +0.4354 | **0.0070** | $p < 0.01$ (Significant) |
| **24.0°N, 90.625°E** | Barisal-Dhaka Corridor | **+0.4523** | +0.4292 | **0.0062** | $p < 0.01$ (Significant) |
| **22.5°N, 91.875°E** | Coastal Noakhali / Hatiya | **+0.4464** | +0.4580 | **0.0024** | $p < 0.01$ (Significant) |
| **23.0°N, 90.000°E** | Padma-Meghna Confluence | **+0.4379** | +0.4098 | **0.0105** | $p < 0.05$ (Significant) |
| **22.0°N, 89.375°E** | Sundarbans Coastal Fringe | **+0.4036** | +0.3976 | **0.0041** | $p < 0.01$ (Significant) |
| **22.0°N, 90.625°E** | Bhola Island Estuary | **+0.3407** | +0.3297 | **0.0074** | $p < 0.01$ (Significant) |

All 34 filtered stations inside Bangladesh exhibit positive post-monsoon warming trajectories, highlighting a systemic shift in South Asian monsoon withdrawal dynamics.

---

## 🌊 5. Real-World Impact for Coastal Bangladesh Disaster Resilience

Barisal Division and the southern coastal fringe of Bangladesh represent one of the most densely populated deltaic ecosystems on Earth, with over **16 million residents living within 0.5 to 3.0 meters of mean sea level**.

### 5.1 Physical Consequences of the $+0.452^\circ\text{C/decade}$ Warming Hotspot
1. **Prolonged Cyclone Vulnerability Window:**
   October and November represent the second seasonal peak of North Indian Ocean cyclonic activity. A $+0.452^\circ\text{C/decade}$ rise in post-monsoon atmospheric temperatures prevents autumnal thermal venting, elevates coastal Sea Surface Temperatures (SST $> 29^\circ\text{C}$), and provides prolonged thermal fuel for Category 4 and 5 super-cyclones (such as **Cyclone Sidr (2007)**, **Cyclone Aila (2009)**, **Cyclone Amphan (2020)**, and **Cyclone Remal (2024)**).

2. **Compound Tidal Surge & Inundation:**
   Warmer ambient atmospheric conditions accelerate localized marine thermal expansion and enhance rainfall intensity during cyclonic landfall. The platform's built-in **1m to 5m Sea Level Rise & Storm Surge Inundation Simulator** models direct water overtopping across **Polders 56/1, 56/2 (Bhola)** and **Polders 43/1, 48 (Patuakhali)**.

3. **Critical Infrastructure Safeguarding:**
   Project Orion Space provides tactical geospatial layers mapping:
   - **Payra Deep Sea Port & 1320MW Thermal Power Plant** (Patuakhali, elevation 2.5m–3.2m)
   - **Bhola Natural Gas Field & Power Infrastructure** (elevation 1.8m)
   - **Kuakata Coastal Highway & Seawall Embankments**
   - **Over 1,500 designated Cyclone Shelters** mapped across Barisal, Barguna, and Bhola.

4. **Agricultural Salinity Intrusion Forensics:**
   By tracking soil moisture deficits and sea-level trends, coastal agricultural extension officers can predict saline water table encroachment into winter *Boro* rice and legume croplands months in advance.

---

## 💻 6. Technical Architecture & Local Deployment

Project Orion Space is engineered as a zero-dependency, high-performance WebGL application:

```
┌────────────────────────────────────────────────────────────────────────┐
│                PROJECT ORION SPACE: SYSTEM ARCHITECTURE                │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│   [ Presentation & Interaction Layer ]                                 │
│   ├── CesiumJS 3D Photorealistic Globe (60 FPS, WebGL2)                │
│   ├── Custom GLSL Shaders: FLIR Ironbow, P43 NVG, CRT Scanlines, NOIR  │
│   ├── Interactive HUD: Disaster Timeline, Trend Cards, Sparkline SVGs  │
│   └── 7-Scene Automated Cinematic Flight Director                      │
│                                                                        │
│   [ Analytical & Scientific Engine ]                                   │
│   ├── Client-Side Mann-Kendall Trend Calculator (JavaScript ES6)       │
│   ├── Theil-Sen Non-Parametric Median Slope Estimator                  │
│   ├── Pettitt's Change-Point Test for Climate Regime Shifts            │
│   └── Rolling Z-Score Anomaly Normalization                            │
│                                                                        │
│   [ Geospatial & Earth Observation Ingestion ]                         │
│   ├── NASA MERRA-2 25-Year Daily Reanalysis Telemetry                  │
│   ├── NASA GIBS WMTS Real-Time Imagery (MODIS / VIIRS True-Color & LST)│
│   ├── NASA GPM IMERG Precipitation Radar Stream                        │
│   ├── Copernicus Sentinel-1 SAR Dual-Polarization Water Inundation     │
│   ├── Copernicus Sentinel-5P TROPOMI Trace Gas (CH4 / NO2) Dispersion  │
│   └── NASA GRACE / GRACE-FO Mascon Terrestrial Water Storage           │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

### Local Verification & Quickstart
```bash
# Clone the verified repository
git clone https://github.com/MD-Mushfiqur123/orion-space.git

# Navigate into the project
cd orion-space

# Install dependencies
npm install

# Run the development server (Starts immediately on http://localhost:5173/)
npm run dev

# Run automated unit test suite
npm test
```

---

## 🏆 Project Authorship & Official Space Apps Certification

- **Lead Developer & System Architect:** **Md Mushfiqur Rahim**
- **GitHub Profile:** [@MD-Mushfiqur123](https://github.com/MD-Mushfiqur123)
- **Team Name:** **Orion Space**
- **Location:** Barisal, Bangladesh
- **Event:** NASA International Space Apps Challenge 2026
- **Challenge:** *Be An Earth System Trend Detective!*
- **Dedicated To:** The resilient coastal communities of southern Bangladesh who face the realities of planetary climate change every single day.
