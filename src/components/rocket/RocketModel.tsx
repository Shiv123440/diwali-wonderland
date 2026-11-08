import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface RocketModelProps {
  position: [number, number, number];
  isLaunching: boolean;
  isBurning: boolean;
  fuseProgress: number;
}

export const RocketModel: React.FC<RocketModelProps> = ({
  position,
  isBurning,
  fuseProgress,
}) => {
  const sparkRef = useRef<THREE.Points>(null);
  const fuseLightRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    if (isBurning && sparkRef.current) {
      const posAttr = sparkRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const array = posAttr.array as Float32Array;
      for (let i = 0; i < 25; i++) {
        const idx = i * 3;
        array[idx] = (Math.random() - 0.5) * 0.12;
        array[idx + 1] = (Math.random() - 0.5) * 0.12;
        array[idx + 2] = (Math.random() - 0.5) * 0.12;
      }
      posAttr.needsUpdate = true;

      if (fuseLightRef.current) {
        fuseLightRef.current.intensity = 2.5 + Math.sin(clock.getElapsedTime() * 30) * 1.0;
      }
    }
  });

  const fuseTipY = 0.1 + (1 - fuseProgress) * 0.4;

  return (
    <group position={position}>
      <group position={[0, 0, 0]}>
        <mesh position={[0, 0.45, 0]}>
          <cylinderGeometry args={[0.08, 0.14, 0.9, 16]} />
          <meshStandardMaterial color="#8b5a2b" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.15, 0]}>
          <cylinderGeometry args={[0.3, 0.45, 0.3, 16]} />
          <meshStandardMaterial color="#b25329" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.3, 0]}>
          <torusGeometry args={[0.3, 0.03, 8, 24]} />
          <meshStandardMaterial color="#dfa234" metalness={0.8} roughness={0.3} />
        </mesh>
      </group>

      <group position={[0, 0, 0]}>
        <mesh position={[-0.045, 0.85, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 1.7, 8]} />
          <meshStandardMaterial color="#d4a373" roughness={0.7} />
        </mesh>

        <mesh position={[0, 1.25, 0]} castShadow>
          <cylinderGeometry args={[0.11, 0.11, 0.75, 24]} />
          <meshStandardMaterial color="#b81424" roughness={0.4} metalness={0.3} />
        </mesh>

        <mesh position={[0, 1.05, 0]}>
          <cylinderGeometry args={[0.112, 0.112, 0.08, 24]} />
          <meshStandardMaterial color="#f3b43f" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, 1.35, 0]}>
          <cylinderGeometry args={[0.112, 0.112, 0.06, 24]} />
          <meshStandardMaterial color="#0077b6" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 1.55, 0]}>
          <cylinderGeometry args={[0.112, 0.112, 0.08, 24]} />
          <meshStandardMaterial color="#f3b43f" metalness={0.9} roughness={0.2} />
        </mesh>

        <mesh position={[0, 1.82, 0]} castShadow>
          <coneGeometry args={[0.125, 0.42, 24]} />
          <meshStandardMaterial color="#e63946" metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh position={[0, 2.03, 0]}>
          <coneGeometry args={[0.04, 0.12, 16]} />
          <meshStandardMaterial color="#ffd700" metalness={0.95} roughness={0.15} />
        </mesh>

        {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((angle, i) => (
          <group key={i} rotation={[0, angle, 0]} position={[0, 0.95, 0]}>
            <mesh position={[0.15, 0, 0]} rotation={[0, 0, -0.2]}>
              <boxGeometry args={[0.12, 0.22, 0.015]} />
              <meshStandardMaterial color="#10b981" metalness={0.4} roughness={0.5} />
            </mesh>
          </group>
        ))}

        <mesh position={[0, 0.85, 0]}>
          <cylinderGeometry args={[0.07, 0.04, 0.08, 16]} />
          <meshStandardMaterial color="#333333" metalness={0.8} roughness={0.4} />
        </mesh>

        <mesh position={[0, 0.65, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 0.45, 8]} />
          <meshStandardMaterial color="#8c7853" roughness={0.9} />
        </mesh>

        {isBurning && fuseProgress < 1 && (
          <group position={[0, fuseTipY, 0]}>
            <mesh>
              <sphereGeometry args={[0.035, 12, 12]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
            <mesh>
              <sphereGeometry args={[0.07, 12, 12]} />
              <meshBasicMaterial color="#ff7700" transparent opacity={0.8} />
            </mesh>

            <pointLight
              ref={fuseLightRef}
              color="#ffaa22"
              intensity={2.8}
              distance={2.5}
            />

            <points ref={sparkRef}>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  args={[new Float32Array(75), 3]}
                />
              </bufferGeometry>
              <pointsMaterial
                size={0.06}
                color="#ffe066"
                transparent
                opacity={0.9}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </points>
          </group>
        )}
      </group>
    </group>
  );
};
