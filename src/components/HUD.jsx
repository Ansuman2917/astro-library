import { useEffect, useState } from 'react';
import { useUIStore } from '../store/useUIStore';
import { audioEngine } from '../audio/AudioEngine';
import { isFullscreen, toggleFullscreen } from '../utils/fullscreen';
import MiniMap from './MiniMap';

const TOOLBAR = [
  { id: 'map', label: 'MAP', title: 'Toggle mini-map (M)' },
  { id: 'audio', label: 'AUDIO', title: 'Toggle ambient audio' },
  { id: 'settings', label: 'CONFIG', title: 'Open settings (P)' },
  { id: 'full', label: 'FULL', title: 'Toggle fullscreen (F)' },
  { id: 'exit', label: 'EXIT', title: 'Return to welcome' },
];

const TYPE_LABEL = {
  book: 'ENTRY',
  section: 'TRACK',
  area: 'FOCUS TABLE',
};

const isTextInput = (target) =>
  target instanceof HTMLElement &&
  (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT');

export default function HUD() {
  const locked = useUIStore((state) => state.locked);
  const level = useUIStore((state) => state.level);
  const hovered = useUIStore((state) => state.hovered);
  const activePanel = useUIStore((state) => state.activePanel);
  const muted = useUIStore((state) => state.muted);
  const minimapOpen = useUIStore((state) => state.minimapOpen);
  const toggleMinimap = useUIStore((state) => state.toggleMinimap);
  const toggleMuted = useUIStore((state) => state.toggleMuted);
  const setSettingsOpen = useUIStore((state) => state.setSettingsOpen);
  const returnToWelcome = useUIStore((state) => state.returnToWelcome);
  const [fullscreen, setFullscreen] = useState(isFullscreen);
  const [hintVisible, setHintVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setHintVisible(false), 9000);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const onChange = () => setFullscreen(isFullscreen());
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (isTextInput(event.target)) return;
      if (event.code === 'KeyM') toggleMinimap();
      if (event.code === 'KeyF') toggleFullscreen();
      if (event.code === 'KeyP') setSettingsOpen(true);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [toggleMinimap, setSettingsOpen]);

  const handleToolbar = (id) => {
    if (id === 'map') {
      audioEngine.click();
      toggleMinimap();
    }
    if (id === 'audio') {
      toggleMuted();
      audioEngine.click();
    }
    if (id === 'settings') {
      audioEngine.click();
      setSettingsOpen(true);
    }
    if (id === 'full') {
      audioEngine.click();
      toggleFullscreen();
    }
    if (id === 'exit') {
      audioEngine.click();
      returnToWelcome();
    }
  };

  const promptVisible = Boolean(hovered) && !activePanel && locked;

  return (
    <div className={`hud${locked ? ' hud--active' : ''}`}>
      <div className="hud__vignette" aria-hidden="true" />

      <header className="hud__top">
        <div className="hud__brand">
          <span className="hud__brand-mark" />
          <div>
            <strong>ARSHIA SWAIN</strong>
            <span>AI / ML PORTFOLIO</span>
          </div>
        </div>

        <div className="hud__level" key={level}>
          <span>LEVEL {level === 1 ? '02' : '01'}</span>
          <strong>{level === 1 ? 'Experience Gallery' : 'Project Gallery'}</strong>
        </div>

        <div className="hud__toolbar">
          {TOOLBAR.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`hud__tool${
                (item.id === 'map' && !minimapOpen) || (item.id === 'audio' && muted) ||
                (item.id === 'full' && fullscreen)
                  ? ' hud__tool--muted'
                  : ''
              }`}
              title={item.title}
              onClick={() => handleToolbar(item.id)}
            >
              {item.id === 'audio' ? (muted ? 'MUTED' : 'AUDIO') : item.label}
            </button>
          ))}
        </div>
      </header>

      {minimapOpen && (
        <div className="hud__map">
          <MiniMap />
        </div>
      )}

      <div className={`crosshair${hovered && locked ? ' crosshair--hot' : ''}`} aria-hidden="true">
        <span />
      </div>

      <div
        className={`hud__hint${hintVisible ? ' hud__hint--visible' : ''}`}
        aria-hidden={!hintVisible}
      >
        <p>
          <span />
          Aim at a glowing marker to explore the portfolio
        </p>
      </div>

      <footer className="hud__bottom">
        <div className="hud__controls" aria-label="Controls">
          <span>
            <kbd>W</kbd>
            <kbd>A</kbd>
            <kbd>S</kbd>
            <kbd>D</kbd> MOVE
          </span>
          <span>
            <kbd>SHIFT</kbd> SPRINT
          </span>
          <span>
            <kbd>SPACE</kbd> JUMP
          </span>
          <span>
            <kbd>ESC</kbd> CURSOR
          </span>
        </div>

        <div className="hud__prompt-slot">
          {promptVisible && (
            <div
              key={hovered.id}
              className="interaction-prompt"
              style={{ '--accent': hovered.accent }}
            >
              <i />
              <div>
                <span>{TYPE_LABEL[hovered.type] ?? hovered.type.toUpperCase()}</span>
                <strong>{hovered.label}</strong>
                <em>{hovered.sublabel}</em>
              </div>
              <span className="interaction-prompt__action">
                <kbd>CLICK</kbd>
                {hovered.instruction}
              </span>
            </div>
          )}
        </div>

        <div className="hud__status">
          <span className={locked ? 'status-dot status-dot--live' : 'status-dot'} />
          {locked ? 'LIVE' : 'IDLE'}
          <span className="hud__status-divider" />
          {minimapOpen ? 'NAV ON' : 'NAV OFF'}
        </div>
      </footer>
    </div>
  );
}
