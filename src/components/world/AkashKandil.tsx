import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface AkashKandilProps {
  position: [number, number, number];
  color?: string;
  glowColor?: string;
  scale?: number;
  swaySpeed?: number;
  swayOffset?: number;
}

export const AkashKandil: React.FC<AkashKandilProps> = ({
  position,
  color = '#e63946',
  glowColor = '#ffb703',
  scale = 1,
  swaySpeed = 1,
  swayOffset = 0,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const tasselsRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime() * swaySpeed + swayOffset;
    groupRef.current.rotation.z = Math.sin(t * 1.1) * 0.07;
    groupRef.current.rotation.x = Math.cos(t * 0.9) * 0.05;

    if (tasselsRef.current) {
      tasselsRef.current.rotation.z = Math.sin(t * 1.4) * 0.12;
    }
  });

  return (
    <group position={position} scale={[scale, scale, scale]}>
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 2.4, 6]} />
        <meshStandardMaterial color="#c49a45" metalness={0.8} roughness={0.3} />
      </mesh>

      <group ref={groupRef} position={[0, 0, 0]}>
        <mesh position={[0, 0.42, 0]}>
          <coneGeometry args={[0.16, 0.14, 8]} />
          <meshStandardMaterial color="#b8860b" metalness={0.9} roughness={0.25} />
        </mesh>

        <mesh position={[0, 0, 0]} rotation={[0, Math.PI / 4, 0]}>
          <octahedronGeometry args={[0.42, 0]} />
          <meshStandardMaterial
            color={color}
            emissive={glowColor}
            emissiveIntensity={0.65}
            roughness={0.3}
            metalness={0.2}
          />
        </mesh>

        <mesh position={[0, 0, 0]}>
          <torusGeometry args={[0.38, 0.025, 8, 24]} />
          <meshStandardMaterial color="#ffd700" metalness={0.9} roughness={0.2} />
        </mesh>

        {[-0.35, 0.35].map((x, i) => (
          <mesh key={i} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
            <octahedronGeometry args={[0.1, 0]} />
            <meshStandardMaterial color="#ffd700" metalness={0.8} />
          </mesh>
        ))}

        <mesh position={[0, -0.42, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.18, 0.14, 8]} />
          <meshStandardMaterial color="#b8860b" metalness={0.8} />
        </mesh>

        <group ref={tasselsRef} position={[0, -0.48, 0]}>
          {[0, 1, 2, 3, 4, 5, 6, 7].map((idx) => {
            const angle = (idx / 8) * Math.PI * 2;
            const r = 0.12;
            return (
              <mesh
                key={idx}
                position={[Math.cos(angle) * r, -0.3, Math.sin(angle) * r]}
                rotation={[0, 0, (Math.random() - 0.5) * 0.1]}
              >
                <cylinderGeometry args={[0.006, 0.012, 0.55, 4]} />
                <meshStandardMaterial
                  color="#f3b43f"
                  emissive="#c48208"
                  emissiveIntensity={0.3}
                  metalness={0.7}
                  roughness={0.3}
                />
              </mesh>
            );
          })}
        </group>

        <pointLight color={glowColor} intensity={1.8} distance={5} decay={2} />
      </group>
    </group>
  );
};
