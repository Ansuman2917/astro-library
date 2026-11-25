import { useEffect, useMemo, useRef } from 'react';
import { playerState, useUIStore } from '../store/useUIStore';
import { getSectionMarker } from '../data/panelContent';
import { librarySections, readingAreas, polar } from '../data/librarySections';

const MAP_RADIUS = 78;
const WORLD_RADIUS = 9.6;
const FACTOR = MAP_RADIUS / WORLD_RADIUS;

const LABELS = {
  cartography: 'PROJ',
  archives: 'ML',
  lunar: 'GENAI',
  chronicles: 'VISION',
  mezzanine: 'EXP',
  orrery: 'TOOLKIT',
  entrance: 'CONTACT',
};

export default function MiniMap() {
  const level = useUIStore((state) => state.level);
  const playerRef = useRef();

  const markers = useMemo(
    () =>
      librarySections
        .filter((section) => section.id !== 'orrery' && section.id !== 'entrance')
        .map((section) => {
          const point = getSectionMarker(section);
          return {
            ...section,
            x: point.x * FACTOR,
            z: point.z * FACTOR,
            label: LABELS[section.id] ?? section.shortName,
          };
        }),
    []
  );

  const tables = useMemo(
    () =>
      readingAreas.map((area) => {
        const [x, , z] = polar(area.angle, area.radius, 0);
        return { ...area, x: x * FACTOR, z: z * FACTOR };
      }),
    []
  );

  useEffect(() => {
    let frame;
    const tick = () => {
      const group = playerRef.current;
      if (group) {
        const [x, , z] = playerState.position;
        const px = x * FACTOR;
        const pz = z * FACTOR;
        const degrees = (-playerState.yaw * 180) / Math.PI;
        group.setAttribute('transform', `translate(${px.toFixed(2)} ${pz.toFixed(2)}) rotate(${degrees.toFixed(1)})`);
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="minimap glass">
      <header className="minimap__head">
        <span>PORTFOLIO MAP</span>
        <span className="minimap__level">L{level === 1 ? '02' : '01'}</span>
      </header>

      <svg viewBox="-96 -96 192 192" className="minimap__svg" role="img" aria-label="Portfolio map">
        <circle r={MAP_RADIUS} className="minimap__outer" />
        <circle r={57} className="minimap__mezz" />
        <circle r={23} className="minimap__core-ring" />

        <path d="M -52 -18 A 55 55 0 0 1 -52 18" className="minimap__stairs" />
        <text x="-66" y="1" className="minimap__stairs-label">
          STAIR
        </text>

        <g className="minimap__orrery">
          <circle r="4.2" />
          <circle r="7.4" className="minimap__orrery-ring" />
        </g>

        {markers.map((marker) => (
          <g key={marker.id} transform={`translate(${marker.x} ${marker.z})`}>
            <title>{marker.name}</title>
            <circle
              r={marker.level === 1 ? 2.6 : 3}
              fill={marker.color}
              className={level === (marker.level ?? 0) ? 'minimap__dot minimap__dot--active' : 'minimap__dot'}
            />
            <text y="-6" textAnchor="middle" className="minimap__label">
              {marker.label}
            </text>
          </g>
        ))}

        {tables.map((table) => (
          <rect
            key={table.id}
            x={table.x - 2.2}
            y={table.z - 2.2}
            width="4.4"
            height="4.4"
            rx="1"
            fill={table.color}
            opacity="0.55"
          />
        ))}

        <g transform="translate(71.5 0)">
          <title>Entrance</title>
          <path d="M -4 -4 L 4 0 L -4 4 Z" fill="#f59e0b" opacity="0.85" />
          <text x="-10" y="-6" textAnchor="end" className="minimap__label">
            CONTACT
          </text>
        </g>

        <g ref={playerRef} className="minimap__player">
          <circle r="8" className="minimap__player-glow" />
          <path d="M 0 -7 L 4.6 4.6 L 0 2.4 L -4.6 4.6 Z" />
        </g>
      </svg>

      <footer className="minimap__foot">
        <span>
          <i /> YOU
        </span>
        <span>{level === 1 ? 'EXPERIENCE' : 'PROJECTS'}</span>
      </footer>
    </div>
  );
}
