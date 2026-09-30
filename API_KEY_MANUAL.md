# 🔑 API KEY & CREDENTIALS MANUAL
### Project Orion Space — NASA Space Apps Challenge 2026
**Author & System Architect:** **Md Mushfiqur Rahim** ([@MD-Mushfiqur123](https://github.com/MD-Mushfiqur123))

---

## ⚡ Executive Summary: Does it work without API keys?
**YES! 100% Out-of-the-Box Functionality.**  
When you clone and run `npm run dev`, the entire core application works immediately **without entering any API keys**. The Cesium globe launches on keyless Esri/OSM imagery, real-time live flights stream from OpenSky public feeds, real satellites orbit via CelesTrak NORAD TLEs, and real-time NASA clouds stream directly from NASA GIBS WMTS.

---

## 🟢 TIER 1: ZERO KEY REQUIRED (100% Free & Open Out-of-the-Box)
These services work immediately with zero signups or tokens:

| Service / Data Feed | Mission / Source | Endpoint / Method | Description |
| :--- | :--- | :--- | :--- |
| **NASA GIBS WMTS** | NASA EOSDIS (MODIS / VIIRS) | `https://gibs.earthdata.nasa.gov/wmts/...` | Streams real-time satellite cloud cover directly onto the 3D globe via the `☁️ REAL CLOUDS` button. |
| **NASA POWER API** | NASA Langley Research Center | `https://power.larc.nasa.gov/api/temporal/daily/point` | Daily 25-year temperature and solar radiation timeseries for any coordinate. |
| **NASA MERRA-2 Telemetry** | NASA Goddard GSFC / GMAO | Bundled 25-Year Reanalysis Dataset | 34 station Bangladesh climate records with Mann-Kendall and Sen's slope metrics. |
| **CelesTrak NORAD TLEs** | CelesTrak / Space-Track | `/api/celestrak/stations` | Live orbital telemetry for ISS, Bangabandhu Satellite-1, and 6,000+ active satellites. |
| **OpenSky Network (Public)** | OpenSky Network | `/api/opensky/states/all` | Live commercial and general aviation flight tracker across the globe. |
| **Open-Meteo Weather** | National Weather Services | `https://api.open-meteo.com/v1/forecast` | Current temperature, wind vectors, and humidity telemetry. |
| **Radio-Browser API** | Community Radio Servers | `/api/radio/stations` | Live air traffic control (ATC) and regional radio stations worldwide. |

---

## 🟡 TIER 2: 100% FREE KEYS (Recommended for Pro Features)
To unlock high-resolution photorealistic 3D Google buildings and high-frequency real-time updates, you can optionally register for free developer keys in under 60 seconds:

### 1. Cesium ion Token (Recommended for Photorealistic 3D Tiles)
- **What it does:** Unlocks Cesium World Terrain, Google Photorealistic 3D Tiles, and Bing Maps Aerial.
- **Cost:** Free Tier (Includes 50,000 tile views / month forever).
- **How to get it in 60s:**
  1. Visit: [https://ion.cesium.com/signup](https://ion.cesium.com/signup)
  2. Sign in with GitHub or Google.
  3. Go to **Access Tokens** → Copy your default access token.
  4. Paste into `.env`:
     ```env
     CESIUM_ION_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
     ```

### 2. NASA FIRMS Map Key (For Active Fire & Thermal Tracking)
- **What it does:** Real-time satellite alerts of wildfires and agricultural stubble burning.
- **Cost:** 100% Free (Provided by NASA EOSDIS).
- **How to get it in 60s:**
  1. Visit: [https://firms.modaps.eosdis.nasa.gov/api/map_key/](https://firms.modaps.eosdis.nasa.gov/api/map_key/)
  2. Enter your email address and click "Generate Map Key".
  3. Copy the key from your confirmation email.
  4. Paste into `.env`:
     ```env
     FIRMS_MAP_KEY=your_nasa_firms_key_here
     ```

### 3. OpenSky Network Account (Optional - Higher Rate Limits)
- **What it does:** Increases anonymous 400 requests/day rate limit to 4,000 requests/day for flight tracking.
- **Cost:** 100% Free.
- **How to get it:**
  1. Sign up at [https://opensky-network.org/index.php?option=com_users&view=registration](https://opensky-network.org/index.php?option=com_users&view=registration)
  2. Add your username and password or OAuth credentials to `.env`:
     ```env
     OPENSKY_USERNAME=your_username
     OPENSKY_PASSWORD=your_password
     ```

### 4. AISStream API Key (Optional - Live Marine Ships)
- **What it does:** Live WebSocket vessel tracking in the Bay of Bengal and global maritime corridors.
- **Cost:** 100% Free for non-commercial/academic use.
- **How to get it:**
  1. Sign up at [https://aisstream.io/](https://aisstream.io/)
  2. Copy your API Key from the dashboard.
  3. Paste into `.env`:
     ```env
     AISSTREAM_API_KEY=your_aisstream_key_here
     ```

---

## 🛠️ How to Configure Environment Variables
1. In the project root, create a file named `.env` (or copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and fill in any keys you want to activate.
3. Restart the server:
   ```bash
   npm run dev
   ```
Alternatively, click the **`⚡ POWER UP`** button inside the app interface (bottom-right) to enter keys directly into the web UI without manually opening files!
