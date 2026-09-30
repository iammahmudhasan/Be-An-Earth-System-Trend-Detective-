import * as Cesium from 'cesium';

/**
 * Camera presets for notable locations.
 * Phase 1 default: fly to Austin, TX on load.
 */
export const CAMERA_PRESETS = {
  bangladesh: {
    destination: Cesium.Cartesian3.fromDegrees(90.3563, 23.685, 650000),
    orientation: {
      heading: Cesium.Math.toRadians(0),
      pitch: Cesium.Math.toRadians(-60),
      roll: 0.0,
    },
  },
  dhaka: {
    destination: Cesium.Cartesian3.fromDegrees(90.4125, 23.8103, 12000),
    orientation: {
      heading: Cesium.Math.toRadians(0),
      pitch: Cesium.Math.toRadians(-45),
      roll: 0.0,
    },
  },
  barisal: {
    destination: Cesium.Cartesian3.fromDegrees(90.3667, 22.701, 18000),
    orientation: {
      heading: Cesium.Math.toRadians(15),
      pitch: Cesium.Math.toRadians(-35),
      roll: 0.0,
    },
  },
  bayOfBengal: {
    destination: Cesium.Cartesian3.fromDegrees(90.5, 21.5, 350000),
    orientation: {
      heading: Cesium.Math.toRadians(0),
      pitch: Cesium.Math.toRadians(-50),
      roll: 0.0,
    },
  },
  austin: {
    destination: Cesium.Cartesian3.fromDegrees(-97.7431, 30.2672, 800),
    orientation: {
      heading: Cesium.Math.toRadians(0),
      pitch: Cesium.Math.toRadians(-35),
      roll: 0.0,
    },
  },
  sf: {
    destination: Cesium.Cartesian3.fromDegrees(-122.4194, 37.7749, 1000),
    orientation: {
      heading: Cesium.Math.toRadians(30),
      pitch: Cesium.Math.toRadians(-30),
      roll: 0.0,
    },
  },
  nyc: {
    destination: Cesium.Cartesian3.fromDegrees(-73.9857, 40.7484, 1200),
    orientation: {
      heading: Cesium.Math.toRadians(-20),
      pitch: Cesium.Math.toRadians(-30),
      roll: 0.0,
    },
  },
};

/**
 * Fly the camera to a preset location with a smooth animation.
 */
export function flyToPreset(viewer, presetName, duration = 3.0) {
  const preset = CAMERA_PRESETS[presetName];
  if (!preset) return;

  viewer.camera.flyTo({
    destination: preset.destination,
    orientation: preset.orientation,
    duration,
    easingFunction: Cesium.EasingFunction.CUBIC_IN_OUT,
  });
}

/**
 * Set camera to Bangladesh on load with a cinematic fly-in.
 * @returns {Function} Cancels the pending or active startup flight.
 */
export function flyToBangladesh(viewer) {
  // Start from space above South Asia
  viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(90.3563, 23.685, 4500000),
    orientation: {
      heading: Cesium.Math.toRadians(0),
      pitch: Cesium.Math.toRadians(-90),
      roll: 0.0,
    },
  });

  // Cinematic fly-in directly over Bangladesh
  const timer = setTimeout(() => {
    if (viewer.isDestroyed()) return;
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(90.3563, 23.685, 850000),
      orientation: {
        heading: Cesium.Math.toRadians(0),
        pitch: Cesium.Math.toRadians(-65),
        roll: 0.0,
      },
      duration: 3.5,
      easingFunction: Cesium.EasingFunction.CUBIC_IN_OUT,
    });
  }, 400);

  return () => {
    clearTimeout(timer);
    if (!viewer.isDestroyed()) viewer.camera.cancelFlight();
  };
}

export const flyToAustin = flyToBangladesh;
