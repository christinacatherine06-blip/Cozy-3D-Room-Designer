
// geometry.js
// Creates 3D boxes using triangles and vertex colors.

// Adds a rectangular face made of two triangles.
export function addQuad(positions, colors, a, b, c, d, color) {
  for (const vertex of [a, b, c, a, c, d]) {
    positions.push(...vertex);
    colors.push(...color);
  }
}

// Creates a complete 3D box with six faces.
export function addBox(positions, colors, center, size, color) {
  const [x, y, z] = center;
  const [w, h, depth] = size;

  const x0 = x - w / 2;
  const x1 = x + w / 2;
  const y0 = y - h / 2;
  const y1 = y + h / 2;
  const z0 = z - depth / 2;
  const z1 = z + depth / 2;

  // Front
  addQuad(positions, colors,
    [x0,y0,z1], [x1,y0,z1],
    [x1,y1,z1], [x0,y1,z1], color);

  // Back
  addQuad(positions, colors,
    [x1,y0,z0], [x0,y0,z0],
    [x0,y1,z0], [x1,y1,z0], color);

  // Left
  addQuad(positions, colors,
    [x0,y0,z0], [x0,y0,z1],
    [x0,y1,z1], [x0,y1,z0], color);

  // Right
  addQuad(positions, colors,
    [x1,y0,z1], [x1,y0,z0],
    [x1,y1,z0], [x1,y1,z1], color);

  // Top
  addQuad(positions, colors,
    [x0,y1,z1], [x1,y1,z1],
    [x1,y1,z0], [x0,y1,z0], color);

  // Bottom
  addQuad(positions, colors,
    [x0,y0,z0], [x1,y0,z0],
    [x1,y0,z1], [x0,y0,z1], color);
}
