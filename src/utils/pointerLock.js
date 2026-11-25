export const requestPointerLock = () => {
  const canvas = document.querySelector('canvas');
  if (!canvas) return;
  try {
    const result = canvas.requestPointerLock();
    if (result && typeof result.catch === 'function') result.catch(() => {});
  } catch {
    /* pointer lock can be rejected by the browser */
  }
};

export const exitPointerLock = () => {
  if (document.pointerLockElement) document.exitPointerLock();
};
