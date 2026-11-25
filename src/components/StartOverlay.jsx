import { useEffect, useRef, useState } from 'react';
import { useUIStore } from '../store/useUIStore';
import { requestPointerLock } from '../utils/pointerLock';
import { audioEngine } from '../audio/AudioEngine';

const CONTROLS = [
  ['W A S D', 'Walk'],
  ['Shift', 'Sprint'],
  ['Space', 'Jump'],
  ['Mouse', 'Look'],
  ['Click', 'Inspect'],
  ['Esc', 'Release'],
];

export default function StartOverlay() {
  const setLocked = useUIStore((state) => state.setLocked);
  const returnToWelcome = useUIStore((state) => state.returnToWelcome);
  const [error, setError] = useState(false);
  const timer = useRef();

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const begin = () => {
    audioEngine.click();
    setError(false);
    requestPointerLock();
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      if (!document.pointerLockElement) {
        setError(true);
        setLocked(false);
      }
    }, 700);
  };

  return (
    <div className="overlay overlay--center start-overlay">
      <section className="glass start-card">
        <div className="start-card__head">
          <p className="eyebrow">
            <span />
            SCENE READY
          </p>
          <span className="start-card__count">8 INFO STARS · 4 LOWER · 4 UPPER</span>
        </div>

        <h2 className="start-card__title">
          Step into the
          <span>portfolio</span>
        </h2>

        <p className="start-card__intro">
          The portfolio is open. Mouse look is captured for first-person exploration — press Esc at
          any time to release the cursor.
        </p>

        <div className="start-card__controls">
          {CONTROLS.map(([key, label]) => (
            <div key={label} className="start-card__control">
              <kbd>{key}</kbd>
              <span>{label}</span>
            </div>
          ))}
        </div>

        <button type="button" className="button-primary" onClick={begin}>
          <span>TAKE CONTROL</span>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 12h15M13 6l6 6-6 6" />
          </svg>
        </button>

        {error && (
          <p className="start-card__error">
            The browser did not grant mouse capture. Click again, or allow pointer lock for this
            site.
          </p>
        )}

        <div className="start-card__footer">
          <button type="button" className="link-button" onClick={returnToWelcome}>
            Return to welcome
          </button>
          <span>Point at a glowing marker to open a project or profile entry.</span>
        </div>
      </section>
    </div>
  );
}
