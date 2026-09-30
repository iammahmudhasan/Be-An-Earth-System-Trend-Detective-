# 🚀 NASA Space Apps Challenge 2026 — Official Submission Copy-Paste Guide
> **Team:** Orion Space  
> **Challenge:** *Be An Earth System Trend Detective!*  
> **Lead Developer & System Architect:** **Md Mushfiqur Rahim**  
> **Location:** Barisal, Bangladesh  
> **Repository:** https://github.com/MD-Mushfiqur123/orion-space  

---

## 📋 FIELD 1: Project Title
```text
Project Orion Space: Earth System Trend Detective
```

---

## 📋 FIELD 2: Team Name & Members
- **Team Name:** `Orion Space`
- **Lead Developer & System Architect:** `Md Mushfiqur Rahim`
- **Location:** `Barisal, Bangladesh`

---

## 📋 FIELD 3: Selected Challenge
```text
Be An Earth System Trend Detective!
```

---

## 📋 FIELD 4: Short Description (High-Level Summary)
```text
Project Orion Space is a 3D satellite digital twin and non-parametric climate forensics engine engineered from coastal Barisal, Bangladesh. Integrating 25 years of NASA MERRA-2 daily reanalysis and GIBS satellite imagery, it answers NASA's 4 core questions: detecting the +0.457°C/decade post-monsoon warming hotspot in the Barisal coastal delta with robust Mann-Kendall statistical significance (p=0.0070).
```

---

## 📋 FIELD 5: Detailed Project Description

### 1. Challenge & Context
Bangladesh's southern coastal delta—home to 16 million people living within 0.5–3m of sea level—stands at the extreme frontlines of planetary climate disruption. The official NASA 2026 challenge *"Be An Earth System Trend Detective!"* asks four critical scientific questions:
1. **What is changing?** (Surface temperature, precipitation, and sea level)
2. **Where is it changing?** (Across a 34-station national meteorological grid)
3. **How much is it changing?** (Quantified via Theil-Sen robust median slope)
4. **Is it statistically significant?** (Verified via autocorrelation-corrected Mann-Kendall tests)

### 2. Our Approach: "LLM ≠ Scientific Calculator"
Rather than relying on black-box AI generators prone to hallucinations, Project Orion Space separates computation from interface:
- **Scientific Engine (Source of Truth):** Directly ingests 25 years (2001–2025) of NASA MERRA-2 daily reanalysis data via NASA POWER API.
- **Statistical Rigor:** Calculates OLS linear regression, Theil-Sen non-parametric median slopes, Mann-Kendall rank correlation p-values, and Pettitt's changepoint tests.
- **Orion Map Harness Agent:** An autonomous in-console voice and natural-language interface allowing operators and judges to command the globe, fly to anomalies, and inspect evidence dossiers in English, Bangla, and Banglish.

### 3. Key Scientific Breakthrough: Seasonal Dissociation & Barisal Hotspot
- **Annual Mean Concealment:** Evaluating only annual averages masks extreme seasonal vulnerabilities (+0.03°C/decade annual trend).
- **Post-Monsoon Warming Hotspot:** In October (critical autumn transition), Southern Bangladesh experiences rapid warming of **+0.457°C / decade** (+0.0457°C / year) with **Theil-Sen slope of +0.0435°C / year** and **p = 0.0070** ($p < 0.01$, highly significant).
- **National Significance:** **31 of 34 stations** in October (91.2%) and **33 of 34 stations** in September (97.1%) exhibit statistically significant warming ($p < 0.05$).
- **Physical Impact:** This thermal delay elevates Bay of Bengal Sea Surface Temperatures (>29°C), extending cyclone seasons (Sidr, Aila, Remal) and amplifying saline water intrusion into coastal agriculture.

### 4. Technical Architecture & Multi-Sensor Fusion
- **CesiumJS 3D WebGL Engine:** Photorealistic 60 FPS globe rendering digital elevation models and 1m–5m sea level surge inundation.
- **Live NASA GIBS WMTS Streaming:** Near real-time satellite cloud overlays from MODIS Terra/Aqua and VIIRS.
- **Tactical Sensor Modes:** Real-time GLSL post-processing shaders including FLIR Thermal (Ironbow), P43 Night Vision (NVG), and Swiss Monochrome Noir.

---

## 📋 FIELD 6: Space Agency Data & Resources Used
1. **NASA MERRA-2 (Modern-Era Retrospective analysis for Research and Applications, Version 2):**
   - 2-meter air temperature ($T_{2\text{M}}$), surface skin temperature, and precipitation flux across 34 grid points in Bangladesh.
   - Accessed via NASA POWER API: `https://power.larc.nasa.gov/`
2. **NASA GIBS (Global Imagery Browse Services):**
   - High-resolution daily satellite imagery (MODIS Corrected Reflectance True-Color, Land Surface Temperature).
   - WMTS Endpoint: `https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/`
3. **NASA GPM IMERG (Global Precipitation Measurement):**
   - Calibrated 30-minute precipitation radar tracking monsoon convective surges and Bay of Bengal cyclonic rainfall.
4. **NASA/GFZ GRACE & GRACE-FO:**
   - Satellite gravimetry mascon data tracking groundwater depletion trends in the Northwest Barind Tract.
5. **ESA Copernicus Sentinel-1 SAR & Sentinel-5P TROPOMI:**
   - C-band SAR radar flood inundation mapping and hyperspectral methane ($\text{CH}_4$) / $\text{NO}_2$ plume monitoring.

---

## 📋 FIELD 7: Project Links
- **GitHub Repository (Code & Telemetry):** https://github.com/MD-Mushfiqur123/orion-space
- **Submission Dossier:** https://github.com/MD-Mushfiqur123/orion-space/blob/main/NASA_SPACEAPPS_2026_SUBMISSION.md
- **API Manual (Zero-Key Setup):** https://github.com/MD-Mushfiqur123/orion-space/blob/main/API_KEY_MANUAL.md

---

## 📋 FIELD 8: 7-Slide Pitch Structure (For Presentation Deck / 2-Min Pitch)
- **Slide 1:** Title, Team Orion Space (Barisal, Bangladesh), NASA Space Apps 2026.
- **Slide 2:** The Problem — Coastal Bangladesh at the frontlines & why static 2D climate reports fail.
- **Slide 3:** The Scientific Engine — NASA MERRA-2 daily data + Theil-Sen & Mann-Kendall statistical proof.
- **Slide 4:** The Discovery — Post-Monsoon Barisal Hotspot (+0.457°C/decade, p=0.0070) & Seasonal Dissociation.
- **Slide 5:** The Platform — 3D CesiumJS globe, NASA GIBS live clouds, FLIR thermal shaders, 1m–5m surge simulation.
- **Slide 6:** Autonomous Map Harness Agent — Voice & multi-lingual command interface with floating evidence dossiers.
- **Slide 7:** Real-World Impact & Open Source Roadmap for disaster managers and coastal delta resilience.
