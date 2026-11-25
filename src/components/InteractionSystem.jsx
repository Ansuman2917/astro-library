import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import {
  findInteractionForObject,
  getInteractionObjects,
} from '../three/interactionRegistry';
import { playerState, useUIStore } from '../store/useUIStore';
import { INTERACTION_RANGE } from '../data/world';
import { audioEngine } from '../audio/AudioEngine';

const INSTRUCTION = {
  book: 'Open portfolio entry',
  section: 'Open portfolio track',
  area: 'View focus table',
};

const CROSS_LEVEL_TYPES = new Set(['area', 'orrery']);

export default function InteractionSystem() {
  const { camera } = useThree();
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const center = useMemo(() => new THREE.Vector2(0, 0), []);
  const elapsed = useRef(0);
  const lastHoveredId = useRef(null);

  useFrame((state, delta) => {
    elapsed.current += delta;
    if (elapsed.current < 0.08) return;
    elapsed.current = 0;

    const ui = useUIStore.getState();
    if (!ui.locked || ui.activePanel || ui.settingsOpen) {
      if (ui.hovered) ui.setHovered(null);
      lastHoveredId.current = null;
      return;
    }

    const objects = getInteractionObjects();
    if (!objects.length) {
      if (ui.hovered) ui.setHovered(null);
      return;
    }

    raycaster.setFromCamera(center, camera);
    raycaster.far = 9;
    const hits = raycaster.intersectObjects(objects, false);

    let entry = null;
    for (const hit of hits) {
      const found = findInteractionForObject(hit.object);
      if (!found) continue;
      const crossLevel =
        CROSS_LEVEL_TYPES.has(found.type) ||
        found.id === 'section-orrery' ||
        found.id === 'section-entrance';
      if (
        !crossLevel &&
        found.level !== null &&
        found.level !== undefined &&
        found.level !== playerState.level
      ) {
        continue;
      }
      const maxRange = found.range ?? INTERACTION_RANGE;
      if (hit.distance > maxRange) continue;
      entry = found;
      break;
    }

    if (!entry) {
      if (ui.hovered) ui.setHovered(null);
      lastHoveredId.current = null;
      return;
    }

    if (lastHoveredId.current !== entry.id) {
      lastHoveredId.current = entry.id;
      audioEngine.hover();
    }

    ui.setHovered({
      id: entry.id,
      type: entry.type,
      label: entry.label,
      sublabel: entry.sublabel,
      accent: entry.accent,
      panel: entry.panel,
      instruction: INSTRUCTION[entry.type] ?? 'Inspect',
    });
  });

  return null;
}
