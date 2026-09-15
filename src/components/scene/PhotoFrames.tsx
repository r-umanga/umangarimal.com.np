import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { FRAME_TEXTURES } from "@/lib/content";
import { useScroll } from "@/lib/scroll";

function Frame({
  url,
  position,
  rotation,
  width,
}: {
  url: string;
  position: [number, number, number];
  rotation: [number, number, number];
  width: number;
}) {
  const tex = useTexture(url);
  tex.colorSpace = THREE.SRGBColorSpace;
  const height = width * 0.68;

  return (
    <group position={position} rotation={rotation}>
      <mesh>
        <boxGeometry args={[width + 0.08, height + 0.08, 0.06]} />
        <meshStandardMaterial color="#c4a46a" metalness={0.85} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0, 0.02]}>
        <boxGeometry args={[width + 0.02, height + 0.02, 0.04]} />
        <meshStandardMaterial color="#0c0b09" metalness={0.2} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0, 0.045]}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial map={tex} roughness={0.45} metalness={0.05} />
      </mesh>
    </group>
  );
}

export function PhotoFrames() {
  const group = useRef<THREE.Group>(null);
  const progress = useScroll((s) => s.progress);
  const layout = useMemo(() => {
    return FRAME_TEXTURES.map((url, i) => {
      const t = (i / (FRAME_TEXTURES.length - 1)) * Math.PI - Math.PI / 2;
      const radius = 6.4;
      const x = Math.sin(t) * radius;
      const z = -4.2 - Math.cos(t) * 1.6;
      const y = ((i % 3) - 1) * 1.35;
      return {
        url,
        position: [x, y, z] as [number, number, number],
        rotation: [0, -t * 0.35, 0] as [number, number, number],
        width: 1.7 + (i % 2) * 0.25,
      };
    });
  }, []);

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    const p = progress;
    const show = Math.min(
      1,
      Math.max(0, (p - 0.3) / 0.08) * Math.max(0, 1 - (p - 0.68) / 0.12),
    );
    const d = Math.min(delta, 0.1);
    g.scale.setScalar(g.scale.x + (0.85 + show * 0.15 - g.scale.x) * (1 - Math.exp(-4 * d)));
    g.visible = show > 0.02;
  });

  return (
    <group ref={group}>
      {layout.map((f) => (
        <Frame key={f.url + f.position.join()} {...f} />
      ))}
    </group>
  );
}