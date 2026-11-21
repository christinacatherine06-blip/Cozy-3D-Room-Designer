
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
  const normalLocation = gl.getAttribLocation(program, 'aNormal');
  
  if (normalLocation >= 0) {
    gl.disableVertexAttribArray(normalLocation);
    gl.vertexAttrib3f(normalLocation, 0, 0, 1);
  }
  
  gl.bindVertexArray(null);// Give the animated clock a normal facing the room
  
  if (normalLocation >= 0) {
    gl.disableVertexAttribArray(normalLocation);
    gl.vertexAttrib3f(normalLocation, 0, 0, 1);
  }  


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


    // Keep the animated clock untextured
    const clockTexCoordLocation =
    gl.getAttribLocation(program, 'aTexCoord');

    const clockUseTextureLocation =
    gl.getAttribLocation(program, 'aUseTexture');

    if (clockTexCoordLocation >= 0) {
    gl.disableVertexAttribArray(clockTexCoordLocation);
    gl.vertexAttrib2f(clockTexCoordLocation, 0, 0);
    }

    if (clockUseTextureLocation >= 0) {
    gl.disableVertexAttribArray(clockUseTextureLocation);
    gl.vertexAttrib1f(clockUseTextureLocation, 0);
    }

    gl.bindVertexArray(vao);
    gl.drawArrays(
      gl.TRIANGLES,
      0,
      geometry.positions.length / 3
    );

    gl.bindVertexArray(null);
  };
}
