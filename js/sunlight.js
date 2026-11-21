
import { addQuad } from './geometry.js';

// Phase 10: Sunlight from the window toward the rug
export function addSunlight(positions, colors) {
  const warmGold = [1.0, 0.82, 0.55];

  // Add a sunlight quadrilateral at a chosen height
  function panel(x0, x1, x2, x3, z0, z1, y) {
    addQuad(
      positions,
      colors,
      [x0, y, z0],
      [x1, y, z0],
      [x2, y, z1],
      [x3, y, z1],
      warmGold
    );
  }

  // Light starts beneath the window and
  // travels forward toward the rug.
  panel(-3.25, -1.55, -2.65, -3.9, -3.4, 3.0, 0.012);
  panel(-1.45, 0.25, 0.85, -0.85, -3.4, 3.0, 0.012);

  // Light on top of the cream rug centre
  panel(-1.45, -0.15, 0.25, -1.0, 0.7, 2.5, 0.081);
}
