import React, { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';

interface GarlandArc {
  start: [number, number, number];
  end: [number, number, number];
  sag: number;
  count: number;
}

export const MarigoldGarlands: React.FC = () => {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const arcs = useMemo<GarlandArc[]>(() => {
    const list: GarlandArc[] = [];
    const height = 4.2;

    for (let x = -8; x < 8; x += 4) {
      list.push({
        start: [x, height, -10],
        end: [x + 4, height, -10],
        sag: 0.6,
        count: 14,
      });
      list.push({
        start: [x, height, 10],
        end: [x + 4, height, 10],
        sag: 0.6,
        count: 14,
      });
    }

    for (let z = -8; z < 8; z += 4) {
      list.push({
        start: [-10, height, z],
        end: [-10, height, z + 4],
        sag: 0.6,
        count: 14,
      });
      list.push({
        start: [10, height, z],
        end: [10, height, z + 4],
        sag: 0.6,
        count: 14,
      });
    }

    const radius = 3.8;
    const segments = 8;
    for (let i = 0; i < segments; i++) {
      const a1 = (i / segments) * Math.PI * 2;
      const a2 = ((i + 1) / segments) * Math.PI * 2;
      list.push({
        start: [Math.cos(a1) * radius, 0.45, Math.sin(a1) * radius],
        end: [Math.cos(a2) * radius, 0.45, Math.sin(a2) * radius],
        sag: 0.15,
        count: 8,
      });
    }

    return list;
  }, []);

  const totalMarigolds = useMemo(() => {
    return arcs.reduce((acc, arc) => acc + arc.count, 0);
  }, [arcs]);

  const { dummy, colors } = useMemo(() => {
    const dummy = new THREE.Object3D();
    const orange = new THREE.Color('#ff6b00');
    const yellow = new THREE.Color('#ffc300');
    const colors: THREE.Color[] = [];
    for (let i = 0; i < totalMarigolds; i++) {
      colors.push(i % 2 === 0 ? orange : yellow);
    }
    return { dummy, colors };
  }, [totalMarigolds]);

  useEffect(() => {
    if (!meshRef.current) return;
    let idx = 0;

    arcs.forEach((arc) => {
      const { start, end, sag, count } = arc;
      for (let i = 0; i < count; i++) {
        const t = i / (count - 1);
        const x = start[0] + (end[0] - start[0]) * t;
        const z = start[2] + (end[2] - start[2]) * t;
        const y = start[1] + (end[1] - start[1]) * t - 4 * sag * t * (1 - t);

        dummy.position.set(x, y, z);
        const scaleVariation = 0.09 + ((idx * 17) % 7) * 0.005;
        dummy.scale.set(scaleVariation, scaleVariation, scaleVariation);
        dummy.rotation.set(
          Math.sin(idx) * 0.3,
          Math.cos(idx) * 0.3,
          Math.sin(idx * 2) * 0.3
        );
        dummy.updateMatrix();

        meshRef.current!.setMatrixAt(idx, dummy.matrix);
        meshRef.current!.setColorAt(idx, colors[idx]);
        idx++;
      }
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  }, [arcs, dummy, colors, totalMarigolds]);

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, totalMarigolds]}
      castShadow
      receiveShadow
    >
      <sphereGeometry args={[1, 7, 7]} />
      <meshStandardMaterial roughness={0.6} metalness={0.05} />
    </instancedMesh>
  );
};
