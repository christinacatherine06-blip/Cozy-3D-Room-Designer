
import { createClockGeometry } from './clock.js';

export function createClockRenderer(gl, program) {
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  function makeBuffer(attributeName) {
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    const location = gl.getAttribLocation(
      program, attributeName
    );

    if (location < 0) {
      throw new Error(`Missing attribute: ${attributeName}`);
    }

    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(
      location, 3, gl.FLOAT, false, 0, 0
    );

    return buffer;
  }

  const positionBuffer = makeBuffer('aPosition');
  const colorBuffer = makeBuffer('aColor');

  gl.bindVertexArray(null);

  return function drawClock(date = new Date()) {
    const geometry = createClockGeometry(date);

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(geometry.positions),
      gl.DYNAMIC_DRAW
    );

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(geometry.colors),
      gl.DYNAMIC_DRAW
    );

    gl.bindVertexArray(vao);
    gl.drawArrays(
      gl.TRIANGLES,
      0,
      geometry.positions.length / 3
    );

    gl.bindVertexArray(null);
  };
}
