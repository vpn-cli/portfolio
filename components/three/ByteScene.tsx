"use client";

import React, { useRef, useState, useEffect, useMemo, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "@/components/motion/ThemeProvider";

interface HeartParticle {
  id: number;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  scale: number;
  opacity: number;
  life: number;
  maxLife: number;
}

interface SleepZParticle {
  id: number;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  scale: number;
  opacity: number;
  life: number;
  maxLife: number;
}

function ResponsiveCamera({ margin = 1.28 }: { margin?: number }) {
  const { camera, size } = useThree();

  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const aspect = size.width / Math.max(1, size.height);
    const vFov = (cam.fov * Math.PI) / 180;
    // Bounding box of Byte is roughly height 1.8, width 2.2
    const fitHeightDist = (1.8 / 2) / Math.tan(vFov / 2);
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * aspect);
    const fitWidthDist = (2.2 / 2) / Math.tan(hFov / 2);

    const dist = margin * Math.max(fitHeightDist, fitWidthDist);

    cam.position.set(0, 0.04, Math.max(3.8, dist));
    cam.lookAt(0, 0, 0);
    cam.updateProjectionMatrix();
  }, [camera, size.width, size.height, margin]);

  return null;
}

type FaceExpression =
  | "normal"
  | "curious"
  | "happy"
  | "dizzy"
  | "sleepy"
  | "charging"
  | "yawn"
  | "stretch";

