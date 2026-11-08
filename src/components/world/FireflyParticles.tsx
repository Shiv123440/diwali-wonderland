import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FireflyParticlesProps {
  count?: number;
}

export const FireflyParticles: React.FC<FireflyParticlesProps> = ({ count = 350 }) => {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, initialY, speeds, phases } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const initialY = new Float32Array(count);
    const speeds = new Float32Array(count);
    const phases = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 1 + Math.random() * 13;
      const x = Math.cos(angle) * radius;
      const y = 0.3 + Math.random() * 7;
      const z = Math.sin(angle) * radius;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      initialY[i] = y;
      speeds[i] = 0.2 + Math.random() * 0.4;
      phases[i] = Math.random() * Math.PI * 2;
    }

    return { positions, initialY, speeds, phases };
  }, [count]);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const array = posAttr.array as Float32Array;
    const t = clock.getElapsedTime();

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      let y = initialY[i] + Math.sin(t * speeds[i] + phases[i]) * 0.8 + ((t * 0.3 * speeds[i]) % 5);
      if (y > 8) y -= 7.5;
      array[idx + 1] = y;

      array[idx] += Math.sin(t * 0.8 + phases[i]) * 0.005;
      array[idx + 2] += Math.cos(t * 0.8 + phases[i]) * 0.005;
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.09}
        color="#ffd166"
        transparent
        opacity={0.75}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};
