/**
 * GlobalFishingWatchLayer.js
 * Apparent Fishing Effort Heatmaps & Marine Protected Area Encroachment Engine.
 */

import * as Cesium from 'cesium';

export class GlobalFishingWatchLayer {
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
    const fishingZones = [
      {
        name: 'Nijhum Dwip Marine Protected Area Perimeter',
        lat: 21.9,
        lon: 91.05,
        effortHours: '1,420 hrs',
        status: 'PROTECTED_ENCROACHMENT',
      },
      {
        name: 'Saint Martin Coral Sanctuary Outer Zone',
        lat: 20.6,
        lon: 92.35,
        effortHours: '890 hrs',
        status: 'SANCTUARY_SURVEILLANCE',
      },
      {
        name: 'Middle Ground Commercial Trawling Grid',
        lat: 20.4,
        lon: 90.8,
        effortHours: '5,200 hrs',
        status: 'ACTIVE_HARVEST',
      },
    ];

    fishingZones.forEach((z) => {
      const isEncroachment = z.status.includes('ENCROACHMENT');
      const entity = this.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(z.lon, z.lat),
        ellipse: {
          semiMinorAxis: 20000.0,
          semiMajorAxis: 20000.0,
          material: isEncroachment
            ? Cesium.Color.PURPLE.withAlpha(0.5)
            : Cesium.Color.DEEPSKYBLUE.withAlpha(0.4),
          outline: true,
          outlineColor: Cesium.Color.WHITE,
        },
        label: {
          text: `🎣 ${z.name}\nEffort: ${z.effortHours} | Status: ${z.status}`,
          font: '11px JetBrains Mono, monospace',
          fillColor: Cesium.Color.WHITE,
          showBackground: true,
          backgroundColor: Cesium.Color.BLACK.withAlpha(0.8),
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          pixelOffset: new Cesium.Cartesian2(0, -15),
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
