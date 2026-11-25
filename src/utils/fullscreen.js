export function isFullscreen() {
  return Boolean(document.fullscreenElement);
}

export async function toggleFullscreen() {
  try {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen?.();
    } else {
      await document.exitFullscreen?.();
    }
  } catch {
    /* fullscreen can be rejected by the browser */
  }
}
