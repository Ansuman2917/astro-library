import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { registerInteraction, unregisterInteraction } from '../three/interactionRegistry';
import { useUIStore } from '../store/useUIStore';
import { getGlowTexture } from '../utils/glowTexture';

const PROXY_RADIUS = {
  book: 0.21,
  section: 0.3,
  area: 0.26,
  orrery: 0.55,
  entrance: 0.3,
};

const CORE_SIZE = {
  book: 0.085,
  section: 0.13,
  area: 0.11,
  orrery: 0.2,
  entrance: 0.12,
};

const MARKER_COLOR = '#4ade80';

export default function InteractiveObject({
  id,
  position,
  color = '#67e8f9',
  type = 'book',
  variant = type,
  label,
  sublabel = '',
  level = null,
  panel,
  proxyRadius,
  range,
  markerScale = 1,
}) {
  const hovered = useUIStore((state) => state.hovered?.id === id);
  const spin = useRef();
  const proxy = useRef();
  const spriteMaterial = useRef();
  const glow = useMemo(() => getGlowTexture(), []);
  const core = CORE_SIZE[variant] ?? CORE_SIZE.book;
  const proxySize = proxyRadius ?? PROXY_RADIUS[variant] ?? 0.24;
  const isSection = variant === 'section' || variant === 'orrery';
  const ringRadius = variant === 'orrery' ? 0.5 : variant === 'section' ? 0.25 : 0.17;

  useEffect(() => {
    const object = proxy.current;
    if (!object) return undefined;
    registerInteraction({
      id,
      type,
      label,
      sublabel,
      level,
      range,
      accent: color,
      panel,
      object,
    });
    return () => unregisterInteraction(id);
    // Interaction metadata is static for the lifetime of a hotspot.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;
    if (spin.current) {
      spin.current.rotation.y += delta * (hovered ? 1.9 : 0.5);
      spin.current.rotation.x = Math.sin(time * 0.55 + id.length) * 0.1;
      const pulse = 1 + Math.sin(time * 2.1 + id.length) * 0.045 + (hovered ? 0.16 : 0);
      spin.current.scale.setScalar(pulse);
      spin.current.position.y = Math.sin(time * 0.85 + id.length) * 0.035;
    }
    if (spriteMaterial.current) {
      spriteMaterial.current.opacity = hovered ? 0.62 : 0.26;
    }
  });

  return (
    <group position={position}>
      <group ref={spin}>
        <mesh>
          <octahedronGeometry args={[core, 0]} />
          <meshBasicMaterial
            color={MARKER_COLOR}
            transparent
            opacity={hovered ? 0.42 : 0.2}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
        <mesh scale={1.06}>
          <octahedronGeometry args={[core, 0]} />
          <meshBasicMaterial
            color={MARKER_COLOR}
            wireframe
            transparent
            opacity={hovered ? 1 : 0.72}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>

        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[ringRadius * markerScale, 0.007 * markerScale, 6, 40]} />
          <meshBasicMaterial
            color={MARKER_COLOR}
            transparent
            opacity={hovered ? 0.95 : 0.55}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>

        {(isSection || variant === 'area') && (
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry
              args={[ringRadius * 1.25 * markerScale, 0.005 * markerScale, 6, 40]}
            />
            <meshBasicMaterial
              color={MARKER_COLOR}
              transparent
              opacity={hovered ? 0.8 : 0.38}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>
        )}

        {variant === 'orrery' && (
          <mesh rotation={[Math.PI / 2.4, 0.4, 0]}>
            <torusGeometry args={[0.72 * markerScale, 0.005 * markerScale, 6, 48]} />
            <meshBasicMaterial
              color={MARKER_COLOR}
              transparent
              opacity={hovered ? 0.7 : 0.35}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>
        )}

        {variant === 'section' && (
          <mesh position={[0, -0.32, 0]}>
            <cylinderGeometry args={[0.004, 0.05, 0.5, 8, 1, true]} />
            <meshBasicMaterial
              color={MARKER_COLOR}
              transparent
              opacity={hovered ? 0.28 : 0.12}
              side={THREE.DoubleSide}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>
        )}

        {glow && (
          <sprite scale={[0.62 * markerScale, 0.62 * markerScale, 1]}>
            <spriteMaterial
              ref={spriteMaterial}
              map={glow}
              color={MARKER_COLOR}
              transparent
              opacity={0.26}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              toneMapped={false}
            />
          </sprite>
        )}
      </group>

      <mesh ref={proxy}>
        <sphereGeometry args={[proxySize, 6, 6]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} colorWrite={false} />
      </mesh>
    </group>
  );
}
