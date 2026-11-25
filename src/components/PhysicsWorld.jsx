import { Physics } from '@react-three/rapier';
import { GRAVITY } from '../data/world';

export default function PhysicsWorld({ children }) {
  return (
    <Physics gravity={[0, GRAVITY, 0]} timeStep={1 / 60} interpolate>
      {children}
    </Physics>
  );
}
