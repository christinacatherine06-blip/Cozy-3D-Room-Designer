// Phase 2: Draw a cozy room using raw WebGL2, GLSL, and triangle buffers.
const canvas = document.getElementById('gl-canvas');
const status = document.getElementById('status');
const gl = canvas.getContext('webgl2');
if (!gl) {
  status.textContent = 'WebGL2 is not supported by this browser.';
  throw new Error('WebGL2 unavailable');
}

const vertexSource = `#version 300 es
in vec3 aPosition;
in vec3 aColor;
uniform mat4 uMVP;
out vec3 vColor;
void main() {
  gl_Position = uMVP * vec4(aPosition, 1.0);
  vColor = aColor;
}`;
const fragmentSource = `#version 300 es
precision highp float;
in vec3 vColor;
out vec4 outColor;
void main() { outColor = vec4(vColor, 1.0); }`;

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
gl.attachShader(program, compileShader(gl.VERTEX_SHADER, vertexSource));
gl.attachShader(program, compileShader(gl.FRAGMENT_SHADER, fragmentSource));
gl.linkProgram(program);
if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
  throw new Error(gl.getProgramInfoLog(program));
}
gl.useProgram(program);

const positions = [];
const colors = [];
function quad(a, b, c, d, color) {
  for (const v of [a,b,c,a,c,d]) {
    positions.push(...v);
    colors.push(...color);
  }
}
// Room dimensions: x=-3..3, z=-3..3, y=0..3.
// Floor, rear wall, and left wall (front and right sides stay open).
quad([-3,0,-3], [3,0,-3], [3,0,3], [-3,0,3], [0.73,0.53,0.40]);
quad([-3,0,-3], [-3,3,-3], [3,3,-3], [3,0,-3], [0.91,0.77,0.84]);
quad([-3,0,3], [-3,3,3], [-3,3,-3], [-3,0,-3], [0.97,0.87,0.88]);

const vao = gl.createVertexArray();
gl.bindVertexArray(vao);
function attribute(name, data) {
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
  const location = gl.getAttribLocation(program, name);
  gl.enableVertexAttribArray(location);
  gl.vertexAttribPointer(location, 3, gl.FLOAT, false, 0, 0);
}
attribute('aPosition', positions);
attribute('aColor', colors);
gl.bindVertexArray(null);

// Matrix utilities: column-major, matching GLSL conventions.
function multiply(a,b) {
  const out = new Float32Array(16);
  for (let col=0; col<4; col++) for (let row=0; row<4; row++) {
    let sum=0;
    for (let k=0; k<4; k++) sum += a[k*4+row]*b[col*4+k];
    out[col*4+row]=sum;
  }
  return out;
}
function perspective(fovy, aspect, near, far) {
  const f=1/Math.tan(fovy/2);
  return new Float32Array([f/aspect,0,0,0, 0,f,0,0, 0,0,(far+near)/(near-far),-1, 0,0,2*far*near/(near-far),0]);
}
function lookAt(eye, target, up) {
  const normalize=v=>{const n=Math.hypot(...v);return v.map(x=>x/n);};
  const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
  const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
  const z=normalize(eye.map((x,i)=>x-target[i]));
  const x=normalize(cross(up,z));
  const y=cross(z,x);
  return new Float32Array([x[0],y[0],z[0],0, x[1],y[1],z[1],0, x[2],y[2],z[2],0, -dot(x,eye),-dot(y,eye),-dot(z,eye),1]);
}

gl.enable(gl.DEPTH_TEST);
gl.clearColor(0.93, 0.94, 0.98, 1);
gl.viewport(0, 0, canvas.width, canvas.height);
const projection = perspective(Math.PI/4, canvas.width/canvas.height, 0.1, 100);
const view = lookAt([9,7,10], [0,1,0], [0,1,0]);
gl.uniformMatrix4fv(gl.getUniformLocation(program, 'uMVP'), false, multiply(projection, view));
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
gl.bindVertexArray(vao);
gl.drawArrays(gl.TRIANGLES, 0, positions.length/3);
status.textContent = 'Phase 2 complete: floor and two walls drawn with WebGL2.';
