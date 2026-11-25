import { useEffect, useRef, useState } from 'react';
import { useUIStore } from '../store/useUIStore';
import { requestPointerLock } from '../utils/pointerLock';
import { toggleFullscreen } from '../utils/fullscreen';
import { audioEngine } from '../audio/AudioEngine';
import { librarySections } from '../data/librarySections';

export default function PauseOverlay() {
  const openPanel = useUIStore((state) => state.openPanel);
  const setSettingsOpen = useUIStore((state) => state.setSettingsOpen);
  const returnToWelcome = useUIStore((state) => state.returnToWelcome);
  const level = useUIStore((state) => state.level);
  const [error, setError] = useState(false);
  const timer = useRef();

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const resume = () => {
    audioEngine.click();
    setError(false);
    requestPointerLock();
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      if (!document.pointerLockElement) setError(true);
    }, 700);
  };

  const navigate = (sectionId) => {
    audioEngine.click();
    openPanel({ type: 'section', id: sectionId });
  };

  return (
    <div className="overlay overlay--center pause-overlay">
      <section className="glass pause-card">
        <header className="pause-card__head">
          <div>
            <p className="eyebrow">
              <span />
              PORTFOLIO PAUSED
            </p>
            <h2>Session held</h2>
          </div>
          <div className="pause-card__level">
            <span>LEVEL {level === 1 ? '02' : '01'}</span>
            <strong>{level === 1 ? 'Experience Gallery' : 'Project Gallery'}</strong>
          </div>
        </header>

        <div className="pause-card__body">
          <div className="pause-card__primary">
            <p className="pause-card__copy">
              The cursor has been released. Resume to recapture mouse look, or browse the portfolio
              index below.
            </p>

            <button type="button" className="button-primary" onClick={resume}>
              <span>RESUME EXPLORING</span>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 12h15M13 6l6 6-6 6" />
              </svg>
            </button>

            {error && (
              <p className="pause-card__error">
                Pointer lock was not granted. Press Resume again to retry.
              </p>
            )}

            <div className="pause-card__actions">
              <button type="button" className="button-ghost" onClick={() => setSettingsOpen(true)}>
                Settings
              </button>
              <button
                type="button"
                className="button-ghost"
                onClick={() => {
                  audioEngine.click();
                  toggleFullscreen();
                }}
              >
                Fullscreen
              </button>
              <button type="button" className="button-ghost" onClick={returnToWelcome}>
                Return to welcome
              </button>
            </div>

            <p className="pause-card__hint">Esc releases the cursor · Controls stay active in panels</p>
          </div>

          <div className="pause-card__nav">
            <p className="pause-card__nav-label">Portfolio index</p>
            <div className="pause-card__sections">
              {librarySections.map((section) => (
                <button
                  key={section.id}
                  type="button"
                  className="nav-row"
                  onClick={() => navigate(section.id)}
                >
                  <i style={{ background: section.color, boxShadow: `0 0 12px ${section.color}` }} />
                  <span className="nav-row__name">{section.shortName}</span>
                  <span className="nav-row__meta">
                    {section.level === 1 ? 'UPPER' : section.id === 'orrery' ? 'CENTER' : 'LOWER'}
                  </span>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M9 6l6 6-6 6" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
