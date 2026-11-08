import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { SkyLantern, getLanternCurrentPosition } from '../activities/FloatingLanterns';

export type CameraPreset = 'courtyard' | 'rocket' | 'sky' | 'altar' | 'rangoli';

interface CameraControllerProps {
  mode: 'intro' | 'exploration' | 'rocket_launch' | 'celebration' | 'lantern_follow';
  preset: CameraPreset;
  rocketYRef?: React.MutableRefObject<number>;
  introProgress?: number;
  trackedLantern?: SkyLantern | null;
  onUserInteracted?: () => void;
}

// Low-angle, immersive, ground-level presets inside the courtyard
const PRESET_TARGETS: Record<CameraPreset, { pos: [number, number, number]; target: [number, number, number] }> = {
  // Courtyard overview: standing at the open entrance archway looking into the courtyard
  courtyard: { pos: [0, 2.6, 9.5], target: [0, 1.3, 0] },
  // Rocket launch overview: comfortable distance showing launchpad, decorations, and sky above
  rocket: { pos: [0, 2.2, 6.8], target: [0, 1.1, 0] },
  // Diya altar view: standing in the open courtyard looking towards the illuminated altar
  altar: { pos: [-1.8, 2.2, 4.2], target: [-2.0, 0.6, -1.5] },
  // Rangoli studio: elevated angle looking at the intricate courtyard floor mandala
  rangoli: { pos: [-4.8, 3.2, -1.8], target: [-4.8, 0.02, -4.8] },
  // Sky view: looking up into the starlit fireworks expanse
  sky: { pos: [0, 2.2, 8.5], target: [0, 36.0, 0] },
};

export const CameraController: React.FC<CameraControllerProps> = ({
  mode,
  preset,
  rocketYRef,
  introProgress = 1,
  trackedLantern,
  onUserInteracted,
}) => {
  const { camera } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null);

  const targetPos = useRef(new THREE.Vector3(0, 2.6, 9.5));
  const targetLook = useRef(new THREE.Vector3(0, 1.3, 0));
  const isTransitioning = useRef(false);

  useEffect(() => {
    if (mode === 'exploration' || mode === 'celebration') {
      const config = PRESET_TARGETS[preset] || PRESET_TARGETS.courtyard;
      targetPos.current.set(...config.pos);
      targetLook.current.set(...config.target);
      isTransitioning.current = true;
    }
  }, [mode, preset]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);

    if (mode === 'intro') {
      const p = Math.max(0, Math.min(1, introProgress));
      const introX = Math.sin(p * Math.PI * 0.5) * 1.0;
      const introY = THREE.MathUtils.lerp(1.0, 2.6, p);
      const introZ = THREE.MathUtils.lerp(3.2, 9.5, p);

      camera.position.set(introX, introY, introZ);
      camera.lookAt(0, THREE.MathUtils.lerp(0.5, 1.3, p), 0);
    } else if (mode === 'rocket_launch') {
      // Rocket ascent: Camera stays comfortably stationed in the courtyard at a distance,
      // tilting gracefully upward so the user sees the launch, rocket flight, night sky,
      // and the spectacular apex explosion + "HAPPY DIWALI" reveal.
      const rY = rocketYRef ? rocketYRef.current : 0.42;
      const lookY = Math.max(1.15, Math.min(36, rY * 0.95 + 1.0));

      camera.position.lerp(new THREE.Vector3(0, 2.2, 8.5), dt * 2.5);
      if (controlsRef.current) {
        // Smoothly track the ascending rocket and night sky
        controlsRef.current.target.lerp(new THREE.Vector3(0, lookY, 0), dt * 4.0);
        controlsRef.current.update();
      }
    } else if (mode === 'celebration' && preset === 'sky') {
      // In celebration sky mode, keep camera gracefully framed on the night sky fireworks!
      camera.position.lerp(new THREE.Vector3(0, 2.2, 8.5), dt * 2.0);
      if (controlsRef.current) {
        controlsRef.current.target.lerp(new THREE.Vector3(0, 36.0, 0), dt * 3.5);
        controlsRef.current.update();
      }
    } else if (mode === 'lantern_follow' && trackedLantern) {
      // Smoothly follow the ascending lantern from an unobtrusive distance
      const lPos = getLanternCurrentPosition(trackedLantern);
      const camTargetPos = new THREE.Vector3(
        lPos.x * 0.4,
        Math.max(2.2, lPos.y * 0.5 + 1.2),
        Math.max(5.5, lPos.z + 5.5)
      );
      const camLookTarget = new THREE.Vector3(lPos.x, lPos.y, lPos.z);

      camera.position.lerp(camTargetPos, dt * 2.2);
      if (controlsRef.current) {
        controlsRef.current.target.lerp(camLookTarget, dt * 3.0);
        controlsRef.current.update();
      }
    } else if (isTransitioning.current) {
      // Smoothly glide to the newly selected preset target once
      camera.position.lerp(targetPos.current, dt * 3.2);
      if (controlsRef.current) {
        controlsRef.current.target.lerp(targetLook.current, dt * 3.2);
        controlsRef.current.update();
      }

      // Once arrived within small threshold, release 100% control to OrbitControls
      if (
        camera.position.distanceTo(targetPos.current) < 0.12 &&
        controlsRef.current &&
        controlsRef.current.target.distanceTo(targetLook.current) < 0.12
      ) {
        isTransitioning.current = false;
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enabled={mode === 'exploration' || mode === 'celebration' || mode === 'rocket_launch' || mode === 'lantern_follow'}
      enableDamping={true}
      dampingFactor={0.07}
      rotateSpeed={0.75}
      panSpeed={0.5}
      zoomSpeed={1.0}
      enableZoom={true}
      minDistance={1.8}
      maxDistance={25}
      minPolarAngle={Math.PI / 14}
      maxPolarAngle={Math.PI / 2.06} // Never clips underneath the courtyard marble floor
      onStart={() => {
        // User interacted! Immediately stop auto-transition and lantern lock
        isTransitioning.current = false;
        onUserInteracted?.();
      }}
    />
  );
};
