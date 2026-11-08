import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export interface SkyLantern {
  id: string;
  initialPos: [number, number, number];
  wish: string;
  sender: string;
  createdAt: number;
  speed: number;
  swayPhase: number;
}

interface FloatingLanternsProps {
  lanterns: SkyLantern[];
}

export const FloatingLanterns: React.FC<FloatingLanternsProps> = ({ lanterns }) => {
  return (
    <group>
      {lanterns.map((l) => (
        <SingleLantern key={l.id} lantern={l} />
      ))}
    </group>
  );
};

export function getLanternCurrentPosition(lantern: SkyLantern): THREE.Vector3 {
  const elapsedSec = (Date.now() - lantern.createdAt) / 1000;
  const y = lantern.initialPos[1] + elapsedSec * lantern.speed * 2.8;
  const x = lantern.initialPos[0] + Math.sin(elapsedSec * 0.4 + lantern.swayPhase) * 1.5;
  const z = lantern.initialPos[2] + Math.cos(elapsedSec * 0.3 + lantern.swayPhase) * 1.2;
  return new THREE.Vector3(x, y, z);
}

const SingleLantern: React.FC<{ lantern: SkyLantern }> = ({ lantern }) => {
  const groupRef = useRef<THREE.Group>(null);

  const paperMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#ff9f1c',
        emissive: '#ff7700',
        emissiveIntensity: 0.85,
        roughness: 0.35,
        transparent: true,
        opacity: 0.95,
      }),
    []
  );

  const ringMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#8c531b',
        roughness: 0.7,
      }),
    []
  );

  useFrame(() => {
    if (!groupRef.current) return;
    const pos = getLanternCurrentPosition(lantern);
    const elapsedSec = (Date.now() - lantern.createdAt) / 1000;

    groupRef.current.position.copy(pos);
    groupRef.current.rotation.z = Math.sin(elapsedSec * 0.8 + lantern.swayPhase) * 0.08;
    groupRef.current.rotation.x = Math.cos(elapsedSec * 0.6 + lantern.swayPhase) * 0.06;
  });

  return (
    <group ref={groupRef} position={lantern.initialPos} scale={[0.85, 0.85, 0.85]}>
      {/* Translucent Paper Lantern Body */}
      <mesh castShadow position={[0, 0.5, 0]} material={paperMaterial}>
        <cylinderGeometry args={[0.34, 0.26, 0.95, 16]} />
      </mesh>

      {/* Top Paper Dome */}
      <mesh position={[0, 0.97, 0]} material={paperMaterial}>
        <sphereGeometry args={[0.34, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
      </mesh>

      {/* Lower Bamboo Collar Ring */}
      <mesh position={[0, 0.05, 0]} material={ringMaterial}>
        <torusGeometry args={[0.27, 0.02, 8, 24]} />
      </mesh>

      {/* Candle Flame Inside */}
      <mesh position={[0, 0.22, 0]}>
        <sphereGeometry args={[0.075, 12, 12]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* Internal Warm Lantern Glow */}
      <pointLight color="#ff9e00" intensity={2.2} distance={8} decay={2} />
    </group>
  );
};
