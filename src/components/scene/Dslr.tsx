/**
 * Canon EOS 850D (Rebel T8i / Kiss X10i) — accurate procedural model.
 * No text labels or markings on geometry, as requested.
 *
 * Key anatomical features modelled:
 *  – Asymmetric body: wide right-hand rubber grip, compact left body
 *  – Shallow pentaMIRROR hump (not the taller pentaprism of pro bodies)
 *  – Built-in pop-up flash integrated into the pentamirror/top area
 *  – Mode dial on top-right plate
 *  – Large rear LCD (3" vari-angle, wider than tall)
 *  – Hot shoe rail on top plate
 *  – EF-S 18-55mm STM: stepped barrel, rubber zoom ring, gold trim rings
 *  – AF/MF switch bump on lens barrel (no text)
 *  – Distance scale window bump on lens
 *  – Strap lug anchors both sides
 *  – Shutter button and main dial on top plate
 *  – D-pad and rear button cluster
 */

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";

/* ─── Material factory ─────────────────────────────────────────────────── */
function makeMats() {
  return {
    body: new THREE.MeshStandardMaterial({
      color: "#181410", roughness: 0.34, metalness: 0.74,
    }),
    grip: new THREE.MeshStandardMaterial({
      color: "#0d0b09", roughness: 0.88, metalness: 0.06,
    }),
    gold: new THREE.MeshStandardMaterial({
      color: "#c8a048", roughness: 0.22, metalness: 0.96,
    }),
    glass: new THREE.MeshStandardMaterial({
      color: "#060c14", roughness: 0.04, metalness: 0.98,
    }),
    dark: new THREE.MeshStandardMaterial({
      color: "#080706", roughness: 0.55, metalness: 0.35,
    }),
    lcd: new THREE.MeshStandardMaterial({
      color: "#111008", roughness: 0.18, metalness: 0.28,
      emissive: "#2e1f0a", emissiveIntensity: 0.28,
    }),
    rubber: new THREE.MeshStandardMaterial({
      color: "#0a0908", roughness: 0.92, metalness: 0.02,
    }),
    silver: new THREE.MeshStandardMaterial({
      color: "#706a60", roughness: 0.3, metalness: 0.82,
    }),
    flash: new THREE.MeshStandardMaterial({
      color: "#d8d0b8", roughness: 0.6, metalness: 0.1,
      emissive: "#c0b890", emissiveIntensity: 0.04,
    }),
    lens_inner: new THREE.MeshStandardMaterial({
      color: "#04090e", roughness: 0.02, metalness: 0.98,
    }),
    dist_window: new THREE.MeshStandardMaterial({
      color: "#c8b888", roughness: 0.5, metalness: 0.2,
      transparent: true, opacity: 0.7,
    }),
  };
}

