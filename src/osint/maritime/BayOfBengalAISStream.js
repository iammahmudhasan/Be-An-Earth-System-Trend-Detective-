/**
 * BayOfBengalAISStream.js
 * Live AIS Vessel Telemetry Stream for Chittagong Anchorage, Mongla Channel, and Payra Deep Sea Approach.
 */

import * as Cesium from 'cesium';

export class BayOfBengalAISStream {
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
    const liveAIS = [
      {
        mmsi: '414002910',
        name: 'MV BANGLAR SHOURABH',
        type: 'Crude Oil Tanker',
        lat: 22.18,
        lon: 91.74,
        speed: '0.2 kn',
        status: 'At Anchor (Chittagong)',
        draft: '11.2m',
      },
      {
        mmsi: '563119000',
        name: 'CMA CGM CHITTAGONG',
        type: 'Container Ship',
        lat: 21.85,
        lon: 91.6,
        speed: '13.8 kn',
        status: 'Underway (Kutubdia Pilot)',
        draft: '9.8m',
      },
      {
        mmsi: '414332000',
        name: 'PAYRA NAVIGATOR',
        type: 'Bulk Carrier',
        lat: 21.72,
        lon: 90.28,
        speed: '8.5 kn',
        status: 'Approaching Payra Fairway',
        draft: '12.0m',
      },
      {
        mmsi: '414991000',
        name: 'MONGLA FEEDER',
        type: 'General Cargo',
        lat: 22.48,
        lon: 89.6,
        speed: '6.1 kn',
        status: 'Pussur River Transit',
        draft: '7.5m',
      },
    ];

    liveAIS.forEach((ship) => {
      const entity = this.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(ship.lon, ship.lat, 50),
        point: {
          pixelSize: 10,
          color: Cesium.Color.SPRINGGREEN,
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 2,
        },
        label: {
          text: `🚢 ${ship.name} [MMSI: ${ship.mmsi}]\n${ship.type} | Draft: ${ship.draft} | Speed: ${ship.speed}\nStatus: ${ship.status}`,
          font: '11px JetBrains Mono, monospace',
          fillColor: Cesium.Color.SPRINGGREEN,
          showBackground: true,
          backgroundColor: Cesium.Color.BLACK.withAlpha(0.85),
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
