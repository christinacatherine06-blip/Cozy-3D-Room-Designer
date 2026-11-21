
export function createLighting(gl, program) {
  const ambientLocation =
    gl.getUniformLocation(program, 'uAmbient');

  const sunlightLocation =
    gl.getUniformLocation(program, 'uSunlight');

  const directionLocation =
    gl.getUniformLocation(program, 'uLightDirection');

  let isDay = true;

  function applyLighting() {
    gl.useProgram(program);

    if (isDay) {
      gl.uniform3f(ambientLocation, 0.9, 0.9, 0.9);
      gl.uniform3f(sunlightLocation, 0.5, 0.45, 0.35);
    } else {
      gl.uniform3f(ambientLocation, 0.20, 0.24, 0.38);
      gl.uniform3f(sunlightLocation, 0.04, 0.05, 0.10);
    }

    gl.uniform3f(directionLocation, -0.5, 1.0, 0.7);
  }

  function setDayMode(day) {
    isDay = day;
  }

  return {
    applyLighting,
    setDayMode
  };
}
