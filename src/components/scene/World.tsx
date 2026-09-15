import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useScroll } from "@/lib/scroll";
import { Dslr } from "./Dslr";
import { Dust } from "./Dust";

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function CameraRig() {
  const group = useRef<THREE.Group>(null);
  const orbit = useScroll((s) => s.orbit);
  const reduced = useScroll((s) => s.reduced);
  const scrollRef = useRef(0);

  // Subscribe imperatively (not via the hook's render path) so scroll at
  // 60fps never forces a React re-render — useFrame just reads the latest
  // value each tick.
  useEffect(() => {
    return useScroll.subscribe((s) => {
      scrollRef.current = s.cameraProgress;
    });
  }, []);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const d = Math.min(delta, 0.1);
    const p = scrollRef.current;

    // Idle sway + user drag-orbit, same as before...
    const idle = reduced
      ? 0.4
      : 0.4 + Math.sin(state.clock.elapsedTime * 0.18) * 0.05;

    // ...plus a real scroll-driven turn: the body slowly rotates through
    // most of a full revolution as you scroll down the section, so the
    // rig is visibly, continuously responding to scroll input rather than
    // just idling.
    const turnRange = reduced ? 1.1 : 3.2;
    const targetY = idle + orbit + p * turnRange;
    g.rotation.y = lerp(g.rotation.y, targetY, 1 - Math.exp(-3 * d));

    const tilt = Math.sin(p * Math.PI) * (reduced ? 0.06 : 0.16);
    g.rotation.x = lerp(g.rotation.x, -0.08 + tilt, 1 - Math.exp(-2.5 * d));

    // Dolly: the body eases toward camera mid-scroll, then settles back —
    // a subtle push-in / pull-out instead of a flat rotate-in-place.
    const dollyBump = Math.sin(p * Math.PI) * (reduced ? 0.15 : 0.55);
    g.position.z = lerp(g.position.z, dollyBump, 1 - Math.exp(-2.5 * d));
    g.position.y = lerp(g.position.y, -0.05 + p * 0.08, 1 - Math.exp(-2.5 * d));
  });

  return (
    <group ref={group}>
      <pointLight
        position={[1.2, 1.2, 2]}
        intensity={12}
        color="#f8ecd8"
        distance={8}
      />
      <pointLight
        position={[-1.5, 0.8, -0.5]}
        intensity={4}
        color="#c8d8f0"
        distance={6}
      />
      <Dslr />
    </group>
  );
}

export function World({ fancy }: { fancy: boolean }) {
  return (
    <>
      <color attach="background" args={["#100e0c"]} />
      <ambientLight intensity={0.08} color="#ede0cc" />
      <spotLight
        position={[3.5, 5, 3.5]}
        intensity={fancy ? 50 : 35}
        color="#e8d090"
        angle={0.4}
        penumbra={0.9}
        castShadow={false}
      />
      <CameraRig />
      <Dust count={fancy ? 180 : 60} />
    </>
  );
}
