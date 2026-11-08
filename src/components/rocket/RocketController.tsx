import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { RocketModel } from './RocketModel';
import { audioManager } from '../../utils/audio';

export type RocketState = 'idle' | 'burning' | 'launching' | 'exploded';

interface RocketControllerProps {
  state: RocketState;
  onStateChange: (state: RocketState) => void;
  onExplode: (pos: [number, number, number]) => void;
  rocketYRef?: React.MutableRefObject<number>;
}

export const RocketController: React.FC<RocketControllerProps> = ({
  state,
  onStateChange,
  onExplode,
  rocketYRef,
}) => {
  const [fuseProgress, setFuseProgress] = useState(0);
  const [rocketPos, setRocketPos] = useState<[number, number, number]>([0, 0.42, 0]);
  const currentY = useRef(0.42);
  const velocityY = useRef(0);
  const exhaustRef = useRef<THREE.Points>(null);
  const exhaustLightRef = useRef<THREE.PointLight>(null);

  const { exhaustPositions, exhaustColors } = React.useMemo(() => {
    const count = 120;
    const exhaustPositions = new Float32Array(count * 3);
    const exhaustColors = new Float32Array(count * 3);
    const gold = new THREE.Color('#ffaa00');
    const red = new THREE.Color('#ff3300');

    for (let i = 0; i < count; i++) {
      exhaustPositions[i * 3] = 0;
      exhaustPositions[i * 3 + 1] = -50;
      exhaustPositions[i * 3 + 2] = 0;

      const c = Math.random() > 0.5 ? gold : red;
      exhaustColors[i * 3] = c.r;
      exhaustColors[i * 3 + 1] = c.g;
      exhaustColors[i * 3 + 2] = c.b;
    }
    return { exhaustPositions, exhaustColors };
  }, []);

  useEffect(() => {
    if (state === 'idle') {
      currentY.current = 0.42;
      velocityY.current = 0;
      setFuseProgress(0);
      setRocketPos([0, 0.42, 0]);
      if (rocketYRef) rocketYRef.current = 0.42;
    } else if (state === 'burning') {
      audioManager.startFuseBurn();
    } else if (state === 'launching') {
      audioManager.stopFuseBurn();
      audioManager.playRocketLaunch();
      velocityY.current = 4.0;
    }
  }, [state, rocketYRef]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);

    if (state === 'burning') {
      setFuseProgress((prev) => {
        const next = prev + dt * 0.45;
        if (next >= 1) {
          onStateChange('launching');
          return 1;
        }
        return next;
      });
    }

    if (state === 'launching') {
      velocityY.current += 16.0 * dt;
      currentY.current += velocityY.current * dt;
      setRocketPos([0, currentY.current, 0]);
      if (rocketYRef) rocketYRef.current = currentY.current;

      if (exhaustRef.current) {
        const posAttr = exhaustRef.current.geometry.attributes.position as THREE.BufferAttribute;
        const array = posAttr.array as Float32Array;

        for (let i = 0; i < 120; i++) {
          const idx = i * 3;
          array[idx] = (Math.random() - 0.5) * 0.25;
          array[idx + 1] = currentY.current + 0.8 - Math.random() * 2.2;
          array[idx + 2] = (Math.random() - 0.5) * 0.25;
        }
        posAttr.needsUpdate = true;
      }

      if (exhaustLightRef.current) {
        exhaustLightRef.current.position.set(0, currentY.current, 0);
        exhaustLightRef.current.intensity = 18 + Math.random() * 6;
      }

      if (currentY.current >= 36) {
        onStateChange('exploded');
        audioManager.playFireworkExplosion('grand');
        onExplode([0, currentY.current + 2, 0]);
      }
    }
  });

  return (
    <group>
      {state !== 'exploded' && (
        <RocketModel
          position={rocketPos}
          isLaunching={state === 'launching'}
          isBurning={state === 'burning'}
          fuseProgress={fuseProgress}
        />
      )}

      {state === 'launching' && (
        <>
          <points ref={exhaustRef}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[exhaustPositions, 3]}
              />
              <bufferAttribute
                attach="attributes-color"
                args={[exhaustColors, 3]}
              />
            </bufferGeometry>
            <pointsMaterial
              size={0.16}
              vertexColors
              transparent
              opacity={0.9}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </points>

          <pointLight
            ref={exhaustLightRef}
            color="#ff7700"
            intensity={15}
            distance={20}
            decay={1.8}
          />
        </>
      )}
    </group>
  );
};
