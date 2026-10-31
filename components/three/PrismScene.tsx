"use client";

import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshTransmissionMaterial, Environment } from "@react-three/drei";
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

    meshRef.current.rotation.x = targetRotation.current.x;
    meshRef.current.rotation.y += delta * 0.35 + (targetRotation.current.y - meshRef.current.rotation.y) * 0.08;
    meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.7) * 0.04;
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh ref={meshRef} castShadow receiveShadow scale={1.3}>
        <octahedronGeometry args={[1.4, 0]} />
        <MeshTransmissionMaterial
          backside
          samples={6}
          resolution={512}
          transmission={0.95}
          roughness={0.06}
          thickness={1.2}
          ior={1.5}
          chromaticAberration={0.15}
          anisotropy={0.1}
          distortion={0.1}
          distortionScale={0.2}
          temporalDistortion={0.05}
          color="#F5F5F7"
          attenuationColor="#CCCCCC"
          attenuationDistance={2}
        />
      </mesh>
    </Float>
  );
}

export default function PrismScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

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
      className="relative w-full h-full min-h-[160px] flex items-center justify-center cursor-grab active:cursor-grabbing overflow-hidden"
    >
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 42 }}
        dpr={[1, 2]}
        frameloop={inView ? "always" : "never"}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          alpha: true,
        }}
        style={{ width: "100%", height: "100%" }}
      >
        {/* Environment map for realistic glass refraction and HDR specular highlights */}
        <Environment preset="city" />

        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={2.0} color="#FFFFFF" />
        <directionalLight position={[-5, -5, -3]} intensity={1.2} color="#AAAAAA" />
        <pointLight position={[0, 4, 2]} intensity={1.5} color="#FFFFFF" />

        <CrystalMonolith pointer={pointer} />
      </Canvas>
    </div>
  );
}
