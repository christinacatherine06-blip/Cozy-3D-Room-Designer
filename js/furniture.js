
// furniture.js
// Builds furniture using reusable WebGL2 box geometry.

import { addBox } from './geometry.js';


export function addBed(positions, colors) {
  const wood = [0.48, 0.30, 0.22];
  const mattress = [0.96, 0.94, 0.91];
  const pink = [0.91, 0.65, 0.75];

  // Bed position
  const x = -2.7;
  const z = -2.4;

  // Wooden bed frame
  addBox(positions, colors,
    [x, 0.35, z],
    [2.0, 0.35, 2.8], wood);

  // Mattress
  addBox(positions, colors,
    [x, 0.62, z],
    [1.85, 0.22, 2.6], mattress);

  // Headboard
  addBox(positions, colors,
    [x, 0.85, z - 1.4],
    [2.1, 1.2, 0.18], wood);

  // Two pillows
  addBox(positions, colors,
    [x - 0.45, 0.79, z - 0.95],
    [0.75, 0.12, 0.5], pink);

  addBox(positions, colors,
    [x + 0.45, 0.79, z - 0.95],
    [0.75, 0.12, 0.5], pink);

  // Four bed legs
  for (const offsetX of [-0.85, 0.85]) {
    for (const offsetZ of [-1.15, 1.15]) {
      addBox(positions, colors,
        [x + offsetX, 0.12, z + offsetZ],
        [0.15, 0.24, 0.15], wood);
    }
  }
}
