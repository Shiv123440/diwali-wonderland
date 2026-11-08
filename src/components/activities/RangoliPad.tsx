import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { DiyaModel } from '../world/DiyaModel';

interface RangoliPadProps {
  position?: [number, number, number];
  onClick?: () => void;
  colors?: string[];
  patternName?: string;
}

// Procedural high-resolution Rangoli generator for authentic Indian courtyard mandalas
function generateRangoliCanvas(pattern: string = 'lotus', colors: string[] = []): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  const cx = 512;
  const cy = 512;

  // Safe color fallbacks
  const cRed = colors[0] || '#c1121f';
  const cGold = colors[1] || '#f59e0b';
  const cBlue = colors[2] || '#0077b6';
  const cGreen = colors[3] || '#10b981';
  const cWhite = colors[4] || '#ffffff';

  // 1. Dark royal marble floor inset base
  ctx.fillStyle = '#0a0d20';
  ctx.beginPath();
  ctx.arc(cx, cy, 508, 0, Math.PI * 2);
  ctx.fill();

  // 2. Concentric golden filigree boundary rings
  ctx.strokeStyle = '#dfa234';
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.arc(cx, cy, 496, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = '#ffd700';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(cx, cy, 482, 0, Math.PI * 2);
  ctx.stroke();

  // 3. Sacred rice-flour Kolam pearls along perimeter
  const numPearls = 48;
  for (let i = 0; i < numPearls; i++) {
    const a = (i / numPearls) * Math.PI * 2;
    ctx.fillStyle = cWhite;
    ctx.beginPath();
    ctx.arc(cx + Math.cos(a) * 466, cy + Math.sin(a) * 466, 4.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // 4. Pattern rendering
  if (pattern === 'peacock') {
    // ROYAL PEACOCK MANDALA: 12 outward sweeping peacock feathers
    const numFeathers = 12;

    // Outer emerald feather frills
    for (let i = 0; i < numFeathers; i++) {
      const a = (i / numFeathers) * Math.PI * 2;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(a);

      // Feather outer vane
      ctx.fillStyle = cGreen;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(70, -220, 140, -320, 0, -450);
      ctx.bezierCurveTo(-140, -320, -70, -220, 0, 0);
      ctx.fill();

      // Feather middle turquoise plume
      ctx.fillStyle = cBlue;
      ctx.beginPath();
      ctx.moveTo(0, -60);
      ctx.bezierCurveTo(45, -200, 95, -300, 0, -420);
      ctx.bezierCurveTo(-95, -300, -45, -200, 0, -60);
      ctx.fill();

      // Golden eye aura
      ctx.fillStyle = cGold;
      ctx.beginPath();
      ctx.arc(0, -340, 52, 0, Math.PI * 2);
      ctx.fill();

      // Peacock eye azure core
      ctx.fillStyle = '#03045e';
      ctx.beginPath();
      ctx.arc(0, -340, 36, 0, Math.PI * 2);
      ctx.fill();

      // Center sparkle
      ctx.fillStyle = cWhite;
      ctx.beginPath();
      ctx.arc(-8, -348, 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    // Inner fiery lotus ring
    for (let i = 0; i < 12; i++) {
      const a = ((i + 0.5) / 12) * Math.PI * 2;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(a);

      ctx.fillStyle = cRed;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(40, -110, 0, -190);
      ctx.quadraticCurveTo(-40, -110, 0, 0);
      ctx.fill();

      ctx.strokeStyle = '#ffd700';
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.restore();
    }
  } else if (pattern === 'lakshmi') {
    // AUSPICIOUS ASHTALAKSHMI 8-POINTED STAR MANDALA
    // Outer 16 decorative lotus points
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(a);

      ctx.fillStyle = i % 2 === 0 ? cGreen : cBlue;
      ctx.beginPath();
      ctx.moveTo(0, -280);
      ctx.lineTo(38, -380);
      ctx.lineTo(0, -450);
      ctx.lineTo(-38, -380);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = cWhite;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();
    }

    // Two Interlocking Squares (Sacred 8-pointed star of Lakshmi)
    [0, Math.PI / 4].forEach((rotAngle, idx) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rotAngle);

      ctx.fillStyle = idx === 0 ? cRed : cGold;
      ctx.globalAlpha = 0.88;
      ctx.beginPath();
      const s = 250;
      ctx.rect(-s, -s, s * 2, s * 2);
      ctx.fill();

      ctx.globalAlpha = 1.0;
      ctx.strokeStyle = cWhite;
      ctx.lineWidth = 4;
      ctx.stroke();

      ctx.restore();
    });

    // Inner 8-petal Kolam floral rosette
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(a);

      ctx.fillStyle = cRed;
      ctx.beginPath();
      ctx.arc(0, -120, 36, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#ffd700';
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.restore();
    }
  } else {
    // DEFAULT: 16-PETAL SACRED SAHASRARA LOTUS (Most popular & majestic)
    // Outer Tier: 24 scalloped emerald & golden petal flares
    for (let i = 0; i < 24; i++) {
      const a = (i / 24) * Math.PI * 2;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(a);

      ctx.fillStyle = i % 2 === 0 ? cGreen : cBlue;
      ctx.beginPath();
      ctx.moveTo(-28, -340);
      ctx.quadraticCurveTo(0, -445, 0, -450);
      ctx.quadraticCurveTo(0, -445, 28, -340);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = cGold;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();
    }

    // Middle Tier: 16 Large Blooming Lotus Petals (Deep Kumkum Red with Gold Trim)
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(a);

      ctx.fillStyle = cRed;
      ctx.beginPath();
      ctx.moveTo(0, -90);
      ctx.bezierCurveTo(65, -190, 85, -290, 0, -355);
      ctx.bezierCurveTo(-85, -290, -65, -190, 0, -90);
      ctx.fill();

      // Gold central petal spine
      ctx.strokeStyle = '#ffd700';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(0, -90);
      ctx.lineTo(0, -350);
      ctx.stroke();

      // White Kolam pearl on petal tip
      ctx.fillStyle = cWhite;
      ctx.beginPath();
      ctx.arc(0, -360, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    // Inner Tier: 8 Radiant Haldi Gold Lotus Petals
    for (let i = 0; i < 8; i++) {
      const a = ((i + 0.5) / 8) * Math.PI * 2;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(a);

      ctx.fillStyle = cGold;
      ctx.beginPath();
      ctx.moveTo(0, -40);
      ctx.quadraticCurveTo(45, -120, 0, -210);
      ctx.quadraticCurveTo(-45, -120, 0, -40);
      ctx.fill();

      ctx.strokeStyle = cRed;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();
    }
  }

  // Common Central Sacred Medallion
  // Concentric gold & white rings
  ctx.fillStyle = cGold;
  ctx.beginPath();
  ctx.arc(cx, cy, 75, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = cRed;
  ctx.beginPath();
  ctx.arc(cx, cy, 52, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffd700';
  ctx.beginPath();
  ctx.arc(cx, cy, 26, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = cWhite;
  ctx.beginPath();
  ctx.arc(cx, cy, 10, 0, Math.PI * 2);
  ctx.fill();

  return canvas;
}

export const RangoliPad: React.FC<RangoliPadProps> = ({
  position = [-4.8, 0.01, -4.8],
  onClick,
  colors = ['#c1121f', '#f59e0b', '#0077b6', '#10b981', '#ffffff'],
  patternName = 'lotus',
}) => {
  const sparkleRef = useRef<THREE.Points>(null);

  // Generate crisp 1024x1024 procedural Rangoli Canvas texture
  const texture = useMemo(() => {
    const canvas = generateRangoliCanvas(patternName, colors);
    const tex = new THREE.CanvasTexture(canvas);
    tex.generateMipmaps = true;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.anisotropy = 8;
    tex.needsUpdate = true;
    return tex;
  }, [patternName, colors]);

  useEffect(() => {
    return () => {
      texture.dispose();
    };
  }, [texture]);

  useFrame(({ clock }) => {
    if (sparkleRef.current) {
      sparkleRef.current.rotation.y = clock.getElapsedTime() * 0.15;
    }
  });

  return (
    <group position={position} onClick={onClick}>
      {/* Dark Marble Floor Recessed Foundation */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[2.08, 48]} />
        <meshStandardMaterial color="#080b1d" roughness={0.2} metalness={0.4} />
      </mesh>

      {/* Raised Polished Brass Trim Ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.003, 0]}>
        <ringGeometry args={[2.02, 2.12, 48]} />
        <meshStandardMaterial color="#dfa234" roughness={0.25} metalness={0.9} />
      </mesh>

      {/* Intricate High-Resolution Procedural Indian Rangoli Decal */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.006, 0]}>
        <planeGeometry args={[4.0, 4.0]} />
        <meshStandardMaterial
          map={texture}
          transparent={true}
          roughness={0.85}
          metalness={0.08}
          emissive="#ffd700"
          emissiveIntensity={0.06}
        />
      </mesh>

      {/* Four Sacred Glowing Brass Diyas Gracing the Rangoli */}
      {[
        [-1.65, 0.02, -1.65],
        [1.65, 0.02, -1.65],
        [-1.65, 0.02, 1.65],
        [1.65, 0.02, 1.65],
      ].map((pos, idx) => (
        <DiyaModel
          key={idx}
          position={pos as [number, number, number]}
          scale={0.72}
          isLit={true}
          interactive={false}
          intensityMultiplier={0.8}
        />
      ))}

      {/* Shimmering Golden Gulal Dust Particles */}
      <points ref={sparkleRef} position={[0, 0.28, 0]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[
              new Float32Array([
                0.3, 0.1, 0.2, -0.4, 0.15, -0.2, 0.2, 0.2, -0.5, -0.2, 0.1, 0.4,
                0.5, 0.25, 0.1, -0.5, 0.18, 0.3, 0.1, 0.3, 0.6, -0.3, 0.2, -0.5,
                0.7, 0.12, 0.3, -0.6, 0.22, -0.4, 0.4, 0.18, -0.7, -0.1, 0.28, 0.8,
              ]),
              3,
            ]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          color="#ffd700"
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
};
