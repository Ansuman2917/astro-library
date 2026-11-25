import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useRapier } from '@react-three/rapier';
import * as THREE from 'three';
import { useUIStore } from '../store/useUIStore';

const COLORS = {
  floor: [0.15, 0.95, 1],
  structure: [0.5, 1, 0.4],
  upper: [1, 0.32, 0.86],
};

function colorForY(y) {
  if (y < 0.8) return COLORS.floor;
  if (y < 4.1) return COLORS.structure;
  return COLORS.upper;
}

export default function CollisionDebug() {
  const showDebug = useUIStore((state) => state.showDebug);
  const { world } = useRapier();
  const lines = useRef();
  const enabled = import.meta.env.DEV && showDebug;

  useEffect(
    () => () => {
      if (lines.current?.geometry) lines.current.geometry.dispose();
    },
    []
  );

  useFrame(() => {
    if (!enabled) return;
    const mesh = lines.current;
    if (!mesh) return;

    const buffers = world.debugRender();
    const source = buffers.vertices;
    const colors = new Float32Array(source.length);

    for (let i = 0; i < source.length; i += 6) {
      const y = (source[i + 1] + source[i + 4]) / 2;
      const color = colorForY(y);
      for (let vertex = 0; vertex < 2; vertex += 1) {
        const base = i + vertex * 3;
        colors[base] = color[0];
        colors[base + 1] = color[1];
        colors[base + 2] = color[2];
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(source), 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    mesh.geometry.dispose();
    mesh.geometry = geometry;
  });

  if (!enabled) return null;

  return (
    <lineSegments ref={lines} frustumCulled={false} renderOrder={999}>
      <bufferGeometry />
      <lineBasicMaterial
        vertexColors
        transparent
        opacity={0.92}
        depthTest={false}
        depthWrite={false}
        toneMapped={false}
      />
    </lineSegments>
  );
}
