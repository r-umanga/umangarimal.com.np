import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import * as THREE from "three";
import { World } from "./World";

export function SceneCanvas({ fancy }: { fancy: boolean }) {
  return (
    <div className="scene-root" aria-hidden="true">
      <Canvas
        dpr={fancy ? [1, 1.6] : [1, 1.15]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: fancy ? "high-performance" : "default",
          stencil: false,
        }}
        shadows={fancy ? "percentage" : false}
        onCreated={({ gl }) => {
          gl.shadowMap.type = THREE.PCFShadowMap;
        }}
        camera={{ fov: 34, near: 0.1, far: 80, position: [2.45, 0.58, 4.55] }}
      >
        <Suspense fallback={null}>
          <World fancy={fancy} />
        </Suspense>
      </Canvas>
    </div>
  );
}
