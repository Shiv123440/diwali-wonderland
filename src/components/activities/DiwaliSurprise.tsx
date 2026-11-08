import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { audioManager } from '../../utils/audio';

interface DiwaliSurpriseProps {
  position?: [number, number, number];
  onOpenModal: () => void;
}

export const DiwaliSurprise: React.FC<DiwaliSurpriseProps> = ({
  position = [4.8, 0.5, 4.8],
  onOpenModal,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const lidRef = useRef<THREE.Group>(null);
  const sparkRef = useRef<THREE.Points>(null);

  const lidProgress = useRef(0);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);

    if (isOpen) {
      lidProgress.current = THREE.MathUtils.lerp(lidProgress.current, 1, dt * 3.5);
    } else {
      lidProgress.current = THREE.MathUtils.lerp(lidProgress.current, 0, dt * 3.5);
    }

    if (lidRef.current) {
      lidRef.current.position.y = 0.55 + lidProgress.current * 0.9;
      lidRef.current.position.z = -lidProgress.current * 0.6;
      lidRef.current.rotation.x = -lidProgress.current * 0.85;
      lidRef.current.rotation.y = lidProgress.current * 0.35;
    }

    if (sparkRef.current) {
      const posAttr = sparkRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const array = posAttr.array as Float32Array;
      const active = isOpen || hovered;

      for (let i = 0; i < 40; i++) {
        const idx = i * 3;
        if (active) {
          array[idx] = (Math.random() - 0.5) * 1.2;
          array[idx + 1] = 0.4 + Math.random() * (isOpen ? 1.5 : 0.8);
          array[idx + 2] = (Math.random() - 0.5) * 1.2;
        } else {
          array[idx + 1] = -50;
        }
      }
      posAttr.needsUpdate = true;
    }
  });

  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    if (!isOpen) {
      setIsOpen(true);
      audioManager.playGiftOpen();
      setTimeout(() => {
        onOpenModal();
      }, 600);
    } else {
      onOpenModal();
    }
  };

  return (
    <group
      position={position}
      onClick={handleClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <mesh position={[0, -0.25, 0]}>
        <cylinderGeometry args={[0.7, 0.85, 0.5, 16]} />
        <meshStandardMaterial color="#3a1e0d" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.01, 0]}>
        <cylinderGeometry args={[0.75, 0.75, 0.05, 16]} />
        <meshStandardMaterial color="#dfa234" metalness={0.8} roughness={0.3} />
      </mesh>

      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.8, 0.48, 0.8]} />
        <meshStandardMaterial
          color="#800e13"
          roughness={0.4}
          metalness={0.2}
        />
      </mesh>

      <mesh position={[0, 0.25, 0]}>
        <boxGeometry args={[0.805, 0.49, 0.14]} />
        <meshStandardMaterial color="#ffd700" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.25, 0]}>
        <boxGeometry args={[0.14, 0.49, 0.805]} />
        <meshStandardMaterial color="#ffd700" metalness={0.9} roughness={0.2} />
      </mesh>

      <group ref={lidRef} position={[0, 0.52, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.86, 0.14, 0.86]} />
          <meshStandardMaterial color="#9d0208" roughness={0.35} metalness={0.2} />
        </mesh>
        <mesh position={[0, -0.06, 0]}>
          <boxGeometry args={[0.88, 0.02, 0.88]} />
          <meshStandardMaterial color="#dfa234" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.075, 0]}>
          <boxGeometry args={[0.865, 0.01, 0.16]} />
          <meshStandardMaterial color="#ffd700" metalness={0.9} />
        </mesh>
        <mesh position={[0, 0.075, 0]}>
          <boxGeometry args={[0.16, 0.01, 0.865]} />
          <meshStandardMaterial color="#ffd700" metalness={0.9} />
        </mesh>
        <group position={[0, 0.14, 0]}>
          <mesh rotation={[0, 0, Math.PI / 4]}>
            <torusGeometry args={[0.09, 0.035, 8, 16]} />
            <meshStandardMaterial color="#ffe066" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh rotation={[0, Math.PI / 2, Math.PI / 4]}>
            <torusGeometry args={[0.09, 0.035, 8, 16]} />
            <meshStandardMaterial color="#ffe066" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>
      </group>

      <points ref={sparkRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array(120), 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.08}
          color="#ffd700"
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {isOpen && (
        <pointLight
          position={[0, 0.45, 0]}
          color="#ffaa00"
          intensity={3}
          distance={4}
        />
      )}
    </group>
  );
};
