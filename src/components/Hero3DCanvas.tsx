'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { OrbitControls } from '@react-three/drei';

function AnimatedBottleCap() {
  const capRef = useRef<THREE.Group>(null);
  
  // Helix curve for bottle neck threads
  const helixCurve = useMemo(() => {
    const points = [];
    const turns = 2.5;
    const height = 0.35;
    const radius = 0.88;
    const segments = 100;
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const angle = t * Math.PI * 2 * turns;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = (t - 0.5) * height - 0.1; // centered around -0.1
      points.push(new THREE.Vector3(x, y, z));
    }
    return new THREE.CatmullRomCurve3(points);
  }, []);

  // Rib geometry calculation (60 outer grip ribs for fine realism)
  const ribs = useMemo(() => {
    const ribList = [];
    const count = 60;
    const radius = 0.985;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      ribList.push({ x, z, angle });
    }
    return ribList;
  }, []);

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    
    // Cycle duration: 8 seconds total
    const cycleTime = elapsed % 8; 
    
    let targetY = 0.0; // Sealed cap position
    let targetRotation = 0;
    
    if (cycleTime < 1.5) {
      // Phase 0: Sealed (0s to 1.5s)
      targetY = 0.0;
      targetRotation = 0;
    } else if (cycleTime < 3.5) {
      // Phase 1: Unscrewing/Opening (1.5s to 3.5s)
      const t = (cycleTime - 1.5) / 2.0; // 0 to 1
      const ease = t * t * (3 - 2 * t); // Smooth step
      targetY = ease * 0.9; // Lift up by 0.9 units
      targetRotation = -ease * Math.PI * 3.5; // Rotate 1.75 turns counter-clockwise
    } else if (cycleTime < 5.5) {
      // Phase 2: Open/Hovering (3.5s to 5.5s)
      const hoverT = cycleTime - 3.5;
      targetY = 0.9 + Math.sin(hoverT * Math.PI) * 0.06; // Gentle floating bounce
      targetRotation = -Math.PI * 3.5 - hoverT * 0.15; // Continue slowly rotating
    } else if (cycleTime < 7.5) {
      // Phase 3: Screwing/Closing (5.5s to 7.5s)
      const t = (cycleTime - 5.5) / 2.0; // 0 to 1
      const ease = t * t * (3 - 2 * t);
      targetY = 0.9 - ease * 0.9; // Move down
      targetRotation = -Math.PI * 3.5 - 2.0 * 0.15 + ease * (Math.PI * 3.5 + 2.0 * 0.15); // Rotate back to 0
    } else {
      // Phase 4: Sealed/Pause (7.5s to 8s)
      targetY = 0.0;
      targetRotation = 0;
    }
    
    if (capRef.current) {
      capRef.current.position.y = targetY;
      capRef.current.rotation.y = targetRotation;
      
      // Add subtle tilt when floating/unscrewed to make it feel natural and 3D
      if (cycleTime >= 1.5 && cycleTime < 7.5) {
        let tiltProgress = 0;
        if (cycleTime < 3.5) {
          tiltProgress = (cycleTime - 1.5) / 2.0;
        } else if (cycleTime < 5.5) {
          tiltProgress = 1.0;
        } else {
          tiltProgress = 1.0 - (cycleTime - 5.5) / 2.0;
        }
        capRef.current.rotation.x = Math.sin(elapsed * 1.5) * 0.08 * tiltProgress;
        capRef.current.rotation.z = Math.cos(elapsed * 1.5) * 0.05 * tiltProgress;
      } else {
        capRef.current.rotation.x = 0;
        capRef.current.rotation.z = 0;
      }
    }
  });

  return (
    <group position={[0, -0.2, 0]}>
      {/* 1. BOTTLE NECK ASSEMBLY (Static) */}
      
      {/* Clear Transparent Bottle Neck */}
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[0.87, 0.87, 1.0, 32, 1, true]} />
        <meshPhysicalMaterial
          color="#e0f4fd"
          transmission={0.9}
          opacity={0.8}
          transparent
          roughness={0.1}
          thickness={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Tapering Bottle Shoulder */}
      <mesh position={[0, -1.15, 0]}>
        <cylinderGeometry args={[0.87, 1.35, 0.3, 32, 1, true]} />
        <meshPhysicalMaterial
          color="#e0f4fd"
          transmission={0.9}
          opacity={0.8}
          transparent
          roughness={0.1}
          thickness={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Screw Thread 1 on Neck */}
      <mesh position={[0, -0.4, 0]}>
        <tubeGeometry args={[helixCurve, 64, 0.035, 8, false]} />
        <meshPhysicalMaterial
          color="#e0f4fd"
          transmission={0.9}
          opacity={0.8}
          transparent
          roughness={0.1}
          thickness={0.8}
        />
      </mesh>

      {/* Neck Collar Ring (Below thread, where tamper-evident ring catches) */}
      <mesh position={[0, -0.65, 0]}>
        <torusGeometry args={[0.92, 0.025, 8, 32]} />
        <meshPhysicalMaterial
          color="#e0f4fd"
          transmission={0.95}
          opacity={0.8}
          transparent
          roughness={0.1}
        />
      </mesh>

      {/* 2. TAMPER-EVIDENT COLLAR RING (Stays on neck after break) */}
      <mesh position={[0, -0.12, 0]}>
        <cylinderGeometry args={[0.985, 0.985, 0.08, 48]} />
        <meshPhysicalMaterial
          color="#ffffff"
          roughness={0.25}
          metalness={0.05}
          clearcoat={0.6}
        />
      </mesh>

      {/* Broken Bridge Bits on the static Collar Ring */}
      {Array.from({ length: 8 }).map((_, idx) => {
        const angle = (idx / 8) * Math.PI * 2;
        const x = Math.cos(angle) * 0.97;
        const z = Math.sin(angle) * 0.97;
        return (
          <mesh key={idx} position={[x, -0.07, z]} rotation={[0, -angle, 0]}>
            <boxGeometry args={[0.012, 0.02, 0.015]} />
            <meshStandardMaterial color="#ffffff" roughness={0.3} />
          </mesh>
        );
      })}

      {/* 3. ANIMATED BOTTLE CAP (Spins and lifts) */}
      <group ref={capRef} position={[0, 0, 0]}>
        {/* Cap Top Face */}
        <mesh position={[0, 0.25, 0]}>
          <cylinderGeometry args={[1.0, 1.0, 0.05, 48]} />
          <meshPhysicalMaterial
            color="#ffffff"
            roughness={0.25}
            metalness={0.05}
            clearcoat={0.6}
            clearcoatRoughness={0.2}
          />
        </mesh>

        {/* Cap Main Skirt (Body) */}
        <mesh position={[0, 0.025, 0]}>
          <cylinderGeometry args={[0.98, 0.98, 0.4, 48, 1, true]} />
          <meshPhysicalMaterial
            color="#ffffff"
            roughness={0.25}
            metalness={0.05}
            clearcoat={0.6}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Inner ceiling to block line of sight inside */}
        <mesh position={[0, 0.21, 0]}>
          <cylinderGeometry args={[0.97, 0.97, 0.02, 32]} />
          <meshStandardMaterial color="#dcdcdc" roughness={0.4} />
        </mesh>

        {/* Outer Vertical Grip Ribs */}
        {ribs.map((rib, i) => (
          <mesh key={i} position={[rib.x, 0.025, rib.z]} rotation={[0, -rib.angle, 0]}>
            <boxGeometry args={[0.015, 0.4, 0.022]} />
            <meshStandardMaterial
              color="#ffffff"
              roughness={0.3}
              metalness={0.05}
            />
          </mesh>
        ))}

        {/* Broken Bridge Bits on the Cap base */}
        {Array.from({ length: 8 }).map((_, idx) => {
          const angle = (idx / 8) * Math.PI * 2 + 0.1; // slightly offset from ring bridges
          const x = Math.cos(angle) * 0.96;
          const z = Math.sin(angle) * 0.96;
          return (
            <mesh key={idx} position={[x, -0.185, z]} rotation={[0, -angle, 0]}>
              <boxGeometry args={[0.012, 0.015, 0.015]} />
              <meshStandardMaterial color="#ffffff" roughness={0.3} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}

export default function Hero3DCanvas() {
  return (
    <div className="w-full h-full min-h-[400px] lg:min-h-[550px] relative">
      <Canvas
        camera={{ position: [0, 0, 3.8], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.75} />
        
        {/* Soft, professional directional lights */}
        <directionalLight position={[5, 10, 5]} intensity={2.0} castShadow />
        <directionalLight position={[-5, 2, 2]} intensity={0.6} />
        <directionalLight position={[0, -5, -2]} intensity={0.4} />
        
        {/* Subtle color highlight accents to tie in the blue/green theme */}
        <pointLight position={[2, -2, -3]} color="#1097D5" intensity={1.5} />
        <pointLight position={[-3, 3, -2]} color="#82B91A" intensity={1.2} />

        {/* Animated Water Bottle Cap */}
        <AnimatedBottleCap />
        
        <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} />
      </Canvas>
      
      {/* Decorative radial gradients under the canvas */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/10 dark:to-slate-900/10 pointer-events-none -z-10" />
    </div>
  );
}
