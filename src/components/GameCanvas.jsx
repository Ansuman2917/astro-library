import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import PhysicsWorld from './PhysicsWorld';
import SceneAtmosphere from './SceneAtmosphere';
import LibraryEnvironment from './LibraryEnvironment';
import PlayerController from './PlayerController';
import ReadingAreas from './ReadingAreas';
import CollisionDebug from './CollisionDebug';
import InteractiveSpots from './InteractiveSpots';
import InteractionSystem from './InteractionSystem';
import { EYE_OFFSET, SPAWN } from '../data/world';

export default function GameCanvas() {
  return (
    <div className="canvas-shell">
      <Canvas
        dpr={[1, 1.75]}
        camera={{
          fov: 74,
          near: 0.05,
          far: 70,
          position: [SPAWN[0], SPAWN[1] + EYE_OFFSET, SPAWN[2]],
        }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          stencil: false,
        }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.08;
          gl.outputColorSpace = THREE.SRGBColorSpace;
        }}
      >
        <Suspense fallback={null}>
          <SceneAtmosphere />
          <PhysicsWorld>
            <LibraryEnvironment />
            <ReadingAreas />
            <PlayerController />
            <CollisionDebug />
          </PhysicsWorld>
          <InteractiveSpots />
          <InteractionSystem />
        </Suspense>
      </Canvas>
    </div>
  );
}
