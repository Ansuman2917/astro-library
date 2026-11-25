import { useEffect, useRef } from 'react';
import { useUIStore } from '../store/useUIStore';

const MOVEMENT_KEYS = new Set([
  'KeyW',
  'KeyA',
  'KeyS',
  'KeyD',
  'ShiftLeft',
  'ShiftRight',
  'Space',
]);

const isTextInput = (target) =>
  target instanceof HTMLElement &&
  (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT');

export function usePlayerControls() {
  const keys = useRef(new Set());
  const jumpRequested = useRef(false);
  const sprintRequested = useRef(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (isTextInput(event.target)) return;
      const state = useUIStore.getState();
      if (!state.entered) return;

      if (MOVEMENT_KEYS.has(event.code)) {
        if (event.code === 'Space') {
          if (!event.repeat) jumpRequested.current = true;
          event.preventDefault();
        }
        if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
          sprintRequested.current = true;
        }
        keys.current.add(event.code);
      }
    };

    const handleKeyUp = (event) => {
      if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
        sprintRequested.current = false;
      }
      keys.current.delete(event.code);
    };

    const clearKeys = () => {
      keys.current.clear();
      sprintRequested.current = false;
      jumpRequested.current = false;
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', clearKeys);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', clearKeys);
    };
  }, []);

  return { keys, jumpRequested, sprintRequested };
}
