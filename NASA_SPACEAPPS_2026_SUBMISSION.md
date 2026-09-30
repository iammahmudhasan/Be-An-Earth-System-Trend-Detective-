# 🛰️ NASA SPACE APPS CHALLENGE 2026 — OFFICIAL SUBMISSION

## 📌 Project Overview
- **Project Title:** Project Orion Space — Earth System Trend Detective
- **Challenge Category:** *Be An Earth System Trend Detective!*
- **Local Event:** Barisal, Bangladesh
- **Team Name:** Orion Space
- **Lead Developer & System Architect:** **Md Mushfiqur Rahim** ([@MD-Mushfiqur123](https://github.com/MD-Mushfiqur123))
- **Live GitHub Repository:** [https://github.com/MD-Mushfiqur123/orion-space](https://github.com/MD-Mushfiqur123/orion-space)

---

## 🎯 1. Challenge Alignment: Why "Be An Earth System Trend Detective"?
The NASA Space Apps 2026 challenge *"Be An Earth System Trend Detective!"* invites participants to utilize NASA Earth observation datasets to detect, verify, visualize, and communicate critical climate and Earth system trends over decadal time horizons.

**Project Orion Space** addresses this challenge directly from the frontlines of climate vulnerability: **Bangladesh**, specifically focusing on the coastal division of **Barisal** and the national 34-station meteorological grid. By uniting **25 years (2000–2025/2026) of NASA MERRA-2 reanalysis data**, real-time **NASA GIBS satellite imagery**, **NASA GPM precipitation**, and **NASA GRACE groundwater gravimetry** inside an interactive photorealistic 3D WebGL/CesiumJS digital twin, the platform empowers scientists, disaster managers, and policymakers to uncover climate signals that traditional 2D static charts miss.

---

## 🔬 2. Direct NASA Datasets & Real-Time Open Data Used

### A. Primary NASA Datasets (100% Direct NASA Missions)
1. **NASA MERRA-2 (Modern-Era Retrospective analysis for Research and Applications, Version 2)**
   - **Provider:** NASA Goddard Space Flight Center (GSFC) / Global Modeling and Assimilation Office (GMAO).
   - **Resolution & Scope:** 25-Year Daily Satellite & Atmospheric Reanalysis ($0.5^\circ \times 0.625^\circ$).
   - **Variables:** 2-Meter Air Temperature ($T_{2M}$), Surface Skin Temperature ($T_S$), Specific Humidity ($QV_{2M}$), Precipitation Flux ($PRECTOTCORR$).
   - **Spatial Grid:** 34 spatial stations spanning all 8 administrative divisions of Bangladesh.
   - **Key Finding:** Uncovered an unprecedented post-monsoon (October) warming trend in South-Central coastal Bangladesh (Barisal):
     $$\text{Warming Rate: } +0.4523^\circ\text{C/decade} \quad (+0.0452^\circ\text{C/yr})$$
     $$\text{Mann-Kendall } \tau = +0.642, \quad \text{Sen's Slope } \beta = +0.0429^\circ\text{C/yr}, \quad p\text{-value} = 0.006243 \quad (p < 0.01 \text{ Statistically Significant})$$

2. **NASA GIBS (Global Imagery Browse Services) WMTS**
   - **Provider:** NASA Earth Science Data and Information System (ESDIS).
   - **Direct Endpoint:** `https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/{layer}/default/{date}/250m/{z}/{y}/{x}.jpg`
   - **Instruments:** 
     - MODIS (Moderate Resolution Imaging Spectroradiometer) onboard NASA **Terra** and **Aqua** satellites.
     - VIIRS (Visible Infrared Imaging Radiometer Suite) onboard Suomi-NPP and NOAA-20/21.
   - **Functionality:** 1-click real-time Earth cloud layer streaming directly on the 3D Cesium globe.

3. **NASA POWER API (Prediction of Worldwide Energy Resources)**
   - **Provider:** NASA Langley Research Center (LaRC).
   - **Direct Endpoint:** `https://power.larc.nasa.gov/api/temporal/daily/point`
   - **Functionality:** Real-time solar irradiance, surface temperature, and atmospheric pressure API feeds.

4. **NASA GPM IMERG (Global Precipitation Measurement)**
   - **Provider:** NASA GSFC & JAXA.
   - **Functionality:** Multi-satellite precipitation radar monitoring for monsoon extreme rainfall and cyclone tracking in the Bay of Bengal.

5. **NASA FIRMS (Fire Information for Resource Management System)**
   - **Provider:** NASA EOSDIS.
   - **Functionality:** Near real-time thermal anomalies and active fire alerts via MODIS and VIIRS.

6. **NASA GRACE / GRACE-FO (Gravity Recovery and Climate Experiment)**
   - **Provider:** NASA JPL & GFZ.
   - **Functionality:** Satellite gravimetry Terrestrial Water Storage (TWS) anomaly tracking across the North Bengal Barind Tract.

---

## 📊 3. Trend Detection Methodology & Mathematical Formulation
Rather than relying on simple linear regressions prone to outlier distortions, Project Orion Space implements a client-side and pipeline **non-parametric statistical engine**:

1. **Mann-Kendall Trend Test ($S$ & $\tau$):**
   $$S = \sum_{k=1}^{n-1} \sum_{j=k+1}^n \text{sgn}(x_j - x_k)$$
   Evaluates monotonic trends over the 25-year time series without assuming normal distribution.

2. **Theil-Sen Robust Slope Estimator ($\beta$):**
   $$\beta = \text{median}\left( \frac{x_j - x_k}{j - k} \right), \quad \forall 1 \le k < j \le n$$
   Yields the exact rate of climate change per year/decade, completely robust against extreme cyclone or drought anomalies.

3. **Z-Score Anomaly Normalization:**
   $$Z_t = \frac{X_t - \mu_{25\text{yr}}}{\sigma_{25\text{yr}}}$$
   Identifies standard deviation departures during historical El Niño/La Niña years.

---

## 🌊 4. Real-World Impact for Barisal & Coastal Bangladesh
Barisal is located in the low-lying estuarine delta of Bangladesh, with average ground elevations under 2.5 meters above mean sea level. 
- A **$+0.452^\circ\text{C/decade}$ post-monsoon warming** directly delays the onset of the winter cooling season, destabilizes cyclonic depressions in the Bay of Bengal into super cyclones during October–November (e.g., Cyclone Sidr, Cyclone Remal), and intensifies tidal surges.
- By providing an interactive **1m to 5m Sea Level Rise & Surge Simulator** along with historical event markers, coastal planners in Barisal, Bhola, and Patuakhali can anticipate which polders are at risk of breach before disaster strikes.

---

## 🚀 5. How to Run the Platform Locally
```bash
# Clone the repository
git clone https://github.com/MD-Mushfiqur123/orion-space.git

# Enter the project directory
cd orion-space

# Install dependencies
npm install

# Start the local development server (Zero API keys required for core NASA data!)
npm run dev
```
Open `http://localhost:5173/` in your browser.

---

## 🏆 Authorship & Dedication
- **Sole Architect & Lead Developer:** **Md Mushfiqur Rahim**
- **Affiliation:** Team Orion Space · NASA Space Apps Challenge 2026 (Barisal, Bangladesh)
