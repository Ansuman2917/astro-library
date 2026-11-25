import { useEffect } from 'react';
import { useUIStore } from '../store/useUIStore';
import { audioEngine } from '../audio/AudioEngine';
import { requestPointerLock } from '../utils/pointerLock';

function Toggle({ value, onChange, label }) {
  return (
    <button
      type="button"
      className={`toggle${value ? ' toggle--on' : ''}`}
      role="switch"
      aria-checked={value}
      aria-label={label}
      onClick={() => onChange(!value)}
    >
      <span />
    </button>
  );
}

export default function SettingsPanel() {
  const sensitivity = useUIStore((state) => state.sensitivity);
  const volume = useUIStore((state) => state.volume);
  const muted = useUIStore((state) => state.muted);
  const minimapOpen = useUIStore((state) => state.minimapOpen);
  const bobEnabled = useUIStore((state) => state.bobEnabled);
  const showDebug = useUIStore((state) => state.showDebug);
  const setSensitivity = useUIStore((state) => state.setSensitivity);
  const setVolume = useUIStore((state) => state.setVolume);
  const toggleMuted = useUIStore((state) => state.toggleMuted);
  const toggleMinimap = useUIStore((state) => state.toggleMinimap);
  const setBobEnabled = useUIStore((state) => state.setBobEnabled);
  const toggleDebug = useUIStore((state) => state.toggleDebug);
  const setSettingsOpen = useUIStore((state) => state.setSettingsOpen);

  const close = () => {
    audioEngine.click();
    setSettingsOpen(false);
  };

  const resume = () => {
    audioEngine.click();
    setSettingsOpen(false);
    requestPointerLock();
  };

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.code === 'Escape') {
        event.preventDefault();
        setSettingsOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [setSettingsOpen]);

  return (
    <div className="overlay overlay--center settings-overlay">
      <section className="glass settings-card">
        <header className="settings-card__head">
          <div>
            <p className="eyebrow">
              <span />
              FIELD SETTINGS
            </p>
            <h2>Player preferences</h2>
          </div>
          <button type="button" className="icon-close" onClick={close} aria-label="Close settings">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </header>

        <div className="settings-card__rows">
          <div className="setting-row">
            <div className="setting-row__copy">
              <strong>Mouse sensitivity</strong>
              <span>Look speed for pointer movement</span>
            </div>
            <div className="setting-row__control">
              <input
                type="range"
                min="0.0008"
                max="0.005"
                step="0.0001"
                value={sensitivity}
                onChange={(event) => setSensitivity(Number(event.target.value))}
                aria-label="Mouse sensitivity"
              />
              <span className="setting-value">{(sensitivity * 1000).toFixed(1)}</span>
            </div>
          </div>

          <div className="setting-row">
            <div className="setting-row__copy">
              <strong>Ambient volume</strong>
              <span>Procedural drones, footsteps, interactions</span>
            </div>
            <div className="setting-row__control">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(event) => setVolume(Number(event.target.value))}
                aria-label="Ambient volume"
              />
              <span className="setting-value">{Math.round(volume * 100)}%</span>
            </div>
          </div>

          <div className="setting-row setting-row--toggle">
            <div className="setting-row__copy">
              <strong>Mute audio</strong>
              <span>Silence ambience and interaction sounds</span>
            </div>
            <Toggle value={muted} onChange={toggleMuted} label="Mute audio" />
          </div>

          <div className="setting-row setting-row--toggle">
            <div className="setting-row__copy">
              <strong>Mini-map</strong>
              <span>Show the circular navigation map in the HUD</span>
            </div>
            <Toggle value={minimapOpen} onChange={toggleMinimap} label="Show mini-map" />
          </div>

          <div className="setting-row setting-row--toggle">
            <div className="setting-row__copy">
              <strong>Head movement</strong>
              <span>Subtle walking bob and sway</span>
            </div>
            <Toggle value={bobEnabled} onChange={setBobEnabled} label="Head movement" />
          </div>

          {import.meta.env.DEV && (
            <div className="setting-row setting-row--toggle setting-row--dev">
              <div className="setting-row__copy">
                <strong>Collision debug</strong>
                <span>Wireframe physics colliders · development builds only</span>
              </div>
              <Toggle value={showDebug} onChange={toggleDebug} label="Collision debug" />
            </div>
          )}
        </div>

        <footer className="settings-card__footer">
          <button type="button" className="button-ghost" onClick={close}>
            Done
          </button>
          <button type="button" className="button-primary button-primary--compact" onClick={resume}>
            <span>APPLY &amp; RESUME</span>
          </button>
        </footer>
      </section>
    </div>
  );
}
