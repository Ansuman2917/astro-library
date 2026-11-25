import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { CuboidCollider, CylinderCollider, RigidBody } from '@react-three/rapier';
import { readingAreas, polar } from '../data/librarySections';
import { FLOOR_Y } from '../data/world';

function ReadingChair({ position, rotation, accent }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.47, 0]}>
        <boxGeometry args={[0.44, 0.07, 0.42]} />
        <meshStandardMaterial
          color="#182338"
          metalness={0.45}
          roughness={0.42}
          emissive={accent}
          emissiveIntensity={0.04}
        />
      </mesh>
      <mesh position={[0, 0.8, -0.2]} rotation={[-0.08, 0, 0]}>
        <boxGeometry args={[0.44, 0.52, 0.06]} />
        <meshStandardMaterial color="#101a2c" metalness={0.4} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.86, -0.235]} rotation={[-0.08, 0, 0]}>
        <boxGeometry args={[0.3, 0.025, 0.014]} />
        <meshBasicMaterial color={accent} toneMapped={false} />
      </mesh>
      {[
        [-0.17, 0.235, -0.16],
        [0.17, 0.235, -0.16],
        [-0.17, 0.235, 0.16],
        [0.17, 0.235, 0.16],
      ].map((leg, index) => (
        <mesh key={index} position={leg}>
          <boxGeometry args={[0.035, 0.47, 0.035]} />
          <meshStandardMaterial color="#2a3446" metalness={0.6} roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

function ReadingTable({ area, index }) {
  const holo = useRef();
  const orbit = useRef();
  const base = useRef();

  const layout = useMemo(() => {
    const radians = (area.angle * Math.PI) / 180;
    const outward = { x: Math.cos(radians), z: Math.sin(radians) };
    const chairRadius = 1.09;
    const chairs = [
      {
        position: [outward.x * chairRadius, 0, outward.z * chairRadius],
        rotation: [0, Math.atan2(-outward.x, -outward.z), 0],
      },
      {
        position: [-outward.x * chairRadius, 0, -outward.z * chairRadius],
        rotation: [0, Math.atan2(outward.x, outward.z), 0],
      },
    ];
    return { chairs };
  }, [area.angle]);

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime + index * 1.7;
    if (holo.current) {
      holo.current.rotation.y += delta * 0.55;
      holo.current.rotation.x = Math.sin(time * 0.4) * 0.18;
      holo.current.position.y = 1.32 + Math.sin(time * 0.85) * 0.045;
    }
    if (orbit.current) {
      orbit.current.rotation.z += delta * 0.34;
    }
    if (base.current) {
      base.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <group position={polar(area.angle, area.radius, FLOOR_Y)}>
      <RigidBody type="fixed" colliders={false}>
        <CylinderCollider args={[0.5, 0.8]} position={[0, 0.43, 0]} />
        {layout.chairs.map((chair, chairIndex) => (
          <CuboidCollider
            key={chairIndex}
            args={[0.23, 0.5, 0.23]}
            position={[chair.position[0], 0.5, chair.position[2]]}
            rotation={chair.rotation}
          />
        ))}
      </RigidBody>

      <mesh position={[0, 0.03, 0]}>
        <cylinderGeometry args={[0.5, 0.62, 0.06, 40]} />
        <meshStandardMaterial color="#111a2b" metalness={0.65} roughness={0.38} />
      </mesh>
      <mesh position={[0, 0.44, 0]}>
        <cylinderGeometry args={[0.16, 0.24, 0.78, 32]} />
        <meshStandardMaterial color="#1b2536" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh ref={base} position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.34, 0.22, 0.07, 32]} />
        <meshStandardMaterial
          color="#243149"
          metalness={0.6}
          roughness={0.35}
          emissive={area.color}
          emissiveIntensity={0.05}
        />
      </mesh>

      <mesh position={[0, 0.865, 0]}>
        <cylinderGeometry args={[0.8, 0.8, 0.055, 64]} />
        <meshPhysicalMaterial
          color="#0a182c"
          metalness={0.3}
          roughness={0.08}
          transparent
          opacity={0.78}
          clearcoat={1}
          clearcoatRoughness={0.12}
        />
      </mesh>
      <mesh position={[0, 0.898, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.3, 0.61, 64]} />
        <meshBasicMaterial
          color={area.color}
          transparent
          opacity={0.16}
          blending={2}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      <mesh ref={orbit} position={[0, 1.22, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.24, 0.005, 6, 48]} />
        <meshBasicMaterial
          color={area.color}
          transparent
          opacity={0.55}
          blending={2}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      <mesh ref={holo} position={[0, 1.32, 0]}>
        <octahedronGeometry args={[0.1, 0]} />
        <meshBasicMaterial
          color={area.color}
          wireframe
          transparent
          opacity={0.9}
          blending={2}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0, 1.32, 0]}>
        <octahedronGeometry args={[0.08, 0]} />
        <meshBasicMaterial
          color={area.color}
          transparent
          opacity={0.18}
          blending={2}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {layout.chairs.map((chair, chairIndex) => (
        <ReadingChair
          key={chairIndex}
          position={chair.position}
          rotation={chair.rotation}
          accent={area.color}
        />
      ))}
    </group>
  );
}

export default function ReadingAreas() {
  return (
    <group>
      {readingAreas.map((area, index) => (
        <ReadingTable key={area.id} area={area} index={index} />
      ))}
    </group>
  );
}
