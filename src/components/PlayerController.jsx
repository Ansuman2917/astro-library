import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { CapsuleCollider, RigidBody, useRapier } from '@react-three/rapier';
import * as THREE from 'three';
import {
  EYE_OFFSET,
  GRAVITY,
  JUMP_SPEED,
  SPAWN,
  SPAWN_YAW,
  SPRINT_SPEED,
  WALK_SPEED,
} from '../data/world';
import { useUIStore, playerState } from '../store/useUIStore';
import { usePlayerControls } from '../hooks/usePlayerControls';
import { audioEngine } from '../audio/AudioEngine';

const CAPSULE_HALF_HEIGHT = 0.5;
const CAPSULE_RADIUS = 0.35;
const FEET_OFFSET = CAPSULE_HALF_HEIGHT + CAPSULE_RADIUS;

const isTyping = (target) =>
  target instanceof HTMLElement &&
  (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT');

export default function PlayerController() {
  const { camera, gl } = useThree();
  const { world } = useRapier();
  const body = useRef();
  const collider = useRef();
  const { keys, jumpRequested, sprintRequested } = usePlayerControls();

  const targetYaw = useRef(SPAWN_YAW);
  const targetPitch = useRef(0);
  const yaw = useRef(SPAWN_YAW);
  const pitch = useRef(0);
  const verticalVelocity = useRef(0);
  const horizontalVelocity = useRef(new THREE.Vector2());
  const grounded = useRef(true);
  const wasGrounded = useRef(true);
  const bobPhase = useRef(0);
  const stepDistance = useRef(0);
  const lastLevel = useRef(0);
  const respawnCooldown = useRef(0);
  const position = useRef(new THREE.Vector3(SPAWN[0], SPAWN[1], SPAWN[2]));

  const controller = useMemo(() => {
    const character = world.createCharacterController(0.02);
    character.enableAutostep(0.42, 0.22, false);
    character.enableSnapToGround(0.4);
    character.setApplyImpulsesToDynamicBodies(true);
    character.setCharacterMass(78);
    character.setMaxSlopeClimbAngle((52 * Math.PI) / 180);
    character.setMinSlopeSlideAngle((32 * Math.PI) / 180);
    character.setSlideEnabled(true);
    return character;
  }, [world]);

  useEffect(() => () => world.removeCharacterController(controller), [world, controller]);

  useEffect(() => {
    camera.rotation.order = 'YXZ';
    camera.position.set(SPAWN[0], SPAWN[1] + EYE_OFFSET, SPAWN[2]);
  }, [camera]);

  useEffect(() => {
    const canvas = gl.domElement;

    const onPointerLockChange = () => {
      const locked = document.pointerLockElement === canvas;
      useUIStore.getState().setLocked(locked);
      if (locked) useUIStore.getState().setHasBegun(true);
      if (!locked) {
        keys.current.clear();
        sprintRequested.current = false;
      }
    };

    const onPointerLockError = () => {
      useUIStore.getState().setLocked(false);
    };

    const onMouseMove = (event) => {
      if (document.pointerLockElement !== canvas) return;
      if (useUIStore.getState().activePanel) return;
      const sensitivity = useUIStore.getState().sensitivity;
      targetYaw.current -= event.movementX * sensitivity;
      targetPitch.current -= event.movementY * sensitivity;
      targetPitch.current = THREE.MathUtils.clamp(targetPitch.current, -1.46, 1.46);
    };

    const onMouseDown = (event) => {
      if (event.button !== 0) return;
      if (document.pointerLockElement !== canvas) return;
      if (isTyping(event.target)) return;
      const state = useUIStore.getState();
      if (!state.hovered || state.activePanel) return;
      audioEngine.interact();
      state.openPanel(state.hovered.panel);
    };

    document.addEventListener('pointerlockchange', onPointerLockChange);
    document.addEventListener('pointerlockerror', onPointerLockError);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mousedown', onMouseDown);

    return () => {
      document.removeEventListener('pointerlockchange', onPointerLockChange);
      document.removeEventListener('pointerlockerror', onPointerLockError);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mousedown', onMouseDown);
    };
  }, [gl, keys, sprintRequested]);

  useFrame((state, rawDelta) => {
    const dt = Math.min(rawDelta, 0.05);
    const bodyApi = body.current;
    const colliderApi = collider.current;
    if (!bodyApi || !colliderApi) return;

    const ui = useUIStore.getState();
    const canMove = ui.locked || Boolean(ui.activePanel);
    const canLook = ui.locked && !ui.activePanel;

    const k = keys.current;
    const forwardInput = (k.has('KeyW') ? 1 : 0) - (k.has('KeyS') ? 1 : 0);
    const strafeInput = (k.has('KeyD') ? 1 : 0) - (k.has('KeyA') ? 1 : 0);
    const movingInput = canMove && (forwardInput !== 0 || strafeInput !== 0);
    const sprinting = canMove && sprintRequested.current && movingInput;

    if (canLook) {
      const smoothing = 1 - Math.exp(-22 * dt);
      yaw.current += (targetYaw.current - yaw.current) * smoothing;
      pitch.current += (targetPitch.current - pitch.current) * smoothing;
    } else {
      const smoothing = 1 - Math.exp(-10 * dt);
      yaw.current += (targetYaw.current - yaw.current) * smoothing;
      pitch.current += (targetPitch.current - pitch.current) * smoothing;
    }

    let desiredX = 0;
    let desiredZ = 0;
    if (movingInput) {
      desiredX =
        -Math.sin(yaw.current) * forwardInput + Math.cos(yaw.current) * strafeInput;
      desiredZ =
        -Math.cos(yaw.current) * forwardInput - Math.sin(yaw.current) * strafeInput;
      const length = Math.hypot(desiredX, desiredZ) || 1;
      desiredX /= length;
      desiredZ /= length;
    }

    const targetSpeed = movingInput ? (sprinting ? SPRINT_SPEED : WALK_SPEED) : 0;
    const accel = grounded.current ? 13 : 3.2;
    horizontalVelocity.current.x = THREE.MathUtils.damp(
      horizontalVelocity.current.x,
      desiredX * targetSpeed,
      accel,
      dt
    );
    horizontalVelocity.current.y = THREE.MathUtils.damp(
      horizontalVelocity.current.y,
      desiredZ * targetSpeed,
      accel,
      dt
    );

    if (jumpRequested.current) {
      if (grounded.current && canMove) {
        verticalVelocity.current = JUMP_SPEED;
        grounded.current = false;
        audioEngine.jump();
      }
      jumpRequested.current = false;
    }

    verticalVelocity.current += GRAVITY * dt;
    verticalVelocity.current = Math.max(verticalVelocity.current, -42);

    const desiredTranslation = {
      x: horizontalVelocity.current.x * dt,
      y: verticalVelocity.current * dt,
      z: horizontalVelocity.current.y * dt,
    };

    controller.computeColliderMovement(colliderApi, desiredTranslation);
    const corrected = controller.computedMovement();
    const isGrounded = controller.computedGrounded();

    if (isGrounded && verticalVelocity.current < 0) verticalVelocity.current = 0;
    if (!isGrounded && verticalVelocity.current > 0 && corrected.y < desiredTranslation.y * 0.6) {
      verticalVelocity.current = 0;
    }

    position.current.x += corrected.x;
    position.current.y += corrected.y;
    position.current.z += corrected.z;
    const next = position.current;

    respawnCooldown.current = Math.max(0, respawnCooldown.current - dt);
    const radialDistance = Math.hypot(next.x, next.z);
    if ((next.y < -5 || radialDistance > 12) && respawnCooldown.current === 0) {
      position.current.set(SPAWN[0], SPAWN[1], SPAWN[2]);
      bodyApi.setTranslation({ x: SPAWN[0], y: SPAWN[1], z: SPAWN[2] }, true);
      verticalVelocity.current = 0;
      horizontalVelocity.current.set(0, 0);
      targetYaw.current = SPAWN_YAW;
      yaw.current = SPAWN_YAW;
      targetPitch.current = 0;
      pitch.current = 0;
      respawnCooldown.current = 1;
      return;
    }

    bodyApi.setNextKinematicTranslation(next);

    if (wasGrounded.current && !isGrounded && verticalVelocity.current < -1) {
      /* walked off a ledge */
    }
    if (!wasGrounded.current && isGrounded && verticalVelocity.current < -3) {
      audioEngine.land();
    }
    wasGrounded.current = isGrounded;
    grounded.current = isGrounded;

    const actualSpeed = Math.hypot(corrected.x, corrected.z) / Math.max(dt, 0.0001);
    const isMoving = movingInput && actualSpeed > 0.35;

    if (isGrounded && isMoving) {
      stepDistance.current += actualSpeed * dt;
      const stride = sprinting ? 1.55 : 2.05;
      if (stepDistance.current >= stride) {
        stepDistance.current = 0;
        audioEngine.footstep(sprinting);
      }
      bobPhase.current += dt * (sprinting ? 11.5 : 8.2);
    } else {
      stepDistance.current = 0;
      bobPhase.current += dt * 1.4;
    }

    const bobEnabled = ui.bobEnabled;
    const bobAmplitude = isGrounded && isMoving ? (sprinting ? 0.05 : 0.035) : 0;
    const bob = bobEnabled ? Math.sin(bobPhase.current) * bobAmplitude : 0;
    const sway = bobEnabled ? Math.cos(bobPhase.current * 0.5) * bobAmplitude * 0.25 : 0;

    camera.position.set(next.x + sway, next.y + EYE_OFFSET + bob, next.z);
    camera.rotation.set(pitch.current, yaw.current, 0);

    const targetFov = sprinting ? 82 : 74;
    if (Math.abs(camera.fov - targetFov) > 0.05) {
      camera.fov = THREE.MathUtils.damp(camera.fov, targetFov, 6, dt);
      camera.updateProjectionMatrix();
    }

    const feetY = next.y - FEET_OFFSET;
    const level = feetY > 3.35 ? 1 : 0;
    if (level !== lastLevel.current) {
      lastLevel.current = level;
      ui.setLevel(level);
    }

    playerState.position[0] = next.x;
    playerState.position[1] = feetY;
    playerState.position[2] = next.z;
    playerState.yaw = yaw.current;
    playerState.pitch = pitch.current;
    playerState.speed = actualSpeed;
    playerState.grounded = isGrounded;
    playerState.level = level;
    playerState.moving = isMoving;
  });

  return (
    <RigidBody
      ref={body}
      type="kinematicPosition"
      colliders={false}
      position={SPAWN}
      enabledRotations={[false, false, false]}
    >
      <CapsuleCollider
        ref={collider}
        args={[CAPSULE_HALF_HEIGHT, CAPSULE_RADIUS]}
        friction={0}
        restitution={0}
      />
    </RigidBody>
  );
}
