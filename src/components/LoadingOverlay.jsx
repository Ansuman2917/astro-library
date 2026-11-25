import { useEffect, useState } from 'react';
import { useProgress } from '@react-three/drei';
import { useUIStore } from '../store/useUIStore';

const STATUS = [
  { threshold: 0, label: 'Initializing portfolio scene' },
  { threshold: 32, label: 'Loading 3D environment' },
  { threshold: 68, label: 'Preparing materials' },
  { threshold: 92, label: 'Calibrating interaction physics' },
];

export default function LoadingOverlay() {
  const sceneReady = useUIStore((state) => state.sceneReady);
  const { progress, active } = useProgress();
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (!sceneReady) {
      setVisible(true);
      setLeaving(false);
      return undefined;
    }
    setLeaving(true);
    const timer = window.setTimeout(() => setVisible(false), 700);
    return () => window.clearTimeout(timer);
  }, [sceneReady]);

  if (!visible) return null;

  const percent = Math.min(100, Math.round(progress));
  const status = [...STATUS].reverse().find((item) => percent >= item.threshold) ?? STATUS[0];

  return (
    <div className={`loading${leaving ? ' loading--leaving' : ''}`} role="status" aria-live="polite">
      <div className="loading__panel">
        <div className="loading__mark">
          <div className="loading__ring" />
          <div className="loading__core" />
        </div>

        <p className="eyebrow">
          <span />
          ARSHIA SWAIN
        </p>
        <h2 className="loading__title">Preparing the portfolio</h2>

        <div className={`loading__bar${active ? '' : ' loading__bar--idle'}`}>
          <span style={{ width: `${active ? percent : 38}%` }} />
        </div>

        <div className="loading__meta">
          <span>{status.label}</span>
          <span className="loading__percent">{active ? `${percent}%` : 'SYNC'}</span>
        </div>

        <p className="loading__hint">
          First load decodes 285k triangles and 29 textures. Subsequent visits use the browser
          cache.
        </p>
      </div>
    </div>
  );
}
