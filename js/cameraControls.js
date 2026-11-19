
export function setupCameraControls(canvas, camera) {
  let dragging = false;
  let lastX = 0;
  let lastY = 0;

  // Prevent browser touch gestures on the canvas
  canvas.style.touchAction = 'none';
  canvas.style.cursor = 'grab';

  canvas.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) return;

    dragging = true;
    lastX = event.clientX;
    lastY = event.clientY;

    canvas.setPointerCapture(event.pointerId);
    canvas.style.cursor = 'grabbing';
  });

  canvas.addEventListener('pointermove', (event) => {
    if (!dragging) return;

    const deltaX = event.clientX - lastX;
    const deltaY = event.clientY - lastY;

    camera.rotate(deltaX, deltaY);

    lastX = event.clientX;
    lastY = event.clientY;
  });

  function stopDragging() {
    dragging = false;
    canvas.style.cursor = 'grab';
  }

  canvas.addEventListener('pointerup', stopDragging);
  canvas.addEventListener('pointercancel', stopDragging);
  canvas.addEventListener('lostpointercapture', stopDragging);

  // Scroll or two-finger trackpad movement to zoom
  canvas.addEventListener('wheel', (event) => {
    event.preventDefault();

    camera.zoom(event.deltaY);
  }, { passive: false });

  // Press R to reset the camera
  window.addEventListener('keydown', (event) => {
    if (
      event.key.toLowerCase() === 'r' &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.altKey
    ) {
      camera.reset();
    }
  });
}
