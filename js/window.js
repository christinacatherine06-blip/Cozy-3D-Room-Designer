
import { addBox } from './geometry.js';

// Phase 8: Large cozy bedroom window
export function addWindow(positions, colors) {

  const cream = [0.98, 0.92, 0.82];
  const glass = [0.58, 0.80, 0.96];
  const wood = [0.78, 0.60, 0.46];

  // Window position on the back wall
  const x = 1.02;
  const y = 2.3;
  const z = -3.82;

  // Large glass panel
  addBox(positions, colors,
    [x, y, z],
    [3.8, 2.0, 0.08],
    glass
  );

  // Top frame
  addBox(positions, colors,
    [x, y + 1.05, z + 0.09],
    [4.05, 0.14, 0.18],
    cream
  );

  // Bottom frame
  addBox(positions, colors,
    [x, y - 1.05, z + 0.09],
    [4.05, 0.14, 0.18],
    cream
  );

  // Left frame
  addBox(positions, colors,
    [x - 1.96, y, z + 0.09],
    [0.14, 2.1, 0.18],
    cream
  );

  // Right frame
  addBox(positions, colors,
    [x + 1.96, y, z + 0.09],
    [0.14, 2.1, 0.18],
    cream
  );

  // Vertical divider
  addBox(positions, colors,
    [x, y, z + 0.12],
    [0.12, 2.0, 0.14],
    cream
  );

  // Horizontal divider
  addBox(positions, colors,
    [x, y, z + 0.12],
    [3.85, 0.12, 0.14],
    cream
  );

  // Wide wooden window sill
  addBox(positions, colors,
    [x, y - 1.14, z + 0.25],
    [4.2, 0.12, 0.42],
    wood
  );
}
