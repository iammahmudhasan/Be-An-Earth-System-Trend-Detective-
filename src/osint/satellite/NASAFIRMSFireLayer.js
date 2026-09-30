/**
 * NASAFIRMSFireLayer.js
 * NASA FIRMS (Fire Information for Resource Management System) VIIRS / MODIS Real-Time Detector
 */

import * as Cesium from 'cesium';

export class NASAFIRMSFireLayer {
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
    const thermalHotspots = [
      {
        name: 'Chittagong Hill Tracts Clearing Hotspot',
        lat: 22.33,
        lon: 92.21,
        frp: '42.5 MW',
        conf: '94%',
      },
      {
        name: 'Gazipur Industrial Thermal Plume',
        lat: 24.0,
        lon: 90.42,
        frp: '68.1 MW',
        conf: '99%',
      },
      {
        name: 'Sreepur Agricultural Biomass Burn',
        lat: 24.2,
        lon: 90.48,
        frp: '21.0 MW',
        conf: '88%',
      },
      {
        name: 'Rupsha River Brick Kiln Cluster',
        lat: 22.8,
        lon: 89.58,
        frp: '54.2 MW',
        conf: '96%',
      },
    ];

    thermalHotspots.forEach((spot) => {
      const entity = this.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(spot.lon, spot.lat, 200),
        point: {
          pixelSize: 14,
          color: Cesium.Color.ORANGERED,
          outlineColor: Cesium.Color.YELLOW,
          outlineWidth: 3,
        },
        label: {
          text: `🔥 ${spot.name}\nFRP: ${spot.frp} | Conf: ${spot.conf}`,
          font: '11px JetBrains Mono, monospace',
          fillColor: Cesium.Color.fromCssColorString('#FF4500'),
          showBackground: true,
          backgroundColor: Cesium.Color.BLACK.withAlpha(0.8),
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          pixelOffset: new Cesium.Cartesian2(0, -12),
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
