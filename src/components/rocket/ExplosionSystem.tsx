import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export interface FireworkExplosionEvent {
  id: string;
  position: [number, number, number];
  colorType?: 'gold' | 'royal' | 'ruby' | 'peacock' | 'emerald';
  scale?: number;
  createdAt: number;
}

interface ExplosionSystemProps {
  explosions: FireworkExplosionEvent[];
  onExplosionComplete?: (id: string) => void;
}

const PARTICLES_PER_BURST = 650;
const MAX_CONCURRENT_BURSTS = 6;
const TOTAL_PARTICLES = PARTICLES_PER_BURST * MAX_CONCURRENT_BURSTS;

export const ExplosionSystem: React.FC<ExplosionSystemProps> = ({
  explosions,
  onExplosionComplete,
}) => {
  const pointsRef = useRef<THREE.Points>(null);
  const flashLightRef = useRef<THREE.PointLight>(null);

  const {
    positions,
    colors,
    velocities,
    lifetimes,
    maxLifetimes,
    decayRates,
    particleTypes,
  } = useMemo(() => {
    return {
      positions: new Float32Array(TOTAL_PARTICLES * 3),
      colors: new Float32Array(TOTAL_PARTICLES * 3),
      velocities: new Float32Array(TOTAL_PARTICLES * 3),
      lifetimes: new Float32Array(TOTAL_PARTICLES),
      maxLifetimes: new Float32Array(TOTAL_PARTICLES),
      decayRates: new Float32Array(TOTAL_PARTICLES),
      particleTypes: new Uint8Array(TOTAL_PARTICLES),
    };
  }, []);

  const activeBursts = useRef<
    Map<string, { startIdx: number; count: number; origin: [number, number, number]; birth: number }>
  >(new Map());

  useEffect(() => {
    explosions.forEach((exp) => {
      if (activeBursts.current.has(exp.id)) return;

      const slotIndex = activeBursts.current.size % MAX_CONCURRENT_BURSTS;
      const startIdx = slotIndex * PARTICLES_PER_BURST;
      const origin = exp.position;
      const type = exp.colorType || 'gold';
      const scale = exp.scale || 1.0;

      const cGold = new THREE.Color('#ffd700');
      const cWhite = new THREE.Color('#ffffff');
      const cPink = new THREE.Color('#ff007f');
      const cOrange = new THREE.Color('#ff5400');
      const cBlue = new THREE.Color('#00b4d8');
      const cPurple = new THREE.Color('#9d4edd');
      const cEmerald = new THREE.Color('#06d6a0');

      for (let i = 0; i < PARTICLES_PER_BURST; i++) {
        const pIdx = startIdx + i;
        const vIdx = pIdx * 3;

        positions[vIdx] = origin[0];
        positions[vIdx + 1] = origin[1];
        positions[vIdx + 2] = origin[2];

        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        const layerRatio = i / PARTICLES_PER_BURST;

        let speed = (6 + Math.random() * 14) * scale;
        let pColor = cGold;
        let pType = 0;
        let maxLife = 2.0 + Math.random() * 1.2;

        if (layerRatio < 0.3) {
          speed = (10 + Math.random() * 12) * scale;
          pColor = Math.random() > 0.4 ? cGold : cWhite;
          pType = 0;
        } else if (layerRatio < 0.6) {
          speed = (8 + Math.random() * 9) * scale;
          if (type === 'ruby' || type === 'royal') {
            pColor = Math.random() > 0.5 ? cPink : cOrange;
          } else if (type === 'peacock') {
            pColor = Math.random() > 0.5 ? cBlue : cEmerald;
          } else {
            pColor = Math.random() > 0.5 ? cOrange : cPurple;
          }
          pType = 1;
        } else if (layerRatio < 0.85) {
          speed = (4 + Math.random() * 7) * scale;
          pColor = cGold;
          pType = 2;
          maxLife = 2.8 + Math.random() * 1.0;
        } else {
          speed = (3 + Math.random() * 6) * scale;
          pColor = Math.random() > 0.5 ? cBlue : cPurple;
          pType = 3;
          maxLife = 2.2;
        }

        velocities[vIdx] = Math.sin(phi) * Math.cos(theta) * speed;
        velocities[vIdx + 1] = Math.cos(phi) * speed;
        velocities[vIdx + 2] = Math.sin(phi) * Math.sin(theta) * speed;

        colors[vIdx] = pColor.r;
        colors[vIdx + 1] = pColor.g;
        colors[vIdx + 2] = pColor.b;

        lifetimes[pIdx] = maxLife;
        maxLifetimes[pIdx] = maxLife;
        decayRates[pIdx] = 1.0;
        particleTypes[pIdx] = pType;
      }

      activeBursts.current.set(exp.id, {
        startIdx,
        count: PARTICLES_PER_BURST,
        origin,
        birth: Date.now() / 1000,
      });

      if (flashLightRef.current) {
        flashLightRef.current.position.set(origin[0], origin[1], origin[2]);
        flashLightRef.current.intensity = 28 * scale;
      }
    });
  }, [explosions, positions, colors, velocities, lifetimes, maxLifetimes, decayRates, particleTypes]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const dt = Math.min(delta, 0.05);

    if (flashLightRef.current && flashLightRef.current.intensity > 0.1) {
      flashLightRef.current.intensity = THREE.MathUtils.lerp(
        flashLightRef.current.intensity,
        0,
        dt * 4
      );
    }

    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const colAttr = pointsRef.current.geometry.attributes.color as THREE.BufferAttribute;

    const completedIds: string[] = [];
    const now = Date.now() / 1000;

    activeBursts.current.forEach((burst, id) => {
      let anyAlive = false;
      const { startIdx, count } = burst;

      for (let i = 0; i < count; i++) {
        const pIdx = startIdx + i;
        if (lifetimes[pIdx] <= 0) continue;

        anyAlive = true;
        lifetimes[pIdx] -= dt;

        const vIdx = pIdx * 3;
        const pType = particleTypes[pIdx];

        const drag = pType === 2 ? 0.98 : 0.94;
        velocities[vIdx] *= drag;
        velocities[vIdx + 1] *= drag;
        velocities[vIdx + 2] *= drag;

        const gravity = pType === 2 ? 4.8 : 2.5;
        velocities[vIdx + 1] -= gravity * dt;

        positions[vIdx] += velocities[vIdx] * dt;
        positions[vIdx + 1] += velocities[vIdx + 1] * dt;
        positions[vIdx + 2] += velocities[vIdx + 2] * dt;

        colors[vIdx] *= 0.99;
        colors[vIdx + 1] *= 0.99;
        colors[vIdx + 2] *= 0.99;

        if (lifetimes[pIdx] <= 0) {
          positions[vIdx + 1] = -50;
        }
      }

      if (!anyAlive) {
        completedIds.push(id);
      }
    });

    completedIds.forEach((id) => {
      activeBursts.current.delete(id);
      onExplosionComplete?.(id);
    });

    posAttr.needsUpdate = true;
    colAttr.needsUpdate = true;
  });

  return (
    <group>
      <pointLight
        ref={flashLightRef}
        color="#ffeaa7"
        intensity={0}
        distance={95}
        decay={1.6}
      />

      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.52}
          sizeAttenuation={true}
          vertexColors
          transparent
          opacity={0.98}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
};
