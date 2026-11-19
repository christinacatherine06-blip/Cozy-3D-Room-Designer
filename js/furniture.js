
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


// Phase 4: Cute study desk and matching chair.
// All furniture is built using reusable 3D box geometry.

export function addStudyDesk(positions, colors) {
  const wood = [0.76, 0.56, 0.43];
  const cream = [0.96, 0.91, 0.84];
  const pink = [0.93, 0.65, 0.74];
  const gold = [0.85, 0.68, 0.38];
  const screen = [0.17, 0.22, 0.34];
  const white = [0.96, 0.96, 0.95];

  // Desk positioned toward the right side of the room.
  const x = 2.5;
  const z = -3.4;

  // Wooden desktop
  addBox(positions, colors,
    [x, 1.15, z], [2.8, 0.16, 1.2], wood);

  // Four cream-colored legs
  for (const dx of [-1.2, 1.2]) {
    for (const dz of [-0.45, 0.45]) {
      addBox(positions, colors,
        [x + dx, 0.55, z + dz],
        [0.13, 1.1, 0.13], cream);
    }
  }

  // Cute pink drawer below the desktop
  addBox(positions, colors,
    [x + 0.8, 0.93, z],
    [0.75, 0.30, 0.95], pink);

  // Gold drawer handle on front
  addBox(positions, colors,
    [x + 0.8, 0.94, z + 0.49],
    [0.25, 0.05, 0.04], gold);

  // Laptop base
  addBox(positions, colors,
    [x - 0.35, 1.27, z],
    [0.85, 0.05, 0.55], white);

  // Upright laptop screen
  addBox(positions, colors,
    [x - 0.35, 1.65, z - 0.24],
    [0.85, 0.72, 0.06], screen);

  // Desk lamp base
  addBox(positions, colors,
    [x + 0.95, 1.29, z - 0.3],
    [0.28, 0.10, 0.28], gold);

  // Desk lamp stem
  addBox(positions, colors,
    [x + 0.95, 1.62, z - 0.3],
    [0.07, 0.60, 0.07], gold);

  // Pink lampshade
  addBox(positions, colors,
    [x + 0.95, 1.98, z - 0.3],
    [0.42, 0.22, 0.42], pink);
}

export function addStudyChair(positions, colors) {
  const pink = [0.93, 0.65, 0.74];
  const lightPink = [0.98, 0.82, 0.86];
  const cream = [0.96, 0.91, 0.84];
  const wood = [0.76, 0.56, 0.43];

  // Chair placed in front of the desk.
  const x = 2.1;
  const z = -1.9;

  // Chair seat
  addBox(positions, colors,
    [x, 0.65, z], [0.95, 0.16, 0.95], pink);

  // Soft-looking seat cushion
  addBox(positions, colors,
    [x, 0.75, z], [0.82, 0.08, 0.82], lightPink);

  // Chair backrest
  
  // Chair backrest - behind the seat, away from the desk
  addBox(positions, colors,
    [x, 1.22, z + 0.43],
    [0.95, 0.95, 0.14], pink);

  // Decorative cream stripe on the backrest
  addBox(positions, colors,
    [x, 1.40, z + 0.35],
    [0.70, 0.09, 0.035], cream);


  // Four wooden legs
  for (const dx of [-0.35, 0.35]) {
    for (const dz of [-0.35, 0.35]) {
      addBox(positions, colors,
        [x + dx, 0.29, z + dz],
        [0.10, 0.58, 0.10], wood);
    }
  }
}


 // Phase 5: Cute pastel bedroom wardrobe


export function addWardrobe(positions, colors) {
  const wood = [0.76, 0.56, 0.43];
  const cream = [0.97, 0.92, 0.85];
  const pink = [0.94, 0.73, 0.80];
  const gold = [0.85, 0.68, 0.38];

  // Wardrobe positioned against the left wall
  const x = -4.45;
  const z = 0.5;

  // Main wooden cabinet
  addBox(positions, colors,
    [x, 1.35, z],
    [0.9, 2.5, 1.6], wood);

  // Cream door - facing into the room
  addBox(positions, colors,
    [x + 0.47, 1.4, z - 0.4],
    [0.06, 2.25, 0.75], cream);

  // Pink door
  addBox(positions, colors,
    [x + 0.47, 1.4, z + 0.4],
    [0.06, 2.25, 0.75], pink);

  // Gold handles
  addBox(positions, colors,
    [x + 0.52, 1.4, z - 0.12],
    [0.05, 0.35, 0.04], gold);

  addBox(positions, colors,
    [x + 0.52, 1.4, z + 0.12],
    [0.05, 0.35, 0.04], gold);

  // Decorative cream top
  addBox(positions, colors,
    [x, 2.65, z],
    [1.05, 0.12, 1.75], cream);

  // Four wooden legs
  for (const dx of [-0.3, 0.3]) {
    for (const dz of [-0.65, 0.65]) {
      addBox(positions, colors,
        [x + dx, 0.07, z + dz],
        [0.13, 0.14, 0.13], wood);
    }
  }
}


export function addRug(positions, colors) {
  const dustyPink = [0.88, 0.63, 0.70];
  const softPink = [0.96, 0.79, 0.83];
  const cream = [0.99, 0.92, 0.84];

  const x = 0.2;
  const z = 2.0;

  // Bigger bottom layer
  addBox(positions, colors,
    [x, 0.025, z],
    [4.5, 0.04, 3.0], dustyPink);

  // Bigger middle layer
  addBox(positions, colors,
    [x, 0.052, z],
    [4.0, 0.025, 2.5], softPink);

  // Bigger cream center
  addBox(positions, colors,
    [x, 0.07, z],
    [3.3, 0.012, 1.8], cream);
}
