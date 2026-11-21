
export function createFloorTexture(gl) {
  const size = 256;

  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext('2d');

  // Light wooden background
  ctx.fillStyle = '#c99b73';
  ctx.fillRect(0, 0, size, size);

  // Wooden planks
  const plankHeight = 64;

  for (let row = 0; row < 4; row++) {
    const y = row * plankHeight;

    ctx.fillStyle = row % 2 === 0
      ? '#d5aa83'
      : '#c69a72';

    ctx.fillRect(0, y, size, plankHeight);

    // Horizontal plank lines
    ctx.fillStyle = '#9e7555';
    ctx.fillRect(0, y, size, 3);

    // Offset plank joints
    const jointX = row % 2 === 0 ? 70 : 180;
    ctx.fillRect(jointX, y, 3, plankHeight);

    // Subtle wood grain
    for (let i = 0; i < 12; i++) {
      const grainY = y + 7 + i * 4;

      ctx.strokeStyle = 'rgba(110, 70, 40, 0.10)';
      ctx.lineWidth = 1;

      ctx.beginPath();
      ctx.moveTo(0, grainY);
      ctx.bezierCurveTo(
        70, grainY - 3,
        170, grainY + 3,
        256, grainY
      );
      ctx.stroke();
    }
  }

  const texture = gl.createTexture();

  gl.bindTexture(gl.TEXTURE_2D, texture);

  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    canvas
  );

  gl.texParameteri(
    gl.TEXTURE_2D,
    gl.TEXTURE_MIN_FILTER,
    gl.LINEAR_MIPMAP_LINEAR
  );

  gl.texParameteri(
    gl.TEXTURE_2D,
    gl.TEXTURE_MAG_FILTER,
    gl.LINEAR
  );

  gl.texParameteri(
    gl.TEXTURE_2D,
    gl.TEXTURE_WRAP_S,
    gl.REPEAT
  );

  gl.texParameteri(
    gl.TEXTURE_2D,
    gl.TEXTURE_WRAP_T,
    gl.REPEAT
  );

  gl.generateMipmap(gl.TEXTURE_2D);

  gl.bindTexture(gl.TEXTURE_2D, null);

  return texture;
}
