'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { OrbitControls } from '@react-three/drei';

interface CapProps {
  color: string;
  position: [number, number, number];
  speed: { x: number; y: number; driftSpeed: number };
  scale: number;
}

function BottleCap({ color, position, speed, scale }: CapProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Rib geometry calculation (24 outer grip ribs)
  const ribs = useMemo(() => {
    const ribList = [];
    const count = 24;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const x = Math.cos(angle) * 0.99;
      const z = Math.sin(angle) * 0.99;
      ribList.push({ x, z, angle });
    }
    return ribList;
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const elapsed = state.clock.getElapsedTime();
    
    // Slow rotational spinning
    groupRef.current.rotation.x += speed.x;
    groupRef.current.rotation.y += speed.y;

    // Drifting float up/down
    groupRef.current.position.y = position[1] + Math.sin(elapsed * speed.driftSpeed) * 0.25;
  });

  return (
    <group ref={groupRef} position={position} scale={[scale, scale, scale]}>
      {/* Cap Top Face */}
      <mesh position={[0, 0.18, 0]}>
        <cylinderGeometry args={[1.0, 1.0, 0.05, 32]} />
        <meshPhysicalMaterial
          color={color}
          roughness={0.15}
          metalness={0.1}
          clearcoat={0.9}
          clearcoatRoughness={0.1}
        />
      </mesh>

      {/* Cap Main Skirt */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.98, 0.98, 0.3, 32, 1, true]} />
        <meshPhysicalMaterial
          color={color}
          roughness={0.15}
          metalness={0.1}
          clearcoat={0.9}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Vertical Ribs */}
      {ribs.map((rib, i) => (
        <mesh key={i} position={[rib.x, 0, rib.z]} rotation={[0, -rib.angle, 0]}>
          <boxGeometry args={[0.02, 0.3, 0.02]} />
          <meshStandardMaterial
            color={color}
            roughness={0.25}
            metalness={0.05}
          />
        </mesh>
      ))}
      
      {/* Dynamic Inner Cap Ring */}
      <mesh position={[0, -0.15, 0]}>
        <torusGeometry args={[0.95, 0.03, 8, 24]} />
        <meshStandardMaterial
          color={color}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>
    </group>
  );
}

export default function Hero3DCanvas() {
  const caps: CapProps[] = [
    {
      color: '#40A4D6', // Brand Blue
      position: [1.8, 0.8, -1],
      speed: { x: 0.002, y: 0.005, driftSpeed: 0.8 },
      scale: 1.1,
    },
    {
      color: '#6EC482', // Brand Green
      position: [-2.2, 0.5, -2],
      speed: { x: 0.004, y: 0.003, driftSpeed: 1.1 },
      scale: 0.9,
    },
    {
      color: '#70C5E8', // Light Blue Accent
      position: [0.5, -1.2, -0.5],
      speed: { x: 0.003, y: 0.004, driftSpeed: 0.9 },
      scale: 0.8,
    },
    {
      color: '#9CE0B0', // Light Green Accent
      position: [-0.8, 1.4, -2.5],
      speed: { x: 0.002, y: 0.006, driftSpeed: 0.7 },
      scale: 0.7,
    },
  ];

  return (
    <div className="w-full h-full min-h-[400px] lg:min-h-[550px] relative">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.7} />
        
        {/* Cinematic key-light */}
        <directionalLight position={[5, 8, 5]} intensity={1.8} castShadow />
        
        {/* Soft fill light */}
        <directionalLight position={[-5, -2, 2]} intensity={0.5} />
        
        {/* Colorful rim highlights */}
        <pointLight position={[2, -2, -3]} color="#40A4D6" intensity={1.5} />
        <pointLight position={[-3, 3, -2]} color="#6EC482" intensity={1.2} />

        {caps.map((cap, i) => (
          <BottleCap key={i} {...cap} />
        ))}
        
        <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} />
      </Canvas>
      {/* Decorative radial gradients under the canvas */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/10 dark:to-slate-900/10 pointer-events-none -z-10" />
    </div>
  );
}
