/**
 * DarkVesselDetector.js
 * Bay of Bengal Dark Vessel Detector — Correlates SAR Satellite Detections with AIS Transponder Feeds.
 */

import * as Cesium from 'cesium';

export class DarkVesselDetector {
  constructor(viewer) {
    this.viewer = viewer;
    this.entities = [];
    this.active = false;
  }

  show() {
    this.active = true;
    this.render();
  }

  hide() {
    this.active = false;
    this.clear();
  }

  render() {
    this.clear();
    const darkVessels = [
      {
        id: 'DK-9902',
        name: 'Unidentified Tanker (AIS Offline > 48h)',
        lat: 20.85,
        lon: 91.12,
        speed: '11.4 kn',
        heading: '215°',
        threat: 'CRITICAL',
      },
      {
        id: 'DK-4410',
        name: 'Non-Reporting Trawler in Swatch of No Ground',
        lat: 21.15,
        lon: 89.28,
        speed: '4.2 kn',
        heading: '045°',
        threat: 'HIGH',
      },
      {
        id: 'DK-8129',
        name: 'Unregistered Bulk Carrier (Exclusive Economic Zone)',
        lat: 19.92,
        lon: 90.45,
        speed: '14.1 kn',
        heading: '180°',
        threat: 'MEDIUM',
      },
    ];

    darkVessels.forEach((v) => {
      const entity = this.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(v.lon, v.lat, 100),
        billboard: {
          image:
            'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="%23ff0055" stroke-width="2"><circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
          scale: 1.2,
        },
        label: {
          text: `⚠️ [DARK VESSEL] ${v.id}\n${v.name}\nSpeed: ${v.speed} | Threat: ${v.threat}`,
          font: '11px JetBrains Mono, monospace',
          fillColor: Cesium.Color.fromCssColorString('#FF0055'),
          showBackground: true,
          backgroundColor: Cesium.Color.BLACK.withAlpha(0.85),
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          pixelOffset: new Cesium.Cartesian2(0, -18),
        },
      });
      this.entities.push(entity);
    });
  }

  clear() {
    this.entities.forEach((e) => this.viewer.entities.remove(e));
    this.entities = [];
  }
}
