import { useEffect, useMemo, useRef } from 'react';
import { CuboidCollider, CylinderCollider, RigidBody, TrimeshCollider } from '@react-three/rapier';
import { useAnimations, useGLTF } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { MODEL_URL, LIBRARY_RADIUS, FLOOR_Y } from '../data/world';
import { useUIStore } from '../store/useUIStore';

const isBookGeometry = (object) => {
  let node = object;
  while (node) {
    if (node.name === 'Books' || node.name?.startsWith('Book')) return true;
    node = node.parent;
  }
  return false;
};

const point = new THREE.Vector3();

function buildColliderGeometry(scene) {
  scene.updateMatrixWorld(true);
  const colliders = [];

  scene.traverse((object) => {
    if (!object.isMesh || !object.geometry) return;
    if (isBookGeometry(object)) return;

    const geometry = object.geometry;
    const position = geometry.attributes?.position;
    if (!position) return;

    const vertices = new Float32Array(position.count * 3);
    for (let i = 0; i < position.count; i += 1) {
      point.set(position.getX(i), position.getY(i), position.getZ(i));
      point.applyMatrix4(object.matrixWorld);
      vertices[i * 3] = point.x;
      vertices[i * 3 + 1] = point.y;
      vertices[i * 3 + 2] = point.z;
    }

    let indices;
    if (geometry.index) {
      indices = new Uint32Array(geometry.index.count);
      for (let i = 0; i < geometry.index.count; i += 1) indices[i] = geometry.index.getX(i);
    } else {
      indices = new Uint32Array(position.count);
      for (let i = 0; i < position.count; i += 1) indices[i] = i;
    }

    colliders.push({ vertices, indices, source: object.name });
  });

  return colliders;
}

export default function LibraryEnvironment() {
  const gltf = useGLTF(MODEL_URL, false, true);
  const gl = useThree((state) => state.gl);
  const setSceneReady = useUIStore((state) => state.setSceneReady);
  const rootRef = useRef();
  const { actions } = useAnimations(gltf.animations, rootRef);

  const scene = useMemo(() => {
    const clone = gltf.scene.clone(true);
    clone.traverse((object) => {
      if (!object.isMesh) return;
      object.castShadow = false;
      object.receiveShadow = false;
      object.frustumCulled = true;
    });
    return clone;
  }, [gltf.scene]);

  const colliders = useMemo(() => buildColliderGeometry(scene), [scene]);

  useEffect(() => {
    const maxAnisotropy = gl.capabilities.getMaxAnisotropy();
    const seen = new Set();
    scene.traverse((object) => {
      if (!object.isMesh) return;
      const materials = Array.isArray(object.material) ? object.material : [object.material];
      materials.forEach((material) => {
        if (!material || seen.has(material.uuid)) return;
        seen.add(material.uuid);
        for (const key of ['map', 'emissiveMap', 'roughnessMap', 'metalnessMap', 'normalMap']) {
          if (material[key]) {
            material[key].anisotropy = maxAnisotropy;
            material[key].needsUpdate = true;
          }
        }
        material.needsUpdate = true;
      });
    });
  }, [scene, gl]);

  useEffect(() => {
    const first = Object.values(actions)[0];
    if (first) first.reset().fadeIn(1.2).play();
    return () => {
      if (first) first.stop();
    };
  }, [actions]);

  useEffect(() => {
    setSceneReady(true);
    return () => setSceneReady(false);
  }, [setSceneReady]);

  const boundary = useMemo(() => {
    const segments = 32;
    const width = (2 * Math.PI * LIBRARY_RADIUS) / segments + 0.12;
    return Array.from({ length: segments }, (_, index) => {
      const theta = (index / segments) * Math.PI * 2;
      return {
        position: [Math.cos(theta) * (LIBRARY_RADIUS - 0.05), 4.2, Math.sin(theta) * (LIBRARY_RADIUS - 0.05)],
        rotation: [0, -theta, 0],
        halfExtents: [0.14, 4.1, width / 2],
      };
    });
  }, []);

  return (
    <group ref={rootRef}>
      <primitive object={scene} />

      <RigidBody type="fixed" colliders={false} friction={0.9}>
        {colliders.map((collider, index) => (
          <TrimeshCollider
            key={`${collider.source}-${index}`}
            args={[collider.vertices, collider.indices]}
            restitution={0}
            friction={0.9}
          />
        ))}

        <CylinderCollider args={[0.2, LIBRARY_RADIUS]} position={[0, FLOOR_Y - 0.2, 0]} friction={1} />

        {boundary.map((segment, index) => (
          <CuboidCollider
            key={`boundary-${index}`}
            args={segment.halfExtents}
            position={segment.position}
            rotation={segment.rotation}
          />
        ))}
      </RigidBody>
    </group>
  );
}

useGLTF.preload(MODEL_URL, false, true);

