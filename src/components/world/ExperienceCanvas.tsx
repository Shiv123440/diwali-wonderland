import React, { useRef } from 'react';
import { Canvas, ThreeEvent } from '@react-three/fiber';
import { SkyEnvironment } from './SkyEnvironment';
import { PalaceCourtyard } from './PalaceCourtyard';
import { RocketController, RocketState } from '../rocket/RocketController';
import { ExplosionSystem, FireworkExplosionEvent } from '../rocket/ExplosionSystem';
import { FloatingLanterns, SkyLantern } from '../activities/FloatingLanterns';
import { RangoliPad } from '../activities/RangoliPad';
import { DiwaliSurprise } from '../activities/DiwaliSurprise';
import { CameraController, CameraPreset } from '../cinematic/CameraController';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import * as THREE from 'three';

interface ExperienceCanvasProps {
  mode: 'intro' | 'exploration' | 'rocket_launch' | 'celebration' | 'lantern_follow';
  cameraPreset: CameraPreset;
  litDiyas: boolean[];
  onToggleDiya: (index: number) => void;
  rocketState: RocketState;
  onRocketStateChange: (state: RocketState) => void;
  onRocketExplode: (pos: [number, number, number]) => void;
  explosions: FireworkExplosionEvent[];
  onExplosionComplete: (id: string) => void;
  lanterns: SkyLantern[];
  trackedLantern: SkyLantern | null;
  onUserInteracted: () => void;
  onOpenGiftModal: () => void;
  onOpenRangoliModal: () => void;
  onLaunchSkyFirework: (pos: [number, number, number]) => void;
  introProgress: number;
  quality: 'high' | 'medium';
  rangoliColors: string[];
  rangoliPattern: string;
}

export const ExperienceCanvas: React.FC<ExperienceCanvasProps> = ({
  mode,
  cameraPreset,
  litDiyas,
  onToggleDiya,
  rocketState,
  onRocketStateChange,
  onRocketExplode,
  explosions,
  onExplosionComplete,
  lanterns,
  trackedLantern,
  onUserInteracted,
  onOpenGiftModal,
  onOpenRangoliModal,
  onLaunchSkyFirework,
  introProgress,
  quality,
  rangoliColors,
  rangoliPattern,
}) => {
  const rocketYRef = useRef(0.42);

  const handleSkyClick = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (e.point) {
      onLaunchSkyFirework([e.point.x, Math.max(12, e.point.y), e.point.z]);
    }
  };

  return (
    <Canvas
      shadows={quality === 'high'}
      dpr={quality === 'high' ? [1, 2] : [1, 1.5]}
      camera={{ position: [0, 2.5, 9.2], fov: 52, near: 0.1, far: 200 }}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.05,
        powerPreference: 'high-performance',
      }}
      className="w-full h-full cursor-grab active:cursor-grabbing"
    >
      <CameraController
        mode={mode}
        preset={cameraPreset}
        rocketYRef={rocketYRef}
        introProgress={introProgress}
        trackedLantern={trackedLantern}
        onUserInteracted={onUserInteracted}
      />

      {/* Royal Midnight Atmosphere & Courtyard Illumination */}
      <ambientLight color="#121633" intensity={0.32} />
      <hemisphereLight args={['#1e2652', '#060815', 0.45]} />
      <directionalLight
        position={[8, 22, 12]}
        color="#b8caff"
        intensity={0.65}
        castShadow={quality === 'high'}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      <SkyEnvironment />

      {/* Interactive Raycast Sky Dome for Fireworks Playground */}
      <mesh
        position={[0, 25, 0]}
        scale={[-1, 1, 1]}
        onPointerDown={handleSkyClick}
      >
        <sphereGeometry args={[80, 24, 16]} />
        <meshBasicMaterial visible={false} side={THREE.BackSide} />
      </mesh>

      <PalaceCourtyard litDiyas={litDiyas} onToggleDiya={onToggleDiya} />

      <RocketController
        state={rocketState}
        onStateChange={onRocketStateChange}
        onExplode={onRocketExplode}
        rocketYRef={rocketYRef}
      />

      <ExplosionSystem
        explosions={explosions}
        onExplosionComplete={onExplosionComplete}
      />

      <FloatingLanterns lanterns={lanterns} />

      <RangoliPad
        position={[-4.8, 0.01, -4.8]}
        onClick={onOpenRangoliModal}
        colors={rangoliColors}
        patternName={rangoliPattern}
      />

      <DiwaliSurprise position={[4.8, 0.5, 4.8]} onOpenModal={onOpenGiftModal} />

      {quality === 'high' && (
        <EffectComposer multisampling={0}>
          <Bloom
            intensity={1.05}
            luminanceThreshold={0.45}
            luminanceSmoothing={0.3}
            mipmapBlur={true}
          />
        </EffectComposer>
      )}
    </Canvas>
  );
};
