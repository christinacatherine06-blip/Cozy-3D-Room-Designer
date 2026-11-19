
export function createCamera() {
  // Original camera position: [12, 9, 13]
  const initialEye = [12, 9, 13];
  const target = [0, 1.5, 0];

  const dx = initialEye[0] - target[0];
  const dy = initialEye[1] - target[1];
  const dz = initialEye[2] - target[2];

  const initialDistance = Math.hypot(dx, dy, dz);
  const initialYaw = Math.atan2(dx, dz);
  const initialPitch = Math.asin(dy / initialDistance);

  let distance = initialDistance;
  let yaw = initialYaw;
  let pitch = initialPitch;

  const clamp = (value, min, max) =>
    Math.max(min, Math.min(max, value));

  function getEye() {
    return [
      target[0] + distance * Math.cos(pitch) * Math.sin(yaw),
      target[1] + distance * Math.sin(pitch),
      target[2] + distance * Math.cos(pitch) * Math.cos(yaw)
    ];
  }

  function rotate(deltaX, deltaY) {
    yaw -= deltaX * 0.005;

    // Limit vertical rotation so the camera
    // does not flip upside down.
    pitch = clamp(
      pitch + deltaY * 0.005,
      0.08,
      Math.PI / 2 - 0.08
    );
  }

  function zoom(delta) {
    distance = clamp(
      distance * Math.exp(delta * 0.001),
      8,
      35
    );
  }

  function reset() {
    distance = initialDistance;
    yaw = initialYaw;
    pitch = initialPitch;
  }

  return {
    getEye,
    getTarget: () => [...target],
    rotate,
    zoom,
    reset
  };
}
