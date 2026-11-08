import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { audioManager } from '../../utils/audio';

interface DiyaModelProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  isLit?: boolean;
  onIgnite?: () => void;
  interactive?: boolean;
  intensityMultiplier?: number;
}

export const DiyaModel: React.FC<DiyaModelProps> = ({
  position,
  rotation = [0, 0, 0],
  scale = 1,
  isLit = true,
  onIgnite,
  interactive = true,
  intensityMultiplier = 1,
}) => {
  const flameRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const innerFlameRef = useRef<THREE.Mesh>(null);
  const outerFlameRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!isLit) return;
    const t = clock.getElapsedTime() * 7 + position[0] * 3.5;
    const flicker = Math.sin(t * 1.7) * Math.cos(t * 2.3);
    const noise = (Math.sin(t * 5.1) + Math.cos(t * 7.3)) * 0.15;

    if (flameRef.current) {
      flameRef.current.scale.y = 1 + flicker * 0.15 + noise * 0.1;
      flameRef.current.scale.x = 1 - flicker * 0.08;
      flameRef.current.scale.z = 1 - flicker * 0.08;
      flameRef.current.rotation.z = Math.sin(t * 1.2) * 0.08;
    }

    if (lightRef.current) {
      lightRef.current.intensity = (2.2 + flicker * 0.6 + noise * 0.4) * intensityMultiplier;
      lightRef.current.position.y = 0.22 + flicker * 0.02;
    }
  });

  const clayMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#8b4513',
        roughness: 0.75,
        metalness: 0.15,
      }),
    []
  );

  const brassTrimMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#c49a45',
        roughness: 0.35,
        metalness: 0.85,
      }),
    []
  );

  const innerFlameMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#ffffff',
      }),
    []
  );

  const outerFlameMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#ff7700',
        transparent: true,
        opacity: 0.88,
      }),
    []
  );

  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    if (interactive) {
      if (!isLit) {
        audioManager.playDiyaLight();
      }
      onIgnite?.();
    }
  };

  return (
    <group
      position={position}
      rotation={rotation}
      scale={[scale, scale, scale]}
      onClick={handleClick}
    >
      <mesh castShadow receiveShadow material={clayMaterial} position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.26, 0.12, 0.1, 24]} />
      </mesh>

      <mesh material={brassTrimMaterial} position={[0, 0.1, 0]}>
        <torusGeometry args={[0.26, 0.02, 12, 24]} />
      </mesh>

      <mesh material={clayMaterial} position={[0.24, 0.08, 0]} rotation={[0, 0, -0.3]}>
        <coneGeometry args={[0.07, 0.14, 16]} />
      </mesh>

      <mesh position={[0.22, 0.12, 0]} rotation={[0, 0, -0.4]}>
        <cylinderGeometry args={[0.018, 0.02, 0.1, 8]} />
        <meshBasicMaterial color={isLit ? '#3a1f10' : '#4a4036'} />
      </mesh>

      <mesh position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.22, 24]} />
        <meshStandardMaterial color="#4a2c00" roughness={0.1} metalness={0.4} />
      </mesh>

      {isLit && (
        <group ref={flameRef} position={[0.24, 0.18, 0]}>
          <mesh ref={outerFlameRef} material={outerFlameMaterial} position={[0, 0.09, 0]}>
            <sphereGeometry args={[0.065, 16, 16]} />
          </mesh>

          <mesh material={outerFlameMaterial} position={[0, 0.16, 0]}>
            <coneGeometry args={[0.055, 0.16, 16]} />
          </mesh>

          <mesh ref={innerFlameRef} material={innerFlameMaterial} position={[0, 0.07, 0]}>
            <sphereGeometry args={[0.03, 12, 12]} />
          </mesh>

          <pointLight
            ref={lightRef}
            color="#ffaa33"
            intensity={2.4 * intensityMultiplier}
            distance={4.5}
            decay={2}
          />
        </group>
      )}

      {!isLit && interactive && (
        <mesh position={[0, 0.16, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.28, 0.34, 24]} />
          <meshBasicMaterial color="#f59e0b" transparent opacity={0.45} />
        </mesh>
      )}
    </group>
  );
};