export function Dslr() {
  const m = useMemo(() => makeMats(), []);
  const recMat = useRef<THREE.MeshStandardMaterial>(null);

  /* Blinking AF-assist / self-timer LED */
  useFrame((state) => {
    if (recMat.current) {
      recMat.current.emissiveIntensity =
        0.5 + Math.sin(state.clock.elapsedTime * 3.8) * 0.42;
    }
  });

  return (
    <group>

      {/* ═══════════════════════════════════
          BODY SHELL
          850D: ~133 × 104 × 76mm
          We scale ~1.72 world-unit wide
      ══════════════════════════════════ */}

      {/* Main shell */}
      <RoundedBox
        args={[1.66, 1.02, 0.76]} radius={0.055} smoothness={4}
        castShadow receiveShadow material={m.body}
      />
      {/* Rubber texture overlay on front face */}
      <RoundedBox
        args={[1.44, 0.68, 0.77]} radius={0.045} smoothness={4}
        position={[0.02, -0.09, 0]} material={m.rubber}
      />

      {/* ═══════════════════════════════════
          RIGHT-HAND GRIP
          Deep, tall, forward-protruding —
          defining shape of the 850D
      ══════════════════════════════════ */}
      <RoundedBox
        args={[0.48, 1.06, 0.94]} radius={0.075} smoothness={5}
        position={[0.77, -0.02, 0.08]} castShadow material={m.rubber}
      />
      <RoundedBox
        args={[0.22, 0.9, 0.72]} radius={0.04} smoothness={4}
        position={[0.84, -0.04, 0.06]} material={m.body}
      />
      {/* Finger-rest contour bumps */}
      {([-0.16, 0.02, 0.18] as const).map((y, i) => (
        <mesh key={i} position={[1.02, y, 0.36]} material={m.rubber}>
          <sphereGeometry args={[0.06, 12, 8]} />
        </mesh>
      ))}

      {/* ═══════════════════════════════════
          TOP PLATE
      ══════════════════════════════════ */}
      <RoundedBox
        args={[1.62, 0.13, 0.72]} radius={0.03} smoothness={3}
        position={[0, 0.545, 0]} material={m.body}
      />

      {/* ═══════════════════════════════════
          PENTAMIRROR HUMP
          850D: low, trapezoidal — NOT the
          tall pentaprism of 7D/5D class
      ══════════════════════════════════ */}
      <RoundedBox
        args={[0.62, 0.32, 0.52]} radius={0.04} smoothness={4}
        position={[-0.14, 0.74, -0.06]} material={m.body}
      />
      {/* Front slope */}
      <mesh position={[-0.14, 0.84, 0.14]} rotation={[0.42, 0, 0]} material={m.body}>
        <boxGeometry args={[0.52, 0.06, 0.24]} />
      </mesh>
      {/* Viewfinder housing */}
      <mesh position={[-0.14, 0.84, -0.34]} material={m.body}>
        <boxGeometry args={[0.22, 0.16, 0.06]} />
      </mesh>
      <mesh position={[-0.14, 0.84, -0.375]} material={m.rubber}>
        <boxGeometry args={[0.17, 0.12, 0.02]} />
      </mesh>
      <mesh position={[-0.14, 0.84, -0.385]} material={m.glass}>
        <boxGeometry args={[0.13, 0.09, 0.005]} />
      </mesh>

      {/* ═══════════════════════════════════
          BUILT-IN FLASH
          Retracts into pentamirror area.
          Shown slightly raised.
      ══════════════════════════════════ */}
      <RoundedBox
        args={[0.38, 0.06, 0.32]} radius={0.02} smoothness={3}
        position={[-0.14, 0.92, 0.02]} material={m.body}
      />
      <mesh position={[-0.14, 0.955, 0.04]} material={m.flash}>
        <boxGeometry args={[0.26, 0.018, 0.14]} />
      </mesh>

      {/* ═══════════════════════════════════
          HOT SHOE RAIL
      ══════════════════════════════════ */}
      <mesh position={[-0.14, 0.618, 0]} material={m.silver}>
        <boxGeometry args={[0.32, 0.016, 0.22]} />
      </mesh>
      {/* Side rails */}
      {([-0.14, 0.14] as const).map((ox, i) => (
        <mesh key={i} position={[-0.14 + ox, 0.615, 0]} material={m.silver}>
          <boxGeometry args={[0.01, 0.022, 0.2]} />
        </mesh>
      ))}

      {/* ═══════════════════════════════════
          MODE DIAL (top right)
      ══════════════════════════════════ */}
      <mesh position={[0.56, 0.68, 0.04]} rotation={[Math.PI / 2, 0, 0]} material={m.body}>
        <cylinderGeometry args={[0.155, 0.155, 0.07, 32]} />
      </mesh>
      <mesh position={[0.56, 0.72, 0.04]} rotation={[Math.PI / 2, 0, 0]} material={m.rubber}>
        <torusGeometry args={[0.155, 0.022, 8, 32]} />
      </mesh>
      {/* Mode indicator dot */}
      <mesh position={[0.56, 0.78, 0.04]} material={m.gold}>
        <sphereGeometry args={[0.012, 8, 8]} />
      </mesh>

      {/* ═══════════════════════════════════
          SHUTTER BUTTON
      ══════════════════════════════════ */}
      <mesh position={[0.72, 0.65, 0.28]} rotation={[-0.28, 0, 0]} material={m.silver}>
        <cylinderGeometry args={[0.048, 0.054, 0.04, 20]} />
      </mesh>
      <mesh position={[0.72, 0.674, 0.29]} rotation={[-0.28, 0, 0]} material={m.body}>
        <cylinderGeometry args={[0.032, 0.032, 0.014, 16]} />
      </mesh>

      {/* ═══════════════════════════════════
          MAIN DIAL / THUMB WHEEL (rear)
      ══════════════════════════════════ */}
      <mesh position={[0.66, 0.52, -0.22]} rotation={[Math.PI / 2, 0, 0]} material={m.body}>
        <cylinderGeometry args={[0.09, 0.09, 0.04, 24]} />
      </mesh>
      <mesh position={[0.66, 0.54, -0.22]} rotation={[Math.PI / 2, 0, 0]} material={m.rubber}>
        <torusGeometry args={[0.09, 0.014, 6, 24]} />
      </mesh>

      {/* ═══════════════════════════════════
          REAR CONTROL BUTTONS
      ══════════════════════════════════ */}
      {([
        [0.62, 0.18, -0.39],
        [0.62, 0.02, -0.39],
        [0.62, -0.14, -0.39],
        [0.44, 0.18, -0.39],
      ] as [number, number, number][]).map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]} material={m.body}>
          <cylinderGeometry args={[0.022, 0.022, 0.018, 14]} />
        </mesh>
      ))}
      {/* D-pad ring */}
      <mesh position={[0.44, -0.08, -0.395]} rotation={[Math.PI / 2, 0, 0]} material={m.body}>
        <torusGeometry args={[0.095, 0.026, 8, 28]} />
      </mesh>
      <mesh position={[0.44, -0.08, -0.395]} material={m.silver}>
        <cylinderGeometry args={[0.056, 0.056, 0.02, 16]} />
      </mesh>

      {/* ═══════════════════════════════════
          REAR LCD — 3" vari-angle
          Real: ~63 × 47mm
          Scaled: ~0.88 × 0.62 world units
      ══════════════════════════════════ */}
      <RoundedBox
        args={[0.86, 0.62, 0.032]} radius={0.018} smoothness={4}
        position={[-0.1, -0.04, -0.4]} material={m.lcd}
      />
      {/* Active display panel */}
      <mesh position={[-0.1, -0.04, -0.418]}>
        <planeGeometry args={[0.78, 0.54]} />
        <meshBasicMaterial color="#121008" />
      </mesh>
      {/* LCD bezel */}
      <RoundedBox
        args={[0.9, 0.66, 0.026]} radius={0.022} smoothness={3}
        position={[-0.1, -0.04, -0.398]} material={m.body}
      />

      {/* ═══════════════════════════════════
          STRAP LUGS
      ══════════════════════════════════ */}
      {/* Left */}
      <mesh position={[-0.88, 0.28, 0]} rotation={[0, 0, Math.PI / 2]} material={m.silver}>
        <torusGeometry args={[0.048, 0.013, 8, 16]} />
      </mesh>
      <mesh position={[-0.88, 0.28, 0]} rotation={[0, 0, Math.PI / 2]} material={m.body}>
        <cylinderGeometry args={[0.024, 0.024, 0.04, 12]} />
      </mesh>
      {/* Right */}
      <mesh position={[0.88, 0.34, -0.06]} rotation={[0, 0, Math.PI / 2]} material={m.silver}>
        <torusGeometry args={[0.048, 0.013, 8, 16]} />
      </mesh>
      <mesh position={[0.88, 0.34, -0.06]} rotation={[0, 0, Math.PI / 2]} material={m.body}>
        <cylinderGeometry args={[0.024, 0.024, 0.04, 12]} />
      </mesh>

      {/* EF-S mount ring indicator */}
      <mesh position={[0.5, 0.2, -0.42]}>
        <circleGeometry args={[0.082, 32]} />
        <meshStandardMaterial color="#c8a048" metalness={0.92} roughness={0.28} />
      </mesh>


      {/* ═══════════════════════════════════
          EF-S 18-55mm f/3.5-5.6 STM LENS
          Real: ~69mm length, ~69mm diam.
          Lightweight collapsible barrel.
      ══════════════════════════════════ */}
      <group position={[0, -0.02, 0.42]}>

        {/* Rear bayonet coupler */}
        <mesh rotation={[Math.PI / 2, 0, 0]} material={m.body}>
          <cylinderGeometry args={[0.46, 0.46, 0.1, 52]} />
        </mesh>
        {/* Gold mount ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.05]} material={m.gold}>
          <torusGeometry args={[0.44, 0.018, 10, 52]} />
        </mesh>

        {/* Main rear barrel */}
        <mesh position={[0, 0, 0.22]} rotation={[Math.PI / 2, 0, 0]} castShadow material={m.body}>
          <cylinderGeometry args={[0.435, 0.435, 0.26, 52]} />
        </mesh>

        {/* Zoom ring (rubber grip) */}
        <mesh position={[0, 0, 0.42]} rotation={[Math.PI / 2, 0, 0]} material={m.rubber}>
          <cylinderGeometry args={[0.445, 0.445, 0.22, 52]} />
        </mesh>
        {/* Zoom ring trim rings */}
        {([0.315, 0.525] as const).map((z, i) => (
          <mesh key={i} position={[0, 0, z]} rotation={[Math.PI / 2, 0, 0]} material={m.gold}>
            <torusGeometry args={[0.448, 0.016, 10, 52]} />
          </mesh>
        ))}

        {/* Front barrel step-down sections */}
        <mesh position={[0, 0, 0.62]} rotation={[Math.PI / 2, 0, 0]} material={m.body}>
          <cylinderGeometry args={[0.41, 0.435, 0.08, 52]} />
        </mesh>
        <mesh position={[0, 0, 0.68]} rotation={[Math.PI / 2, 0, 0]} material={m.body}>
          <cylinderGeometry args={[0.4, 0.41, 0.14, 52]} />
        </mesh>

        {/* Front element gold bezel */}
        <mesh position={[0, 0, 0.76]} rotation={[Math.PI / 2, 0, 0]} material={m.gold}>
          <torusGeometry args={[0.4, 0.022, 10, 52]} />
        </mesh>
        {/* Front glass element */}
        <mesh position={[0, 0, 0.78]} rotation={[Math.PI / 2, 0, 0]} material={m.glass}>
          <circleGeometry args={[0.36, 52]} />
        </mesh>
        {/* Inner recessed element */}
        <mesh position={[0, 0, 0.775]} rotation={[Math.PI / 2, 0, 0]} material={m.lens_inner}>
          <circleGeometry args={[0.28, 48]} />
        </mesh>
        {/* Aperture blades (decorative) */}
        <group position={[0, 0, 0.782]} rotation={[Math.PI / 2, 0, 0]}>
          {Array.from({ length: 7 }).map((_, i) => (
            <mesh key={i} rotation={[0, 0, (i / 7) * Math.PI * 2]} material={m.gold}>
              <boxGeometry args={[0.016, 0.2, 0.006]} />
            </mesh>
          ))}
        </group>
        {/* Front ring */}
        <mesh position={[0, 0, 0.79]} rotation={[Math.PI / 2, 0, 0]} material={m.gold}>
          <ringGeometry args={[0.36, 0.4, 52]} />
        </mesh>

        {/* ── AF/MF SWITCH (no text) — left side of barrel, ~8 o'clock */}
        <mesh position={[-0.44, -0.06, 0.34]} rotation={[0, Math.PI / 6, 0]} material={m.silver}>
          <boxGeometry args={[0.04, 0.055, 0.028]} />
        </mesh>

        {/* ── DISTANCE WINDOW — top of lens barrel */}
        <mesh position={[0, 0.445, 0.36]}>
          <boxGeometry args={[0.12, 0.03, 0.08]} />
          <meshStandardMaterial color="#1a1810" roughness={0.3} metalness={0.5} />
        </mesh>
        <mesh position={[0, 0.452, 0.36]} material={m.dist_window}>
          <boxGeometry args={[0.1, 0.01, 0.065]} />
        </mesh>

      </group>
      {/* End lens group */}

      {/* ═══════════════════════════════════
          AF-ASSIST / SELF-TIMER LED (front)
      ══════════════════════════════════ */}
      <mesh position={[0.64, 0.1, 0.4]}>
        <sphereGeometry args={[0.018, 10, 8]} />
        <meshStandardMaterial
          ref={recMat}
          color="#f2c869"
          emissive="#f2c869"
          emissiveIntensity={0.7}
          roughness={0.25}
        />
      </mesh>

    </group>
  );
}
