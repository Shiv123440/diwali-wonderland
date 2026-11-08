import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const SkyEnvironment: React.FC = () => {
  const starsRef = useRef<THREE.Points>(null);

  const { starPositions, starColors } = useMemo(() => {
    const count = 1800;
    const starPositions = new Float32Array(count * 3);
    const starColors = new Float32Array(count * 3);

    const c1 = new THREE.Color('#ffffff');
    const c2 = new THREE.Color('#ffd166');
    const c3 = new THREE.Color('#90e0ef');

    for (let i = 0; i < count; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0) * 0.48;
      const radius = 90 + Math.random() * 20;

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = Math.abs(radius * Math.cos(phi)) + 5;
      const z = radius * Math.sin(phi) * Math.sin(theta);

      starPositions[i * 3] = x;
      starPositions[i * 3 + 1] = y;
      starPositions[i * 3 + 2] = z;

      const randColor = Math.random() > 0.7 ? c2 : Math.random() > 0.4 ? c3 : c1;
      starColors[i * 3] = randColor.r;
      starColors[i * 3 + 1] = randColor.g;
      starColors[i * 3 + 2] = randColor.b;
    }

    return { starPositions, starColors };
  }, []);

  useFrame(({ clock }) => {
    if (starsRef.current) {
      starsRef.current.rotation.y = clock.getElapsedTime() * 0.002;
    }
  });

  return (
    <group>
      <mesh scale={[-1, 1, 1]} position={[0, 0, 0]}>
        <sphereGeometry args={[110, 32, 24]} />
        <meshBasicMaterial
          color="#060919"
          side={THREE.BackSide}
        />
      </mesh>

      <points ref={starsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[starPositions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[starColors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={1.1}
          vertexColors
          transparent
          opacity={0.88}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      <group position={[28, 48, -45]}>
        <mesh>
          <sphereGeometry args={[2.8, 24, 24]} />
          <meshBasicMaterial color="#fff3d1" />
        </mesh>
        <mesh>
          <sphereGeometry args={[4.2, 16, 16]} />
          <meshBasicMaterial
            color="#ffe8a1"
            transparent
            opacity={0.2}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        <directionalLight
          color="#9bb7d4"
          intensity={0.65}
          position={[0, 0, 0]}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-bias={-0.0005}
        />
      </group>

      <group position={[0, -2, -35]}>
        {[-32, -22, -12, 0, 12, 22, 32].map((x, idx) => {
          const h = 10 + Math.sin(idx * 1.5) * 4;
          return (
            <group key={idx} position={[x, h / 2, 0]}>
              <mesh>
                <boxGeometry args={[7, h, 3]} />
                <meshStandardMaterial color="#0b0e22" roughness={0.9} />
              </mesh>
              <mesh position={[0, h / 2 + 1.8, 0]}>
                <sphereGeometry args={[2.2, 16, 16]} />
                <meshStandardMaterial color="#070a1a" roughness={0.8} />
              </mesh>
              <mesh position={[0, h / 2 + 4.2, 0]}>
                <coneGeometry args={[0.2, 1.4, 8]} />
                <meshBasicMaterial color="#c49a45" />
              </mesh>
              <mesh position={[0, 0, 1.6]}>
                <planeGeometry args={[1.2, 1.8]} />
                <meshBasicMaterial color="#ffaa33" />
              </mesh>
            </group>
          );
        })}
      </group>
    </group>
  );
};
