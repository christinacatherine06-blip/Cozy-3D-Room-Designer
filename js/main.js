
import {
  addBed,
  addStudyDesk,
  addStudyChair,
  addWardrobe,
  addRug
} from './furniture.js';

import { createClockRenderer } from './clockAnimation.js';
import { createCamera } from './camera.js';
import { setupCameraControls } from './cameraControls.js';
import { addWindow } from './window.js';
import { addFloorPlant, addWindowPlant } from './plants.js';
import { createLighting } from './lighting.js';
import { createFloorTexture } from './floorTexture.js';

// --------------------------------------------------
// Phase 1: Set up WebGL2
// --------------------------------------------------

const canvas = document.getElementById('gl-canvas');
const status = document.getElementById('status');
const gl = canvas.getContext('webgl2');

if (!gl) {
  if (status) {
    status.textContent = 'WebGL2 is not supported.';
  }
  throw new Error('WebGL2 unavailable');
}

// --------------------------------------------------
// Phase 2: GLSL shaders with lighting
// --------------------------------------------------


const vertexSource = `#version 300 es
in vec3 aPosition;
in vec3 aColor;
in vec3 aNormal;
in vec2 aTexCoord;
in float aUseTexture;

uniform mat4 uMVP;

out vec3 vColor;
out vec3 vNormal;
out vec3 vWorldPosition;
out vec2 vTexCoord;
flat out float vUseTexture;

void main() {
  gl_Position = uMVP * vec4(aPosition, 1.0);

  vColor = aColor;
  vNormal = aNormal;
  vWorldPosition = aPosition;

  vTexCoord = aTexCoord;
  vUseTexture = aUseTexture;
}
`;



const fragmentSource = `#version 300 es
precision highp float;

in vec3 vColor;
in vec3 vNormal;
in vec3 vWorldPosition;
in vec2 vTexCoord;
flat in float vUseTexture;

uniform vec3 uAmbient;
uniform vec3 uSunlight;
uniform vec3 uLightDirection;

uniform bool uLampOn;
uniform vec3 uLampPosition;

uniform sampler2D uFloorTexture;

out vec4 outColor;

void main() {
  vec3 normal = normalize(vNormal);
  vec3 lightDir = normalize(uLightDirection);

  float diffuse = max(dot(normal, lightDir), 0.0);

  vec3 lighting = uAmbient + uSunlight * diffuse;

  if (uLampOn) {
    vec3 toLamp = uLampPosition - vWorldPosition;
    float distanceToLamp = length(toLamp);

    vec3 lampDirection = normalize(toLamp);
    float lampDiffuse =
      max(dot(normal, lampDirection), 0.0);

    float attenuation =
      1.0 / (1.0 + 0.45 * distanceToLamp * distanceToLamp);

    vec3 lampColor = vec3(1.0, 0.78, 0.42);

    lighting += lampColor *
      lampDiffuse *
      attenuation *
      2.0;
  }

  vec3 surfaceColor = vColor;

  if (vUseTexture > 0.5) {
    surfaceColor = texture(uFloorTexture, vTexCoord).rgb;
  }

  vec3 finalColor = surfaceColor * lighting;

  outColor = vec4(finalColor, 1.0);
}
`;


// --------------------------------------------------
// Phase 3: Compile and link shaders
// --------------------------------------------------

function compileShader(type, source) {
  const shader = gl.createShader(type);

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shader));
  }

  return shader;
}

const program = gl.createProgram();

gl.attachShader(
  program,
  compileShader(gl.VERTEX_SHADER, vertexSource)
);

gl.attachShader(
  program,
  compileShader(gl.FRAGMENT_SHADER, fragmentSource)
);

gl.linkProgram(program);

if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
  throw new Error(gl.getProgramInfoLog(program));
}

gl.useProgram(program);

 // Create the wooden floor texture only once
const floorTexture = createFloorTexture(gl);

const floorTextureLocation =
  gl.getUniformLocation(program, 'uFloorTexture');

// Tell GLSL to use texture unit 0
gl.uniform1i(floorTextureLocation, 0);


// --------------------------------------------------
// Phase 4: Day and Night lighting
// --------------------------------------------------

const lighting = createLighting(gl, program);


// Phase 12: Desk lamp interaction

const lampOnLocation =
  gl.getUniformLocation(program, 'uLampOn');

const lampPositionLocation =
  gl.getUniformLocation(program, 'uLampPosition');

// Lamp starts switched OFF
let lampOn = false;

const lampBtn = document.getElementById('lampBtn');

