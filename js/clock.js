
/*
 * Cozy bedroom wall clock
 * Raw WebGL2 geometry, no Three.js.
 */

export function createClockGeometry(date = new Date()) {
  const positions = [];
  const colors = [];

  const cx = 0;
  const cy = 2.55;
  const radius = 0.48;

  // Clock mounted on the back wall (z = -5)
  const faceZ = -4.91;

  const wood = [0.62, 0.39, 0.28];
  const cream = [0.99, 0.96, 0.89];
  const gold = [0.86, 0.67, 0.37];
  const dark = [0.30, 0.23, 0.25];
  const pink = [0.90, 0.49, 0.60];

  function triangle(a, b, c, color) {
    for (const point of [a, b, c]) {
      positions.push(...point);
      colors.push(...color);
    }
  }

  // Circular clock face made from triangles
  function circle(r, z, color) {
    const segments = 48;

    for (let i = 0; i < segments; i++) {
      const a = i * Math.PI * 2 / segments;
      const b = (i + 1) * Math.PI * 2 / segments;

      triangle(
        [cx, cy, z],
        [cx + r * Math.cos(a), cy + r * Math.sin(a), z],
        [cx + r * Math.cos(b), cy + r * Math.sin(b), z],
        color
      );
    }
  }

  // Wooden frame and cream center
  circle(radius, faceZ, wood);
  circle(radius - 0.055, faceZ + 0.012, cream);

  // Twelve golden hour markers
  for (let i = 0; i < 12; i++) {
    const angle = i * Math.PI / 6;

    const inner = radius - 0.13;
    const outer = radius - 0.085;

    const ax = cx + Math.sin(angle) * inner;
    const ay = cy + Math.cos(angle) * inner;

    const bx = cx + Math.sin(angle) * outer;
    const by = cy + Math.cos(angle) * outer;

    const width = 0.012;
    const px = Math.cos(angle) * width;
    const py = -Math.sin(angle) * width;
    const z = faceZ + 0.025;

    triangle(
      [ax - px, ay - py, z],
      [bx - px, by - py, z],
      [bx + px, by + py, z],
      gold
    );

    triangle(
      [ax - px, ay - py, z],
      [bx + px, by + py, z],
      [ax + px, ay + py, z],
      gold
    );
  }

  // Draw a clock hand as a thin rectangle
  function hand(angle, length, width, z, color) {
    const dx = Math.sin(angle);
    const dy = Math.cos(angle);

    const px = dy * width / 2;
    const py = -dx * width / 2;

    const tipX = cx + dx * length;
    const tipY = cy + dy * length;

    const a = [cx - px, cy - py, z];
    const b = [cx + px, cy + py, z];
    const c = [tipX + px, tipY + py, z];
    const d = [tipX - px, tipY - py, z];

    triangle(a, b, c, color);
    triangle(a, c, d, color);
  }

  // Read current time
  const hours = date.getHours() % 12;
  const minutes = date.getMinutes();
  const seconds = date.getSeconds()
    + date.getMilliseconds() / 1000;

  const hourAngle =
    ((hours + minutes / 60 + seconds / 3600) / 12)
    * Math.PI * 2;

  const minuteAngle =
    ((minutes + seconds / 60) / 60)
    * Math.PI * 2;

  const secondAngle =
    (seconds / 60) * Math.PI * 2;

  // Animated hands
  hand(hourAngle, 0.23, 0.035, faceZ + 0.035, dark);
  hand(minuteAngle, 0.33, 0.022, faceZ + 0.045, dark);
  hand(secondAngle, 0.37, 0.009, faceZ + 0.055, pink);

  // Center pin
  const pinZ = faceZ + 0.065;
  const pinRadius = 0.025;

  for (let i = 0; i < 16; i++) {
    const a = i * Math.PI * 2 / 16;
    const b = (i + 1) * Math.PI * 2 / 16;

    triangle(
      [cx, cy, pinZ],
      [cx + pinRadius * Math.cos(a),
       cy + pinRadius * Math.sin(a), pinZ],
      [cx + pinRadius * Math.cos(b),
       cy + pinRadius * Math.sin(b), pinZ],
      gold
    );
  }

  return { positions, colors };
}
