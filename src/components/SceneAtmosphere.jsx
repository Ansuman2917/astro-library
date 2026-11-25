import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';

const ENTRANCE_LIGHT_HEIGHT = 1.9;

export default function SceneAtmosphere() {
  return (
    <>
      <color attach="background" args={['#030610']} />
      <fog attach="fog" args={['#040814', 20, 42]} />

      <ambientLight intensity={0.42} color="#8fa9e8" />
      <hemisphereLight args={['#87b6ff', '#120b24', 0.85]} />

      <pointLight position={[0, 8.6, 0]} intensity={38} distance={20} decay={2} color="#9ad7ff" />
      <pointLight position={[0, 3.1, 0]} intensity={22} distance={11} decay={2} color="#45e6ff" />
      <pointLight position={[6.4, 4.8, 6.4]} intensity={14} distance={14} decay={2} color="#8a63ff" />
      <pointLight position={[-6.4, 4.8, -6.4]} intensity={14} distance={14} decay={2} color="#ffc47d" />
      <pointLight
        position={[0, ENTRANCE_LIGHT_HEIGHT, 7.8]}
        intensity={7}
        distance={8}
        decay={2}
        color="#5ad7ff"
      />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.215, 0]}>
        <ringGeometry args={[1.9, 2.28, 64]} />
        <meshBasicMaterial
          color="#39dcff"
          transparent
          opacity={0.18}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.218, 0]}>
        <ringGeometry args={[2.32, 2.36, 64]} />
        <meshBasicMaterial
          color="#d9b26a"
          transparent
          opacity={0.45}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      <Sparkles
        count={140}
        scale={[17, 8.5, 17]}
        position={[0, 4.6, 0]}
        size={1.4}
        speed={0.18}
        opacity={0.4}
        color="#a9e6ff"
      />
    </>
  );
}