function updateLampButton() {
  if (!lampBtn) return;

  lampBtn.textContent = lampOn
    ? '💡 Lamp ON'
    : '💡 Lamp OFF';

  lampBtn.classList.toggle('active', lampOn);
  lampBtn.setAttribute('aria-pressed', String(lampOn));
}

if (lampBtn) {
  lampBtn.addEventListener('click', () => {
    lampOn = !lampOn;
    updateLampButton();
  });

  updateLampButton();
}


const dayBtn = document.getElementById('dayBtn');
const nightBtn = document.getElementById('nightBtn');

function setLightingMode(isDay) {
  lighting.setDayMode(isDay);

  if (dayBtn && nightBtn) {
    dayBtn.classList.toggle('active', isDay);
    nightBtn.classList.toggle('active', !isDay);

    dayBtn.setAttribute('aria-pressed', String(isDay));
    nightBtn.setAttribute('aria-pressed', String(!isDay));
  }
}

if (dayBtn && nightBtn) {
  dayBtn.addEventListener('click', () => {
    setLightingMode(true);
  });

  nightBtn.addEventListener('click', () => {
    setLightingMode(false);
  });
}

// Start with Day mode
setLightingMode(true);

// --------------------------------------------------
// Phase 5: Build the room geometry
// --------------------------------------------------

const positions = [];
const colors = [];

const texCoords = [];
const useTexture = [];

function quad(a, b, c, d, color, textured = false) {
  const vertices = [a, b, c, a, c, d];

  const uv = [
    [0, 0],
    [4, 0],
    [4, 4],
    [0, 0],
    [4, 4],
    [0, 4]
  ];

  for (let i = 0; i < vertices.length; i++) {
    positions.push(...vertices[i]);
    colors.push(...color);

    texCoords.push(...uv[i]);
    useTexture.push(textured ? 1 : 0);
  }
}
// Floor with wooden texture
quad(
  [-4, 0, -4],
  [4, 0, -4],
  [4, 0, 4],
  [-4, 0, 4],
  [1.0, 1.0, 1.0],
  true
);

// Back wall
quad(
  [-4, 0, -4],
  [-4, 3.5, -4],
  [4, 3.5, -4],
  [4, 0, -4],
  [0.91, 0.77, 0.84]
);

// Left wall
quad(
  [-4, 0, 4],
  [-4, 3.5, 4],
  [-4, 3.5, -4],
  [-4, 0, -4],
  [0.97, 0.87, 0.88]
);

// Furniture
addBed(positions, colors);
addStudyDesk(positions, colors);
addStudyChair(positions, colors);
addWardrobe(positions, colors);
addRug(positions, colors);
// Window
addWindow(positions, colors);
// Plants
addFloorPlant(positions, colors);
addWindowPlant(positions, colors);

// Add default UV coordinates to objects without textures
const totalVertices = positions.length / 3;

while (useTexture.length < totalVertices) {
  texCoords.push(0, 0);
  useTexture.push(0);
}

// --------------------------------------------------
// Phase 6: Calculate surface normals
// --------------------------------------------------

const normals = [];

for (let i = 0; i < positions.length; i += 9) {
  const ax = positions[i];
  const ay = positions[i + 1];
  const az = positions[i + 2];

  const bx = positions[i + 3];
  const by = positions[i + 4];
  const bz = positions[i + 5];

  const cx = positions[i + 6];
  const cy = positions[i + 7];
  const cz = positions[i + 8];

  const ux = bx - ax;
  const uy = by - ay;
  const uz = bz - az;

  const vx = cx - ax;
  const vy = cy - ay;
  const vz = cz - az;

  let nx = uy * vz - uz * vy;
  let ny = uz * vx - ux * vz;
  let nz = ux * vy - uy * vx;

  const length = Math.hypot(nx, ny, nz) || 1;

  nx /= length;
  ny /= length;
  nz /= length;

  // Each triangle has three vertices
  for (let j = 0; j < 3; j++) {
    normals.push(nx, ny, nz);
  }
}

// --------------------------------------------------
// Phase 7: Create vertex buffers
// --------------------------------------------------

const vao = gl.createVertexArray();
gl.bindVertexArray(vao);

function attribute(name, data) {
  const location = gl.getAttribLocation(program, name);

  if (location < 0) {
    throw new Error(`Missing shader attribute: ${name}`);
  }

  const buffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(data),
    gl.STATIC_DRAW
  );

  gl.enableVertexAttribArray(location);
  gl.vertexAttribPointer(
    location,
    3,
    gl.FLOAT,
    false,
    0,
    0
  );
}

attribute('aPosition', positions);
attribute('aColor', colors);
attribute('aNormal', normals);

// Texture coordinate buffer
const texCoordLocation =
  gl.getAttribLocation(program, 'aTexCoord');

