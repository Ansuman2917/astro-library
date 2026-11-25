import { useMemo, useState } from 'react';
import { useUIStore } from '../store/useUIStore';
import { audioEngine } from '../audio/AudioEngine';

const CONTROLS = [
  ['W A S D', 'Move'],
  ['Mouse', 'Look'],
  ['Space', 'Jump'],
  ['Shift', 'Sprint'],
  ['Click', 'Inspect'],
  ['Esc', 'Cursor'],
];

const PORTRAIT_URL = `${import.meta.env.BASE_URL}resume/Arshia_Swain_Photo.jpg`;

function makeStars(count) {
  let seed = 2718;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  return Array.from({ length: count }, (_, index) => ({
    id: index,
    left: `${random() * 100}%`,
    top: `${random() * 100}%`,
    size: `${1 + random() * 1.8}px`,
    opacity: 0.2 + random() * 0.7,
    delay: `${random() * -8}s`,
    duration: `${3 + random() * 5}s`,
  }));
}

export default function WelcomeScreen() {
  const enterLibrary = useUIStore((state) => state.enterLibrary);
  const [leaving, setLeaving] = useState(false);
  const stars = useMemo(() => makeStars(84), []);

  const handleEnter = () => {
    if (leaving) return;
    audioEngine.start();
    setLeaving(true);
    window.setTimeout(() => enterLibrary(), 420);
  };

  return (
    <div className={`welcome${leaving ? ' welcome--leaving' : ''}`}>
      <div className="welcome__stars" aria-hidden="true">
        {stars.map((star) => (
          <span
            key={star.id}
            style={{
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
              opacity: star.opacity,
              animationDelay: star.delay,
              animationDuration: star.duration,
            }}
          />
        ))}
      </div>

      <div className="welcome__grid" aria-hidden="true" />

      <header className="welcome__topbar">
        <div className="welcome__brand">
          <span className="welcome__brand-mark" />
          ARSHIA SWAIN · AI/ML PORTFOLIO
        </div>
        <div className="welcome__status">
          <i />
          APPLIED AI · GENERATIVE AI
        </div>
      </header>

      <main className="welcome__main">
        <section className="welcome__content">
          <p className="eyebrow">
            <span />
            An interactive 3D portfolio
          </p>

          <h1 className="welcome__title">
            <span>ARSHIA</span>
            <span className="welcome__title-accent">SWAIN</span>
          </h1>

          <p className="welcome__intro">
            Explore a first-person portfolio of applied AI and machine learning work. Inspect
            LLM-powered search, recommendation systems and computer vision projects, then climb to
            the experience gallery for credentials, toolkit and contact details.
          </p>

          <div className="welcome__controls" aria-label="Controls">
            {CONTROLS.map(([key, label]) => (
              <div key={label} className="welcome__control">
                <kbd>{key}</kbd>
                <span>{label}</span>
              </div>
            ))}
          </div>

          <div className="welcome__actions">
            <button type="button" className="button-primary" onClick={handleEnter} autoFocus>
              <span>ENTER PORTFOLIO</span>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 12h15M13 6l6 6-6 6" />
              </svg>
            </button>
            <p className="welcome__note">
              Best with headphones. Ambient audio begins after entry.
              <br />
              Desktop experience · mouse and keyboard required.
            </p>
          </div>
        </section>

        <aside className="welcome__profile" aria-label="Portrait of Arshia Swain">
          <span className="welcome__profile-glow" aria-hidden="true" />
          <div className="welcome__portrait">
            <div className="welcome__portrait-frame">
              <img src={PORTRAIT_URL} alt="Arshia Swain" />
              <span className="welcome__portrait-scan" aria-hidden="true" />
            </div>
          </div>
        </aside>
      </main>

      <footer className="welcome__footer">
        <span>ARSHIA SWAIN · AI/ML PORTFOLIO</span>
        <span>INTERACTIVE RESUME / NO. 01</span>
      </footer>

      {leaving && <div className="welcome__flash" aria-hidden="true" />}
    </div>
  );
}
