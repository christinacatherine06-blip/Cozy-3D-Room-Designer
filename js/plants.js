
import { addBox, addQuad } from './geometry.js';

// Creates one simple green leaf using two triangles.
function addLeaf(positions, colors, x, y, z, size, direction) {
  const green = [0.25, 0.48, 0.29];

  const tip = [
    x + direction[0] * size,
    y + size * 0.7,
    z + direction[1] * size
  ];

  const left = [
    x - direction[1] * size * 0.25,
    y,
    z + direction[0] * size * 0.25
  ];

  const right = [
    x + direction[1] * size * 0.25,
    y,
    z - direction[0] * size * 0.25
  ];

  // Draw both sides so the leaf is visible
  // from different camera angles.
  addQuad(
    positions, colors,
    left, tip, right, left, green
  );
}

// Creates a simple potted plant.
function addPlant(positions, colors, x, z, scale) {
  const pot = [0.72, 0.38, 0.28];
  const soil = [0.28, 0.20, 0.16];
  const stem = [0.27, 0.43, 0.22];

  const baseY = 0;

  // Plant pot
  addBox(
    positions, colors,
    [x, baseY + 0.22 * scale, z],
    [0.48 * scale, 0.44 * scale, 0.48 * scale],
    pot
  );

  // Soil
  addBox(
    positions, colors,
    [x, baseY + 0.45 * scale, z],
    [0.40 * scale, 0.04 * scale, 0.40 * scale],
    soil
  );

  // Main stem
  addBox(
    positions, colors,
    [x, baseY + 0.75 * scale, z],
    [0.05 * scale, 0.65 * scale, 0.05 * scale],
    stem
  );

  // Leaves
  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
    [0.7, 0.7],
    [-0.7, -0.7]
  ];

  directions.forEach((direction, index) => {
    addLeaf(
      positions,
      colors,
      x,
      baseY + (0.75 + index * 0.06) * scale,
      z,
      0.55 * scale,
      direction
    );
  });
}

// Floor plant near the window
export function addFloorPlant(positions, colors) {
  addPlant(positions, colors, 0.40, -3, 0.8);
}

// Small plant for the window sill
export function addWindowPlant(positions, colors) {
  // Position on the window sill
  // The window sill is approximately y = 1.06.
  const x = -0.60;
  const z = -3.45;

  // Create the plant in temporary arrays,
  // then raise its vertices onto the sill.
  const plantPositions = [];
  const plantColors = [];

  addPlant(plantPositions, plantColors, x, z, 0.45);

  for (let i = 0; i < plantPositions.length; i += 3) {
    positions.push(
      plantPositions[i],
      plantPositions[i + 1] + 1.25,
      plantPositions[i + 2]
    );
  }

  colors.push(...plantColors);
}