const texCoordBuffer = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
gl.bufferData(
  gl.ARRAY_BUFFER,
  new Float32Array(texCoords),
  gl.STATIC_DRAW
);

gl.enableVertexAttribArray(texCoordLocation);
gl.vertexAttribPointer(
  texCoordLocation,
  2,
  gl.FLOAT,
  false,
  0,
  0
);

// Texture enable/disable flag
const useTextureLocation =
  gl.getAttribLocation(program, 'aUseTexture');

const useTextureBuffer = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, useTextureBuffer);
gl.bufferData(
  gl.ARRAY_BUFFER,
  new Float32Array(useTexture),
  gl.STATIC_DRAW
);

gl.enableVertexAttribArray(useTextureLocation);
gl.vertexAttribPointer(
  useTextureLocation,
  1,
  gl.FLOAT,
  false,
  0,
  0
);


gl.bindVertexArray(null);

// --------------------------------------------------
// Phase 8: Matrix functions
// --------------------------------------------------

function multiply(a, b) {
  const out = new Float32Array(16);

  for (let col = 0; col < 4; col++) {
    for (let row = 0; row < 4; row++) {
      let sum = 0;

      for (let k = 0; k < 4; k++) {
        sum += a[k * 4 + row] * b[col * 4 + k];
      }

      out[col * 4 + row] = sum;
    }
  }

  return out;
}

function perspective(fovy, aspect, near, far) {
  const f = 1 / Math.tan(fovy / 2);

  return new Float32Array([
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (far + near) / (near - far), -1,
    0, 0, 2 * far * near / (near - far), 0
  ]);
}

function lookAt(eye, target, up) {
  const normalize = v => {
    const n = Math.hypot(...v);
    return v.map(x => x / n);
  };

  const cross = (a, b) => [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0]
  ];

  const dot = (a, b) =>
    a.reduce((sum, x, i) => sum + x * b[i], 0);

  const z = normalize(
    eye.map((x, i) => x - target[i])
  );

  const x = normalize(cross(up, z));
  const y = cross(z, x);

  return new Float32Array([
    x[0], y[0], z[0], 0,
    x[1], y[1], z[1], 0,
    x[2], y[2], z[2], 0,
    -dot(x, eye), -dot(y, eye), -dot(z, eye), 1
  ]);
}

// --------------------------------------------------
// Phase 9: Camera and WebGL settings
// --------------------------------------------------

gl.enable(gl.DEPTH_TEST);
gl.disable(gl.BLEND);
gl.depthMask(true);

const camera = createCamera();

setupCameraControls(canvas, camera);

const mvpLocation =
  gl.getUniformLocation(program, 'uMVP');

const drawClock = createClockRenderer(gl, program);

// --------------------------------------------------
// Phase 10: Render the bedroom
// --------------------------------------------------

function render() {
  const pixelRatio = Math.min(
    window.devicePixelRatio || 1,
    2
  );

  const width = Math.max(
    1,
    Math.round(canvas.clientWidth * pixelRatio)
  );

  const height = Math.max(
    1,
    Math.round(canvas.clientHeight * pixelRatio)
  );

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }

  gl.viewport(0, 0, canvas.width, canvas.height);

  const projection = perspective(
    Math.PI / 4,
    canvas.width / canvas.height,
    0.1,
    100
  );

  const view = lookAt(
    camera.getEye(),
    camera.getTarget(),
    [0, 1, 0]
  );

  gl.useProgram(program);

    // Bind the wooden floor texture
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, floorTexture);

  // Update lighting for Day or Night
  lighting.applyLighting();


  // Update the desk lamp every frame
  gl.uniform1i(
    lampOnLocation,
    lampOn ? 1 : 0
  );

  // Exact lamp position from furniture.js
  // Light is placed beneath the pink lampshade
  gl.uniform3f(
    lampPositionLocation,
    3.05, 1.84, -3.3
  );


  // Update camera transformation
  gl.uniformMatrix4fv(
    mvpLocation,
    false,
    multiply(projection, view)
  );

  // Clear the previous frame
  gl.clearColor(0.06, 0.11, 0.20, 1);

  gl.clear(
    gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT
  );

  // Draw the room and furniture
  gl.bindVertexArray(vao);

  gl.drawArrays(
    gl.TRIANGLES,
    0,
    positions.length / 3
  );

  gl.bindVertexArray(null);

  // Draw the animated wall clock
  drawClock(new Date());

  requestAnimationFrame(render);
}

// Start the animation once
requestAnimationFrame(render);

if (status) {
  status.textContent =
    'Cozy 3D Room Designer — Day/Night lighting ready.';
}
