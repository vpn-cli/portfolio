"use client";

import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";

function CrystalMonolith({ pointer }: { pointer: { x: number; y: number } }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const targetRotation = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Smoothly interpolate rotation toward cursor pointer
    targetRotation.current.x = THREE.MathUtils.lerp(
      targetRotation.current.x,
      pointer.y * 0.45,
      delta * 4
    );
    targetRotation.current.y = THREE.MathUtils.lerp(
      targetRotation.current.y,
      pointer.x * 0.55,
      delta * 4
    );

    // Continuous ambient slow yaw + mouse tilt
    meshRef.current.rotation.x = targetRotation.current.x;
    meshRef.current.rotation.y += delta * 0.35 + (targetRotation.current.y - meshRef.current.rotation.y) * 0.08;
    meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.8) * 0.05;
  });

  return (
    <Float speed={2.5} rotationIntensity={0.2} floatIntensity={0.6}>
      <mesh ref={meshRef} castShadow receiveShadow scale={1.25}>
        {/* Chamfered Octahedron / Crystal geometry */}
        <octahedronGeometry args={[1.5, 0]} />
        <MeshTransmissionMaterial
          backside
          samples={8}
          resolution={512}
          transmission={0.96}
          roughness={0.08}
          thickness={1.2}
          ior={1.6}
          chromaticAberration={0.35}
          anisotropy={0.2}
          distortion={0.15}
          distortionScale={0.3}
          temporalDistortion={0.1}
          color="#FFE9D6"
          attenuationColor="#FF6B00"
          attenuationDistance={1.8}
        />
      </mesh>
    </Float>
  );
}

export default function PrismScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  // IntersectionObserver to pause rendering when offscreen
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    setPointer({ x, y });
  };

  const handlePointerLeave = () => {
    setPointer({ x: 0, y: 0 });
  };

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative w-full h-full min-h-[280px] flex items-center justify-center cursor-grab active:cursor-grabbing overflow-hidden"
    >
      <Canvas
        camera={{ position: [0, 0, 4.8], fov: 45 }}
        dpr={[1, 2]} // Cap DPR at 2 for performance
        frameloop={inView ? "always" : "never"} // Pause offscreen
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          alpha: true,
        }}
        style={{ width: "100%", height: "100%" }}
      >
        <ambientLight intensity={0.6} />
        {/* Warm key light */}
        <directionalLight position={[4, 5, 3]} intensity={2.2} color="#FFF2E5" />
        {/* Amber rim backlight */}
        <pointLight position={[-4, -3, -3]} intensity={4.5} color="#FF6B00" />
        {/* Cool subtle fill */}
        <pointLight position={[0, -4, 2]} intensity={0.8} color="#60A5FA" />

        <CrystalMonolith pointer={pointer} />
      </Canvas>

      {/* Optical flare ring background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center -z-10 opacity-30"
      >
        <div className="w-56 h-56 rounded-full bg-gradient-to-tr from-accent via-amber-400 to-transparent blur-3xl animate-pulse" />
      </div>
    </div>
  );
}