function ByteCharacter({
  isHovered,
  isPressed,
  isCharging,
  isDragging,
  dragDelta,
  pointerGaze,
  glanceTarget,
  reducedMotion,
  inView,
  isDocVisible,
  theme,
  isSleeping,
  isDizzy,
  isHappy,
  isWaving,
  isDancing,
  isYawning,
  isStretching,
  hearts,
  sleepZs,
  patSpinTrigger,
}: {
  isHovered: boolean;
  isPressed: boolean;
  isCharging: boolean;
  isDragging: boolean;
  dragDelta: { dx: number; dy: number };
  pointerGaze: { x: number; y: number };
  glanceTarget: { x: number; y: number } | null;
  reducedMotion: boolean;
  inView: boolean;
  isDocVisible: boolean;
  theme: "dark" | "light";
  isSleeping: boolean;
  isDizzy: boolean;
  isHappy: boolean;
  isWaving: boolean;
  isDancing: boolean;
  isYawning: boolean;
  isStretching: boolean;
  hearts: HeartParticle[];
  sleepZs: SleepZParticle[];
  patSpinTrigger: number;
}) {
  const { invalidate } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);
  const headPivotRef = useRef<THREE.Group>(null);
  const antennaStalkRef = useRef<THREE.Group>(null);
  const antennaBallMeshRef = useRef<THREE.Mesh>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);

  // Dynamic 512x256 Canvas for Visor Screen Face Expressions
  const faceCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const faceTextureRef = useRef<THREE.CanvasTexture | null>(null);

  // Physics & Animation state registers
  const physics = useRef({
    y: 0,
    vy: 0,
    squashY: 1,
    squashXZ: 1,
    rotX: 0,
    rotY: 0,
    vRotX: 0,
    vRotY: 0,
    antennaAngleZ: 0,
    vAntennaAngleZ: 0,
    antennaAngleX: 0,
    vAntennaAngleX: 0,
    gazeX: 0,
    gazeY: 0,
    blinkScale: 1,
    armAngleL: 0,
    armAngleR: 0,
    dancePhase: 0,
    spinRotY: 0,
  });

  const lastDragPos = useRef({ dx: 0, dy: 0 });
  const blinkTimer = useRef(2.5);
  const isBlinking = useRef(false);
  const blinkProgress = useRef(0);
  const patSpinRemaining = useRef(0);
  const lastSpinTrigger = useRef(patSpinTrigger);

  if (patSpinTrigger !== lastSpinTrigger.current) {
    lastSpinTrigger.current = patSpinTrigger;
    if (!reducedMotion) {
      patSpinRemaining.current = 0.55;
    }
  }

  // Draw Face Canvas Texture depending on state & expressions
  const drawFace = useCallback(
    (
      expression: FaceExpression,
      gaze: { x: number; y: number },
      blinkScale: number,
      time: number
    ) => {
      const canvas = faceCanvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Clear and draw dark rounded screen background
      ctx.clearRect(0, 0, 512, 256);
      ctx.fillStyle = "#080a0f";
      ctx.beginPath();
      ctx.roundRect(6, 6, 500, 244, 58);
      ctx.fill();

      const eyeColor = "#38bdf8"; // Vibrant electric cyan
      const eyeGlowColor = "rgba(56, 189, 248, 0.4)";
      const blushColor =
        theme === "dark" ? "rgba(251, 113, 133, 0.48)" : "rgba(244, 63, 94, 0.38)";

      // Gaze offset (bounded within visor)
      const gx = gaze.x * 28;
      const gy = gaze.y * 15;

      const leftEyeX = 186 + gx;
      const rightEyeX = 326 + gx;
      const eyeY = 118 + gy;

      // Draw Cheek Blush (soft warm glowing ellipses)
      if (expression !== "dizzy") {
        ctx.fillStyle = blushColor;
        ctx.beginPath();
        ctx.ellipse(126 + gx * 0.4, 148 + gy * 0.4, 22, 11, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.ellipse(386 + gx * 0.4, 148 + gy * 0.4, 22, 11, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw Eyes according to expression
      if (expression === "happy" || expression === "stretch") {
        // Happy Smiling Arcs "^ ^"
        ctx.strokeStyle = eyeColor;
        ctx.lineWidth = 14;
        ctx.lineCap = "round";

        // Left happy arc
        ctx.beginPath();
        ctx.arc(leftEyeX, eyeY + 10, 26, Math.PI * 1.15, Math.PI * 1.85);
        ctx.stroke();

        // Right happy arc
        ctx.beginPath();
        ctx.arc(rightEyeX, eyeY + 10, 26, Math.PI * 1.15, Math.PI * 1.85);
        ctx.stroke();
      } else if (expression === "dizzy") {
        // Dizzy Spinning Spirals "@ @"
        ctx.strokeStyle = eyeColor;
        ctx.lineWidth = 5.5;
        ctx.lineCap = "round";

        const spinAngle = time * 9;
        [leftEyeX, rightEyeX].forEach((cx) => {
          ctx.beginPath();
          for (let a = 0; a < Math.PI * 4; a += 0.12) {
            const r = a * 5.8;
            const x = cx + Math.cos(a + spinAngle) * r;
            const y = eyeY + Math.sin(a + spinAngle) * r;
            if (a === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        });
      } else if (expression === "sleepy") {
        // Sleepy Drooping / Closed Eyelids "— —"
        ctx.strokeStyle = eyeColor;
        ctx.lineWidth = 9;
        ctx.lineCap = "round";

        // Gentle relaxed curved lines
        ctx.beginPath();
        ctx.arc(leftEyeX, eyeY - 2, 24, Math.PI * 0.18, Math.PI * 0.82);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(rightEyeX, eyeY - 2, 24, Math.PI * 0.18, Math.PI * 0.82);
        ctx.stroke();
      } else if (expression === "yawn") {
        // Yawning eyes (sleepy curved arcs) + cute round mouth "O"
        ctx.strokeStyle = eyeColor;
        ctx.lineWidth = 8;
        ctx.lineCap = "round";

        ctx.beginPath();
        ctx.arc(leftEyeX, eyeY, 22, Math.PI * 0.2, Math.PI * 0.8);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(rightEyeX, eyeY, 22, Math.PI * 0.2, Math.PI * 0.8);
        ctx.stroke();

        // Cute little open yawn mouth
        ctx.fillStyle = eyeColor;
        ctx.beginPath();
        ctx.ellipse(256 + gx * 0.5, 156 + gy * 0.5, 11, 14, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (expression === "charging") {
        // Charging: wide glowing eyes vibrating with electric intensity
        const eyeW = 32;
        const eyeH = 46;

        [leftEyeX, rightEyeX].forEach((cx) => {
          // Intense outer glow
          ctx.fillStyle = "rgba(56, 189, 248, 0.65)";
          ctx.beginPath();
          ctx.ellipse(cx, eyeY, eyeW + 12, eyeH + 12, 0, 0, Math.PI * 2);
          ctx.fill();

          // Main core
          ctx.fillStyle = "#e0f2fe";
          ctx.beginPath();
          ctx.ellipse(cx, eyeY, eyeW, eyeH, 0, 0, Math.PI * 2);
          ctx.fill();

          // Bright center
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.ellipse(cx, eyeY, eyeW * 0.55, eyeH * 0.55, 0, 0, Math.PI * 2);
          ctx.fill();
        });
      } else {
        // Normal / Curious / Hover Big Glowing Oval Eyes
        const isCurious = expression === "curious";
        const eyeW = isCurious ? 30 : 26;
        const eyeH = Math.max(3, (isCurious ? 44 : 38) * blinkScale);

        [leftEyeX, rightEyeX].forEach((cx) => {
          // Soft outer glow halo
          if (blinkScale > 0.4) {
            ctx.fillStyle = eyeGlowColor;
            ctx.beginPath();
            ctx.ellipse(cx, eyeY, eyeW + 8, eyeH + 8, 0, 0, Math.PI * 2);
            ctx.fill();
          }

          // Main bright eye core
          ctx.fillStyle = eyeColor;
          ctx.beginPath();
          ctx.ellipse(cx, eyeY, eyeW, eyeH, 0, 0, Math.PI * 2);
          ctx.fill();

          // Cute white specular twinkle reflection on top-right of eye
          if (blinkScale > 0.55) {
            ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
            ctx.beginPath();
            ctx.ellipse(cx + 8, eyeY - eyeH * 0.38, 7, 8, 0, 0, Math.PI * 2);
            ctx.fill();

            // Tiny secondary reflection dot at bottom-left
            ctx.beginPath();
            ctx.arc(cx - 7, eyeY + eyeH * 0.32, 3.5, 0, Math.PI * 2);
            ctx.fill();
          }
        });
      }

      if (faceTextureRef.current) {
        faceTextureRef.current.needsUpdate = true;
      }
    },
    [theme]
  );

  // Initialize Canvas Texture
  const faceTexture = useMemo(() => {
    if (typeof window === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 256;
    faceCanvasRef.current = canvas;

    const texture = new THREE.CanvasTexture(canvas);
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    faceTextureRef.current = texture;

    return texture;
  }, []);

  // Initial draw on mount
  useEffect(() => {
    drawFace("normal", { x: 0, y: 0 }, 1, 0);
  }, [drawFace]);

  // Main animation frame loop
  useFrame((state, delta) => {
    if (!inView || !isDocVisible) return;
    const dt = Math.min(delta, 0.04);
    const p = physics.current;
    const time = state.clock.getElapsedTime();

    let isMoving = false;

    // 1. Determine active gaze target (link hover glance overrides normal cursor)
    const activeGaze = glanceTarget || pointerGaze;
    const targetGazeX = isSleeping ? 0 : THREE.MathUtils.clamp(activeGaze.x, -1, 1);
    const targetGazeY = isSleeping ? 0.3 : THREE.MathUtils.clamp(activeGaze.y, -1, 1);
    p.gazeX += (targetGazeX - p.gazeX) * Math.min(1, dt * 10);
    p.gazeY += (targetGazeY - p.gazeY) * Math.min(1, dt * 10);

    // 2. Blinking Logic
    if (!isSleeping && !isDizzy && !isHappy && !isCharging && !isYawning && !isStretching) {
      blinkTimer.current -= dt;
      if (blinkTimer.current <= 0 && !isBlinking.current) {
        isBlinking.current = true;
        blinkProgress.current = 0;
        blinkTimer.current = 2.4 + Math.random() * 2.6;
      }

      if (isBlinking.current) {
        blinkProgress.current += dt * 9;
        if (blinkProgress.current >= Math.PI) {
          isBlinking.current = false;
          p.blinkScale = 1;
        } else {
          p.blinkScale = Math.max(0.08, 1 - Math.sin(blinkProgress.current) * 0.92);
          isMoving = true;
        }
      }
    } else {
      p.blinkScale = 1;
    }

    // 3. Movement Physics (Squash & Stretch, Floating Bob, Rotations)
    if (reducedMotion) {
      // Reduced motion: no float bob, no dizzy spin, no dance hops
      const targetY = isHappy ? 0.06 : 0;
      p.y += (targetY - p.y) * Math.min(1, dt * 16);
      p.squashY = 1.0;
      p.squashXZ = 1.0;
      p.rotX = 0;
      p.rotY = 0;
      p.antennaAngleZ = 0;
      p.antennaAngleX = 0;
      p.armAngleL = isStretching ? 0.8 : 0;
      p.armAngleR = isWaving ? 0.8 : isStretching ? 0.8 : 0;
    } else {
      let idleBobY = 0;
      let idleTiltX = 0;
      let idleTiltY = 0;

      if (!isPressed && !isDragging && !isDizzy && !isDancing) {
        if (isSleeping) {
          idleBobY = Math.sin(time * 1.3) * 0.015;
          idleTiltX = 0.04;
        } else {
          idleBobY = Math.sin(time * 2.2) * 0.03;
          idleTiltX = Math.sin(time * 1.4) * 0.02 + p.gazeY * 0.06;
          idleTiltY = Math.cos(time * 1.1) * 0.02 + p.gazeX * 0.12;
        }
        isMoving = true;
      }

      let targetY = idleBobY;
      let targetSquashY = 1.0;

      if (isCharging) {
        // Vibrating charge up
        targetY = -0.06 + (Math.random() - 0.5) * 0.02;
        targetSquashY = 0.86;
        isMoving = true;
      } else if (isPressed) {
        // Squashed on press
        targetY = -0.16;
        targetSquashY = 0.72;
      } else if (isHappy) {
        // Pop up on happy poke
        targetY = 0.14 + idleBobY;
        targetSquashY = 1.14;
      } else if (isDancing) {
        // Dance wiggle hop
        p.dancePhase += dt * 14;
        targetY = Math.abs(Math.sin(p.dancePhase)) * 0.12 + idleBobY;
        targetSquashY = 1.0 + Math.sin(p.dancePhase * 2) * 0.08;
        idleTiltY = Math.sin(p.dancePhase) * 0.35;
        idleTiltX = Math.cos(p.dancePhase) * 0.08;
        isMoving = true;
      } else if (isStretching) {
        targetY = 0.08 + idleBobY;
        targetSquashY = 1.12;
      } else if (isHovered && !isSleeping) {
        targetY = 0.08 + idleBobY;
        targetSquashY = 1.05;
      }

      const stiffnessY = isPressed ? 450 : 260;
      const dampingY = isPressed ? 24 : 14;
      const forceY = -stiffnessY * (p.y - targetY) - dampingY * p.vy;
      p.vy += forceY * dt;
      p.y += p.vy * dt;

      p.squashY += (targetSquashY - p.squashY) * Math.min(1, dt * 18);
      p.squashXZ = 1.0 / Math.sqrt(Math.max(0.4, p.squashY));

      // Rotation Physics (Drag + Inertia + Dizzy Spin)
      if (isDizzy) {
        p.rotY += dt * 9.5;
        p.rotX = Math.sin(time * 12) * 0.22;
        p.antennaAngleZ = Math.sin(time * 16) * 0.45;
        p.armAngleL = Math.sin(time * 14) * 0.5;
        p.armAngleR = -Math.sin(time * 14) * 0.5;
        isMoving = true;
      } else if (isDragging) {
        const dX = dragDelta.dx - lastDragPos.current.dx;
        const dY = dragDelta.dy - lastDragPos.current.dy;
        lastDragPos.current = { ...dragDelta };

        p.rotY += dX * 0.015;
        p.rotX += dY * 0.015;
        p.rotX = THREE.MathUtils.clamp(p.rotX, -0.4, 0.4);

        p.vRotY = (dX / Math.max(0.001, dt)) * 0.007;
        p.vRotX = (dY / Math.max(0.001, dt)) * 0.007;
        isMoving = true;
      } else {
        lastDragPos.current = { dx: 0, dy: 0 };
        p.vRotX *= Math.pow(0.88, dt * 60);
        p.vRotY *= Math.pow(0.88, dt * 60);

        const targetRotX = idleTiltX;
        const targetRotY = idleTiltY + p.spinRotY;

        // Ease spinRotY if jump spin happened
        p.spinRotY += (0 - p.spinRotY) * Math.min(1, dt * 8);

        const rotStiffness = 65;
        const rotDamping = 11;
        const torqueX = -rotStiffness * (p.rotX - targetRotX) - rotDamping * p.vRotX;
        const torqueY = -rotStiffness * (p.rotY - targetRotY) - rotDamping * p.vRotY;

        p.vRotX += torqueX * dt;
        p.vRotY += torqueY * dt;

        p.rotX += p.vRotX * dt;
        p.rotY += p.vRotY * dt;

        // One-time 360 spin on pat (disabled if reduced-motion)
        if (patSpinRemaining.current > 0) {
          patSpinRemaining.current -= dt;
          p.rotY += (Math.PI * 2 / 0.55) * dt;
          p.vRotY = 0;
          if (patSpinRemaining.current <= 0) {
            p.rotY = p.rotY % (Math.PI * 2);
            patSpinRemaining.current = 0;
          }
          isMoving = true;
        }

        // Antenna Spring Wobble
        const targetAntennaZ =
          -p.vy * 0.55 +
          (isHovered ? Math.sin(time * 18) * 0.14 : 0) +
          (isDancing ? Math.sin(p.dancePhase * 2) * 0.3 : 0);
        const targetAntennaX = -p.vRotX * 0.25;

        const antStiffness = 180;
        const antDamping = 8.5;
        p.vAntennaAngleZ +=
          (-antStiffness * (p.antennaAngleZ - targetAntennaZ) -
            antDamping * p.vAntennaAngleZ) *
          dt;
        p.antennaAngleZ += p.vAntennaAngleZ * dt;

        p.vAntennaAngleX +=
          (-antStiffness * (p.antennaAngleX - targetAntennaX) -
            antDamping * p.vAntennaAngleX) *
          dt;
        p.antennaAngleX += p.vAntennaAngleX * dt;

        // Arm Angles
        if (isWaving) {
          // Right arm waves enthusiastically!
          p.armAngleR = 0.5 + Math.sin(time * 16) * 0.7;
          p.armAngleL = 0.05;
          isMoving = true;
        } else if (isStretching) {
          p.armAngleL += (0.9 - p.armAngleL) * Math.min(1, dt * 12);
          p.armAngleR += (0.9 - p.armAngleR) * Math.min(1, dt * 12);
          isMoving = true;
        } else if (isDancing) {
          p.armAngleL = Math.sin(p.dancePhase) * 0.6;
          p.armAngleR = -Math.sin(p.dancePhase) * 0.6;
          isMoving = true;
        } else {
          const targetArmAngle = isHappy ? 0.7 : isSleeping ? -0.1 : 0.05;
          p.armAngleL += (targetArmAngle - p.armAngleL) * Math.min(1, dt * 14);
          p.armAngleR += (targetArmAngle - p.armAngleR) * Math.min(1, dt * 14);
        }

        if (
          Math.abs(p.vy) > 0.001 ||
          Math.abs(p.vRotX) > 0.001 ||
          Math.abs(p.vRotY) > 0.001 ||
          Math.abs(p.antennaAngleZ) > 0.001 ||
          Math.abs(p.spinRotY) > 0.001
        ) {
          isMoving = true;
        }
      }
    }

    // Apply transforms to whole group
    if (groupRef.current) {
      groupRef.current.position.y = -0.12 + p.y;
      groupRef.current.rotation.x = p.rotX;
      groupRef.current.rotation.y = p.rotY;
    }

    // Body squash and stretch
    if (bodyRef.current) {
      bodyRef.current.scale.set(p.squashXZ, p.squashY, p.squashXZ);
    }

    // Antenna wobble
    if (antennaStalkRef.current) {
      antennaStalkRef.current.rotation.z = p.antennaAngleZ;
      antennaStalkRef.current.rotation.x = p.antennaAngleX;
    }

    // Arms
    if (leftArmRef.current && rightArmRef.current) {
      leftArmRef.current.rotation.z = 0.35 + p.armAngleL;
      rightArmRef.current.rotation.z = -0.35 - p.armAngleR;
    }

    // Determine facial expression
    let expression: FaceExpression = "normal";
    if (isCharging) expression = "charging";
    else if (isDizzy) expression = "dizzy";
    else if (isHappy || isWaving || isDancing) expression = "happy";
    else if (isYawning) expression = "yawn";
    else if (isStretching) expression = "stretch";
    else if (isSleeping) expression = "sleepy";
    else if (glanceTarget || isHovered) expression = "curious";

    // Redraw face canvas
    drawFace(expression, { x: p.gazeX, y: p.gazeY }, p.blinkScale, time);

    if (
      isMoving ||
      isHovered ||
      isPressed ||
      isCharging ||
      isDragging ||
      isDizzy ||
      isHappy ||
      isWaving ||
      isDancing ||
      isSleeping ||
      hearts.length > 0 ||
      sleepZs.length > 0
    ) {
      invalidate();
    }
  });

  const isDark = theme === "dark";

  return (
    <group ref={groupRef} position={[0, -0.12, 0]}>
      {/* Contact Ground Shadow */}
      <ContactShadows
        position={[0, -0.76, 0]}
        opacity={isDark ? 0.65 : 0.24}
        scale={3.2}
        blur={2.4}
        far={2}
        color={isDark ? "#000000" : "#78716c"}
      />

      {/* Main Chubby Squashed Robot Body */}
      <group ref={bodyRef}>
        {/* Soft vinyl clay bean body primitive (head ~65% of total height, squashed sphere wider than tall) */}
        <mesh castShadow receiveShadow position={[0, 0, 0]} scale={[1.16, 0.98, 0.9]}>
          <sphereGeometry args={[0.78, 48, 48]} />
          <meshPhysicalMaterial
            color={isDark ? "#1e222a" : "#faf7f0"}
            roughness={0.58}
            metalness={0.02}
            clearcoat={0.0}
          />
        </mesh>

        {/* Lower body base blend (subtle rounded capsule) */}
        <mesh castShadow receiveShadow position={[0, -0.28, 0]} scale={[1.04, 0.72, 0.88]}>
          <sphereGeometry args={[0.62, 40, 40]} />
          <meshPhysicalMaterial
            color={isDark ? "#1e222a" : "#faf7f0"}
            roughness={0.58}
            metalness={0.02}
            clearcoat={0.0}
          />
        </mesh>

        {/* Glossy Dark Rounded Visor covering the front */}
        <group position={[0, 0.04, 0.66]}>
          <RoundedBox
            args={[1.16, 0.64, 0.22]}
            radius={0.24}
            smoothness={16}
            castShadow
          >
            <meshPhysicalMaterial
              color="#08090d"
              roughness={0.1}
              metalness={0.12}
              clearcoat={1.0}
              clearcoatRoughness={0.06}
            />
          </RoundedBox>

          {/* Dynamic 2D Canvas Screen Texture (The expressive glowing face) */}
          {faceTexture && (
            <mesh position={[0, 0, 0.113]}>
              <planeGeometry args={[1.12, 0.60]} />
              <meshBasicMaterial
                map={faceTexture}
                transparent
                toneMapped={false}
                opacity={0.98}
                depthWrite={false}
              />
            </mesh>
          )}
        </group>

        {/* Antenna System (Collar + Spring-Wobbling Stalk + Glowing Ball) */}
        <group position={[0, 0.76, 0]}>
          {/* Base Collar */}
          <mesh position={[0, 0.02, 0]}>
            <cylinderGeometry args={[0.065, 0.09, 0.05, 32]} />
            <meshPhysicalMaterial
              color={isDark ? "#171920" : "#d8d3c7"}
              roughness={0.5}
              metalness={0.05}
            />
          </mesh>

          {/* Wobbling Stalk & Glowing Ball */}
          <group ref={antennaStalkRef}>
            <mesh position={[0, 0.13, 0]}>
              <cylinderGeometry args={[0.018, 0.022, 0.24, 32]} />
              <meshPhysicalMaterial
                color={isDark ? "#333844" : "#b0aba0"}
                roughness={0.4}
                metalness={0.1}
              />
            </mesh>

            {/* Glowing Ball on Top */}
            <mesh ref={antennaBallMeshRef} position={[0, 0.28, 0]} castShadow>
              <sphereGeometry args={[0.095, 36, 36]} />
              <meshPhysicalMaterial
                color="#38bdf8"
                emissive="#0284c7"
                emissiveIntensity={isCharging ? 3.0 : isDark ? 0.9 : 0.7}
                roughness={0.2}
                metalness={0.05}
              />
            </mesh>
          </group>
        </group>

        {/* Two Tiny Rounded Stub Arms */}
        <group ref={leftArmRef} position={[-0.88, -0.06, 0]}>
          <mesh castShadow position={[0, -0.06, 0]}>
            <capsuleGeometry args={[0.1, 0.16, 24, 24]} />
            <meshPhysicalMaterial
              color={isDark ? "#1e2128" : "#f4efe6"}
              roughness={0.6}
              metalness={0.02}
            />
          </mesh>
        </group>

        <group ref={rightArmRef} position={[0.88, -0.06, 0]}>
          <mesh castShadow position={[0, -0.06, 0]}>
            <capsuleGeometry args={[0.1, 0.16, 24, 24]} />
            <meshPhysicalMaterial
              color={isDark ? "#1e2128" : "#f4efe6"}
              roughness={0.6}
              metalness={0.02}
            />
          </mesh>
        </group>

        {/* Two Tiny Round Feet */}
        <mesh
          castShadow
          position={[-0.32, -0.66, 0.16]}
          scale={[1.1, 0.72, 1.4]}
        >
          <sphereGeometry args={[0.16, 32, 32]} />
          <meshPhysicalMaterial
            color={isDark ? "#1c1f26" : "#ebe5da"}
            roughness={0.6}
            metalness={0.02}
          />
        </mesh>

        <mesh
          castShadow
          position={[0.32, -0.66, 0.16]}
          scale={[1.1, 0.72, 1.4]}
        >
          <sphereGeometry args={[0.16, 32, 32]} />
          <meshPhysicalMaterial
            color={isDark ? "#1c1f26" : "#ebe5da"}
            roughness={0.6}
            metalness={0.02}
          />
        </mesh>
      </group>

      {/* Floating 3D Hearts on Poke */}
      {hearts.map((h) => (
        <group key={h.id} position={[h.x, h.y, h.z]} scale={h.scale}>
          <mesh>
            <sphereGeometry args={[0.075, 20, 20]} />
            <meshPhysicalMaterial
              color="#fb7185"
              emissive="#f43f5e"
              emissiveIntensity={0.9}
              transparent
              opacity={h.opacity}
              roughness={0.3}
            />
          </mesh>
        </group>
      ))}

      {/* Floating 3D Sleep "Z" Particles */}
      {sleepZs.map((z) => (
        <group key={z.id} position={[z.x, z.y, z.z]} scale={z.scale}>
          <mesh>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshPhysicalMaterial
              color="#38bdf8"
              emissive="#0284c7"
              emissiveIntensity={0.7}
              transparent
              opacity={z.opacity}
              roughness={0.3}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export default function ByteScene({
  initialPatCount,
}: {
  initialPatCount?: number | null;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  const [inView, setInView] = useState(true);
  const [isDocVisible, setIsDocVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  // States
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isCharging, setIsCharging] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragDelta, setDragDelta] = useState({ dx: 0, dy: 0 });
  const [pointerGaze, setPointerGaze] = useState({ x: 0, y: 0 });
  const [glanceTarget, setGlanceTarget] = useState<{ x: number; y: number } | null>(null);

  // Global Pat Counter state
  const [patCount, setPatCount] = useState<number | null>(initialPatCount ?? null);
  const [patSpinTrigger, setPatSpinTrigger] = useState(0);
  const [floatingPats, setFloatingPats] = useState<{ id: number; x: number }[]>([]);
  const lastCountedPat = useRef(0);

  useEffect(() => {
    if (initialPatCount !== undefined && initialPatCount !== null) {
      setPatCount(initialPatCount);
    }
  }, [initialPatCount]);

  useEffect(() => {
    if (patCount === null) {
      fetch("/api/pats")
        .then((res) => res.json())
        .then((data) => {
          if (typeof data.count === "number") {
            setPatCount(data.count);
          }
        })
        .catch(() => {});
    }
  }, [patCount]);

  // Mood / Reactions
  const [isHappy, setIsHappy] = useState(false);
  const [isDizzy, setIsDizzy] = useState(false);
  const [isSleeping, setIsSleeping] = useState(false);
  const [isWaving, setIsWaving] = useState(false);
  const [isDancing, setIsDancing] = useState(false);
  const [isYawning, setIsYawning] = useState(false);
  const [isStretching, setIsStretching] = useState(false);
  const [speechBubble, setSpeechBubble] = useState<string | null>(null);

  // Floating particles
  const [hearts, setHearts] = useState<HeartParticle[]>([]);
  const [sleepZs, setSleepZs] = useState<SleepZParticle[]>([]);

  // Interaction tracking refs
  const dragStart = useRef({ x: 0, y: 0, time: 0, hasThreshold: false });
  const lastDragTime = useRef(0);
  const dragVelocityX = useRef(0);
  const recentClicks = useRef<number[]>([]);
  const lastInteractionTime = useRef(Date.now());
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const dizzyTimeout = useRef<NodeJS.Timeout | null>(null);
  const happyTimeout = useRef<NodeJS.Timeout | null>(null);
  const waveTimeout = useRef<NodeJS.Timeout | null>(null);
  const speechTimeout = useRef<NodeJS.Timeout | null>(null);
  const danceTimeout = useRef<NodeJS.Timeout | null>(null);
  const moodReactionTimeout = useRef<NodeJS.Timeout | null>(null);

  // Check prefers-reduced-motion
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mql.matches);
    const handleMotionChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mql.addEventListener("change", handleMotionChange);
    return () => mql.removeEventListener("change", handleMotionChange);
  }, []);

  // Monitor document visibility & intersection
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

    const handleVisibility = () => {
      setIsDocVisible(document.visibilityState === "visible");
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  // Reset sleep state on activity
  const wakeUp = useCallback(() => {
    lastInteractionTime.current = Date.now();
    if (isSleeping) {
      setIsSleeping(false);
    }
  }, [isSleeping]);

  // Trigger pat (single click/tap or keyboard Enter/Space)
  const triggerPat = useCallback(() => {
    wakeUp();
    setIsHappy(true);
    if (happyTimeout.current) clearTimeout(happyTimeout.current);
    happyTimeout.current = setTimeout(() => {
      setIsHappy(false);
    }, 1200);

    // Spin Byte once (ByteCharacter ignores if reducedMotion is true)
    setPatSpinTrigger((prev) => prev + 1);

    // Small "+1" floats up from Byte
    const id = Date.now() + Math.random();
    const x = (Math.random() - 0.5) * 36;
    setFloatingPats((prev) => [...prev, { id, x }]);
    setTimeout(() => {
      setFloatingPats((prev) => prev.filter((item) => item.id !== id));
    }, 850);

    // Client-side cooldown of 400ms between counted pats
    const now = Date.now();
    if (now - lastCountedPat.current >= 400) {
      lastCountedPat.current = now;

      // Optimistic count increment
      setPatCount((prev) => (prev ?? 0) + 1);

      // Trigger analytics
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("portfolio-analytics", { detail: { name: "byte_pat" } })
        );
      }

      fetch("/api/pats", { method: "POST" })
        .then((res) => {
          if (res.ok) return res.json();
          return null;
        })
        .then((data) => {
          if (data && typeof data.count === "number") {
            setPatCount(data.count);
          }
        })
        .catch(() => {});
    }

    // Spawn floating hearts
    const newHearts: HeartParticle[] = [
      {
        id: now + 1,
        x: -0.25 + Math.random() * 0.08,
        y: 0.7,
        z: 0.3,
        vx: -0.15,
        vy: 1.3,
        scale: 0.8,
        opacity: 1,
        life: 0,
        maxLife: 1.1,
      },
      {
        id: now + 2,
        x: (Math.random() - 0.5) * 0.08,
        y: 0.9,
        z: 0.4,
        vx: 0.05,
        vy: 1.5,
        scale: 1.1,
        opacity: 1,
        life: 0,
        maxLife: 1.2,
      },
      {
        id: now + 3,
        x: 0.25 + Math.random() * 0.08,
        y: 0.75,
        z: 0.3,
        vx: 0.18,
        vy: 1.2,
        scale: 0.85,
        opacity: 1,
        life: 0,
        maxLife: 1.0,
      },
    ];
    setHearts((prev) => [...prev, ...newHearts]);
  }, [wakeUp]);

  // Trigger dizzy (rapid pokes 4+ or fast fling)
  const triggerDizzy = useCallback(() => {
    wakeUp();
    setIsDizzy(true);
    setIsHappy(false);
    setIsWaving(false);
    setIsDancing(false);
    if (dizzyTimeout.current) clearTimeout(dizzyTimeout.current);
    dizzyTimeout.current = setTimeout(() => {
      setIsDizzy(false);
    }, 2000);
  }, [wakeUp]);

  // Trigger wave (double click or D key)
  const triggerWave = useCallback(() => {
    wakeUp();
    setIsWaving(true);
    setSpeechBubble("hi!");
    if (speechTimeout.current) clearTimeout(speechTimeout.current);
    speechTimeout.current = setTimeout(() => {
      setSpeechBubble(null);
    }, 1500);

    if (waveTimeout.current) clearTimeout(waveTimeout.current);
    waveTimeout.current = setTimeout(() => {
      setIsWaving(false);
    }, 1500);
  }, [wakeUp]);

  // Trigger happy dance (typing "byte")
  const triggerDance = useCallback(() => {
    wakeUp();
    setIsDancing(true);
    setSpeechBubble("yay!");
    if (speechTimeout.current) clearTimeout(speechTimeout.current);
    speechTimeout.current = setTimeout(() => {
      setSpeechBubble(null);
    }, 1600);

    if (danceTimeout.current) clearTimeout(danceTimeout.current);
    danceTimeout.current = setTimeout(() => {
      setIsDancing(false);
    }, 2500);
  }, [wakeUp]);

  // Theme toggle reactions: Yawn (dark) and Stretch (light)
  const prevTheme = useRef(theme);
  useEffect(() => {
    if (prevTheme.current !== theme) {
      wakeUp();
      if (theme === "dark") {
        setIsYawning(true);
        if (moodReactionTimeout.current) clearTimeout(moodReactionTimeout.current);
        moodReactionTimeout.current = setTimeout(() => {
          setIsYawning(false);
        }, 1600);
      } else {
        setIsStretching(true);
        if (moodReactionTimeout.current) clearTimeout(moodReactionTimeout.current);
        moodReactionTimeout.current = setTimeout(() => {
          setIsStretching(false);
        }, 1600);
      }
      prevTheme.current = theme;
    }
  }, [theme, wakeUp]);

  // Easter egg: type "byte" anywhere on page
  useEffect(() => {
    let keyBuffer = "";
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === "INPUT" ||
          activeEl.tagName === "TEXTAREA" ||
          (activeEl as HTMLElement).isContentEditable)
      ) {
        return;
      }
      keyBuffer += e.key.toLowerCase();
      if (keyBuffer.length > 8) keyBuffer = keyBuffer.slice(-8);
      if (keyBuffer.endsWith("byte")) {
        triggerDance();
        keyBuffer = "";
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [triggerDance]);

  // Link/button hover glance: Byte glances toward hovered link with curious eyes
  useEffect(() => {
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const clickable = target.closest("a, button, [role='button']");
      if (clickable && containerRef.current && !containerRef.current.contains(clickable)) {
        const rect = clickable.getBoundingClientRect();
        const byteRect = containerRef.current.getBoundingClientRect();
        const bCx = byteRect.left + byteRect.width / 2;
        const bCy = byteRect.top + byteRect.height / 2;
        const cCx = rect.left + rect.width / 2;
        const cCy = rect.top + rect.height / 2;
        const dx = THREE.MathUtils.clamp((cCx - bCx) / (window.innerWidth / 2), -1, 1);
        const dy = THREE.MathUtils.clamp((cCy - bCy) / (window.innerHeight / 2), -1, 1);
        setGlanceTarget({ x: dx, y: dy });
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest("a, button, [role='button']")) {
        setGlanceTarget(null);
      }
    };

    window.addEventListener("mouseover", handleMouseOver, { passive: true });
    window.addEventListener("mouseout", handleMouseOut, { passive: true });
    return () => {
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mouseout", handleMouseOut);
    };
  }, []);

  // Particle physics loop
  useEffect(() => {
    let animId: number;
    let lastT = performance.now();

    const loop = (t: number) => {
      const dt = Math.min(0.04, (t - lastT) / 1000);
      lastT = t;

      setHearts((prev) =>
        prev
          .map((h) => ({
            ...h,
            x: h.x + h.vx * dt,
            y: h.y + h.vy * dt,
            scale: h.scale * (1 + dt * 0.4),
            opacity: Math.max(0, 1 - h.life / h.maxLife),
            life: h.life + dt,
          }))
          .filter((h) => h.life < h.maxLife)
      );

      setSleepZs((prev) =>
        prev
          .map((z) => ({
            ...z,
            x: z.x + z.vx * dt + Math.sin(z.life * 4) * 0.005,
            y: z.y + z.vy * dt,
            scale: z.scale * (1 + dt * 0.2),
            opacity: Math.max(0, 1 - z.life / z.maxLife),
            life: z.life + dt,
          }))
          .filter((z) => z.life < z.maxLife)
      );

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Sleep & time-aware inactivity timer
  useEffect(() => {
    const handleSleepEvent = () => setIsSleeping(true);
    window.addEventListener("byte-sleep", handleSleepEvent);

    const interval = setInterval(() => {
      const now = new Date();
      const hour = now.getHours();
      // Time-aware: late night between 11 PM and 6 AM falls asleep faster (5s vs 12s)
      const isNightTime = hour >= 23 || hour < 6;
      const sleepThreshold = isNightTime ? 5 : 12;

      const idleSeconds = (Date.now() - lastInteractionTime.current) / 1000;
      if (idleSeconds >= sleepThreshold && !isSleeping && !isDizzy && !isPressed) {
        setIsSleeping(true);
      }

      if (isSleeping) {
        const timestamp = Date.now();
        setSleepZs((prev) => [
          ...prev.slice(-3),
          {
            id: timestamp,
            x: 0.1 + (Math.random() - 0.5) * 0.15,
            y: 0.95,
            z: 0.1,
            vx: 0.12,
            vy: 0.45,
            scale: 0.7,
            opacity: 0.85,
            life: 0,
            maxLife: 2.2,
          },
        ]);
      }
    }, 1200);

    return () => {
      clearInterval(interval);
      window.removeEventListener("byte-sleep", handleSleepEvent);
    };
  }, [isSleeping, isDizzy, isPressed]);

  // Global cursor gaze tracking (tracks cursor anywhere on the page smoothly)
  useEffect(() => {
    const handleGlobalPointerMove = (e: PointerEvent) => {
      wakeUp();

      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const nx = THREE.MathUtils.clamp((e.clientX - cx) / (window.innerWidth / 2), -1, 1);
        const ny = THREE.MathUtils.clamp((e.clientY - cy) / (window.innerHeight / 2), -1, 1);
        setPointerGaze({ x: nx, y: ny });
      }
    };

    window.addEventListener("pointermove", handleGlobalPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handleGlobalPointerMove);
  }, [wakeUp]);

  // Pointer event handlers: Tap, Double-tap, Long-press (charge), and Drag (rotate)
  const handlePointerDown = (e: React.PointerEvent) => {
    wakeUp();
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      time: Date.now(),
      hasThreshold: false,
    };
    lastDragTime.current = Date.now();
    dragVelocityX.current = 0;
    setIsPressed(true);

    // Setup 800ms long press charging timer
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
    longPressTimer.current = setTimeout(() => {
      if (!dragStart.current.hasThreshold) {
        setIsCharging(true);
      }
    }, 800);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (e.buttons === 1) {
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      const dist = Math.hypot(dx, dy);

      if (!dragStart.current.hasThreshold && dist > 8) {
        dragStart.current.hasThreshold = true;
        setIsDragging(true);
        if (longPressTimer.current) {
          clearTimeout(longPressTimer.current);
          longPressTimer.current = null;
        }
        setIsCharging(false);
        try {
          e.currentTarget.setPointerCapture(e.pointerId);
        } catch {
          // ignore
        }
      }

      if (dragStart.current.hasThreshold) {
        const now = Date.now();
        const dt = Math.max(1, now - lastDragTime.current);
        dragVelocityX.current = (e.movementX / dt) * 1000;
        lastDragTime.current = now;
        setDragDelta({ dx, dy });
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }

    setIsPressed(false);

    if (isCharging) {
      // Release from charge -> Happy Jump with full 360 spin!
      setIsCharging(false);
      triggerPat();
      setSpeechBubble("yay!");
      if (speechTimeout.current) clearTimeout(speechTimeout.current);
      speechTimeout.current = setTimeout(() => {
        setSpeechBubble(null);
      }, 1500);
      return;
    }

    if (isDragging) {
      setIsDragging(false);
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }

      // Check fast fling velocity
      if (Math.abs(dragVelocityX.current) > 750) {
        triggerDizzy();
      }
    } else {
      // Tap/Click handling -> Pat Byte
      const now = Date.now();
      const timeSinceLastClick = now - (recentClicks.current[recentClicks.current.length - 1] || 0);

      if (timeSinceLastClick < 350) {
        // Double-tap/double-click: wave arm and speech bubble "hi!"
        triggerWave();
        recentClicks.current = [];
      } else {
        recentClicks.current = [...recentClicks.current.filter((t) => now - t < 1500), now];
        // 4+ rapid pokes -> Dizzy!
        if (recentClicks.current.length >= 4) {
          triggerDizzy();
          recentClicks.current = [];
        } else {
          triggerPat();
        }
      }
    }
    setDragDelta({ dx: 0, dy: 0 });
  };

  const handlePointerCancel = () => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
    setIsPressed(false);
    setIsCharging(false);
    setIsDragging(false);
    setDragDelta({ dx: 0, dy: 0 });
  };

  // Keyboard accessibility: Enter or Space = Pat Byte, D = wave
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setIsPressed(true);
        triggerPat();
        setTimeout(() => setIsPressed(false), 150);
      } else if (e.key === "d" || e.key === "D") {
        e.preventDefault();
        triggerWave();
      }
    },
    [triggerPat, triggerWave]
  );

  // Compute captions according to state
  let moodCaption = "say hi 👋";
  let statusLabel = "active";

  if (isDizzy) {
    moodCaption = "whoa…";
    statusLabel = "dizzy";
  } else if (isSleeping) {
    moodCaption = "zzz…";
    statusLabel = "sleepy";
  } else if (isWaving) {
    moodCaption = "hi!";
  } else if (isCharging) {
    moodCaption = "charging…";
  } else if (isDancing) {
    moodCaption = "yay!";
  } else if (isHappy) {
    moodCaption = "hehe";
  } else if (isYawning) {
    moodCaption = "yawn…";
  } else if (isStretching) {
    moodCaption = "stretch!";
  } else if (glanceTarget) {
    moodCaption = "curious…";
  }

  const isDark = theme === "dark";

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      role="button"
      aria-label="Pat Byte"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onPointerEnter={() => {
        setIsHovered(true);
        wakeUp();
      }}
      onPointerLeave={() => {
        setIsHovered(false);
      }}
      onKeyDown={handleKeyDown}
      style={{ touchAction: "pan-y" }}
      className="relative w-full h-full min-h-[190px] sm:min-h-[210px] flex items-center justify-center cursor-pointer select-none overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:focus-visible:ring-white/40 rounded-[24px]"
    >
      {/* Top Header Labels (Outside 3D Canvas) */}
      <div className="absolute top-3.5 left-4 right-4 flex items-center justify-between pointer-events-none z-20 gap-2">
        <span className="text-[13px] font-medium text-[var(--text-secondary)] shrink-0">
          Byte
        </span>
        <span className="text-[12px] sm:text-[13px] text-[var(--text-tertiary)] truncate text-right">
          <span className="hidden xl:inline">desk </span>companion
        </span>
      </div>

      {/* Floating +1 Particles on Pat */}
      {floatingPats.map((p) => (
        <span
          key={p.id}
          className="pointer-events-none absolute text-[14px] sm:text-[15px] font-bold text-sky-400 select-none animate-pat-float z-30"
          style={{ left: `calc(50% + ${p.x}px)`, top: "35%" }}
        >
          +1
        </span>
      ))}

      {/* Floating Speech Bubble */}
      {speechBubble && (
        <div
          role="status"
          aria-live="polite"
          className="absolute top-12 z-30 px-3 py-1 rounded-full bg-[var(--surface-tile-elevated)] border border-[var(--border-subtle)] shadow-sm text-xs font-medium text-[var(--text-primary)] pointer-events-none motion-safe:transition-opacity motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-out motion-reduce:transition-none"
        >
          {speechBubble}
        </div>
      )}

      {/* 3D Canvas Area: strictly inset between top and bottom label bands */}
      <div className="absolute inset-x-0 top-11 bottom-9">
        <Canvas
          camera={{ position: [0, 0.05, 3.8], fov: 40 }}
          dpr={[1, 1.5]}
          frameloop={isDocVisible && inView ? "demand" : "never"}
          gl={{
            antialias: true,
            powerPreference: "high-performance",
            alpha: true,
          }}
          style={{ width: "100%", height: "100%", background: "transparent" }}
        >
          <ResponsiveCamera margin={1.28} />

          {/* Theme-aware soft studio lighting */}
          {isDark ? (
            <>
              <ambientLight intensity={0.8} color="#64748b" />
              <directionalLight position={[2.5, 4, 3]} intensity={1.5} color="#f8fafc" />
              <directionalLight position={[-3, 2.5, -2.5]} intensity={2.8} color="#38bdf8" />
              <directionalLight position={[2, 1, -2.5]} intensity={0.8} color="#818cf8" />
            </>
          ) : (
            <>
              <ambientLight intensity={1.3} color="#ffffff" />
              <directionalLight position={[3, 5, 4]} intensity={1.5} color="#fffcf5" />
              <directionalLight position={[-3, 2, 2]} intensity={0.7} color="#f8fafc" />
              <directionalLight position={[0, -2, 2]} intensity={0.3} color="#ffffff" />
            </>
          )}

          <ByteCharacter
            isHovered={isHovered}
            isPressed={isPressed}
            isCharging={isCharging}
            isDragging={isDragging}
            dragDelta={dragDelta}
            pointerGaze={pointerGaze}
            glanceTarget={glanceTarget}
            reducedMotion={reducedMotion}
            inView={inView}
            isDocVisible={isDocVisible}
            theme={theme}
            isSleeping={isSleeping}
            isDizzy={isDizzy}
            isHappy={isHappy}
            isWaving={isWaving}
            isDancing={isDancing}
            isYawning={isYawning}
            isStretching={isStretching}
            hearts={hearts}
            sleepZs={sleepZs}
            patSpinTrigger={patSpinTrigger}
          />
        </Canvas>
      </div>

      {/* Bottom Footer Labels (Outside 3D Canvas) */}
      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between pointer-events-none z-20 text-[12.5px] sm:text-[13px] text-[var(--text-tertiary)] gap-2">
        <span className="truncate">pat me</span>
        <span className="shrink-0 text-right tabular-nums">
          {patCount !== null ? `${patCount.toLocaleString()} pats` : "…"}
        </span>
      </div>
    </div>
  );
}
