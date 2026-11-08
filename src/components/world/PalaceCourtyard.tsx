import React, { useMemo } from 'react';
import * as THREE from 'three';
import { DiyaModel } from './DiyaModel';
import { AkashKandil } from './AkashKandil';
import { MarigoldGarlands } from './MarigoldGarlands';
import { FireflyParticles } from './FireflyParticles';

interface PalaceCourtyardProps {
  litDiyas: boolean[];
  onToggleDiya: (index: number) => void;
}

export const DIYA_POSITIONS: [number, number, number][] = [
  [-2.2, 0.42, -2.2], // Altar NW
  [2.2, 0.42, -2.2],  // Altar NE
  [-2.2, 0.42, 2.2],  // Altar SW
  [2.2, 0.42, 2.2],   // Altar SE
  [-6.5, 0.15, -6.5], // West Colonnade
  [6.5, 0.15, -6.5],  // East Colonnade
  [-5.5, 0.15, 4.5],  // South-West open terrace
  [5.5, 0.15, 4.5],   // South-East open terrace
];

interface JaliColonnadeProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  bays: number;
  bayWidth: number;
  sandstoneMat: THREE.Material;
  goldTrimMat: THREE.Material;
  balustradeMat: THREE.Material;
}

const RoyalJaliColonnade: React.FC<JaliColonnadeProps> = ({
  position,
  rotation = [0, 0, 0],
  bays,
  bayWidth,
  sandstoneMat,
  goldTrimMat,
  balustradeMat,
}) => {
  const totalLength = bays * bayWidth;
  const halfLen = totalLength / 2;

  return (
    <group position={position} rotation={rotation}>
      {/* 1. Low Sandstone Plinth Base (0.55m high) */}
      <mesh receiveShadow position={[0, 0.28, 0]} material={sandstoneMat}>
        <boxGeometry args={[totalLength + 0.6, 0.55, 0.7]} />
      </mesh>
      <mesh position={[0, 0.58, 0]} material={goldTrimMat}>
        <boxGeometry args={[totalLength + 0.8, 0.08, 0.8]} />
      </mesh>

      {/* 2. Upper Lintel Beam and Golden Cornice at y=4.8 */}
      <mesh castShadow position={[0, 4.8, 0]} material={sandstoneMat}>
        <boxGeometry args={[totalLength + 0.6, 0.5, 0.75]} />
      </mesh>
      <mesh position={[0, 5.08, 0]} material={goldTrimMat}>
        <boxGeometry args={[totalLength + 0.8, 0.08, 0.85]} />
      </mesh>

      {/* 3. Carved Pillars at each bay junction */}
      {Array.from({ length: bays + 1 }).map((_, i) => {
        const x = -halfLen + i * bayWidth;
        return (
          <group key={i} position={[x, 0, 0]}>
            {/* Pillar Base */}
            <mesh castShadow receiveShadow position={[0, 0.85, 0]} material={sandstoneMat}>
              <boxGeometry args={[0.55, 0.55, 0.55]} />
            </mesh>
            <mesh position={[0, 1.15, 0]} material={goldTrimMat}>
              <boxGeometry args={[0.6, 0.06, 0.6]} />
            </mesh>

            {/* Carved Column Shaft */}
            <mesh castShadow position={[0, 2.75, 0]} material={sandstoneMat}>
              <cylinderGeometry args={[0.18, 0.22, 3.2, 12]} />
            </mesh>

            {/* Pillar Capital */}
            <mesh castShadow position={[0, 4.45, 0]} material={sandstoneMat}>
              <cylinderGeometry args={[0.38, 0.2, 0.35, 8]} />
            </mesh>
            <mesh position={[0, 4.65, 0]} material={goldTrimMat}>
              <boxGeometry args={[0.65, 0.08, 0.65]} />
            </mesh>
          </group>
        );
      })}

      {/* 4. In each bay: Pierced Jaali Screen Balustrade & Open Cusped Arch */}
      {Array.from({ length: bays }).map((_, i) => {
        const x = -halfLen + (i + 0.5) * bayWidth;
        return (
          <group key={i} position={[x, 0, 0]}>
            {/* Lower Pierced Jaali Balustrade (Open stone slats with gaps) */}
            <group position={[0, 1.1, 0]}>
              {/* Bottom rail */}
              <mesh position={[0, -0.4, 0]} material={balustradeMat}>
                <boxGeometry args={[bayWidth - 0.55, 0.1, 0.22]} />
              </mesh>
              {/* Top rail */}
              <mesh position={[0, 0.4, 0]} material={balustradeMat}>
                <boxGeometry args={[bayWidth - 0.55, 0.1, 0.24]} />
              </mesh>
              <mesh position={[0, 0.46, 0]} material={goldTrimMat}>
                <boxGeometry args={[bayWidth - 0.5, 0.04, 0.26]} />
              </mesh>

              {/* Spaced vertical Jaali lattice slats with open gaps between them */}
              {[-1.2, -0.8, -0.4, 0, 0.4, 0.8, 1.2].map((sx, sIdx) => (
                <mesh key={sIdx} position={[sx, 0, 0]} material={balustradeMat}>
                  <boxGeometry args={[0.08, 0.72, 0.12]} />
                </mesh>
              ))}
            </group>

            {/* Golden Ledge Diya glowing on the balustrade in every bay! */}
            <DiyaModel
              position={[0, 1.62, 0]}
              scale={0.7}
              isLit={true}
              interactive={false}
              intensityMultiplier={0.8}
            />

            {/* Cusped Arch Corners at top of bay - leaves large open window in center */}
            <mesh position={[-bayWidth * 0.32, 4.3, 0]} rotation={[0, 0, Math.PI / 4]} material={sandstoneMat}>
              <boxGeometry args={[0.45, 0.45, 0.3]} />
            </mesh>
            <mesh position={[bayWidth * 0.32, 4.3, 0]} rotation={[0, 0, -Math.PI / 4]} material={sandstoneMat}>
              <boxGeometry args={[0.45, 0.45, 0.3]} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};

export const PalaceCourtyard: React.FC<PalaceCourtyardProps> = ({
  litDiyas,
  onToggleDiya,
}) => {
  // Warm Rajasthan Sandstone & Polished Royal Marble materials
  const marbleMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#12162b',
        roughness: 0.14,
        metalness: 0.35,
      }),
    []
  );

  const sandstoneMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#c27a44', // Warm Rajasthan red-gold sandstone
        roughness: 0.65,
        metalness: 0.08,
      }),
    []
  );

  const goldTrimMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#ffd700',
        roughness: 0.25,
        metalness: 0.9,
      }),
    []
  );

  const palaceWallMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#34263e', // Warm illuminated palace stone
        roughness: 0.75,
      }),
    []
  );

  const balustradeMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#d89b65',
        roughness: 0.6,
        metalness: 0.1,
      }),
    []
  );

  const waterMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#063d5c',
        roughness: 0.05,
        metalness: 0.85,
        transparent: true,
        opacity: 0.88,
      }),
    []
  );

  // Pillars around courtyard
  const pillarPositions: [number, number, number][] = [
    [-8, 0, -8], [0, 0, -8], [8, 0, -8],
    [-8, 0, 0],              [8, 0, 0],
    [-8, 0, 7.5],            [8, 0, 7.5]
  ];

  // Rear corner Chhatri pavilions (North corners ONLY - NO foreground obstruction!)
  const rearCornerPositions: [number, number, number][] = [
    [-11, 0, -11],
    [11, 0, -11]
  ];

  return (
    <group>
      {/* 1. Reflective Courtyard Marble Floor */}
      <mesh
        receiveShadow
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        material={marbleMaterial}
      >
        <planeGeometry args={[30, 30, 16, 16]} />
      </mesh>

      {/* Decorative Golden Inlay Mandala Rings */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <ringGeometry args={[3.2, 3.45, 48]} />
        <meshStandardMaterial color="#ffd700" roughness={0.25} metalness={0.9} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <ringGeometry args={[6.8, 7.1, 48]} />
        <meshStandardMaterial color="#dfa234" roughness={0.25} metalness={0.85} />
      </mesh>

      {/* 2. Central Octagonal Dais / Altar (where the rocket launch pad sits) */}
      <group position={[0, 0, 0]}>
        <mesh
          castShadow
          receiveShadow
          position={[0, 0.15, 0]}
          material={sandstoneMaterial}
        >
          <cylinderGeometry args={[3.2, 3.5, 0.3, 8]} />
        </mesh>

        <mesh
          castShadow
          receiveShadow
          position={[0, 0.35, 0]}
          material={marbleMaterial}
        >
          <cylinderGeometry args={[2.5, 2.8, 0.15, 8]} />
        </mesh>

        <mesh position={[0, 0.43, 0]} material={goldTrimMaterial}>
          <torusGeometry args={[2.52, 0.04, 8, 32]} />
        </mesh>

        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.42, 0]}
          material={waterMaterial}
        >
          <ringGeometry args={[1.5, 2.4, 32]} />
        </mesh>

        {/* Warm Altar Uplight for the Rocket & Central Diyas */}
        <pointLight
          position={[0, 0.9, 0]}
          color="#ffaa33"
          intensity={4.5}
          distance={10}
          decay={1.8}
        />
      </group>

      {/* 3. Carved Royal Pillars (Warm Sandstone with Lotus Capitals) */}
      {pillarPositions.map((pos, idx) => (
        <group key={idx} position={pos}>
          <mesh castShadow receiveShadow position={[0, 0.4, 0]} material={sandstoneMaterial}>
            <boxGeometry args={[0.9, 0.8, 0.9]} />
          </mesh>
          <mesh position={[0, 0.82, 0]} material={goldTrimMaterial}>
            <boxGeometry args={[1.0, 0.08, 1.0]} />
          </mesh>

          <mesh castShadow receiveShadow position={[0, 2.7, 0]} material={sandstoneMaterial}>
            <cylinderGeometry args={[0.3, 0.35, 3.8, 16]} />
          </mesh>

          <mesh castShadow position={[0, 4.75, 0]} material={sandstoneMaterial}>
            <cylinderGeometry args={[0.55, 0.3, 0.5, 8]} />
          </mesh>
          <mesh position={[0, 5.05, 0]} material={goldTrimMaterial}>
            <boxGeometry args={[1.1, 0.15, 1.1]} />
          </mesh>
        </group>
      ))}

      {/* 4. Colonnade Arches and Upper Entablature (North, East, West) */}
      {/* North Facade Upper Beam */}
      <group position={[0, 5.3, -8]}>
        <mesh castShadow material={sandstoneMaterial}>
          <boxGeometry args={[18, 0.6, 0.9]} />
        </mesh>
        <mesh position={[0, 0.35, 0]} material={goldTrimMaterial}>
          <boxGeometry args={[18.2, 0.1, 1.0]} />
        </mesh>
      </group>

      {/* East & West Wall Beams */}
      {[-8, 8].map((x, i) => (
        <group key={i} position={[x, 5.3, 0]}>
          <mesh castShadow material={sandstoneMaterial}>
            <boxGeometry args={[0.9, 0.6, 17]} />
          </mesh>
          <mesh position={[0, 0.35, 0]} material={goldTrimMaterial}>
            <boxGeometry args={[1.0, 0.1, 17.2]} />
          </mesh>
        </group>
      ))}

      {/* 5. Palace Perimeter JAALIDAAR Walls (North, East, West - with open apertures & glowing ledge diyas) */}
      {/* North Jaali Colonnade */}
      <RoyalJaliColonnade
        position={[0, 0, -12]}
        bays={6}
        bayWidth={4.0}
        sandstoneMat={sandstoneMaterial}
        goldTrimMat={goldTrimMaterial}
        balustradeMat={balustradeMaterial}
      />

      {/* East Jaali Colonnade */}
      <RoyalJaliColonnade
        position={[12, 0, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        bays={6}
        bayWidth={4.0}
        sandstoneMat={sandstoneMaterial}
        goldTrimMat={goldTrimMaterial}
        balustradeMat={balustradeMaterial}
      />

      {/* West Jaali Colonnade */}
      <RoyalJaliColonnade
        position={[-12, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
        bays={6}
        bayWidth={4.0}
        sandstoneMat={sandstoneMaterial}
        goldTrimMat={goldTrimMaterial}
        balustradeMat={balustradeMaterial}
      />

      {/* 6. OPEN SOUTH ENTRANCE: Decorative Low Jali Balustrades (Only 0.7m High!) */}
      {/* South-West low decorative railing */}
      <group position={[-6.2, 0.35, 8.5]}>
        <mesh castShadow receiveShadow material={balustradeMaterial}>
          <boxGeometry args={[4.5, 0.7, 0.25]} />
        </mesh>
        <mesh position={[0, 0.38, 0]} material={goldTrimMaterial}>
          <boxGeometry args={[4.6, 0.08, 0.3]} />
        </mesh>
      </group>

      {/* South-East low decorative railing */}
      <group position={[6.2, 0.35, 8.5]}>
        <mesh castShadow receiveShadow material={balustradeMaterial}>
          <boxGeometry args={[4.5, 0.7, 0.25]} />
        </mesh>
        <mesh position={[0, 0.38, 0]} material={goldTrimMaterial}>
          <boxGeometry args={[4.6, 0.08, 0.3]} />
        </mesh>
      </group>

      {/* 7. Jharokha (Carved Royal Balcony on North Wall) */}
      <group position={[0, 4.2, -11]}>
        <mesh position={[0, -0.6, 0]} material={sandstoneMaterial}>
          <coneGeometry args={[1.6, 1.0, 8]} />
        </mesh>
        <mesh position={[0, 0.4, 0]} material={sandstoneMaterial}>
          <boxGeometry args={[2.4, 1.2, 1.2]} />
        </mesh>
        <mesh position={[0, 0.4, 0.61]}>
          <planeGeometry args={[2.2, 1.0]} />
          <meshStandardMaterial color="#1a1528" roughness={0.7} />
        </mesh>
        <mesh position={[0, 1.4, 0]} material={goldTrimMaterial}>
          <coneGeometry args={[1.5, 0.8, 8]} />
        </mesh>
        <pointLight color="#ffaa33" intensity={2.5} distance={6} />
      </group>

      {/* 8. Rear Corner Royal Chhatri Pavilions (Framing the North Skyline) */}
      {rearCornerPositions.map((pos, idx) => (
        <group key={idx} position={pos}>
          <mesh castShadow receiveShadow position={[0, 2.8, 0]} material={sandstoneMaterial}>
            <boxGeometry args={[1.8, 5.6, 1.8]} />
          </mesh>
          {[
            [-0.6, 0, -0.6],
            [0.6, 0, -0.6],
            [-0.6, 0, 0.6],
            [0.6, 0, 0.6]
          ].map(([cx, _, cz], pIdx) => (
            <mesh key={pIdx} position={[cx, 6.4, cz]} material={sandstoneMaterial}>
              <cylinderGeometry args={[0.08, 0.1, 1.8, 8]} />
            </mesh>
          ))}
          <mesh position={[0, 7.8, 0]} material={sandstoneMaterial}>
            <sphereGeometry args={[1.2, 16, 16]} />
          </mesh>
          <mesh position={[0, 9.1, 0]} material={goldTrimMaterial}>
            <coneGeometry args={[0.15, 0.9, 8]} />
          </mesh>
          <DiyaModel
            position={[0, 5.7, 0]}
            isLit={true}
            interactive={false}
            scale={0.9}
          />
        </group>
      ))}

      {/* 9. Courtyard Golden Warm Wash Lights on Pillar Tops */}
      {[-8, 8].map((x, i) => (
        <React.Fragment key={i}>
          <pointLight position={[x, 4.6, -7]} color="#ffaa33" intensity={3.5} distance={14} decay={1.8} />
          <pointLight position={[x, 4.6, 2]} color="#ffaa33" intensity={3.5} distance={14} decay={1.8} />
        </React.Fragment>
      ))}

      {/* 10. Hanging Akash Kandils */}
      <AkashKandil position={[-4, 4.6, -8]} color="#e63946" glowColor="#ffb703" scale={1.1} swaySpeed={1.1} swayOffset={0.2} />
      <AkashKandil position={[4, 4.6, -8]} color="#0077b6" glowColor="#ffea00" scale={1.1} swaySpeed={0.9} swayOffset={1.4} />
      <AkashKandil position={[-8, 4.6, -3]} color="#10b981" glowColor="#ffd166" scale={1.1} swaySpeed={1.2} swayOffset={2.1} />
      <AkashKandil position={[8, 4.6, -3]} color="#9d0208" glowColor="#ffaa00" scale={1.1} swaySpeed={1.0} swayOffset={3.3} />

      {/* 11. Marigold Garlands */}
      <MarigoldGarlands />

      {/* 12. Floating Firefly & Dust Particles */}
      <FireflyParticles count={450} />

      {/* 13. The 8 Ceremonial Diyas */}
      {DIYA_POSITIONS.map((pos, idx) => (
        <DiyaModel
          key={idx}
          position={pos}
          isLit={litDiyas[idx]}
          onIgnite={() => onToggleDiya(idx)}
          interactive={true}
          scale={1.15}
        />
      ))}
    </group>
  );
};
